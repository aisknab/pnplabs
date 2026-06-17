import test from "node:test";
import assert from "node:assert/strict";
import { checkFixture } from "../../tools/reviewer-fixture-checker.mjs";

test("malformed fixture root rejects with schema reason", () => {
  const result = checkFixture(null);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "MALFORMED_PCCPACK");
});

test("unknown PCCPack version rejects before downstream checks", () => {
  const result = checkFixture({
    pccpack: {
      version: "unknown",
      packageId: "x",
      rows: [{ rowKey: "r" }],
      importGraphAcyclic: true,
      noDuplicateRowKeys: true
    }
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "MALFORMED_PCCPACK");
});
