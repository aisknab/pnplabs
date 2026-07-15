// Purpose: support static-site navigation, release digest checks, and public source links.
document.querySelectorAll('link[data-deferred-style]').forEach((link) => {
  link.media = 'all';
  link.removeAttribute('data-deferred-style');
});

const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');

function ensureStatusLink() {
  if (!nav || nav.querySelector('a[href="status.html"]')) return;
  const statusLink = document.createElement('a');
  statusLink.href = 'status.html';
  statusLink.textContent = 'Status';
  if (location.pathname.endsWith('/status.html')) {
    statusLink.classList.add('active');
    statusLink.setAttribute('aria-current', 'page');
  }
  const homeLink = nav.querySelector('a[href="index.html"]');
  if (homeLink?.nextSibling) nav.insertBefore(statusLink, homeLink.nextSibling);
  else nav.prepend(statusLink);
}

const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-16-45';
const STATUS_SHA256 = 'beffd9c5f6ac31f559ed13b997a2ad73b855c2df71ba89ef6da0241f97e30e14';
const PUBLIC_SURFACE_COORDINATE = 'PUBLIC-SURFACE-BASELINE-2026-07-16-COOK-LEVIN-BUILDER-TOKEN-APPENDER-44';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-16-45';
const INVENTORY_SHA256 = '2f8280035717c4223b465ca64ffe4c10c7fd4bc973c28d4a79a92ab2e78851a5';
const SOURCE_CLOSURE_SHA256 = '4f2514ad9f89916ac6bb89ba037005bcc41b99d4a65b2347eaceeb4bd36f619a';

const INVENTORY_COUNTS = Object.freeze({
  declarations: 7006,
  theorems: 3213,
  assumptionFreeTheorems: 2620,
  excludedPrivateDeclarations: 1333,
  modules: 64,
  axioms: 4,
});

const PROJECT_AXIOMS = Object.freeze([
  'PNP.CheckPCCPackexp',
  'PNP.GeneratePCCPack',
  'PNP.LockedNANDThreshold',
  'PNP.ResidualBandExactMinimization',
]);

const LEAN_STANDARD_AXIOMS = Object.freeze([
  'Classical.choice',
  'Quot.sound',
  'propext',
]);

const REMAINING_BLOCKERS = Object.freeze([
  'Formal.ConcreteSAT',
  'Formal.LockedNANDThreshold',
  'Formal.ResidualBandMinimizer',
  'Formal.ZeroSlack',
  'Formal.PolynomialRuntimeAndCertificateBounds',
  'Formal.RootTheoremAndAxiomAudit',
]);

const MILESTONE_IDS = Object.freeze([
  'concrete-machine-cost-kernel',
  'concrete-complexity-classes',
  'concrete-cnf-universal-verifier',
  'concrete-cook-levin-layout',
  'concrete-cook-levin-fixed-tableau',
  'concrete-cook-levin-verifier-tableau',
  'concrete-cook-levin-local-cnf',
  'concrete-cook-levin-tableau-cnf',
  'concrete-cook-levin-tableau-cnf-semantics',
  'concrete-cook-levin-raw-tape-bridge',
  'concrete-cook-levin-formula-size',
  'concrete-cook-levin-formula-schedule',
  'concrete-cook-levin-formula-cursor',
  'concrete-cook-levin-builder-input-length',
  'concrete-cook-levin-builder-input-prefix',
  'concrete-cook-levin-builder-token-appender',
  'direct-wire-semantics',
  'finite-enumeration-minimum',
  'framed-replacement-slack',
  'locked-nand-local-baseline',
  'locked-nand-conditional-threshold',
  'explicit-residual-routes',
  'global-locked-nand-threshold',
  'global-zeroslack-pccmin',
  'concrete-publication-root',
]);

const GATE_SUBCHECK_KEYS = Object.freeze([
  'standardComplexityModelEligible',
  'concreteTargetPresent',
  'concreteTargetIsDefinition',
  'concreteTargetKernelTypeFingerprintConfigured',
  'concreteTargetKernelTypeFingerprintMatches',
  'concreteTargetKernelValueFingerprintConfigured',
  'concreteTargetKernelValueFingerprintMatches',
  'compatibilityRootPresent',
  'compatibilityRootIsTheorem',
  'compatibilityRootHasExactConcreteType',
  'compatibilityRootKernelTypeFingerprintConfigured',
  'compatibilityRootKernelTypeFingerprintMatches',
  'axiomClosureFingerprintConfigured',
  'axiomClosureFingerprintMatches',
  'sourceClosureFingerprintConfigured',
  'sourceClosureFingerprintMatches',
  'axiomClosureUsesOnlyLeanStandardAllowlist',
]);

const FAIL_CLOSED_FORMAL_STATUS = Object.freeze({
  status: 'formal-reconstruction-in-progress',
  mathematicalTheoremEstablished: false,
  publicTheoremEmissionAllowed: false,
  publicTheoremStatement: null,
  finalTheoremReady: false,
  rootLeanTheoremPresent: false,
  rootLeanTheoremBuilt: false,
  rootLeanTheoremAxiomAuditPassed: false,
  projectSpecificAxiomsRemaining: true,
  leanConcreteCNFSATMembershipFormalized: false,
  leanConcretePipelineStateNamespaceAxiomAuditPassed: false,
  leanConcretePipelineStageBridgesFormalized: false,
  leanConcretePipelineStageBridgesAxiomAuditPassed: false,
  leanConcretePipelineTerminalOutputPackingFormalized: false,
  leanConcretePipelineTerminalOutputPackerAxiomAuditPassed: false,
  leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount: 0,
  leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized: false,
  leanConcretePipelineTerminalBridgeAxiomAuditPassed: false,
  leanConcretePipelineTerminalBridgeAuditedDeclarationCount: 0,
  leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized: false,
  leanConcretePipelineInputFramerAxiomAuditPassed: false,
  leanConcretePipelineInputFramerAuditedDeclarationCount: 0,
  leanConcretePipelineAllInputFramingFormalized: false,
  leanConcretePipelinePairedCompilerAxiomAuditPassed: false,
  leanConcretePipelinePairedCompilerAuditedDeclarationCount: 0,
  leanConcretePipelineCanonicalPairCompilationFormalized: false,
  leanConcretePipelineCompilerAxiomAuditPassed: false,
  leanConcretePipelineCompilerAuditedDeclarationCount: 0,
  leanConcretePipelineAllInputCompilationFormalized: false,
  leanConcretePipelineSequentialNamespaceAxiomAuditPassed: false,
  leanConcretePipelineSequentialCompilerAxiomAuditPassed: false,
  leanConcretePipelineSequentialCompilationFormalized: false,
  leanConcretePipelineRefinementAxiomAuditPassed: false,
  leanConcreteFunctionProgramRecursiveCompilationFormalized: false,
  leanConcreteDecisionProgramRecursiveCompilationFormalized: false,
  leanConcretePolynomialTimeDeciderRawCompilationFormalized: false,
  standardComplexityModelFormalized: false,
  leanConcretePipelineMalformedInputBehaviorFormalized: false,
  leanConcretePipelineRawRefinementFormalized: false,
  leanConcretePipelineExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderInputLengthFormalized: false,
  leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderInputPrefixFormalized: false,
  leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderTokenAppenderFormalized: false,
  leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized: false,
  leanConcreteCNFSATInPFormalized: false,
  leanConcreteCNFNPCompletenessFormalized: false,
});

