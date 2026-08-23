import assert from "node:assert/strict";
import test from "node:test";

import {
  buildUnifiedPushPayload,
  resetUnifiedPushDedupeForTests,
  sanitizeNotificationText,
  sendUnifiedPushNotification,
  UNIFIEDPUSH_LIMITS,
  validateUnifiedPushEndpoint
} from "../../tools/unifiedpush-notification.mjs";

const endpoint = "https://push.example.invalid/receiver/capability-fragment";

function response(status) {
  return { status };
}

function loggerCapture() {
  const messages = [];
  return {
    messages,
    logger: { warn: (message) => messages.push(String(message)) }
  };
}

test("UnifiedPush uses the exact configured endpoint and URL-encoded POST contract", async () => {
  const requests = [];
  const title = "Spaces & equals= π";
  const message = "Line one\nLine two & x=y 👋";
  const result = await sendUnifiedPushNotification({
    environment: { UNIFIEDPUSH_ENDPOINT: endpoint },
    title,
    message,
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return response(201);
    }
  });

  assert.equal(result.status, "sent");
  assert.equal(result.httpStatus, 201);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, endpoint);
  assert.equal(requests[0].options.method, "POST");
  assert.deepEqual(requests[0].options.headers, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Content-Encoding": "aes128gcm",
    Accept: "application/json"
  });
  assert.ok(requests[0].options.signal instanceof AbortSignal);
  const decoded = new URLSearchParams(requests[0].options.body);
  assert.deepEqual([...decoded.keys()], ["title", "message"]);
  assert.equal(decoded.get("title"), title);
  assert.equal(decoded.get("message"), message);
  assert.equal(requests[0].options.headers.Title, undefined);
  assert.equal(requests[0].options.headers.Tags, undefined);
  assert.equal(requests[0].options.headers.Priority, undefined);
  assert.doesNotMatch(requests[0].options.body, /^\s*\{/u);
});

test("every 2xx response is successful", async () => {
  for (const status of [200, 201, 202, 204, 299]) {
    const result = await sendUnifiedPushNotification({
      endpoint,
      title: "PNP Labs test",
      message: "Success response",
      fetchImpl: async () => response(status)
    });
    assert.equal(result.status, "sent");
    assert.equal(result.httpStatus, status);
  }
});

test("HTTP 404 is a redacted non-retryable invalid-endpoint failure", async () => {
  const capture = loggerCapture();
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    title: "PNP Labs test",
    message: "Invalid endpoint response",
    fetchImpl: async () => {
      calls += 1;
      return response(404);
    },
    logger: capture.logger,
    sleepImpl: async () => assert.fail("404 must not retry")
  });

  assert.equal(result.status, "failed");
  assert.equal(result.reason, "invalid_or_expired_endpoint");
  assert.equal(calls, 1);
  assert.match(capture.messages.join("\n"), /invalid, expired, deleted, or unregistered endpoint/u);
  assert.doesNotMatch(capture.messages.join("\n"), /capability-fragment/u);
  assert.doesNotMatch(capture.messages.join("\n"), /push\.example/u);
});

test("HTTP 429 and 5xx responses retry at most three total attempts", async () => {
  const statuses = [429, 503, 201];
  const delays = [];
  const result = await sendUnifiedPushNotification({
    endpoint,
    title: "PNP Labs test",
    message: "Retry response",
    maxAttempts: 99,
    random: () => 0.5,
    sleepImpl: async (delay) => delays.push(delay),
    fetchImpl: async () => response(statuses.shift())
  });

  assert.equal(result.status, "sent");
  assert.equal(result.attempts, 3);
  assert.deepEqual(delays, [225, 375]);
});

test("network and timeout failures receive bounded retries without leaking errors", async () => {
  const capture = loggerCapture();
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    title: "PNP Labs test",
    message: "Timeout response",
    random: () => 0,
    sleepImpl: async () => {},
    logger: capture.logger,
    fetchImpl: async () => {
      calls += 1;
      const error = new Error(`request to ${endpoint} timed out`);
      error.name = "AbortError";
      throw error;
    }
  });

  assert.equal(result.status, "failed");
  assert.equal(result.reason, "network_or_timeout");
  assert.equal(calls, UNIFIEDPUSH_LIMITS.maxTotalAttempts);
  assert.doesNotMatch(capture.messages.join("\n"), /capability-fragment|push\.example/u);
});

test("ordinary 4xx responses do not retry and do not throw", async () => {
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    title: "PNP Labs test",
    message: "Bad request response",
    logger: { warn() {} },
    fetchImpl: async () => {
      calls += 1;
      return response(400);
    }
  });
  assert.equal(result.status, "failed");
  assert.equal(result.reason, "non_retryable_http");
  assert.equal(calls, 1);
});

test("a missing endpoint skips safely without calling fetch", async () => {
  const capture = loggerCapture();
  const result = await sendUnifiedPushNotification({
    environment: {},
    title: "PNP Labs test",
    message: "Missing endpoint",
    logger: capture.logger,
    fetchImpl: async () => assert.fail("missing configuration must not call fetch")
  });
  assert.deepEqual(result, { status: "skipped", reason: "missing_endpoint", attempts: 0 });
  assert.deepEqual(capture.messages, ["UnifiedPush notification skipped: UNIFIEDPUSH_ENDPOINT is not configured."]);
});

test("oversized messages are sanitised and truncated below the encoded-body limit", () => {
  const payload = buildUnifiedPushPayload({
    title: "PNP Labs status\nwith controls\u0000",
    message: `${"Formal progress 👋 & value=checked\n".repeat(400)} https://secret.example.invalid/capability`
  });
  assert.equal(payload.truncated, true);
  assert.ok(payload.byteLength <= UNIFIEDPUSH_LIMITS.maxEncodedBodyBytes);
  assert.equal(Buffer.byteLength(payload.body, "utf8"), payload.byteLength);
  const decoded = new URLSearchParams(payload.body);
  assert.equal(decoded.get("title"), "PNP Labs status with controls");
  assert.match(decoded.get("message"), /…$/u);
  assert.doesNotMatch(decoded.get("message"), /secret\.example|capability/u);
});

test("sanitisation removes controls and redacts URLs, private paths, and secret assignments", () => {
  const cleaned = sanitizeNotificationText(
    "ok\u0000\u0007 https://example.invalid/private /home/example/private SECRET_TOKEN=value\nnext"
  );
  assert.equal(cleaned, "ok [redacted URL] [redacted path] [redacted secret]\nnext");
});

test("endpoint validation does not modify the configured path", () => {
  const exact = "https://push.example.invalid/a%2Fb/case_Sensitive?key=value";
  assert.equal(validateUnifiedPushEndpoint(exact), exact);
  for (const invalid of ["", " http://push.example.invalid/path", "http://push.example.invalid/path", "not a URL"] ) {
    assert.throws(() => validateUnifiedPushEndpoint(invalid), /UNIFIEDPUSH_ENDPOINT is invalid/u);
  }
});

test("an in-process dedupe key suppresses duplicate workflow sends", async () => {
  resetUnifiedPushDedupeForTests();
  let calls = 0;
  const options = {
    endpoint,
    title: "PNP Labs milestone earned",
    message: "One milestone transition",
    dedupeKey: "milestone:example",
    fetchImpl: async () => {
      calls += 1;
      return response(201);
    }
  };
  assert.equal((await sendUnifiedPushNotification(options)).status, "sent");
  assert.deepEqual(await sendUnifiedPushNotification(options), {
    status: "skipped",
    reason: "duplicate",
    attempts: 0
  });
  assert.equal(calls, 1);
});
