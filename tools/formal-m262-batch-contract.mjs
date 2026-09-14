// Reviewed compiled evidence for the M259-M262 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M262_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m259-m262",
  "reviewedSource": {
    "commit": "c3d4d9a115a357b44ee8104d129ee15e3174ec7f",
    "tree": "7bd3bc5854b0307330e9e405b5857de658eba54e",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-14-262"
  },
  "milestones": [
    {
      "number": 259,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-259",
      "id": "wire-zero-unary-closure",
      "title": "Computed full-field zero/unary descent and normalization closure",
      "classification": "formalized-foundation-only",
      "scope": "For every finite computational wire carrier, M259 computes a whole-span zero/unary saving branch and combines it with the complete proper-support search. The whole-span branch selects all physical gates, has zero exterior charge and is kept distinct from proper-support R7. The combined carrier-only search is complete whenever any support with zero or one actual incoming boundary admits a strictly smaller equivalent complete local word; neither a support family nor a replacement or completeness certificate is supplied by the caller. Every accepted branch builds the actual smaller carrier and preserves all ordinary outputs and every computational field at every valuation, with exact original-gate accounting. A well-founded executable closure repeatedly performs physical normalization, searches for a proper or whole-span gain, expands an accepted gain and restarts normalization. Its derived trace proves termination, full-field preservation, common physical quiescence and absence of every gain in this scoped zero/unary class. It proves exact gate savings, bounds normalization and gain iterations by the retired gates, bounds search calls including the final negative call, and proves output idempotence. Semantic reference minima occur only in specifications: their invariance yields exact residual-slack retirement and corresponding iteration and search-call bounds, without reference-minimum enumeration in the algorithm.",
      "nonClaim": "The stopping result is restricted to physical normalization and zero/one-actual-boundary computational gains. It is not global minimality: a guarded physically quiescent common fixed point has an explicit smaller equivalent carrier and strictly positive global residual slack. Whole-span descent is not relabelled as a proper-support Package E certificate. Preserving every computational field does not reconstruct the full manuscript carrier, noncomputational profile fields or arbitrary obligation dependency DAGs. Wider boundaries, every R5-R8 interaction, all-trace N1-N10 normalization, complete Package E, global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and complete encoded-size polynomial runtime, output and certificate bounds remain open. A gate-decrease or search-call bound is not a total polynomial execution theorem; inherited extraction, compilation and candidate-search costs still require their own bounds. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireZeroUnaryClosureFormalized": true,
        "leanWireZeroUnaryClosureAxiomAuditPassed": true,
        "leanWireZeroUnaryClosureAuditedDeclarationCount": 27,
        "leanWireZeroUnaryClosureWholeSelectionTheorem": "PNP.DirectWire.WireZeroUnaryClosure.whole_selected",
        "leanWireZeroUnaryClosureWholeExteriorTheorem": "PNP.DirectWire.WireZeroUnaryClosure.whole_exterior",
        "leanWireZeroUnaryClosureWholeGateCountTheorem": "PNP.DirectWire.WireZeroUnaryClosure.whole_gateCount",
        "leanWireZeroUnaryClosureWholeNotProperTheorem": "PNP.DirectWire.WireZeroUnaryClosure.whole_not_proper",
        "leanWireZeroUnaryClosureZeroExteriorSelectionTheorem": "PNP.DirectWire.WireZeroUnaryClosure.all_gates_of_zero_exterior",
        "leanWireZeroUnaryClosureWholeGainCheckedTheorem": "PNP.DirectWire.WireZeroUnaryClosure.WholeGain.checked",
        "leanWireZeroUnaryClosureWholeRecognitionTheorem": "PNP.DirectWire.WireZeroUnaryClosure.wholeGain_isSome_iff",
        "leanWireZeroUnaryClosureWholeCompletenessTheorem": "PNP.DirectWire.WireZeroUnaryClosure.wholeGain_complete",
        "leanWireZeroUnaryClosureGainFullFieldTheorem": "PNP.DirectWire.WireZeroUnaryClosure.Gain.full_field",
        "leanWireZeroUnaryClosureGainBranchBoundaryTheorem": "PNP.DirectWire.WireZeroUnaryClosure.Gain.branch_boundary",
        "leanWireZeroUnaryClosureGainExactAccountingTheorem": "PNP.DirectWire.WireZeroUnaryClosure.Gain.exact_accounting",
        "leanWireZeroUnaryClosureCombinedRecognitionTheorem": "PNP.DirectWire.WireZeroUnaryClosure.nextGain_isSome_iff",
        "leanWireZeroUnaryClosureCombinedNoResultTheorem": "PNP.DirectWire.WireZeroUnaryClosure.nextGain_none_iff",
        "leanWireZeroUnaryClosureCombinedCompletenessTheorem": "PNP.DirectWire.WireZeroUnaryClosure.nextGain_complete",
        "leanWireZeroUnaryClosureCombinedNoGainExclusionTheorem": "PNP.DirectWire.WireZeroUnaryClosure.nextGain_none_excludes",
        "leanWireZeroUnaryClosureNormalizationAccountingTheorem": "PNP.DirectWire.WireZeroUnaryClosure.normalization_accounting",
        "leanWireZeroUnaryClosureNormalizationIterationBoundTheorem": "PNP.DirectWire.WireZeroUnaryClosure.normalization_iterations",
        "leanWireZeroUnaryClosureTraceCheckedTheorem": "PNP.DirectWire.WireZeroUnaryClosure.Trace.checked",
        "leanWireZeroUnaryClosureTraceSearchCallBoundTheorem": "PNP.DirectWire.WireZeroUnaryClosure.Trace.searchCalls_le",
        "leanWireZeroUnaryClosureClosureCheckedTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_checked",
        "leanWireZeroUnaryClosureStoppedClosureTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_of_stopped",
        "leanWireZeroUnaryClosureClosureIdempotenceTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_idempotent",
        "leanWireZeroUnaryClosureScopedTerminalNoGainTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_no_smaller_zeroUnary",
        "leanWireZeroUnaryClosureReferenceMinimumInvarianceTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_referenceMinimum",
        "leanWireZeroUnaryClosureResidualSlackAccountingTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_residualSlack",
        "leanWireZeroUnaryClosureResidualSlackIterationBoundTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_gainIterations_le_residualSlack",
        "leanWireZeroUnaryClosureResidualSlackSearchCallBoundTheorem": "PNP.DirectWire.WireZeroUnaryClosure.run_searchCalls_le_residualSlack",
        "leanWireZeroUnaryClosureWholeSpanBranchDerived": true,
        "leanWireZeroUnaryClosureProperAndWholeZeroUnaryCompletenessProved": true,
        "leanWireZeroUnaryClosureActualGainRestartClosureProved": true,
        "leanWireZeroUnaryClosureFullComputationalFieldPreservationProved": true,
        "leanWireZeroUnaryClosureCommonPhysicalAndScopedQuiescenceProved": true,
        "leanWireZeroUnaryClosureExactGateAndResidualSlackAccountingProved": true,
        "leanWireZeroUnaryClosureIdempotenceProved": true,
        "leanWireZeroUnaryClosureCallerSuppliedFamilyRequired": false,
        "leanWireZeroUnaryClosureReferenceMinimumUsedInExecution": false,
        "leanWireZeroUnaryClosureAllBoundaryWidthsCovered": false,
        "leanWireZeroUnaryClosureNoResultProvesGlobalMinimality": false,
        "leanWireZeroUnaryClosureArbitraryObligationDAGsCovered": false,
        "leanWireZeroUnaryClosureFullManuscriptCarrierProved": false,
        "leanWireZeroUnaryClosureCompleteObligationCalculusProved": false,
        "leanWireZeroUnaryClosureCompletePackageEProved": false,
        "leanWireZeroUnaryClosurePolynomialRuntimeProved": false,
        "leanWireZeroUnaryClosureScope": "all-finite-computational-wire-derived-proper-and-whole-zero-or-one-actual-boundary-search-full-field-gain-normalization-restart-closure-common-scoped-quiescence-idempotence-exact-gate-and-residual-slack-accounting-no-global-minimum-or-total-encoded-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireZeroUnaryClosure.whole_selected": {
          "hash": "627ed2af0a291160959dfdfdffef55c50e37a7cfd105a90ad442f14a6a3316b3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.whole_exterior": {
          "hash": "7708c145c0c2744c9e1ffad5ae437c6cbb5c3c25e41106882e907d314f02920a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.whole_gateCount": {
          "hash": "8ba65817e6cd4204b11dea40084855a5d206734a7936074da29009a21e5b89dd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.whole_not_proper": {
          "hash": "9261edea78fb386bb0d9f2a27d289ee811466240faabeac73edd53b304e252b1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.all_gates_of_zero_exterior": {
          "hash": "f6e0a6a8c942babe9a6c4a2c122847d9c0cb579c0a95f39cf641d0ed35ee8c8c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.WholeGain.checked": {
          "hash": "49101e38b6bd44729b79970b09a8dbbbdbb9f08e2ab737bed58fd85c6899343e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.wholeGain_isSome_iff": {
          "hash": "b076fb85cd52e4ef7e1c9912fafea8239292188b40c94d3a0be83f5f6c258170",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.wholeGain_complete": {
          "hash": "4a1e1926b4822cac53144d8eeb605e573a784bd563d1693c57365923dfada977",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.Gain.full_field": {
          "hash": "6ca0493b38ac572fb200f5f755a2c0d8f66335b2bd1c0c7e21ec0930cfd8986f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.Gain.branch_boundary": {
          "hash": "304254a14f540976f80afefa4e1a04b95dd2faecb6793057552f47cd6a4d6248",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.Gain.exact_accounting": {
          "hash": "a2292c1a2c0688d37e617bac3347667c187b65179ada4da9a5d042367ab3266a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.nextGain_isSome_iff": {
          "hash": "c290308e2dd1315e8681c2a7cb6f2eb9435d84a201da37b9e4d1056e9c78b1f5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.nextGain_none_iff": {
          "hash": "5fe27147e0c3bf33ad3565f8263260e91fc515a107e54ff61c19cb25ff828977",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.nextGain_complete": {
          "hash": "46f73860393736f9c448a7da052e81f1d28a55a5ab2eb0df6de72899583e5c1a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.nextGain_none_excludes": {
          "hash": "03ff2bbcd0acd7ec0490130890ff65f1f080370b54cf1ee7f463d1ada3133ed5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.normalization_accounting": {
          "hash": "2819cb214714b32bb4ff397ce796ce0eec804851fccd8c00888ef435db0d8acc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.normalization_iterations": {
          "hash": "a51bb1c4dc17ff26218541339352535154dc686b8abe9dde6eedc6af47db80a2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.Trace.checked": {
          "hash": "1335284c1871dddfc16326dd24c100b5295b995f1ff0824f9dcdcc2b86ece17d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.Trace.searchCalls_le": {
          "hash": "effa524e072458b489d5b0b63bfbfda80c6ed36bef9c994bab20b55abc2bcf92",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_checked": {
          "hash": "40d101b370ac4db92988e9f7afd0bf2a89659d9dbd499239541267967eb40336",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_of_stopped": {
          "hash": "07f7ad369df6552ab65d2df57f78e12b768199d8305db05e17803ca7d961c981",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_idempotent": {
          "hash": "87532d20fc451bed56d7de417756ab0bfacf20cbff130e1b7a311fbb1ff52f27",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_no_smaller_zeroUnary": {
          "hash": "27f009d236e975d9363719387fae52b4fbbdd9eca95c1002415364b40839a8b9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_referenceMinimum": {
          "hash": "b0f2d9158f66326d240a45af3878debf5f3887af50f584972921fa58958b7c72",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_residualSlack": {
          "hash": "264c9273a5c13179bd7c8a454ed997ba20671e6349811d5c55e19874c93c996f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_gainIterations_le_residualSlack": {
          "hash": "8011c9319b179a0b46b5cb0a0685c77d3adecbda8068bd8cba6b34cf6b887a5f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
        },
        "PNP.DirectWire.WireZeroUnaryClosure.run_searchCalls_le_residualSlack": {
          "hash": "e70efefdebc4db243493e6e6a5eb3309cf1205d93cc92486ebab313842372cc9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireZeroUnaryClosure"
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
      "number": 260,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-260",
      "id": "source-bounded-physical-boundary",
      "title": "Source-bounded ordered physical boundary extraction",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite program dimensions and any list of terminal primitive records, M260 computes the incoming physical boundary from nonconstant sources of actual gates. It filters those occurrences with the existing physical crossing predicate, removes duplicates and sorts by the canonical primary-input-before-gate-output coordinate. Every boundary crossing is derived from an actual gate source. The resulting list is proved exactly equal, including order and multiplicity, to the former ambient-wire filtered reference. Source occurrences and the emitted boundary each have length at most twice the physical gate count, independent of unused declared input slots. The active terminalBoundaryPorts implementation uses this source-driven construction. Public reference, length, duplicate-free and order theorems preserve the existing physical extraction and downstream support interfaces. A generic finite-list canonicalizer proves exact equality with any ordered duplicate-free reference under an injective coordinate map, without enumerating the ambient type. Guarded execution exercises exact small reference lists and sparse programs with a billion declared inputs; those large fixtures do not execute the ambient reference.",
      "nonClaim": "Occurrence and output bounds are structural size bounds, not total encoded-input-size polynomial execution theorems. The reference equality preserves the existing physical semantics; it does not establish a new global minimization result. The old ambient enumeration remains only as a theorem-side specification, never the active boundary implementation. No caller-supplied boundary or completeness certificate is introduced. The full manuscript carrier, arbitrary obligation dependency DAGs, every normalization and gain interaction, complete Package E and global route coverage remain open. These results do not prove unconditional SaturatePositive, BCELReady or ZeroSlack, exact general PCCMin, or total polynomial runtime, output and certificate bounds for the complete construction. Runtime execution is regression evidence, not theorem authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanSourceBoundedPhysicalBoundaryFormalized": true,
        "leanSourceBoundedPhysicalBoundaryAxiomAuditPassed": true,
        "leanSourceBoundedPhysicalBoundaryAuditedDeclarationCount": 23,
        "leanSourceBoundedPhysicalBoundaryUniqueMembershipTheorem": "PNP.DirectWire.SourceListOrder.mem_unique",
        "leanSourceBoundedPhysicalBoundaryUniqueNoDuplicatesTheorem": "PNP.DirectWire.SourceListOrder.unique_nodup",
        "leanSourceBoundedPhysicalBoundaryUniqueLengthBoundTheorem": "PNP.DirectWire.SourceListOrder.unique_length_le",
        "leanSourceBoundedPhysicalBoundaryCanonicalMembershipTheorem": "PNP.DirectWire.SourceListOrder.mem_canonical",
        "leanSourceBoundedPhysicalBoundaryCanonicalNoDuplicatesTheorem": "PNP.DirectWire.SourceListOrder.canonical_nodup",
        "leanSourceBoundedPhysicalBoundaryCanonicalLengthBoundTheorem": "PNP.DirectWire.SourceListOrder.canonical_length_le",
        "leanSourceBoundedPhysicalBoundaryCanonicalOrderTheorem": "PNP.DirectWire.SourceListOrder.canonical_ordered",
        "leanSourceBoundedPhysicalBoundaryOrderedReferenceUniquenessTheorem": "PNP.DirectWire.SourceListOrder.ordered_eq_of_mem",
        "leanSourceBoundedPhysicalBoundaryCanonicalReferenceTheorem": "PNP.DirectWire.SourceListOrder.canonical_eq_reference",
        "leanSourceBoundedPhysicalBoundaryCoordinateInjectivityTheorem": "PNP.DirectWire.TerminalSupportWire.orderCode_injective",
        "leanSourceBoundedPhysicalBoundaryAmbientReferenceOrderTheorem": "PNP.DirectWire.allTerminalSupportWires_strictOrder",
        "leanSourceBoundedPhysicalBoundarySourceOccurrenceMembershipTheorem": "PNP.DirectWire.Source.mem_terminalWireOccurrences_iff",
        "leanSourceBoundedPhysicalBoundarySourceOccurrenceBoundTheorem": "PNP.DirectWire.Source.terminalWireOccurrences_length",
        "leanSourceBoundedPhysicalBoundaryProgramOccurrenceBoundTheorem": "PNP.DirectWire.terminalSourceWireOccurrences_length",
        "leanSourceBoundedPhysicalBoundaryCrossingSourceCompletenessTheorem": "PNP.DirectWire.terminalBoundaryWire_mem_sourceOccurrences",
        "leanSourceBoundedPhysicalBoundarySourceDrivenReferenceTheorem": "PNP.DirectWire.terminalBoundaryPortsSourceDriven_eq_reference",
        "leanSourceBoundedPhysicalBoundarySourceDrivenLengthBoundTheorem": "PNP.DirectWire.terminalBoundaryPortsSourceDriven_length",
        "leanSourceBoundedPhysicalBoundarySourceDrivenNoDuplicatesTheorem": "PNP.DirectWire.terminalBoundaryPortsSourceDriven_nodup",
        "leanSourceBoundedPhysicalBoundarySourceDrivenOrderTheorem": "PNP.DirectWire.terminalBoundaryPortsSourceDriven_ordered",
        "leanSourceBoundedPhysicalBoundaryActiveReferenceTheorem": "PNP.DirectWire.terminalBoundaryPorts_reference",
        "leanSourceBoundedPhysicalBoundaryActiveLengthBoundTheorem": "PNP.DirectWire.terminalBoundaryPorts_length",
        "leanSourceBoundedPhysicalBoundaryActiveNoDuplicatesTheorem": "PNP.DirectWire.terminalBoundaryPorts_nodup",
        "leanSourceBoundedPhysicalBoundaryActiveOrderTheorem": "PNP.DirectWire.terminalBoundaryPorts_ordered",
        "leanSourceBoundedPhysicalBoundaryActualGateSourceOccurrencesDerived": true,
        "leanSourceBoundedPhysicalBoundaryExactOrderedReferenceEqualityProved": true,
        "leanSourceBoundedPhysicalBoundaryOccurrenceAndBoundaryLengthBoundsProved": true,
        "leanSourceBoundedPhysicalBoundaryDuplicateFreeCanonicalOrderProved": true,
        "leanSourceBoundedPhysicalBoundaryActiveExtractorUsesSourceOccurrences": true,
        "leanSourceBoundedPhysicalBoundaryExistingPhysicalInterfacesPreserved": true,
        "leanSourceBoundedPhysicalBoundaryUnusedInputEnumerationRequired": false,
        "leanSourceBoundedPhysicalBoundaryCallerSuppliedBoundaryRequired": false,
        "leanSourceBoundedPhysicalBoundaryCallerSuppliedCompletenessRequired": false,
        "leanSourceBoundedPhysicalBoundaryRuntimeExecutionIsProofAuthority": false,
        "leanSourceBoundedPhysicalBoundaryFullManuscriptCarrierProved": false,
        "leanSourceBoundedPhysicalBoundaryCompleteObligationCalculusProved": false,
        "leanSourceBoundedPhysicalBoundaryCompletePackageEProved": false,
        "leanSourceBoundedPhysicalBoundaryGlobalMinimalityProved": false,
        "leanSourceBoundedPhysicalBoundaryPolynomialRuntimeProved": false,
        "leanSourceBoundedPhysicalBoundaryScope": "all-finite-program-dimensions-actual-gate-source-derived-physical-crossings-exact-ordered-ambient-reference-equality-duplicate-free-canonical-order-twice-gate-count-occurrence-and-boundary-bounds-active-extraction-no-unused-input-scan-or-total-encoded-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.SourceListOrder.mem_unique": {
          "hash": "7a49dd95817c0455891c81ec6ed64a3c2a85b5781329a7679db339569689ed68",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.unique_nodup": {
          "hash": "fdb6af13cee2da15e3a1bf9db99b9e84632ea80f4d365237d4afc0eaf13c8505",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.unique_length_le": {
          "hash": "b2aeba847545c7ed287ff77c5c6333cf7d02493e92f4ac7aeda9364ac8e86260",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.mem_canonical": {
          "hash": "dca5768a25f190fc4611cb1e2054e6141a42e4f0e226eb0d7eceaba7f6629c85",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.canonical_nodup": {
          "hash": "efa8dd491c242ec16a53d9e5bd3d04b51848b13cc07975f9a4ba330bd7f21586",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.canonical_length_le": {
          "hash": "f84d3b5d18c0db478a3823e93af8fa9f6e4e5f29882d12965770cf7ae356f2ad",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.canonical_ordered": {
          "hash": "69011b5c2c4adac5ef23fcb94e92f461ad000e1caebe690499e4d85793d80f1e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.ordered_eq_of_mem": {
          "hash": "030006421cdf64692885e8d0413aca2328d1c0abe95581d510690e07f498138c",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.SourceListOrder.canonical_eq_reference": {
          "hash": "0f99873639e837a33d8fd74e57f65fc63f8250e4cf40652588b6d54a8daf8a33",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDSourceListOrder"
        },
        "PNP.DirectWire.TerminalSupportWire.orderCode_injective": {
          "hash": "c14e48f0535f611e3de7a1bbd5af9f321918215e5da69823c3c986360231b4a2",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.allTerminalSupportWires_strictOrder": {
          "hash": "75ca4fb846a495969bed16586007970e011e9c5d3ff81d59243e82acf0c02c3c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.Source.mem_terminalWireOccurrences_iff": {
          "hash": "f31f5bdd51cc3289dc4cd9eac239a507cb73353f3add38f60ae741e1f676a3e5",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.Source.terminalWireOccurrences_length": {
          "hash": "4480ea986948d9dc413b1b5681dc0f03a32f2537bf3404fb42106ed271bef8b4",
          "axioms": [],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalSourceWireOccurrences_length": {
          "hash": "5d9dcd82ddcf9b34ac1fcf7032b8ec57e1a79dac9eef18cbbf8eabd267a83169",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryWire_mem_sourceOccurrences": {
          "hash": "90451eea87b5af9e66066b0508f3933a7dcccf79c130391e2be031ad8337df68",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPortsSourceDriven_eq_reference": {
          "hash": "65d0debd44a86f70d7febae2421a6526bd5c56eb7a5b64cc0775b6af76c07930",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPortsSourceDriven_length": {
          "hash": "7ec44311f450db96fe5a40e401c6650f4e6bec4df250ab0e1d3e613b22bf3e80",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPortsSourceDriven_nodup": {
          "hash": "7e5fa7bbee7ccfaaf40761dafdcc3dac3d64b12c0af6ad1b24a483a94b7a7044",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPortsSourceDriven_ordered": {
          "hash": "547ca82d8d21213fe160f9f3284932a60032de7cf82d6dc0d6adf33cff17ea77",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPorts_reference": {
          "hash": "6833f172589ae02ed7b73f6853916e7101f12ed7adfe923272f648221736fe4a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPorts_length": {
          "hash": "ba62c4628cd68cb6bbbc0abb968f00d067f305738395d8e13378aaceabad89b1",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPorts_nodup": {
          "hash": "9d59decf9fe49a6f8553d10b327e375c3f91c53879545748a5bdba607a146ee6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
        },
        "PNP.DirectWire.terminalBoundaryPorts_ordered": {
          "hash": "c38618e05bb7e55cc5a952be125f3d089f7057336d3b0f981c5648e8c5eacd58",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSupportCompletion"
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
      "number": 261,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-14-261",
      "id": "context-aware-square-transport",
      "title": "Context-aware nested open-support and four-corner transport",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite candidate dimensions, terminal record lists and ordinary selected-gate inclusions, M261 computes a smaller open boundary valuation from the larger support evaluator. A wire internalized in the larger support receives its computed gate value, not an independent ambient bit. For every valuation on the larger open boundary, selected gates and retained interface producers have exactly the same Boolean values after this substitution. The complete valuation maps satisfy identity and three-support composition. Actual support-square inclusions derive the four leg maps, and both join-to-meet paths agree as valuation functions. Retained output values agree for extracted implementations, arbitrary valid full realizations and the actual canonical full and quotient local-minimum families. These semantic maps come from the original open carrier, not invented internal gates of a minimum realization. The existing unconstrained-ambient coherence classifier and its exact mismatch results are preserved as a different relation.",
      "nonClaim": "The theorem covers arbitrary larger open-boundary valuations, not only whole-circuit executions, and introduces no caller-supplied transport or correctness certificate. Retained Boolean-output transport does not prove equality of arbitrary implementation-dependent observers or profiles, physically glue minimum circuits, or establish coherent charge and obligation ownership. Canonical finite reference minima supply specification-level comparison objects, not an efficient executable minimizer. The full manuscript carrier, arbitrary obligation dependency DAGs, complete Package E and global route coverage remain open. This result does not prove unconditional SaturatePositive, BCELReady or ZeroSlack, exact general PCCMin, or total encoded-input-size polynomial runtime, output and certificate bounds for the complete construction. Runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanContextAwareSquareTransportFormalized": true,
        "leanContextAwareSquareTransportAxiomAuditPassed": true,
        "leanContextAwareSquareTransportAuditedDeclarationCount": 14,
        "leanContextAwareSquareTransportSelectedGateSemanticsTheorem": "PNP.DirectWire.terminalOpenGateEvaluation_pullback",
        "leanContextAwareSquareTransportRetainedInterfaceSemanticsTheorem": "PNP.DirectWire.terminalOpenSupportSemantics_pullback",
        "leanContextAwareSquareTransportIdentityTheorem": "PNP.DirectWire.terminalBoundaryPullback_identity",
        "leanContextAwareSquareTransportCompositionTheorem": "PNP.DirectWire.terminalBoundaryPullback_compose",
        "leanContextAwareSquareTransportSquareLegGateInclusionTheorem": "PNP.DirectWire.TerminalOptimumLegTransport.selectedGateTransport",
        "leanContextAwareSquareTransportLeftPathTheorem": "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_meet_join_left",
        "leanContextAwareSquareTransportRightPathTheorem": "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_meet_join_right",
        "leanContextAwareSquareTransportSquarePathEqualityTheorem": "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_square",
        "leanContextAwareSquareTransportExtractedRetainedSemanticsTheorem": "PNP.DirectWire.TerminalOptimumLegTransport.extracted_retained_semantics",
        "leanContextAwareSquareTransportRealizationRetainedSemanticsTheorem": "PNP.DirectWire.TerminalOptimumLegTransport.realization_retained_semantics",
        "leanContextAwareSquareTransportFullFamilyRetainedSemanticsTheorem": "PNP.DirectWire.TerminalFourCornerOptimumFamily.full_retained_semantics",
        "leanContextAwareSquareTransportQuotientFamilyRetainedSemanticsTheorem": "PNP.DirectWire.TerminalFourCornerOptimumFamily.quotient_retained_semantics",
        "leanContextAwareSquareTransportCanonicalFullRetainedSemanticsTheorem": "PNP.DirectWire.TerminalFourCornerCarrier.canonicalFull_retained_semantics",
        "leanContextAwareSquareTransportCanonicalQuotientRetainedSemanticsTheorem": "PNP.DirectWire.TerminalFourCornerCarrier.canonicalQuotient_retained_semantics",
        "leanContextAwareSquareTransportComputedBoundaryPullbackDerived": true,
        "leanContextAwareSquareTransportArbitraryOpenValuationsCovered": true,
        "leanContextAwareSquareTransportInternalizedWireValuesComputed": true,
        "leanContextAwareSquareTransportSelectedGateAndInterfaceSemanticsProved": true,
        "leanContextAwareSquareTransportIdentityAndCompositionProved": true,
        "leanContextAwareSquareTransportSquareLegMapsDerived": true,
        "leanContextAwareSquareTransportTwoPathValuationEqualityProved": true,
        "leanContextAwareSquareTransportRetainedRealizerOutputsProved": true,
        "leanContextAwareSquareTransportCanonicalFullAndQuotientComparisonProved": true,
        "leanContextAwareSquareTransportExistingAmbientClassifierPreserved": true,
        "leanContextAwareSquareTransportCallerSuppliedTransportRequired": false,
        "leanContextAwareSquareTransportCallerSuppliedCorrectnessRequired": false,
        "leanContextAwareSquareTransportWholeCircuitValuationsOnly": false,
        "leanContextAwareSquareTransportArbitraryObserverEqualityProved": false,
        "leanContextAwareSquareTransportPhysicalMinimumGluingProved": false,
        "leanContextAwareSquareTransportChargeAndObligationOwnershipProved": false,
        "leanContextAwareSquareTransportFullManuscriptCarrierProved": false,
        "leanContextAwareSquareTransportCompleteObligationCalculusProved": false,
        "leanContextAwareSquareTransportCompletePackageEProved": false,
        "leanContextAwareSquareTransportGlobalRouteCoverageProved": false,
        "leanContextAwareSquareTransportUnconditionalZeroSlackProved": false,
        "leanContextAwareSquareTransportExactGeneralPCCMinProved": false,
        "leanContextAwareSquareTransportPolynomialRuntimeProved": false,
        "leanContextAwareSquareTransportRuntimeExecutionIsProofAuthority": false,
        "leanContextAwareSquareTransportScope": "arbitrary-finite-nested-supports-all-open-boundary-valuations-computed-internalized-wire-substitution-selected-gate-and-interface-preservation-identity-composition-four-corner-path-equality-retained-full-and-quotient-realizer-outputs-no-arbitrary-observer-equality-or-charge-gluing-or-global-runtime"
      },
      "theorems": {
        "PNP.DirectWire.terminalOpenGateEvaluation_pullback": {
          "hash": "35b9c3d02da43f951376e48ccd7d5ba97539be554d23a9d7dddff9cbefae8526",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalOpenSupportSemantics_pullback": {
          "hash": "8d84b0ca652c271d873986c35aeb5421bd37dd88fad0fae2cd7de521824ec1a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalBoundaryPullback_identity": {
          "hash": "71783e1a89e5a590fa9092e9c4af7f9cc28182317428be2530ca32cca13d93d0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalBoundaryPullback_compose": {
          "hash": "e63b7f727d763163014f598b5e4f10b70938b885228aa7092f60f06924fb1f1e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.TerminalOptimumLegTransport.selectedGateTransport": {
          "hash": "393bcf57ffe9063520828c2e67f1216fd79cd810ae5867e3d961c81f278cba5e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_meet_join_left": {
          "hash": "5f87fc82783c695cee293545700beacaddf310b740f32262449887be9a438eed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_meet_join_right": {
          "hash": "114556b3dc918cb2593f4df380a0dd47df7bc85d14e16d30602810c6466453dc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerCarrier.boundaryPullback_square": {
          "hash": "97f9a8f9208f99f55767cb101eda981fdc64d1dfa0345277fa0a34209ec247ad",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalOptimumLegTransport.extracted_retained_semantics": {
          "hash": "4fd1fe7a44bec0d3dfc5b1cfe2bf20ff2e70c0e877feee6b196e6a39faaba6d3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalOptimumLegTransport.realization_retained_semantics": {
          "hash": "f68469c854249882dcdb32bf48257c27581d289dc7a7efc323a4ac3025707f70",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerOptimumFamily.full_retained_semantics": {
          "hash": "3c817f60b6078fc084d819793d47f4c1d1f8625c85540628c45d8089e71faf05",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerOptimumFamily.quotient_retained_semantics": {
          "hash": "11e22a080e7420cc7e6c10c2f6558588bb79bd9274bf7dacccbfba817e30f6d8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerCarrier.canonicalFull_retained_semantics": {
          "hash": "de03dff609d419f5ecc843e92ca627d0430f1407413e8722a16d0679a6fdeb13",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
        },
        "PNP.DirectWire.TerminalFourCornerCarrier.canonicalQuotient_retained_semantics": {
          "hash": "a8bcb2bb6dc0154959d37c2fdcb67eb451eea01759caa939b8072996811253d3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalFourCornerOpenTransport"
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
      "number": 262,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-14-262",
      "id": "wire-causal-expansion",
      "title": "Total source-ordered charged arbitrary-support expansion",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite candidate, support, replacement and computational-field dimensions, M262 derives an actual acyclic raw NAND graph and executable compiled expansion from source data. Each exterior gate is retained once and each distinct retained physical interface producer owns one complete replacement copy. Primary and earlier gate boundary ports retain actual values; only later gate-valued ports are deliberately masked, and a computed source rank decreases along every actual edge. Compilation requires no supplied rank, order, semantic or compiler-success certificate. Under complete local open-function equality, masking preserves the selected output for every open boundary valuation, the derived graph valuation satisfies every NAND equation, and every original ordered output and computational field retains its full value. Repeated literal references share the same actual compiled source. Exterior and copy ownership are injective and disjoint and cover every emitted gate. Existing R5 creations retain their coordinate and original full source value. Actual cost is E + K * R and strict original-size saving is equivalent to K * R < S, with properness S < G separately required.",
      "nonClaim": "This is a source-derived physical construction at arbitrary finite widths, not matched-kappa Pull/Expand or unrestricted CompatibleReplacement/SlackLaw from merely R < S. Full local open-function agreement is required for semantics; quotient-only or ordinary-output-only equality does not suffice for full computational fields. Distinct equal-valued physical producers are not merged, and repeated physical copies are not free. The inherited cyclic literal splice remains rejected; existing cone and unary constructions retain their own bounds. Literal R5 binding transport is not the complete R5–R8 event calculus or an arbitrary semantic obligation DAG. Arbitrary implementation-dependent observers, profile histories, the full manuscript carrier, complete Package E, global route coverage, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and total encoded-input-size polynomial runtime, output and certificate bounds remain open. Runtime fixtures are regression evidence, not proof authority. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireCausalExpansionFormalized": true,
        "leanWireCausalExpansionAxiomAuditPassed": true,
        "leanWireCausalExpansionAuditedDeclarationCount": 29,
        "leanWireCausalExpansionRankDecreaseTheorem": "PNP.DirectWire.WireCausalExpansion.graph_rank_decreases",
        "leanWireCausalExpansionGraphWellFoundedTheorem": "PNP.DirectWire.WireCausalExpansion.graph_wellFounded",
        "leanWireCausalExpansionCompileSuccessTheorem": "PNP.DirectWire.WireCausalExpansion.compile_success",
        "leanWireCausalExpansionCompiledResultTheorem": "PNP.DirectWire.WireCausalExpansion.compiled_spec",
        "leanWireCausalExpansionPhysicalGateCountTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_gateCount",
        "leanWireCausalExpansionAllOpenMaskedOutputTheorem": "PNP.DirectWire.WireCausalExpansion.masked_replacement_output",
        "leanWireCausalExpansionReplacementSourceValueTheorem": "PNP.DirectWire.WireCausalExpansion.replacementSource_eval",
        "leanWireCausalExpansionOriginalSourceValueTheorem": "PNP.DirectWire.WireCausalExpansion.originalSource_eval",
        "leanWireCausalExpansionGraphSolutionTheorem": "PNP.DirectWire.WireCausalExpansion.values_solution",
        "leanWireCausalExpansionOrderedOutputSemanticsTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_semantics",
        "leanWireCausalExpansionPaidSavingIffTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_smaller_iff",
        "leanWireCausalExpansionSingleInterfaceSavingTheorem": "PNP.DirectWire.WireCausalExpansion.single_interface_smaller",
        "leanWireCausalExpansionInterfaceNoDuplicatesTheorem": "PNP.DirectWire.WireCausalExpansion.interface_nodup",
        "leanWireCausalExpansionPhysicalProducerIdentityTheorem": "PNP.DirectWire.WireCausalExpansion.interface_owner_injective",
        "leanWireCausalExpansionExteriorOwnershipTheorem": "PNP.DirectWire.WireCausalExpansion.exteriorPosition_injective",
        "leanWireCausalExpansionCopyOwnershipTheorem": "PNP.DirectWire.WireCausalExpansion.copyPosition_injective",
        "leanWireCausalExpansionDisjointOwnershipTheorem": "PNP.DirectWire.WireCausalExpansion.exteriorPosition_ne_copyPosition",
        "leanWireCausalExpansionRawOwnershipCoverageTheorem": "PNP.DirectWire.WireCausalExpansion.raw_node_ownership",
        "leanWireCausalExpansionEmittedOwnershipCoverageTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_gate_ownership",
        "leanWireCausalExpansionActualOutputSourceTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_source",
        "leanWireCausalExpansionLiteralOutputSharingTheorem": "PNP.DirectWire.WireCausalExpansion.expanded_source_equal",
        "leanWireCausalExpansionCarrierOutputTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_output",
        "leanWireCausalExpansionCarrierFieldTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_field",
        "leanWireCausalExpansionCarrierPhysicalGateCountTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_gateCount",
        "leanWireCausalExpansionCarrierPaidSavingIffTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_smaller_iff",
        "leanWireCausalExpansionProperAndPaidSavingTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_proper_and_smaller",
        "leanWireCausalExpansionLiteralFieldSharingTheorem": "PNP.DirectWire.WireCausalExpansion.expandedCarrier_source_equal",
        "leanWireCausalExpansionR5CoordinateTheorem": "PNP.DirectWire.WireCausalExpansion.expandedR5Creation_coordinate",
        "leanWireCausalExpansionR5OriginalFullSourceTheorem": "PNP.DirectWire.WireCausalExpansion.expandedR5Creation_fullWitness",
        "leanWireCausalExpansionArbitrarySupportAndBoundaryWidthsCovered": true,
        "leanWireCausalExpansionSourceDerivedRankProved": true,
        "leanWireCausalExpansionUnconditionalCompilationProved": true,
        "leanWireCausalExpansionCompleteOpenMaskSemanticsProved": true,
        "leanWireCausalExpansionEveryOrderedOutputPreservedUnderFullAgreement": true,
        "leanWireCausalExpansionEveryComputationalFieldPreservedUnderFullAgreement": true,
        "leanWireCausalExpansionUniquePhysicalCopyOwnershipProved": true,
        "leanWireCausalExpansionEveryEmittedGateOwned": true,
        "leanWireCausalExpansionLiteralRepeatedSourceSharingProved": true,
        "leanWireCausalExpansionOriginalR5CoordinateAndFullValueTransportProved": true,
        "leanWireCausalExpansionExactExteriorPlusCopiesGateCountProved": true,
        "leanWireCausalExpansionPaidSavingIffProved": true,
        "leanWireCausalExpansionPropernessSeparate": true,
        "leanWireCausalExpansionExistingLiteralCompilerPreserved": true,
        "leanWireCausalExpansionCallerSuppliedRankRequired": false,
        "leanWireCausalExpansionCallerSuppliedCompilerSuccessRequired": false,
        "leanWireCausalExpansionCallerSuppliedFinalSemanticsRequired": false,
        "leanWireCausalExpansionSemanticsWithoutLocalAgreementProved": false,
        "leanWireCausalExpansionWholeCircuitValuationsOnly": false,
        "leanWireCausalExpansionQuotientOnlyFieldAgreementSufficient": false,
        "leanWireCausalExpansionUnpaidLocalSavingTransportProved": false,
        "leanWireCausalExpansionMatchedKappaPullExpandProved": false,
        "leanWireCausalExpansionArbitraryObserverEqualityProved": false,
        "leanWireCausalExpansionFullManuscriptCarrierProved": false,
        "leanWireCausalExpansionCompleteObligationCalculusProved": false,
        "leanWireCausalExpansionCompletePackageEProved": false,
        "leanWireCausalExpansionGlobalRouteCoverageProved": false,
        "leanWireCausalExpansionUnconditionalSaturatePositiveProved": false,
        "leanWireCausalExpansionUnconditionalBCELReadyProved": false,
        "leanWireCausalExpansionUnconditionalZeroSlackProved": false,
        "leanWireCausalExpansionExactGeneralPCCMinProved": false,
        "leanWireCausalExpansionPolynomialRuntimeProved": false,
        "leanWireCausalExpansionRuntimeExecutionIsProofAuthority": false,
        "leanWireCausalExpansionScope": "arbitrary-finite-computational-supports-and-boundary-widths-source-derived-rank-total-causal-physical-expansion-all-open-mask-semantics-under-full-local-agreement-all-outputs-and-full-fields-exact-exterior-plus-producer-copies-unique-complete-ownership-literal-sharing-original-R5-source-transport-paid-saving-iff-no-matched-kappa-global-route-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireCausalExpansion.graph_rank_decreases": {
          "hash": "57644abb11a3b3a89770af0bff4b95d4a4fb6fe89c95b7597c680d636dd64784",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.graph_wellFounded": {
          "hash": "4f5418492f37d279d5f263f809691860e3b09a5d40a7d19b812c05d33c167477",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.compile_success": {
          "hash": "4411fb4ee3c71709b0374fdd9c5af36d12d6796c5bad2dbba107eeb5fef85e3b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.compiled_spec": {
          "hash": "aaf6be59c4f88a7fead74673109d28700ce16820dd0f9ad83cf42c7f2fda507b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_gateCount": {
          "hash": "758d28d24a55d457119e6ae98f54798de7f173d5c9802e4df7ee95561bdc3209",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.masked_replacement_output": {
          "hash": "498f6fec12401d5e8a6ac437fba202351b12399567e9591ba6fc224cdc04e27a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.replacementSource_eval": {
          "hash": "1ed6dee331e6062b34c11d9ee8a6abba3113b0043e50f7ad7061af1d9a49fbc3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.originalSource_eval": {
          "hash": "7c2f1c2c8a2be86a7e09aec3d634c6f5c6e1786b93fe7b491d1795a48fa7d7f0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.values_solution": {
          "hash": "9ce5f997c23c4cdd4fa5eb1b0421d8891f4763b1e9e7045aeedbc5215579a0d8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_semantics": {
          "hash": "d6ab0ab4c6510402f806592b8888b9da2c0ee6edc88632c3ed61924e7b7b838d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_smaller_iff": {
          "hash": "b8d6d37e0936f1464d863e28cad33536118657cc8b900e6978a45c7bbc2fa0a7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.single_interface_smaller": {
          "hash": "c9b50726136c91ec59b2a341172622351e1e37c05b9b7a9b865e467dac95e739",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.interface_nodup": {
          "hash": "9d06c6bbc391a4a17d0a10bb418e085458cf36654d08be9efff05237037c29d9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.interface_owner_injective": {
          "hash": "596fbac80224cdea520d2cfe72826db69f806725ae86dbfe9bec41e071e87819",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.exteriorPosition_injective": {
          "hash": "41595a52bb4e193f3dbe8f6649e0948a0fae4d0e45e46d6a4761aaf70d9c1511",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.copyPosition_injective": {
          "hash": "a5ccf42333c6b2f01b9c8b0a18ce894001dcb8eb157428245b9702b0870dc778",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.exteriorPosition_ne_copyPosition": {
          "hash": "b962ed0a91245467f2ad53ce6f0fefd92cabb01d232985604a76e0e79b202c1c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.raw_node_ownership": {
          "hash": "7da2fa53475565b8c6561eaef5bd4d8be3ac6f2b435d931175be7ead3d511622",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_gate_ownership": {
          "hash": "59a10f634f371082d7cf52c73e31806a2225245671020447310930a6dbfa1855",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_source": {
          "hash": "51d3a08c647d37b79586934fe8ab9264543b9473edfb524b6fbffd20d0a7940a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expanded_source_equal": {
          "hash": "40d8e8ecefe37a22b2d076f6ea12a623b4e456230601f6094d2d71005b149d1e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_output": {
          "hash": "fa6da8a64f9d09a4a1f329e28892d99305ed68ebc1aaa309fc7100a302bad3d3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_field": {
          "hash": "8482512bec2fdd91a41de913dec04499cc23fe9dfb4e22a9c8ac1a9d4d7a9691",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_gateCount": {
          "hash": "2ea5c2c9ed9ec03102e3197c42330f2943f914e404f208fe8ea58cdb1e4a9744",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_smaller_iff": {
          "hash": "407306bfe3a6784147d80e73a8df3fdc25d67030b8a4669a101495b388da9c15",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_proper_and_smaller": {
          "hash": "7d70d141e95bba9b84f18ece6d34ed734c461fc71df177093af4cb703eb7aebd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedCarrier_source_equal": {
          "hash": "5a8220e89738e799ed538c8549e0ded5f5fe6c00a8046957ad23104579d93386",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedR5Creation_coordinate": {
          "hash": "ad550a5727ce90e16c4049b5b586e57dead7e6fc9438db879ca25e8a35760788",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
        },
        "PNP.DirectWire.WireCausalExpansion.expandedR5Creation_fullWitness": {
          "hash": "7e01ca8c99d4a13c025db43dc44f130d836c0e5a9c3f09b45640997f1ce0937e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCausalExpansion"
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
export const M262_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M262_BATCH.milestones.map(row => row.fields)));
export const M262_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M262_BATCH.milestones.map(row => row.theorems)));

export const M262_BATCH_SCOPE_SUFFIX = '+plus-' + M262_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM262BatchPublicationMap(map) {
  for (const expected of M262_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM262BatchStatus(status) {
  for (const expected of M262_BATCH.milestones) {
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

function assertM262BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M262_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM262BatchInventory(inventory) {
  assertM262BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M262_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m262BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M262_BATCH.batchId,
    reviewedSource: { ...M262_BATCH.reviewedSource },
    milestones: M262_BATCH.milestones.map(row => ({
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

export function assertM262BatchManifest(manifest) {
  const expected = m262BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM259M262;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:262}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:262}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M262_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM262BrowserDescriptor() {
  return '// M259-M262-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M259_M262_BATCH = Object.freeze(' + JSON.stringify(M262_BATCH, null, 2) + ');\n' +
    'const FORMAL_M259_M262_VALIDATORS = (() => {\n' +
    'const M262_BATCH = FORMAL_M259_M262_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM262BatchStatus, assertM262BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM262BatchStatus, inventory: assertM262BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M259-M262-BATCH-DESCRIPTOR:END';
}

export function assertM262BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M259-M262-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M259-M262-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM262BrowserDescriptor(),
    'browser', {number:262}, 'generated descriptor');
}
