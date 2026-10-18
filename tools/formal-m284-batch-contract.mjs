// Reviewed compiled evidence for the M284 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M284_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m284",
  "reviewedSource": {
    "commit": "28a194ab7876f4ac59c172b784c28d8868947d24",
    "tree": "5f0f97b5a47433847ae77223dfdd5523263f3080",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-18-284"
  },
  "milestones": [
    {
      "number": 283,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-16-283",
      "id": "source-scalar-quadratic-contraction-class-completeness",
      "title": "Complete search for balanced source-scalar quadratic contractions",
      "classification": "formalized-foundation-only",
      "scope": "For every finite family of factored Boolean source equations in every positive dimension, every balanced selected-source-scalar translation whose pullback preserves quadratic degree on every source row implies that the actual affine/line/plane selector returns a step; the existing checked step-soundness contract applies. Semantic quadratic closure is equivalent to the exact coefficient obstruction criterion and to quadratic closure through the computed quotient decoder. The actual decoder composed with the encoder equals the balanced source retraction on every ambient point. A stopped selector has no contraction in this precisely defined class; no finite-menu membership or caller-supplied coverage premise is required.",
      "nonClaim": "Contraction existence remains a premise. This class consists only of balanced translations by a fixed direction with scalar equal to an XOR of selected source equations and with quadratic pullbacks of all rows. It does not include arbitrary contraction maps, higher-degree transformations or general residual decision procedures. A stopped core may still be satisfiable. No useful contraction on every input, complete residual solver, polynomial encoded construction or runtime, manuscript residual-band minimizer, unconditional SaturatePositive, BCELReady or ZeroSlack, exact polynomial PCCMin, concrete CNFSAT membership in P, or eligible root theorem is proved. P = NP is not proved.",
      "fields": {
        "leanSourceScalarQuadraticContractionClassFormalized": true,
        "leanSourceScalarQuadraticContractionClassAxiomAuditPassed": true,
        "leanSourceScalarQuadraticContractionClassAuditedDeclarationCount": 10,
        "leanSourceScalarQuadraticContractionClassSemanticCriterionTheorem": "PNP.Concrete.ResidualReduction.SourceClass.semantic_iff_coefficient",
        "leanSourceScalarQuadraticContractionClassQuadraticCharacterizationTheorem": "PNP.Concrete.ResidualReduction.SourceClass.third_zero_iff_quadratic",
        "leanSourceScalarQuadraticContractionClassComputedSelectorCompletenessTheorem": "PNP.Concrete.ResidualReduction.SourceClass.globalStep_complete_for_semantic",
        "leanSourceScalarQuadraticContractionClassStoppingExclusionTheorem": "PNP.Concrete.ResidualReduction.SourceClass.globalStep_none_no_semantic",
        "leanSourceScalarQuadraticContractionClassActualDecoderTheorem": "PNP.Concrete.ResidualReduction.SourceClass.decode_encode_eq_retraction",
        "leanSourceScalarQuadraticContractionClassChartEquivalenceTheorem": "PNP.Concrete.ResidualReduction.SourceClass.semantic_iff_chart",
        "leanSourceScalarQuadraticContractionClassChartSelectorCompletenessTheorem": "PNP.Concrete.ResidualReduction.SourceClass.globalStep_complete_for_chart",
        "leanSourceScalarQuadraticContractionClassArbitraryPositiveDimensions": true,
        "leanSourceScalarQuadraticContractionClassAllSourceRowsRetained": true,
        "leanSourceScalarQuadraticContractionClassCallerSuppliedMenuCoverageRequired": false,
        "leanSourceScalarQuadraticContractionClassContractionExistenceRequired": true,
        "leanSourceScalarQuadraticContractionClassArbitraryContractionMapCoverageProved": false,
        "leanSourceScalarQuadraticContractionClassUsefulContractionOnEveryInputProved": false,
        "leanSourceScalarQuadraticContractionClassAllInputResidualDecisionProved": false,
        "leanSourceScalarQuadraticContractionClassCompletePolynomialRuntimeProved": false,
        "leanSourceScalarQuadraticContractionClassUnconditionalZeroSlackProved": false,
        "leanSourceScalarQuadraticContractionClassExactPolynomialPCCMinProved": false,
        "leanSourceScalarQuadraticContractionClassScope": "balanced-selected-source-equation-xor-scalar-fixed-direction-translations-all-row-quadratic-pullback-computed-selector-completeness-exact-quotient-decoder-no-universal-existence-arbitrary-map-coverage-total-solver-or-runtime"
      },
      "theorems": {
        "PNP.Concrete.ResidualReduction.SourceClass.coefficient_implies_menu": {
          "hash": "bba76afa33a987468bfdec377a044cc89a61f7b0e38f33ea9e0bf0825ef46d6c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassCompleteness"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.decode_encode_eq_retraction": {
          "hash": "992abdbebab4b5f3b9594dc84d3a1c8ca57f3fb3d35caa2450d5f9323993d44c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.globalStep_complete_for_chart": {
          "hash": "8858621a5b1b58da31a00f46b7cf7c592ff0b642f9d08189ef2a605f6d35ee2f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.globalStep_complete_for_semantic": {
          "hash": "b90d2a6a5a9ec79798484e9babadd52a462e3b8c5ce4bf504dc9a89e52157a2e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassCompleteness"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.globalStep_none_no_semantic": {
          "hash": "d9af3a99e970940da3d2a9ec1c2d49c8eb1b14b929713cf1085ade4bbe4a63b8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassCompleteness"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.quadratic_of_third_zero": {
          "hash": "c8d8d6c28860023c738a71d5107f4d573cd1ef90baba4dab104760695f9eb5cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.semantic_iff_chart": {
          "hash": "08cd8f6e7d7268969c807d55761710d1ae95032ab436f3cda98fea54a8282fc4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.semantic_iff_coefficient": {
          "hash": "b9aa26cb642c734f1b98138677bdb8015d05a0d60052132d2cc1b8d9938a42e1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.semantic_implies_coefficient": {
          "hash": "a8ded3bb9d05fa40fcd13c0af0308cf9c2df8e0b835492a7813d274fe3dd6a65",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceContractionClass"
        },
        "PNP.Concrete.ResidualReduction.SourceClass.third_zero_iff_quadratic": {
          "hash": "f73a4ba85cdd2c14b3003147e053f56e9d834aa14c529c8445507073dc306924",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceClassChart"
        }
      },
      "verification": {
        "status": "formalized-foundation-only",
        "earned": true,
        "allPresent": true,
        "allAssumptionFree": false,
        "allKernelTypesMatch": true,
        "axiomClosureUsesOnlyLeanStandardAllowlist": true,
        "sourceClosureFingerprintMatches": true
      }
    },
    {
      "number": 284,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-18-284",
      "id": "source-contraction-phase-polynomial-runtime-and-witness-replay",
      "title": "Polynomial source-contraction phase and complete witness replay",
      "classification": "formalized-foundation-only",
      "scope": "For every raw input bitstring, the closed source-construction finite machine halts within its encoded-input polynomial bound and emits exactly the canonical source-derived contraction packet, with polynomial output size. On a decoded source system, the actual remaining core is satisfiable exactly when the original input is in CNFSAT. A separate closed finite-machine replay endpoint returns the exact canonical optional answer on every raw request. For the history generated from the actual source system, it lifts any genuine remaining-core model to a certificate accepted by the original source checker, with physical replay time bounded polynomially in the original input length. Projection and recovery preserve original models; source-generated history is not a caller-supplied correctness certificate.",
      "nonClaim": "A genuine model of the remaining core is still required for certificate recovery; this work does not find that model. A positive-dimensional stopped core remains unknown and may be satisfiable or unsatisfiable. The replay runtime bound starts from the canonical encoded request; a further finite-machine request assembler is not claimed. These are polynomial source-construction and witness-replay endpoints, not a complete residual decision procedure, manuscript residual-band minimizer, unconditional SaturatePositive, BCELReady or ZeroSlack, exact polynomial PCCMin, concrete CNFSAT membership in P, or eligible root theorem. P = NP is not proved.",
      "fields": {
        "leanSourceContractionPhaseRuntimeFormalized": true,
        "leanSourceContractionPhaseRuntimeAxiomAuditPassed": true,
        "leanSourceContractionPhaseRuntimeAuditedDeclarationCount": 14,
        "leanSourceContractionPhaseRuntimeSourceOutputTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_output",
        "leanSourceContractionPhaseRuntimeSourceHaltingTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_halts",
        "leanSourceContractionPhaseRuntimeSourceSizeTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_output_size",
        "leanSourceContractionPhaseRuntimeSatisfiabilityTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_satisfiability",
        "leanSourceContractionPhaseRuntimeReplayOutputTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.replay_output",
        "leanSourceContractionPhaseRuntimeCertificateTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.recover_certificate",
        "leanSourceContractionPhaseRuntimeOriginalInputBoundTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.recover_certificate_runtime",
        "leanSourceContractionPhaseRuntimeProjectBoundTheorem": "PNP.Concrete.ResidualReduction.SourceReplayEndpointBudget.native_project_run",
        "leanSourceContractionPhaseRuntimeModelRoundtripTheorem": "PNP.Concrete.ResidualReduction.SourceReplayEndpointGenerated.project_recover_model",
        "leanSourceContractionPhaseRuntimeUnknownBoundaryTheorem": "PNP.Concrete.ResidualReduction.SourceReductionRuntime.unresolved_remains_unknown",
        "leanSourceContractionPhaseRuntimeAllRawInputsCovered": true,
        "leanSourceContractionPhaseRuntimeActualSourceHistoryDerived": true,
        "leanSourceContractionPhaseRuntimePhysicalFiniteMachinesProved": true,
        "leanSourceContractionPhaseRuntimeOriginalEncodedInputBoundsProved": true,
        "leanSourceContractionPhaseRuntimeTerminalModelStillRequired": true,
        "leanSourceContractionPhaseRuntimeAdditionalRequestAssemblerProved": false,
        "leanSourceContractionPhaseRuntimeAllInputResidualDecisionProved": false,
        "leanSourceContractionPhaseRuntimeUnconditionalZeroSlackProved": false,
        "leanSourceContractionPhaseRuntimeExactPolynomialPCCMinProved": false,
        "leanSourceContractionPhaseRuntimeScope": "all-bitstring-closed-source-construction-polynomial-physical-time-and-output-source-derived-history-exact-closed-replay-original-input-runtime-source-checker-accepted-recovered-certificate-terminal-model-still-required-unknown-preserved-no-complete-solver"
      },
      "theorems": {
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.recover_certificate": {
          "hash": "a320c05a80a4a0951b93009b95e4179ea06e6bd7c51c9cabdda58637a104edff",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.recover_certificate_runtime": {
          "hash": "432a767ef7b68c01ec9e3a3fd8114cbbfdc1a59b5a3d92c0dcf6d683d838184e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.recovery_output": {
          "hash": "7248717e1a262de13d38d8e4525a5d780165c6b48f179b4a1ec126e432866c8c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.replay_halts": {
          "hash": "b89c2d653dd54aa82a501f7d5726fd4126e1f463c88b55705dd1daddeec398aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.replay_output": {
          "hash": "9c8849c7e1383e69c088202e27e046276f1493e2adb710b43c203ec0d41e2778",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.replay_output_size": {
          "hash": "791644b399d0d0bc3922e56ad1a0399a1fa93f11f3829bb24b2349c59a066830",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_halts": {
          "hash": "e7bd6b0d619294076503501f19431027cb065e69038d5ccc198de5cc5fb6e917",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_output": {
          "hash": "d8ed882a97b60325d2b48e78eb82fd73e22b7d5253153784f6b93b9a9b202d1c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_output_size": {
          "hash": "6637fc136f9c081fba0212f73ff0e77767365261d9734fdedcc4d429d19616ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_satisfiability": {
          "hash": "2a60146e38b983c759bdd0e4c0cb79086e4486edb7e10aaf2f0090898f1c754e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.source_system_output": {
          "hash": "1cf01fea09426013082e253bd429b7e06e2145e4ea1fa92741c3ec0bf347de7a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReductionRuntime.unresolved_remains_unknown": {
          "hash": "f8feb147b0cd20db911718ab0519586fae037b6d608c7127869304a49101eb5b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReductionRuntime"
        },
        "PNP.Concrete.ResidualReduction.SourceReplayEndpointBudget.native_project_run": {
          "hash": "b1c471fb2a905880ac629544415c5813ca3c7241e057a18fe9071712924059ab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReplayEndpointBudget"
        },
        "PNP.Concrete.ResidualReduction.SourceReplayEndpointGenerated.project_recover_model": {
          "hash": "4d5e8455bd030e23244cba096222fffe33af60c033049ddd4e44923e0b5c411c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReduction.SourceReplayEndpointGenerated"
        }
      },
      "verification": {
        "status": "formalized-foundation-only",
        "earned": true,
        "allPresent": true,
        "allAssumptionFree": false,
        "allKernelTypesMatch": true,
        "axiomClosureUsesOnlyLeanStandardAllowlist": true,
        "sourceClosureFingerprintMatches": true
      }
    }
  ]
});

export const M284_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M284_BATCH.milestones.map(row => row.fields)));
export const M284_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M284_BATCH.milestones.map(row => row.theorems)));

export const M284_BATCH_SCOPE_SUFFIX = '+plus-' + M284_BATCH.milestones.map(row => row.id).join('+plus-');

const same0 = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const require0 = (condition, layer, milestone, detail, kind = 'boundary') => {
  if (!condition) throw new Error(`${layer} M${milestone.number} ${detail} ${kind} mismatch`);
};
const fingerprint0 = row => createHash('sha256').update(
  'PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n' +
  'milestone-theorem-type:' + row.name + '\n' + row.kernelType
).digest('hex');

function checkMilestone0(actual, expected, layer) {
  require0(actual && actual.id === expected.id
    && actual.title === expected.title && actual.classification === expected.classification
    && actual.scope === expected.scope && actual.nonClaim === expected.nonClaim
    && same0(actual.requiredTheorems, Object.keys(expected.theorems)),
  layer, expected, 'milestone');
}

export function assertM284BatchPublicationMap(map) {
  for (const expected of M284_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM284BatchStatus(status) {
  for (const expected of M284_BATCH.milestones) {
    const rows = status?.formalPublicationMilestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'status', expected, 'milestone count');
    const row = rows[0];
    checkMilestone0(row, expected, 'status');
    for (const [key, value] of Object.entries(expected.verification))
      require0(same0(row[key], value), 'status', expected, key);
    for (const [key, value] of Object.entries(expected.fields))
      require0(same0(status[key], value), 'status', expected, key, 'evidence');
    require0(same0(row.theoremRows?.map(proof => proof.name), Object.keys(expected.theorems)),
      'status', expected, 'theorem set');
    for (const proof of row.theoremRows) {
      const specification = expected.theorems[proof.name];
      require0(proof.present === true && proof.kind === 'theorem'
        && same0(proof.axioms, specification.axioms)
        && proof.actualKernelTypeSha256 === specification.hash
        && proof.expectedKernelTypeSha256 === specification.hash
        && proof.kernelTypeFingerprintMatches === true,
      'status', expected, proof.name, 'theorem');
    }
  }
}

function assertM284BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M284_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM284BatchInventory(inventory) {
  assertM284BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M284_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m284BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M284_BATCH.batchId,
    reviewedSource: { ...M284_BATCH.reviewedSource },
    milestones: M284_BATCH.milestones.map(row => ({
      number: row.number, coordinate: row.coordinate, id: row.id, title: row.title,
      classification: row.classification, scope: row.scope, nonClaim: row.nonClaim,
      fields: { ...row.fields },
      theoremKernelTypeSha256: Object.fromEntries(Object.entries(row.theorems)
        .map(([name, proof]) => [name, proof.hash])),
      theoremAxioms: Object.fromEntries(Object.entries(row.theorems)
        .map(([name, proof]) => [name, [...proof.axioms]])),
    })),
  };
}

export function assertM284BatchManifest(manifest) {
  const expected = m284BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM284;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:284}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:284}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M284_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM284BrowserDescriptor() {
  return '// M284-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M284_BATCH = Object.freeze(' + JSON.stringify(M284_BATCH, null, 2) + ');\n' +
    'const FORMAL_M284_VALIDATORS = (() => {\n' +
    'const M284_BATCH = FORMAL_M284_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM284BatchStatus, assertM284BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM284BatchStatus, inventory: assertM284BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M284-BATCH-DESCRIPTOR:END';
}

export function assertM284BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M284-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M284-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM284BrowserDescriptor(),
    'browser', {number:284}, 'generated descriptor');
}
