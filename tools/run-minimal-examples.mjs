import { readdirSync } from "node:fs";
import path from "node:path";
import { checkFile } from "./reviewer-fixture-checker.mjs";

// Purpose: run every minimal reviewer fixture and ensure pass/fail intent is
// stable for documentation and CI.
// Inputs: examples/minimal/*.json.
// Outputs: one ok line per fixture and a checked count.
// Invariants enforced: files prefixed pass- accept, files prefixed fail- reject.
// Assumptions not checked: these examples are pedagogical and not proof evidence.
// Failure modes: missing fixtures, unexpected accept, or unexpected reject.
const exampleDir = "examples/minimal";
let checked = 0;

for (const name of readdirSync(exampleDir).filter((file) => file.endsWith(".json")).sort()) {
  const filePath = path.join(exampleDir, name);
  const result = checkFile(filePath);
  const shouldAccept = name.startsWith("pass-");

  if (shouldAccept && !result.accepted) {
    throw new Error(`${filePath}: expected accept, got ${result.reason}`);
  }
  if (!shouldAccept && result.accepted) {
    throw new Error(`${filePath}: expected reject, got accept`);
  }

  checked += 1;
  console.log(
    result.accepted
      ? `ok ${filePath} ACCEPT`
      : `ok ${filePath} REJECT ${result.reason}`
  );
}

if (checked === 0) {
  throw new Error("no minimal examples found");
}

console.log(`checked ${checked} minimal reviewer fixtures`);