function formalStatusFields(payload) {
  return `status = "${payload.status}"
mathematicalTheoremEstablished = ${payload.mathematicalTheoremEstablished}
publicTheoremEmissionAllowed = ${payload.publicTheoremEmissionAllowed}
publicTheoremStatement = ${payload.publicTheoremStatement === null ? 'null' : JSON.stringify(payload.publicTheoremStatement)}
finalTheoremReady = ${payload.finalTheoremReady}
rootLeanTheoremPresent = ${payload.rootLeanTheoremPresent}
rootLeanTheoremBuilt = ${payload.rootLeanTheoremBuilt}
rootLeanTheoremAxiomAuditPassed = ${payload.rootLeanTheoremAxiomAuditPassed}
projectSpecificAxiomsRemaining = ${payload.projectSpecificAxiomsRemaining}
leanConcreteCNFSATMembershipFormalized = ${payload.leanConcreteCNFSATMembershipFormalized ?? false}
leanConcretePipelineStateNamespaceAxiomAuditPassed = ${payload.leanConcretePipelineStateNamespaceAxiomAuditPassed ?? false}
leanConcretePipelineStageBridgesFormalized = ${payload.leanConcretePipelineStageBridgesFormalized ?? false}
leanConcretePipelineStageBridgesAxiomAuditPassed = ${payload.leanConcretePipelineStageBridgesAxiomAuditPassed ?? false}
leanConcretePipelineTerminalOutputPackingFormalized = ${payload.leanConcretePipelineTerminalOutputPackingFormalized ?? false}
leanConcretePipelineTerminalOutputPackerAxiomAuditPassed = ${payload.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed ?? false}
leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount = ${payload.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount ?? 0}
leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized = ${payload.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized ?? false}
leanConcretePipelineTerminalBridgeAxiomAuditPassed = ${payload.leanConcretePipelineTerminalBridgeAxiomAuditPassed ?? false}
leanConcretePipelineTerminalBridgeAuditedDeclarationCount = ${payload.leanConcretePipelineTerminalBridgeAuditedDeclarationCount ?? 0}
leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized = ${payload.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized ?? false}
leanConcretePipelineInputFramerAxiomAuditPassed = ${payload.leanConcretePipelineInputFramerAxiomAuditPassed ?? false}
leanConcretePipelineInputFramerAuditedDeclarationCount = ${payload.leanConcretePipelineInputFramerAuditedDeclarationCount ?? 0}
leanConcretePipelineAllInputFramingFormalized = ${payload.leanConcretePipelineAllInputFramingFormalized ?? false}
leanConcretePipelinePairedCompilerAxiomAuditPassed = ${payload.leanConcretePipelinePairedCompilerAxiomAuditPassed ?? false}
leanConcretePipelinePairedCompilerAuditedDeclarationCount = ${payload.leanConcretePipelinePairedCompilerAuditedDeclarationCount ?? 0}
leanConcretePipelineCanonicalPairCompilationFormalized = ${payload.leanConcretePipelineCanonicalPairCompilationFormalized ?? false}
leanConcretePipelineCompilerAxiomAuditPassed = ${payload.leanConcretePipelineCompilerAxiomAuditPassed ?? false}
leanConcretePipelineCompilerAuditedDeclarationCount = ${payload.leanConcretePipelineCompilerAuditedDeclarationCount ?? 0}
leanConcretePipelineAllInputCompilationFormalized = ${payload.leanConcretePipelineAllInputCompilationFormalized ?? false}
leanConcretePipelineSequentialCompilationFormalized = ${payload.leanConcretePipelineSequentialCompilationFormalized ?? false}
leanConcretePipelineRefinementAxiomAuditPassed = ${payload.leanConcretePipelineRefinementAxiomAuditPassed ?? false}
leanConcreteFunctionProgramRecursiveCompilationFormalized = ${payload.leanConcreteFunctionProgramRecursiveCompilationFormalized ?? false}
leanConcreteDecisionProgramRecursiveCompilationFormalized = ${payload.leanConcreteDecisionProgramRecursiveCompilationFormalized ?? false}
leanConcretePolynomialTimeDeciderRawCompilationFormalized = ${payload.leanConcretePolynomialTimeDeciderRawCompilationFormalized ?? false}
standardComplexityModelFormalized = ${payload.standardComplexityModelFormalized ?? false}
leanConcretePipelineMalformedInputBehaviorFormalized = ${payload.leanConcretePipelineMalformedInputBehaviorFormalized ?? false}
leanConcretePipelineRawRefinementFormalized = ${payload.leanConcretePipelineRawRefinementFormalized ?? false}
leanConcretePipelineExternalInputSizePolynomialFormalized = ${payload.leanConcretePipelineExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderInputLengthFormalized = ${payload.leanConcreteCookLevinBuilderInputLengthFormalized ?? false}
leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderInputPrefixFormalized = ${payload.leanConcreteCookLevinBuilderInputPrefixFormalized ?? false}
leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed = ${payload.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed ?? false}
leanConcreteCNFSATInPFormalized = ${payload.leanConcreteCNFSATInPFormalized ?? false}
leanConcreteCNFNPCompletenessFormalized = ${payload.leanConcreteCNFNPCompletenessFormalized ?? false}
concretePublicationGate.passed = ${payload.concretePublicationGate?.passed ?? false}`;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isSha256(value) {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function validateInventory(inventory) {
  if (inventory?.kind !== 'PNPLeanTheoremInventory0'
    || inventory.coordinate !== INVENTORY_COORDINATE
    || inventory.environmentProbeComplete !== true
    || inventory.rootModule !== 'PNP'
    || inventory.leanToolchain !== 'leanprover/lean4:v4.31.0'
    || inventory.declarationCount !== INVENTORY_COUNTS.declarations
    || inventory.theoremCount !== INVENTORY_COUNTS.theorems
    || inventory.assumptionFreeTheoremCount !== INVENTORY_COUNTS.assumptionFreeTheorems
    || inventory.excludedPrivateDeclarationCount !== INVENTORY_COUNTS.excludedPrivateDeclarations
    || inventory.sourceClosureModuleCount !== INVENTORY_COUNTS.modules
    || inventory.axiomCount !== INVENTORY_COUNTS.axioms
    || !sameJson(inventory.projectAxioms, PROJECT_AXIOMS)
    || inventory.compatibilityRootName !== 'PNP.Main.p_eq_np'
    || inventory.compatibilityRootCandidate !== null
    || inventory.concreteTargetName !== 'PNP.Main.ConcretePEqualsNP'
    || inventory.concreteTargetCandidate?.name !== 'PNP.Main.ConcretePEqualsNP'
    || inventory.concreteTargetCandidate.kind !== 'definition'
    || !sameJson(inventory.concreteTargetCandidate.axioms, [])
    || !Array.isArray(inventory.declarations)
    || inventory.declarations.length !== INVENTORY_COUNTS.declarations
    || !Array.isArray(inventory.sourceClosureModules)
    || inventory.sourceClosureModules.length !== INVENTORY_COUNTS.modules) return false;

  const kindCounts = inventory.declarationKindCounts;
  if (!sameJson(kindCounts, {
    axiom: 4,
    constructor: 301,
    definition: 3222,
    inductive: 133,
    opaque: 0,
    quotient: 0,
    recursor: 133,
    theorem: 3213,
  })) return false;

  const theoremRows = inventory.declarations.filter((row) => row?.kind === 'theorem');
  const membership = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  const cookLevinBridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  const cookLevinFormulaSize = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  const cookLevinFormulaSchedule = [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const cookLevinFormulaCursor = [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const cookLevinBuilderInputLength = [
    ['PNP.Concrete.CookLevin.BuilderInputLength.finalTape_represents', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.inputTape_eq_totalInputFramerFinalTape', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.malformedScanSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.rawTimeBound_exact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.run_compile', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.tallySizeBound_exact', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workBoundedDecide_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.work_one_step_short_timeout', ['Quot.sound', 'propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderInputPrefix = [
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.boundedDecide_compile_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_represents', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_tally_length', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_framer_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_tally_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.framerState_ne_tallyState', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_eval', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_le', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_exact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_rawTimeBound', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.work_one_step_short_timeout', ['Quot.sound', 'propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderTokenAppender = [
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_after_builderInputPrefix', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_one_step_short_timeout', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workBoundedDecide_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_eval', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_le', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_one', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_zero', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.malformedOutputSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.malformedTallySymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.rules_pairwise_query_distinct', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.run_compile_firstHeaderToken_rawTimeBound', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.tokenSymbol_bits', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_empty_eq_builderInputLength_finalTape', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_represents', ['propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const bridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineStageBridges.workBoundedDecide_bridged_timeout_of_stuck_rawRunExact');
  const packer = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq');
  const terminalBridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents');
  const suppliedTrace = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact');
  const suppliedOutput = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact');
  const pairedVerdict = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq');
  const pairedOutput = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq');
  const pairedTimeout = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout');
  const pairedAccepts = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff');
  const allInputCompilerTheorems = [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const sequentialCompilerTheorems = [
    'PNP.Concrete.PipelineSequentialCompiler.sequential_correct',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const recursiveRefinementTheorems = [
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq',
    'PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const totalFramerTrace = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact');
  const totalFramerEndpoint = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents');
  const totalFramerBound = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound');
  const totalFramerNoTimeout = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout');
  return membership?.kind === 'theorem'
    && membership.module === 'PNP.Concrete.CNFWorkUniversalCorrectness'
    && membership.kernelType === 'Lean.Expr.app (Lean.Expr.const `PNP.Concrete.InNP []) (Lean.Expr.const `PNP.Concrete.CNFSAT [])'
    && sameJson(membership.axioms, [])
    && cookLevinBridge?.kind === 'theorem'
    && cookLevinBridge.module === 'PNP.Concrete.CookLevinRawTapeBridge'
    && sameJson(cookLevinBridge.axioms, LEAN_STANDARD_AXIOMS)
    && cookLevinFormulaSize?.kind === 'theorem'
    && cookLevinFormulaSize.module === 'PNP.Concrete.CookLevinFormulaSize'
    && sameJson(cookLevinFormulaSize.axioms, ['Quot.sound', 'propext'])
    && cookLevinFormulaSchedule.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinFormulaSchedule'
      && sameJson(row.axioms, ['Quot.sound', 'propext']))
    && cookLevinFormulaCursor.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinFormulaCursor'
      && sameJson(row.axioms, ['Quot.sound', 'propext']))
    && cookLevinBuilderInputLength.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderInputLength'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderInputPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderInputPrefix'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderTokenAppender.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderTokenAppender'
      && sameJson(row.axioms, axioms))
    && bridge?.kind === 'theorem'
    && bridge.module === 'PNP.Concrete.PipelineStageBridges'
    && sameJson(bridge.axioms, [])
    && packer?.kind === 'theorem'
    && packer.module === 'PNP.Concrete.TerminalOutputPacker'
    && sameJson(packer.axioms, [])
    && terminalBridge?.kind === 'theorem'
    && terminalBridge.module === 'PNP.Concrete.PipelineTerminalBridge'
    && sameJson(terminalBridge.axioms, [])
    && suppliedTrace?.kind === 'theorem'
    && sameJson(suppliedTrace.axioms, [])
    && suppliedOutput?.kind === 'theorem'
    && sameJson(suppliedOutput.axioms, [])
    && pairedVerdict?.kind === 'theorem'
    && pairedVerdict.module === 'PNP.Concrete.PipelinePairedCompiler'
    && sameJson(pairedVerdict.axioms, [])
    && pairedOutput?.kind === 'theorem'
    && sameJson(pairedOutput.axioms, [])
    && pairedTimeout?.kind === 'theorem'
    && sameJson(pairedTimeout.axioms, [])
    && pairedAccepts?.kind === 'theorem'
    && pairedAccepts.module === 'PNP.Concrete.PipelinePairedCompiler'
    && sameJson(pairedAccepts.axioms, [])
    && allInputCompilerTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineCompiler'
      && sameJson(row.axioms, []))
    && sequentialCompilerTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineSequentialCompiler'
      && sameJson(row.axioms, []))
    && recursiveRefinementTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineRefinement'
      && sameJson(row.axioms, []))
    && totalFramerTrace?.kind === 'theorem'
    && totalFramerTrace.module === 'PNP.Concrete.PipelineInputFramer'
    && sameJson(totalFramerTrace.axioms, [])
    && totalFramerEndpoint?.kind === 'theorem'
    && sameJson(totalFramerEndpoint.axioms, [])
    && totalFramerBound?.kind === 'theorem'
    && sameJson(totalFramerBound.axioms, [])
    && totalFramerNoTimeout?.kind === 'theorem'
    && sameJson(totalFramerNoTimeout.axioms, [])
    && inventory.milestoneCandidates.length === 340
    && theoremRows.length === INVENTORY_COUNTS.theorems
    && theoremRows.filter((row) => Array.isArray(row.axioms) && row.axioms.length === 0).length === INVENTORY_COUNTS.assumptionFreeTheorems
    && inventory.declarations.filter((row) => row?.kind === 'axiom').length === INVENTORY_COUNTS.axioms
    && new Set(inventory.sourceClosureModules).size === INVENTORY_COUNTS.modules;
}

function deriveGateSubchecks(status, inventory) {
  const gate = status?.concretePublicationGate || {};
  const target = inventory?.concreteTargetCandidate;
  const root = inventory?.compatibilityRootCandidate;
  const typeConfigured = isSha256(gate.expectedConcreteTargetKernelTypeSha256);
  const valueConfigured = isSha256(gate.expectedConcreteTargetKernelValueSha256);
  const rootConfigured = isSha256(gate.expectedRootKernelTypeSha256);
  const axiomConfigured = isSha256(gate.expectedAxiomClosureSha256);
  const sourceConfigured = isSha256(gate.expectedSourceClosureSha256);
  const targetPresent = Boolean(target && target.name === gate.concreteTargetName);
  const rootPresent = Boolean(root && root.name === gate.compatibilityRootName);

  return {
    standardComplexityModelEligible: status?.standardComplexityModelFormalized === true,
    concreteTargetPresent: targetPresent,
    concreteTargetIsDefinition: targetPresent && target.kind === 'definition',
    concreteTargetKernelTypeFingerprintConfigured: typeConfigured,
    concreteTargetKernelTypeFingerprintMatches: typeConfigured && gate.actualConcreteTargetKernelTypeSha256 === gate.expectedConcreteTargetKernelTypeSha256,
    concreteTargetKernelValueFingerprintConfigured: valueConfigured,
    concreteTargetKernelValueFingerprintMatches: valueConfigured && gate.actualConcreteTargetKernelValueSha256 === gate.expectedConcreteTargetKernelValueSha256,
    compatibilityRootPresent: rootPresent,
    compatibilityRootIsTheorem: rootPresent && root.kind === 'theorem',
    compatibilityRootHasExactConcreteType: false,
    compatibilityRootKernelTypeFingerprintConfigured: rootConfigured,
    compatibilityRootKernelTypeFingerprintMatches: rootConfigured && gate.actualRootKernelTypeSha256 === gate.expectedRootKernelTypeSha256,
    axiomClosureFingerprintConfigured: axiomConfigured,
    axiomClosureFingerprintMatches: axiomConfigured && gate.actualAxiomClosureSha256 === gate.expectedAxiomClosureSha256,
    sourceClosureFingerprintConfigured: sourceConfigured,
    sourceClosureFingerprintMatches: sourceConfigured && gate.actualSourceClosureSha256 === gate.expectedSourceClosureSha256,
    axiomClosureUsesOnlyLeanStandardAllowlist: rootPresent
      && Array.isArray(gate.axiomClosure)
      && gate.axiomClosure.every((axiom) => gate.allowedLeanStandardAxioms?.includes(axiom)),
  };
}

function validateConcreteGate(status, inventory) {
  const gate = status?.concretePublicationGate;
  if (gate?.kind !== 'PNPConcretePublicationGate0'
    || gate.compatibilityRootName !== 'PNP.Main.p_eq_np'
    || gate.concreteTargetName !== 'PNP.Main.ConcretePEqualsNP'
    || gate.abstractPEqualsNPIsPublicationIneligible !== true
    || gate.unsetFingerprintIsIntentionalFailClosedMigrationGate !== true
    || !sameJson(gate.allowedLeanStandardAxioms, ['Classical.choice', 'Quot.sound', 'propext'])
    || !sameJson(Object.keys(gate.subchecks || {}), GATE_SUBCHECK_KEYS)) return false;

  const derived = deriveGateSubchecks(status, inventory);
  if (!sameJson(gate.subchecks, derived)) return false;
  const strictConjunction = GATE_SUBCHECK_KEYS.every((key) => derived[key] === true);
  return gate.passed === strictConjunction;
}

function validateMilestones(status) {
  const milestones = status?.formalPublicationMilestones;
  if (!Array.isArray(milestones)
    || !sameJson(milestones.map((row) => row.id), MILESTONE_IDS)) return false;

  return milestones.every((row, index) => {
    const shouldBeEarned = index < 22;
    const allAssumptionFree = row.theoremRows?.every((theorem) => sameJson(theorem.axioms, []));
    if (row.earned !== shouldBeEarned
      || row.sourceClosureFingerprintMatches !== true
      || !Array.isArray(row.theoremRows)
      || row.theoremRows.length !== row.requiredTheorems?.length
      || row.allAssumptionFree !== allAssumptionFree) return false;
    if (shouldBeEarned) {
      return row.allPresent === true
        && row.allKernelTypesMatch === true
        && row.theoremRows.every((theorem) => theorem.present === true
          && theorem.kind === 'theorem'
          && Array.isArray(theorem.axioms)
          && theorem.axioms.every((axiom) => LEAN_STANDARD_AXIOMS.includes(axiom))
          && isSha256(theorem.expectedKernelTypeSha256)
          && theorem.kernelTypeFingerprintMatches === true
          && theorem.actualKernelTypeSha256 === theorem.expectedKernelTypeSha256);
    }
    return row.status === 'not-formalized'
      && row.allPresent === false
      && row.allAssumptionFree === false
      && row.allKernelTypesMatch === false
      && row.theoremRows.every((theorem) => theorem.present === false
        && theorem.expectedKernelTypeSha256 === null
        && theorem.kernelTypeFingerprintMatches === false);
  });
}

function validateStatus(status, inventory) {
  const gatePassed = status?.concretePublicationGate?.passed === true;
  return status?.kind === 'PNPFormalReconstructionStatus0'
    && status.coordinate === STATUS_COORDINATE
    && status.publicSurfaceBaselineCoordinate === PUBLIC_SURFACE_COORDINATE
    && status.currentStatusAuthority === true
    && status.status === 'formal-reconstruction-in-progress'
    && status.claimStatus === 'formal-reconstruction-in-progress'
    && status.leanToolchain === 'leanprover/lean4:v4.31.0'
    && status.leanTheoremInventoryCoordinate === INVENTORY_COORDINATE
    && status.leanTheoremInventorySha256 === INVENTORY_SHA256
    && status.leanTheoremInventoryGeneratedFromCompiledEnvironment === true
    && status.leanTheoremInventoryDeclarationCount === INVENTORY_COUNTS.declarations
    && status.leanTheoremInventoryTheoremCount === INVENTORY_COUNTS.theorems
    && status.leanTheoremInventoryAssumptionFreeTheoremCount === INVENTORY_COUNTS.assumptionFreeTheorems
    && status.leanTheoremInventoryExcludedPrivateDeclarationCount === INVENTORY_COUNTS.excludedPrivateDeclarations
    && status.leanTheoremInventorySourceClosureModuleCount === INVENTORY_COUNTS.modules
    && status.concretePublicationGate?.actualSourceClosureSha256 === SOURCE_CLOSURE_SHA256
    && status.abstractPEqualsNPPublicationEligible === false
    && status.publicationStatusDerivedOnlyFromConcreteGate === true
    && validateConcreteGate(status, inventory)
    && validateMilestones(status)
    && status.mathematicalTheoremEstablished === gatePassed
    && status.publicTheoremEmissionAllowed === gatePassed
    && status.finalTheoremReady === gatePassed
    && status.internalFinalTheoremReady === gatePassed
    && status.unrestrictedFinalSoundnessDischarged === gatePassed
    && status.uniformFinalSoundnessProved === gatePassed
    && status.satInPConclusionAccepted === gatePassed
    && status.pEqualsNPConclusionAccepted === gatePassed
    && (gatePassed || (status.publicTheoremStatement === null && status.publicTheoremConclusion === null))
    && status.rootLeanTheoremPresent === status.concretePublicationGate.subchecks.compatibilityRootPresent
    && status.rootLeanTheoremBuilt === gatePassed
    && status.rootLeanTheoremAxiomAuditPassed === gatePassed
    && status.projectSpecificAxiomsRemaining === true
    && sameJson(status.projectSpecificAxiomInventory, PROJECT_AXIOMS)
    && status.leanConcreteCNFVerifierCorrectnessFormalized === true
    && status.leanConcreteCNFVerifierNoTimeoutFormalized === true
    && status.leanConcreteCNFWorkAxiomAuditPassed === true
    && status.leanConcreteCNFWorkAuditedDeclarationCount === 766
    && status.leanConcreteCNFSATMembershipFormalized === true
    && status.leanConcreteCNFSATMembershipTheorem === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP'
    && status.leanConcretePipelineStateNamespaceFormalized === true
    && status.leanConcretePipelineStateNamespaceAxiomAuditPassed === true
    && status.leanConcretePipelineStateNamespaceAuditedDeclarationCount === 39
    && status.leanConcretePipelineStageBridgesFormalized === true
    && status.leanConcretePipelineStageBridgesAxiomAuditPassed === true
    && status.leanConcretePipelineStageBridgesAuditedDeclarationCount === 56
    && status.leanConcretePipelineStageLaunchFormalized === true
    && status.leanConcretePipelineVerdictPreservationFormalized === true
    && status.leanConcretePipelineInternalOutputHandoffComposed === true
    && status.leanConcretePipelineTerminalOutputPackingFormalized === true
    && status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed === true
    && status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount === 69
    && status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized === true
    && status.leanConcretePipelineTerminalBridgeAxiomAuditPassed === true
    && status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount === 59
    && status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized === true
    && status.leanConcretePipelineInputFramerAxiomAuditPassed === true
    && status.leanConcretePipelineInputFramerAuditedDeclarationCount === 70
    && status.leanConcretePipelineAllInputFramingFormalized === true
    && status.leanConcretePipelinePairedCompilerAxiomAuditPassed === true
    && status.leanConcretePipelinePairedCompilerAuditedDeclarationCount === 28
    && status.leanConcretePipelineCanonicalPairCompilationFormalized === true
    && status.leanConcretePipelineCompilerAxiomAuditPassed === true
    && status.leanConcretePipelineCompilerAuditedDeclarationCount === 29
    && status.leanConcretePipelineAllInputCompilationFormalized === true
    && status.leanConcretePipelineSequentialNamespaceFormalized === true
    && status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed === true
    && status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount === 26
    && status.leanConcretePipelineSequentialCompilationFormalized === true
    && status.leanConcretePipelineSequentialCompilerAxiomAuditPassed === true
    && status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount === 31
    && status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized === true
    && status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized === true
    && status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized === true
    && status.leanConcretePipelineRefinementAxiomAuditPassed === true
    && status.leanConcretePipelineRefinementAuditedDeclarationCount === 16
    && status.leanConcreteFunctionProgramRecursiveCompilationFormalized === true
    && status.leanConcreteDecisionProgramRecursiveCompilationFormalized === true
    && status.leanConcretePolynomialTimeDeciderRawCompilationFormalized === true
    && status.standardComplexityModelFormalized === true
    && status.leanConcretePipelineMalformedInputBehaviorFormalized === true
    && status.leanConcretePipelineRawRefinementFormalized === true
    && status.leanConcretePipelineExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount === 39
    && status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount === 40
    && status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed === false
    && status.leanConcreteCNFSATInPFormalized === false
    && status.leanConcreteCNFNPCompletenessFormalized === false
    && status.checkerAcceptanceIsMathematicalProof === false
    && status.externalReviewIsMathematicalPremise === false
    && sameJson(status.activeFinalNodeIds, [])
    && sameJson(status.remainingFormalObligations, REMAINING_BLOCKERS)
    && sameJson(status.remainingBlockers, REMAINING_BLOCKERS);
}

async function sha256Hex(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isConservativeFormalStatus(status, inventory) {
  return validateInventory(inventory) && validateStatus(status, inventory);
}

function renderFormalStatus(root, payload, sourceState) {
  root.dataset.statusState = sourceState;
  const label = root.querySelector('[data-formal-status-label]');
  const fields = root.querySelector('[data-formal-status-fields]');
  const note = root.querySelector('[data-formal-status-note]');
  if (label) label.textContent = 'not established';
  if (fields) fields.textContent = formalStatusFields(payload);
  if (note) {
    note.innerHTML = sourceState === 'authoritative-mirror'
      ? '<strong>Inventory bound:</strong> the compiled Lean inventory matches its reviewed SHA-256, counts, milestone pins, source closure, and conservative gate. The target theorem remains unestablished and theorem emission remains disabled.'
      : '<strong>Live inventory unavailable:</strong> the page remains fail closed. Missing, malformed, stale, or digest-mismatched data never enables theorem emission.';
  }
}

function renderMilestones(milestones) {
  document.querySelectorAll('[data-formal-milestones]').forEach((root) => {
    root.replaceChildren(...milestones.map((milestone) => {
      const card = document.createElement('article');
      card.className = milestone.earned ? 'card' : 'card accent';
      card.dataset.milestoneId = milestone.id;
      card.dataset.earned = String(milestone.earned);
      const heading = document.createElement('h3');
      heading.textContent = `${milestone.earned ? 'Formalized' : 'Not formalized'}: ${milestone.title}`;
      const scope = document.createElement('p');
      scope.textContent = milestone.scope;
      const boundary = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = 'Boundary: ';
      boundary.append(strong, milestone.nonClaim);
      card.append(heading, scope, boundary);
      return card;
    }));
  });
}

function renderInventoryCounts() {
  document.querySelectorAll('[data-formal-inventory-counts]').forEach((root) => {
    root.textContent = `${INVENTORY_COUNTS.declarations.toLocaleString('en-US')} public declarations; ${INVENTORY_COUNTS.theorems} theorem-kind declarations; ${INVENTORY_COUNTS.assumptionFreeTheorems} assumption-free theorem-kind declarations; ${INVENTORY_COUNTS.excludedPrivateDeclarations} private compiler auxiliaries excluded; ${INVENTORY_COUNTS.modules} modules; ${INVENTORY_COUNTS.axioms} project axioms.`;
  });
}

async function loadFormalPublication() {
  const roots = [...document.querySelectorAll('[data-formal-status-root]')];
  const hasInventoryTargets = document.querySelector('[data-formal-milestones], [data-formal-inventory-counts]');
  if (roots.length === 0 && !hasInventoryTargets) return;
  roots.forEach((root) => renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed'));
  try {
    const [statusResponse, inventoryResponse] = await Promise.all([
      fetch('public/pnp-status.json', { cache: 'no-store' }),
      fetch('public/pnp-theorem-inventory.json', { cache: 'no-store' }),
    ]);
    if (!statusResponse.ok || !inventoryResponse.ok) throw new Error('current formal-publication payload fetch failed');
    const [statusBytes, inventoryBytes] = await Promise.all([
      statusResponse.arrayBuffer(),
      inventoryResponse.arrayBuffer(),
    ]);
    const [statusDigest, inventoryDigest] = await Promise.all([
      sha256Hex(statusBytes),
      sha256Hex(inventoryBytes),
    ]);
    if (statusDigest !== STATUS_SHA256) throw new Error('formal-reconstruction status digest mismatch');
    if (inventoryDigest !== INVENTORY_SHA256) throw new Error('compiled Lean inventory digest mismatch');
    const decoder = new TextDecoder();
    const status = JSON.parse(decoder.decode(statusBytes));
    const inventory = JSON.parse(decoder.decode(inventoryBytes));
    if (!isConservativeFormalStatus(status, inventory)) throw new Error('formal-publication payloads failed conservative validation');
    roots.forEach((root) => renderFormalStatus(root, status, 'authoritative-mirror'));
    renderMilestones(status.formalPublicationMilestones);
    renderInventoryCounts();
  } catch (error) {
    console.error('PNP formal-publication load failed closed', error);
  }
}

function ensureHomepageFormalReconstructionBoundary() {
  const hero = document.querySelector('.artifact-hero .artifact-copy');
  if (!hero) return;

  const title = hero.querySelector('#hero-title');
  if (title) title.textContent = 'The repository does not currently establish P = NP.';

  const lede = hero.querySelector('.lede');
  if (lede) {
    lede.textContent = 'The compiled Lean environment contains 7,006 exported public declarations, including 3,213 theorem-kind declarations and 2,620 assumption-free theorem-kind declarations across 64 modules. Twenty-two scoped publication milestones are earned, now including a standalone finite-machine Cook-Levin token appender; three global milestones remain unformalized.';
  }

  const trace = hero.querySelector('.checker-trace');
  if (trace) {
    trace.innerHTML = '<span>Cook-Levin semantics checked</span><span>formula schedule checked</span><strong>gate closed</strong>';
  }

  const firstNote = hero.querySelector('.review-note');
  if (firstNote) {
    firstNote.innerHTML = '<strong>Current status:</strong> <code>BuilderTokenAppender.appendToken_workRunExact</code> proves exact appending for every fixed token request, input, prior output, and exterior tape. The specialized first token emits the first two direct formula bits within <code>24*n + 48</code> compiled raw steps. This standalone machine is not yet rule-table-composed with the input prefix and is not a complete builder or reduction. CNF-SAT NP-completeness, CNF-SAT in P, and P = NP remain absent. Four project axioms and six blockers remain.';
  }

  hero.querySelectorAll('[data-homepage-matrix-summary], [data-homepage-one-command-upload]').forEach((element) => element.remove());
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.querySelectorAll('a[href="public/pnp-one-command-upload.json"], a[href="public/pnp-verifier-run-matrix-summary.json"], a[href="verifier-run-digests.html"]').forEach((link) => link.remove());
    if (!actions.querySelector('a[href="status.html"]')) {
      const statusButton = document.createElement('a');
      statusButton.className = 'btn primary';
      statusButton.href = 'status.html';
      statusButton.textContent = 'View current status';
      actions.prepend(statusButton);
    }
  }
}

function currentPageName() {
  const last = location.pathname.split('/').filter(Boolean).pop();
  return last || 'index.html';
}

function rewritePageHero({ eyebrow, title, lede, primaryHref, primaryText, secondaryHref, secondaryText }) {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const eyebrowEl = hero.querySelector('.eyebrow');
  if (eyebrowEl && eyebrow) eyebrowEl.textContent = eyebrow;
  const h1 = hero.querySelector('h1');
  if (h1) h1.textContent = title;
  const ledeEl = hero.querySelector('.lede');
  if (ledeEl) ledeEl.textContent = lede;
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.innerHTML = '';
    const primary = document.createElement('a');
    primary.className = 'btn primary';
    primary.href = primaryHref;
    primary.textContent = primaryText;
    actions.append(primary);
    if (secondaryHref && secondaryText) {
      const secondary = document.createElement('a');
      secondary.className = 'btn secondary';
      secondary.href = secondaryHref;
      secondary.textContent = secondaryText;
      actions.append(secondary);
    }
  }
}

function insertAfterPageHero(id, html) {
  if (document.getElementById(id)) return;
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const node = template.content.firstElementChild;
  hero.insertAdjacentElement('afterend', node);
}

function ensureFormalVerificationCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction verification',
    title: 'Verify the compiled inventory and current sixteen-page report.',
    lede: 'The target theorem is not established. The current report is generated from the reviewed compiled inventory; digest checks establish file identity, not mathematical truth.',
    primaryHref: 'public/pnp-status.json',
    primaryText: 'Open current status JSON',
    secondaryHref: 'status.html',
    secondaryText: 'View status explanation',
  });
  insertAfterPageHero('formal-verification-copy', `<section class="section compact" id="formal-verification-copy">
      <div class="boundary-panel">
        <div class="boundary-head"><span>Current verification boundary</span><strong>not established</strong></div>
        <pre>mathematicalTheoremEstablished = false
publicTheoremEmissionAllowed = false
finalTheoremReady = false
rootLeanTheoremPresent = false
projectSpecificAxiomsRemaining = true</pre>
      </div>
      <div class="grid two path" style="margin-top:1.2rem">
        <article class="card"><h3>Check status and inventory together</h3><p>The browser fetches both payloads concurrently, hashes the raw inventory bytes, validates exact counts and coordinates, and rejects inconsistent gate or milestone rows.</p></article>
        <article class="card"><h3>Build and inventory Lean</h3><p>Run <code>lake build PNP</code>, <code>npm run formal:inventory:check</code>, and <code>npm run formal:publication:check</code> in the source repository.</p></article>
        <article class="card"><h3>Check current report identity</h3><p>The sixteen-page PDF and TeX are generated from the inventory-derived publication model. Their hashes identify bytes; they do not independently prove theorem correctness.</p></article>
        <article class="card"><h3>Historical run intake</h3><p>The former activated verifier-run registry and automated submission workflow are frozen.</p></article>
      </div>
    </section>`);
}

function ensureFormalFAQCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction FAQ',
    title: 'Current theorem-status FAQ.',
    lede: 'The repository proves concrete CNF-SAT membership in NP, raw-machine compilation, exact Cook-Levin semantic equivalence and size/schedule results, an executable input-preparation prefix, and a standalone finite-machine token appender that emits the first two formula bits with an explicit linear bound. It does not compose that appender into the prefix, complete a raw formula builder, package a polynomial reduction, or establish CNF-SAT NP-completeness, CNF-SAT in P, or P = NP. These answers distinguish the current sixteen-page status report from the historical 56-page claim manuscript.',
    primaryHref: 'status.html',
    primaryText: 'View current status',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-faq-copy', `<section class="section compact" id="formal-faq-copy">
      <div class="section-label">Current theorem-status FAQ</div>
      <div class="grid two path">
        <article class="card"><h3>Does the repository establish P = NP?</h3><p>No. <code>mathematicalTheoremEstablished = false</code> and <code>publicTheoremEmissionAllowed = false</code>.</p></article>
        <article class="card"><h3>What is formalized?</h3><p>Twenty-two scoped publication milestones are earned from pinned theorem rows whose axiom closures contain no project axiom. They include <code>CNFSAT ∈ NP</code>, raw-machine compilation, exact Cook-Levin CNF-to-verifier-language semantics, the size/schedule bounds, a collision-free executable framer-to-tally prefix, and a standalone exact token appender. Prefix-to-appender composition, a complete raw formula builder, packaged polynomial reduction, NP-completeness, deterministic P result, and concrete publication root remain unearned.</p></article>
        <article class="card"><h3>What does legacy checker acceptance mean?</h3><p>It is historical evidence that assertion-bearing records passed implemented predicates. It is not a proof of the asserted propositions.</p></article>
        <article class="card"><h3>Is external review a theorem premise?</h3><p>No. External review is optional audit evidence and is not a mathematical premise or release blocker.</p></article>
      </div>
    </section>`);
}

function ensureFormalReviewCopy() {
  rewritePageHero({
    eyebrow: 'Audit and formal reconstruction',
    title: 'Review an unfinished formal reconstruction.',
    lede: 'Reviewers can identify counterexamples, missing definitions, hidden assumptions, invalid reductions, or Lean gaps. Review is valuable audit evidence but not a mathematical premise.',
    primaryHref: 'status.html',
    primaryText: 'View current blockers',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-review-copy', `<section class="section compact" id="formal-review-copy">
      <div class="section-label">Current review role</div>
      <div class="callout"><div><h2>Challenge the compiled boundary.</h2><p>Review the 7,006-declaration inventory, 340 pinned theorem candidates, whole-source closure, twenty-two earned scoped publication milestones, three unearned global milestones, and concrete publication gate. The standalone Cook-Levin token appender emits the first two direct formula bits within <code>24*n + 48</code> raw steps; it is not yet composed with the input prefix, and a complete raw builder and packaged reduction remain absent. Four project axioms and six blockers remain.</p></div><a class="btn primary" href="status.html">Inspect blockers</a></div>
    </section>`);
}

function ensureFormalPageCopy() {
  const page = currentPageName();
  if (page === 'verify.html') ensureFormalVerificationCopy();
  if (page === 'faq.html') ensureFormalFAQCopy();
  if (page === 'review.html') ensureFormalReviewCopy();
}

ensureStatusLink();
ensureHomepageFormalReconstructionBoundary();
ensureFormalPageCopy();
loadFormalPublication();

globalThis.PNPFormalPublication = Object.freeze({
  STATUS_COORDINATE,
  PUBLIC_SURFACE_COORDINATE,
  INVENTORY_COORDINATE,
  INVENTORY_SHA256,
  INVENTORY_COUNTS,
  PROJECT_AXIOMS,
  MILESTONE_IDS,
  deriveGateSubchecks,
  validateConcreteGate,
  validateInventory,
  validateMilestones,
  validateStatus,
});

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.getAttribute('data-copy'));
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = old; }, 1400);
    } catch {
      button.textContent = 'Select text';
    }
  });
});

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'unknown size';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

document.querySelectorAll('[data-seal-console]').forEach((consoleRoot) => {
  const runButton = consoleRoot.querySelector('[data-seal-run]');
  const resetButton = consoleRoot.querySelector('[data-seal-reset]');
  const status = consoleRoot.querySelector('[data-seal-status]');
  const output = consoleRoot.querySelector('[data-seal-output]');
  const computed = consoleRoot.querySelector('[data-seal-computed]');
  const result = consoleRoot.querySelector('[data-seal-result]');
  const artifact = consoleRoot.getAttribute('data-artifact');
  const artifactLabel = consoleRoot.getAttribute('data-label') || artifact;
  const expected = (consoleRoot.getAttribute('data-expected') || '').toLowerCase();

  const setState = (state, text) => {
    consoleRoot.dataset.state = state;
    if (status) status.textContent = text;
  };

  const addLine = (kind, text) => {
    if (!output) return;
    const item = document.createElement('li');
    if (kind) item.classList.add(kind);
    const label = document.createElement('span');
    label.textContent = kind || 'info';
    const code = document.createElement('code');
    code.textContent = text;
    item.append(label, code);
    output.append(item);
  };

  const resetConsole = () => {
    setState('idle', 'idle');
    if (computed) computed.textContent = 'not run';
    if (result) result.textContent = 'Awaiting browser check.';
    if (output) {
      output.replaceChildren();
      addLine('target', artifactLabel);
      addLine('expect', expected);
      addLine('ready', 'press Run check to fetch the file, hash locally, and compare');
    }
  };

  const runSealCheck = async () => {
    if (!artifact || !expected) return;
    if (!globalThis.crypto?.subtle) {
      setState('failed', 'unsupported');
      if (result) result.textContent = 'Web Crypto is unavailable in this browser context.';
      addLine('fail', 'crypto.subtle is unavailable; use HTTPS, localhost, or the command-line workflow');
      return;
    }

    setState('running', 'running');
    if (runButton) runButton.disabled = true;
    if (computed) computed.textContent = 'computing...';
    if (result) result.textContent = 'Checking bundled report file...';
    if (output) output.replaceChildren();

    try {
      addLine('pending', `GET ${artifact}`);
      const response = await fetch(artifact, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${artifactLabel}`);
      const buffer = await response.arrayBuffer();
      addLine('ok', `received ${artifactLabel} · ${formatBytes(buffer.byteLength)}`);
      addLine('pending', 'compute SHA-256 with browser Web Crypto');
      const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
      const actual = toHex(digest);
      if (computed) computed.textContent = actual;
      if (actual === expected) {
        addLine('ok', 'computed digest matches the published release digest');
        setState('verified', 'matched');
        if (result) result.textContent = 'Digest match: bundled canonical report matches the published SHA-256. This confirms file identity only.';
      } else {
        addLine('fail', 'computed digest does not match the published release seal');
        setState('failed', 'mismatch');
        if (result) result.textContent = 'Digest mismatch: do not rely on this bundled artefact without further investigation.';
      }
    } catch (error) {
      addLine('fail', error instanceof Error ? error.message : 'release seal check failed');
      setState('failed', 'failed');
      if (computed) computed.textContent = 'not available';
      if (result) result.textContent = 'The browser check could not complete. Use the command-line verification workflow or retry from a served page.';
    } finally {
      if (runButton) runButton.disabled = false;
    }
  };

  resetButton?.addEventListener('click', resetConsole);
  runButton?.addEventListener('click', runSealCheck);
  resetConsole();
});

const progress = document.querySelector('.progress');
function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

import('./public-source-links.js').catch((error) => {
  console.error('Public source link enhancement failed', error);
});
