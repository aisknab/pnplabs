#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { checkBrowserReportIntegrity } from "./check-browser-report-integrity.mjs";
import { sendUnifiedPushNotification } from "./unifiedpush-notification.mjs";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;

function fail(message) {
  throw new Error(message);
}

function validateSha(value, label) {
  if (typeof value !== "string" || !SHA_PATTERN.test(value)) {
    fail(`${label} must be a lowercase 40-hex Git object ID`);
  }
  return value;
}

export function assertCheckoutIdentity({ expectedCommit, head, originMain, tree, status }) {
  validateSha(expectedCommit, "expected commit");
  validateSha(head, "HEAD");
  validateSha(originMain, "origin/main");
  validateSha(tree, "tree");
  if (status !== "") fail("deployment-ready notification requires a clean worktree");
  if (head !== expectedCommit) fail(`HEAD ${head} does not match expected commit ${expectedCommit}`);
  if (originMain !== expectedCommit) fail(`origin/main ${originMain} does not match expected commit ${expectedCommit}`);
  return { commit: head, tree };
}

export function readProgressSummary(root) {
  const source = JSON.parse(readFileSync(path.join(root, "public", "pnp-proof-progress.json"), "utf8"));
  const proofPercent = source?.proofCompletion?.percent;
  const earnedRows = source?.formalArtefactCoverage?.earnedRows;
  const totalRows = source?.formalArtefactCoverage?.totalRows;
  const gates = source?.globalGates;
  const history = source?.history;
  if (!Number.isInteger(proofPercent) || proofPercent < 0 || proofPercent > 100) {
    fail("canonical proof progress has an invalid risk-weighted estimate");
  }
  if (!Number.isInteger(earnedRows) || !Number.isInteger(totalRows) || earnedRows < 0 || earnedRows > totalRows) {
    fail("canonical proof progress has invalid formal artefact coverage");
  }
  if (!Array.isArray(gates) || gates.some((gate) => !["open", "closed"].includes(gate?.status))) {
    fail("canonical proof progress has invalid global gate states");
  }
  if (!Array.isArray(history) || history.length === 0
      || history.at(-1)?.riskWeightedProofCompletionPercent !== proofPercent) {
    fail("canonical proof progress history does not end at the current estimate");
  }
  const previousProofPercent = history.at(-2)?.riskWeightedProofCompletionPercent ?? proofPercent;
  if (!Number.isInteger(previousProofPercent) || previousProofPercent < 0 || previousProofPercent > 100) {
    fail("canonical proof progress history has an invalid previous estimate");
  }
  return {
    proofPercent,
    previousProofPercent,
    scoreChanged: previousProofPercent !== proofPercent,
    earnedRows,
    totalRows,
    closedGates: gates.filter((gate) => gate.status === "closed").length,
    totalGates: gates.length
  };
}

export function buildNotification({ commit, tree, progress }) {
  validateSha(commit, "commit");
  validateSha(tree, "tree");
  if (!progress || !Number.isInteger(progress.proofPercent) || !Number.isInteger(progress.earnedRows)
      || !Number.isInteger(progress.totalRows) || !Number.isInteger(progress.closedGates)
      || !Number.isInteger(progress.totalGates) || !Number.isInteger(progress.previousProofPercent)
      || typeof progress.scoreChanged !== "boolean") {
    fail("deployment notification requires canonical progress fields");
  }
  const proofLine = progress.scoreChanged
    ? `Proof estimate: ${progress.previousProofPercent}% → ${progress.proofPercent}%.`
    : `Proof estimate: ${progress.proofPercent}%, unchanged.`;
  const deployCommand = `sudo -n /usr/bin/env -i PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp`;
  return {
    title: "PNPLabs deployment ready",
    message: [
      "PNPLabs has passed its release checks and is ready for your pinned deployment.",
      proofLine,
      `Formal artefact coverage: ${progress.earnedRows}/${progress.totalRows}.`,
      `Global gates: ${progress.closedGates}/${progress.totalGates} closed.`,
      `Commit: ${commit}`,
      `Tree: ${tree}`,
      "Pinned deployment command:",
      deployCommand
    ].join("\n"),
    deployCommand
  };
}

function git(root, args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) fail(result.stderr.trim() || `git ${args.join(" ")} failed`);
  return result.stdout.trim();
}

function parseArguments(argv) {
  let expectedCommit = null;
  let dryRun = false;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--commit") expectedCommit = argv[++index] ?? null;
    else if (argv[index] === "--dry-run") dryRun = true;
    else fail("usage: node tools/notify-deployment-ready.mjs --commit <40-hex> [--dry-run]");
  }
  if (!expectedCommit) fail("usage: node tools/notify-deployment-ready.mjs --commit <40-hex> [--dry-run]");
  return { expectedCommit, dryRun };
}

async function main() {
  const { expectedCommit, dryRun } = parseArguments(process.argv.slice(2));
  const root = path.resolve(process.cwd());
  const identity = assertCheckoutIdentity({
    expectedCommit,
    head: git(root, ["rev-parse", "HEAD"]),
    originMain: git(root, ["rev-parse", "refs/remotes/origin/main"]),
    tree: git(root, ["rev-parse", "HEAD^{tree}"]),
    status: git(root, ["status", "--porcelain"])
  });
  verifyReleaseSeal({ root });
  checkBrowserReportIntegrity({ root });
  const progress = readProgressSummary(root);
  const notification = buildNotification({ ...identity, progress });
  if (dryRun) {
    console.log(notification.message);
    return;
  }
  const result = await sendUnifiedPushNotification({
    title: notification.title,
    message: notification.message,
    dedupeKey: `deployment-ready:${identity.commit}:${identity.tree}`
  });
  if (result.status === "sent") {
    console.log(`deployment-ready UnifiedPush notification sent for ${identity.commit} tree ${identity.tree} HTTP ${result.httpStatus}`);
  } else {
    console.log(`deployment-ready UnifiedPush notification not sent for ${identity.commit} tree ${identity.tree}: ${result.reason}`);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "deployment-ready notification failed");
    process.exitCode = 1;
  });
}
