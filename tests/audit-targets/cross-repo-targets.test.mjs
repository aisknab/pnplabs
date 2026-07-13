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
    leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized: true,
    leanConcretePipelineTerminalBridgeAxiomAuditPassed: true,
    leanConcretePipelineTerminalBridgeAuditedDeclarationCount: 59,
    leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized: true,
    leanConcretePipelinePairedCompilerAxiomAuditPassed: true,
    leanConcretePipelinePairedCompilerAuditedDeclarationCount: 28,
    leanConcretePipelineCanonicalPairCompilationFormalized: true,
    leanConcretePipelineMalformedInputBehaviorFormalized: false,
    leanConcretePipelineRawRefinementFormalized: false,
    leanConcretePipelineExternalInputSizePolynomialFormalized: true,
    leanConcreteCNFSATInPFormalized: false,
    leanConcreteCNFNPCompletenessFormalized: false
  });
  const inventory = json({
    kind: "PNPLeanTheoremInventory0",
    declarationCount: 5125,
    theoremCount: 2168,
    assumptionFreeTheoremCount: 2067,
    sourceClosureModuleCount: 47,
    axiomCount: 4,
    milestoneCandidates: [{
      name: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      module: "PNP.Concrete.TerminalOutputPacker",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      module: "PNP.Concrete.PipelinePairedCompiler",
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
  const publicationMap = json({
    kind: "TestPublicationMap",
    gate: { passed: false },
    earnedMilestoneTheoremKernelTypeSha256: {
      "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact": "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact": "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact": "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact": "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq": "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq": "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout": "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff": "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9"
    }
  });

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
      pipelineTerminalOutputPackerConnectedToBridge: true,
      pipelineTerminalBridgeAxiomAuditPassed: true,
      pipelineTerminalBridgeAuditedDeclarationCount: 59,
      pipelineTerminalBridgeAcceptingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      pipelineTerminalBridgeAcceptingOutputKernelTypeSha256: "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001",
      pipelineTerminalBridgeRejectingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents",
      pipelineTerminalBridgeRejectingOutputKernelTypeSha256: "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db",
      pipelineTerminalBridgeAxiomClosure: [],
      pipelineTerminalBridgeCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 12",
      pipelineSuppliedTraceWorkCostTheorem: "PNP.Concrete.PipelineTerminalBridge.suppliedTraceTerminalWorkSteps_eq",
      pipelineSuppliedTraceWorkCostKernelTypeSha256: "7d9b5bf70b1675c1843f538e046030753b7e0be7c3bd50ec5d64ce9eb5b0869e",
      pipelineSuppliedAcceptTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedAcceptTraceKernelTypeSha256: "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      pipelineSuppliedRejectTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedRejectTraceKernelTypeSha256: "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      pipelineSuppliedAcceptVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptVerdictKernelTypeSha256: "bbc633544f84f156eef71f1aa488a359c35ecb46b1ba1d0dfaa393d1e045fde4",
      pipelineSuppliedRejectVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectVerdictKernelTypeSha256: "a2cee1b6edc38318bd4b57c82bbc6f708b3c6e676f42128be00f787477a6fbfe",
      pipelineStuckTimeoutTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_timeout_of_stuck_rawRunExact",
      pipelineStuckTimeoutKernelTypeSha256: "0ce3f2337117d81a1a25b923c5604dcd9b8235e69598390825caae68c93d9488",
      pipelineSuppliedAcceptMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptMachineOutputKernelTypeSha256: "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      pipelineSuppliedRejectMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectMachineOutputKernelTypeSha256: "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      pipelinePriorTraceTransportToTerminalBridgeFormalized: true,
      pipelinePairedCompilerAxiomAuditPassed: true,
      pipelinePairedCompilerAuditedDeclarationCount: 28,
      pipelineCanonicalPairCompilationFormalized: true,
      pipelineMalformedInputBehaviorFormalized: false,
      pipelinePairedVerdictTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      pipelinePairedVerdictKernelTypeSha256: "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      pipelinePairedMachineOutputTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      pipelinePairedMachineOutputKernelTypeSha256: "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      pipelinePairedNoTimeoutTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      pipelinePairedNoTimeoutKernelTypeSha256: "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      pipelinePairedAcceptsTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      pipelinePairedAcceptsKernelTypeSha256: "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9",
      pipelinePairedCompilerAxiomClosure: [],
      pipelineOutputSizePolynomial: "B(m) = m + p(m) + 1",
      pipelineRawTimePolynomial: "R(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))",
      pipelineRawRefinementFormalized: false,
      pipelineExternalInputSizePolynomialFormalized: true
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

test("rejects a terminal bridge narrowed back to an unconnected packer", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-output packer evidence mismatch/);
});

test("rejects removal of the supplied prior-trace transport", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-bridge supplied-trace boundary mismatch/);
});

test("rejects a canonical-pair compiler widened to arbitrary malformed inputs", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineMalformedInputBehaviorFormalized = true;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication manifest overstates the all-input pipeline compiler/);
});

test("rejects removal of the canonical-pair external polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication manifest overstates the all-input pipeline compiler/);
});

test("rejects drift in the canonical-pair runtime polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineRawTimePolynomial = "R(m) = 0";
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication canonical-pair polynomial evidence mismatch/);
});

test("rejects a drifted canonical-pair theorem fingerprint", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256 = "0".repeat(64);
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /canonical-pair verdict evidence mismatch/);
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
