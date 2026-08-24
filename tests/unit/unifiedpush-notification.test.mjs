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

test("UnifiedPush uses the exact configured endpoint and raw text POST contract", async () => {
  const requests = [];
  const notification = "Spaces & equals= π\nLine two 👋";
  const result = await sendUnifiedPushNotification({
    environment: { UNIFIEDPUSH_ENDPOINT: endpoint },
    text: notification,
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
    "Content-Type": "text/plain; charset=utf-8"
  });
  assert.ok(requests[0].options.signal instanceof AbortSignal);
  assert.equal(requests[0].options.body, notification);
  assert.doesNotMatch(requests[0].options.body, /(?:^|&)title=|(?:^|&)message=/u);
  assert.equal(requests[0].options.headers["Content-Encoding"], undefined);
  assert.equal(requests[0].options.headers.Accept, undefined);
  assert.equal(requests[0].options.headers.Title, undefined);
  assert.equal(requests[0].options.headers.Tags, undefined);
  assert.equal(requests[0].options.headers.Priority, undefined);
});

test("only HTTP 201 is successful", async () => {
  for (const status of [200, 202, 204, 299]) {
    const result = await sendUnifiedPushNotification({
      endpoint,
      text: "PNP Labs test",
      logger: { warn() {} },
      fetchImpl: async () => response(status)
    });
    assert.equal(result.status, "failed");
    assert.equal(result.reason, "unexpected_http_status");
    assert.equal(result.httpStatus, status);
  }
});

test("HTTP 404 is a redacted non-retryable invalid-endpoint failure", async () => {
  const capture = loggerCapture();
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    text: "Invalid endpoint response",
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

test("HTTP 429 and 5xx responses receive one bounded retry", async () => {
  for (const transientStatus of [429, 503]) {
    const statuses = [transientStatus, 201];
    const delays = [];
    const result = await sendUnifiedPushNotification({
      endpoint,
      text: "Retry response",
      maxAttempts: 99,
      random: () => 0.5,
      sleepImpl: async (delay) => delays.push(delay),
      fetchImpl: async () => response(statuses.shift())
    });

    assert.equal(result.status, "sent");
    assert.equal(result.attempts, 2);
    assert.deepEqual(delays, [225]);
  }
});

test("network and timeout failures receive one retry without leaking errors", async () => {
  const capture = loggerCapture();
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    text: "Timeout response",
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
  assert.equal(calls, 2);
  assert.doesNotMatch(capture.messages.join("\n"), /capability-fragment|push\.example/u);
});

test("ordinary 4xx responses do not retry", async () => {
  let calls = 0;
  const result = await sendUnifiedPushNotification({
    endpoint,
    text: "Bad request response",
    logger: { warn() {} },
    fetchImpl: async () => {
      calls += 1;
      return response(400);
    }
  });
  assert.equal(result.status, "failed");
  assert.equal(result.reason, "unexpected_http_status");
  assert.equal(result.httpStatus, 400);
  assert.equal(calls, 1);
});

test("a missing endpoint skips safely without calling fetch", async () => {
  const capture = loggerCapture();
  const result = await sendUnifiedPushNotification({
    environment: {},
    text: "Missing endpoint",
    logger: capture.logger,
    fetchImpl: async () => assert.fail("missing configuration must not call fetch")
  });
  assert.deepEqual(result, { status: "skipped", reason: "missing_endpoint", attempts: 0 });
  assert.deepEqual(capture.messages, ["UnifiedPush notification skipped: UNIFIEDPUSH_ENDPOINT is not configured."]);
});

test("oversized messages are sanitised and truncated below the raw-body limit", () => {
  const payload = buildUnifiedPushPayload({
    text: `${"Formal progress 👋 & value=checked\n".repeat(400)} https://secret.example.invalid/capability`
  });
  assert.equal(payload.truncated, true);
  assert.ok(payload.byteLength <= UNIFIEDPUSH_LIMITS.maxBodyBytes);
  assert.equal(Buffer.byteLength(payload.body, "utf8"), payload.byteLength);
  assert.match(payload.body, /…$/u);
  assert.doesNotMatch(payload.body, /secret\.example|capability/u);
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
    text: "PNP Labs milestone earned\nOne milestone transition",
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
