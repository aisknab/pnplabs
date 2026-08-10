#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { checkBrowserReportIntegrity } from "./check-browser-report-integrity.mjs";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;
const TOPIC_PATTERN = /^[A-Za-z0-9_-]{1,128}$/u;

function fail(message) {
  throw new Error(message);
}

export function validateTopic(topic) {
  if (typeof topic !== "string" || !TOPIC_PATTERN.test(topic)) {
    fail("PNPLABS_NTFY_TOPIC must contain 1 to 128 letters, digits, underscores, or hyphens");
  }
  return topic;
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

export function buildNotification({ commit, tree }) {
  validateSha(commit, "commit");
  validateSha(tree, "tree");
  const deployCommand = `sudo -n /usr/bin/env -i PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp`;
  return {
    title: "PNPLabs deployment ready",
    priority: "high",
    tags: "white_check_mark,rocket",
    body: [
      "PNPLabs has passed its release checks and is ready for your pinned deployment.",
      `Commit: ${commit}`,
      `Tree: ${tree}`,
      "Run on atlast:",
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
  const topic = validateTopic(process.env.PNPLABS_NTFY_TOPIC);
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
  const notification = buildNotification(identity);
  if (dryRun) {
    console.log(notification.body);
    return;
  }
  const response = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: "POST",
    headers: {
      "Priority": notification.priority,
      "Tags": notification.tags,
      "Title": notification.title
    },
    body: notification.body
  });
  if (!response.ok) fail(`ntfy publication failed with HTTP ${response.status}`);
  console.log(`deployment-ready notification sent for ${identity.commit} tree ${identity.tree}`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((error) => {
    console.error(error.stack || String(error));
    process.exitCode = 1;
  });
}
