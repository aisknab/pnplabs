const MAX_TOTAL_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_BACKOFF_MS = 150;
const MAX_ENCODED_BODY_BYTES = 3_900;
const MAX_TITLE_CODE_POINTS = 160;

const inProcessDedupe = new Set();

function warn(logger, message) {
  if (logger && typeof logger.warn === "function") logger.warn(message);
}

function sleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function redactSensitiveText(value) {
  return value
    .replace(/\bhttps?:\/\/[^\s<>"']+/giu, "[redacted URL]")
    .replace(/(^|[\s(])\/(?:home|Users|root|srv|etc|var|run|tmp)\/[^\s)]*/gu, "$1[redacted path]")
    .replace(/\b[A-Z][A-Z0-9_]*(?:TOKEN|PASSWORD|SECRET|ENDPOINT|KEY)=[^\s]+/gu, "[redacted secret]");
}

export function sanitizeNotificationText(value, { title = false } = {}) {
  let text = String(value ?? "")
    .replace(/\r\n?/gu, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/gu, "")
    .replace(/\t/gu, " ");
  text = redactSensitiveText(text);
  if (title) text = text.replace(/\s*\n\s*/gu, " ");
  return text.trim();
}

function encodeBody(title, message) {
  return new URLSearchParams({ title, message }).toString();
}

export function buildUnifiedPushPayload({
  title,
  message,
  maxEncodedBytes = MAX_ENCODED_BODY_BYTES
}) {
  if (!Number.isInteger(maxEncodedBytes) || maxEncodedBytes < 256 || maxEncodedBytes > MAX_ENCODED_BODY_BYTES) {
    throw new Error(`UnifiedPush payload limit must be an integer between 256 and ${MAX_ENCODED_BODY_BYTES}`);
  }

  const cleanTitle = sanitizeNotificationText(title, { title: true }) || "PNP Labs update";
  const titlePoints = Array.from(cleanTitle);
  const boundedTitle = titlePoints.slice(0, MAX_TITLE_CODE_POINTS).join("");
  const cleanMessage = sanitizeNotificationText(message);
  let body = encodeBody(boundedTitle, cleanMessage);
  let finalMessage = cleanMessage;
  let truncated = titlePoints.length > MAX_TITLE_CODE_POINTS;

  if (Buffer.byteLength(body, "utf8") > maxEncodedBytes) {
    const points = Array.from(cleanMessage);
    let low = 0;
    let high = points.length;
    let best = "";
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const candidate = `${points.slice(0, middle).join("")}…`;
      const candidateBody = encodeBody(boundedTitle, candidate);
      if (Buffer.byteLength(candidateBody, "utf8") <= maxEncodedBytes) {
        best = candidate;
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    finalMessage = best;
    body = encodeBody(boundedTitle, finalMessage);
    truncated = true;
  }

  const byteLength = Buffer.byteLength(body, "utf8");
  if (byteLength > maxEncodedBytes) {
    throw new Error("UnifiedPush payload cannot be represented within the configured byte limit");
  }

  return {
    title: boundedTitle,
    message: finalMessage,
    body,
    byteLength,
    truncated
  };
}

export function resolveUnifiedPushEndpoint(environment = process.env) {
  const endpoint = environment?.UNIFIEDPUSH_ENDPOINT;
  return typeof endpoint === "string" ? endpoint : "";
}

export function validateUnifiedPushEndpoint(endpoint) {
  if (typeof endpoint !== "string" || endpoint === "" || endpoint !== endpoint.trim()) {
    throw new Error("UNIFIEDPUSH_ENDPOINT is invalid");
  }
  let parsed;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new Error("UNIFIEDPUSH_ENDPOINT is invalid");
  }
  if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password || parsed.hash) {
    throw new Error("UNIFIEDPUSH_ENDPOINT is invalid");
  }
  return endpoint;
}

function retryDelay(attempt, backoffMs, random) {
  const jitter = Math.floor(Math.max(0, Math.min(0.999999, Number(random()))) * backoffMs);
  return (backoffMs * (2 ** (attempt - 1))) + jitter;
}

export async function sendUnifiedPushNotification({
  endpoint,
  environment = process.env,
  title,
  message,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxAttempts = MAX_TOTAL_ATTEMPTS,
  backoffMs = DEFAULT_BACKOFF_MS,
  sleepImpl = sleep,
  random = Math.random,
  logger = console,
  dedupeKey = null
} = {}) {
  const configuredEndpoint = endpoint ?? resolveUnifiedPushEndpoint(environment);
  if (!configuredEndpoint) {
    warn(logger, "UnifiedPush notification skipped: UNIFIEDPUSH_ENDPOINT is not configured.");
    return { status: "skipped", reason: "missing_endpoint", attempts: 0 };
  }

  let destination;
  try {
    destination = validateUnifiedPushEndpoint(configuredEndpoint);
  } catch {
    warn(logger, "UnifiedPush notification failed: UNIFIEDPUSH_ENDPOINT is invalid.");
    return { status: "failed", reason: "invalid_endpoint", attempts: 0 };
  }

  if (typeof fetchImpl !== "function") {
    warn(logger, "UnifiedPush notification failed: no fetch implementation is available.");
    return { status: "failed", reason: "missing_fetch", attempts: 0 };
  }

  const payload = buildUnifiedPushPayload({ title, message });
  const boundedAttempts = Math.max(1, Math.min(MAX_TOTAL_ATTEMPTS, Number(maxAttempts) || 1));
  const key = dedupeKey === null ? null : String(dedupeKey);
  if (key && inProcessDedupe.has(key)) {
    return { status: "skipped", reason: "duplicate", attempts: 0 };
  }

  for (let attempt = 1; attempt <= boundedAttempts; attempt += 1) {
    let response;
    try {
      response = await fetchImpl(destination, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Content-Encoding": "aes128gcm",
          Accept: "application/json"
        },
        body: payload.body,
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch {
      if (attempt < boundedAttempts) {
        await sleepImpl(retryDelay(attempt, backoffMs, random));
        continue;
      }
      warn(logger, `UnifiedPush notification failed after ${attempt} attempts: network or timeout error.`);
      return { status: "failed", reason: "network_or_timeout", attempts: attempt };
    }

    const httpStatus = Number(response?.status);
    if (httpStatus >= 200 && httpStatus < 300) {
      if (key) inProcessDedupe.add(key);
      return {
        status: "sent",
        httpStatus,
        attempts: attempt,
        payloadBytes: payload.byteLength,
        truncated: payload.truncated
      };
    }

    if (httpStatus === 404) {
      warn(logger, "UnifiedPush notification failed: HTTP 404 indicates an invalid, expired, deleted, or unregistered endpoint.");
      return { status: "failed", reason: "invalid_or_expired_endpoint", httpStatus, attempts: attempt };
    }

    const retryable = httpStatus === 429 || (httpStatus >= 500 && httpStatus <= 599);
    if (retryable && attempt < boundedAttempts) {
      await sleepImpl(retryDelay(attempt, backoffMs, random));
      continue;
    }

    if (Number.isInteger(httpStatus)) {
      warn(logger, `UnifiedPush notification failed with HTTP ${httpStatus}.`);
      return { status: "failed", reason: retryable ? "retry_exhausted" : "non_retryable_http", httpStatus, attempts: attempt };
    }

    warn(logger, "UnifiedPush notification failed: the receiver returned an invalid HTTP response.");
    return { status: "failed", reason: "invalid_response", attempts: attempt };
  }

  return { status: "failed", reason: "retry_exhausted", attempts: boundedAttempts };
}

export function resetUnifiedPushDedupeForTests() {
  inProcessDedupe.clear();
}

export const UNIFIEDPUSH_LIMITS = Object.freeze({
  maxTotalAttempts: MAX_TOTAL_ATTEMPTS,
  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
  maxEncodedBodyBytes: MAX_ENCODED_BODY_BYTES
});
