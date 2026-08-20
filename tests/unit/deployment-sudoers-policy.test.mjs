import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const policyPath = new URL("../../deploy/pnplabs-deploy.sudoers", import.meta.url);
const deploymentDocsPath = new URL("../../docs/deployment_verification.md", import.meta.url);
const agentInstructionsPath = new URL("../../AGENTS.md", import.meta.url);
const expectedPolicy =
  "pnplabs-operator pnplabs-host=(root:root) NOPASSWD:NOSETENV: /usr/bin/env ^-i PNPLABS_COMMIT=[0-9a-f]{40} /usr/local/bin/deploy-pnp$\n";
const deploymentCommand =
  "sudo -n /usr/bin/env -i PNPLABS_COMMIT=<exact-merged-main-commit> /usr/local/bin/deploy-pnp";

test("sudoers policy grants only the exact noninteractive deployment command", () => {
  const policy = readFileSync(policyPath, "utf8");
  assert.equal(policy, expectedPolicy);
  assert.match(policy, /^pnplabs-operator pnplabs-host=/u);
  assert.doesNotMatch(policy, /\bALL\b|SETENV(?!:)|[?*]|\/bin\/(?:ba)?sh|systemctl|sudoedit/u);

  const argumentPattern = policy
    .trimEnd()
    .slice(policy.indexOf("/usr/bin/env ") + "/usr/bin/env ".length);
  const allowedArguments = new RegExp(argumentPattern, "u");
  const commit = "a".repeat(40);

  assert.equal(
    allowedArguments.test(`-i PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp`),
    true
  );
  for (const argumentsText of [
    `PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp`,
    `-i PNPLABS_COMMIT=${commit.toUpperCase()} /usr/local/bin/deploy-pnp`,
    `-i PNPLABS_COMMIT=${"a".repeat(39)} /usr/local/bin/deploy-pnp`,
    `-i PNPLABS_COMMIT=${commit} /usr/local/bin/deploy-pnp extra`,
    `-i PNPLABS_COMMIT=${commit} /bin/bash`
  ]) {
    assert.equal(allowedArguments.test(argumentsText), false, argumentsText);
  }
});

test("deployment documentation keeps authorization narrow, revocable, and validation-gated", () => {
  const docs = readFileSync(deploymentDocsPath, "utf8");
  const agentInstructions = readFileSync(agentInstructionsPath, "utf8");

  assert.match(docs, new RegExp(deploymentCommand, "u"));
  assert.match(docs, /does not create a timer, hook, or merge-triggered deployment/u);
  assert.match(docs, /sudo mv \/etc\/sudoers\.d\/pnplabs-deploy \/root\/pnplabs-deploy\.sudoers\.disabled/u);
  assert.match(agentInstructions, /Use only the exact noninteractive command/u);
  assert.match(agentInstructions, /literal verified merge\s+commit/u);
  assert.match(agentInstructions, /never request, retain, or transmit a sudo\s+password/u);
  assert.doesNotMatch(docs, /sudo env PNPLABS_COMMIT/u);
});
