// Reviewed compiled evidence for the M281 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M281_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m281",
  "reviewedSource": {
    "commit": "f8270c12d163bdd8457131d42bf6dcd3ccea3a28",
    "tree": "d72c0698e791605c92438a9fd4daf59406a2e75a",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-13-281"
  },
  "milestones": [
    {
      "number": 281,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-10-13-281",
      "id": "complete-serialized-source-normalizer",
      "title": "Complete polynomial source-derived serialized normalizer",
      "classification": "formalized-foundation-only",
      "scope": "For every source bitstring, a concrete finite-machine refinement computes the complete source-derived serialized normalization packet and halts within a polynomial in the encoded input length. The packet has a polynomial encoded-size bound, strict decode roundtrip and malformed-input convention. Its encoded certificate language is equivalent to CNFSAT on that same input; satisfiable inputs have a certificate of at most 30 times the input length plus 12 bits. Every system packet retains all residual equations, and every model packet yields a satisfying source assignment. The packaged polynomial reduction uses the actual serialized machine output. No construction, completeness or correctness certificate is supplied by a caller.",
      "nonClaim": "This constructs and encodes an equivalent residual problem; a system packet is not an unsatisfiability verdict. Short certificate existence does not provide certificate discovery. The result does not implement the manuscript NormalizeOrGain minimizer, solve all residual systems, establish global route coverage or unconditional ZeroSlack, or prove exact polynomial PCCMin. Its polynomial bounds cover the complete normalizer, not a complete SAT solver. Deterministic CNFSAT membership in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanSerializedNormalizerFormalized": true,
        "leanSerializedNormalizerAxiomAuditPassed": true,
        "leanSerializedNormalizerAuditedDeclarationCount": 12,
        "leanSerializedNormalizerExactMachineOutputTheorem": "PNP.Concrete.SerializedNormalizer.output_eq",
        "leanSerializedNormalizerPolynomialHaltingTheorem": "PNP.Concrete.SerializedNormalizer.halts",
        "leanSerializedNormalizerOutputSizeTheorem": "PNP.Concrete.SerializedNormalizer.output_size",
        "leanSerializedNormalizerSparseEncodedSizeTheorem": "PNP.Concrete.SerializedNormalizer.sparse_output_size",
        "leanSerializedNormalizerStrictPacketRoundtripTheorem": "PNP.Concrete.SerializedNormalizer.decode_output",
        "leanSerializedNormalizerSatisfiabilityTheorem": "PNP.Concrete.SerializedNormalizer.satisfiability_iff",
        "leanSerializedNormalizerShortCertificateTheorem": "PNP.Concrete.SerializedNormalizer.certificate_bound",
        "leanSerializedNormalizerMalformedInputsTheorem": "PNP.Concrete.SerializedNormalizer.malformed_output",
        "leanSerializedNormalizerCompleteSystemTheorem": "PNP.Concrete.SerializedNormalizer.residual_system_iff",
        "leanSerializedNormalizerSourceModelTheorem": "PNP.Concrete.SerializedNormalizer.model_sound",
        "leanSerializedNormalizerReductionMachineCorrespondenceTheorem": "PNP.Concrete.SerializedNormalizer.reduction_output",
        "leanSerializedNormalizerConcreteReductionTheorem": "PNP.Concrete.SerializedNormalizer.reduction_correct",
        "leanSerializedNormalizerAllSourceBitstringsCovered": true,
        "leanSerializedNormalizerDataDerivedFromSource": true,
        "leanSerializedNormalizerCompletePacketSerialized": true,
        "leanSerializedNormalizerLiteralFiniteMachineRefinement": true,
        "leanSerializedNormalizerEncodedInputPolynomialRuntimeProved": true,
        "leanSerializedNormalizerEncodedOutputBoundProved": true,
        "leanSerializedNormalizerShortCertificateExistenceProved": true,
        "leanSerializedNormalizerCertificateDiscoveryAlgorithmProved": false,
        "leanSerializedNormalizerCallerSuppliedConstructionOrCorrectnessRequired": false,
        "leanSerializedNormalizerGeneralResidualSolverProved": false,
        "leanSerializedNormalizerManuscriptResidualMinimizerProved": false,
        "leanSerializedNormalizerUnconditionalZeroSlackProved": false,
        "leanSerializedNormalizerExactPolynomialPCCMinProved": false,
        "leanSerializedNormalizerConcreteCNFSATInPProved": false,
        "leanSerializedNormalizerRuntimeExecutionIsProofAuthority": false,
        "leanSerializedNormalizerScope": "all-source-bitstrings-complete-derived-serialized-packet-literal-machine-encoded-polynomial-runtime-output-bound-exact-sat-certificate-language-no-certificate-discovery-residual-solver-manuscript-minimization-or-p-equals-np"
      },
      "theorems": {
        "PNP.Concrete.SerializedNormalizer.certificate_bound": {
          "hash": "656bbbe55cd7255d0872c586a6ed36d5d109df6f392dd3c116ffa4b39822b7d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.decode_output": {
          "hash": "7f3dafa95c79e7c7022025d22e6cac37279dacc0204185bdfca7b98d161cad52",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.halts": {
          "hash": "fd65f0cfea9b32bc1c710a159344869e569f5bd15233efbdd77aaaa700ab7361",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.malformed_output": {
          "hash": "3a8ae268d526f5b8135f3f7fed8e416b65552d98396d566907d9558066469437",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.model_sound": {
          "hash": "096788fa93b78b5c9c56ff979747ad8507c4f346f9d948916d7b454e876c85b3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.output_eq": {
          "hash": "bbc924774cc8542e63b4d46ace598eb0029f00bc423a10f5830419f2f00de860",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.output_size": {
          "hash": "da55366f36cef5ad1bb917c377e7a68b4e9497773c544be2fe2ee74e9697d7fa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.reduction_correct": {
          "hash": "5085e9b0fc9be9894b78e6c84da5c2995d40d7352edeabb12857d999199bc078",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.reduction_output": {
          "hash": "50cd8db031d4e01f16259750f15a0b685d520cc1328415f3bc7e33e0ad411777",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.residual_system_iff": {
          "hash": "9b037e351a17b5d6fd8b1f3e6bd053bacd98602314cd717778555ceeb2ee064b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.satisfiability_iff": {
          "hash": "936aa81b54397bb6a89b928b28c67babaca208f1334687c25f599c68721f72ce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
        },
        "PNP.Concrete.SerializedNormalizer.sparse_output_size": {
          "hash": "847c715bb6396f60bf652a09c127becc897d5b25f6280e0228fa6e217c86ac00",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Concrete.SerializedNormalizer"
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

export const M281_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M281_BATCH.milestones.map(row => row.fields)));
export const M281_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M281_BATCH.milestones.map(row => row.theorems)));

export const M281_BATCH_SCOPE_SUFFIX = '+plus-' + M281_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM281BatchPublicationMap(map) {
  for (const expected of M281_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM281BatchStatus(status) {
  for (const expected of M281_BATCH.milestones) {
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

function assertM281BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M281_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM281BatchInventory(inventory) {
  assertM281BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M281_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m281BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M281_BATCH.batchId,
    reviewedSource: { ...M281_BATCH.reviewedSource },
    milestones: M281_BATCH.milestones.map(row => ({
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

export function assertM281BatchManifest(manifest) {
  const expected = m281BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM281;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:281}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:281}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M281_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM281BrowserDescriptor() {
  return '// M281-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M281_BATCH = Object.freeze(' + JSON.stringify(M281_BATCH, null, 2) + ');\n' +
    'const FORMAL_M281_VALIDATORS = (() => {\n' +
    'const M281_BATCH = FORMAL_M281_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM281BatchStatus, assertM281BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM281BatchStatus, inventory: assertM281BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M281-BATCH-DESCRIPTOR:END';
}

export function assertM281BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M281-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M281-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM281BrowserDescriptor(),
    'browser', {number:281}, 'generated descriptor');
}
