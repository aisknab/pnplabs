import assert from "node:assert/strict";
import test from "node:test";

import {
  assertCheckoutIdentity,
  buildNotification,
  validateTopic
} from "../../tools/notify-deployment-ready.mjs";

const commit = "a".repeat(40);
const tree = "b".repeat(40);

test("ntfy topic validation accepts only a bounded path-safe topic", () => {
  assert.equal(validateTopic("pnplabsisready"), "pnplabsisready");
  for (const topic of [undefined, "", "with/slash", "with space", "a".repeat(129)]) {
    assert.throws(() => validateTopic(topic), /PNPLABS_NTFY_TOPIC/u);
  }
});

test("deployment notification is pinned to a clean origin/main checkout", () => {
  assert.deepEqual(
    assertCheckoutIdentity({ expectedCommit: commit, head: commit, originMain: commit, tree, status: "" }),
    { commit, tree }
  );
  assert.throws(
    () => assertCheckoutIdentity({ expectedCommit: commit, head: commit, originMain: commit, tree, status: " M index.html" }),
    /clean worktree/u
  );
  assert.throws(
    () => assertCheckoutIdentity({ expectedCommit: commit, head: "c".repeat(40), originMain: commit, tree, status: "" }),
    /HEAD .* does not match/u
  );
  assert.throws(
    () => assertCheckoutIdentity({ expectedCommit: commit, head: commit, originMain: "c".repeat(40), tree, status: "" }),
    /origin\/main .* does not match/u
  );
  assert.throws(
    () => assertCheckoutIdentity({ expectedCommit: "short", head: commit, originMain: commit, tree, status: "" }),
    /40-hex/u
  );
});

test("deployment notification contains the exact pinned command and no credentials", () => {
  const notification = buildNotification({ commit, tree });
  assert.equal(notification.title, "PNPLabs deployment ready");
  assert.equal(notification.deployCommand, `sudo env PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp`);
  assert.match(notification.body, new RegExp(`Commit: ${commit}`, "u"));
  assert.match(notification.body, new RegExp(`Tree: ${tree}`, "u"));
  assert.match(notification.body, new RegExp(notification.deployCommand, "u"));
  assert.doesNotMatch(notification.body, /password|passphrase|private key|token/iu);
  assert.equal(notification.body.includes("\u2014"), false);
});
