import test from "node:test";
import assert from "node:assert/strict";
import { checkFile } from "../../tools/reviewer-fixture-checker.mjs";

const CASES = [
  ["examples/minimal/fail-invalid-locked-nand.json", "INVALID_LOCKED_NAND"],
  ["examples/minimal/fail-residual-slack-mismatch.json", "RESIDUAL_SLACK_MISMATCH"],
  ["examples/minimal/fail-hidden-minimization-attempt.json", "HIDDEN_MINIMIZATION_ATTEMPT"],
  ["examples/minimal/fail-mode-firewall-violation.json", "MODE_FIREWALL_VIOLATION"],
  ["examples/minimal/fail-malformed-pccpack.json", "MALFORMED_PCCPACK"],
  ["examples/minimal/fail-invalid-zeroslack.json", "INVALID_ZEROSLACK_CONDITION"],
  ["examples/minimal/fail-hash-mismatch.json", "HASH_MISMATCH"],
  ["examples/minimal/fail-certificate-parser-mismatch.json", "CERTIFICATE_PARSER_MISMATCH"]
];

test("passing minimal fixture accepts", () => {
  const result = checkFile("examples/minimal/pass-basic-all-invariants.json");
  assert.equal(result.accepted, true);
});

for (const [file, reason] of CASES) {
  test(`${file} rejects with ${reason}`, () => {
    const result = checkFile(file);
    assert.equal(result.accepted, false);
    assert.equal(result.reason, reason);
  });
}
