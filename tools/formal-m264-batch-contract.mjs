// Reviewed compiled evidence for the M263-M264 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M264_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m263-m264",
  "reviewedSource": {
    "commit": "029153fc5d8bfc84c61d33858d0472bcbf3d3a73",
    "tree": "d725f0e14d1a4625c0ce991364fa4481ef3c032a",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-15-264"
  },
  "milestones": [
    {
      "number": 263,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-15-263",
      "id": "wire-obligation-history",
      "title": "Computed dependency-ordered physical obligation histories",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite input, output, computational-field and event dimensions, M263 computes a complete dependency order from raw event identities, explicit predecessors and intrinsic creation references. Duplicate identities, missing references and cyclic graphs reject. The scheduler succeeds exactly when the actual finite dependency relation is well-founded. The history constructor executes one evolving physical carrier from the original source, without caller-supplied order, rank, state, full-value witness or charge data. R5 captures the actual pre-drop carrier; physical normalization preserves open snapshots; source-identity R6 computes a visible representative; R8 appends and charges the complete materializer from the matching creation snapshot. Full reads require an available field, and final open obligations reject. Every successful history executes every event exactly once in dependency order, every creation discharges strictly later with its full source binding, and every ordinary output and computational field retains its original value for every valuation. Final physical gates plus actual normalization removals equal initial physical gates plus all appended materializer charges.",
      "nonClaim": "This is the computational R5/R6/R8 history component, not the complete manuscript obligation calculus or Package E. Acyclicity guarantees a computed order, not a valid lifecycle or confluence of underspecified event graphs. R5 projection alone removes no physical gates; repeated restorations receive no free cross-snapshot sharing, and restoration can increase physical size. Quotient-only agreement cannot discharge a full obligation. Full R7 and other R1-R9 semantics, all N1-N10 transports, arbitrary observers and profile histories, noncomputational carrier records, matched-kappa Pull/Expand, complete Package E, global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete encoded-input-size polynomial runtime, output and certificate bounds remain open. Runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireObligationHistoryFormalized": true,
        "leanWireObligationHistoryAxiomAuditPassed": true,
        "leanWireObligationHistoryAuditedDeclarationCount": 46,
        "leanWireObligationHistoryDependencySchedulerSuccessIffTheorem": "PNP.DependencyScheduler.compile_success_iff",
        "leanWireObligationHistoryDependencySchedulerFailureIffTheorem": "PNP.DependencyScheduler.compile_failure_iff",
        "leanWireObligationHistoryRawOrderSuccessIffTheorem": "PNP.DirectWire.WireObligationHistory.orderEvents_success_iff",
        "leanWireObligationHistoryRawOrderFailureIffTheorem": "PNP.DirectWire.WireObligationHistory.orderEvents_failure_iff",
        "leanWireObligationHistoryCreationSourceSnapshotTheorem": "PNP.DirectWire.WireObligationHistory.State.create_source_snapshot",
        "leanWireObligationHistoryActualRestorationChargeTheorem": "PNP.DirectWire.WireObligationHistory.State.restore_gate_charge",
        "leanWireObligationHistoryNormalizationBalanceTheorem": "PNP.DirectWire.WireObligationHistory.State.normalize_gate_balance",
        "leanWireObligationHistoryMatchedDischargeBindingTheorem": "PNP.DirectWire.WireObligationHistory.Transition.dischargeRecord_binding",
        "leanWireObligationHistoryCreationLifecycleTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.creation_lifecycle",
        "leanWireObligationHistoryDependencyOrderTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.dependency_before",
        "leanWireObligationHistoryExactlyOnceCountTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.executed_count",
        "leanWireObligationHistoryUniqueEventIdentitiesTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.executed_identities_nodup",
        "leanWireObligationHistoryFullFieldTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.full_field",
        "leanWireObligationHistoryOrdinaryOutputTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.full_output",
        "leanWireObligationHistoryPhysicalGateBalanceTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.gate_balance",
        "leanWireObligationHistoryArbitraryFiniteEventGraphsCovered": true,
        "leanWireObligationHistoryDuplicateAndMissingReferencesRejected": true,
        "leanWireObligationHistoryIntrinsicCreationDependenciesComputed": true,
        "leanWireObligationHistoryCyclicGraphsRejected": true,
        "leanWireObligationHistoryActualEvolvingCarrierExecuted": true,
        "leanWireObligationHistorySourceBoundCreationAndDischargeRecords": true,
        "leanWireObligationHistoryCreationClosesStrictlyLater": true,
        "leanWireObligationHistoryPhysicalNormalizationPreservesOpenSnapshots": true,
        "leanWireObligationHistoryFullReadsRequireClosedField": true,
        "leanWireObligationHistoryFinalOpenObligationsRejected": true,
        "leanWireObligationHistoryComputedSourceIdentityR6": true,
        "leanWireObligationHistoryActualCapturedMaterializerR8": true,
        "leanWireObligationHistoryCompleteAppendedMaterializersCharged": true,
        "leanWireObligationHistoryNoFreeCrossSnapshotSharing": true,
        "leanWireObligationHistoryAllValuationFullOutputAndFieldPreservation": true,
        "leanWireObligationHistoryCallerSuppliedOrderRequired": false,
        "leanWireObligationHistoryCallerSuppliedRankRequired": false,
        "leanWireObligationHistoryCallerSuppliedStateRequired": false,
        "leanWireObligationHistoryCallerSuppliedFullWitnessRequired": false,
        "leanWireObligationHistoryCallerSuppliedChargesRequired": false,
        "leanWireObligationHistoryAcyclicityImpliesValidLifecycle": false,
        "leanWireObligationHistoryConfluenceOfUnderspecifiedEventGraphsProved": false,
        "leanWireObligationHistoryQuotientAgreementClosesObligation": false,
        "leanWireObligationHistoryR5ProjectionRemovesPhysicalGates": false,
        "leanWireObligationHistoryFullR7SemanticsProved": false,
        "leanWireObligationHistoryAllManuscriptRewriteFamiliesProved": false,
        "leanWireObligationHistoryAllManuscriptNormalizationFamiliesProved": false,
        "leanWireObligationHistoryArbitraryObserverOrProfileTransportProved": false,
        "leanWireObligationHistoryMatchedKappaPullExpandProved": false,
        "leanWireObligationHistoryFullManuscriptCarrierProved": false,
        "leanWireObligationHistoryCompletePackageEProved": false,
        "leanWireObligationHistoryGlobalRouteCoverageProved": false,
        "leanWireObligationHistoryUnconditionalSaturatePositiveProved": false,
        "leanWireObligationHistoryUnconditionalBCELReadyProved": false,
        "leanWireObligationHistoryUnconditionalZeroSlackProved": false,
        "leanWireObligationHistoryExactGeneralPCCMinProved": false,
        "leanWireObligationHistoryPolynomialRuntimeProved": false,
        "leanWireObligationHistoryRuntimeExecutionIsProofAuthority": false,
        "leanWireObligationHistoryScope": "arbitrary-finite-raw-event-graphs-computed-order-actual-evolving-carriers-source-bound-R5-R6-R8-full-read-records-strictly-later-matched-discharge-all-full-outputs-and-fields-exact-charged-materializer-and-normalization-gate-balance-no-complete-package-E-global-route-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DependencyScheduler.ReadyStep.remaining_lt": {
          "hash": "44bff5d1be6c8074e99def406e7faecb346441bedc0ac3b4420e4927f5e1373f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Schedule.at_injective": {
          "hash": "7325e0440ba228aecb1f3ca0bfd787ab82c93ed61aeb267db5b806a17845d360",
          "axioms": [],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Schedule.order_complete": {
          "hash": "c0bc5ea38e5bef5a3db8cfb385afd687f05970189a64219461a71a0c0cdc8e98",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Schedule.order_length": {
          "hash": "ccc28a25035f30ad731ce79d62437d84f497ca2c972ac0ef820cdfe0c6c78e83",
          "axioms": [
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Schedule.order_nodup": {
          "hash": "6fcec66236c25dbcf4e6eb74c07a06f8ffb1408eca6aaab395877ef05942d704",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Schedule.wellFounded": {
          "hash": "ba098126abab3930ba38e3eba6155f6aec86bf83d17d1e9b8e7a7cb9ef872882",
          "axioms": [],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Stop.complete_of_wellFounded": {
          "hash": "08aae73b031ced880c4c698523e670264020780bb2299593f48647c49c8a73dc",
          "axioms": [],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.Stop.unresolved_predecessor": {
          "hash": "3dc12cd45be6bcb7141fb81a8f29da69532c3374d724539d5e61f78c209193ac",
          "axioms": [],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.compile_failure_iff": {
          "hash": "d49913a5214be6296ea356ed69f4002bbf3adca2218ed7a66f3e35da36f5cf6e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DependencyScheduler.compile_success_iff": {
          "hash": "ff4041ae74888da57f525b104b237572ed7922572b4619e38611029541d78b8e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.FiniteDependencyScheduler"
        },
        "PNP.DirectWire.WireObligationHistory.State.cancel_full_value": {
          "hash": "f39bb7ff18787f0445bbbddb90f22badc6cc0c720066e449ab0256e4bcbf73f4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.cancel_gateCount": {
          "hash": "c6b668b242c280f4bc4e947acf75953e8b3d486f1ffa620a3357de1e42466dec",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.closed_field": {
          "hash": "aad78fb5c71f29dcc02113ec8f755d63ca8a3a2d475a3eda1f28ac90c6d3a1b2",
          "axioms": [],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.create_gateCount": {
          "hash": "c5055ea4079398b0c5de5ba33fead7a9e45e2ffeb9c6b8bed34bd3c42d39cca4",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.create_source_snapshot": {
          "hash": "5e6a73008b9ba035838fc473c3ce1d8aac10e09a8a343cdb47aeeba1160583ea",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.currentAgreement": {
          "hash": "13ccc70890d2b8883766af4ec127af0c5db4d32c4f08c14df0a35b89a8338770",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.normalize_gate_balance": {
          "hash": "40935311cd19f706866b06b3b69c7931faead7274c31c7a9c0257f704b3a75ac",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.restore_full_value": {
          "hash": "dad270a9a1c3a769c62fca96c301be597773a74ece28bf44218ed6ddec8b5ac2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.State.restore_gate_charge": {
          "hash": "6bb4d07dacd7838eabe2be506c785034ae0f46fb4e02fd85e72037ab5a7845bc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryState"
        },
        "PNP.DirectWire.WireObligationHistory.OrderedEvents.identities_nodup": {
          "hash": "ac8b9a9e2dfa8c944d30f4662958a5d7013379563d60c29150c23bf23dd99d46",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.OrderedEvents.order_complete": {
          "hash": "441646f4a5b2cb4a59e2ccfc6c8da1304a4ac9a12168930258a8dbf310937d94",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.OrderedEvents.order_length": {
          "hash": "20d3aff2d74b639edf50bd457633a18516b53a83e7649fb05cdf712d4ee4d7d7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.OrderedEvents.order_nodup": {
          "hash": "2abfa0b890cbe1d904f1f8d6fc4896e76d8b14411f872fd45cb3b57b23e6f9fc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.completeReferences_iff": {
          "hash": "355c32c56adc705ed0a0190ec224cca20c12a519c46ad7e13432214a0eaa2791",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.graph_dependency_iff": {
          "hash": "89f258096645cbd1c3edddcd44168ac82c80ee6061cdf7fa65a21071d2f13153",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.orderEvents_failure_iff": {
          "hash": "1e6aee6d2dcd4caeaed20485b311134540d383f0ff27836ad981c2c1e32de043",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.orderEvents_success_iff": {
          "hash": "ae1c23179eb625d7939d2c162f30ba70de98db04c30dc8e7f163195eddba6c12",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
        },
        "PNP.DirectWire.WireObligationHistory.uniqueIDs_iff": {
          "hash": "71bcbb813a106280cbc23056655b1e00d003abe9546142102a9252995d14ce06",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistory"
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
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.executed_count": {
          "hash": "3cd573f4f6711d7024502c0f32d4e095b2d72c472a2683dd98b6dbde45fcb37a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.executed_identities_nodup": {
          "hash": "c45b5bc13d7b34725e10435625feec02f58632c53a3de2870daa4b7e3b5a1707",
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
        "PNP.DirectWire.WireObligationHistory.ClosedHistory.full_output": {
          "hash": "b424d42f293c35731c15c87699685a7276d36f6535dc9df10d94038525f92c63",
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
        "PNP.DirectWire.WireObligationHistory.Execution.creationsClosed_of_finalClosed": {
          "hash": "2cc26c978ca29feaab7f93495679a526a087d81e45d41e79b747581f3c2affb9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.pending_persists_or_discharged": {
          "hash": "d6e413063b471ed85b88a8511c3e00cb1b8fbf74c8342ab840a87b0ef833cee2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.record_identities": {
          "hash": "99998dc3a2db9727261c6aaa9f719dd7e2e7bc1f07d0b4ed2ada9ceb24736ac5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.total_charge": {
          "hash": "7f1fa056790d301cbe44e1ff146522fe5a6de86a0b4f6f6ce8973ee63a100df1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.total_removed": {
          "hash": "f904a4305079095ec645306a1d05def1959dce27fb56cbe806f3869f967d4230",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.State.isClosed_sound": {
          "hash": "1e28a1969b79445ff35e88b8ba4bfbd84dcbf8ab4a5c62dccafa824dd5cd28fa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.charged_eq": {
          "hash": "e43b203250254c6888614c96da96a1969c48c462fcf2b82847f344974b2b6b83",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.created_pending": {
          "hash": "4946de5b4d016cfce8082bf7d22630cb7e7b37867fdc9b668d6213d1e3f3d824",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.dischargeRecord_binding": {
          "hash": "140da6c4f11123758ced882d33305ac808236012f726b61dbee4f11a3298b351",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.pending_persists_or_discharged": {
          "hash": "6b9c4958f407e0ffac3ca7d15254ed0070e775cb4b2ab2e2483e7b6a2c8ee192",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.removed_eq": {
          "hash": "9ec3017bd5fed872a00ee12b52b2e9b3a414623683270daed4fca66aabd839b4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationHistoryExecution"
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
      "number": 264,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-15-264",
      "id": "wire-history-arbitrary-support",
      "title": "Source-derived closed-history literal arbitrary-support replacement",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite candidate, support and raw-event dimensions, the constructor extracts actual computational fields with zero duplicate ordinary outputs, executes the existing closed R5/R6/R8 history, and derives literal-splice acyclicity from original gate labels and actual causal bounds. The current carrier and every pending snapshot preserve those bounds through actual normalization, source-identity cancellation and paid captured restoration. The existing literal graph compiler then succeeds for every accepted closed history without a caller-supplied replacement, rank, order or semantic certificate. All ordered original outputs are preserved; every exterior gate occurs once; final gates plus actual removals equal original gates plus all actual materializer charges. Strict gain follows when removals exceed charges. The splice stage introduces no rejection beyond the actual history compiler.",
      "nonClaim": "This covers the existing computational R5/R6/R8 language and three-pass physical normalizer, not all manuscript R1-R9 or N1-N10 rules, full R7, arbitrary observers, noncomputational carriers, full-profile compatibility, matched-kappa Pull/Expand or complete Package E. The support records and raw history remain input data. It does not derive terminal families, a globally successful rewrite strategy, global route coverage, unconditional SaturatePositive, BCELReady or ZeroSlack, exact general PCCMin or complete encoded-input polynomial runtime/output/certificate bounds. Boolean equivalence alone is not a causal certificate. Runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes; deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireHistoryArbitrarySupportFormalized": true,
        "leanWireHistoryArbitrarySupportAxiomAuditPassed": true,
        "leanWireHistoryArbitrarySupportAuditedDeclarationCount": 24,
        "leanWireHistoryArbitrarySupportExtractionCausalLevelsTheorem": "PNP.DirectWire.extractTerminalSupport_causal_levels",
        "leanWireHistoryArbitrarySupportExtractionCausalIndexTheorem": "PNP.DirectWire.extractTerminalSupport_causal_index",
        "leanWireHistoryArbitrarySupportPhysicalNormalizationCausalBoundTheorem": "PNP.DirectWire.CausalBound.physical_normalization_output_bound",
        "leanWireHistoryArbitrarySupportCapturedRestorationCausalBoundTheorem": "PNP.DirectWire.WireObligationRestoration.join_causalBounds",
        "leanWireHistoryArbitrarySupportClosedHistoryCausalInvariantTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.causalInvariant",
        "leanWireHistoryArbitrarySupportClosedHistoryFieldCausalBoundTheorem": "PNP.DirectWire.WireObligationHistory.ClosedHistory.field_causal_bound",
        "leanWireHistoryArbitrarySupportLiteralGraphRankDecreaseTheorem": "PNP.DirectWire.ArbitrarySupportSplice.graph_causal_rank_decreases",
        "leanWireHistoryArbitrarySupportLiteralGraphWellFoundedTheorem": "PNP.DirectWire.ArbitrarySupportSplice.graph_wellFounded_of_causalInterfaceBound",
        "leanWireHistoryArbitrarySupportClosedHistoryEquivalentTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_equivalent",
        "leanWireHistoryArbitrarySupportDerivedInterfaceBoundTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_causalInterfaceBound",
        "leanWireHistoryArbitrarySupportClosedHistoryCompilationTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_compiles",
        "leanWireHistoryArbitrarySupportOrderedOutputSemanticsTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_semantics",
        "leanWireHistoryArbitrarySupportCompletePhysicalAccountingTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_exact_accounting",
        "leanWireHistoryArbitrarySupportStrictGainTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_result_strict_gain",
        "leanWireHistoryArbitrarySupportRawConstructorCompleteTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.compile_complete",
        "leanWireHistoryArbitrarySupportRawConstructorSoundTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.compile_sound",
        "leanWireHistoryArbitrarySupportNoAdditionalRejectionTheorem": "PNP.DirectWire.WireHistoryArbitrarySupport.compile_none_iff",
        "leanWireHistoryArbitrarySupportArbitraryFiniteCandidateSupportAndEventDimensionsCovered": true,
        "leanWireHistoryArbitrarySupportZeroDuplicateOrdinaryOutputsInExtractedCarrier": true,
        "leanWireHistoryArbitrarySupportCurrentAndPendingSnapshotCausalBoundsDerived": true,
        "leanWireHistoryArbitrarySupportActualPhysicalNormalizerAndCapturedMaterializerUsed": true,
        "leanWireHistoryArbitrarySupportSourceIdentityCancellationPreserved": true,
        "leanWireHistoryArbitrarySupportLiteralOneCopySpliceAfterEveryAcceptedClosedHistory": true,
        "leanWireHistoryArbitrarySupportEveryOrderedOriginalOutputPreserved": true,
        "leanWireHistoryArbitrarySupportCompleteMaterializerChargesIncluded": true,
        "leanWireHistoryArbitrarySupportStrictGainRequiresRemovalsExceedCharges": true,
        "leanWireHistoryArbitrarySupportSpliceStageAddsNoRejection": true,
        "leanWireHistoryArbitrarySupportCallerSuppliedReplacementRequired": false,
        "leanWireHistoryArbitrarySupportCallerSuppliedRankOrOrderRequired": false,
        "leanWireHistoryArbitrarySupportCallerSuppliedSemanticCertificateRequired": false,
        "leanWireHistoryArbitrarySupportBooleanEquivalenceAloneEnsuresAcyclicity": false,
        "leanWireHistoryArbitrarySupportSupportRecordsAndRawEventsDerivedFromEveryInput": false,
        "leanWireHistoryArbitrarySupportFullR7SemanticsProved": false,
        "leanWireHistoryArbitrarySupportAllManuscriptRewriteAndNormalizationFamiliesProved": false,
        "leanWireHistoryArbitrarySupportArbitraryObserverOrFullProfileTransportProved": false,
        "leanWireHistoryArbitrarySupportMatchedKappaPullExpandProved": false,
        "leanWireHistoryArbitrarySupportFullManuscriptCarrierProved": false,
        "leanWireHistoryArbitrarySupportCompletePackageEProved": false,
        "leanWireHistoryArbitrarySupportTerminalFamiliesDerived": false,
        "leanWireHistoryArbitrarySupportGloballySuccessfulRewriteStrategyDerived": false,
        "leanWireHistoryArbitrarySupportGlobalRouteCoverageProved": false,
        "leanWireHistoryArbitrarySupportUnconditionalSaturatePositiveProved": false,
        "leanWireHistoryArbitrarySupportUnconditionalBCELReadyProved": false,
        "leanWireHistoryArbitrarySupportUnconditionalZeroSlackProved": false,
        "leanWireHistoryArbitrarySupportExactGeneralPCCMinProved": false,
        "leanWireHistoryArbitrarySupportPolynomialRuntimeOutputAndCertificateBoundsProved": false,
        "leanWireHistoryArbitrarySupportRuntimeExecutionIsProofAuthority": false,
        "leanWireHistoryArbitrarySupportScope": "arbitrary-finite-source-extraction-closed-R5-R6-R8-history-derived-current-and-snapshot-causality-literal-one-copy-splice-all-ordered-outputs-complete-removal-charge-equation-no-additional-rejection-no-derived-terminal-family-global-route-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.extractTerminalSupport_causal_levels": {
          "hash": "123e68b3b62bd7450cceb874b37e9133aa7f5bef061c5fd3a7b86006ab209b36",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.extractTerminalSupport_causal_index": {
          "hash": "266f2d202c756ac3d535808efc7288371be039b7bd6f3334471a4eb4a09126dc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.CausalBound.physical_normalization_output_bound": {
          "hash": "a6fb41b87c15347278653ccabf0f339b0021e1ff7f00aaf2a6ae3593f5ff8ab8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDNormalizationCausalBounds"
        },
        "PNP.DirectWire.WireCarrier.normalize_causalBounds": {
          "hash": "62d2b55983b9459d9c8a4ec3729e24b6757e22aa464e831b36f780edc19534c0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalBounds"
        },
        "PNP.DirectWire.WireObligationRestoration.join_causalBounds": {
          "hash": "96a57b1e39fa62e703469131981a9464a954c6e6ef93a968c9363130492cdfef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.Transition.causalInvariant": {
          "hash": "5e8e6b3008a3ae5e6eae219e5642bd71496d4c78a6fe24cc00f06d8579bc25c1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.WireObligationHistory.Execution.causalInvariant": {
          "hash": "7eeda6beaebe55aefa689012673e7b2aad279c3a1f98270a8c045d149109de1d",
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
        "PNP.DirectWire.WireObligationHistory.compileHistory_causal_bounds": {
          "hash": "d85cb81dde3ff4b72e81c8fd56bbfd521031f13dc86cad93f30a84b5888f452e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryCausalBounds"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_causal_rank_decreases": {
          "hash": "401cb888e0fdd3fffd02d24c5f5a46d0ec23a3370a61e1c298b3efa086a83f1a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_wellFounded_of_causalInterfaceBound": {
          "hash": "47cf35847af614649c6e8f5d929c8447d2a3fcd036119a9cbdb98ca5f9a12e38",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.compile_of_causalInterfaceBound": {
          "hash": "66036c51abd18c65462094db35c49f463b6e40944fb0f40f06bc4ecdb9a63c79",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.extractedCarrier_gateCount": {
          "hash": "5b11e6ffa16f80744a224cc5fcaad6a3d2132ca68567e8e0a1b9aeda0e45eae2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.extractedCarrier_fieldValue": {
          "hash": "c4513e607a0d66901d00b788ed6c1884105fb8e2d8d6bc6d9c96df55583250c5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_equivalent": {
          "hash": "b949f2d62101de6687ded05b81d36f3b11b48ebdd722a7d69a8a2d4eb158124d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
        },
        "PNP.DirectWire.WireHistoryArbitrarySupport.closedHistory_causalInterfaceBound": {
          "hash": "bb37db6c982b6fc8e1a879a0c2c5e8a1669fec6d7939d8ff024b205dcd546903",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireHistoryArbitrarySupport"
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
    }
  ]
});
export const M264_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M264_BATCH.milestones.map(row => row.fields)));
export const M264_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M264_BATCH.milestones.map(row => row.theorems)));

export const M264_BATCH_SCOPE_SUFFIX = '+plus-' + M264_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM264BatchPublicationMap(map) {
  for (const expected of M264_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM264BatchStatus(status) {
  for (const expected of M264_BATCH.milestones) {
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

function assertM264BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M264_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM264BatchInventory(inventory) {
  assertM264BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M264_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m264BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M264_BATCH.batchId,
    reviewedSource: { ...M264_BATCH.reviewedSource },
    milestones: M264_BATCH.milestones.map(row => ({
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

export function assertM264BatchManifest(manifest) {
  const expected = m264BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM263M264;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:264}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:264}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M264_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM264BrowserDescriptor() {
  return '// M263-M264-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M263_M264_BATCH = Object.freeze(' + JSON.stringify(M264_BATCH, null, 2) + ');\n' +
    'const FORMAL_M263_M264_VALIDATORS = (() => {\n' +
    'const M264_BATCH = FORMAL_M263_M264_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM264BatchStatus, assertM264BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM264BatchStatus, inventory: assertM264BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M263-M264-BATCH-DESCRIPTOR:END';
}

export function assertM264BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M263-M264-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M263-M264-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM264BrowserDescriptor(),
    'browser', {number:264}, 'generated descriptor');
}
