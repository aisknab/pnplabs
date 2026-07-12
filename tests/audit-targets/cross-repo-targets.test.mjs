import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  AuditTargetValidationError,
  validateAuditTargets
} from "../../tools/check-cross-repo-targets.mjs";

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function write(root, relativePath, content) {
  const filePath = path.join(root, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function makeProject(t) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-targets-"));
  const sourceDir = path.join(root, "pnp");
  mkdirSync(sourceDir, { recursive: true });
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const status = json({
    kind: "PNPFormalReconstructionStatus0",
    concretePublicationGate: { passed: false },
    publicationStatusDerivedOnlyFromConcreteGate: true,
    mathematicalTheoremEstablished: false,
    publicTheoremEmissionAllowed: false,
    publicTheoremStatement: null,
    leanConcreteCNFSATMembershipFormalized: true,
    leanConcreteCNFSATMembershipTheorem: "PNP.Concrete.FinalUniversalDesign.cnfSATInNP",
    leanConcreteCNFWorkAxiomAuditPassed: true,
    leanConcreteCNFWorkAuditedDeclarationCount: 766,
    leanConcretePipelineStateNamespaceFormalized: true,
    leanConcretePipelineStateNamespaceAxiomAuditPassed: true,
    leanConcretePipelineStateNamespaceAuditedDeclarationCount: 39,
    leanConcretePipelineStageBridgesFormalized: true,
    leanConcretePipelineStageBridgesAxiomAuditPassed: true,
    leanConcretePipelineStageBridgesAuditedDeclarationCount: 56,
    leanConcretePipelineStageLaunchFormalized: true,
    leanConcretePipelineVerdictPreservationFormalized: true,
    leanConcretePipelineInternalOutputHandoffComposed: true,
    leanConcretePipelineTerminalOutputPackingFormalized: true,
    leanConcretePipelineTerminalOutputPackerAxiomAuditPassed: true,
    leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount: 69,
    leanConcretePipelineRawRefinementFormalized: false,
    leanConcretePipelineExternalInputSizePolynomialFormalized: false,
    leanConcreteCNFSATInPFormalized: false,
    leanConcreteCNFNPCompletenessFormalized: false
  });
  const inventory = json({
    kind: "PNPLeanTheoremInventory0",
    declarationCount: 5023,
    theoremCount: 2081,
    assumptionFreeTheoremCount: 1980,
    sourceClosureModuleCount: 45,
    axiomCount: 4,
    milestoneCandidates: [{
      name: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      module: "PNP.Concrete.TerminalOutputPacker",
      kind: "theorem",
      axioms: []
    }],
    compatibilityRootCandidate: null,
    concreteTargetCandidate: {
      name: "PNP.Main.ConcretePEqualsNP",
      kind: "definition",
      axioms: []
    }
  });
  const publicationMap = json({ kind: "TestPublicationMap", gate: { passed: false } });

  git(sourceDir, ["init"]);
  git(sourceDir, ["config", "user.email", "audit@example.invalid"]);
  git(sourceDir, ["config", "user.name", "Audit Test"]);
  write(sourceDir, "public/pnp-status.json", status);
  write(sourceDir, "public/pnp-theorem-inventory.json", inventory);
  write(sourceDir, "publication/FORMAL_PUBLICATION_MAP.json", publicationMap);
  git(sourceDir, ["add", "."]);
  git(sourceDir, ["commit", "-m", "fixture"]);
  const commit = git(sourceDir, ["rev-parse", "HEAD"]);
  const tree = git(sourceDir, ["rev-parse", "HEAD^{tree}"]);

  write(root, "public/pnp-status.json", status);
  write(root, "public/pnp-theorem-inventory.json", inventory);

  const release = {
    kind: "PNPFormalPublicationRelease0",
    version: 0,
    status: "current-formal-reconstruction-publication-theorem-gate-closed",
    authority: "current",
    source: {
      commit,
      proofCommit: commit,
      tree,
      ref: commit,
      formalPublicationMapSha256: sha256(Buffer.from(publicationMap)),
      coordinateAloneIsAuthority: false,
      identityRequiresCommitTreeAndArtifactHashes: true
    },
    artifacts: {
      status: {
        sourcePath: "public/pnp-status.json",
        publicPath: "public/pnp-status.json",
        bytes: Buffer.byteLength(status),
        sha256: sha256(Buffer.from(status))
      },
      theoremInventory: {
        sourcePath: "public/pnp-theorem-inventory.json",
        publicPath: "public/pnp-theorem-inventory.json",
        bytes: Buffer.byteLength(inventory),
        sha256: sha256(Buffer.from(inventory))
      },
      report: {
        pageCount: 9,
        pdf: { publicPaths: [] },
        tex: { publicPaths: [] }
      }
    },
    publicationBoundary: {
      derivedOnlyFromConcreteGate: true,
      concreteGatePassed: false,
      mathematicalTheoremEstablished: false,
      publicTheoremEmissionAllowed: false,
      publicTheoremStatement: null,
      compatibilityRootPresent: false,
      concreteTargetPresent: true,
      projectSpecificAxiomsRemaining: true,
      remainingBlockerCount: 7
    },
    earnedBoundary: {
      pipelineStateNamespacesFormalized: true,
      pipelineStateNamespaceAxiomAuditPassed: true,
      pipelineStateNamespaceAuditedDeclarationCount: 39,
      pipelineStageBridgesFormalized: true,
      pipelineStageBridgeAxiomAuditPassed: true,
      pipelineStageBridgeAuditedDeclarationCount: 56,
      pipelineStageLaunchFormalized: true,
      pipelineVerdictPreservationFormalized: true,
      pipelineInternalOutputHandoffComposed: true,
      pipelineTargetTerminationFormalized: false,
      pipelineTerminalRawOutputPackingFormalized: true,
      pipelineTerminalOutputPackerAxiomAuditPassed: true,
      pipelineTerminalOutputPackerAuditedDeclarationCount: 69,
      pipelineTerminalOutputPackerTheorem: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      pipelineTerminalOutputPackerKernelTypeSha256: "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66",
      pipelineTerminalOutputPackerAxiomClosure: [],
      pipelineTerminalOutputPackerCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 6",
      pipelineTerminalOutputPackerConnectedToBridge: false,
      pipelineRawRefinementFormalized: false,
      pipelineExternalInputSizePolynomialFormalized: false
    },
    historicalArchive: {
      status: "historical-quarantined-not-current-authority",
      currentArtifactEligible: false,
      mayActivateTheoremPublication: false
    }
  };
  write(root, "downloads/formal-publication-release.json", json(release));

  const targets = {
    kind: "PNPLabsCrossRepositoryAuditTargets0",
    version: 2,
    refs: {
      currentCoreRef: {
        repo: "test/pnp",
        ref: commit,
        expectedCommit: commit,
        expectedTree: tree,
        class: "current"
      },
      publicCheckout: { repo: "test/pnplabs", ref: "working tree", class: "public" }
    },
    targets: [
      { id: "core.status", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-status.json" },
      { id: "core.inventory", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-theorem-inventory.json" },
      { id: "core.publication_map", kind: "current core publication file", refClass: "currentCoreRef", path: "publication/FORMAL_PUBLICATION_MAP.json" },
      { id: "public.formal_publication_manifest", kind: "pnplabs current release metadata", refClass: "publicCheckout", path: "downloads/formal-publication-release.json" },
      { id: "public.status", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-status.json", mirrorOf: "core.status" },
      { id: "public.inventory", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-theorem-inventory.json", mirrorOf: "core.inventory" }
    ]
  };
  write(root, "docs/audit_targets.json", json(targets));

  return { root, sourceDir, commit, tree, release, targets };
}

function validate(project, overrides = {}) {
  return validateAuditTargets({
    root: project.root,
    sourceDir: project.sourceDir,
    expectedCoreIdentity: { commit: project.commit, proofCommit: project.commit, tree: project.tree },
    ...overrides
  });
}

function expectFailure(project, pattern, overrides = {}) {
  assert.throws(
    () => validate(project, overrides),
    (error) => {
      assert.ok(error instanceof AuditTargetValidationError);
      assert.match(error.failures.join("\n"), pattern);
      return true;
    }
  );
}

test("accepts exact current mirrors pinned to one core commit and tree", (t) => {
  const project = makeProject(t);
  const result = validate(project, { requireSource: true });
  assert.equal(result.skipped, false);
  assert.equal(result.mirroredTargets, 2);
  assert.equal(result.refs.currentCoreRef.commit, project.commit);
  assert.equal(result.refs.currentCoreRef.tree, project.tree);
});

test("rejects byte drift in a current public mirror", (t) => {
  const project = makeProject(t);
  write(project.root, "public/pnp-status.json", "{}\n");
  expectFailure(project, /release artifact identity mismatch: public\/pnp-status\.json/);
});

test("rejects a current core target assigned to the public checkout", (t) => {
  const project = makeProject(t);
  project.targets.targets[0].refClass = "publicCheckout";
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /core\.status: current core publication file must use currentCoreRef/);
});

test("rejects historical refs that are not explicitly quarantined", (t) => {
  const project = makeProject(t);
  project.targets.refs.historicalSourceRef = {
    repo: "test/pnp",
    ref: project.commit,
    expectedCommit: project.commit,
    class: "historical",
    status: "current"
  };
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /historicalSourceRef: historical ref is not explicitly quarantined/);
});

test("rejects a self-consistent manifest that opens theorem publication", (t) => {
  const project = makeProject(t);
  project.release.publicationBoundary.publicTheoremEmissionAllowed = true;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication manifest does not fail closed/);
});

test("rejects pipeline bridge publication without the compiled axiom audits", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication pipeline stage-bridge boundary mismatch/);
});

test("rejects a terminal packer widened into a composed bridge result", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge = true;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-output packer evidence mismatch/);
});

test("skips only the cross-repository phase when a source checkout is optional", (t) => {
  const project = makeProject(t);
  const result = validate(project, { sourceDir: path.join(project.root, "missing-pnp") });
  assert.equal(result.skipped, true);
  assert.match(result.skipReason, /not a git checkout/);
});

test("fails when the exact source checkout is required but absent", (t) => {
  const project = makeProject(t);
  expectFailure(project, /not a git checkout/, {
    sourceDir: path.join(project.root, "missing-pnp"),
    requireSource: true
  });
});
