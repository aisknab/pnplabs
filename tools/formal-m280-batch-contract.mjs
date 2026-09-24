// Reviewed compiled evidence for the M265-M280 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M280_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m265-m280",
  "reviewedSource": {
    "commit": "f14cb7a87004ebedfa55351f6ba20d68a333cc18",
    "tree": "1cbaf64d8a7303b154848ec73f38e85e406defca",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-20-280"
  },
  "milestones": [
    {
      "number": 265,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-16-265",
      "id": "computed-r7-history",
      "title": "Source-derived R7 discharge in raw computational histories",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational carriers, support lists and raw-event dimensions, R7 decodes every gate, boundary and interface coordinate against the immutable carrier of the identified open creation. Whole lists round-trip without dropping or substituting coordinates. Recognition succeeds exactly when decoding succeeds and the actual completed boundary has at most one port. The replacement is computed from that source's complete zero/unary open function, never from a supplied implementation, truth table or correctness certificate. Labelled dependency bounds follow the actual topological compiler and the literal replacement, not Boolean equivalence alone. The resulting full-field materializer discharges the exact captured creation, charges every appended gate, preserves ordinary outputs and other pending snapshots, and preserves the current-and-snapshot causal invariant. The extended raw R5/R6/R7/R8 history retains full lifecycle closure and exact physical accounting. Every accepted closed history still admits the literal one-copy ambient splice without an additional supplied rank, order, agreement or successful-compilation premise; strict gain requires actual removals to exceed all charges.",
      "nonClaim": "This is the zero/unary R7 extension of the computational history language, not the complete manuscript R1-R9 or N1-N10 calculus, arbitrary observers, noncomputational carriers, full-profile compatibility, matched-kappa Pull/Expand or complete Package E. Support coordinates and raw events remain input data; the result does not derive terminal families or a globally successful rewrite strategy. Global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete encoded-input polynomial runtime, output and certificate bounds remain open. Boolean soundness alone does not bound syntactic dependencies. Materialization can increase physical size, and finite runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanComputedR7HistoryFormalized": true,
        "leanComputedR7HistoryAxiomAuditPassed": true,
        "leanComputedR7HistoryAuditedDeclarationCount": 41,
        "leanComputedR7HistoryActualCompilerDependencyBoundTheorem": "PNP.DirectWire.RawNandCausalBound.compile_bounds",
        "leanComputedR7HistoryWholeCarrierDependencyBoundTheorem": "PNP.DirectWire.WireUnaryCausalBound.expanded_causalBounds",
        "leanComputedR7HistoryRawRecordRoundTripTheorem": "PNP.DirectWire.WireObligationHistory.decodeRecord_encode",
        "leanComputedR7HistoryRawRecordSourceTheorem": "PNP.DirectWire.WireObligationHistory.decodeRecord_source",
        "leanComputedR7HistoryRawListRoundTripTheorem": "PNP.DirectWire.WireObligationHistory.decodeRecords_encode",
        "leanComputedR7HistoryRawListSourceTheorem": "PNP.DirectWire.WireObligationHistory.decodeRecords_source",
        "leanComputedR7HistoryRecognitionIffTheorem": "PNP.DirectWire.WireObligationHistory.computeR7_isSome_iff",
        "leanComputedR7HistoryCapturedFullValueTheorem": "PNP.DirectWire.WireObligationHistory.State.restoreR7_full_value",
        "leanComputedR7HistoryActualMaterializerChargeTheorem": "PNP.DirectWire.WireObligationHistory.State.restoreR7_gate_charge",
        "leanComputedR7HistoryOtherPendingSnapshotsTheorem": "PNP.DirectWire.WireObligationHistory.State.restoreR7_other_pending",
        "leanComputedR7HistoryTransitionCausalInvariantTheorem": "PNP.DirectWire.WireObligationHistory.State.restoreR7_causalInvariant",
        "leanComputedR7HistorySourceCreationLifecycleTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.creation_lifecycle",
        "leanComputedR7HistoryClosedHistoryCompilationTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_compiles",
        "leanComputedR7HistoryCompletePhysicalAccountingTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_exact_accounting",
        "leanComputedR7HistoryNoAdditionalRejectionTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.compile_none_iff",
        "leanComputedR7HistoryArbitraryFiniteCarrierSupportAndEventDimensionsCovered": true,
        "leanComputedR7HistoryWholeListCoordinatesPreserved": true,
        "leanComputedR7HistoryExactZeroUnaryRecognitionDerived": true,
        "leanComputedR7HistoryCapturedCreationIdentityRequired": true,
        "leanComputedR7HistoryActualComputedReplacementAndMaterializerUsed": true,
        "leanComputedR7HistoryCurrentAndPendingSnapshotCausalBoundsDerived": true,
        "leanComputedR7HistoryCompleteMaterializerChargesIncluded": true,
        "leanComputedR7HistoryLiteralOneCopySpliceAddsNoRejection": true,
        "leanComputedR7HistoryCallerSuppliedReplacementRequired": false,
        "leanComputedR7HistoryCallerSuppliedTruthTableRequired": false,
        "leanComputedR7HistoryCallerSuppliedRankOrOrderRequired": false,
        "leanComputedR7HistoryCallerSuppliedSemanticCertificateRequired": false,
        "leanComputedR7HistoryBooleanEquivalenceAloneBoundsDependencies": false,
        "leanComputedR7HistorySupportRecordsAndRawEventsDerivedFromEveryInput": false,
        "leanComputedR7HistoryFullManuscriptR7SemanticsProved": false,
        "leanComputedR7HistoryAllManuscriptRewriteAndNormalizationFamiliesProved": false,
        "leanComputedR7HistoryArbitraryObserverOrFullProfileTransportProved": false,
        "leanComputedR7HistoryCompletePackageEProved": false,
        "leanComputedR7HistoryTerminalFamiliesDerived": false,
        "leanComputedR7HistoryGloballySuccessfulRewriteStrategyDerived": false,
        "leanComputedR7HistoryGlobalRouteCoverageProved": false,
        "leanComputedR7HistoryUnconditionalSaturatePositiveProved": false,
        "leanComputedR7HistoryUnconditionalBCELReadyProved": false,
        "leanComputedR7HistoryUnconditionalZeroSlackProved": false,
        "leanComputedR7HistoryExactGeneralPCCMinProved": false,
        "leanComputedR7HistoryPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanComputedR7HistoryRuntimeExecutionIsProofAuthority": false,
        "leanComputedR7HistoryScope": "arbitrary-finite-computational-carriers-raw-record-lists-exact-zero-unary-recognition-source-derived-R7-captured-creation-full-discharge-actual-materializer-charges-derived-causality-closed-R5-R6-R7-R8-histories-literal-one-copy-splice-no-new-rejection-no-derived-global-strategy-or-complete-manuscript-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.RawNandCompilationState.finish_position": {
          "hash": "d132e92cc600951248a7c4d18ccd2536f545fb5d637d63901fe5884e22a78e99",
          "axioms": [],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.RawNandCausalBound.compile_bounds": {
          "hash": "6d644822bc7e6a5a5a86b5ba70e882dd3bb62616ad979df6462bad85e5a2273b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalCausalBounds"
        },
        "PNP.DirectWire.RawNandCausalBound.candidate_bound": {
          "hash": "b4bcf059257172153564d9ad29ab2c7d5b689469ab3e48974667f80cf6cc5ba6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalCausalBounds"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_dependency_bounds": {
          "hash": "e55461cefebaf2cce8759494d7894d57cd953c21a29f377c6eb8f5ae94fa87cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.result_output_dependency_bound": {
          "hash": "0bb8f943b2343b78770051263c7cbf575d5fac297e15fb5f5fa7f35ccdf34006",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.WireUnaryCausalBound.implementation_output_bound": {
          "hash": "a498c50f7907bc63d7de888a5055f6a59a7c1a31fe59a596855f1a5e95af7f68",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.constantWord_output_bound": {
          "hash": "6d8fbf7f8d2490aaa8e0d1ed8c4a19fa3d6c4c3e4a1ee38659907a7c980373d5",
          "axioms": [],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.localWord_output_bound": {
          "hash": "3a1a2b6d7ff7e15070ed812ed62d0cfec00883d78001d1fdef272391807996cd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.arbitrary_replacement_output_bound": {
          "hash": "cfda0022edafc82313990497df2a60e3fa9d8a719157700cb89be2722fb8a263",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.compiled_spec": {
          "hash": "d4d6651356de9cf54f61e97387ea2ff19fdc85a78ee619f4c998828a25811765",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.replacement_dependency_bound": {
          "hash": "db56391c15729c5acf6174ae0832aec317ce7073f46eb95eb69ecb4912f141ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.expanded_exposed_bound": {
          "hash": "808d3b5c4ea0f2dcf19d291734763344fdad5f318aad9383d0d674e4992cda8f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.expanded_causalBounds": {
          "hash": "ff684b781c2202031f4c0a68b677fe598fe7b176df45488c5aaf65fabfabcfe7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireUnaryCausalBound.attempt_causalBounds": {
          "hash": "e9d2762c2330932afec39766a12d19b088ee74fc0f12671edf734f06d980f22f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.decodeRecord_encode": {
          "hash": "c1c1fc876e31185204ecee23a6e7b19013726a825ba08fb2a9b0ec5f045715ce",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.decodeRecord_source": {
          "hash": "08275451007126789a96f6997f750ecc028d5052524aca2ea8fc44013f381090",
          "axioms": [],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.decodeRecords_encode": {
          "hash": "b04faf388a4c7a24baa0ae7aa1d0ec33c1608a5bbb859b3ff166a0b07f1338ac",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.decodeRecords_source": {
          "hash": "4a14bb1202417fa4aa25e238d7677571d88fb29fe13b7afb110b440eadacd245",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.computeR7_isSome_iff": {
          "hash": "3903b0ad1fbbf870510cb9c7fb35ff32ec3bee103f80ec06fa6a2f67e178fe08",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.R7Realization.full_field": {
          "hash": "7699f8e957edbd66a9bc5c13240e992e05a399071c6c40bbffced57240455f19",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.R7Realization.exact_charge": {
          "hash": "3e3cd9fba51b50d94bf57a05e2ba8720a9db4283a6a8559e1863a0e28771d62d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.R7Realization.causalBounds": {
          "hash": "3ed206f861600cca01fa52d00a7494bb45615a7fb7f5a00851d8129fea8f0268",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.State.restoreR7_gate_charge": {
          "hash": "cb3ffbc194c947db003584bcb22fb2c956ad0b9e28ffe0153d5f352dcbbfe4de",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.State.restoreR7_full_value": {
          "hash": "a26fa69df0f4160df11ab52c810ee9f4f8cebc0df437f6dc25ffb1e199fce0c0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.State.restoreR7_other_pending": {
          "hash": "aa65f63e76312b2484bea839b25d493f8d4976695f5e9de8443e8697939a5fff",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryR7"
        },
        "PNP.DirectWire.WireObligationHistory.State.restoreR7_causalInvariant": {
          "hash": "f1a777649c0537a2e5d5bc5a638fd50460e249bb8860bc286003816278397557",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.causalInvariant": {
          "hash": "5e8e6b3008a3ae5e6eae219e5642bd71496d4c78a6fe24cc00f06d8579bc25c1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.causalInvariant": {
          "hash": "d766a4d18cd18b8fc41844f5862a1db0293043ad3be6711bf2f183584391b9b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.field_causal_bound": {
          "hash": "aa051739783a3bcf78c4cfd030bda11ebb4191071367ac5a9cd09d2f63f2dcb8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.full_output": {
          "hash": "b424d42f293c35731c15c87699685a7276d36f6535dc9df10d94038525f92c63",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.full_field": {
          "hash": "c693beecbd081a97a4cbb69a8d352963830e1ef59577d90930adbc208a3f111f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.gate_balance": {
          "hash": "1f6a44c3ae70e9bd68aa2f4c27ee53ca15d367bf7537504601368e758bc05207",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.creation_lifecycle": {
          "hash": "931d176535e4d513f8d0c55154d78e8ceb5046c4f00de10429bcaba5e91bbc66",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.dependency_before": {
          "hash": "eb9fd5eeb6da03880e4e567c1150d9f788db315013c32ec064dc78c0e551010d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_compiles": {
          "hash": "24628ba7c42242ba62325ae3a02a86c5da4afa69372ee4a8db95369cb2c54177",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_semantics": {
          "hash": "3ff01612253857a44f687e7850d60a8c0895046ef5ab7a5bd4190dab27453031",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_exact_accounting": {
          "hash": "ba21db1c802ed21d062b78b1a28939a1cac493aba356401f9981e460e076f323",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_strict_gain": {
          "hash": "e6abcd11b0d7e89b0c908788f665a71b2d7576be1ff9a7396e36821647e91770",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.compile_complete": {
          "hash": "e4dbaa109b94d8d0704c04d90f776e755c079b7c6e303cb5097cc985df6a6756",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.compile_sound": {
          "hash": "7f2ab5eee8236bc96b3ab1f3d1a0edb44631fef986b0c8f0a67f0f7668ba3def",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.compile_none_iff": {
          "hash": "b83a398e1ac68926f820d96f95b7e9e21042f8fabcecbbd0fad685a544eeaffb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
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
      "number": 266,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-16-266",
      "id": "source-derived-history-ownership",
      "title": "Source-derived physical ownership through computational histories",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational carriers, selected support lists and raw-event dimensions, physical origins follow the actual constant, sharing and cone compiler branches and compose through the existing normalization trace. Every initial gate retains its source coordinate; every R7/R8 appended gate is labelled by its executing event identity and local allocation coordinate. Creation, cancellation and reads allocate no gates. The complete closed history computes a duplicate-free partition of live and removed origins into original gates and all historical charges, including allocations later removed. The actual topological compiler's computed two-sided position inverse carries those labels into the literal ambient splice, with every exterior gate present once and extracted coordinates restored to ambient positions. A source-only ownership constructor returns exactly the existing constructor's result. Its disjoint raw-event requests and fixed original-gate remainder reuse the existing ownership kernel for support-stable membership, actual extracted piece sizes and charge identities, independent open semantics and induced-boundary reconnection. No owner family, provenance map, partition proof, charge amount, topological order or successful-splice certificate is supplied.",
      "nonClaim": "This is source-derived physical ownership for the existing computational history language, not the complete manuscript carrier/profile universe, all R1-R9 or N1-N10 routes, arbitrary observers, matched-kappa arbitrary-support Pull/Expand or complete Package E. Support coordinates and raw events remain input data; no terminal-derived family or globally successful history is constructed. Historical allocated size and surviving owned size are distinct, and physical identity or integer accounting does not prove a runtime bound. Global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete encoded-input polynomial runtime, output and certificate bounds remain open. Finite runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanSourceDerivedHistoryOwnershipFormalized": true,
        "leanSourceDerivedHistoryOwnershipAxiomAuditPassed": true,
        "leanSourceDerivedHistoryOwnershipAuditedDeclarationCount": 78,
        "leanSourceDerivedHistoryOwnershipTerminalExtractionPhysicalOriginTheorem": "PNP.DirectWire.terminalExtractionOrigin_gateIndex",
        "leanSourceDerivedHistoryOwnershipNormalizationPhysicalPartitionTheorem": "PNP.DirectWire.PhysicalGateProvenance.normalized_partition",
        "leanSourceDerivedHistoryOwnershipClosedHistoryPhysicalOwnershipTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.physical_ownership",
        "leanSourceDerivedHistoryOwnershipCompilerPhysicalOriginInverseTheorem": "PNP.DirectWire.CompiledRawNandGraph.position_physicalOrigin",
        "leanSourceDerivedHistoryOwnershipCompilerPhysicalOriginPermutationTheorem": "PNP.DirectWire.CompiledRawNandGraph.physicalOrigins_perm",
        "leanSourceDerivedHistoryOwnershipAmbientOriginalCoordinatePartitionTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.original_coordinate_partition",
        "leanSourceDerivedHistoryOwnershipAmbientPhysicalOwnershipTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.physical_ownership",
        "leanSourceDerivedHistoryOwnershipSourceOnlyConstructorProjectionTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.compileOwned_result",
        "leanSourceDerivedHistoryOwnershipSourceOnlyConstructorSemanticsTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.semantics",
        "leanSourceDerivedHistoryOwnershipDerivedEventRequestsDisjointTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventRequests_disjoint",
        "leanSourceDerivedHistoryOwnershipActualRawEventOwnershipTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventOwner_some_iff",
        "leanSourceDerivedHistoryOwnershipFixedRemainderTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventOwner_none_iff",
        "leanSourceDerivedHistoryOwnershipHistoricalChargeCompletenessTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.charged_origin",
        "leanSourceDerivedHistoryOwnershipSurvivingAllocationCompletenessTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.live_allocated_event",
        "leanSourceDerivedHistoryOwnershipSupportRestrictionTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.support_restrict",
        "leanSourceDerivedHistoryOwnershipActualExtractedGateCountTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_gateCount",
        "leanSourceDerivedHistoryOwnershipActualChargeIdentityTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_chargeIdentity",
        "leanSourceDerivedHistoryOwnershipWholeChargeTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_wholeCharge",
        "leanSourceDerivedHistoryOwnershipIndependentOpenSemanticsTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_semantics",
        "leanSourceDerivedHistoryOwnershipInducedBoundaryTheorem": "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_induced",
        "leanSourceDerivedHistoryOwnershipArbitraryFiniteCarrierSupportAndEventDimensionsCovered": true,
        "leanSourceDerivedHistoryOwnershipLiteralNormalizerRetainedOriginsDerived": true,
        "leanSourceDerivedHistoryOwnershipRemovedOriginsAreExactComplement": true,
        "leanSourceDerivedHistoryOwnershipExecutingEventAndLocalGateAllocationLabelsDerived": true,
        "leanSourceDerivedHistoryOwnershipHistoricalChargesSurviveLaterRemoval": true,
        "leanSourceDerivedHistoryOwnershipActualTopologicalCompilerPositionsUsed": true,
        "leanSourceDerivedHistoryOwnershipExteriorPhysicalGatesRetainedExactlyOnce": true,
        "leanSourceDerivedHistoryOwnershipDerivedEventRequestsDisjoint": true,
        "leanSourceDerivedHistoryOwnershipSupportRestrictionPreservesOwners": true,
        "leanSourceDerivedHistoryOwnershipExistingConstructorAcceptanceAndResultPreserved": true,
        "leanSourceDerivedHistoryOwnershipCallerSuppliedOwnerFamilyRequired": false,
        "leanSourceDerivedHistoryOwnershipCallerSuppliedProvenanceOrPartitionRequired": false,
        "leanSourceDerivedHistoryOwnershipCallerSuppliedChargeOrTopologicalOrderRequired": false,
        "leanSourceDerivedHistoryOwnershipCallerSuppliedSuccessfulSpliceCertificateRequired": false,
        "leanSourceDerivedHistoryOwnershipArbitraryCountPreservingPermutationIsProvenance": false,
        "leanSourceDerivedHistoryOwnershipHistoricalChargesEqualSurvivingOwnedSize": false,
        "leanSourceDerivedHistoryOwnershipSupportRecordsAndRawEventsDerivedFromEveryInput": false,
        "leanSourceDerivedHistoryOwnershipCompleteManuscriptCarrierAndRewriteCalculusProved": false,
        "leanSourceDerivedHistoryOwnershipArbitraryObserverOrFullProfileTransportProved": false,
        "leanSourceDerivedHistoryOwnershipMatchedKappaArbitrarySupportPullExpandProved": false,
        "leanSourceDerivedHistoryOwnershipCompletePackageEProved": false,
        "leanSourceDerivedHistoryOwnershipTerminalFamiliesDerived": false,
        "leanSourceDerivedHistoryOwnershipGloballySuccessfulRewriteStrategyDerived": false,
        "leanSourceDerivedHistoryOwnershipGlobalRouteCoverageProved": false,
        "leanSourceDerivedHistoryOwnershipUnconditionalSaturatePositiveProved": false,
        "leanSourceDerivedHistoryOwnershipUnconditionalBCELReadyProved": false,
        "leanSourceDerivedHistoryOwnershipUnconditionalZeroSlackProved": false,
        "leanSourceDerivedHistoryOwnershipExactGeneralPCCMinProved": false,
        "leanSourceDerivedHistoryOwnershipPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanSourceDerivedHistoryOwnershipRuntimeExecutionIsProofAuthority": false,
        "leanSourceDerivedHistoryOwnershipScope": "arbitrary-finite-computational-histories-source-derived-literal-normalization-origins-executing-event-local-allocation-labels-live-removed-charged-nodup-partition-actual-topological-splice-positions-one-copy-exterior-disjoint-derived-requests-support-stable-extracted-charges-no-supplied-owner-or-partition-no-global-strategy-or-complete-manuscript-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.PhysicalGateProvenance.constantOrigins_positions": {
          "hash": "14202cb776a0455c81fcba3d15fea773506814911656848a6cc8636189e749d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.sharingOrigins_positions": {
          "hash": "60f68297d2d2a96a4360598a88c458f8e86b23f670c78258abb0f85727446b50",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.constantOrigin_alias": {
          "hash": "ce323ad0fc1ce93cc3535dcd40d83378d998210dec0eec0cf3e4ee2d51d5f102",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.constantOrigin_injective": {
          "hash": "cb2bf5bfb8f7cccda8ee66ee5639fe74778ee3f9952af0065b9be0ce712cb86b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.sharingOrigin_alias": {
          "hash": "f4de2ba242509a73f549d1a6b3a6767c8cd574e25ff544ccee2c4dbafcb90756",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.sharingOrigin_injective": {
          "hash": "6e84cf7a936dc3bd08a2daedcbe0cffe5a3ba43e2cfb82f0e805b9ad83a21a6d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.terminalExtractionOrigin_selected": {
          "hash": "839fde82c63708bf97d462e79abe862e52c5ae551a65b697c7dd992dc083879f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalExtractionGateIndex_origin": {
          "hash": "fed7cf03f9dd9ad13a924cdb9d5fe5398186ac89b377ce95980bb9306ab72d5f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalExtractionOrigin_gateIndex": {
          "hash": "3bb4a9dabdb287a3ebbd786c2e776f052eb1e32c3515a249d1b21bd2bf268970",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalExtractionOrigin_injective": {
          "hash": "a021628c5016dfaca32528378af5b64ebdf2c5827b930d60f050b545ced48291",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.PhysicalGateProvenance.coneOrigin_selected": {
          "hash": "d1dd2a206525ba86886b904026e84b0e2e575b07838a5aa1e045ea373636a45c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.coneOrigin_position": {
          "hash": "353b4b4a6af3c9ac90d65d085709bf22832664df2705a9c855624fc168ca4714",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.coneOrigin_injective": {
          "hash": "6dcab94ea386cd755e5b09e00afff57ebda0849ff4ca0d8ba00fc419034400cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.coneOrigin_image": {
          "hash": "732d80b8c647b23629e4a15c40cba9b2eee8b7324932d67636116f919215cc7b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.passOrigin_injective": {
          "hash": "66a710bb11e3c2683bff24e48750eefbddf5c9fd4bbc35a3bbc97cd3e2f070e4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.traceOrigin_injective": {
          "hash": "f565982503263918e495a550d3975589e1c4913427ef318f4243838ebe698450",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.normalizedOrigin_injective": {
          "hash": "9ea63eb2862976756911032e5c7e341e78969ce1ca7239906820be806464f4f0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.constantOrigins_length": {
          "hash": "ff6f57ceb130fd5c7afb04483a71dd35d6c0901d1c273cb818524955d09ead78",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.constantOrigins_nodup": {
          "hash": "d460767c424f353e4fa55a4c69ed2b894cbb67a019fdfe1a6301803ee9b9d123",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.sharingOrigins_length": {
          "hash": "5d32f12f05b8d74e2189dac203a5884ffcf2901718d8df9be24197419293d6f5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.sharingOrigins_nodup": {
          "hash": "6ae2028ce506d17b29a4cae3a95608b39d08f6bcc6a6fc0c54dfac799b1d0372",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.passRemoved_iff": {
          "hash": "70ee616a83cc3c5616a1d45debdc66a6158d5d6f3e1609b3ac142527d03baf8c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.pass_partition": {
          "hash": "19e08cbec0920fb3a42b3f5410df0c3c3c8d00091d171cd2e7ccc34de44cb89f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.traceRemoved_iff": {
          "hash": "2ff537494358c31414be32cd8eaa58b43f9ea67405dd26b311796a7e1e624d20",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.trace_partition": {
          "hash": "0d582bd2528fd7cb1173fb65774e3da5243e8829a111de69ffb8e23cc295aaab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.normalizedRemoved_iff": {
          "hash": "94869e335fb1d5ccd4028d042f58947445fb81f8ec723c60f04e8c5475f0ed2b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.PhysicalGateProvenance.normalized_partition": {
          "hash": "a3bfc555871bbf9b68392988b2da985cfe197e5cee9a0160cd80a5ff9d21c7ca",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDPhysicalGateProvenance"
        },
        "PNP.DirectWire.WireObligationHistory.PhysicalOwnership.append_origin_left": {
          "hash": "9afdba03ec2436ac542988b0f652e1ec07fee4279ebac2a634d0f0f49727aada",
          "axioms": [],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.PhysicalOwnership.append_origin_right": {
          "hash": "8a444e72d3f991426deaddd21d998616fc0575df54f9ea01b2cde84388cf9e67",
          "axioms": [],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.PhysicalOwnership.append_live": {
          "hash": "257ae4df34d79ec42e4a44327a3b4c618c3d5f2d11e382373f342d1b1ed5a071",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.PhysicalOwnership.normalize_partition": {
          "hash": "e33b6b1465b29d1addb15ce74b5635bc01dbb2b87246d175759f4f3992b08868",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.PhysicalOwnership.normalize_removed_length": {
          "hash": "b33839398a6c2036a65e9d574186230707c14aa13d9d5347d23e0875f7a7dc63",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.restore_physical_positions": {
          "hash": "1956f45e49b044f0e47363773cb20232bc111f537dd5e8c3b4d2253518e728f4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.realize_physical_positions": {
          "hash": "b8ee4c2c2ab33f0846988fffe23fad6dd769b50d3e273c81cc6076e2b163af4d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.allocations_nodup": {
          "hash": "1cc162937cabc1604fac30a36d0e05242f00184b8047a6a9384229c71be48c6e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.physical_charged": {
          "hash": "b2467ea4d5c663e9363d8353f0bb574a80d4efe248407114087ceeef518c93fa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.physical_removed_length": {
          "hash": "ed90185d1c2b9b66735c8962d8a546e5c7e6d3ffaf62e4608cbe71007dd1cea6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.physical_conservation": {
          "hash": "931de16d0241abcd7856537a0c00ebbc51c0feb3c19da74ba2cb33599c82c5bb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.allocations_length": {
          "hash": "caaa1736988fc0acf1727ca6df8976ebbd52039a1af02bf5315fa57c5810bc04",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.physical_charged": {
          "hash": "aa253a544d843c2599c5cfea7c7e4361a0c6a36a8c6e54ef119fcb8f5197a213",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.physical_removed_length": {
          "hash": "885e29a7bb392140823615432d7bbc334d98fc330243be94a9c7da535dcdb1f3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.physical_conservation": {
          "hash": "26d8b9abec293a82e70f3133767e18713595e0fc368743a2958312519344621b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.allocations_member": {
          "hash": "ca85c7c84c8f0fb2c202aa70897f0ac49ffe907608dfef9c523a24430e438686",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.allocations_nodup": {
          "hash": "1da81f73d09754139d6dd1153d98bcc824f19cd8617d3cccea7ce4048d41c469",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.physical_charged": {
          "hash": "11d34b18ad00bfe232492981b2657aaa38448d29a69b02d34c3521bbea0a3ac4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.physical_partition": {
          "hash": "69a4fe153f6498b15ad42cd396d9a4ccb9689868282a83bae7a2c62825e34b33",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.physical_ownership": {
          "hash": "47e0d3740795b0ac6c3d2206c7e7f67ffe871129ecab9b086a7aa20e4469cbab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryPhysicalOwnership"
        },
        "PNP.DirectWire.CompiledRawNandGraph.position_surjective": {
          "hash": "bdb90efec30abbae02e40e5fdf44e2937615b4043eacc53238fdd5d1469b1df2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.position_physicalOrigin": {
          "hash": "17bd5509874417c33e0209722107889ccf84448981fc0ac806bac5fab7e44128",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.physicalOrigin_position": {
          "hash": "d5e36b792ea2bde2728df0bcdbfe33ec33c00944495f092370aeaed6e0ea5ec2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.physicalOrigin_injective": {
          "hash": "fc5f39e92480ba6f1db32b33ef71e6e536d504fccee0d46142b466f45d8fe933",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.physicalOrigin_surjective": {
          "hash": "6121060d68bacbcf7d7dd071175266c583036e6b96444358a070ce30ce49af78",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.physicalOrigins_nodup": {
          "hash": "f18a162a7b8d0a2a4b757528cfc8a5367c344dc8723d0b05ca319ee32ad26932",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.CompiledRawNandGraph.physicalOrigins_perm": {
          "hash": "af788ac5330f1a9894e5d23fd9fac6716d2889bb55a5c0a39b18fc4c144c53e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.RawNandCompilationState.finish_physicalOrigin": {
          "hash": "841a12140fa8ca58f426d2b749a41c61d174f5c4118442d42ce217239a80be81",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCompiledGateProvenance"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.liftOrigin_injective": {
          "hash": "a411a824f5daea7541095b83555c2f5bb3ec28a3ca93b4902058d8aa13e28858",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.original_coordinate_partition": {
          "hash": "19ab4f02338c163a8eeddf389c907c77ff6cb346374e1d6ad779f373e772a350",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.rawNodeOrigin_exterior": {
          "hash": "7efc06d7e7cdf0fa3651d5cbe32e6b83a890c9deae953225f2eec26c1e3c5478",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.rawNodeOrigin_history": {
          "hash": "6240b96751e2a302b9f580ba7147ebd7a7b9674f696f09981a5b713092309dfd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.physicalOrigin_position": {
          "hash": "951a09ce7a6c0dc86125ef5cceb8509bee4a0a31c69387cd26c3ddd4ede7e6ae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.physical_partition": {
          "hash": "08d79b70a6af3f0235c82fe4359effc9926474256122ad1e87621205a3e01804",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.physical_ownership": {
          "hash": "ff59796a5c35fe19e783817f2c8ea1610bf71bf9592e8b788bd568d77549672e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.ownership": {
          "hash": "fc89ddf7524a58178d19a3eed329a3f065749dab8e18a2f25479ba235ad2ec90",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.semantics": {
          "hash": "6b5a693f097241f0052d6850ec8432a541d396efd4815e73504e82efffc8f560",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.compileOwned_result": {
          "hash": "3bb87cf64974e0183dfc93e1165a4001c056272f6192db69348776cc1d1dc904",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryAmbientOwnership"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventRequests_member": {
          "hash": "c870ed67933c7046c7f0e6a3f7caad17ff5efab92a994030a87b5e37942fad19",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventRequests_disjoint": {
          "hash": "93875722c5ad6d4de59221bfcfc358d5f54f530710b03c825b0a15d40c1181c4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventOwner_some_iff": {
          "hash": "740e60277424d0d613588ebbbd5dae9da97faf7455071d7fe86b11fd5938718b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.charged_origin": {
          "hash": "0110c36cb44124fa20f9df5e06624f4a5c4d0f98b478adc28f68716b5a64ba83",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.live_allocated_event": {
          "hash": "880f9a64edab53563ad11ffd5106141ec93382ef98a262bffb3735b107e94ac6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.eventOwner_none_iff": {
          "hash": "44e30563a74c0498db9ed3f3b9695a054fdbe9d723dd27a702548a41678ad973",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.support_membership": {
          "hash": "c97c0c701f73ec13c324995db71f5dc416f0e9125a2c547401528cafd1a5ef04",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.support_restrict": {
          "hash": "2bc506ad56be16661b29a289e812f0191df18d6d8dc2c4f32b875b102e023441",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_gateCount": {
          "hash": "3bd6d2569d30d2551daf928ee38946dd8a97ecb8d535db76e5f67e113afbac55",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_chargeIdentity": {
          "hash": "e2a7325d41ee818ba8af3312e37ebd04063d120ff374f4aded29849d87be08a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_wholeCharge": {
          "hash": "6d45667f0679b22ab40dc76cd7659fc2910fdd15894420f0544fbc0ba1db17fb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_semantics": {
          "hash": "3f169574895f1e4073b50191f7a9cc91ebbb6e0420518abaf7e09983b7d4e134",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
        },
        "PNP.DirectWire.WireHistoryAmbientOwnership.OwnedCompilation.materializer_induced": {
          "hash": "e1cf5862c73cef7279c68ee5fd011ac0ce7ac018e324b1085a966b716bebf82b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryOwnershipCharges"
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
      "number": 267,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-16-267",
      "id": "descendant-history-ownership",
      "title": "Persistent physical ownership through descendant histories",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite source dimensions and raw stage/event lists, a source-only decoder and compiler traverse the complete list using each actual preceding descendant. Persistent physical origins relabel original positions through the existing literal ambient compiler and label allocations by computed stage position, executing raw event and local gate. The arbitrary-program theorem conserves original gates and every historical charge as a duplicate-free live/removed permutation with exact actual execution totals; later removal never erases an earlier charge. Accepted input-event keys are distinct across stages, even when local event numbers are reused, and every historical or surviving allocation traces to that raw family. Derived final owner requests are disjoint before support selection and reuse the existing extraction kernel for support-stable ownership, exact piece sizes and charges, open semantics and induced reconnection. Whole-program Boolean semantics and physical size accounting yield an optional final StrictEquivalentGain through a computed final-size comparison, permitting intermediate expansion and propagating every rejected stage. No intermediate implementation, owner family, provenance map, charge amount, rank, successful-history certificate or semantic oracle is supplied.",
      "nonClaim": "This covers arbitrary finite sequences of the existing closed computational-history compilations, not the full manuscript carrier/profile universe, cross-support transport of open obligations, all R1-R9 or N1-N10 rules, matched-kappa arbitrary-support Pull/Expand, proper-support VerifyDW, full ChargeSoundness or complete Package E. Raw supports and events remain inputs; no terminal-derived family or globally successful strategy is constructed. Final net gain does not require each stage to decrease, prove local minimality after rejection, bound temporary growth or establish encoded-input polynomial runtime. Global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete polynomial runtime, output and certificate bounds remain open. Runtime fixtures are regression evidence, not theorem authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanDescendantHistoryOwnershipFormalized": true,
        "leanDescendantHistoryOwnershipAxiomAuditPassed": true,
        "leanDescendantHistoryOwnershipAuditedDeclarationCount": 84,
        "leanDescendantHistoryOwnershipRawRecordRoundTripTheorem": "PNP.DirectWire.WireDescendantHistory.decodeRecords_encode",
        "leanDescendantHistoryOwnershipRawRecordSourceTheorem": "PNP.DirectWire.WireDescendantHistory.decodeRecords_source",
        "leanDescendantHistoryOwnershipRawEventRoundTripTheorem": "PNP.DirectWire.WireDescendantHistory.decodeEvents_encode",
        "leanDescendantHistoryOwnershipRawEventSourceTheorem": "PNP.DirectWire.WireDescendantHistory.decodeEvents_source",
        "leanDescendantHistoryOwnershipActualStageResultTheorem": "PNP.DirectWire.WireDescendantHistory.StageCompilation.existing_result",
        "leanDescendantHistoryOwnershipLiteralPhysicalPositionTheorem": "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_physicalOrigin_position",
        "leanDescendantHistoryOwnershipOriginalCoordinateLiftTheorem": "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.liftOrigin_original",
        "leanDescendantHistoryOwnershipAllocatedCoordinateLiftTheorem": "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.liftOrigin_allocated",
        "leanDescendantHistoryOwnershipPhysicalOwnershipTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.physical_ownership",
        "leanDescendantHistoryOwnershipPhysicalOriginInjectiveTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_origin_injective",
        "leanDescendantHistoryOwnershipCompleteProgramSemanticsTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.semantics",
        "leanDescendantHistoryOwnershipActualExecutionSizeBalanceTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.gate_balance",
        "leanDescendantHistoryOwnershipHistoricalChargePersistenceTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_charge_survives",
        "leanDescendantHistoryOwnershipInvalidLaterStagePropagationTheorem": "PNP.DirectWire.WireDescendantHistory.compile_tail_none",
        "leanDescendantHistoryOwnershipRawEventKeyDistinctnessTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.inputEventKeys_nodup",
        "leanDescendantHistoryOwnershipHistoricalChargeRawEventTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_charged_origin",
        "leanDescendantHistoryOwnershipSurvivingAllocationRawEventTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_live_allocated_event",
        "leanDescendantHistoryOwnershipDerivedEventRequestsDisjointTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventRequests_disjoint",
        "leanDescendantHistoryOwnershipActualRawEventOwnershipTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventOwner_some_iff",
        "leanDescendantHistoryOwnershipFixedOriginalRemainderTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventOwner_none_iff",
        "leanDescendantHistoryOwnershipSupportRestrictionTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.support_restrict",
        "leanDescendantHistoryOwnershipExtractedGateCountTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_gateCount",
        "leanDescendantHistoryOwnershipExtractedChargeIdentityTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_chargeIdentity",
        "leanDescendantHistoryOwnershipWholeSurvivingChargeTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_wholeCharge",
        "leanDescendantHistoryOwnershipOpenPieceSemanticsTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_semantics",
        "leanDescendantHistoryOwnershipInducedPieceBoundaryTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_induced",
        "leanDescendantHistoryOwnershipFinalNetGainTheorem": "PNP.DirectWire.WireDescendantHistory.GainResult.strictGain",
        "leanDescendantHistoryOwnershipFinalResidualDescentTheorem": "PNP.DirectWire.WireDescendantHistory.GainResult.strictResidualDescent",
        "leanDescendantHistoryOwnershipFinalGainAcceptanceIffTheorem": "PNP.DirectWire.WireDescendantHistory.compileGain_exists_iff",
        "leanDescendantHistoryOwnershipArbitraryFiniteDimensionsAndStageListsCovered": true,
        "leanDescendantHistoryOwnershipCurrentDescendantCoordinatesDecodedFromRawInput": true,
        "leanDescendantHistoryOwnershipActualLiteralCompilerPositionsCompose": true,
        "leanDescendantHistoryOwnershipStageEventAndLocalAllocationIdentitiesDerived": true,
        "leanDescendantHistoryOwnershipHistoricalChargesSurviveLaterRemoval": true,
        "leanDescendantHistoryOwnershipActualExecutionTotalsMatchPersistentLedger": true,
        "leanDescendantHistoryOwnershipLiveRemovedPartitionHasNoDuplicateIdentities": true,
        "leanDescendantHistoryOwnershipReusedLocalEventNumbersRemainStageDistinct": true,
        "leanDescendantHistoryOwnershipAllAllocationsTraceToActualInputEvents": true,
        "leanDescendantHistoryOwnershipDerivedEventRequestsDisjoint": true,
        "leanDescendantHistoryOwnershipSupportRestrictionPreservesOwners": true,
        "leanDescendantHistoryOwnershipMalformedLaterStageRejectsCompleteProgram": true,
        "leanDescendantHistoryOwnershipFinalNetGainAllowsIntermediateExpansion": true,
        "leanDescendantHistoryOwnershipExistingClosedLocalHistoryLanguagePreserved": true,
        "leanDescendantHistoryOwnershipCallerSuppliedIntermediateImplementationsRequired": false,
        "leanDescendantHistoryOwnershipCallerSuppliedOwnerFamilyRequired": false,
        "leanDescendantHistoryOwnershipCallerSuppliedProvenanceOrPartitionRequired": false,
        "leanDescendantHistoryOwnershipCallerSuppliedChargeOrRankRequired": false,
        "leanDescendantHistoryOwnershipCallerSuppliedSuccessfulHistoryCertificateRequired": false,
        "leanDescendantHistoryOwnershipSemanticOracleUsedByFinalGainAdapter": false,
        "leanDescendantHistoryOwnershipHistoricalChargesEqualSurvivingOwnedSize": false,
        "leanDescendantHistoryOwnershipEachIntermediateStageMustStrictlyDecrease": false,
        "leanDescendantHistoryOwnershipAcceptedPrefixReturnedAfterLaterRejection": false,
        "leanDescendantHistoryOwnershipRawStagesDerivedFromEveryInput": false,
        "leanDescendantHistoryOwnershipOpenObligationsTransportedAcrossSupports": false,
        "leanDescendantHistoryOwnershipCompleteManuscriptCarrierAndRewriteCalculusProved": false,
        "leanDescendantHistoryOwnershipMatchedKappaArbitrarySupportPullExpandProved": false,
        "leanDescendantHistoryOwnershipProperSupportVerifyDWProved": false,
        "leanDescendantHistoryOwnershipCompleteChargeSoundnessProved": false,
        "leanDescendantHistoryOwnershipCompletePackageEProved": false,
        "leanDescendantHistoryOwnershipTerminalFamiliesDerived": false,
        "leanDescendantHistoryOwnershipGloballySuccessfulRewriteStrategyDerived": false,
        "leanDescendantHistoryOwnershipGlobalRouteCoverageProved": false,
        "leanDescendantHistoryOwnershipUnconditionalSaturatePositiveProved": false,
        "leanDescendantHistoryOwnershipUnconditionalBCELReadyProved": false,
        "leanDescendantHistoryOwnershipUnconditionalZeroSlackProved": false,
        "leanDescendantHistoryOwnershipExactGeneralPCCMinProved": false,
        "leanDescendantHistoryOwnershipPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanDescendantHistoryOwnershipRuntimeExecutionIsProofAuthority": false,
        "leanDescendantHistoryOwnershipScope": "arbitrary-finite-raw-stage-sequences-actual-descendant-decoding-persistent-stage-event-local-physical-origins-exact-live-removed-historical-charge-partition-derived-input-event-owners-support-stable-extracted-charges-final-net-gain-with-intermediate-expansion-no-supplied-intermediates-or-owners-or-oracles-no-open-obligation-transport-or-global-strategy-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireDescendantHistory.decodeRecord_encode": {
          "hash": "fc87b5800aec8b69970acee761f33a36668c50afe06a23065b35de69a9fc13b6",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeRecord_source": {
          "hash": "524aabfc523f01ff901772f580fe2572ee8652710291e521eb5e1d0f646e4266",
          "axioms": [],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeRecords_encode": {
          "hash": "af9320bf79a0e272e5d82718b03be61d75713317e23303efcc3ced204b4a899b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeRecords_source": {
          "hash": "f61ca4c313bb9c030560ccd740f3141b4523bd9f500fe0fb034a07197c4beeb6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeAction_encode": {
          "hash": "7118d17b2141ba336b0ff7eb33272abe6ee256ba62cf4824b8c76af40286d127",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeAction_source": {
          "hash": "331ede205b8f1d5decfc7794f2ba5e1f950dd8bf56ac94182ed7abe87c5c3dc8",
          "axioms": [],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeEvent_encode": {
          "hash": "6600dea5f53aee5f9657161733ca79507baebd020c2499a2ec41efa7fa4c1837",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeEvent_source": {
          "hash": "235feb55ebc78c5ac4c6103b3b05e9c9b119a4a7fe0fd1f5720e0ac62be6cc24",
          "axioms": [],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeEvents_encode": {
          "hash": "e00db58968ba9cff4faecb7ee91711fde646deebd3869be7b4d309641356fa76",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.decodeEvents_source": {
          "hash": "41aee7665f59825f17bfe4520e535cc0e04a052958dd4ed4c4ebb47e4efdc27c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantInput"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.records_source": {
          "hash": "36347236b5cef75095e073072c6f73b92ad3d44eecd843a02a42a4430b4a2541",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.events_source": {
          "hash": "90e872ca617b279c954a74b13db9e8dcf9a00a2c48636e983f839b1eb4f7bc17",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.existing_result": {
          "hash": "01fd8d8b2fe21c4b673c71205d517e7de85a3be33c8fb2102ec35aa89ab6be05",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.semantics": {
          "hash": "3b9d5e6d3092ad74b1fa1685ae5ea5777bd2b191ed2ad3dd177878110b827ac0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.physicalOrigin_position": {
          "hash": "9b7b74a32b1de6db94f2b2368df9c11105bb8e3b931552ab9c3ddb134db3dbd0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.physical_ownership": {
          "hash": "c62e396630543446c2ebed0880845c7ce9b32e2e22779ade3af1aecef6d76367",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.gate_balance": {
          "hash": "cf6d933a7dd0bd138116a566272a2726eda4af9f68be1795d628918b93f35d33",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.charged_origin": {
          "hash": "abbdc18e2e8a43df7d518be54c01b127dd41188f11c09c57af237ad6b5125b28",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.event_identity_unique": {
          "hash": "474aa00f7c0b139e23d753e62817df722983c32689d964ba4d65dbd2e6f44c72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.compileStage_records_none": {
          "hash": "92f268195aac2fd63720dcbf3f8109e998a421f6f19ca7475243eb4d0569e546",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.compileStage_events_none": {
          "hash": "1629b93a589c5131a0ed5ded6fab4b1f9b08eb00b21a68eaac44e085e88286ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.compileStage_history_none": {
          "hash": "d6d047d7d01bbcd776d23969daa4ce4adcd9acbc8fdb9f73086e455536dac9d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantStage"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.semantics": {
          "hash": "730f70381e9dfcdecb39cfab21318604d57468ae1180e0ce23295616d578317f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.gate_balance": {
          "hash": "925aeb15068172113d8d968acbe2766e58ea48905ff0c901ef139fc1dfb17e6c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_nil": {
          "hash": "f7219d283f13a96eee20c390f9fc0e487fa09b3a9f4f00f6eb7240cef0c54cb7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_cons": {
          "hash": "2ff609883376b3563e4d6119ee3d2c3a5387b4bd18deb3c2ac3e02aa34fcd354",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_stage_none": {
          "hash": "929efbcbea66a78fcc4c59744c6056ee1f3720b05903059ef7bd26566ee0e8ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_tail_none": {
          "hash": "b5fc4eb08f60243aa40b2e97b2215545346b56be83b5468aacc5e8c87b143185",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_cons_some": {
          "hash": "442d0dee6af88fe660f5b5a7751cfdccf40e77831899e0fb23cfeb03ee28dfa8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.compile_sound": {
          "hash": "3e95f253885642c3746abf72e3c186e7e2f0cf53675e5258d3c0b7ca12052f6b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantRun"
        },
        "PNP.DirectWire.WireDescendantHistory.createdBefore_mono": {
          "hash": "13f07d18ac80c19d0b241d6ffe1fe26305924c603d3fdd3c82f4ba472477fe37",
          "axioms": [],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.initial_wellFormed": {
          "hash": "dd894a15bc64f4dd81d0df6aa398a68aeabac5e83f6e4484bfd6a91a1cc28e09",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.accounted_before": {
          "hash": "43927ed921138038ad6da128a9eea71cf6faa67f4d146c75e7df63246e7dc856",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.origin_before": {
          "hash": "00c913d1e9e87d4a0a4762e487294591fe5a476e5c99bcbb6892984087847b36",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.origin_injective": {
          "hash": "3edbbc3ac6b52912b944507bc19a35f242f2529379cc0f8bafff404a242b17b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.liftOrigin_original": {
          "hash": "d99ead70d3072eb2f9948dec43972423df587b84ef5ac6cbfef6bd2f1dea1dc8",
          "axioms": [],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.liftOrigin_allocated": {
          "hash": "73c0a3a43ae86b009db7e572bfe07c7f9e49b8b5c6ac359b1fc1592f28f44098",
          "axioms": [],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.liftOrigin_injective": {
          "hash": "0547e812fc266943a45c28ded8e29542edb7a482c7fc61756027dae953e84484",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.lift_originals": {
          "hash": "3159515d4078ec4e63aa6223e4e8ddf7cb4cb762141daa6592fce708749a4bce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_live": {
          "hash": "a1c794ca85ab26ebbcd2be03b5111f2274f6ac12a3595aa2775b086a7fbf4933",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_charged_length": {
          "hash": "1ac4e5601de2682e4efb1233f4ade2f0e55a9a49dbd5e69bf8dd671c0742fcc5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_removed_length": {
          "hash": "52f5d335b40ad5a794adcec1dced975629358970020c237c7d34b7846a669a25",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_physicalOrigin_position": {
          "hash": "3c3ca3f5f6c6bdef9f3aa5a5cc1cefa5388e84864efa4db4e8a0c20ec6db3142",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_charge_origin": {
          "hash": "7d8d16e149d8dd7e72910c552b12e7c4b8b3b40a07945fe02c60a7165c79cf31",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_partition": {
          "hash": "bf6a2dd629f7424797e9e9588365196d1429d09f14c1c938d8cf5b5fc7628828",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.PersistentOwnership.advance_wellFormed": {
          "hash": "f6527741ef6c8d30f23b9e917101e407e50b3b578be1c477e38051b1144e0c3d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantLedger"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_nil": {
          "hash": "d877925aee3c87c1408b207be8e7385719475bf4703e666313484be02e5f624d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_cons": {
          "hash": "5f9a901ad4e5d8df4fadbca20c7d7d9bbbbb75a0b18fb9d344ffb14ca1817d22",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_wellFormed": {
          "hash": "98f9be704ed7ab5d90de5693f3b31d3c1c4efbc0cf1feea3815f33b044e5096d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_charged_length": {
          "hash": "03df662f19a68bad4aa47aec373def4f9b64ba582a8cb687ed4d6b636ca1c955",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_removed_length": {
          "hash": "08410ef75059f09ccae0bf8b7a09ff88844446347c6b06693e27b38b1660e9b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_charge_survives": {
          "hash": "d096142fb80cd50728403e56b1b0104599d20a4846dac0f4e57cb8dcb0b24cd2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_nil": {
          "hash": "c177a84e815346750b7b93f58ff2e4932f490c8711358b19889f0cc9b4d96b2b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_wellFormed": {
          "hash": "c41a54ae47f84cc41a738f7af179897d79688d982c8723c6320e26fe9397680b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.physical_ownership": {
          "hash": "9fe1e0da4c0adb147eac76a4283e506e71cde17393f3258941654d71e0f7823f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_origin_injective": {
          "hash": "b2bd68e066dfae7cbba93d921ee22fa8b22f1a33db1c913750d3f93ce322c98a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_charged_before": {
          "hash": "e31f65471e410fa25453118ce7a14a9846eaeefdafbbf719f54f166e65bff004",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantOwnership"
        },
        "PNP.DirectWire.WireDescendantHistory.inputEventKeys_nil": {
          "hash": "13c92c7368cbc976ffcffe28c5ffe3fdb1c9ac81ec9be362c9cd5eddb205b140",
          "axioms": [],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.inputEventKeys_cons": {
          "hash": "6548868619c1a8cc22baf1304c2068efdd051982fe23a52cb0ace70034f07a18",
          "axioms": [],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.inputEventKeys_bounds": {
          "hash": "92391bd1516635d0c2f45261e8afb43653930539afa6ff39b6705a1f8358bbf1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.rawEventIdentities_nodup": {
          "hash": "7bdfcdda7c4bb6194f7ac860ad6c315a4b1362e905f8eb0b498be024c418e2e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.inputEventKeys_nodup": {
          "hash": "6e5f481c35560bf2256f0bd4e8739cd9a9b5dcceabd559adb7e90dc3bf914a96",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.inputEventKeys_unique": {
          "hash": "c547f1853997fda210326a1dd7395f8ca923fc81bfe8f62ce7f063c8b78e6453",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.carry_charged_origin": {
          "hash": "f50528d8be5f6b54c10466374694365ac6b8952fab52bf39ec6ed32cd8d1fb1e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_charged_origin": {
          "hash": "75f504cf821f4ac027256314bc0b5a9b3b9e7e019a23d9ac342894df35dd0de0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.ledger_live_allocated_event": {
          "hash": "91b824e0cabe19db7e9aca3d8fbf139ecd1e70d5d247c8442e07c3e55ba47113",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantEvents"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventRequests_member": {
          "hash": "8b02d4215e37b742343b5b7b0f55cb9619140844c0f694ccf227d07be14815b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventRequests_disjoint": {
          "hash": "5b6d5e4ed8ebea8319891543abd014f7110d69afc3605f1665d8e71b0c6bff19",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventOwner_some_iff": {
          "hash": "778aed23652cd249f9052e1457bcd1698941e24a6ffbc1457ecc1789d62c5fa2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.eventOwner_none_iff": {
          "hash": "35fce1d6ac4087184a18b3da528db87d2553f95378243932324a50fb7df3ea85",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.support_membership": {
          "hash": "ceb66e2bee62c16542d89e71752e0bb3e35f970eb5381a8fbae8fe446983f069",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.support_restrict": {
          "hash": "3cb9cf5a272f2c489ca6e69407068ff73ee4a42974c1ee0b40b765f421e071b5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_gateCount": {
          "hash": "08af9b94b4a9a24a828227835e5e0503f7a908fe7c5e508e54ea1e96dcddaeae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_chargeIdentity": {
          "hash": "fc6b95d4523f3f285fc1deac9b0f8b86a3e1c6649a2e74a1d8a84cf90816d91d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_wholeCharge": {
          "hash": "326ddb712dcf0c91269ad0b8ac75fc8e3f0ae01137af1f4c2f4560ab38c09f6f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_semantics": {
          "hash": "7857613a7b0a40c3435ac240be62e98dad90a916d6fe591d9680272b5e505cd0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.materializer_induced": {
          "hash": "26da7a1ed7507ac461ee2d1ce1d917fa6ca73122db872ab20c830fedcc713a0e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCharges"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.strictGain": {
          "hash": "d42ce2640b1a7f5881c7efc846365047d84c7f63ddd4e5629e4b4d2f45c32872",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.GainResult.strictGain": {
          "hash": "a39fe16e118191baf32ff61fd7abc2d0657024634156b1306bd83072bd06bf08",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.GainResult.strictResidualDescent": {
          "hash": "e4a0a30f2560efd0dea139ef89fb35feffab6efa11adf500369d9ca3cf7f9d65",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.compileGain_compile_none": {
          "hash": "d11fe443478ffdd979f08205e96c6879ea9555c49fa4926cc69efe4bfb0ce3b8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.compileGain_no_gain": {
          "hash": "5cbb7812dc8e1b5ffdbecc9e88230e1f02dcabfe64d41f9cd423970ecb0a2f63",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.compileGain_complete": {
          "hash": "c5e568e7077d2fa367476cac0c996c87be3d1ade4d4b00cb9c1d80ef40d163e1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
        },
        "PNP.DirectWire.WireDescendantHistory.compileGain_exists_iff": {
          "hash": "502966e15396548e91df5737beba0e5a8a06aca59914b77cbcb28849d65ae666",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantGain"
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
      "number": 268,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-17-268",
      "id": "proper-descendant-certificates",
      "title": "Source-only proper-support certificates for descendant programs",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire-carrier dimensions, raw outer support records and raw descendant programs, source-only verification decodes every outer coordinate and executes the complete local program on the extracted source. Arbitrary-label dependency bounds follow actual execution and derive literal outer compilation without a supplied wiring order or successful-splice premise. Acceptance is exactly complete decoding, successful complete local execution, proper physical support and strict final local saving. The constructed one-copy ambient splice preserves all ordinary outputs and literal fields, retains the actual run and compiler receipts, and satisfies exact historical charge/removal accounting. Intermediate expansion is permitted; invalid coordinates, a failed later stage, whole support and final nondecrease reject. Every accepted certificate yields StrictEquivalentGain and strict residual descent without supplied intermediate circuits, correctness, owners, costs, ranks or semantic oracles.",
      "nonClaim": "This verifies offered finite programs in the existing closed computational wire-carrier language. It does not prove that every nonminimal input has an accepted certificate, construct a globally successful strategy, derive terminal families or establish local minimality after rejection. Full manuscript profiles, all R1-R9 and N1-N10 rule families, cross-support transport of open obligations, matched-kappa arbitrary-support Pull/Expand, full manuscript VerifyDW, ChargeSoundness and Package E remain open. No bound on temporary growth, encoded-input polynomial runtime, output size or certificate size is proved. Global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin, deterministic CNFSAT in P and the eligible root remain open. Runtime fixtures are regression evidence, not theorem authority. No fixed weighted checkpoint or global gate closes, and P = NP is not proved.",
      "fields": {
        "leanProperDescendantCertificatesFormalized": true,
        "leanProperDescendantCertificatesAxiomAuditPassed": true,
        "leanProperDescendantCertificatesAuditedDeclarationCount": 33,
        "leanProperDescendantCertificatesArbitraryLabelCausalBoundTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.output_dependency_bound",
        "leanProperDescendantCertificatesDerivedOuterCompilationTheorem": "PNP.DirectWire.WireDescendantHistory.CompiledRun.extracted_compiles",
        "leanProperDescendantCertificatesCompleteOuterCompilationTheorem": "PNP.DirectWire.WireDescendantProperSupport.compile_complete",
        "leanProperDescendantCertificatesProperSupportIffTheorem": "PNP.DirectWire.WireDescendantProperSupport.proper_iff_exterior_positive",
        "leanProperDescendantCertificatesAmbientHistoricalAccountingTheorem": "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.charge_accounting",
        "leanProperDescendantCertificatesCompleteAcceptanceIffTheorem": "PNP.DirectWire.WireDescendantCertificate.verify_exists_iff",
        "leanProperDescendantCertificatesSourceRoundTripTheorem": "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.records_source",
        "leanProperDescendantCertificatesOrdinaryOutputPreservationTheorem": "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.output",
        "leanProperDescendantCertificatesLiteralFieldPreservationTheorem": "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.field",
        "leanProperDescendantCertificatesStrictGainTheorem": "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.strictGain",
        "leanProperDescendantCertificatesStrictResidualDescentTheorem": "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.strictResidualDescent",
        "leanProperDescendantCertificatesFailedCompleteProgramRejectionTheorem": "PNP.DirectWire.WireDescendantCertificate.verify_run_none",
        "leanProperDescendantCertificatesWholeSupportRejectionTheorem": "PNP.DirectWire.WireDescendantCertificate.verify_not_proper",
        "leanProperDescendantCertificatesNondecreaseRejectionTheorem": "PNP.DirectWire.WireDescendantCertificate.verify_no_gain",
        "leanProperDescendantCertificatesArbitraryFiniteDimensionsAndProgramsCovered": true,
        "leanProperDescendantCertificatesRawSourceOnlyCertificate": true,
        "leanProperDescendantCertificatesCompleteProgramRequired": true,
        "leanProperDescendantCertificatesOuterAcyclicityDerivedFromExecution": true,
        "leanProperDescendantCertificatesProperPhysicalSupportRequired": true,
        "leanProperDescendantCertificatesStrictFinalLocalSavingRequired": true,
        "leanProperDescendantCertificatesAllOrdinaryOutputsAndLiteralFieldsPreserved": true,
        "leanProperDescendantCertificatesExteriorOccursExactlyOnce": true,
        "leanProperDescendantCertificatesActualHistoricalChargeRemovalBalancePreserved": true,
        "leanProperDescendantCertificatesIntermediateExpansionAllowed": true,
        "leanProperDescendantCertificatesCallerSuppliedCorrectnessOrIntermediateCircuitRequired": false,
        "leanProperDescendantCertificatesCallerSuppliedOrderOrSuccessfulSpliceRequired": false,
        "leanProperDescendantCertificatesCallerSuppliedCostsOrOwnersRequired": false,
        "leanProperDescendantCertificatesAcceptedPrefixReturnedAfterLaterRejection": false,
        "leanProperDescendantCertificatesRejectedCertificateProvesLocalMinimality": false,
        "leanProperDescendantCertificatesAcceptedCertificateForEveryNonminimalInputProved": false,
        "leanProperDescendantCertificatesGloballySuccessfulStrategyDerived": false,
        "leanProperDescendantCertificatesFullManuscriptVerifyDWProved": false,
        "leanProperDescendantCertificatesFullManuscriptProfilesAndRuleFamiliesProved": false,
        "leanProperDescendantCertificatesOpenObligationsTransportedAcrossSupports": false,
        "leanProperDescendantCertificatesCompleteChargeSoundnessProved": false,
        "leanProperDescendantCertificatesCompletePackageEProved": false,
        "leanProperDescendantCertificatesTerminalFamiliesDerived": false,
        "leanProperDescendantCertificatesGlobalRouteCoverageProved": false,
        "leanProperDescendantCertificatesUnconditionalSaturatePositiveProved": false,
        "leanProperDescendantCertificatesUnconditionalBCELReadyProved": false,
        "leanProperDescendantCertificatesUnconditionalZeroSlackProved": false,
        "leanProperDescendantCertificatesExactGeneralPCCMinProved": false,
        "leanProperDescendantCertificatesPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanProperDescendantCertificatesRuntimeExecutionIsProofAuthority": false,
        "leanProperDescendantCertificatesScope": "arbitrary-finite-computational-wire-carriers-source-only-raw-records-and-complete-descendant-programs-derived-causal-literal-splice-proper-support-strict-final-saving-all-output-and-field-preservation-exact-historical-costs-intermediate-expansion-no-global-certificate-discovery-or-full-manuscript-profiles-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_dependencyInterfaceBound": {
          "hash": "7e91a6ba071a60d7acf5537dbbbe7b92588c7600b8794ff29854f641389e8269",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCausalBounds"
        },
        "PNP.DirectWire.WireDescendantHistory.StageCompilation.output_dependency_bound": {
          "hash": "6e06d53b0ca176147a923beda5e13fc201257842680b13b7eb0f4e21223d0a5a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCausalBounds"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.output_dependency_bound": {
          "hash": "3bdab1852a89654374cec56b8b06c23c1d5cc963d33ff2842a254db07836af98",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCausalBounds"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.extracted_causalInterfaceBound": {
          "hash": "9df4cab63a5443ed3c4383553ff5ab1cd7e5a3983b2010d83240b1070703e5d3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCausalBounds"
        },
        "PNP.DirectWire.WireDescendantHistory.CompiledRun.extracted_compiles": {
          "hash": "47a4a1c20244f1b93aa6fa03c58b88b07ccd74498e37eb645adcf966d095f65e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCausalBounds"
        },
        "PNP.DirectWire.WireDescendantProperSupport.proper_iff_exterior_positive": {
          "hash": "d9d08cfb9dadac80b033e39f4954d427cc8003d8cd3d11aae930bb0b6aabb20c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.open_equivalent": {
          "hash": "1554f92d8ccf86c4c94a7040f18a301073fd5f2b22e704da9e7c3d2652b2a9fe",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.output": {
          "hash": "3d4007aa676175bca9da0e38c0fa81c4f55bba457806bbb6d8e76ff919f74b98",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.field": {
          "hash": "1c982a9e13a376f2b044aa8e95655cea80ea5b09b61717cb7c91612d6bdf67d7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.gateCount": {
          "hash": "33ddeedba50fed2e7aeaf3b1d6fdb85128563c912e933424241f611ee8559003",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.charge_accounting": {
          "hash": "43cf1de7e6f4a89dac1ecaca41999c83bfb01c5c210adc9c82f9ca8a9b93665f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.gain_iff_local_gain": {
          "hash": "f2e0f4bf14a3821fd89e9c15ed3ebaa66038e58d2022e7162257f22cb3d9f6ae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.gain_iff_net_charges": {
          "hash": "254edea2db6faf6de9ff5991a1101fa5e98da7f95c4f249d54bf545b1c8de7b5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.strictGain": {
          "hash": "d52506d1fa99a40e31e1f65e2f346737f9650244c325df8e11db6053f5edc84c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.SplicedRun.strictResidualDescent": {
          "hash": "9e078fc6943070e2127e757c87e5128553104a268aa22d0d44a8072ff0d9d99c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.compile_complete": {
          "hash": "f4fbc6327c464ccd90383ce7238d5fb48985e9d1075e44e99ee14febd197f77d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.compile_exists_iff": {
          "hash": "3595a28d541c127f3f9d1c1de45133e52de421ee6dedf8a6ba4b4d2bb70d89c1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantProperSupport.compile_none_iff": {
          "hash": "14ee8d6504fbb3d36d05a30c16804bb64c150c8cd1ffb3650c089d072e9e9e59",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantProperSupport"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.records_source": {
          "hash": "438bd94195840fc2351650b23668de3ba131db36ca00a0afb7cb2edd51957d35",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.proper_support": {
          "hash": "e65ada18451c48e87f3809e321a796e32610f9c00d5bcefee226644ef366aa59",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.output": {
          "hash": "613f0f18269563e29aba6060065e1b52e3c6becc1e8da84472f6491519266eb7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.field": {
          "hash": "60e21b2c8a882cb82bf741e7692504669c9b5e9bd293e11ed11e23edb9ac2d65",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.gateCount": {
          "hash": "7d350b53d51481dc1fe2d5cb4155b5c7aaf6b613052aa6112b9f1174d066ab07",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.charge_accounting": {
          "hash": "adb98588ffdceb1296a68ddd61343e8d7939ffca2f812a5d44028ea8f5e9a401",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.strictGain": {
          "hash": "d285a884b421f2610155e13482363543697a2250a40c1c302c7c46b4016f4732",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.CheckedCertificate.strictResidualDescent": {
          "hash": "b48c42a7f286f32d4c890f51d3c74b020fb19f9f3a24185e58fe5438a3855b46",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_complete": {
          "hash": "b9601cb040f7386418b4a280b37d283aecdf0792bee24994e9cc194583976d34",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_exists_iff": {
          "hash": "9eef87d6e1313ff9dda9650d8ef55854860a6b3f63686952b60d79caaeaf36a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_sound": {
          "hash": "a5ed083668d903a2e924c74f98357e3a846172464fa52e82eca97baee2e9a25b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_decode_none": {
          "hash": "67515c26c4d5ea9d26bb89b38dea576d8697c0986dea37797c608fd550c67837",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_run_none": {
          "hash": "23b902698feb58606e2b576acb188dffc1d3517874bf49a8a892be7c851df74a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_not_proper": {
          "hash": "6ae7df30920172cc87b581bb315bbd8fba9db594b35e52f85f30f03dc33b0389",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
        },
        "PNP.DirectWire.WireDescendantCertificate.verify_no_gain": {
          "hash": "5de9ff869d71ff419c095435550f6276df8087016ebd6bf1da647f65743930c4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireDescendantCertificate"
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
      "number": 269,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-17-269",
      "id": "open-obligation-programs",
      "title": "Open obligations across complete descendant-support programs",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire carriers, raw outer support records and raw mixed programs, source-only verification computes the complete dependency order, including intrinsic creation references, and executes every primitive or actual descendant-support splice from its internally constructed initial state. The same pending creations and captured full-value snapshots persist across intervening support changes until genuine full-mode R6, R7 or R8 discharge; final ambient closure is required. Execution-derived causal bounds construct the literal outer splice. Acceptance is exactly complete decoding and finally closed execution on a proper physical support with strict final saving. The result preserves all ordinary outputs and literal fields, includes the exterior once, and reconstructs unique original/allocation ownership through the actual compiler positions. Computed outer-position namespaces distinguish nested event identities; historical charges and removals survive later allocation deletion. Temporary expansion is allowed; malformed, cyclic, missing or duplicate references, unfinished ledgers, failed tails, whole supports and final nondecrease reject. No intermediate carrier, schedule, snapshot, correctness, cost, owner, rank or splice witness is supplied.",
      "nonClaim": "This verifies offered arbitrary finite mixed programs in the computational wire-carrier language; inner descendant histories retain their existing closed-history boundary. It does not find an accepted certificate for every nonminimal input, establish local minimality after rejection, or construct a globally successful strategy. Full manuscript profiles and all R1-R9 and N1-N10 rule families, matched-kappa arbitrary-support Pull/Expand, full manuscript VerifyDW, ChargeSoundness and Package E, and terminal-family derivation remain open. There is no bound on temporary growth or encoded-input polynomial runtime, output size or certificate size. Global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin, deterministic CNFSAT in P and the eligible root remain open. Finite runtime fixtures are regression evidence, not theorem authority. No fixed weighted checkpoint or global gate closes, and P = NP is not proved.",
      "fields": {
        "leanOpenObligationProgramsFormalized": true,
        "leanOpenObligationProgramsAxiomAuditPassed": true,
        "leanOpenObligationProgramsAuditedDeclarationCount": 144,
        "leanOpenObligationProgramsPendingSnapshotPreservationTheorem": "PNP.DirectWire.WireOpenSupportSplice.transfer_pending",
        "leanOpenObligationProgramsCompleteDependencyOrderTheorem": "PNP.DirectWire.WireOpenProgram.orderEvents_success_iff",
        "leanOpenObligationProgramsCompleteExecutionAcceptanceTheorem": "PNP.DirectWire.WireOpenProgram.compile_exists_iff",
        "leanOpenObligationProgramsFinalClosureTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.closed",
        "leanOpenObligationProgramsCreationLifecycleTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.creation_lifecycle",
        "leanOpenObligationProgramsFullFieldRestorationTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_field",
        "leanOpenObligationProgramsCompleteOuterCompilationTheorem": "PNP.DirectWire.WireOpenProperSupport.compile_complete",
        "leanOpenObligationProgramsActualCompilerOwnershipTheorem": "PNP.DirectWire.WireOpenProperSupport.ownership_compiled_position",
        "leanOpenObligationProgramsCompleteAcceptanceIffTheorem": "PNP.DirectWire.WireOpenCertificate.verify_exists_iff",
        "leanOpenObligationProgramsSourceRoundTripTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.records_source",
        "leanOpenObligationProgramsOrdinaryOutputPreservationTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.output",
        "leanOpenObligationProgramsLiteralFieldPreservationTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.field",
        "leanOpenObligationProgramsHistoricalAccountingTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.charge_accounting",
        "leanOpenObligationProgramsPhysicalOwnershipTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.physical_ownership",
        "leanOpenObligationProgramsStrictGainTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictGain",
        "leanOpenObligationProgramsStrictResidualDescentTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent",
        "leanOpenObligationProgramsFailedCompleteProgramRejectionTheorem": "PNP.DirectWire.WireOpenCertificate.verify_program_none",
        "leanOpenObligationProgramsWholeSupportRejectionTheorem": "PNP.DirectWire.WireOpenCertificate.verify_not_proper",
        "leanOpenObligationProgramsNondecreaseRejectionTheorem": "PNP.DirectWire.WireOpenCertificate.verify_no_gain",
        "leanOpenObligationProgramsArbitraryFiniteDimensionsAndProgramsCovered": true,
        "leanOpenObligationProgramsRawSourceOnlyCertificate": true,
        "leanOpenObligationProgramsInitialStateInternallyDerived": true,
        "leanOpenObligationProgramsCompleteRawMixedProgramRequired": true,
        "leanOpenObligationProgramsComputedDependencyOrderRequired": true,
        "leanOpenObligationProgramsIntrinsicCreationReferencesRequired": true,
        "leanOpenObligationProgramsSamePendingSnapshotsPreserved": true,
        "leanOpenObligationProgramsOpenObligationsTransportedAcrossSupports": true,
        "leanOpenObligationProgramsFullModeR6R7R8DischargeRequired": true,
        "leanOpenObligationProgramsFinalAmbientLedgerClosureRequired": true,
        "leanOpenObligationProgramsOuterAcyclicityDerivedFromExecution": true,
        "leanOpenObligationProgramsProperPhysicalSupportRequired": true,
        "leanOpenObligationProgramsStrictFinalLocalSavingRequired": true,
        "leanOpenObligationProgramsAllOrdinaryOutputsAndLiteralFieldsPreserved": true,
        "leanOpenObligationProgramsExteriorOccursExactlyOnce": true,
        "leanOpenObligationProgramsActualHistoricalChargeRemovalBalancePreserved": true,
        "leanOpenObligationProgramsPhysicalOwnershipComputed": true,
        "leanOpenObligationProgramsActualCompilerPositionMapsUsed": true,
        "leanOpenObligationProgramsComputedOuterPositionNamespaces": true,
        "leanOpenObligationProgramsLaterRemovedAllocationChargesRetained": true,
        "leanOpenObligationProgramsIntermediateExpansionAllowed": true,
        "leanOpenObligationProgramsInnerClosedHistoryLanguagePreserved": true,
        "leanOpenObligationProgramsCallerSuppliedCorrectnessOrIntermediateCircuitRequired": false,
        "leanOpenObligationProgramsCallerSuppliedInitialStateOrSnapshotRequired": false,
        "leanOpenObligationProgramsCallerSuppliedOrderOrSuccessfulSpliceRequired": false,
        "leanOpenObligationProgramsCallerSuppliedCostsOrOwnersRequired": false,
        "leanOpenObligationProgramsAcceptedPrefixReturnedAfterLaterRejection": false,
        "leanOpenObligationProgramsRejectedCertificateProvesLocalMinimality": false,
        "leanOpenObligationProgramsAcceptedCertificateForEveryNonminimalInputProved": false,
        "leanOpenObligationProgramsGloballySuccessfulStrategyDerived": false,
        "leanOpenObligationProgramsFullManuscriptVerifyDWProved": false,
        "leanOpenObligationProgramsFullManuscriptProfilesAndRuleFamiliesProved": false,
        "leanOpenObligationProgramsCompleteChargeSoundnessProved": false,
        "leanOpenObligationProgramsCompletePackageEProved": false,
        "leanOpenObligationProgramsTerminalFamiliesDerived": false,
        "leanOpenObligationProgramsGlobalRouteCoverageProved": false,
        "leanOpenObligationProgramsUnconditionalSaturatePositiveProved": false,
        "leanOpenObligationProgramsUnconditionalBCELReadyProved": false,
        "leanOpenObligationProgramsUnconditionalZeroSlackProved": false,
        "leanOpenObligationProgramsExactGeneralPCCMinProved": false,
        "leanOpenObligationProgramsPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanOpenObligationProgramsRuntimeExecutionIsProofAuthority": false,
        "leanOpenObligationProgramsScope": "arbitrary-finite-source-only-complete-mixed-programs-computed-order-open-snapshot-transport-full-mode-discharge-final-closure-derived-proper-literal-splice-strict-saving-all-observations-actual-physical-ownership-and-historical-costs-no-global-discovery-or-full-manuscript-profiles-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireOpenSupportSplice.transfer_pending": {
          "hash": "f372417d21745a89b9fe060a0bb5e7f94293cea45e5110523db2d4c13e25197a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_keep": {
          "hash": "f4d1ebc59477a545c6cd2b2f515e48c351bc67520e95074526933444e85d8bfa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_snapshot": {
          "hash": "a3452719777d8c5629dbd41665e8a04ed60a7bdff93dc74ed58ee0b950f9e417",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_charge": {
          "hash": "db627ea92a89b3c7884615ffeab0f9d7f284d340f0ad4448156e7577c68e6968",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_removal": {
          "hash": "a4b880c172be2674e8af5454f6ea02223ca41883cfe3cb4f732830b0cfdfdb50",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_output": {
          "hash": "f8b7dc12ec7b3924e040c3d2ca45c056cd7535240071a6cd26ebd2386c8d5110",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_available": {
          "hash": "eeabd992f318656b0f9025943e3d89965be898046177f351f2c82a648edd5147",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_balance": {
          "hash": "415774cc05f6e62627165a12c8efca6b29bc49c70724c5e25bd67c342d679386",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.replacement_dependency_bound": {
          "hash": "1229d727b2d0ef3cb00585f0471b4adcfd6bd1ca89cacc985f21a4c5dad88f9e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.result_exposed_dependency_bound": {
          "hash": "f9c5feb923940e0a9e50dc5d12805ea506f3914c5e2c8fca7ad3f311206c42df",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.result_causal_bounds": {
          "hash": "93eda0ab5098dc003f718864eca040b42241ad22ab71a7505dade0535b617c7f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.transfer_causal_invariant": {
          "hash": "c53a9094b0d744a8b49e1ac8a1ee4a5e32ee602cd31a93e9c1d15d74ff259037",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.Receipt.pending": {
          "hash": "7ddac25e74caf583040e4ccb1912d6db3dd4c952ea4056287d24f575ad4dfd45",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.Receipt.records_source": {
          "hash": "10d6e44867eff3915845ffac22c3a343f6f0a65ea11c686a62c6299d7a9673f6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.execute_of_compiled": {
          "hash": "05922b248891616eff08fd765b5f9a767a985b85274170e23a06aa9d46e0b621",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenSupportSplice.execute_exists_iff": {
          "hash": "3fd039ec2a4f844c4b70efe4470702b8dca68971f2f627272cdaaddfcd2074f9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportSplice"
        },
        "PNP.DirectWire.WireOpenProgram.uniqueIDs_iff": {
          "hash": "c71214b5ee8b3df62bea207eae053840d658c6d347f89d2b50f5abdd7ee4ef76",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.completeReferences_iff": {
          "hash": "78ad2da547dcdf0ab8b5b7e79f7028a70d9741f41459e65e9a605ca756f6f030",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.graph_dependency_iff": {
          "hash": "56b89269cc7546658ffa4f4851b39fa69d239b3e09d53f97574f5a3c0f165697",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.OrderedEvents.order_complete": {
          "hash": "a7cc293b2886172a144d5829a620b1b71b4b47da4684c00495e61c7d6eea5ee3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.OrderedEvents.order_nodup": {
          "hash": "e103f022f41d712d4e8bed2e28de6ffcebbe9302ad723abb6822a7449b93b3b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.OrderedEvents.order_length": {
          "hash": "7c48b4c7e7d4371bd310d01d3439c1f47c9e29def61e88b985e6a04e20af16d7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.OrderedEvents.identities_nodup": {
          "hash": "daabddde5a7c7413c681e6665d0439bbeebdc5bd54521d472f2a17be84759e10",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_success_iff": {
          "hash": "e1b2b9787c19111793f9f90668214efb7c6eff4d421e77aa91f3476f3fc89d72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_failure_iff": {
          "hash": "8d3ebe6d609705e5320540cdcf174fb14bfcaf8aae8595d70ed1893c8dedc95a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.charged_eq": {
          "hash": "582b965b392cbc1cf45464dca92b57b3a2d6f4f60df828d2587f4e290c73134e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.removed_eq": {
          "hash": "4984f8ac769eb86a56fe34136572428de242317a17b8b407150f7ebe4d49c8e2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.dischargeRecord_binding": {
          "hash": "a4eaacd84ac35fe897205f2c097c29b34c456bc71ca1b2c0302c7a60b50d027d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.pending_persists_or_discharged": {
          "hash": "b3fcc96b8e3aff3cf491ba2b9117fcc3831f833aa02245f17a71b580477824d8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.created_pending": {
          "hash": "967058b875d619d926a8d9999915517441ae84d3a5bde0acb22b97cbb1223b9c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.causalInvariant": {
          "hash": "2983a548ee9035eecf6401bb87dbb74eed55ba77c8470dbfa596155e65c833f7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.execute_failed_tail": {
          "hash": "c852f45d97e5d2309875f6ba6f2a62aa22f4293c81781f6d7df84cae93f2bb72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.total_charge": {
          "hash": "0c1b5faf2041cf7f8ff151ac6e640c57f1c5b0eea97faabe3c37a1a4dcd58a72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.total_removed": {
          "hash": "99cad8313b84834312ea8134fbffe072ef5915daf487d1a7fd658905a110b3a1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.record_identities": {
          "hash": "a216f913c1d3336159ba0a569016311638a0d4bf0bc8ece7237085abfa42fe9c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.pending_persists_or_discharged": {
          "hash": "030586def8ed0c04b78ef370eb374c29d80828c4e5adbd0e2b47cf99ca8e652a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.creationsClosed_of_finalClosed": {
          "hash": "432a30f13d8db52b91fea97fd2b602b25d7976144df1f2f24d3b49213d8866e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.causalInvariant": {
          "hash": "6164f04d9db3b241b5be62fac65b7e2ed3492495c13687d47107645c028c5491",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.closed": {
          "hash": "7b26384b374bbc5553bb704731398cd8d0d55acfa4080ac2538ea6d4a0120c1b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_output": {
          "hash": "9cea32cc78cee0b2c900d6de17291ab5a16954b5b0bcc3cc13c7966bb8002990",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_field": {
          "hash": "f7f2e0b981060c9871f68d80e139e2cd1035d277449dead2f13c9c5881518bef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.gate_balance": {
          "hash": "7a8f96270f3ca4f981f6bb2f38f5af353346b02300932f5b24ee05e5f8804c71",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.creation_lifecycle": {
          "hash": "9669cc796d490317f08119fd24b916dda275ff271609709f0ffe92e057a8fb2d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_count": {
          "hash": "45c2da7f85d2cf6b15e999f771315afdd40b625fc3443eca9a715f768594202b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_identities_nodup": {
          "hash": "35b434faefbe1677549ab531bffc512dc5a55890aec21d3ad8d43ec198101168",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.dependency_before": {
          "hash": "4be753b9b631255f74322b73bb8040366356630761f975e5a0eb4ddf08ce4f6f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.causalInvariant": {
          "hash": "93a3cdc341e0720cc8327ae38b59cf4a0e419540c23ac76916af0fac7fc557ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.output_causal_bound": {
          "hash": "dd90ee103df10fd0c8608b36b5acf2f05aa4ee4226b2e97741f42dd543d9977e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.field_causal_bound": {
          "hash": "685e7317438c9f54dfb261ac77516aa574341059718d1f31ccf2af1f802c8e25",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.compile_exists_iff": {
          "hash": "1e58bf5b50338a0b30d0fe144e44e7c1a2b000c78e460d0a25a72efa4398da75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.compile_none_iff": {
          "hash": "7682645460be03c064cbc89ad7d53075275e646683bf6395d7749f8cc2ab72a5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownershipLift_original": {
          "hash": "0b669f52b59c9716599f175f9a4f27eae3c0286542100b22caf0b4c5d3884dd2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownershipLift_allocated": {
          "hash": "0c7bee0cf6f1cd8a64587d2433e0ccb455d36ff6cf71a6de4a07d800cfbdbfdf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownershipLift_injective": {
          "hash": "61c989236791367321894954f89e6c73d994d7c87bf81e51b2ced3eda992f54a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownershipRawNode_exterior": {
          "hash": "db8cdcf39188fca68478a037f57eb00ee7304d346bd6db2b4cebe571ff47d552",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownershipRawNode_nested": {
          "hash": "662f92996388bf47107cf532453da1b008f31377ed985c98651472fb9e3f5345",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownership_compiled_position": {
          "hash": "6de0fd62d4b50f5d1495c6fa3813760bbefbe407e72c0148b191c0ad59f6bf0c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownership_partition": {
          "hash": "fc28ded9671c32b471adab23c27486cf919dfeb9a9625705d15d78e7462f8d5c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownership_charged_origin": {
          "hash": "4eb89c2011b53d30390d8440a9076e176918947330e63d9f66b8d25a82cdba0f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.ownership_distinct": {
          "hash": "f77f828a20951b51cff548fa9c326baaada397eb04a8ee33e900fc5b9af79eb3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.physical_ownership": {
          "hash": "d30dab26939ac05fe1d2f639aa558b97f6d69fb05173c385b3683bea39618010",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenSupportSplice.Receipt.physical_ownership": {
          "hash": "2810be93835d937edd3875e1ccb1aa1bf147c2808d3937b62e0be97228f0976f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenSupportOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.allocations_nodup": {
          "hash": "e83d36b50dd0758b773d24e3d6cb3031282a5204875817d5d392ee23f72b3a2a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.advance_charged": {
          "hash": "28648d85742cf32a94a05b70580e47f99c897b51b03d015a754255d964e0b41b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.advance_removed_length": {
          "hash": "d5f6020268922f937b3a6cfba269609d0fbbc8b4a03f2a703d6ed49ad54fb475",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.advance_conservation": {
          "hash": "936b1571f8c7ce40b79baa5697f5e62256a1d5a709559241601e3eb3e15ddfda",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.ledger_charged": {
          "hash": "df2b4ca6a19d0e93687eddef7feaa1a638372450d89958a399b8041ec6d02ac3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.ledger_removed_length": {
          "hash": "d0ea00e4f88913156fa0cb36279e50c5ae3d852a22fa5f58525705a0a2f832cd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.ledger_partition": {
          "hash": "2b47c63a27b4350495055444272787dc31367b2bf9e7199e925ba6d8644bca67",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.physical_ownership": {
          "hash": "adb103128984ee8af09e808a8cf7814cdb2043e151d211ad93041635ef99ef47",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.lift_injective": {
          "hash": "3c84c3607b489f321b269bec75f7e73471435d0d7d8734ddf9b1a9e1fa3799e3",
          "axioms": [],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.labelled_live": {
          "hash": "82c1e2ed984a1cdd7d37c4d835f018282f3be9c8b767de1a4339a50ef1c13433",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.labelled_physical_ownership": {
          "hash": "64b2fa619414d0ed84eec3a7c76701c2487158a8a0a776ae132dc75552cbbc94",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.PrimitiveOwnership.labelled_charged_origin": {
          "hash": "aa224c8b37dfc598434568994620be9b35c926656bad7f9e935f533cc91525fb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenPrimitiveOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.local_physical_ownership": {
          "hash": "058766b012a2a8c0127b27d8da2cbc11b9d5b1dc246a05d2a3932d1bab773f31",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.local_charged_origin": {
          "hash": "2b1fad4a1389d5321b9e46e05a427b876c3cd95679dde6ec0a21093ad60fcc8d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.bornBefore_mono": {
          "hash": "113e782017300543ccf29c041154005e84a564b8ff7f68191da3103940f81235",
          "axioms": [],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.initial_wellFormed": {
          "hash": "71768c17fb01c0a2ac9d4bf7d69572018d2de166eb090153df3dcb3f2efba065",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.accounted_before": {
          "hash": "9759187eae9c674eae632d7140873ca0ee09aec3966f53354ca0cd3aa63446a5",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.origin_before": {
          "hash": "7552a9e3fe16f3b742277ce89e10160cbf9690bc1975c694efd703de92f2def1",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.origin_injective": {
          "hash": "145541d9f7fd6003f09a01056f7334589373bdd3cc88a5417af297d9c41f507d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.liftOrigin_original": {
          "hash": "089007a53df8b1f264f8f6448b413b270152c4708c246685a5ae3387d4bff5a2",
          "axioms": [],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.liftOrigin_allocated": {
          "hash": "d4eaaeca8d1521b2d8abbaa4f153c0cb1f0a03c31df3db75eb52af6baa80de8e",
          "axioms": [],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.liftOrigin_injective": {
          "hash": "367310a8716209063a8e9b09ca4df0cc3a60a42a7b0dc4e5fb66bf31a0a96fc2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.lift_originals": {
          "hash": "76409c5fe4b3e22497b6f73add0db4f454b217ded953e088c6e48ae13c2cb7f8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_live": {
          "hash": "eae14dc1a26ab11f4f657d2fa980f37c7160a271528f2cee5d002f00995dd563",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_charged_length": {
          "hash": "56b57e7d723b0668224f8ebc24d9fb85535fbfa9187554b8e8ab167154051bee",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_removed_length": {
          "hash": "f2a48a407b7a01330842a28a8452708cd0c535826b201dbfaf0fb40176e0a689",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_charge_origin": {
          "hash": "61bf2fbdc9228936c06cb598a240476f7869f801310f11c1023d715731b64430",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_physical_position": {
          "hash": "1f231b2c4cab4e26c4ed41b7ab6b4d60262c71249d0267d9c76cd4fcc1ffae26",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_support_compiled_position": {
          "hash": "187d053258a8f2580077a5d63d927dc26463ca797b792665cd1c03605461f714",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_partition": {
          "hash": "fdb3d1165f6986ae6f34ed985f184e57f84f8b36095667c5c7b5d36b66ef73fc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_wellFormed": {
          "hash": "b5c19467ce706bff313f7b956c0ce3cc85efe11c826437e1acf813cfb492ab8e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.carryOwnership_wellFormed": {
          "hash": "a764a54155bd274991b0a1611fd906046f9ce8cc1ff9660a9dd005aa6972c07a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.carryOwnership_charged_length": {
          "hash": "138a8a70adf31232ee58f1d9772ef84cd1e2a2ecd299b688aea0e3c7b19b1377",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.carryOwnership_removed_length": {
          "hash": "8f571745e46861b8dea5a5a9fb8d558af05b79141f0d851512dbf70756923807",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.Execution.carryOwnership_charge_survives": {
          "hash": "a6b83b7cc6f0dbc1c3834716a7942181bd331d3e4469601a9e9d71c7d0b7b81d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_wellFormed": {
          "hash": "6c8728ec7154bb43063b51c20659ae4cd3aa9d0a495be0cb2c185afebd2f6ed8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.physical_ownership": {
          "hash": "15204bb313e0909e10d02a1b740d478b508ce7d129322a15015f90648e12e562",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_origin_injective": {
          "hash": "7be2e11b1cce85296ad1dfd57f1ef683118d51ea34962fbaf7b56163241cea8d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_charge_origin": {
          "hash": "3d637bfdf13b74e29f7d946f218bb8aa0ff6873271eccfc1ab546da6027b1fe0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.allocation_namespaces_disjoint": {
          "hash": "505f7d85f2015e6988170ed47086be92e79c86e05650449ac3ae10752f2e5b14",
          "axioms": [],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.program_equivalent": {
          "hash": "b8cbc4d9581543d1aa7a4604cdea171771dab8e771ba29005022623b917c68f4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.program_causalInterfaceBound": {
          "hash": "2bddfaab20e7d8d5844559e4c368150692ea31fdcae67c2e5fddb341c9f51e4a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.program_compiles": {
          "hash": "ed19fffb06005d66aafaf666a1d1cc12bf15b4743a812652e413d1defca5907f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.output": {
          "hash": "f0951e07ccc9142df3eb23939ba79b60f7a1cf3c45fa8547c8e01daf67a06e87",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.field": {
          "hash": "32eec426117db30e6bbaff70656ea85d841e077a917cdfa98408c5cb1e0ed83a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.gateCount": {
          "hash": "74b75b7429c832bc793e730356ba4ea4805bb061e8414787d337fed61b6253ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.charge_accounting": {
          "hash": "c6d88e093af61a052a5c41b351d86bfcb4ae7de1b35430611f30c0bce21fde82",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.gain_iff_local_gain": {
          "hash": "ba3714c9b14162e3b048013ec3dd1f2ea8adeff4eace64738f8148a1185777ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.gain_iff_net_charges": {
          "hash": "a79883157d9d1ee41553fc81fc57181c76220fbbcd480661d8ed73de1dbf8819",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.strictGain": {
          "hash": "e5ad464ee1ad8959aad168d83d5b3ffdff6c0cdca60a07c62f050e8eac95f900",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.SplicedProgram.strictResidualDescent": {
          "hash": "fdccf1d460287438df33f6219bc51fd213599a75fdd6005dadee2b702eceaf6e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.compile_complete": {
          "hash": "36aecca96533d3f2d287eac8e19d27862d419199e46721f818e5f8b0793870ac",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.compile_exists_iff": {
          "hash": "a9999609bd80ecf99878cbb8240fa23aa15160d9810c59ae070e52553e1ff824",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.compile_none_iff": {
          "hash": "ce3305941b2274389db4ca531b8a3914972ba80abaf1ddc746d9049ba49d8adb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperSupport"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownershipLift_original": {
          "hash": "6c22c92f022cdf84f78bb4deb2421eec8d0941ff035725100b1b06e775647e7d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownershipLift_allocated": {
          "hash": "7599b1d46112b3db063e3c96a4f2b4f2053ea42a235231fcd6b70a308328047a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownershipLift_injective": {
          "hash": "e4b64c1e38eef48978a7d440b438a0ab3f1681475744e9903568c04c40621b94",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownershipRawNode_exterior": {
          "hash": "c414f9cc4cd89e86a9f54a08670eb8c8f3e9b22610f7b7d9b2aca87538c66d19",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownershipRawNode_program": {
          "hash": "7c2d8f1110e45c103b34f3f634b6023f4ffdfc5da625e39b757ede62a927b364",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownership_compiled_position": {
          "hash": "4abe62f2e981cde7f65bbb5e2892d54c9bd9437e1e1550bba7b9f8951a0d8fe2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownership_partition": {
          "hash": "a9ea76a2fb6679f71a8c213e3fe9fbfd39db8315478ca81bd7936492ee9f2b7f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownership_charged_origin": {
          "hash": "58519cdb8933f1fae512f96d0e31e46a844b7ad5c838d14876d215874937f23d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.ownership_distinct": {
          "hash": "34e80f1c5e9e2380e14e996ec395a245883673174344cc4bf858ac6aaefc086d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenProperSupport.physical_ownership": {
          "hash": "f6d2776fa9f728a235ee3a9b6390754b6a3dabdc0cc3a675f2dc0475bc5777c6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProperOwnership"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.records_source": {
          "hash": "437a61a53cd319f887eda93378e0f109fd709c1d9747deb8fd4e77c0e463f326",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.proper_support": {
          "hash": "5c6f2e9d804360f72b08750c57d10d96f9512522c6fba908887347c5ac83d067",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.output": {
          "hash": "5f046bbe098419e59655fce686ee1bfd685ba68791cc61e8c7dca3a35e0c1dc2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.field": {
          "hash": "cc8f761bd78a436e5b62f69e746761285b29662707461d4060366e94c3a607b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.gateCount": {
          "hash": "4fb6d4c3d7404d438d05a46814fbb8795c9ca21aea0fcd216bb537d393a90fe4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.charge_accounting": {
          "hash": "2264e7418f8b4391813ad064cbb043a4d2e27480fbb091497a4602d1d6206cce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictGain": {
          "hash": "2f7d4f8fcdd07d5f5d87cdbd71bfa6b741458bb71a57152549a2dc4089b9848e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent": {
          "hash": "47f9cc054c7a8c2c40750548184fc3c5c32ad95f3ed5872d9945af8cc7f6f21d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.physical_ownership": {
          "hash": "3ed94e0bc4fff18f80da2ed5a796492e2c320c3cf028ac18cc6a6f61e18cdaed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.closed_ledger": {
          "hash": "052af36b3ec051738c97181fbfe929297367ef4a5fa2066056b7299fceb0a461",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.creation_lifecycle": {
          "hash": "150b92266e1ffaff1bc2c238a570e17dcf21c2f1ffeba8912edab47fc0f68786",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_complete": {
          "hash": "b1821ca8840e2117ba56d88abb4560d1a2cc1edd22bec2da09f03aed6130c929",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_exists_iff": {
          "hash": "607dd11f68d99c899559f22b3de54a7da719c006b7bf5f6c31980c9a082b36b0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_sound": {
          "hash": "614ff8c704c825a45e251875ff486386ac4e7c9c968a8da47a213bf8ce071994",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_decode_none": {
          "hash": "98f44c362e63209904315e4cb49ab0888848f3354629b75e38b89a6ee853ec41",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_program_none": {
          "hash": "590354c6341019bdcf9ed9d6dc48f45d703a8cc7dc4825820714a1cbb46d73aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_not_proper": {
          "hash": "38f9ab062e770785bfd5f6ea282de7061e1dd1b1a8d2a787e51f52cbe212be62",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_no_gain": {
          "hash": "e4b610ddb95904ac15f56a5426179f601c7bbda8394423a0b6a8ee5d99ebeb49",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
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
      "number": 270,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-17-270",
      "id": "structural-reindexing-support-transport",
      "title": "Structural reordering and arbitrary-support replacement transport",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire candidates and checked finite raw index-swap sequences, structural reindexing constructs the raw graph and its successful compilation from the original circuit. Actual compiler placement and inverse placement determine literal gate-source pairs and ordered output references. For every descendant primitive-record list, including empty, full and duplicate-bearing lists, the construction derives the predecessor records and canonical boundary, interface, selected-gate and exterior bijections. Open support functions agree for every independent boundary valuation. A replacement is pulled back by literal input and output rewiring without padding; support and replacement counts agree, both matched signed surcharges are zero, and exact signed saving and strict gain are preserved. Complete raw splices have corresponding source pairs, outputs and dependency edges, with equivalent acyclicity and compiler success or rejection in both directions. Actual compiled-position maps preserve exterior and replacement ownership and literal sources. An actually accepted compatible descendant splice computes an accepted predecessor splice preserving whole-circuit semantics and exact local and whole signed savings. No predecessor compilation, order, transport map or source-fidelity witness is supplied.",
      "nonClaim": "This closes the computational structural-reordering component of arbitrary-support replacement transport, not full manuscript profile semantics: transported profile labels are not a proof of profile semantics. It does not establish completeness of the raw-swap encoding for every abstract permutation, all R1-R9 or N1-N10 rules, or the remaining normalization and materializer transport. Open replacement compatibility is required for semantic preservation, and actual descendant compiler acceptance is required for compiled pullback; a compatible arbitrary replacement need not be acyclic. Full manuscript VerifyDW, ChargeSoundness and Package E, global certificate discovery, terminal-family derivation and global route coverage remain open. There is no encoded-input polynomial runtime, output-size or certificate-size theorem for the complete construction. Unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin, deterministic CNFSAT in P and the eligible root remain open. Finite execution fixtures are regression evidence, not theorem authority. No fixed weighted checkpoint or global gate closes, and P = NP is not proved.",
      "fields": {
        "leanStructuralReindexingFormalized": true,
        "leanStructuralReindexingAxiomAuditPassed": true,
        "leanStructuralReindexingAuditedDeclarationCount": 108,
        "leanStructuralReindexingActualCompilerSourceFidelityTheorem": "PNP.DirectWire.RawNandWireStructure.compile_sources",
        "leanStructuralReindexingRawSwapDecodeTheorem": "PNP.DirectWire.StructuralReindexing.GateRenaming.decode_isSome",
        "leanStructuralReindexingDerivedCompilationTheorem": "PNP.DirectWire.StructuralReindexing.compiled_accepted",
        "leanStructuralReindexingLiteralSourceTheorem": "PNP.DirectWire.StructuralReindexing.result_sources",
        "leanStructuralReindexingLiteralOutputTheorem": "PNP.DirectWire.StructuralReindexing.result_output_source",
        "leanStructuralReindexingArbitraryRecordRoundTripTheorem": "PNP.DirectWire.StructuralReindexing.forward_backward_records",
        "leanStructuralReindexingBoundaryCorrespondenceTheorem": "PNP.DirectWire.StructuralReindexing.descendant_boundary",
        "leanStructuralReindexingInterfaceCorrespondenceTheorem": "PNP.DirectWire.StructuralReindexing.descendant_interface",
        "leanStructuralReindexingIndependentOpenSemanticsTheorem": "PNP.DirectWire.StructuralReindexing.open_support_pullback",
        "leanStructuralReindexingReplacementCompatibilityTheorem": "PNP.DirectWire.StructuralReindexing.pullReplacement_compatible",
        "leanStructuralReindexingMatchedSurchargeTheorem": "PNP.DirectWire.StructuralReindexing.matched_surcharge",
        "leanStructuralReindexingExactSignedSavingTheorem": "PNP.DirectWire.StructuralReindexing.replacement_saving_preserved",
        "leanStructuralReindexingRawDependencyCorrespondenceTheorem": "PNP.DirectWire.StructuralReindexing.splice_dependencies",
        "leanStructuralReindexingAcyclicityEquivalenceTheorem": "PNP.DirectWire.StructuralReindexing.splice_wellFounded_iff",
        "leanStructuralReindexingCompilationEquivalenceTheorem": "PNP.DirectWire.StructuralReindexing.splice_compile_success_iff",
        "leanStructuralReindexingRejectionEquivalenceTheorem": "PNP.DirectWire.StructuralReindexing.splice_compile_failure_iff",
        "leanStructuralReindexingActualPhysicalPositionTheorem": "PNP.DirectWire.StructuralReindexing.splice_physical_position",
        "leanStructuralReindexingCompiledLiteralSourcesTheorem": "PNP.DirectWire.StructuralReindexing.splice_compiled_sources",
        "leanStructuralReindexingCompiledLiteralOutputTheorem": "PNP.DirectWire.StructuralReindexing.splice_compiled_output_source",
        "leanStructuralReindexingComputedPredecessorAcceptanceTheorem": "PNP.DirectWire.StructuralReindexing.pullCompiledSplice_accepted",
        "leanStructuralReindexingCompleteReplacementTransportTheorem": "PNP.DirectWire.StructuralReindexing.literal_replacement_transport",
        "leanStructuralReindexingArbitraryFiniteDimensionsAndDescendantRecordsCovered": true,
        "leanStructuralReindexingCompleteCheckedRawSwapSequenceRequired": true,
        "leanStructuralReindexingActualCompilerPlacementAndInverseUsed": true,
        "leanStructuralReindexingCanonicalPortAndOwnershipBijectionsDerived": true,
        "leanStructuralReindexingAllIndependentBoundaryValuationsCovered": true,
        "leanStructuralReindexingLiteralInputAndOutputReplacementRewiring": true,
        "leanStructuralReindexingBothMatchedSignedSurchargesZero": true,
        "leanStructuralReindexingExactLocalAndWholeSignedSavingPreserved": true,
        "leanStructuralReindexingBothDependencyAndRejectionDirectionsProved": true,
        "leanStructuralReindexingAcceptedDescendantSpliceRequiredForCompiledPullback": true,
        "leanStructuralReindexingOpenReplacementCompatibilityRequiredForSemantics": true,
        "leanStructuralReindexingCallerSuppliedPredecessorCompilerOrOrderRequired": false,
        "leanStructuralReindexingCallerSuppliedTransportMapsRequired": false,
        "leanStructuralReindexingCallerSuppliedSourceFidelityRequired": false,
        "leanStructuralReindexingPaddingUsed": false,
        "leanStructuralReindexingAllCompatibleSplicesAcyclicProved": false,
        "leanStructuralReindexingArbitraryPermutationEncodingComplete": false,
        "leanStructuralReindexingFullManuscriptProfileSemanticsProved": false,
        "leanStructuralReindexingAllNormalizationAndMaterializerRulesProved": false,
        "leanStructuralReindexingFullManuscriptVerifyDWProved": false,
        "leanStructuralReindexingCompleteChargeSoundnessAndPackageEProved": false,
        "leanStructuralReindexingGlobalCertificateDiscoveryProved": false,
        "leanStructuralReindexingTerminalFamiliesDerived": false,
        "leanStructuralReindexingGlobalRouteCoverageProved": false,
        "leanStructuralReindexingUnconditionalSaturatePositiveProved": false,
        "leanStructuralReindexingUnconditionalBCELReadyProved": false,
        "leanStructuralReindexingUnconditionalZeroSlackProved": false,
        "leanStructuralReindexingExactGeneralPCCMinProved": false,
        "leanStructuralReindexingPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanStructuralReindexingRuntimeExecutionIsProofAuthority": false,
        "leanStructuralReindexingScope": "arbitrary-finite-checked-raw-swaps-and-descendant-records-derived-canonical-port-and-ownership-bijections-independent-open-semantics-literal-replacement-rewiring-zero-matched-surcharge-exact-signed-saving-bidirectional-raw-dependency-and-acceptance-actual-compiled-physical-transport-no-full-profiles-or-materializers-or-global-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.RawNandWireStructure.initial_faithful": {
          "hash": "e7042f7084f9f6041f83b01963bf2030de0acc306654e9e2ab3d4e0cb8d0b285",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.RawNandWireStructure.apply_faithful": {
          "hash": "f60df4d336d71a0c71c724985145147576843d0b53320b5e06fefe3655aeecda",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.RawNandWireStructure.run_faithful": {
          "hash": "847686fee173489bf2754901e7b62ad529541016c09f92ccd15bc579c7187aab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.RawNandWireStructure.finish_sources": {
          "hash": "c2db6b1569ad4f93208f71419227ea4f4dbed991a277ffcbed3fa2de33769d3b",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.RawNandWireStructure.compile_sources": {
          "hash": "4e81fb4afae8047b603eb8e8fa6c71fc8d3bfc03eb41afe531e828c5728f4d17",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.RawNandWireStructure.physicalOrigin_sources": {
          "hash": "128dd1544dfc0db8828c2c62f6c8e3a139debf689c83221f663457b033e2278c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalWireStructure"
        },
        "PNP.DirectWire.StructuralReindexing.GateRenaming.forward_injective": {
          "hash": "46795fdf8ea3cb0a0dbe2fd9b1421469b4dfa74f0eb936b91bd8813040213c0c",
          "axioms": [],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.GateRenaming.backward_injective": {
          "hash": "a93f902c001902de91c95cb5083c3d5c62d3131dba83942c974b28599199afba",
          "axioms": [],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.GateRenaming.decode_isSome": {
          "hash": "dc4bbe912dfce7f42cc3ded9ad5c49e82e0337b04f084715bfc55ad035b75de5",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.sourceMap_compose": {
          "hash": "7150ce62f2c984229655e3e4e5f3b0a9ad8769bbcfbaee91b25065cd97342125",
          "axioms": [],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.sourceMap_eq_gate_iff": {
          "hash": "41d41b2b29c23ab74cda42f3738d4c1083b2a22207d55e97b4743f9ef8bab259",
          "axioms": [],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.sourceMap_eval": {
          "hash": "20dcb0abc64f34dad88fe5746f37ace6766de74e02c78948842d951830b7dcaf",
          "axioms": [],
          "module": "PNP.NANDGateRenaming"
        },
        "PNP.DirectWire.StructuralReindexing.graph_edge_ordered": {
          "hash": "e922690df23889b47b32454331d6f2ac6fd186604b225e4a83cdcaf044923de4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.graph_wellFounded": {
          "hash": "3916a452b6de280e882251327b4f0cac30cb98ea4715947698b640dd4f070dc8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.compile_isSome": {
          "hash": "d1e7e9933005ef4cda798225dbd870fe057d46f632f241eaca6bcd4a99d102d4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.compiled_accepted": {
          "hash": "4db9d5d92345462dc6b8186158f095ff8c820b33366398dd1acbd9c076f89ee0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.backward_forward": {
          "hash": "5d8e64d9dcbff4e127216c2a08222267b43f64541a75b204a41f8a0db0115331",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.forward_backward": {
          "hash": "2ad0353f06419392412f85f15b4d9347e0e01bde948c9d9731ceb5f3069327fd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.forwardGate_injective": {
          "hash": "92483d0d095663d8ad4f5a3269a6eecfb07bbeeb74841a326de604e2a3357987",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.backwardGate_injective": {
          "hash": "e7f1a1f40a81db0da6df33edaa55890cdddceb54b35c650287bd6c19e03faa36",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.translated_source": {
          "hash": "509c5e335bf5c68a2a8b80e60833aebab89df68f6eaeac6308adbc4948a803c4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.result_sources": {
          "hash": "0e615487098bb6b4019ce2b5da4c423f61c35f6925b528e23aeb47b4b6d4e5ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.result_output_source": {
          "hash": "23f3ce57ea33cb389a0cbb9001892775ebba92f9f0e2bdf748feed95b1e57006",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.result_gateCount": {
          "hash": "5ac11c5f8710bdb849333ea6446f3a2c34042d42670f61ca75653e4605434148",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.graph_solution": {
          "hash": "90da8fd6211b4b5f634eb0d4fdcaccd55fe3140cee75d6c8faebec10f9e86c50",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.result_semantics": {
          "hash": "924d51731ad7a297bae72b26493211d87e7dac5340603ff92356c24e37a87424",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.attempt_isSome": {
          "hash": "4cb44888349c66b54fe9590a9fbb1962c9ff1265e9284a4c065ce1ededaf6696",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.attempt_semantics": {
          "hash": "032d59d05b9e3e4c9bbedfd0090c3eb414301dec843175c7381c47baa23c3b9b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.attempt_gateCount": {
          "hash": "95705049635aaaa1357a0cd6bb5bef9ce4e730aae593ce64943f3fe8b482a03f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDStructuralReindexing"
        },
        "PNP.DirectWire.StructuralReindexing.backward_forward_wire": {
          "hash": "eb7159ac249a8498365c26a9e97bfa5448182d99daef8f9a3ad8b5843350dbb8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.forward_backward_wire": {
          "hash": "90e371d50b055069a0dd2ef55f4e3a08728096d14fcd6935966f9598de84fb80",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.backward_forward_record": {
          "hash": "f4c3d8c381b25a75b852fa7923cca57e91783dba1a740b5cd348f88d33e61225",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.forward_backward_record": {
          "hash": "dead7770b1c74dd93d953789eb0e8f425c0cfa0880c9a900ca867832a890d405",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.forwardRecord_injective": {
          "hash": "99ec264636589c6210ae638a5d6f0bf919c89bb477023f6159fab7a7a5d5aed8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.backward_forward_records": {
          "hash": "07874381bc467203411021e2cfc5543f9cc2ebab2b091b6ea4306473801190c7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.forward_backward_records": {
          "hash": "3c06792d39643bb83524aa1228dad3a4c3272701b3608ab242941ae94934e903",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.forwardRecord_mem": {
          "hash": "a76c5b872877ca1e8355c467fe63e352c18b7e290a1d7cb01be548774782d3f0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.selected_forward": {
          "hash": "58d8587bc13ef48f0bbd66d65b404871f46ef3dcf6b4f281a9fbed18a160f13e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.external_forward": {
          "hash": "d8f7f158b8a90b1ba7382d75a8a2eb6e282700729325bf3983d5be45b3c7b24a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.backward_forward_source": {
          "hash": "a29fbf30df1336c90904034dd1bff6d24f041094211c0b19dcab69e46b189956",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.sourceMap_forward_injective": {
          "hash": "c2376929f530cfe83a534b40f0a43a6571571187579e2dec5caffe50ed2ca9fd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.source_wire_map": {
          "hash": "94a647635c683860bfb6ad4a90cbacf976fa499a7bc7df705594200f78ce83e5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.source_wire_iff": {
          "hash": "d8e721b4bfd824df2087838d95ad96401d986dd4ec4efa15eb5e06a7baba1174",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.uses_forward": {
          "hash": "f67c46b240f493be0f322cca3ef004658946c8b9cb350e90d910af6e56ed0eda",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.boundary_forward": {
          "hash": "723b781158e13d90de889815029368e36d4b958d02e3f5adbf8d731e8c174325",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.externalConsumer_forward": {
          "hash": "128d0cb68767dbbc48c1955df5d8baec0f22e4556dbb73f22300fe8962a65cad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.globalOutput_forward": {
          "hash": "0409980ab919d9b2973e4b9198414a13698f68ed49d9beca4973102bf3288820",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.interface_forward": {
          "hash": "062045cda54a5d7598a892222963c39e9ee1e48449455e2a16ed8ac6899db3c7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.boundary_ports_forward": {
          "hash": "8f3f86c756b0aaaa0a4ba7c7a30d2bd88adc449cb9cca730c263c1f142bdbc36",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.interface_ports_forward": {
          "hash": "3ec95440966ec8b7ebdeb44ca59bfe8d3359093e9845bb0c20456ec46bacdc13",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.descendant_boundary": {
          "hash": "27dd51223f61fd631968bc87de4b7fb069b6ac46b8063c996f83fbb8856b7bd9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.descendant_interface": {
          "hash": "ea0552de68842ff4d9ee798cb650f89d30502cb4bc920e08aabc5f0e29045480",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSupport"
        },
        "PNP.DirectWire.StructuralReindexing.selected_backward": {
          "hash": "be5d80099cfa8602d0c46f3859da6220f3519d669058c6aa7871fd1b45c66d3e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedPorts"
        },
        "PNP.DirectWire.StructuralReindexing.pull_push_boundary_valuation": {
          "hash": "143f6453fd47d0a9ea1e41b256a23bc6591ac7ad645dfbdc33eec9e1a04ed68f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedPorts"
        },
        "PNP.DirectWire.StructuralReindexing.push_pull_boundary_valuation": {
          "hash": "b4c3905c60c563c21469dc4691154691421076023f60f2ead0166cd2483ab89c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedPorts"
        },
        "PNP.DirectWire.StructuralReindexing.selected_gate_count": {
          "hash": "07ab1af3b7fe20f7739c49ee35e9399eb1c8db75052021240f19c9e417931a8b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedPorts"
        },
        "PNP.DirectWire.StructuralReindexing.exterior_gate_count": {
          "hash": "359b51d69f5c902f6750efc088d49ec4ef9c2c3b0b5571c9f0f429a46adce3d3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedPorts"
        },
        "PNP.DirectWire.StructuralReindexing.external_wire_value_preserved": {
          "hash": "5eb90d625a7e6ac30d72edba27f374488406cb7f8b6b84ecaa060018e85ad5a2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedOpenSemantics"
        },
        "PNP.DirectWire.StructuralReindexing.open_gate_preserved": {
          "hash": "ad0e2b076d35f8c5d28e8c44c86d4aa8ec09b5d465810cdb2a0cb7950f666648",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedOpenSemantics"
        },
        "PNP.DirectWire.StructuralReindexing.open_support_preserved": {
          "hash": "9ec61bf9e82d444bd4108130417146ec73bce8ed0883de1aee13288d1659e247",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedOpenSemantics"
        },
        "PNP.DirectWire.StructuralReindexing.open_support_pullback": {
          "hash": "a7330e1af6e14c91be065a79aa1317898b846c8d9e4756d4525b98949919809f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedOpenSemantics"
        },
        "PNP.DirectWire.StructuralReindexing.extracted_support_preserved": {
          "hash": "7e677b708368c972a3bb9778bf1b6b08282e91391e60cb033086d7b892a0641a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedOpenSemantics"
        },
        "PNP.DirectWire.StructuralReindexing.renameInputs_gateSources": {
          "hash": "7c2b79875b3014941c1cb70f4d4bb9ff3531ccb9b4afe7232734a43350575daf",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_program": {
          "hash": "d0b640bffbbac6ce33de15c15facf281402620f33adff8c18bdb86e666397fab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_gate_sources": {
          "hash": "95d11fcc9118932d356f35169b64d9aec82547fa4f95b3ae72bfcff75dc2ec83",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_output_source": {
          "hash": "166c4efde4ee7855073c61b0a5c0cc482dab7be72d68aed33c035c10f134bc75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_gate_count": {
          "hash": "6fe3453c732cea767625b5a372f70b97d30774ba8b04a11c207227f4e32e8634",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_semantics": {
          "hash": "c79477c9d2248387ba8021c9e6551b1dd2450b49ac947052984b9f869456b954",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.pullReplacement_compatible": {
          "hash": "e9d11580c29ae3d633f89feaca7f4392251417cc5e2a03954e1dc0a8b748dbe8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.support_gate_count": {
          "hash": "f6f179fbfed857a9caf8ecf83c786bb7419e413f410540aff77330dac64a596d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.support_surcharge_zero": {
          "hash": "2e9876d2ca2e890f20308774fd7914c42bbb07787283e12fa844151b5d244dd7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.replacement_surcharge_zero": {
          "hash": "be1b0c722779c52ce98a41590b086e37a03b69fe25985373587fe3d8a3e9979f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.matched_surcharge": {
          "hash": "5debfaf49afaaaded71c9c92822fcf35bfd3cff7a4333af813c5fb1c00079810",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.replacement_saving_preserved": {
          "hash": "67c63a654277c26ab473f29958980cda3bf3e67ed81c2f35bacd402f686a24f0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.strict_gain_pullback": {
          "hash": "5523c388a39ab17052f8ac414b69d0105e0136a1e82555ffc837b07e943ef4ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedReplacement"
        },
        "PNP.DirectWire.StructuralReindexing.spliceForward_exterior": {
          "hash": "90915ac28eb2912f792dae1ecfd9e61c80e116a92af8d11714c906e4279634f7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.spliceForward_replacement": {
          "hash": "8aa2927657a840be6ecd60ee44a30bf037ba46f63548eaeffdea0c53bb206285",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.spliceBackward_exterior": {
          "hash": "b20348a3a6c9967b8656276c131adceb9a464989d4353a012d7ca09c9019bcf2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.spliceBackward_replacement": {
          "hash": "5be5229fcb3289084e3539dd4b808944fdfbbf250e884bce646c2270e7f72d1a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_backward_forward": {
          "hash": "21cec0f9e436b3ece57c6253f3521c706cffe62e2352474b504feddea5227cce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_forward_backward": {
          "hash": "6ec84c3a81fa3292fc7cbb803d3284a2d28136bf139a6e40a21963671093fab5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_boundarySource_forward": {
          "hash": "1fae075fa580f6f7b52e6610a526069143a214884f91fba72106b803db22fb75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_replacementSource_forward": {
          "hash": "9fb8d0cd2f06110d8b3b2ba028dbcae6828e85c39b8a2cdffa756af17cb08283",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_sources": {
          "hash": "8e95574ad082037a66bdeb2e4fd2dc0cd5b72f3da7942154e33fa43f02fe4df1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_output_source": {
          "hash": "5f2a5c908e4f243398cb27e92fadfe7d994acf184d66a5f3b6028804d83e55ff",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_dependencies": {
          "hash": "23879156aba4bd540245543e502bdf642914997e5ce839e79ed9c3ba55a75111",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_wellFounded_iff": {
          "hash": "f6213cb37d4cf14b07ed34318c1d3afbd7ddff24fa278288d1812a6fdbee9bab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compile_success_iff": {
          "hash": "57b4c35d17108248d835e6c5ec191892febcd62e5c26e90a861d0bca5747c3e2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compile_failure_iff": {
          "hash": "b0fb5032ee35a49b8cf3280f22089559dbcdb10060ee99721a294afe5c255e24",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_physical_backward_forward": {
          "hash": "1a107e1f4e019ea3d23b2ce82d179640c6131cc526c0d1e562487025e989667c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_physical_forward_backward": {
          "hash": "6616f0bfc12af01b2355c00b739648c88c4dbc5ada89fc15e660ec177d152fd4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_physical_position": {
          "hash": "ba6a049ef22466b4ed633b72bd122c012c153c2ffd8f7c4ec21c25798ddafa20",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_physical_exterior": {
          "hash": "94ef27d3a0d86ed7864eccca2627adbb9791b873d3fd0473f2842bac32018020",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_physical_replacement": {
          "hash": "33a5ec92de9e78280eea7e0fe498695c94e33db6b7fbf4b6a38e47746a275071",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compiled_sources": {
          "hash": "b5d8ea1ed268f9b85b5a7113936cf714aecd03796a74dc9a3e439bd777ca1014",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compiled_output_source": {
          "hash": "39b559176c54d63583f72cb73092e59fe2c9baa4573ce466162acd3027f21999",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compiled_gate_count": {
          "hash": "2f949b88ca9475a55b12c54c653a0c080945cd5f0451c21dd4a9f851d4ac547e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.splice_compiled_semantics": {
          "hash": "a1e9bf9938337fcef53f595b9c03e1b5ecf1cc94a28e41a5db9fedd3f29e697d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.pull_splice_isSome": {
          "hash": "2052b46d2ed1b72774821fb8b12b1f660eb4f50dc2ee214a73358b625b83859f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.pullCompiledSplice_accepted": {
          "hash": "d2c8151aa777fcc563ed5692a587449e65de7e51ddfa73b7fd4afc0f9c9a5bd8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.StructuralReindexing.literal_replacement_transport": {
          "hash": "6f6ba6fd10ae2025274a65566740f5f230222c092badfc6ceb17eb00b116b7f5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexedCompiledSplice"
        },
        "PNP.DirectWire.terminalOpenGateEvaluation_sourceEquation": {
          "hash": "d3c53e7e15227c609b625667699798e5f151715bef508d181575f265b8402764",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalOpenWireValue_boundary_get": {
          "hash": "87a7979757248c52077a0b0400846e4d8a295a863bd99c933dc3f7161c0ec9b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalOpenWireValue_external_absent": {
          "hash": "466fa8b9f64fef0ba0769d78b981f0e35c890ed20dd8fdbf897315a653c95ad7",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.boundarySource_input": {
          "hash": "6756b4ea8cadeacc264dbc2e956df0bffe34980cdf8bb07ba5830e0a6c135195",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.boundarySource_gate": {
          "hash": "7ac4e0b759c4cad50eb22be05168881e77fe1f0a0ed6eba7d64f006f76a0f49d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.originalSource_exterior": {
          "hash": "506c4ff0744cc8dc5328c013f1c8437f90b45bc0c4812b835cfcb3a75df309f5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.originalSource_interface": {
          "hash": "93ff230f571633713e0da734a4b3795d4cd069c5e411c953ca07ea9281a2c049",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
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
      "number": 271,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-17-271",
      "id": "structural-open-program-integration",
      "title": "Structural reordering in complete source-only replacement programs",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire carriers, raw swap sequences, dependency graphs and complete offered replacement programs, computed structural actions preserve the literal exposed field sources, ordered output values and exact syntactic causal labels. The raw decoder validates the entire sequence against the current carrier, not the initial gate count. The exact pending snapshot function, charge count and removal count are preserved. Local physical ownership comes from the actual backward gate bijection, and the complete program lifts it through the prior ledger without resetting earlier allocations or removals. Structural actions interleave with primitive obligations and descendant-support programs while preserving full output and field semantics, creation-to-discharge bindings, unique event identities, causal invariants and physical ownership. The existing proper-support certificate verifier over this expanded action language still requires a complete accepted program, a closed final ledger and actual strict signed saving. Invalid later operations reject the whole program rather than returning a successful prefix; reordering alone earns no strict saving. Callers supply raw data, not correctness, transport, order, causality or ownership witnesses.",
      "nonClaim": "This is integration of checked offered programs, not a successful certificate-discovery strategy for every input. Finite executions are regression evidence, not theorem authority. The computational carrier does not establish full manuscript profile semantics or all R1-R9 and N1-N10 rules. Full manuscript VerifyDW, ChargeSoundness and Package E, global certificate discovery, terminal-family derivation and global route coverage remain open. There is no encoded-input polynomial runtime, output-size or certificate-size theorem for the complete construction. Unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global gate closes, and P = NP is not proved.",
      "fields": {
        "leanStructuralProgramsFormalized": true,
        "leanStructuralProgramsAxiomAuditPassed": true,
        "leanStructuralProgramsAuditedDeclarationCount": 63,
        "leanStructuralProgramsGateCausalLabelTheorem": "PNP.DirectWire.StructuralReindexing.result_gate_level",
        "leanStructuralProgramsLiteralFieldSourceTheorem": "PNP.DirectWire.WireCarrier.reindex_field_source",
        "leanStructuralProgramsPendingSnapshotTheorem": "PNP.DirectWire.WireObligationHistory.State.reindex_pending",
        "leanStructuralProgramsRawCurrentCarrierDecodeTheorem": "PNP.DirectWire.WireStructuralState.execute_isSome",
        "leanStructuralProgramsRawRejectionTheorem": "PNP.DirectWire.WireStructuralState.execute_failure_iff",
        "leanStructuralProgramsLocalPhysicalOwnershipTheorem": "PNP.DirectWire.WireStructuralState.Receipt.physical_ownership",
        "leanStructuralProgramsHistoricalOriginTheorem": "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_origin",
        "leanStructuralProgramsHistoricalChargesTheorem": "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_charged",
        "leanStructuralProgramsHistoricalRemovalsTheorem": "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_removed",
        "leanStructuralProgramsCompleteProgramLifecycleTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.creation_lifecycle",
        "leanStructuralProgramsCompleteProgramCausalInvariantTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.causalInvariant",
        "leanStructuralProgramsCompleteProgramPhysicalOwnershipTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.physical_ownership",
        "leanStructuralProgramsCompleteCertificateSoundnessTheorem": "PNP.DirectWire.WireOpenCertificate.verify_sound",
        "leanStructuralProgramsStrictResidualDescentTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent",
        "leanStructuralProgramsCheckedRawStructuralActionsDerived": true,
        "leanStructuralProgramsCurrentCarrierBoundsUsed": true,
        "leanStructuralProgramsCompleteRawSwapSequenceRequired": true,
        "leanStructuralProgramsExactPendingSnapshotsPreserved": true,
        "leanStructuralProgramsLiteralFieldSourcesPreserved": true,
        "leanStructuralProgramsWholeOutputAndFieldSemanticsPreserved": true,
        "leanStructuralProgramsAllInputCausalLabelsPreserved": true,
        "leanStructuralProgramsStructuralAllocationsAndRemovalsZero": true,
        "leanStructuralProgramsPreviousGlobalOwnersPreserved": true,
        "leanStructuralProgramsCompleteChargeAndRemovalHistoryPreserved": true,
        "leanStructuralProgramsCompleteAcceptedProgramRequired": true,
        "leanStructuralProgramsClosedFinalLedgerRequired": true,
        "leanStructuralProgramsProperSupportRequired": true,
        "leanStructuralProgramsStrictSignedSavingRequired": true,
        "leanStructuralProgramsCallerSuppliedOrderingOrMapsRequired": false,
        "leanStructuralProgramsCallerSuppliedCausalOrOwnershipWitnessRequired": false,
        "leanStructuralProgramsReorderingAloneEarnsStrictSaving": false,
        "leanStructuralProgramsAcceptsSuccessfulPrefixAfterFailedTail": false,
        "leanStructuralProgramsFullManuscriptProfileSemanticsProved": false,
        "leanStructuralProgramsAllNormalizationAndMaterializerRulesProved": false,
        "leanStructuralProgramsFullManuscriptVerifyDWProved": false,
        "leanStructuralProgramsCompleteChargeSoundnessAndPackageEProved": false,
        "leanStructuralProgramsGlobalCertificateDiscoveryProved": false,
        "leanStructuralProgramsTerminalFamiliesDerived": false,
        "leanStructuralProgramsGlobalRouteCoverageProved": false,
        "leanStructuralProgramsUnconditionalSaturatePositiveProved": false,
        "leanStructuralProgramsUnconditionalBCELReadyProved": false,
        "leanStructuralProgramsUnconditionalZeroSlackProved": false,
        "leanStructuralProgramsExactGeneralPCCMinProved": false,
        "leanStructuralProgramsPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanStructuralProgramsRuntimeExecutionIsProofAuthority": false,
        "leanStructuralProgramsScope": "arbitrary-finite-source-only-complete-programs-computed-current-carrier-raw-structural-actions-literal-field-wires-exact-causal-labels-pending-snapshots-zero-local-cost-prior-global-owners-and-history-closed-ledger-proper-support-strict-saving-no-global-discovery-or-full-manuscript-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.StructuralReindexing.result_gate_level": {
          "hash": "a50c0086d15fbd4074b697f5d2ee0a2cc4a3c560b6a897cf4b7d428f6b923147",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexingCausalBounds"
        },
        "PNP.DirectWire.StructuralReindexing.result_source_level": {
          "hash": "ab67b74a2c57b018dbd7a0e0d8c87bba4879f725e29d2e8d349f46a909a3752f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexingCausalBounds"
        },
        "PNP.DirectWire.StructuralReindexing.result_output_level": {
          "hash": "0ed0ad0cbc5890423ea42d55462642efdab463ad9dd1c140fe676fb0a118091c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDReindexingCausalBounds"
        },
        "PNP.DirectWire.WireCarrier.reindex_exposed": {
          "hash": "9dedb06fca17bd740917e249b8cea30323d0231377bf46cad60dc391863fd75f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_gateCount": {
          "hash": "0d947c176309c42bf07dbecf927a7b8d98d522647e9ef37f5800f7d833347e09",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_backward_forward": {
          "hash": "e7020fbef713b2c69e5836482cf13b749a97795e147b01bf8f2fd32ef28ac619",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_forward_backward": {
          "hash": "9078f22fd69aa63d2673a856d3322e82cc1dd15392917a9e6f2a9b5533add29a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_output": {
          "hash": "cf09ed635d35b9cd9552ec65eb1ae014ca8bb05414823cab5dc75ffb7579ea79",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_field": {
          "hash": "4612b606e7507e946f29548e3970060804ac6adcf0df141759023d91661407e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_field_source": {
          "hash": "4b052def21f902eae394a407393e26c5b0e97383909175a8b630fef6b8dfd6f7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_exposed_level": {
          "hash": "d6a1f8cddc0bcb52ad1cb75b4c47ba4012f780e5e91c61e9a99b6bff2e7614b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_output_level": {
          "hash": "1eff3d5235aa20f4143d929928e6aaac7bbbbbd3036937bedecfdb9019228bfd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_field_level": {
          "hash": "a4f2a92d2d54f64d54afc354e3b5d1fa89956729c517a9e9a94a37b2f31972c6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireCarrier.reindex_causalBounds": {
          "hash": "9a740ded5a4cd5450f45e36b76ec58c424d1f66ac143c3dcfa49af71838d4fb2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralReindexing"
        },
        "PNP.DirectWire.WireObligationHistory.State.reindex_pending": {
          "hash": "6858e7c2cb1d0d1c8fa9d5a8b0450b2c43b30e63f189f6aea40d2df5443904b3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireObligationHistory.State.reindex_charged": {
          "hash": "3278b0893f6fcfb33cb9ac19e3ad546142dfe3bcf241b1e8333cebbd6a775217",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireObligationHistory.State.reindex_removed": {
          "hash": "45128e8072c56c21232374f0726840652ef9ae56017b29f1c6deecf61094b843",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireObligationHistory.State.reindex_gateCount": {
          "hash": "c8dd434a6e1b1f51b4814a2615bb6c4c1baa921798c60eaa86ad3592549ac3ec",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireObligationHistory.State.reindex_causalInvariant": {
          "hash": "e8de8997cc2dec275f6d660c0ccc3edac2611801728268f621bf2fd7d8c72d7b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireStructuralState.execute_isSome": {
          "hash": "4035c397504a98fa0dfec573d7b3d6b24c8202b1b02d6a5dc4af9a0112935012",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireStructuralState.execute_failure_iff": {
          "hash": "c07429575f8c1aa7e0e81ca4040f14d70f72946450f9fc9109f98ab397854ec0",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireStructuralState"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_origin": {
          "hash": "4092333a17356c304128b3f2e0a7e28203538f6eccf21065545a97d5bc3277bd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_origin_forward": {
          "hash": "e603acdc3c620f7162b839f84eccdd7f7b1567769d226eaa7b2ab7bf0f6a5bda",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_origin_injective": {
          "hash": "1e22876ed58d059f7df324d13f989c964f9f0deac5ad3019a08c9e057cfff529",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_live_members": {
          "hash": "ccb499ea94d177c368edec9e3fd18fc0ef3e9edbd71bee3d6523b9a1fd97baae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_not_allocated": {
          "hash": "2ed955adbb23fe72e448ffc1cb1cccd479e2c47a79d722d4a0d56c794cfc5485",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_charged": {
          "hash": "b3a38a8a73eea8ab001c4b22f4f6966900a9bedfe7856af3bc96b1f24d8fd60b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_removed": {
          "hash": "228b4fcbbcbeb56497770b0c5b40e6d70ae73d8230b940bf0cac4f6ca4f96af4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.ownership_wellFormed": {
          "hash": "f9fef5f8077cd879ed5c275ddc21b46ab741ea12052d20bc939cf996d45c8a0f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireStructuralState.Receipt.physical_ownership": {
          "hash": "3ccd99b194af7c85675e7d978e91c68be26394005f26001b9c9a19400f276dee",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_origin": {
          "hash": "e92c140a15b6a707bafcaaadb2a9a25eef3768908749814d35c26e08c02cb979",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_charged": {
          "hash": "88cea4855d7a80e52fb1ef445208021ad6babff0a45d2f993f6fef31d0ff4a6a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_removed": {
          "hash": "12169fcda0c9ce0a4c4d421f867f039406516295425022212b8e06be0749c22a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_success_iff": {
          "hash": "e1b2b9787c19111793f9f90668214efb7c6eff4d421e77aa91f3476f3fc89d72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_failure_iff": {
          "hash": "8d3ebe6d609705e5320540cdcf174fb14bfcaf8aae8595d70ed1893c8dedc95a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.execute_failed_tail": {
          "hash": "c852f45d97e5d2309875f6ba6f2a62aa22f4293c81781f6d7df84cae93f2bb72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_output": {
          "hash": "9cea32cc78cee0b2c900d6de17291ab5a16954b5b0bcc3cc13c7966bb8002990",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_field": {
          "hash": "f7f2e0b981060c9871f68d80e139e2cd1035d277449dead2f13c9c5881518bef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.creation_lifecycle": {
          "hash": "9669cc796d490317f08119fd24b916dda275ff271609709f0ffe92e057a8fb2d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_count": {
          "hash": "45c2da7f85d2cf6b15e999f771315afdd40b625fc3443eca9a715f768594202b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_identities_nodup": {
          "hash": "35b434faefbe1677549ab531bffc512dc5a55890aec21d3ad8d43ec198101168",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.causalInvariant": {
          "hash": "93a3cdc341e0720cc8327ae38b59cf4a0e419540c23ac76916af0fac7fc557ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.physical_ownership": {
          "hash": "15204bb313e0909e10d02a1b740d478b508ce7d129322a15015f90648e12e562",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_origin_injective": {
          "hash": "7be2e11b1cce85296ad1dfd57f1ef683118d51ea34962fbaf7b56163241cea8d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_charge_origin": {
          "hash": "3d637bfdf13b74e29f7d946f218bb8aa0ff6873271eccfc1ab546da6027b1fe0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.compile_exists_iff": {
          "hash": "1e58bf5b50338a0b30d0fe144e44e7c1a2b000c78e460d0a25a72efa4398da75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.compile_none_iff": {
          "hash": "7682645460be03c064cbc89ad7d53075275e646683bf6395d7749f8cc2ab72a5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.records_source": {
          "hash": "437a61a53cd319f887eda93378e0f109fd709c1d9747deb8fd4e77c0e463f326",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.proper_support": {
          "hash": "5c6f2e9d804360f72b08750c57d10d96f9512522c6fba908887347c5ac83d067",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.output": {
          "hash": "5f046bbe098419e59655fce686ee1bfd685ba68791cc61e8c7dca3a35e0c1dc2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.field": {
          "hash": "cc8f761bd78a436e5b62f69e746761285b29662707461d4060366e94c3a607b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.charge_accounting": {
          "hash": "2264e7418f8b4391813ad064cbb043a4d2e27480fbb091497a4602d1d6206cce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictGain": {
          "hash": "2f7d4f8fcdd07d5f5d87cdbd71bfa6b741458bb71a57152549a2dc4089b9848e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent": {
          "hash": "47f9cc054c7a8c2c40750548184fc3c5c32ad95f3ed5872d9945af8cc7f6f21d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.physical_ownership": {
          "hash": "3ed94e0bc4fff18f80da2ed5a796492e2c320c3cf028ac18cc6a6f61e18cdaed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.closed_ledger": {
          "hash": "052af36b3ec051738c97181fbfe929297367ef4a5fa2066056b7299fceb0a461",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.creation_lifecycle": {
          "hash": "150b92266e1ffaff1bc2c238a570e17dcf21c2f1ffeba8912edab47fc0f68786",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_exists_iff": {
          "hash": "607dd11f68d99c899559f22b3de54a7da719c006b7bf5f6c31980c9a082b36b0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_sound": {
          "hash": "614ff8c704c825a45e251875ff486386ac4e7c9c968a8da47a213bf8ce071994",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_decode_none": {
          "hash": "98f44c362e63209904315e4cb49ab0888848f3354629b75e38b89a6ee853ec41",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_program_none": {
          "hash": "590354c6341019bdcf9ed9d6dc48f45d703a8cc7dc4825820714a1cbb46d73aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_not_proper": {
          "hash": "38f9ab062e770785bfd5f6ea282de7061e1dd1b1a8d2a787e51f52cbe212be62",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_no_gain": {
          "hash": "e4b610ddb95904ac15f56a5426179f601c7bbda8394423a0b6a8ee5d99ebeb49",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
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
      "number": 272,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-18-272",
      "id": "computational-recoding-program-integration",
      "title": "Computational recoding in complete source-only replacement programs",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire carriers, literal NAND encoder and decoder circuits, dependency graphs and complete offered replacement programs, raw recoding actions reuse the existing circuit format and validate both dimensions and every gate and output reference. A complete finite check derives both inverse equations. An independent exact syntactic dependency guard covers all ordinary outputs and hidden fields for every natural-valued input labelling. Actual encoder and decoder gates are appended, normalized and charged; actual compiler maps determine deletions and disjoint allocation identities. Recoding retains the entire pending snapshot function and cannot create or discharge an obligation. Complete-program execution lifts those physical identities through prior history, preserves full semantics, costs, causal invariants and creation-to-discharge bindings, and rejects an invalid later action rather than accepting a prefix. The proper-support certificate verifier still requires complete execution, a closed final ledger and strict actual saving. The existing structural decoder also has a constructive exact encoding of every finite gate bijection with at most one swap per gate. Callers supply raw data, not correctness, causal, ordering, ownership or cost authority.",
      "nonClaim": "This checks offered computational programs, not a successful certificate-discovery strategy for every input. The inverse checker enumerates all field valuations; finite termination and a bounded structural swap list do not establish uniformly polynomial encoded runtime or certificate size. Semantic reversibility does not imply physical cancellation or strict saving. Full manuscript profiles, all R1-R9 and N1-N10 rules, full VerifyDW, ChargeSoundness and Package E remain open. Terminal-family derivation, global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global proof gate closes, and P = NP is not proved.",
      "fields": {
        "leanComputationalRecodingFormalized": true,
        "leanComputationalRecodingAxiomAuditPassed": true,
        "leanComputationalRecodingAuditedDeclarationCount": 88,
        "leanComputationalRecodingStructuralExactEncodingTheorem": "PNP.DirectWire.StructuralReindexing.GateRenaming.decode_encode",
        "leanComputationalRecodingStructuralEncodingLengthTheorem": "PNP.DirectWire.StructuralReindexing.GateRenaming.encode_length_le",
        "leanComputationalRecodingLiteralInverseCheckTheorem": "PNP.DirectWire.WireCarrierRecoding.check_iff",
        "leanComputationalRecodingLiteralGateBalanceTheorem": "PNP.DirectWire.WireCarrierRecoding.result_gate_balance",
        "leanComputationalRecodingCausalGuardTheorem": "PNP.DirectWire.WireCarrier.dependencyGuard_iff",
        "leanComputationalRecodingPendingSnapshotTheorem": "PNP.DirectWire.WireObligationHistory.State.recode_pending",
        "leanComputationalRecodingLocalPhysicalOwnershipTheorem": "PNP.DirectWire.WireRecodingState.Receipt.physical_ownership",
        "leanComputationalRecodingRawDecodeRoundTripTheorem": "PNP.DirectWire.WireRecodingInput.decode_encode",
        "leanComputationalRecodingRawAcceptanceTheorem": "PNP.DirectWire.WireRecodingInput.execute_success_iff",
        "leanComputationalRecodingCompleteProgramGateBalanceTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.gate_balance",
        "leanComputationalRecodingCompleteProgramLifecycleTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.creation_lifecycle",
        "leanComputationalRecodingCompleteProgramPhysicalOwnershipTheorem": "PNP.DirectWire.WireOpenProgram.CompiledProgram.physical_ownership",
        "leanComputationalRecodingCompleteCertificateSoundnessTheorem": "PNP.DirectWire.WireOpenCertificate.verify_sound",
        "leanComputationalRecodingStrictResidualDescentTheorem": "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent",
        "leanComputationalRecodingExistingRawCodecReused": true,
        "leanComputationalRecodingBothDimensionsChecked": true,
        "leanComputationalRecodingCompleteLiteralRecodersRequired": true,
        "leanComputationalRecodingBothFullInverseEquationsChecked": true,
        "leanComputationalRecodingAllInputCausalLabelsChecked": true,
        "leanComputationalRecodingOrdinaryOutputsAndHiddenFieldsCovered": true,
        "leanComputationalRecodingExactPendingSnapshotsPreserved": true,
        "leanComputationalRecodingLiteralEncoderDecoderGatesCharged": true,
        "leanComputationalRecodingActualNormalizerDeletionMapsUsed": true,
        "leanComputationalRecodingDerivedEncoderDecoderAllocationPhases": true,
        "leanComputationalRecodingHistoricalChargesAndOwnersPreserved": true,
        "leanComputationalRecodingCompleteAcceptedProgramRequired": true,
        "leanComputationalRecodingClosedFinalLedgerRequired": true,
        "leanComputationalRecodingProperSupportRequired": true,
        "leanComputationalRecodingStrictSignedSavingRequired": true,
        "leanComputationalRecodingCallerSuppliedCorrectnessOrderCausalOrOwnerWitnessRequired": false,
        "leanComputationalRecodingRecodingDischargesOpenObligations": false,
        "leanComputationalRecodingSemanticReversibilityImpliesPhysicalCancellation": false,
        "leanComputationalRecodingSemanticReversibilityAloneEarnsSaving": false,
        "leanComputationalRecodingInverseCheckEnumeratesAllFieldValuations": true,
        "leanComputationalRecodingFullManuscriptProfileSemanticsProved": false,
        "leanComputationalRecodingAllRecodingAndNormalizationRulesProved": false,
        "leanComputationalRecodingFullManuscriptVerifyDWProved": false,
        "leanComputationalRecodingCompleteChargeSoundnessAndPackageEProved": false,
        "leanComputationalRecodingGlobalCertificateDiscoveryProved": false,
        "leanComputationalRecodingTerminalFamiliesDerived": false,
        "leanComputationalRecodingGlobalRouteCoverageProved": false,
        "leanComputationalRecodingUnconditionalSaturatePositiveProved": false,
        "leanComputationalRecodingUnconditionalBCELReadyProved": false,
        "leanComputationalRecodingUnconditionalZeroSlackProved": false,
        "leanComputationalRecodingExactGeneralPCCMinProved": false,
        "leanComputationalRecodingPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanComputationalRecodingRuntimeExecutionIsProofAuthority": false,
        "leanComputationalRecodingScope": "arbitrary-finite-source-only-complete-programs-existing-raw-codec-both-literal-recoders-exact-inverse-and-syntactic-causal-checks-pending-snapshots-actual-allocations-deletions-and-global-ownership-closed-ledger-proper-support-strict-saving-no-global-discovery-full-manuscript-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.StructuralReindexing.GateRenaming.decode_encode": {
          "hash": "6660efe22c09761b56b9f6868aecb0d5999fb0293e6d24651c9af3f597d8fccc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDGateRenamingEncoding"
        },
        "PNP.DirectWire.StructuralReindexing.GateRenaming.encode_length_le": {
          "hash": "40e8aa3e2cafa08891074bb9146c43e7b245a630ab6a02e735d94055842172fd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDGateRenamingEncoding"
        },
        "PNP.DirectWire.StructuralReindexing.GateRenaming.validCode_encode": {
          "hash": "86c582cc582c38d6ace241f6b588e092cbca557c25e2edeb08d2585afd4f33e1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDGateRenamingEncoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.roundTripCheck_iff": {
          "hash": "032eb300149ce2abaf6977b5e973fd3f46b12b0150f64c9bb72023c2c716ff1b",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.check_iff": {
          "hash": "b8428c4919ec8ff68924f61a6fd39bdd107997cd1a158112f547ad72671bd9a1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.compile_success_iff": {
          "hash": "c252a271b9a546e07bea6ee0dc4fd26de8ed615c73fc60e84797f38e5753eb1a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.appendMap_gateCount": {
          "hash": "eb6fa751827131872c833b142841a94f168e0c803fda35ceb0663e4b87d475ac",
          "axioms": [],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.appendMap_output": {
          "hash": "9f8dc75c0ab8e91fecfc6ce9406063ab912094b9957d167d5a9b2d259a6aedfc",
          "axioms": [],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.appendMap_field": {
          "hash": "d3c3093bfd6ceb0fc8bd69723e948ce185e03f8c64d898c1d3f5deee91bdd512",
          "axioms": [],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.encoded_output": {
          "hash": "c7ca6dec5879b620506628e240fba74fbdf6667d14989dab7ccd1c8bd649c39e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.encoded_field": {
          "hash": "d94d62958eb4f782f0692bfadda25d7512c6310f2d83ccc5872acfc27a0a09ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.result_output": {
          "hash": "f33da5b5ebefd1113e056b6e47aea7e23a291deef7b8a8d03e53f31faba88e86",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.result_field": {
          "hash": "8ab7ae4e6e2e7d43d68793c565dc74f2e9dfaa6786f5c05844d4806e48d46d44",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.WireCarrierRecoding.result_gate_balance": {
          "hash": "7b07f5a4f35d636ffc64f8f8ff18fe992b3a5ddcd6ed3f48e5169997988fc920",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrierRecoding"
        },
        "PNP.DirectWire.CausalBound.levels_bounded_iff": {
          "hash": "ebbd048bd7305b05f887b0f38fe0a8558ff3c75f1f45e5dc05c0e699fea1ab3b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCausalGuard"
        },
        "PNP.DirectWire.CausalBound.source_bounded_iff": {
          "hash": "9d414f1e1ee5f72ad11ec4cd652f4f8abcaea66dea4730bce6fbfd4c6938e3ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCausalGuard"
        },
        "PNP.DirectWire.CausalBound.sourceDependencyGuard_iff": {
          "hash": "bbc0960840ffc1d4ac5d0f0a37df41ffadca0cca93da82e54b2022a045fde04c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCausalGuard"
        },
        "PNP.DirectWire.CausalBound.candidateDependencyGuard_iff": {
          "hash": "4ec22d9a6690ce9b4806807fb76f566a7867a92348870b0b312fe22eaed350f6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCausalGuard"
        },
        "PNP.DirectWire.WireCarrier.dependencyGuard_iff": {
          "hash": "1e98d48243e129b1f266728ecdb55e9772ad9cb0438a15a4a15923136ccf8c44",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDCausalGuard"
        },
        "PNP.DirectWire.WireObligationHistory.State.recode_pending": {
          "hash": "7c1beb6c753f0df3e0b0bf1f38118dd98f17aa879a2e852d3c98821188eb1e1f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireObligationHistory.State.recode_charged": {
          "hash": "b4aef62d364b7c4c6245f0e8ca8bed41a05464e2ce230a9d000928fd78255a64",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireObligationHistory.State.recode_removed": {
          "hash": "77b196818890ebefe25898ac14af4cf46939c89dac367989b8de0c7343de2e5e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireObligationHistory.State.recode_causalInvariant": {
          "hash": "e4fea440709b30d81dcee0c486755763594e3365ca54804d350283017cb5bc78",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireRecodingState.execute_success_iff": {
          "hash": "163a20967daa234a938ed706f4589614e6f7a7a6b4c50617e7b27f016004ef67",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireRecodingState.execute_failure_iff": {
          "hash": "6267b7e4cbba64143b2dfae86f1bea5d19f3ab0b5eaf9bd449139e5c96e45da0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireRecodingState.Receipt.pending": {
          "hash": "06e2fb27322a3af09bfe49347dada9112574cc40c1fbf9cb76012029a1e64295",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireRecodingState.Receipt.causalInvariant": {
          "hash": "bc8cd87f7609392854afd1faf6e146905ab74ed6d464cade9e0e3e68d56b9657",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireRecodingState.Receipt.gate_balance": {
          "hash": "1e6c6b94e24fcff4c2b9a18f85066b7a2705fa257dae1bdb63eb690d4be6ff86",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingState"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.encoder_positions": {
          "hash": "6d89fcd3e581a501e3e527a69e8657eeb7436bf5a461994e3db75dfb949de272",
          "axioms": [],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.encoded_origin": {
          "hash": "91e43da2e83bfadc32a72a6c33bc18d997a04c89d60f9f32c70996c33963b6af",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.decoder_positions": {
          "hash": "2c004056d1bcee2aae311e9da8de9f4bb905479e0245fbf859a99c66b5749ba4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.ledger_origin": {
          "hash": "fd73735bdfbd7090574471bfe761c22f73dc15b710234b6c768cf64b52667237",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.ledger_charged": {
          "hash": "ac0136ab5f53d55cf3261e7f551d4bc8939b7ebf9c45d4db40406c042f9d6852",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.ledger_removed_length": {
          "hash": "920379da36b7bda0a59d43b00178cd7ad1cb4e359cd376975578a9cceb6ec2a6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.ledger_partition": {
          "hash": "9df0c1ff67ea10307421dbc671a69d40d14574f8bfddb1825bc535a22568b891",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.allocation_phases_nodup": {
          "hash": "ad233c47fc6d4bc001a3bca2b580b932bda58fa0f9a690c1d717314243c170f8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.physical_ownership": {
          "hash": "287e316a38d92876f3dd036c3030d8f9e6e737d4b4ca3f75ee6d906578552855",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.labelled_live": {
          "hash": "c12e4e6094a3e2d9ad3de90152006415fd71caf1e9d8bf4e0031523d72fa6a62",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireCarrierRecoding.PhysicalAccounting.labelled_physical_ownership": {
          "hash": "d03fd71b704320f0f35fbfebe9190485d93ee5d15cc51b525e01a9f8b79d337b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireRecodingState.Receipt.physical_ownership": {
          "hash": "1ebfc373a28ff6745659553facfee02c25b8de30ce65a455d5a9f10d0b5e61f0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingOwnership"
        },
        "PNP.DirectWire.WireRecodingInput.decode_encode": {
          "hash": "e92256250c309c1f4f00db703ba20064341335f7c635db2d8b31d20c8e0f0410",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.decode_elaboration_none": {
          "hash": "00dc4032e7ad2ad068d9d9f0e5f1ff527ad2d1b1185e77c9440588efafd68d20",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.decode_success_iff": {
          "hash": "55446d2b69fe0cfe75b6ab50ec814c47e26be72f941e6cb3ca198f8de5026750",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.execute_success_iff": {
          "hash": "65eb3ce7bcf01ef30132102bbc072a72b91830806d9e7484657f64e505c98e04",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.execute_encoder_none": {
          "hash": "feb8050014d9ab99386ccaf89e4aba6346890e198e7dd31f255d3440dffb62b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.execute_decoder_none": {
          "hash": "0e5627a266dfdb1572d0bb12dae49c511c94b741a24e6c49f000735a21a926ab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.Receipt.pending": {
          "hash": "3c072c2c7bce589939d52436812277a7d12ce4ac94dfffddd9cb27e068268877",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.Receipt.charged_eq": {
          "hash": "7e9181ee0fcf90a9fb29963d279ab8a45437318748bb5eef59e63b781c5c8613",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.Receipt.removed_eq": {
          "hash": "1415c929619344b454b432c5f79407b5c03b3bbedf1fa2c5362adfb66cc12f2a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireRecodingInput.Receipt.causalInvariant": {
          "hash": "46b915d04524543f69ebe8a94b8690e6759396b5a2d702ba9cb0ffe659813072",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireRecodingInput"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_origin": {
          "hash": "e92c140a15b6a707bafcaaadb2a9a25eef3768908749814d35c26e08c02cb979",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_charged": {
          "hash": "88cea4855d7a80e52fb1ef445208021ad6babff0a45d2f993f6fef31d0ff4a6a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.ProgramOwnership.advance_structural_removed": {
          "hash": "12169fcda0c9ce0a4c4d421f867f039406516295425022212b8e06be0749c22a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireStructuralProgram"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_success_iff": {
          "hash": "e1b2b9787c19111793f9f90668214efb7c6eff4d421e77aa91f3476f3fc89d72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.orderEvents_failure_iff": {
          "hash": "8d3ebe6d609705e5320540cdcf174fb14bfcaf8aae8595d70ed1893c8dedc95a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramInput"
        },
        "PNP.DirectWire.WireOpenProgram.execute_failed_tail": {
          "hash": "c852f45d97e5d2309875f6ba6f2a62aa22f4293c81781f6d7df84cae93f2bb72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_output": {
          "hash": "9cea32cc78cee0b2c900d6de17291ab5a16954b5b0bcc3cc13c7966bb8002990",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.full_field": {
          "hash": "f7f2e0b981060c9871f68d80e139e2cd1035d277449dead2f13c9c5881518bef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.creation_lifecycle": {
          "hash": "9669cc796d490317f08119fd24b916dda275ff271609709f0ffe92e057a8fb2d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_count": {
          "hash": "45c2da7f85d2cf6b15e999f771315afdd40b625fc3443eca9a715f768594202b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.executed_identities_nodup": {
          "hash": "35b434faefbe1677549ab531bffc512dc5a55890aec21d3ad8d43ec198101168",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.causalInvariant": {
          "hash": "93a3cdc341e0720cc8327ae38b59cf4a0e419540c23ac76916af0fac7fc557ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.physical_ownership": {
          "hash": "15204bb313e0909e10d02a1b740d478b508ce7d129322a15015f90648e12e562",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_origin_injective": {
          "hash": "7be2e11b1cce85296ad1dfd57f1ef683118d51ea34962fbaf7b56163241cea8d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.ownership_charge_origin": {
          "hash": "3d637bfdf13b74e29f7d946f218bb8aa0ff6873271eccfc1ab546da6027b1fe0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.compile_exists_iff": {
          "hash": "1e58bf5b50338a0b30d0fe144e44e7c1a2b000c78e460d0a25a72efa4398da75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.compile_none_iff": {
          "hash": "7682645460be03c064cbc89ad7d53075275e646683bf6395d7749f8cc2ab72a5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.records_source": {
          "hash": "437a61a53cd319f887eda93378e0f109fd709c1d9747deb8fd4e77c0e463f326",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.proper_support": {
          "hash": "5c6f2e9d804360f72b08750c57d10d96f9512522c6fba908887347c5ac83d067",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.output": {
          "hash": "5f046bbe098419e59655fce686ee1bfd685ba68791cc61e8c7dca3a35e0c1dc2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.field": {
          "hash": "cc8f761bd78a436e5b62f69e746761285b29662707461d4060366e94c3a607b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.charge_accounting": {
          "hash": "2264e7418f8b4391813ad064cbb043a4d2e27480fbb091497a4602d1d6206cce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictGain": {
          "hash": "2f7d4f8fcdd07d5f5d87cdbd71bfa6b741458bb71a57152549a2dc4089b9848e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.strictResidualDescent": {
          "hash": "47f9cc054c7a8c2c40750548184fc3c5c32ad95f3ed5872d9945af8cc7f6f21d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.physical_ownership": {
          "hash": "3ed94e0bc4fff18f80da2ed5a796492e2c320c3cf028ac18cc6a6f61e18cdaed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.closed_ledger": {
          "hash": "052af36b3ec051738c97181fbfe929297367ef4a5fa2066056b7299fceb0a461",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.CheckedCertificate.creation_lifecycle": {
          "hash": "150b92266e1ffaff1bc2c238a570e17dcf21c2f1ffeba8912edab47fc0f68786",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_exists_iff": {
          "hash": "607dd11f68d99c899559f22b3de54a7da719c006b7bf5f6c31980c9a082b36b0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_sound": {
          "hash": "614ff8c704c825a45e251875ff486386ac4e7c9c968a8da47a213bf8ce071994",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_decode_none": {
          "hash": "98f44c362e63209904315e4cb49ab0888848f3354629b75e38b89a6ee853ec41",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_program_none": {
          "hash": "590354c6341019bdcf9ed9d6dc48f45d703a8cc7dc4825820714a1cbb46d73aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_not_proper": {
          "hash": "38f9ab062e770785bfd5f6ea282de7061e1dd1b1a8d2a787e51f52cbe212be62",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenCertificate.verify_no_gain": {
          "hash": "e4b610ddb95904ac15f56a5426179f601c7bbda8394423a0b6a8ee5d99ebeb49",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenCertificate"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.charged_eq": {
          "hash": "582b965b392cbc1cf45464dca92b57b3a2d6f4f60df828d2587f4e290c73134e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.removed_eq": {
          "hash": "4984f8ac769eb86a56fe34136572428de242317a17b8b407150f7ebe4d49c8e2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.causalInvariant": {
          "hash": "2983a548ee9035eecf6401bb87dbb74eed55ba77c8470dbfa596155e65c833f7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
        },
        "PNP.DirectWire.WireOpenProgram.Transition.local_physical_ownership": {
          "hash": "058766b012a2a8c0127b27d8da2cbc11b9d5b1dc246a05d2a3932d1bab773f31",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgramOwnership"
        },
        "PNP.DirectWire.WireOpenProgram.CompiledProgram.gate_balance": {
          "hash": "7a8f96270f3ca4f981f6bb2f38f5af353346b02300932f5b24ee05e5f8804c71",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireOpenProgram"
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
      "number": 273,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-18-273",
      "id": "source-derived-zero-cost-exposure",
      "title": "Source-derived zero-cost alias exposure",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, ordinary-output and extra-field widths, a literal output extension adds only input, constant or existing-output aliases and a literal projection recovers the original outputs without allocating gates. Both constructions transfer arbitrary equivalent realizations, proving exact equality of the semantic reference minimum and residual slack. A source-derived recognizer scans the actual output wires; a gate field is accepted exactly when an ordinary output names that same wire. The tuple compiler derives every alias and accepts exactly when all requested fields have such literal references. The actual WireCarrier exposure therefore preserves physical gate count, semantic minimum and slack whenever this executable source check accepts. Constructors and recognition do not enumerate truth tables or minimum implementations and do not receive an observer, semantic minimum, route or correctness certificate from the caller.",
      "nonClaim": "This covers the literal input/constant/old-output alias class, not every semantically free exposure or arbitrary hidden internal wire. Refusal proves neither semantic impossibility nor a Package E gain or route. Adding no physical gates need not preserve the semantic minimum, and unique physical ownership or an extra recorded charge does not force an equal minimum increase. The concrete counterexamples are regression and obstruction evidence, not new global progress. The existing fresh-independent-input materializer theorem is reused, not re-awarded. Full manuscript profiles, positive-cost transparency for arbitrary materializers, terminal-family derivation, global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete encoded-input polynomial runtime, output and certificate bounds remain open. No fixed weighted checkpoint or global proof gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanSourceDerivedZeroCostExposureFormalized": true,
        "leanSourceDerivedZeroCostExposureAxiomAuditPassed": true,
        "leanSourceDerivedZeroCostExposureAuditedDeclarationCount": 22,
        "leanSourceDerivedZeroCostExposureMinimumTheorem": "PNP.DirectWire.ZeroCostExposure.referenceMinimum_extend",
        "leanSourceDerivedZeroCostExposureSlackTheorem": "PNP.DirectWire.ZeroCostExposure.residualSlack_extend",
        "leanSourceDerivedZeroCostExposureRecognitionTheorem": "PNP.DirectWire.ZeroCostExposure.recognize_success_iff",
        "leanSourceDerivedZeroCostExposureGateRefusalTheorem": "PNP.DirectWire.ZeroCostExposure.recognize_gate_none_iff",
        "leanSourceDerivedZeroCostExposureTupleAcceptanceTheorem": "PNP.DirectWire.ZeroCostExposure.compileLayout_available_iff",
        "leanSourceDerivedZeroCostExposureCarrierMinimumTheorem": "PNP.DirectWire.WireCarrier.exposed_referenceMinimum_of_checkLayout",
        "leanSourceDerivedZeroCostExposureCarrierSlackTheorem": "PNP.DirectWire.WireCarrier.exposed_residualSlack_of_checkLayout",
        "leanSourceDerivedZeroCostExposureCarrierPreservationTheorem": "PNP.DirectWire.WireCarrier.checked_exposure_preserves_problem",
        "leanSourceDerivedZeroCostExposureArbitraryFiniteDimensionsCovered": true,
        "leanSourceDerivedZeroCostExposureLiteralInputConstantAndOldOutputAliasesCovered": true,
        "leanSourceDerivedZeroCostExposureBothRealizationTransfersProved": true,
        "leanSourceDerivedZeroCostExposureActualSourceRecognitionComputed": true,
        "leanSourceDerivedZeroCostExposureEveryRequestedFieldChecked": true,
        "leanSourceDerivedZeroCostExposureActualCarrierMinimumAndSlackPreserved": true,
        "leanSourceDerivedZeroCostExposureCallerSuppliedObserverMinimumOrCorrectnessRequired": false,
        "leanSourceDerivedZeroCostExposureConstructorOrRecognizerEnumeratesSemanticMinima": false,
        "leanSourceDerivedZeroCostExposureAllSemanticallyFreeExposuresRecognized": false,
        "leanSourceDerivedZeroCostExposureRefusalImpliesPackageERoute": false,
        "leanSourceDerivedZeroCostExposureNoPhysicalGateIncreaseAloneImpliesZeroCost": false,
        "leanSourceDerivedZeroCostExposureUniquePhysicalChargeAloneForcesMinimumIncrease": false,
        "leanSourceDerivedZeroCostExposureArbitraryPositiveCostTransparencyProved": false,
        "leanSourceDerivedZeroCostExposureFullManuscriptProfileSemanticsProved": false,
        "leanSourceDerivedZeroCostExposureTerminalFamiliesDerived": false,
        "leanSourceDerivedZeroCostExposureGlobalRouteCoverageProved": false,
        "leanSourceDerivedZeroCostExposureUnconditionalSaturatePositiveProved": false,
        "leanSourceDerivedZeroCostExposureUnconditionalBCELReadyProved": false,
        "leanSourceDerivedZeroCostExposureUnconditionalZeroSlackProved": false,
        "leanSourceDerivedZeroCostExposureExactGeneralPCCMinProved": false,
        "leanSourceDerivedZeroCostExposurePolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanSourceDerivedZeroCostExposureScope": "arbitrary-finite-literal-input-constant-old-output-alias-extension-projection-exact-minimum-slack-source-derived-tuple-recognition-actual-carrier-no-semantic-completeness-positive-cost-global-route-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.ZeroCostExposure.Reference.toSource_eval": {
          "hash": "18a33b06fc291b34cb074d9688282210f4c21a2708a0c4ab924f8dd985335bab",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.extend_gateCount": {
          "hash": "668882a9bee592090a6cec5f6f2c005121d7682ffb9daa2c5996f8c4d68dee42",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.project_gateCount": {
          "hash": "315753fe80872380b5de8fdca1acf5d866c46416b5e009aeeda8fcc0522f68ae",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.extend_original": {
          "hash": "f735eb48df9890020c841808534c329a72147c759c301d871f21553788157c1f",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.extend_field": {
          "hash": "e9c748c782da7b3b5800c4720fe32cc1fc2d064c15a57ad05109aa844805e6ec",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.project_semantics": {
          "hash": "5cb6faa5210bc24c6aeaabeb999b2a3927da180a0fbf7be9c07cd10b7119bf38",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.extend_equivalent": {
          "hash": "aa61a3a9de83ed22b63685b40b6252144097ae47ce12e57379c69b4e0ae4b74d",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.project_equivalent": {
          "hash": "1cb9297b40140397fc91a2ce4e347ec69b6a9fbe3eee1850d3c1e2a4ed029949",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.project_extend_equivalent": {
          "hash": "95ed0c663bfa2ce81f7763f170bab6e3ff26cf9ac9f0e5ce87ff7e8c084f1f41",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.referenceMinimum_extend": {
          "hash": "e70b4f616f47d81708dfa5b8531191b6942b71ba7c98a2512597416aa98fce55",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.residualSlack_extend": {
          "hash": "11201b09ca4b92710181dde08fb4fbded4bfb4287ad300290472eb7a090a2cdd",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.compileLayout_success_iff": {
          "hash": "0a80a0b6ab49c9d96899615f2bfea720c3c609b514fa2c2909fa7ab0aa892f25",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.compileLayout_sound": {
          "hash": "f62382d60b18888943122868a9e6fbe45f4ec8574fa71dfc4d159b8aba448f11",
          "axioms": [],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.recognize_success_iff": {
          "hash": "7ab1cec4a649def55ddef0b39b50192de5909625fdc73ad330ed49c521f0fbb1",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.recognize_isSome_iff": {
          "hash": "e86ee10c9054890003e5c6b8e9ef7c53b0d1c4ade0eb1238011988ea4506b60d",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.recognize_none_iff": {
          "hash": "c1dd878bb5e68de979dd4a96d5f25d1aefc035ed17e2fcf7408b976de6d936ef",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.recognize_gate_none_iff": {
          "hash": "e877cd0cdd33656f9b03cfedab16e3416385a5fba0ff74e177ba6687471da183",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.checkLayout_iff": {
          "hash": "bb17be20fa7299b6c7eaf7ac27f95bae162d39fe6099a07d46e1eba7d69be8d4",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.ZeroCostExposure.compileLayout_available_iff": {
          "hash": "32b03086b0cb2a74ad96b70307963768468c8e43f39e4ac11fb0ea655e6febae",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDZeroCostExposure"
        },
        "PNP.DirectWire.WireCarrier.exposed_referenceMinimum_of_checkLayout": {
          "hash": "df88d190913b101113192fbe892aef9f7109efaf2717c40433ca0833867d1dfa",
          "axioms": [],
          "module": "PNP.NANDWireCarrierZeroCostExposure"
        },
        "PNP.DirectWire.WireCarrier.exposed_residualSlack_of_checkLayout": {
          "hash": "2b0c5ec9087e8f70a023a82fbb930615453c26be4b9addefb45b3b1fb20cba95",
          "axioms": [],
          "module": "PNP.NANDWireCarrierZeroCostExposure"
        },
        "PNP.DirectWire.WireCarrier.checked_exposure_preserves_problem": {
          "hash": "2ed10a640a706bb5f1965313859d77148125723d97ea25fb117286ffce7f691c",
          "axioms": [],
          "module": "PNP.NANDWireCarrierZeroCostExposure"
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
      "number": 274,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-19-274",
      "id": "wire-profile-exposure-balance",
      "title": "Wire-backed computational profiles and exposure balance",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, ordinary-output and computational-field widths, full comparison preserves the ordinary Boolean outputs and every actual wire-backed field at every input valuation. Quotient comparison masks only selected profile constraints and still preserves every ordinary output. Exact characterization, full-lift, attained-witness and universal lower-bound theorems establish quotient minimum <= full minimum <= physical gate count. Full slack plus projection defect equals physical size minus quotient minimum. Exposure masks that both retain a fixed comparison mask preserve that quotient minimum and the combined measure; nested masks transfer exactly the lost full slack into projection defect. Loss of positive full slack to zero yields an attained quotient witness with a strict deficit that cannot be used as a full witness. Forgetting all profile constraints recovers the ordinary semantic minimum. The actual all-gate source tuple, checked normalization and checked splicing connect this model to computational wire carriers without a supplied observer, semantic minimum or correctness certificate for the comparison model.",
      "nonClaim": "This is a proposed reconstruction of computational profile comparison, not the complete manuscript ten-role grammar or a derived governed terminal family. Ordinary outgoing Boolean interface wires cannot be forgotten. The all-gate field tuple is source-derived but is not asserted to be a canonical terminal profile. Conservation of full slack plus projection defect proves neither forced-cost transparency nor a Package E route, positive-slack activation, global rank decrease or route coverage. A quotient witness cannot be used as a full replacement without restoring every omitted field. Checked splicing still requires an equivalent open replacement and successful compilation; global discovery is not proved. Reference minima and attained witnesses use exhaustive finite minimization, not a polynomial algorithm. Unconditional SaturatePositive, BCELReady and ZeroSlack, exact polynomial PCCMin, encoded-input runtime, output and certificate bounds, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global proof gate closes, and P = NP is not proved.",
      "fields": {
        "leanWireProfileExposureFormalized": true,
        "leanWireProfileExposureAxiomAuditPassed": true,
        "leanWireProfileExposureAuditedDeclarationCount": 35,
        "leanWireProfileExposureFullComparisonTheorem": "PNP.DirectWire.WireProfile.full_iff",
        "leanWireProfileExposureQuotientComparisonTheorem": "PNP.DirectWire.WireProfile.quotient_iff",
        "leanWireProfileExposureFullLiftTheorem": "PNP.DirectWire.WireProfile.full_lift_iff",
        "leanWireProfileExposureAttainedQuotientWitnessTheorem": "PNP.DirectWire.WireProfile.quotientWitness_matches",
        "leanWireProfileExposureExposureBalanceTheorem": "PNP.DirectWire.WireProfile.exposure_states_balance",
        "leanWireProfileExposureExactTransferTheorem": "PNP.DirectWire.WireProfile.exposure_moves_exact_slack_to_defect",
        "leanWireProfileExposureNonLiftabilityTheorem": "PNP.DirectWire.WireProfile.exposure_loss_has_unliftable_quotient_witness",
        "leanWireProfileExposureOrdinarySlackTheorem": "PNP.DirectWire.WireProfile.source_slack_balance",
        "leanWireProfileExposureNormalizationTheorem": "PNP.DirectWire.WireProfile.normalize_fullEquivalent",
        "leanWireProfileExposureCheckedSpliceTheorem": "PNP.DirectWire.WireProfile.splice_fullEquivalent",
        "leanWireProfileExposureArbitraryFiniteDimensionsCovered": true,
        "leanWireProfileExposureOrdinaryOutputsPreservedInBothModes": true,
        "leanWireProfileExposureActualWireValuesAtAllValuations": true,
        "leanWireProfileExposureMinimaAndAttainedWitnessesDerived": true,
        "leanWireProfileExposureExposureTransfersSlackToDefect": true,
        "leanWireProfileExposureCallerSuppliedObserverOrMinimumRequired": false,
        "leanWireProfileExposureQuotientWitnessAloneIsFullReplacement": false,
        "leanWireProfileExposureAllGateFieldsAreCanonicalTerminalFamily": false,
        "leanWireProfileExposureCompleteManuscriptProfileGrammarProved": false,
        "leanWireProfileExposureForcedCostTransparencyProved": false,
        "leanWireProfileExposureCompletePackageEOrGlobalRoutesProved": false,
        "leanWireProfileExposureTerminalFamiliesDerived": false,
        "leanWireProfileExposureUnconditionalSaturatePositiveProved": false,
        "leanWireProfileExposureUnconditionalBCELReadyProved": false,
        "leanWireProfileExposureUnconditionalZeroSlackProved": false,
        "leanWireProfileExposureExactPolynomialPCCMinProved": false,
        "leanWireProfileExposurePolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanWireProfileExposureReferenceMinimizationIsExhaustive": true,
        "leanWireProfileExposureScope": "arbitrary-finite-actual-wire-profile-values-all-input-valuations-mandatory-ordinary-outputs-full-quotient-lift-attained-minima-exact-exposure-slack-defect-transfer-checked-normalization-splice-no-full-manuscript-global-route-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.WireProfile.mask_implementation": {
          "hash": "a5e99322915e0ca88895287bf073d302b2b29df82ebdcdf7a84982461d861a05",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.mask_fieldValue": {
          "hash": "02bd6191dfb811c25056a049e8e86fa16ada2242ad981e9d302c3be1da8df54e",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.full_iff": {
          "hash": "5d698934e56bdcf88b7dcf60eafac3eab9e7db32ea6bf3f9d38f5fa1ff31ff8f",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotient_iff": {
          "hash": "fccf2f775e403e158d93d6139963ae4158be4993b4d8f377e840eb0733e2d928",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.full_to_quotient": {
          "hash": "48950dc3e4b866af61a3e6444bd32cbceae0a46c0957f77cb4fa5e9d54f0f989",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.full_lift_iff": {
          "hash": "aaa96b36a3742f3fbf460ac282c6dcea4aa6b136e03c129162f243d303ba25d5",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullWitness_gateCount": {
          "hash": "099dc96ab5aaa8b8f55d148aae45bf022e4a6d4bfa2d72183f93cd91edf7e188",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullWitness_matches": {
          "hash": "b7afccdcdb9354ae51800ae53cd96073283c7994b327a4b6a28618dc7c8b2969",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullMinimum_le_physical": {
          "hash": "0d3ec56776d0c9c8f43c66d71bf0209cf5080d34347aca3d0eedeaae9bd975f2",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientMinimum_le_full": {
          "hash": "bc1adee3880f8b44318713263f3b979a747c83c909a77a5b9c58357d010b54d0",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientWitness_gateCount": {
          "hash": "652ff627431bbb569f5e42ca2d542dd1424e11a522427ae3040d546825e8e7ed",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientWitness_matches": {
          "hash": "eebcc528071e48f3c185e9e70535081af327c58a3294bc6ad14583cfbf39ddad",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotient_candidate_lower_bound": {
          "hash": "834f4fc9ffa0ba6d873d5ddd4bbad11e4f3a7f93a5ae9bd0cea1670a65f827c7",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.full_candidate_lower_bound": {
          "hash": "2b3886e4849ac17ef8565b28f1bd0907293a8a46dd7a922f14689cd3a4d63348",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullSlack_add_projectionDefect": {
          "hash": "19fe9cf0cbb7a6364face3057ca7d7007fb703836df32eb59ad9efe7b6a7e132",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.exposure_balance": {
          "hash": "f687b4f65e9d51beb3024edb123c1ff2204fed3b8adbd26df53cc12ffca3a439",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.exposure_preserves_positive_alternative": {
          "hash": "c54845f73cc4c477d4335448949eafb39c53c853ce1da97b9d522d634a50ce32",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotient_minimum_cannot_lift_of_positive_defect": {
          "hash": "edb1bb6409b16c4bc54f0b3ef32d76a35ccf551487d39a41642d7973fee1f43c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.exposure_loss_has_unliftable_quotient_witness": {
          "hash": "7f3d9d4c895acc696bc99ac5648a6c49e5ab20c9f19553031d12c27fe53b57ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.allGateFields_value": {
          "hash": "54b34f81e456e694484f290a71c634f4a45b016993e8208744b7a096b59b27b9",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.allGateFields_positive_alternative": {
          "hash": "e9281676603a9b4eb5d0739ca3bf71e44a0fe8623f6f7d8ba4015ae0c41be575",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientMinimum_forget_all": {
          "hash": "edd5a27a002e25340fe7ca068bd95007b60d9e4c5a703d0034b0e1e9a26ded26",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.source_slack_balance": {
          "hash": "ff2ba7a5fb4b772b4ee011f7ef07f7170de32acbdf025fb7e342d7934c8fad12",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.source_positive_alternative": {
          "hash": "285b87162a99076953ebe58aeeb633e9feba45114f232ad4b00d6202411714c6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.mask_absorb_equivalent": {
          "hash": "2cf73c7192313cbdbd76735b7b77042b777f74f8b5e649976c8069093a876e46",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientMinimum_mask_active": {
          "hash": "b79c9065239510e20587a22cb40b765d2201744deb19f5607789d1fa44858a23",
          "axioms": [],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullMinimum_mask_mono": {
          "hash": "43029536c1d99c3cfec5ca745449d974a430bf361fefd2b93e2ffceb236e1576",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.exposure_states_balance": {
          "hash": "e654e8bd8a28e49091b5bb146f72a4f9268c497b82839c77a542aa3a3b4bbae6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.exposure_moves_exact_slack_to_defect": {
          "hash": "7b4fbd1ffde330cac1106dfce09549e1c44646f640e9d9c3f1cbf132a20c61e3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.normalize_fullEquivalent": {
          "hash": "aae04d9117416a78c56fb98de5f4181f7fe92fd593051bc841c2e02f7161b78b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullMinimum_normalize": {
          "hash": "7ab5397d66beaca752e9f08856b3b8746e2bcffcc9637d923abde103af56fe5e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientMinimum_normalize": {
          "hash": "019da02696fa365128110df9065f50101439921957a98b46c6397b9f34d67045",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.splice_fullEquivalent": {
          "hash": "2c6287494db7ca5d8bdfb46f0aa27f842ac5c7fd2927f8c687ca9ced370d77d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.fullMinimum_splice": {
          "hash": "f1ca47b85073fa3b09587f992d21cb51635fdf7831d9536bbea7f4b9be28b564",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
        },
        "PNP.DirectWire.WireProfile.quotientMinimum_splice": {
          "hash": "7fc79932a7744ce1ff140a2c4df84342b54cd79fae1b4a3380a78b73da3b2634",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileExposure"
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
      "number": 275,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-19-275",
      "id": "wire-profile-restoration-cost",
      "title": "Constructive wire-profile restoration cost and exact gain boundary",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, ordinary-output and computational-field widths, the existing concrete quotient agreement is equivalent to wire-profile quotient comparison. The actual shared hidden-wire materializer restores the computed quotient-minimum witness into a full-equivalent carrier, preserving every ordinary output and actual field at every input valuation. If F is the full minimum, Q the quotient minimum, C the actual materializer charge, D = F - Q and S the actual full-field normalization saving, the theorems prove F <= Q + C, D <= C, paid cost = F + (C - D), S <= C - D and normalized cost = F + (C - D - S). Strict improvement against the original carrier is equivalent to the remaining overhead being smaller than its full slack; the executable acceptance test checks the actual final size and yields a sound strict equivalent gain. The existing complete one-input constructor has gate count exactly F for arbitrary output and field widths, and improves the original exactly when full slack is positive. No full replacement, minimum, charge or correctness certificate is supplied to the constructed route.",
      "nonClaim": "This is a cost and compatibility interface for computational wire profiles, not complete manuscript profiles or a terminal-derived family. The materializer charge only upper-bounds projection defect; equality and forced-cost transparency are not established. Physical normalization is not a semantic minimizer. A kernel-checked positive-slack example is refused by restoration plus normalization, while the existing unary route recovers it; this limits that component, not every route or the manuscript's complete route family. Returning no gain does not establish ZeroSlack. Unary completeness is restricted to one input and is reused, not newly proved for arbitrary inputs. Reference minimization is exhaustive, not a polynomial PCCMin algorithm. Complete Package E, global route coverage and rank decrease, unconditional SaturatePositive, BCELReady and ZeroSlack, exact polynomial PCCMin, encoded runtime, output and certificate bounds, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global proof gate closes, and P = NP is not proved.",
      "fields": {
        "leanWireProfileRestorationFormalized": true,
        "leanWireProfileRestorationAxiomAuditPassed": true,
        "leanWireProfileRestorationAuditedDeclarationCount": 19,
        "leanWireProfileRestorationQuotientAgreementTheorem": "PNP.DirectWire.WireProfileRestoration.quotientAgreement_iff",
        "leanWireProfileRestorationFullRestorationTheorem": "PNP.DirectWire.WireProfileRestoration.paidWitness_fullEquivalent",
        "leanWireProfileRestorationChargeBoundTheorem": "PNP.DirectWire.WireProfileRestoration.projectionDefect_le_charge",
        "leanWireProfileRestorationPaidOverheadTheorem": "PNP.DirectWire.WireProfileRestoration.paidWitness_exact_overhead",
        "leanWireProfileRestorationReclaimedBoundTheorem": "PNP.DirectWire.WireProfileRestoration.reclaimed_le_overhead",
        "leanWireProfileRestorationNormalizedOverheadTheorem": "PNP.DirectWire.WireProfileRestoration.normalizedWitness_exact_overhead",
        "leanWireProfileRestorationStrictGainTheorem": "PNP.DirectWire.WireProfileRestoration.normalizedWitness_smaller_iff",
        "leanWireProfileRestorationCheckedGainTheorem": "PNP.DirectWire.WireProfileRestoration.CheckedGain.checked",
        "leanWireProfileRestorationUnaryMinimumTheorem": "PNP.DirectWire.WireProfileRestoration.unary_fullMinimum",
        "leanWireProfileRestorationUnaryGainTheorem": "PNP.DirectWire.WireProfileRestoration.unary_smaller_iff_fullSlack_positive",
        "leanWireProfileRestorationArbitraryFiniteDimensionsCovered": true,
        "leanWireProfileRestorationOrdinaryOutputsAndActualFieldsPreserved": true,
        "leanWireProfileRestorationExistingSharedMaterializerReused": true,
        "leanWireProfileRestorationActualPhysicalChargeAndSavingsComputed": true,
        "leanWireProfileRestorationExactRemainingOverheadDerived": true,
        "leanWireProfileRestorationStrictOriginalSizeComparisonChecked": true,
        "leanWireProfileRestorationExistingUnaryMinimumCompatibilityProved": true,
        "leanWireProfileRestorationUnaryCompatibilityHasArbitraryOutputAndFieldWidths": true,
        "leanWireProfileRestorationPositiveSlackRefusalAndUnaryRecoveryKernelChecked": true,
        "leanWireProfileRestorationCallerSuppliedWitnessMinimumOrCorrectnessRequired": false,
        "leanWireProfileRestorationChargeEqualsProjectionDefectProved": false,
        "leanWireProfileRestorationNormalizerIsSemanticallyComplete": false,
        "leanWireProfileRestorationNoGainImpliesZeroSlack": false,
        "leanWireProfileRestorationUnaryCompletenessExtendedToArbitraryInputs": false,
        "leanWireProfileRestorationCompleteManuscriptProfileGrammarProved": false,
        "leanWireProfileRestorationTerminalFamiliesDerived": false,
        "leanWireProfileRestorationCompletePackageEOrGlobalRoutesProved": false,
        "leanWireProfileRestorationUnconditionalSaturatePositiveProved": false,
        "leanWireProfileRestorationUnconditionalBCELReadyProved": false,
        "leanWireProfileRestorationUnconditionalZeroSlackProved": false,
        "leanWireProfileRestorationExactPolynomialPCCMinProved": false,
        "leanWireProfileRestorationPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanWireProfileRestorationReferenceMinimizationIsExhaustive": true,
        "leanWireProfileRestorationRuntimeExecutionIsProofAuthority": false,
        "leanWireProfileRestorationScope": "arbitrary-finite-actual-wire-full-restoration-shared-materializer-charge-defect-upper-bound-paid-and-normalized-exact-overhead-checked-strict-gain-existing-one-input-minimum-compatibility-no-general-completeness-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.WireProfileRestoration.quotientAgreement_iff": {
          "hash": "ac36df8e2914ca2ce3b3ac0d5194e7a44198896040c925ef6043ac2f22fb3aa8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.expanded_fullEquivalent": {
          "hash": "152cc0a4a34040eefc769049f57dcc7aaf507acf0c24c01eec7bfa5ab6196db3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.paidWitness_fullEquivalent": {
          "hash": "91fcd87a05266afd4d59445e508f39356e1e965d285ef0b60cc4f56c4a4dd9ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.paidWitness_gateCount": {
          "hash": "e65c828f6ba184573026592c22c615ae9f0fe922aff384f9f2f9fbc71ff11e2c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.fullMinimum_le_quotientMinimum_add_charge": {
          "hash": "e2f252b82be65ebb18a0e0c5ace67f3caabe1dc7a5f05ea2c0764a2a140d3dc2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.projectionDefect_le_charge": {
          "hash": "d13d80014d1eb15d43b0a481ec8410b545b7d5a4da81db03642497e4a9adc34a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.paidWitness_exact_overhead": {
          "hash": "d6e074081f87063d2ad6b713ea09e5b94f40b36fc757d0e6f0380a845a181bc8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.paidWitness_smaller_iff": {
          "hash": "2d72664e0872f27c3be711951c70a4bde84886e8d534ba832e6cb064fada4110",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.paidWitness_optimal_iff": {
          "hash": "604ebe08bd50792b3dbe74affbc0492bf2a02f32ed646c9516b750d6d4ab6f70",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.normalizedWitness_fullEquivalent": {
          "hash": "b37fe38d1f18d15b720080ce5e292b25c8e54a38828f1c680c79c8e2d61ca99c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.normalizedWitness_exact_accounting": {
          "hash": "ccec14b81c029475f4a7caad3f9b3ba495fb09ca36775702d4136fe61f96802e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.reclaimed_le_overhead": {
          "hash": "c3969ffe2a61b71d46de269c9fe5f133acd8e70ad4ce790bacc2c3ea0679bf30",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.normalizedWitness_exact_overhead": {
          "hash": "9bd7117014ca4004f05332c0799bb8e826688013cfc98ad10753be970beb3792",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.normalizedWitness_smaller_iff": {
          "hash": "e881bf24f9e1fbe5127979e5c6f5e5c2ec61332e3dbdcbf51a33073fd74e4139",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.normalizedWitness_optimal_iff": {
          "hash": "cbdfbb757e43dc5d2f937f0df5b89af7a810ec01e5959945386694abba9892ae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.checkedGain_isSome_iff": {
          "hash": "04233de3e6c6d5992d8c268e06c05f122e8ec5be9f2b628eead4590c7e3f3c5d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.CheckedGain.checked": {
          "hash": "f4d34bc65c13885b7f892e5ecaad086bb0d53ea2a7208656998c0f1754fc8b90",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.unary_fullMinimum": {
          "hash": "ac5222a3652828c7cffb92f14906304bb4e1d65b250e533093b217fea53bb4e4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
        },
        "PNP.DirectWire.WireProfileRestoration.unary_smaller_iff_fullSlack_positive": {
          "hash": "7533c99f91b3438644083adba00c92b4e89522c9e45b65e14b8f65f11bac5df3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileRestoration"
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
      "number": 276,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-19-276",
      "id": "computed-wire-profile-exact-field-cost",
      "title": "Computed wire-profile models and exact independent-field cost",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, ordinary-output and computational-field widths, target-relative availability computes one actual constant, input or gate source that realizes a field uniformly over every input valuation. Rebinding constructs a carrier without adding gates and identifies terminal full and quotient profile minima with the corresponding wire-profile minima. The model constructor proves coherence between its base and ambient observers under unused-input padding and output rewording. A source-derived field seed and physical dependency closure yield an actual extracted support preserving every field at all ambient input valuations. For any old implementation with semantic minimum F and any natural width k, an explicit extension appends k independent NAND fields on disjoint fresh input pairs. Semantic gate retraction proves that every equivalent implementation needs at least F + k gates; the matching construction attains that bound. Its actual wire profile therefore has full minimum F + k, all-forgotten quotient minimum F, projection defect k and unchanged full slack. Three general coupling theorems establish these same exact minima and their difference inside the constructed terminal profile model, without a supplied model, minimum, field support or correctness certificate.",
      "nonClaim": "This is a computed model for actual computational wire fields, not the complete manuscript profile grammar or a terminal-derived governed family. The extracted support is field-preserving but is not asserted to be proper, smaller or optimal. The exact additive cost theorem concerns the explicit independent fresh-input NAND family, not arbitrary correlated, duplicated or supplied manuscript fields. The semantic retraction helper has an explicit uniform constant-value hypothesis, discharged for that family; it is not a general polynomial semantic-constant detector. The existing shared materializer charge is only bounded below by the family's projection defect, not proved equal to it. Availability checks enumerate valuations and reference minima remain exhaustive; no complete polynomial minimizer follows. Complete Package E, global route coverage and rank decrease, unconditional SaturatePositive, BCELReady and ZeroSlack, exact polynomial PCCMin, encoded runtime, output and certificate bounds, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global proof gate closes, and P = NP is not proved.",
      "fields": {
        "leanComputedWireProfileFormalized": true,
        "leanComputedWireProfileAxiomAuditPassed": true,
        "leanComputedWireProfileAuditedDeclarationCount": 72,
        "leanComputedWireProfileUniformSourceTheorem": "PNP.DirectWire.WireProfileAvailability.sourceMatches_iff",
        "leanComputedWireProfileFullMinimumBridgeTheorem": "PNP.DirectWire.WireProfileAvailability.full_minimum",
        "leanComputedWireProfileQuotientMinimumBridgeTheorem": "PNP.DirectWire.WireProfileAvailability.quotient_minimum",
        "leanComputedWireProfileAmbientCoherenceTheorem": "PNP.DirectWire.WireProfileAmbient.model_observe_coherent",
        "leanComputedWireProfileDerivedFieldSupportTheorem": "PNP.DirectWire.WireProfileFieldClosed.available",
        "leanComputedWireProfileSemanticRetractionTheorem": "PNP.DirectWire.SemanticGateRetraction.semantics",
        "leanComputedWireProfileIndependentFieldLowerBoundTheorem": "PNP.DirectWire.FreshNandCost.gateCount_lower_bound",
        "leanComputedWireProfileIndependentFieldMinimumTheorem": "PNP.DirectWire.FreshNandCost.referenceMinimum_extend",
        "leanComputedWireProfileCoupledFullMinimumTheorem": "PNP.DirectWire.ComputedWireProfileCost.full_minimum",
        "leanComputedWireProfileCoupledQuotientMinimumTheorem": "PNP.DirectWire.ComputedWireProfileCost.quotient_minimum",
        "leanComputedWireProfileCoupledMinimumGapTheorem": "PNP.DirectWire.ComputedWireProfileCost.minimum_gap",
        "leanComputedWireProfileArbitraryFiniteDimensionsCovered": true,
        "leanComputedWireProfileOneSourceUniformAcrossAllValuationsRequired": true,
        "leanComputedWireProfileModelAndFieldPreservingSupportComputed": true,
        "leanComputedWireProfileObserverPaddingAndRewordingCoherenceProved": true,
        "leanComputedWireProfileExactCostForArbitraryIndependentFreshFieldWidthsProved": true,
        "leanComputedWireProfileCallerSuppliedModelMinimumSupportOrCorrectnessRequired": false,
        "leanComputedWireProfileSemanticRetractionHasExplicitUniformConstantHypothesis": true,
        "leanComputedWireProfileRetractionHypothesisDischargedForIndependentFieldFamily": true,
        "leanComputedWireProfileExtractedSupportIsProperSmallerOrOptimalProved": false,
        "leanComputedWireProfileArbitraryManuscriptFieldAdditivityProved": false,
        "leanComputedWireProfileSharedMaterializerChargeEqualsProjectionDefectProved": false,
        "leanComputedWireProfileCompleteManuscriptProfileGrammarProved": false,
        "leanComputedWireProfileTerminalFamiliesDerived": false,
        "leanComputedWireProfileCompletePackageEOrGlobalRoutesProved": false,
        "leanComputedWireProfileUnconditionalSaturatePositiveProved": false,
        "leanComputedWireProfileUnconditionalBCELReadyProved": false,
        "leanComputedWireProfileUnconditionalZeroSlackProved": false,
        "leanComputedWireProfileExactPolynomialPCCMinProved": false,
        "leanComputedWireProfilePolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanComputedWireProfileAvailabilityAndReferenceMinimizationAreExhaustive": true,
        "leanComputedWireProfileRuntimeExecutionIsProofAuthority": false,
        "leanComputedWireProfileScope": "arbitrary-finite-computed-uniform-wire-availability-ambient-observer-coherence-source-derived-field-preserving-support-exact-independent-fresh-nand-cost-and-terminal-model-coupling-no-arbitrary-field-additivity-global-route-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.ComputedWireProfileCost.full_minimum": {
          "hash": "b52b8497022d4804c1d52f1e43be42a3daf247fac6747a1e6372932478db8c8b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDComputedWireProfileCost"
        },
        "PNP.DirectWire.ComputedWireProfileCost.minimum_gap": {
          "hash": "8c138e3dc31739a19207aceca1da03cb668300e13a9f9af1e7d0d07e1d3173a2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDComputedWireProfileCost"
        },
        "PNP.DirectWire.ComputedWireProfileCost.quotient_minimum": {
          "hash": "200e81442a22988a98144c8f2f7cc4e6c97e031e7bd5967807ba9d7d6198ee65",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDComputedWireProfileCost"
        },
        "PNP.DirectWire.FreshNandCost.erased_constant": {
          "hash": "c6a041cb0387b83ff67dfae4a5341fdf2a429defe1ec273c1b3e66d9c0452fb5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.erased_count_lower_bound": {
          "hash": "acc7567090cd30e6f6c7e4eaf70c2dee8850238f39be11aa599f9d85ca79d076",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.extend_gateCount": {
          "hash": "7ba17ec951c7ac5ca2acace870cf5096cb00e45c2a05d674e3441f57eb986719",
          "axioms": [],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.extended_equivalent": {
          "hash": "ed3cdf90bdfddc252781d110c336a93bd3740ae147d8b49168615544ca9c4bae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.extended_fresh": {
          "hash": "a437a65c0fd94dd753eadb24ccddec958a40cc5314cb69eef5a78cac086728cc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.extended_old": {
          "hash": "6564d883d285624b6a7ad574e689bffa1b2586b2a3ce547edfa3eba0781e7f0b",
          "axioms": [],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.freshCandidate_semantics": {
          "hash": "2d4b2ce857b4598392b4f89e572d6f8db577cd84bdb15b58969eade200f8a017",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshConditions": {
          "hash": "b4a431b08524929fda03b7cd1c742e55fb012d34c21031ce1abc62260ca35ef2",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshGate_injective": {
          "hash": "3885732d9169cebcf904a42e0358653fc2d32963d06d5d08617bd2bd173896d8",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshGate_selected": {
          "hash": "5422faadf8e9bfe8c9df7ebbb6216422241bb6682c374f3597d58c6126975811",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshGate_source": {
          "hash": "8f0b27868cf4811abeab31661aa5b279bb58431f76eec65b9bafceee80157a38",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshGate_value": {
          "hash": "825e1cd37fb0d50c3ae1e87f1037a546b0654085453b0669498b3a75ca64885b",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshValue_joinInput": {
          "hash": "77177bc59f0356e9d54bad1ae1891e4a6e469875be37ceb0a34fb60f812e5680",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.freshValue_restricted": {
          "hash": "95f5b81b6c8c3dbe8f70efb50f541172f5a0da6304bcdd24a8906d03f48e3c15",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.gateCount_lower_bound": {
          "hash": "f1ad49c531301e6a13cc796e8a481add4e7eec14de36c9d4cc048a621267245b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.inputNands_eval": {
          "hash": "d26026dd26393870d4c796678a56872ca4b0b219d0010fe7548e317ad0a839c3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.oldCandidate_semantics": {
          "hash": "2f3d44870d6c08335a5c9d775684c40561a1248d36f2d8656fffaa3dd63c686e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.FreshNandCost.padInputs_semantics": {
          "hash": "1e461912370c3f90ab89397e2b88b66344cf540042a5e182311781a8af65d961",
          "axioms": [],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_field": {
          "hash": "ee6d3fd3233ad2bb36a097a9945e25b5c7dffd8bfc286d594b17b304be05d22e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_fullMinimum": {
          "hash": "cf93680e838511c7c078fbcaed9b6aeb53867039ab3acf5cda82b0a842f7a60b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_fullSlack": {
          "hash": "2f64766bc1ccd6954c573e65f1fa1b28e29668f20c5cbd22a3d09c91c714557b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_gateCount": {
          "hash": "d5f17e98292da1c70e7ddfa2b578981790f1f7072475fbfd59e5bc386e5e3b5b",
          "axioms": [],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_materializer_charge_lower_bound": {
          "hash": "bb29f4c44b6ce0ec8e53aa1e460788124c7f593bdbdca8a3c4f658430f6c5488",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_output": {
          "hash": "36c60f9c2f31a5e5375fd200422b46f3c061362bcc257066fba059eac4d1cd9f",
          "axioms": [],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_projectionDefect": {
          "hash": "847b187796ec9c30984ff6782e76539de6f0319fda9b41c8fd9261fa82c6e8ef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.profile_quotientMinimum": {
          "hash": "0c1f3918b7d381d81cc731ea46df8613b55f41dc240348d08d08babb3789881a",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.referenceMinimum_extend": {
          "hash": "b78d74a197672a827d9aa75ba4849a03d75446ca4dec8d2b636180521019062a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDFreshFieldExtension"
        },
        "PNP.DirectWire.FreshNandCost.referenceMinimum_padInputs": {
          "hash": "9170275bafb42cbf8fa6cf58d5af8281dfb8dff62abe7f0eb4c1542083759b7b",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDFreshFieldProfile"
        },
        "PNP.DirectWire.FreshNandCost.restricted_oldInput": {
          "hash": "6780d73f9bef82748611d3da261775a79b2fa52da0c2dc0a6d60fa5032d3662b",
          "axioms": [],
          "module": "PNP.NANDFreshFieldCost"
        },
        "PNP.DirectWire.SemanticGateRetraction.gateCount_eq_sub": {
          "hash": "d27131884b06c36cc340d8a11790af2452b24403b4d022561459ffd7d0565ff0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSemanticGateRetraction"
        },
        "PNP.DirectWire.SemanticGateRetraction.gateCount_partition": {
          "hash": "f450b43aa37fdd27917199c8cefdd3b199d05771d054d0b243a51061788f923b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSemanticGateRetraction"
        },
        "PNP.DirectWire.SemanticGateRetraction.kept_gate_value": {
          "hash": "4db4c08736e999203d9bf231ba6c14687f0ac66872c9e604e16d1c295105feb8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSemanticGateRetraction"
        },
        "PNP.DirectWire.SemanticGateRetraction.reboundSource_value": {
          "hash": "105fbd89ff70d73deabe3a55a25c4aef5637aced180bd1621882f33f9dcbfe86",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSemanticGateRetraction"
        },
        "PNP.DirectWire.SemanticGateRetraction.semantics": {
          "hash": "ac67118b00ec5fd47e5c8227fc79e48ec31e4e986eb50156a580101e39d7ae18",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSemanticGateRetraction"
        },
        "PNP.DirectWire.WireProfileAmbient.available_iff_exists": {
          "hash": "d7929c5ff6dceb114bbfe3bbdc5f999266bd6853b33b6e94d85f682a25d31956",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.available_pad": {
          "hash": "58c4f4bdde950973886711ec919effbb063002d9d6222f7e1bfb20aceb9edbfc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.available_pad_iff": {
          "hash": "a3408729098856e173a1671061cb59eb83e1830e6ed827161d51e70e80fc81c7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.available_reword": {
          "hash": "563a3a7d05874992b7a41cbd28944917374ae7839971bb407d6ca705779c73c4",
          "axioms": [],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.eval_paddedSource": {
          "hash": "44f649f15ec7a89400d24a6aeed4a7bc90808823a335fc18e8486e2b0d08d3b4",
          "axioms": [],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.eval_retractSource": {
          "hash": "958eded91369714457e24411bc582cb52985fa788254b86e5a42b8f6d153e02b",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.model_observe_coherent": {
          "hash": "e883989b1a9ca0205c799b45d8e3f2e9b0d0d2a6ecb15a10800f03aab54fab6d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.pad_fieldValue": {
          "hash": "b352f9b13086e15bed18b4f3ec9104e6464263f6ddb96b4d07ec7f556aebdbd9",
          "axioms": [],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAmbient.pad_gateCount": {
          "hash": "619b844fbb3db3b8537685ffb48aae8db008be9c7935de3609135f83b08bb5be",
          "axioms": [],
          "module": "PNP.NANDWireProfileAmbient"
        },
        "PNP.DirectWire.WireProfileAvailability.available_of_source": {
          "hash": "0156c31ae5c2b88e8c4c8995d72ca868aaf49a331cf275b3ac29c6c0c9994567",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.bind_fieldValue": {
          "hash": "fc1d8de8f433323969a63570fabaddad9f6a07e8f3c38ef5c6be32e11c0764ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.bind_full": {
          "hash": "6222d9745db83ae95ce24b279cd9c75d0e4334e761e7c26b56ebcef736dd94c0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.bind_gateCount": {
          "hash": "adeca6dea6897cc8c24815ce7b0a6c2f5d49253f2ecfb523782225a21f033db1",
          "axioms": [],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.bind_implementation": {
          "hash": "5aec5074d1ae9811ef406ebfe65b5a16892a5e737b9eae31117fc02e7a171f25",
          "axioms": [],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.bind_quotient": {
          "hash": "d9ecb9e8cd6967f4fcdd709207dff17cb28e7a855fe1498a82b50cab110066bd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.current_available": {
          "hash": "d17af8c16c7f6acc4f185c06197389a9a215166db468fc8e092a360ffe53aebb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.findSource_congr": {
          "hash": "3ad9d76c26034ee6b7416ec578b7d45afb327ce51f309259489b0a7d049ed1a8",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.findSource_sound": {
          "hash": "8ef5fa5509b46d2b451056e9e5e23f2cfcd11443525951036590bd42fa3007cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.full_match_iff": {
          "hash": "2e2ed497ad51ae1af9bf68269e7e5d82ce263e2b9458d7fe88ff162f04e48e98",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.full_minimum": {
          "hash": "d894275b1596e32a841b9edca7a8366d66398516aebf4fa80fa2ff386139c2ee",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.quotient_match_iff": {
          "hash": "ff9e227eb1f99143430fd9829e206ba69202827ea06c08d9a88580def849acf4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.quotient_minimum": {
          "hash": "2e659a60e2ebf934d5384f8a3ad9ef26c350f92840ee3d8bcb1f67d9578af987",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.sourceMatches_congr": {
          "hash": "407014c882536a90f49d4c5db0b639e9ec7f974bc02229590f3ce54d2aabd351",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.sourceMatches_iff": {
          "hash": "03c35ad97050635551a840a885ac918212a922973ce35989b79c95f8e86bb1ca",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.system_congr": {
          "hash": "d13fbc9331e548e2a1bda401ebd6984de3b395f3a20765457de589213ffdfd2c",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileAvailability.system_fullEquivalent": {
          "hash": "c16848517baf9ededf5937d54cbbcf052de7ac48452a6b4e4c44bb35b0937132",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireProfileAvailability"
        },
        "PNP.DirectWire.WireProfileFieldClosed.ambient_fieldValue": {
          "hash": "10b95b00b6ab4c76b23c8f165b8891130dfb7f4ed2613e9d0bb282f5f61f8c80",
          "axioms": [],
          "module": "PNP.NANDWireProfileFieldClosed"
        },
        "PNP.DirectWire.WireProfileFieldClosed.available": {
          "hash": "c57a279b278e284dc9a085e7f8ba378dfb8e625812e0c2c8e326f4c84448dfab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileFieldClosed"
        },
        "PNP.DirectWire.WireProfileFieldClosed.boundary_isInput": {
          "hash": "e5d7b3065a5612cf1f2ad4130f23cdc2d65ca2262dd4cf3e0bf2c8b1acc7fb84",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileFieldClosed"
        },
        "PNP.DirectWire.WireProfileFieldClosed.gate_value": {
          "hash": "45bf7c61525b1b7f5a5c8ce2fffbdfc6e97aec8dacfbf019c962a2a80052e8e9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileFieldClosed"
        },
        "PNP.DirectWire.WireProfileFieldClosed.source_selected": {
          "hash": "fa08a70951298605688abe6dcf162fb1c87e75586092326d5597acc82a922c99",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireProfileFieldClosed"
        },
        "PNP.DirectWire.extractTerminalSupport_gate_evaluation": {
          "hash": "67afb92512e21b56382fc07e40361c3343368d68cff986f44d108aa370cb416c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.extractTerminalSupport_gate_induced": {
          "hash": "e7585986519237a1ab0fa177facb398a2492d97957998f328089123c6da72e5a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalPhysicalComplementRecords_gateCount_partition": {
          "hash": "a07ed66527b70b6c939c62e98dbc4779df2062a11b006d376f354ae5ed60257a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
        },
        "PNP.DirectWire.terminalPhysicalComplementRecords_selected": {
          "hash": "a70e440b1ba6a74878e4d7de1ca00b2b3fedcf55c49853f1b9586bf01dfc84b2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
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
      "number": 277,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-19-277",
      "id": "computed-closed-support-profile-squares",
      "title": "Computed closed-support observations and profile-compatible squares",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, ordinary-output and computational-field widths, the actual computed dependency-closed support observes a field exactly when it retains an original constant, input or gate source whose value agrees with that field uniformly over every input valuation. The matching table and support are computed from the circuit and ordinary seed data. For arbitrary seed pairs, observations of the computed union are the Boolean union of the separate observations. This extends to arbitrary finite families, with the empty support's observation as the base, and to seed-inclusion monotonicity. Seeding the requested profile records derives availability and uniform field-value preservation without injecting their literal original gate bindings. The actual meet, left, right and join of the constructed support square all preserve those requested computational fields and agree pairwise on their values at every ambient input valuation. Existing source extraction, structural square laws and arbitrary-context profile locality are reused, not newly claimed.",
      "nonClaim": "This is computational-field compatibility, not ordinary-output equivalence, the complete manuscript profile grammar, a terminal-derived governed family, or a legitimate full projection square. Field preservation does not imply a proper, smaller, minimum or positive support. A kernel-checked duplicate-circuit example has positive full slack but no proper seed in the computed model; the existing sharing pass removes that duplicate, so the example is not a normalized terminal counterexample and does not refute a manuscript theorem with additional terminal or admissibility hypotheses. Source matching and influence remain finite exhaustive computations, not polynomial algorithms. Complete Package E, forced-cost transparency, global route coverage and rank decrease, unconditional SaturatePositive, BCELReady and ZeroSlack, exact polynomial PCCMin, encoded runtime, output and certificate bounds, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global proof gate closes, and P = NP is not proved.",
      "fields": {
        "leanClosedSupportProfileFormalized": true,
        "leanClosedSupportProfileAxiomAuditPassed": true,
        "leanClosedSupportProfileAuditedDeclarationCount": 24,
        "leanClosedSupportProfileRetainedSourceTheorem": "PNP.DirectWire.ClosedSupportObservation.available_iff_retained_source",
        "leanClosedSupportProfileComputedTableTheorem": "PNP.DirectWire.ClosedSupportObservation.available_eq_tableAvailable",
        "leanClosedSupportProfileSeedUnionTheorem": "PNP.DirectWire.ClosedSupportUnion.available_append",
        "leanClosedSupportProfileFiniteFamilyTheorem": "PNP.DirectWire.ClosedSupportUnion.available_flatten",
        "leanClosedSupportProfileRequestedFieldsTheorem": "PNP.DirectWire.ClosedSupportProfile.projected_fieldValue",
        "leanClosedSupportProfileActualCornerTheorem": "PNP.DirectWire.ClosedSupportSquare.corner_fieldValue",
        "leanClosedSupportProfileCornerAgreementTheorem": "PNP.DirectWire.ClosedSupportSquare.corners_fieldValue_equal",
        "leanClosedSupportProfileArbitraryFiniteDimensionsCovered": true,
        "leanClosedSupportProfileComputedSupportAndMatchingTable": true,
        "leanClosedSupportProfileUniformFieldValuesAtActualCornersProved": true,
        "leanClosedSupportProfileCallerSuppliedClosureOrCorrectnessRequired": false,
        "leanClosedSupportProfileOrdinaryOutputEquivalenceProved": false,
        "leanClosedSupportProfileCompleteManuscriptProjectionSquareProved": false,
        "leanClosedSupportProfileProperPositiveSupportProved": false,
        "leanClosedSupportProfileDuplicateIsNormalizedTerminalCounterexample": false,
        "leanClosedSupportProfileCompletePackageEOrGlobalRoutesProved": false,
        "leanClosedSupportProfileUnconditionalSaturatePositiveProved": false,
        "leanClosedSupportProfileUnconditionalBCELReadyProved": false,
        "leanClosedSupportProfileUnconditionalZeroSlackProved": false,
        "leanClosedSupportProfileExactPolynomialPCCMinProved": false,
        "leanClosedSupportProfilePolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanClosedSupportProfileSourceMatchingAndInfluenceAreExhaustive": true,
        "leanClosedSupportProfileRuntimeExecutionIsProofAuthority": false,
        "leanClosedSupportProfileScope": "arbitrary-finite-computed-closed-support-observations-source-alternatives-union-and-profile-seeded-actual-square-corner-compatibility-no-ordinary-output-proper-positive-full-profile-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.ClosedSupportObservation.available_eq_tableAvailable": {
          "hash": "36284860f3182440dcc3da9997bd6ed38ead391b387a68fadc80ed25afac84d0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.available_iff_retained_source": {
          "hash": "fb3cb40786c80fcf013c7f3b416afde3aa2387726e22d9e9493e31e029509a9e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.available_of_retained_source": {
          "hash": "f313f1f1d7ee09299706e95e0f60c23bbb7ef276e2eb5258128d2ed374e08d66",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.boundary_isInput": {
          "hash": "e5d2bdf2e64b60135b2d4e6252234b5243512f5cd8e53856081b30ee9569e790",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.gate_value": {
          "hash": "950413f4c8ad24ce9d900ad8e199be263bc32bc12bf90cbdd9d59baa82503ad0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.lift_retained_source": {
          "hash": "c4e8768c53b537b640523e5c1d0611fb537c87246605a8c092c02e964abe9f4b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.mem_matchingSources": {
          "hash": "2b64c44c843b773cc956648fcd42c136cf5ee3bf16145ca09ca5d996fbbdba15",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.retract_support_source": {
          "hash": "13d83a42f5ffa140fff436423e6c8f6970d29f3edfb0a19934e6817f96475210",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportObservation.tableAvailable_iff": {
          "hash": "70a629b8bf4422a67cc1d98a7439d27894a786f3aa7d27f6f5c12d7de06a3e1f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportObservation"
        },
        "PNP.DirectWire.ClosedSupportProfile.profile_available": {
          "hash": "0c747b559a85a56a1bec444232dce9fa606376204c01ea1e7fc95942017c6ce2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportProfile"
        },
        "PNP.DirectWire.ClosedSupportProfile.projected_available": {
          "hash": "9c9c8563bcb49b2ec9d6b9ab3adeacd1c7cd478a192a667b65f33ed5ee74cfb9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportProfile"
        },
        "PNP.DirectWire.ClosedSupportProfile.projected_fieldValue": {
          "hash": "d4667a897c89db1f6be34087132d22ee064e589dddfce16ee9c2e3a9958051d6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportProfile"
        },
        "PNP.DirectWire.ClosedSupportProfile.projected_tableAvailable": {
          "hash": "86a59577ff0afb9bd2fa697503a95050a44b2b898886d539749522c129c92e89",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportProfile"
        },
        "PNP.DirectWire.ClosedSupportSquare.corner_available": {
          "hash": "be838c5b6f99217989f84aa11a754ed1d1525ee873c4849d805bf4859f886d8e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportSquare"
        },
        "PNP.DirectWire.ClosedSupportSquare.corner_fieldValue": {
          "hash": "4f09121aaf481d01c80e32facf4824f2b9da76e056e472f264157ecd313934a0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportSquare"
        },
        "PNP.DirectWire.ClosedSupportSquare.corner_profileMember": {
          "hash": "ef29c2d6dbf0afbd1fcb21f82f2fa23afd42478e9240a817813932c0aaf1cad4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportSquare"
        },
        "PNP.DirectWire.ClosedSupportSquare.corners_fieldValue_equal": {
          "hash": "c4b49f95b5d857ed5a1b166c77ce9b7cb072cfaab7ce97b0651f002ec90855b8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportSquare"
        },
        "PNP.DirectWire.ClosedSupportUnion.available_append": {
          "hash": "cf59906f789c5a7c18e811d8dd05fd878ea337c3f934b17f4237df8ee8063488",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.available_flatten": {
          "hash": "826ace2bec3532d1c43ed0f33596c8c873a0c7b86c93607936066eb2ba39a15b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.available_mono": {
          "hash": "43c2830b54c41efa14a24e72c51d53c9d3e0683c48aa8b16e7daba77164fdba7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.mem_records_append": {
          "hash": "85c496b68303cc018de0098c6cf542f56d757ad95079bc9730e33f06853cb5bc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.records_mono": {
          "hash": "365f866fe74f2f178e8beadce47d4efbdd5d34d4f1207118081c8a47ddcc1b58",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.retained_append": {
          "hash": "88acde589597fc8632407c9035e7d569998125775d3e4860e9bff33687720c18",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
        },
        "PNP.DirectWire.ClosedSupportUnion.tableAvailable_append": {
          "hash": "d97244bbc85ab3df8ac32c368da9c1fc1eb61d943845c974a74a02ed320f96ef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportUnion"
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
      "number": 278,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-19-278",
      "id": "computed-closed-support-full-profile-gain",
      "title": "Computed closed-support full-profile physical gain",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite wire carriers, keep masks and seed record families under the computed computational-wire-profile model, the full-profile reference minimum of the actual closed support is specialized to primary inputs and reconnected to the derived physical complement. The resulting whole carrier preserves every ordered output and computational field for every input, with exact gate and whole-carrier full-slack balance. Positive computed local full slack yields a checked strict equivalent gain; zero local full slack returns no gain. The support, minimum, source bindings and reconnection are computed, not supplied correctness data.",
      "nonClaim": "The full-profile minimum, source matching and saturation influence tests remain exhaustive finite reference computations. This does not derive a proper positive support, make whole-span replacements locally VerifyDW-eligible, implement the manuscript's complete noncomputational profile grammar, establish global route coverage or unconditional SaturatePositive, BCELReady or ZeroSlack, or prove complete PCCMin polynomial runtime, output-size or certificate bounds. The eligible root theorem remains absent and P = NP is not proved.",
      "fields": {
        "leanClosedSupportFullGainFormalized": true,
        "leanClosedSupportFullGainAxiomAuditPassed": true,
        "leanClosedSupportFullGainAuditedDeclarationCount": 27,
        "leanClosedSupportFullGainPrimaryInputSpecializationTheorem": "PNP.DirectWire.ClosedSupportFullGain.prefixSource_value",
        "leanClosedSupportFullGainRetainedFieldTheorem": "PNP.DirectWire.ClosedSupportFullGain.prefixField_value",
        "leanClosedSupportFullGainWholeCarrierTheorem": "PNP.DirectWire.ClosedSupportFullGain.result_fullEquivalent",
        "leanClosedSupportFullGainExactGateBalanceTheorem": "PNP.DirectWire.ClosedSupportFullGain.result_exact_accounting",
        "leanClosedSupportFullGainWholeFullSlackBalanceTheorem": "PNP.DirectWire.ClosedSupportFullGain.result_fullSlack_balance",
        "leanClosedSupportFullGainLocalSlackBoundTheorem": "PNP.DirectWire.ClosedSupportFullGain.localFullSlack_le_global",
        "leanClosedSupportFullGainCheckedRouteTheorem": "PNP.DirectWire.ClosedSupportFullGain.improvement?_sound",
        "leanClosedSupportFullGainStrictGainTheorem": "PNP.DirectWire.ClosedSupportFullGain.improvement?_strictGain",
        "leanClosedSupportFullGainArbitraryFiniteDimensionsCovered": true,
        "leanClosedSupportFullGainComputedClosedSupportAndFullMinimum": true,
        "leanClosedSupportFullGainComplementAndReconnectionDerived": true,
        "leanClosedSupportFullGainUniformOutputsAndComputationalFieldsPreserved": true,
        "leanClosedSupportFullGainCallerSuppliedObserverReplacementOrCorrectnessRequired": false,
        "leanClosedSupportFullGainLocalFullSlackExactlyRetiredFromWhole": true,
        "leanClosedSupportFullGainProperPositiveSupportDiscoveryProved": false,
        "leanClosedSupportFullGainWholeSpanIsProperLocalVerifyDW": false,
        "leanClosedSupportFullGainCompleteManuscriptProfileGrammarProved": false,
        "leanClosedSupportFullGainGlobalRouteCoverageProved": false,
        "leanClosedSupportFullGainUnconditionalSaturatePositiveProved": false,
        "leanClosedSupportFullGainUnconditionalBCELReadyProved": false,
        "leanClosedSupportFullGainUnconditionalZeroSlackProved": false,
        "leanClosedSupportFullGainExactPolynomialPCCMinProved": false,
        "leanClosedSupportFullGainPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanClosedSupportFullGainReferenceMinimumMatchingAndInfluenceAreExhaustive": true,
        "leanClosedSupportFullGainRuntimeExecutionIsProofAuthority": false,
        "leanClosedSupportFullGainScope": "arbitrary-finite-computed-closed-support-full-minimum-derived-physical-complement-uniform-whole-output-and-computational-field-equivalence-exact-gate-and-full-slack-balance-checked-strict-descent-no-proper-positive-discovery-complete-profile-global-route-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.ClosedSupportFullGain.ambient_output": {
          "hash": "ee568f70b67653b08b7e6a446f41c4a7afc669fb8d9f64079e17d002ab07f1b9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.boundarySource_value": {
          "hash": "af26c3fb2de1f7a161d1070d037d3695e8f6e159af40f5c1345ee2060b3c95d9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.complement_gate_value": {
          "hash": "99ad4452989a8e4bbcb7d257dda6e12acd5b6578148579454b6538e78d1b7383",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.fieldSource_value": {
          "hash": "508f7a818cf914e93b5103db786c749b9e130d90a4e10f6e4b2e860b18fac54c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.improvement?_none_iff": {
          "hash": "5f98a2587f19fc9154dc010f322dd6880f46e2a09f4f9e33d87f7bf9e0f9d267",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.improvement?_sound": {
          "hash": "045804cce1560f746fb655689b7401cae42ba6ffad0359460eba57d6a7daeb6d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.improvement?_strictGain": {
          "hash": "26465ff5e8043e1b8348f741c564d7884bf5ea445c2e4f536dafbad61c241a5a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.inputBinding_eval": {
          "hash": "100a65ba4f3e2e05637bf7d309187d39d9053ba58768734bcd9c490ab7bac731",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.interface_index_exists": {
          "hash": "1130fec13c73b0fbc27ee4fb97afebe8c6c3f876372d9a1b4d1714d92c42e249",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.interface_index_sound": {
          "hash": "832e7b0043849d0b3081e92856e5e41b05b769c241f1f95764e87d88d007d6ae",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.localFullSlack_le_global": {
          "hash": "77dbb9280db83b5315c6d398f73631b6dacdc79ce42d857d6ef8dc9b111be4a2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.offered_available": {
          "hash": "99765be4b85467b2acf1b8fedd80f3a32872e920ba434c1b53e90c0bfac064f8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.offered_gateCount": {
          "hash": "7b9303daa49c71db11745cbd8ff49e35e4d2de20de1468f7d6255f3800cb0d51",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.offered_gateCount_le": {
          "hash": "4dfcc8b90d10ac3201fd9a039a2032b72a88f870d1077bae8527744d782da679",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.outputSource_value": {
          "hash": "77978caf94fad2d86adb034eeb4127ab697a626979820544a37dba23e6cf48ca",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.prefixField_value": {
          "hash": "1d426e2e2a43cf3f41d9512c0d60fc8e9a51fe0a70aeffa41460422b34815752",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.prefixOutput_value": {
          "hash": "66253f4a759423d4beda0ea2524e815ebf052e75ea63565f528e6be1a22c2749",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.prefixSource_value": {
          "hash": "ab53152242651971b218aafc87ad3538303263b7d4071f89765480452874632e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.restrict_extendZero": {
          "hash": "a5894a9fea644ddaf89e902ee96209795e92b627ca1b49834b9e1241d37a6076",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDClosedSupportFullGainPrefix"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_exact_accounting": {
          "hash": "45f5d0e572e15769050735209c56e9826a8d0bbbb79dfeeab872478bb8e5f6b0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_fullEquivalent": {
          "hash": "c4ce482c3195b7eaf840eb6f6e02ed14fa79e93f15aa0e2774fb8354f53ef095",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_fullMinimum": {
          "hash": "6cf8caaca12504a4ab9a09ba24a02e445a996626500f2fab69034ff6b2f0a93d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_fullSlack_balance": {
          "hash": "8cb443818ba57aec70181da2ebe015424f9426e5f6e719db8310006b50bb2d2d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_gain_balance": {
          "hash": "35e9be6bf27970a14e331de0c92c3e90a515d0ad55fbc156442cec161630d939",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_output": {
          "hash": "c670cc9864366a7e5fde03c6f61c76ffd01923ca4e3e9efad64bbd4c1f1621cb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.result_strict_iff": {
          "hash": "8fb91b09da8cba2f59fe0dd0bf5aabba01532f870f028ce872dff432683f0f7c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
        },
        "PNP.DirectWire.ClosedSupportFullGain.retained_source_value": {
          "hash": "b4eb6842f1eddc3c45a6f04d54cee302893708e9d293279d745e7f367abc2c84",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportFullGain"
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
      "number": 279,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-20-279",
      "id": "computed-whole-support-minimum-bridge",
      "title": "Computed whole-support minimum bridge",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite wire carriers and keep masks, the physical whole-support seed is derived from all original gates. Its computed saturated interface contains exactly the original gate-valued ordinary outputs, while every computational field is available. Explicit size-preserving comparisons identify its full-profile reference minimum with the independent whole-carrier output-and-field minimum. The actual computed full-profile replacement attains that minimum, has zero remaining whole-carrier full slack, and returns no strict improvement exactly when the original whole-carrier full slack is zero. The seed, interface, observer, minimum and replacement are derived rather than supplied correctness data.",
      "nonClaim": "The whole-span reference branch remains exhaustive, including minimum search, source matching and saturation influence. Zero slack after exhaustive reference minimization is not the manuscript's unconditional ZeroSlack theorem or a polynomial PCCMin algorithm. This does not discover a proper positive support, compile arbitrary minima into proper-local VerifyDW histories, reconstruct the complete noncomputational profile grammar, derive global route coverage or unconditional SaturatePositive and BCELReady, or establish complete polynomial runtime, output-size or certificate bounds. The eligible root theorem remains absent and P = NP is not proved.",
      "fields": {
        "leanClosedWholeMinimumFormalized": true,
        "leanClosedWholeMinimumAxiomAuditPassed": true,
        "leanClosedWholeMinimumAuditedDeclarationCount": 22,
        "leanClosedWholeMinimumDerivedWholeSeedTheorem": "PNP.DirectWire.ClosedWholeMinimum.support_gateCount",
        "leanClosedWholeMinimumExactOrdinaryInterfaceTheorem": "PNP.DirectWire.ClosedWholeMinimum.interface_iff_output",
        "leanClosedWholeMinimumComputedFieldAvailabilityTheorem": "PNP.DirectWire.ClosedWholeMinimum.available_all",
        "leanClosedWholeMinimumSizePreservingComparisonTheorem": "PNP.DirectWire.ClosedWholeMinimum.forward_gateCount",
        "leanClosedWholeMinimumExactMinimumTheorem": "PNP.DirectWire.ClosedWholeMinimum.full_minimum",
        "leanClosedWholeMinimumAttainedMinimumTheorem": "PNP.DirectWire.ClosedWholeMinimum.result_optimal",
        "leanClosedWholeMinimumExactFullSlackTheorem": "PNP.DirectWire.ClosedWholeMinimum.fullSlack_eq",
        "leanClosedWholeMinimumPostReferenceSlackTheorem": "PNP.DirectWire.ClosedWholeMinimum.result_zero_fullSlack",
        "leanClosedWholeMinimumCheckedNoImprovementTheorem": "PNP.DirectWire.ClosedWholeMinimum.improvement_none_iff",
        "leanClosedWholeMinimumArbitraryFiniteDimensionsCovered": true,
        "leanClosedWholeMinimumSeedInterfaceAndObserverDerived": true,
        "leanClosedWholeMinimumIndependentFullReferenceMinimaEqual": true,
        "leanClosedWholeMinimumComputedResultAttainsFullReferenceMinimum": true,
        "leanClosedWholeMinimumCallerSuppliedEqualityMinimumOrCorrectnessRequired": false,
        "leanClosedWholeMinimumWholeSpanIsProperLocalVerifyDW": false,
        "leanClosedWholeMinimumProperPositiveSupportDiscoveryProved": false,
        "leanClosedWholeMinimumCompleteManuscriptProfileGrammarProved": false,
        "leanClosedWholeMinimumGlobalRouteCoverageProved": false,
        "leanClosedWholeMinimumUnconditionalSaturatePositiveProved": false,
        "leanClosedWholeMinimumUnconditionalBCELReadyProved": false,
        "leanClosedWholeMinimumUnconditionalZeroSlackProved": false,
        "leanClosedWholeMinimumExactPolynomialPCCMinProved": false,
        "leanClosedWholeMinimumPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanClosedWholeMinimumReferenceSearchRemainsExhaustive": true,
        "leanClosedWholeMinimumRuntimeExecutionIsProofAuthority": false,
        "leanClosedWholeMinimumScope": "arbitrary-finite-derived-whole-gate-seed-computed-ordinary-interface-full-field-availability-size-preserving-two-way-reference-minimum-equality-attained-whole-full-minimum-no-proper-local-manuscript-zeroslack-global-route-or-polynomial-claim"
      },
      "theorems": {
        "PNP.DirectWire.ClosedWholeMinimum.ambient_output_absent": {
          "hash": "de1f2f9477952316157534c5abccc9eb177defc5ca4c63f3d3813b47b56d6f63",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.available_all": {
          "hash": "abda5f4e8f992398218a6715a299cd2040fa7484a95c40e6427e8aaedcf6d4c7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.forward_available": {
          "hash": "d2bc1aa0bc4e5b2485adb2b925a9ea19d3ad2165fcf5cb85f68da57bb8adb7b2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.forward_equivalent": {
          "hash": "1b55ee408cd4b476c52987bc53616ce1a0b26e6e9fa904db928fe37c086fe516",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.forward_gateCount": {
          "hash": "0a6b23e44cbdda91623811bde32b30c4afed5f39a27cfd30ae18de3677825803",
          "axioms": [],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.forward_output_none": {
          "hash": "717987c2cf6cee2ee80ce3e80336f92d6327a475483976348f1acbc9bd245ae0",
          "axioms": [],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.forward_output_some": {
          "hash": "8f107d84399f072c2dea4fc67e348da169a3cb6bb716b8965eba34cdfd6ca22f",
          "axioms": [],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.fullSlack_eq": {
          "hash": "b87bc9c3743641fe8d6481244fb1fcfe4a3bd090a75fd1563505eb98c2ace03d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.full_minimum": {
          "hash": "1130eabcdce4e914eb1b975ba1a71cbc5aaba01c275c589522d419190f180577",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.gate_selected": {
          "hash": "4941ffa61289594b072955d12bdf1d4b745dc4044652d9802b32f811b45321ce",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.global_minimum_le": {
          "hash": "620f470f41a44eed9fcc3b80b1d0ed4bff3eb078430433dbc5f1b30c1aa0051f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.improvement_none_iff": {
          "hash": "d31e874330121a7b2919784e382cc5c0956e819d4a9415e68773d2fb2de9695e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.interface_iff_output": {
          "hash": "958fd1e723c83dd5071f3a5dffcffc38bdf66fab22357ad6da44d0b249d64179",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.outputIndex_exists": {
          "hash": "bc950d30ff11863f52698c243a1668d7b015a945377de5571996238d2671533c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.outputIndex_none_not_interface": {
          "hash": "d6e35fa2b4b3d2dfd9a1de80fb8f2d4b2bd6166f7edd192867f7d89920b979f6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.outputIndex_sound": {
          "hash": "949c3138997ab5f60be81748a37eb85c64823d87d61c4cf8abe303c8180d49d8",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.result_gateCount": {
          "hash": "10ad0ca84393a31831a39e1a0db9c8f0068e672d9d5d8075328d2dbdc9a25014",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.result_optimal": {
          "hash": "98b401fb9516b8b8e1a9525bb49d69be4cc0318e11cf9f8a5f1aa7f47e02696b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.result_zero_fullSlack": {
          "hash": "848cab843f093d0b0ecb0c5d8f966843bee0079620bae28bb8dda4d3afd4d6e5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
        },
        "PNP.DirectWire.ClosedWholeMinimum.source_retained": {
          "hash": "00955517186813221b3a6ce2d1dceacfbfd4d6edcaefbe348be0d8c0ebf086d6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.support_gateCount": {
          "hash": "cbdc7da1e90b9748c70d67cd45d0c4e2cd54b7d79b68b9fe0d7379c6b7068d0d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimumPrefix"
        },
        "PNP.DirectWire.ClosedWholeMinimum.support_minimum_le": {
          "hash": "200e284d486b2a3494379785431d126117cc77f4956c42ef5d24d9341109c925",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedWholeMinimum"
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
      "number": 280,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-20-280",
      "id": "computed-closed-support-nested-positivity",
      "title": "Computed nested-support cost and positivity transport",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite wire carriers, keep masks and two raw seed lists whose computed completed supports are physically nested, derive the exact gate difference and crossing bindings. Extend the actual full or quotient reference minimum inside the common ambient input domain, preserving the larger padded ordinary interface and exact required computational-field availability, including false values. The derived comparisons prove that either minimum grows by at most the added physical gates, that full slack and support size minus quotient minimum are monotone, and that positive full slack or projection defect remains positive in the completed larger support. Raw-seed inclusion derives the physical inclusion. No cost inequality, field-equality certificate or optimizer is supplied to the final theorem.",
      "nonClaim": "This compares already completed dependency-closed supports in the computational-wire-profile model. It does not prove preservation of an arbitrary raw witness's initial positivity during completion, transparency of every intermediate event, monotonicity of projection defect alone, complete manuscript profile semantics, discovery of a proper positive support, global routing or unconditional SaturatePositive, BCELReady or ZeroSlack. Reference minimization, matching and influence computations remain exhaustive; complete polynomial PCCMin runtime, output-size and certificate bounds are not proved. The eligible root theorem remains absent and P = NP is not proved.",
      "fields": {
        "leanClosedSupportNestedGainFormalized": true,
        "leanClosedSupportNestedGainAxiomAuditPassed": true,
        "leanClosedSupportNestedGainAuditedDeclarationCount": 36,
        "leanClosedSupportNestedGainPhysicalDifferenceTheorem": "PNP.DirectWire.ClosedSupportNestedGain.support_count_decomposition",
        "leanClosedSupportNestedGainExactOrdinaryInterfaceTheorem": "PNP.DirectWire.ClosedSupportNestedGain.outputSource_value",
        "leanClosedSupportNestedGainExactFieldObservationTheorem": "PNP.DirectWire.ClosedSupportNestedGain.extended_available",
        "leanClosedSupportNestedGainFullMinimumCostBoundTheorem": "PNP.DirectWire.ClosedSupportNestedGain.full_minimum_cost_balance",
        "leanClosedSupportNestedGainQuotientMinimumCostBoundTheorem": "PNP.DirectWire.ClosedSupportNestedGain.quotient_minimum_cost_balance",
        "leanClosedSupportNestedGainFullSlackMonotonicityTheorem": "PNP.DirectWire.ClosedSupportNestedGain.full_slack_le",
        "leanClosedSupportNestedGainQuotientSlackMonotonicityTheorem": "PNP.DirectWire.ClosedSupportNestedGain.quotient_slack_le",
        "leanClosedSupportNestedGainPhysicalInclusionPositivityTheorem": "PNP.DirectWire.ClosedSupportNestedGain.positive_mono",
        "leanClosedSupportNestedGainRawSeedInclusionTheorem": "PNP.DirectWire.ClosedSupportNestedGain.included_of_seed_subset",
        "leanClosedSupportNestedGainRawSeedPositivityTheorem": "PNP.DirectWire.ClosedSupportNestedGain.seed_positive",
        "leanClosedSupportNestedGainArbitraryFiniteDimensionsCovered": true,
        "leanClosedSupportNestedGainSupportsDifferenceAndBindingsDerived": true,
        "leanClosedSupportNestedGainAmbientInputsRetained": true,
        "leanClosedSupportNestedGainExactFalseAndTrueFieldObservationsPreserved": true,
        "leanClosedSupportNestedGainFullAndQuotientComparisonsDerived": true,
        "leanClosedSupportNestedGainCallerSuppliedCostOrFieldEqualityRequired": false,
        "leanClosedSupportNestedGainInitialRawWitnessPositivityPreservationProved": false,
        "leanClosedSupportNestedGainProperPositiveSupportDiscoveryProved": false,
        "leanClosedSupportNestedGainCompleteManuscriptProfileGrammarProved": false,
        "leanClosedSupportNestedGainGlobalRouteCoverageProved": false,
        "leanClosedSupportNestedGainUnconditionalSaturatePositiveProved": false,
        "leanClosedSupportNestedGainUnconditionalBCELReadyProved": false,
        "leanClosedSupportNestedGainUnconditionalZeroSlackProved": false,
        "leanClosedSupportNestedGainExactPolynomialPCCMinProved": false,
        "leanClosedSupportNestedGainPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanClosedSupportNestedGainReferenceSearchRemainsExhaustive": true,
        "leanClosedSupportNestedGainRuntimeExecutionIsProofAuthority": false,
        "leanClosedSupportNestedGainScope": "arbitrary-finite-computed-completed-nested-support-derived-physical-difference-common-ambient-exact-ordinary-and-field-comparisons-full-and-quotient-cost-bounds-slack-and-combined-positivity-transport-no-initial-completion-manuscript-global-route-or-polynomial-claim",
        "leanClosedSupportNestedGainEveryIntermediateEventTransparencyProved": false,
        "leanClosedSupportNestedGainProjectionDefectAloneMonotonicityProved": false
      },
      "theorems": {
        "PNP.DirectWire.ClosedSupportNestedGain.ambient_output_absent": {
          "hash": "1664f58363b58e2c4c8929e40f2943a2bc2b85ca27f6a03b0a2f49a3ffb14eeb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCandidate"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.append_positive": {
          "hash": "897a005fbccaec759f9eba406f4ff023c11150fb6715f5d4fad198719d6f0503",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.available_from_large": {
          "hash": "8c623a327f3cebc67b3513429cb47fb1c5a2cca2b26aaf5d88412dbe5e011e9b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedProfile"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.available_from_prefix": {
          "hash": "b580a0417f4910e4ad3fc66a455a5ac588175b88f99907fadd9fd719982046dd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedOrigin"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.available_mono": {
          "hash": "71aee9407786af19d679a0bcb683a2751fb12acdabe895c77e172c0f4b12454c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.available_to_large": {
          "hash": "d49f4dd99d7988a662426b51825e658fb6e605d12f453365458937cc61ef0c32",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedOrigin"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.boundarySource_value": {
          "hash": "311f7c6d778c661574dfff22b51ef34ba4104baad08b83c5a895c6f6d7958ac9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedProgram"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.difference_boundary_interface": {
          "hash": "732dd2145705b32aa601738869239d79034dba4452f2e3cc76791e7b5896367c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.difference_gate_value": {
          "hash": "00c86a0020703f9bf2b568e88aeb0c4155e33d11035f285d3aadc7a054e81821",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedProgram"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.difference_selected": {
          "hash": "b412470a70a0afe5ec6830b64fbe4d5953b243e09f9ac7ef5d791dcba94340ac",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.difference_selected_iff": {
          "hash": "ca6e55b2bcc4c309cc7c97f69e1bff37ca7c30e209d4d8073b1e6aa6deba3a30",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.extended_available": {
          "hash": "4b6df1a65ce33609c3c5c0bb5b8d765ca682bd4f82635529dea24b69c261adb4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedProfile"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.extended_gateCount": {
          "hash": "4ebda64f982971ba3807738fd34f40afc60da6ecfd0fbf294f5afb35664e0306",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCandidate"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.extended_source_origin": {
          "hash": "4c6ac839e7bffe961565584cdcb447c54fee221eab14dda60e106ad31d60b1e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedOrigin"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.full_minimum_cost_balance": {
          "hash": "60b0038366bc77325b182db70b379a1d4ccd6d939ce44304cd43ff08b568249c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.full_minimum_extension_bound": {
          "hash": "9e986a725b3196c616e8b44df6f7873d93cc88e4ee50661166454309ca1b8f07",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.full_minimum_le_support": {
          "hash": "cfdff420135f7c2ceb28b016f8701b86a76056fe8e123f587b459ae90e0416d8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.full_slack_le": {
          "hash": "f4c721eab26422c24a1cf98041108a09b10df02628198e041ff363e924142ce2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.included_of_seed_subset": {
          "hash": "9bd26f7c83382fe22808178b4e55b6393b281a83fd6d9aeaf45ad6768a94ba5f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.larger_interface_in_smaller": {
          "hash": "dc775e41f2508444b469371f96a41ce729a8986e3b4070a07ba094d9313fba7e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.outputSource_value": {
          "hash": "76ea15c3a5db333c53e611ef4921519338bfa78b0293c44eca9e73d5d74475a9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCandidate"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.positive_iff_quotient_slack": {
          "hash": "df0f381c225b4b093125e22d13b37f004fbc58c301adc0ef3673fa80db350e45",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.positive_mono": {
          "hash": "77ad2d4afeb2095127ef63ec8909f0bf9320209e22f43197e31b8f657810216b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.prefix_source_value": {
          "hash": "0e49fcd7689996edf7458c32f9fbae1891e0a787e489afdf5ee29327d4847430",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedProgram"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.quotient_minimum_cost_balance": {
          "hash": "848c75e167d99f2a56e9f4916014c4d7a9a26648cf3dcb38e0b5ff8e34ca9efd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.quotient_minimum_extension_bound": {
          "hash": "c6b5541566f7748262cab20f1dfd954f5b3fd796d5909c3a75ab13e239a9def6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.quotient_minimum_le_full": {
          "hash": "97e24b411e2d21a573d584a2fc5fe23c84e2ea5ac863821ef950a5daa600035e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.quotient_slack_le": {
          "hash": "82e78dab58263c396357954e430425c86d63ac529fc0e93184a388ef7d09f1be",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.retained_mono": {
          "hash": "5e47a8a5a86b175f94d9c9cb7713aeff1cf3df317087cf702de5d4ee20f4c5e9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.seed_full_cost_balance": {
          "hash": "f701dc6f40d1a1942880d874b233be2fc5799faf9b6ee3f5d2447dd7d83f9fef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.seed_full_slack_le": {
          "hash": "2db48e318859984afa830b2d29d3df0bfe5df506f9618dee4a84fdef6a17007c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.seed_positive": {
          "hash": "f66fc5a639623f276d3ba47340ff3e8d61ed9138da139d234da24dda6c8613fb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.seed_quotient_cost_balance": {
          "hash": "5d074646b191df56413549534f015796b2dea82c8c9652751bdc14865bc17558",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedGain"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.slack_decomposition": {
          "hash": "97622a1b2b0c8459de7a60f5fd6f78ee45dcee5d81cf2a456897ae5d5b974ff6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedCost"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.support_count_decomposition": {
          "hash": "feccbeff2848a7ab6a6a91e131908821466381c92dcec72ecd3895b0e025e165",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
        },
        "PNP.DirectWire.ClosedSupportNestedGain.support_size_le": {
          "hash": "3ab31589337c8aab441b8c7d94fd9b418594efca81d09110a507798ad60162fb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDClosedSupportNestedSelection"
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

export const M280_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M280_BATCH.milestones.map(row => row.fields)));
export const M280_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M280_BATCH.milestones.map(row => row.theorems)));

export const M280_BATCH_SCOPE_SUFFIX = '+plus-' + M280_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM280BatchPublicationMap(map) {
  for (const expected of M280_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM280BatchStatus(status) {
  for (const expected of M280_BATCH.milestones) {
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

function assertM280BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M280_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM280BatchInventory(inventory) {
  assertM280BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M280_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m280BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M280_BATCH.batchId,
    reviewedSource: { ...M280_BATCH.reviewedSource },
    milestones: M280_BATCH.milestones.map(row => ({
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

export function assertM280BatchManifest(manifest) {
  const expected = m280BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM265M280;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:280}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:280}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M280_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM280BrowserDescriptor() {
  return '// M265-M280-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M265_M280_BATCH = Object.freeze(' + JSON.stringify(M280_BATCH, null, 2) + ');\n' +
    'const FORMAL_M265_M280_VALIDATORS = (() => {\n' +
    'const M280_BATCH = FORMAL_M265_M280_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM280BatchStatus, assertM280BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM280BatchStatus, inventory: assertM280BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M265-M280-BATCH-DESCRIPTOR:END';
}

export function assertM280BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M265-M280-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M265-M280-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM280BrowserDescriptor(),
    'browser', {number:280}, 'generated descriptor');
}
