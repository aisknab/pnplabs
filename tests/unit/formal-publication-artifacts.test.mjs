import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, linkSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { verifyReleaseSeal } from "../../tools/verify-release-seal.mjs";
import { writeMirrorFileAtomically } from "../../tools/sync-public-access-docs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SEALED_PATHS = [
  "downloads/release-seal.json",
  "downloads/SHA256SUMS",
  "downloads/canonical_proof_report.pdf",
  "downloads/canonical-proof-report.pdf",
  "downloads/canonical_proof_report.tex",
  "downloads/canonical-proof-report.tex",
  "downloads/formal-publication-release.json",
  "downloads/source-checker-release.json",
  "public/pnp-status.json",
  "public/pnp-theorem-inventory.json"
];

function json(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function copySealFixture(t) {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-seal-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  for (const relativePath of SEALED_PATHS) {
    const target = path.join(fixture, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(path.join(root, relativePath), target);
  }
  return fixture;
}

test("exact current artifact seal verifies eight reviewed files", () => {
  const result = verifyReleaseSeal({ root });
  assert.equal(result.checked, 8);
  assert.equal(result.coreCommit, "cc3c004f3498a0f28b8afda688802d322b9e5c21");
});

test("current release is pinned, nine-page, exposes only earned CNF-SAT and canonical-pair compiler results, and fails closed", () => {
  const release = json("downloads/formal-publication-release.json");
  assert.equal(release.source.commit, "cc3c004f3498a0f28b8afda688802d322b9e5c21");
  assert.equal(release.source.proofCommit, "66e458cb78422fb663bbaa0e61ff3777082f0b26");
  assert.equal(release.source.tree, "01300e50f0654a0815b5833e9b3ee6ef06c6bfb5");
  assert.equal(release.source.coordinateAloneIsAuthority, false);
  assert.equal(release.source.identityRequiresCommitTreeAndArtifactHashes, true);
  assert.equal(release.artifacts.report.pageCount, 9);
  assert.equal(release.earnedBoundary.leanTheorem, "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  assert.equal(release.earnedBoundary.kernelTypeSha256, "c9d66c135361cf8a8b25330d2558dfac209fde120e296140c7e7cb86bf1e1937");
  assert.deepEqual(release.earnedBoundary.axiomClosure, []);
  assert.equal(release.earnedBoundary.auditedDeclarationCount, 766);
  assert.equal(release.earnedBoundary.pipelineStateNamespacesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.pipelineStageBridgesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.pipelineStageLaunchFormalized, true);
  assert.equal(release.earnedBoundary.pipelineVerdictPreservationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInternalOutputHandoffComposed, true);
  assert.equal(release.earnedBoundary.pipelineCompiledRawCostMultiplier, 6);
  assert.equal(release.earnedBoundary.pipelineTargetTerminationFormalized, false);
  assert.equal(release.earnedBoundary.pipelineTerminalRawOutputPackingFormalized, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerTheorem, "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerKernelTypeSha256, "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalOutputPackerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 6");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256, "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputKernelTypeSha256, "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalBridgeAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 12");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceKernelTypeSha256, "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceKernelTypeSha256, "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.pipelineCanonicalPairCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineMalformedInputBehaviorFormalized, false);
  assert.equal(release.earnedBoundary.pipelinePairedVerdictTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256, "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputKernelTypeSha256, "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutKernelTypeSha256, "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsKernelTypeSha256, "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9");
  assert.deepEqual(release.earnedBoundary.pipelinePairedCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineOutputSizePolynomial, "B(m) = m + p(m) + 1");
  assert.equal(release.earnedBoundary.pipelineRawTimePolynomial, "R(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))");
  assert.equal(release.earnedBoundary.pipelineRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cnfSATInPFormalized, false);
  assert.equal(release.earnedBoundary.cnfSATNPCompletenessFormalized, false);
  assert.equal(release.earnedBoundary.pEqualsNPFormalized, false);
  assert.equal(release.publicationBoundary.derivedOnlyFromConcreteGate, true);
  assert.equal(release.publicationBoundary.concreteGatePassed, false);
  assert.equal(release.publicationBoundary.mathematicalTheoremEstablished, false);
  assert.equal(release.publicationBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(release.publicationBoundary.publicTheoremStatement, null);
  assert.equal(release.publicationBoundary.compatibilityRootPresent, false);
  assert.equal(release.publicationBoundary.concreteTargetPresent, true);
  assert.equal(release.publicationBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(release.publicationBoundary.remainingBlockerCount, 7);
});

test("7072f8d report metadata is historical-only and cannot reactivate publication", () => {
  const historical = json("downloads/source-checker-release.json");
  assert.equal(historical.status, "historical-quarantined-not-current-authority");
  assert.equal(historical.authority, "historical-only");
  assert.equal(historical.currentArtifactEligible, false);
  assert.equal(historical.currentStatusAuthority, false);
  assert.equal(historical.mayActivateTheoremPublication, false);
  assert.equal(historical.historicalCanonicalReport.pageCount, 56);
  assert.notEqual(
    json("downloads/formal-publication-release.json").artifacts.report.pdf.sha256,
    historical.historicalCanonicalReport.pdfSha256
  );
});

test("seal rejects canonical artifact drift even when the file remains readable", (t) => {
  const fixture = copySealFixture(t);
  writeFileSync(path.join(fixture, "downloads/canonical_proof_report.tex"), "drift\n");
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /byte count .* does not match/
  );
});

test("seal rejects extra or reordered manifest entries", (t) => {
  const fixture = copySealFixture(t);
  const sealPath = path.join(fixture, "downloads/release-seal.json");
  const seal = JSON.parse(readFileSync(sealPath, "utf8"));
  seal.files.reverse();
  writeFileSync(sealPath, `${JSON.stringify(seal, null, 2)}\n`);
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /release seal entry drifted/
  );
});

test("sync mode rejects combining explicit read-only and write modes", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/sync-public-access-docs.mjs", "--check", "--write"],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /cannot combine --check with --write/);
});

test("exported verification helpers import without a script argv path", () => {
  const modules = [
    "./tools/verify-release-seal.mjs",
    "./tools/check-cross-repo-targets.mjs",
    "./tools/sync-public-access-docs.mjs",
    "./tools/reviewer-fixture-checker.mjs"
  ];
  const expression = `await Promise.all(${JSON.stringify(modules)}.map((name) => import(name)))`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", expression],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr);
});

test("automation invokes read-only sync and contains no commit or push step", () => {
  const workflow = readFileSync(path.join(root, ".github/workflows/sync-public-access-report.yml"), "utf8");
  assert.match(workflow, /permissions:\n  contents: read/);
  assert.match(workflow, /sync-public-access-docs\.mjs --check/);
  assert.doesNotMatch(workflow, /git (?:commit|push)/);
  assert.doesNotMatch(workflow, /contents: write/);
});

test("production audit is manual and deployment remains fail-closed outside GitHub Actions", () => {
  const workflow = readFileSync(
    path.join(root, ".github/workflows/production-deployment-consistency.yml"),
    "utf8"
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /inputs:|\$\{\{\s*inputs\./);
  assert.match(workflow, /PRODUCTION_BASE_URL: https:\/\/pnplabs\.com\.au/);
  assert.match(workflow, /ref: refs\/heads\/main/);
  assert.doesNotMatch(workflow, /^\s+(?:push|pull_request|schedule):/m);
  assert.match(workflow, /npm run verify:production/);
  assert.doesNotMatch(workflow, /contents: write|git (?:commit|push)|systemctl|deploy-pnp/);

  const deploy = readFileSync(path.join(root, "deploy/deploy-pnp"), "utf8");
  assert.match(deploy, /merge-base --is-ancestor/);
  assert.match(deploy, /REPOSITORY_URL="https:\/\/github\.com\/aisknab\/pnplabs\.git"/);
  assert.doesNotMatch(deploy, /PNPLABS_REPOSITORY_URL/);
  assert.match(deploy, /LOCK_DIR="\/run\/pnplabs"/);
  assert.match(deploy, /install -d -m 0755 -o root -g root "\$LOCK_DIR"/);
  assert.match(deploy, /umask 077\nexec 9>"\$LOCK_FILE"\numask 022/);
  assert.match(deploy, /flock -n 9/);
  assert.match(deploy, /"\$@" 9>&-/);
  assert.match(deploy, /runuser -u "\$DEPLOY_USER"/);
  assert.match(deploy, /trap 'rollback 130' INT/);
  assert.match(deploy, /trap 'rollback 143' TERM/);
  assert.match(deploy, /for \(\(attempt = 1; attempt <= 30;/);
  assert.match(deploy, /as_deploy npm --prefix "\$release_dir" test/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:generate/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:check/);
  assert.match(deploy, /as_deploy node "\$release_dir\/tools\/check-production-deployment\.mjs"/);
  assert.match(deploy, /--expected-site-commit "\$resolved_commit"/);
  assert.match(deploy, /restored the previous release/);
  assert.match(deploy, /wait_for_origin "\/index\.html"/);
  assert.match(deploy, /systemctl stop "\$ORIGIN_SERVICE"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$previous_target\/server\.mjs"/);
  const freezeIndex = deploy.indexOf('chown -R -h root:root "$release_dir"');
  const activationIndex = deploy.lastIndexOf('mv -Tf "$next_link" "$CURRENT_LINK"');
  assert.ok(freezeIndex >= 0 && freezeIndex < activationIndex, "release must become root-owned before activation");
  assert.match(deploy, /chmod -R a-w,u\+rwX,go\+rX "\$release_dir"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$release_dir\/server\.mjs"/);

  const service = readFileSync(path.join(root, "deploy/pnplabs-origin.service"), "utf8");
  assert.match(service, /^User=pnplabs-origin$/m);
  assert.match(service, /^Environment=HOST=127\.0\.0\.1$/m);
  assert.match(service, /^NoNewPrivileges=true$/m);
  assert.match(service, /^ProtectSystem=strict$/m);
  assert.match(service, /^ReadOnlyPaths=\/srv\/pnplabs$/m);
  assert.match(service, /^ExecStart=\/usr\/local\/libexec\/pnplabs-origin-launcher$/m);
  const launcher = readFileSync(path.join(root, "deploy/pnplabs-origin-launcher"), "utf8");
  assert.match(launcher, /^#!\/bin\/bash/);
  assert.match(launcher, /readlink -f -- "\$\{current_link\}\/server\.mjs"/);
  assert.match(launcher, /exec \/usr\/bin\/env node "\$server_path"/);

  const staticHeaders = readFileSync(path.join(root, "_headers"), "utf8");
  assert.match(staticHeaders, /\/\*\n(?:  .+\n)*  Cache-Control: no-cache/);
  assert.doesNotMatch(staticHeaders, /immutable|max-age=31536000/);
});

test("every active workflow is read-only and pins credential-free actions", () => {
  for (const name of [
    "ci.yml",
    "pnp-public-payloads.yml",
    "pnp-upstream-status-consistency.yml",
    "pnp-verification-run-issue-ingest.yml",
    "pnp-verifier-run-import.yml",
    "production-deployment-consistency.yml",
    "sync-public-access-report.yml"
  ]) {
    const workflow = readFileSync(path.join(root, ".github/workflows", name), "utf8");
    assert.match(workflow, /permissions:\n  contents: read/, name);
    assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d/, name);
    assert.match(workflow, /actions\/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5/, name);
    assert.match(workflow, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/, name);
    const checkoutCount = (workflow.match(/actions\/checkout@/g) || []).length;
    const credentialCount = (workflow.match(/persist-credentials: false/g) || []).length;
    assert.equal(credentialCount, checkoutCount, `${name}: every checkout must drop credentials`);
  }
});

test("explicit write rejects a symlinked parent without touching the outside target", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(path.join(outside, "sentinel.json"), "outside\n");
  symlinkSync(outside, path.join(fixture, "public"));

  assert.throws(
    () => writeMirrorFileAtomically(
      fixture,
      path.join(fixture, "public", "sentinel.json"),
      Buffer.from("overwritten\n")
    ),
    /target parent must be a real directory/
  );
  assert.equal(readFileSync(path.join(outside, "sentinel.json"), "utf8"), "outside\n");
});

test("atomic replacement does not mutate an outside hardlink", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  mkdirSync(path.join(fixture, "public"));
  const sentinel = path.join(outside, "sentinel.json");
  const mirror = path.join(fixture, "public", "mirror.json");
  writeFileSync(sentinel, "outside\n");
  linkSync(sentinel, mirror);

  writeMirrorFileAtomically(fixture, mirror, Buffer.from("current mirror\n"));
  assert.equal(readFileSync(sentinel, "utf8"), "outside\n");
  assert.equal(readFileSync(mirror, "utf8"), "current mirror\n");
});
