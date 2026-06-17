import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

// Purpose: validate tiny reviewer fixtures that illustrate audit invariants.
// Inputs: examples/minimal/*.json, not theorem artefacts from the source checker.
// Outputs: ACCEPT or a named REJECT reason for CI and documentation examples.
// Invariants enforced: NAND truth shape, residual-slack arithmetic, no hidden
// minimization tokens, mode-firewall discipline, ZeroSlack closure, hash identity,
// and source/certificate parser linkage.
// Assumptions not checked: the mathematical proof, PCC-K soundness, generated
// package completeness, and the real CheckPCCPackexp0 implementation.
// Failure modes: malformed JSON, unsupported fixture schema, or a named reject.
const FORBIDDEN_EXECUTABLE_SYMBOLS = [
  /\bminimumEquivalent\b/,
  /\boptimalCircuit\b/,
  /\bexactMinSearch\b/,
  /\bcanonicalMinimizer\b/,
  /\bmaximizeGain\b/,
  /\bargmin\b/,
  /\bmuStar\b/,
  /\bmuHash\b/,
  /\bminimize\s*\(/,
  /\bsearchMinimum\s*\(/
];

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function reject(reason, message) {
  return { accepted: false, reason, message };
}

function assertObject(value, reason, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return reject(reason, message);
  }
  return null;
}

function checkPccpack(fixture) {
  const malformed = assertObject(
    fixture.pccpack,
    "MALFORMED_PCCPACK",
    "PCCPack fixture must be an object with version, rows, and ledgers"
  );
  if (malformed) return malformed;

  const pack = fixture.pccpack;
  if (pack.version !== "review-fixture-v1") {
    return reject("MALFORMED_PCCPACK", "unsupported PCCPack fixture version");
  }
  if (typeof pack.packageId !== "string" || pack.packageId.length === 0) {
    return reject("MALFORMED_PCCPACK", "missing packageId");
  }
  if (!Array.isArray(pack.rows) || pack.rows.length === 0) {
    return reject("MALFORMED_PCCPACK", "PCCPack rows must be a nonempty array");
  }
  if (pack.importGraphAcyclic !== true) {
    return reject("MALFORMED_PCCPACK", "import graph must be marked acyclic");
  }
  if (pack.noDuplicateRowKeys !== true) {
    return reject("MALFORMED_PCCPACK", "duplicate row-key ledger must pass");
  }

  return null;
}

function checkLockedNand(fixture) {
  const malformed = assertObject(
    fixture.lockedNand,
    "INVALID_LOCKED_NAND",
    "locked NAND fixture must be an object"
  );
  if (malformed) return malformed;

  const nand = fixture.lockedNand;
  if (nand.gate !== "NAND" || nand.truthTableBinary !== "1110") {
    return reject(
      "INVALID_LOCKED_NAND",
      "locked NAND truth table must be NAND in row order 00, 01, 10, 11"
    );
  }
  if (!Array.isArray(nand.lockInputs) || nand.lockInputs.length === 0) {
    return reject("INVALID_LOCKED_NAND", "locked NAND fixture must expose a lock input");
  }
  if (nand.slotsDisjoint !== true || nand.macroOutputsDistinct !== true) {
    return reject(
      "INVALID_LOCKED_NAND",
      "locked NAND slots and macro outputs must be disjoint and distinct"
    );
  }

  return null;
}

function checkResidualSlack(fixture) {
  const circuit = fixture.circuit || {};
  const cert = fixture.certificate || {};
  const size = circuit.size;
  const minimumSize = cert.minimumSize;
  const residualSlack = cert.residualSlack;
  const residualSlackLimit = cert.residualSlackLimit;

  if (
    !Number.isInteger(size) ||
    !Number.isInteger(minimumSize) ||
    !Number.isInteger(residualSlack) ||
    size < 0 ||
    minimumSize < 0 ||
    size < minimumSize ||
    residualSlack !== size - minimumSize ||
    residualSlack > residualSlackLimit
  ) {
    return reject(
      "RESIDUAL_SLACK_MISMATCH",
      "residual slack must equal circuit.size - certificate.minimumSize and stay within the stated bound"
    );
  }

  return null;
}

function checkNoHiddenMinimization(fixture) {
  for (const row of fixture.pccpack.executableRows || []) {
    const code = String(row.code || "");
    const forbidden = FORBIDDEN_EXECUTABLE_SYMBOLS.find((pattern) => pattern.test(code));
    if (forbidden) {
      return reject(
        "HIDDEN_MINIMIZATION_ATTEMPT",
        `executable row ${row.id || "<unknown>"} contains forbidden minimization syntax`
      );
    }
  }

  return null;
}

function checkModeFirewall(fixture) {
  const modeUse = fixture.modeUse || {};
  if (modeUse.quotientEqualityUsedAsFullReplacement === true) {
    return reject(
      "MODE_FIREWALL_VIOLATION",
      "quotient equality cannot be consumed as a constructive full-mode replacement"
    );
  }
  if (modeUse.fullLiftRequired !== true || modeUse.openObligations !== 0) {
    return reject(
      "MODE_FIREWALL_VIOLATION",
      "full-mode use requires a checked full lift and zero open obligations"
    );
  }

  return null;
}

function checkZeroSlack(fixture) {
  const cert = fixture.certificate || {};
  const zeroSlack = cert.zeroSlack || {};
  if (cert.residualSlack === 0) {
    if (zeroSlack.status !== "closed" || zeroSlack.positiveResidualWitness !== false) {
      return reject(
        "INVALID_ZEROSLACK_CONDITION",
        "zero residual slack must close ZeroSlack and leave no positive residual witness"
      );
    }
  }

  return null;
}

function checkSeal(fixture) {
  const seal = fixture.seal || {};
  if (typeof seal.payloadText !== "string" || typeof seal.sha256 !== "string") {
    return reject("HASH_MISMATCH", "seal must include payloadText and sha256");
  }
  const actual = sha256(seal.payloadText);
  if (actual !== seal.sha256.toLowerCase()) {
    return reject("HASH_MISMATCH", "seal SHA-256 does not match payload text");
  }

  return null;
}

function checkCertificateParserLink(fixture) {
  const cert = fixture.certificate || {};
  if (typeof fixture.sourceText !== "string" || typeof cert.parsedSourceSha256 !== "string") {
    return reject(
      "CERTIFICATE_PARSER_MISMATCH",
      "fixture must include sourceText and certificate.parsedSourceSha256"
    );
  }
  const actual = sha256(fixture.sourceText);
  if (actual !== cert.parsedSourceSha256.toLowerCase()) {
    return reject(
      "CERTIFICATE_PARSER_MISMATCH",
      "certificate parser digest does not match the human-readable source text"
    );
  }

  return null;
}

export function checkFixture(fixture) {
  const malformed = assertObject(
    fixture,
    "MALFORMED_PCCPACK",
    "fixture root must be a JSON object"
  );
  if (malformed) return malformed;

  for (const check of [
    checkPccpack,
    checkLockedNand,
    checkResidualSlack,
    checkNoHiddenMinimization,
    checkModeFirewall,
    checkZeroSlack,
    checkSeal,
    checkCertificateParserLink
  ]) {
    const result = check(fixture);
    if (result) return result;
  }

  return { accepted: true, name: fixture.name || "<unnamed>" };
}

export function checkFile(filePath) {
  let fixture;
  try {
    fixture = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    return reject(
      "MALFORMED_PCCPACK",
      error instanceof SyntaxError ? "fixture JSON is malformed" : String(error)
    );
  }
  return checkFixture(fixture);
}

function printUsage() {
  console.error("Usage: node tools/reviewer-fixture-checker.mjs [--expect accept|reject] [--reason CODE] <fixture.json>");
}

function main() {
  const args = process.argv.slice(2);
  let expected = null;
  let expectedReason = null;
  const paths = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--expect") {
      expected = args[index + 1];
      index += 1;
    } else if (arg === "--reason") {
      expectedReason = args[index + 1];
      index += 1;
    } else {
      paths.push(arg);
    }
  }

  if (paths.length !== 1 || (expected && !["accept", "reject"].includes(expected))) {
    printUsage();
    process.exit(2);
  }

  const result = checkFile(paths[0]);
  if (result.accepted) {
    console.log(`ACCEPT ${result.name}`);
  } else {
    console.log(`REJECT ${result.reason} ${result.message}`);
  }

  if (expected === "accept") {
    process.exit(result.accepted ? 0 : 1);
  }
  if (expected === "reject") {
    process.exit(!result.accepted && (!expectedReason || result.reason === expectedReason) ? 0 : 1);
  }

  process.exit(result.accepted ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
