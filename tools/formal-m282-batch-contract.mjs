// Reviewed compiled evidence for the M282 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M282_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m282",
  "reviewedSource": {
    "commit": "7f57cbda41e5911970c838697e87d51706c79e3c",
    "tree": "2c61c88e30b8c32a7d7fce126fa4cb8036a9246f",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-15-282"
  },
  "milestones": [
    {
      "number": 282,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-15-282",
      "id": "source-bound-partial-residual-reducer",
      "title": "Source-bound partial residual reduction and certificate recovery",
      "classification": "formalized-foundation-only",
      "scope": "For every native sparse residual system, a computed translation retains all positive, linear and product constraints, including duplicate-term parity and coordinate order. A dimension-decreasing source-derived chain preserves models, links every step to its preceding residual, preserves the row count, and supplies inverse parameter and satisfying-source maps. For every original bitstring whose actual serialized normalizer output decodes to a system, the remaining core is satisfiable exactly when that original input is in CNFSAT; a remaining model reconstructs a correctly sized encoded certificate accepted by the actual output checker. The original-input partial verdict is sound for both true and false answers and returns unknown when positive dimension remains. At most 30 times the source bitstring length plus 12 reductions occur; this bounds steps, not execution work. No chosen contraction, family, route coverage certificate or correctness premise is supplied by a caller.",
      "nonClaim": "Stopping exhausts the computed finite affine/line/plane selector menu, not the whole class of possible contractions. An unknown core can be satisfiable or unsatisfiable; useful reduction on every instance and all-input decision are not proved. The chain-length bound is not a polynomial bound on total encoded construction, storage or runtime. This is not the completed manuscript residual-band minimizer, unconditional SaturatePositive, BCELReady or ZeroSlack, exact polynomial PCCMin, deterministic CNFSAT membership in P, or the eligible root theorem. P = NP is not proved.",
      "fields": {
        "leanSourceBoundResidualReducerFormalized": true,
        "leanSourceBoundResidualReducerAxiomAuditPassed": true,
        "leanSourceBoundResidualReducerAuditedDeclarationCount": 16,
        "leanSourceBoundResidualReducerCompleteSystemTheorem": "PNP.Concrete.ResidualReducer.source_family_iff",
        "leanSourceBoundResidualReducerSourceRowCountTheorem": "PNP.Concrete.ResidualReducer.source_family_rows",
        "leanSourceBoundResidualReducerResidualRowCountTheorem": "PNP.Concrete.ResidualReducer.result_rows",
        "leanSourceBoundResidualReducerModelPreservationTheorem": "PNP.Concrete.ResidualReducer.model_preservation",
        "leanSourceBoundResidualReducerParameterInverseTheorem": "PNP.Concrete.ResidualReducer.parameter_roundtrip",
        "leanSourceBoundResidualReducerSourceModelInverseTheorem": "PNP.Concrete.ResidualReducer.source_model_roundtrip",
        "leanSourceBoundResidualReducerLinkedTraceTheorem": "PNP.Concrete.ResidualReducer.trace_linked",
        "leanSourceBoundResidualReducerDimensionAccountingTheorem": "PNP.Concrete.ResidualReducer.dimension_accounting",
        "leanSourceBoundResidualReducerSelectorStoppingTheorem": "PNP.Concrete.ResidualReducer.terminal",
        "leanSourceBoundResidualReducerSourceSatisfiabilityTheorem": "PNP.Concrete.ResidualReducer.residual_source_iff",
        "leanSourceBoundResidualReducerEncodedCertificateRecoveryTheorem": "PNP.Concrete.ResidualReducer.recover_certificate",
        "leanSourceBoundResidualReducerSourceStepBoundTheorem": "PNP.Concrete.ResidualReducer.step_bound",
        "leanSourceBoundResidualReducerActualPacketDecisionTheorem": "PNP.Concrete.ResidualReducer.decision_packet",
        "leanSourceBoundResidualReducerTrueSoundnessTheorem": "PNP.Concrete.ResidualReducer.decision_true_sound",
        "leanSourceBoundResidualReducerFalseSoundnessTheorem": "PNP.Concrete.ResidualReducer.decision_false_sound",
        "leanSourceBoundResidualReducerUnknownTheorem": "PNP.Concrete.ResidualReducer.decision_unknown",
        "leanSourceBoundResidualReducerAllSourceBitstringsCovered": true,
        "leanSourceBoundResidualReducerCompleteNativeConstraintsRetained": true,
        "leanSourceBoundResidualReducerDataDerivedFromSource": true,
        "leanSourceBoundResidualReducerLinkedRepeatedReductionProved": true,
        "leanSourceBoundResidualReducerSatisfyingModelCertificateRecoveryProved": true,
        "leanSourceBoundResidualReducerSourceEncodedStepCountBoundProved": true,
        "leanSourceBoundResidualReducerCallerSuppliedConstructionOrCorrectnessRequired": false,
        "leanSourceBoundResidualReducerPositiveDimensionRemainsUnknown": true,
        "leanSourceBoundResidualReducerWholeContractionClassCompletenessProved": false,
        "leanSourceBoundResidualReducerAllInputResidualDecisionProved": false,
        "leanSourceBoundResidualReducerGeneralPolynomialRuntimeProved": false,
        "leanSourceBoundResidualReducerGeneralEncodedSizeBoundProved": false,
        "leanSourceBoundResidualReducerManuscriptResidualMinimizerProved": false,
        "leanSourceBoundResidualReducerGlobalRouteCoverageProved": false,
        "leanSourceBoundResidualReducerUnconditionalZeroSlackProved": false,
        "leanSourceBoundResidualReducerExactPolynomialPCCMinProved": false,
        "leanSourceBoundResidualReducerConcreteCNFSATInPProved": false,
        "leanSourceBoundResidualReducerRuntimeExecutionIsProofAuthority": false,
        "leanSourceBoundResidualReducerScope": "all-source-bitstrings-complete-native-constraints-source-derived-model-preserving-chain-linked-history-certificate-recovery-sound-partial-verdict-explicit-unknown-source-step-count-only-no-complete-residual-decision-whole-class-coverage-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.Concrete.ResidualReducer.decision_false_sound": {
          "hash": "7659aa89dcd884cfd824bf2068bf0457f81331e8c03eda0942448fde04a63b5b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.decision_packet": {
          "hash": "bd6c2ff99b86af77f392a8664964622be25c76f1dbc3e1f3dbd691a939ba1c62",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.decision_true_sound": {
          "hash": "063c912d84958f6e49e7dad9c9c8db6a91135a26bc341908fa1ec3f578b556a5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.decision_unknown": {
          "hash": "b715ecc4a0aabab250a2bd5c4742fbc4678d625d4abbfc81aaca9861605c8cdb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.dimension_accounting": {
          "hash": "80b578136995d510d349ab0fbc21e90108d2c3c7e374bb3a97db88e51d761e9d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.model_preservation": {
          "hash": "3fb80e01e0a01c66c4230d3650fc5153ef9b1648c68ceab5b5753e78dcfab7ec",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.parameter_roundtrip": {
          "hash": "038ddd83c7cabd1af77ffbbbdbf4eb564f52a16c9a2dc47ed5c478234c5b10db",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.recover_certificate": {
          "hash": "644da333dc86f56baab0e379a0addbdba57d7a48b52a7650ba813720fd78872b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.residual_source_iff": {
          "hash": "8c126421d3ceaf637cb0581d8fb3a6547f8e3cb190a4a19b60bc3b4772efecb0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.result_rows": {
          "hash": "bc62e431ee82348ea56998d66e35ba11dc58aa8ba04b4d51377cb9a4f3777f81",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.source_family_iff": {
          "hash": "258e2dd888772eb844d2a8a589b48d91e3890ca9ce11d4e581312c5c6c4d2139",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.source_family_rows": {
          "hash": "8557f69a67b37eee88c41368dd399d3bd4005c07627de2b7adee007ea331fd9c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.source_model_roundtrip": {
          "hash": "4cb8f56cc8b6c1b7fc7465a82da6c3c87722e35cda3572f252f72152dd6d65b5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.step_bound": {
          "hash": "901e5420db235aa2c64892dd1748387c48cd4579adf5f8ac86aca4b8a77a4775",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.terminal": {
          "hash": "62c8f8b85053c98535224719e82641fcd018fd23f59bee77ae5676dd94c9328b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
        },
        "PNP.Concrete.ResidualReducer.trace_linked": {
          "hash": "2da8089f4b90238d8f535053f1bbf75f371eb358643e22a85d740cf735956797",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.ResidualReducer"
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

export const M282_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M282_BATCH.milestones.map(row => row.fields)));
export const M282_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M282_BATCH.milestones.map(row => row.theorems)));

export const M282_BATCH_SCOPE_SUFFIX = '+plus-' + M282_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM282BatchPublicationMap(map) {
  for (const expected of M282_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM282BatchStatus(status) {
  for (const expected of M282_BATCH.milestones) {
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

function assertM282BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M282_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM282BatchInventory(inventory) {
  assertM282BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M282_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m282BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M282_BATCH.batchId,
    reviewedSource: { ...M282_BATCH.reviewedSource },
    milestones: M282_BATCH.milestones.map(row => ({
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

export function assertM282BatchManifest(manifest) {
  const expected = m282BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM282;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:282}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:282}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M282_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM282BrowserDescriptor() {
  return '// M282-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M282_BATCH = Object.freeze(' + JSON.stringify(M282_BATCH, null, 2) + ');\n' +
    'const FORMAL_M282_VALIDATORS = (() => {\n' +
    'const M282_BATCH = FORMAL_M282_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM282BatchStatus, assertM282BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM282BatchStatus, inventory: assertM282BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M282-BATCH-DESCRIPTOR:END';
}

export function assertM282BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M282-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M282-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM282BrowserDescriptor(),
    'browser', {number:282}, 'generated descriptor');
}
