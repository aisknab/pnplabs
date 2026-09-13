// Reviewed compiled evidence for the M232-M258 publication batch.
// This module verifies imported artifacts; it does not execute core proof tooling.
import { createHash } from 'node:crypto';

function freezeDeep0(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeDeep0(child);
    Object.freeze(value);
  }
  return value;
}

export const M258_BATCH = freezeDeep0({
  "kind": "PNPLabsReviewedMilestoneBatch0",
  "version": 0,
  "batchId": "m232-m258",
  "reviewedSource": {
    "commit": "6296c6e1130fbae674548ccbf949f6e608b996c7",
    "tree": "78648f5978d16ff5055c5b493e5bb97ff4cd7cac",
    "statusCoordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-258"
  },
  "milestones": [
    {
      "number": 232,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-232",
      "id": "residual-terminal-profile-dependency-semantics",
      "title": "Candidate-derived terminal profile dependency reflection and noninterference",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire candidate size, executable terminal model, profile coordinate and gate, M232 proves that the computed profile-influence bit is true exactly when insertion changes the actual ambient observation in a canonical subset context. It identifies each computed profile-to-gate dependency with the coordinate's exact rule role and that influence bit. For every seed, a gate absent from the actual computed saturation cannot change a retained profile coordinate in any canonical context. The observation definition and all three general theorem interfaces are root-built and axiom-audited using only propext and Quot.sound. No dependency relation, coverage certificate or soundness proof is supplied in place of the existing computation.",
      "nonClaim": "The executable observer and profile model remain supplied data, and influence construction enumerates all subsets. This is a local semantic reflection and noninterference theorem, not an input-derived terminal family, arbitrary-record normalization, unconditional SaturatePositive or BCELReady, global route coverage or ZeroSlack, exact PCCMin construction, or an encoded-size polynomial runtime result. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalProfileDependencySemanticsFormalized": true,
        "leanResidualTerminalProfileDependencySemanticsAxiomAuditPassed": true,
        "leanResidualTerminalProfileDependencySemanticsAuditedDeclarationCount": 4,
        "leanResidualTerminalProfileDependencyNoninterferenceTheorem": "PNP.DirectWire.terminalCandidateSaturate_profile_noninterference",
        "leanResidualTerminalProfileDependencySemanticsScope": "all-finite-candidates-executable-models-computed-profile-influence-role-labelled-edges-and-computed-saturation-noninterference-in-canonical-contexts-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalGateInfluencesProfile_eq_true_iff": {
          "hash": "6b889ca06140498835da44305ac96f7ab8820e0640b2b8175e36566910082ab3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalCandidateSaturation"
        },
        "PNP.DirectWire.terminalCandidateProfileRequires_eq_influence": {
          "hash": "1f58c87385f0dbbe2932a1f1cbdc6a156dc0218a15171539d1c78daae7dec92a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalCandidateSaturation"
        },
        "PNP.DirectWire.terminalCandidateSaturate_profile_noninterference": {
          "hash": "3f9d0b7f8bd9fd56cdf1b1b2883913ddf6516d64680c6850870a6129ba89fb5d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalCandidateSaturation"
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
      "number": 233,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-233",
      "id": "residual-terminal-profile-locality",
      "title": "Retained ambient-profile locality and whole-support preservation",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire candidate size, executable terminal model, seed and retained profile coordinate, M233 proves that arbitrary primitive-record supports with the same computed-saturation gate membership have equal actual ambient observations. Structural extraction and ambient-implementation equalities account for record order, duplicates and non-gate metadata without an observer-congruence premise. General omitted-gate elimination extends M232 from canonical contexts to arbitrary supports. The actual saturated support therefore preserves each retained observation of the complete gate universe. All five theorem interfaces are root-built and axiom-audited using only propext and Quot.sound. No dependency relation, normalization certificate or correctness proof is supplied in place of the existing computation.",
      "nonClaim": "The executable observer and profile model remain supplied data, and influence construction enumerates all subsets. The theorem does not derive profile semantics or terminal families from every valid input, identify the ambient observer with the differently typed profileSystem.observe, prove transparent cost or complete route coverage, establish unconditional SaturatePositive, BCELReady or ZeroSlack, or supply an exact polynomial PCCMin construction and certificate bound. The retained-profile premise is necessary. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalProfileLocalityFormalized": true,
        "leanResidualTerminalProfileLocalityAxiomAuditPassed": true,
        "leanResidualTerminalProfileLocalityAuditedDeclarationCount": 5,
        "leanResidualTerminalProfileLocalityTheorem": "PNP.DirectWire.terminalCandidateSaturate_profile_locality",
        "leanResidualTerminalProfilePreservationTheorem": "PNP.DirectWire.terminalCandidateSaturate_profile_preserved",
        "leanResidualTerminalProfileLocalityScope": "all-finite-candidates-executable-models-arbitrary-primitive-record-supports-computed-saturation-retained-ambient-profile-locality-and-preservation-only"
      },
      "theorems": {
        "PNP.DirectWire.extractTerminalSupport_eq_of_gateSelected_eq": {
          "hash": "36de3a72b162389f2f8f5a3411a8fc000007cf55da00a39898b4b59d76957f05",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalAmbientSupportImplementation_eq_of_gateSelected_eq": {
          "hash": "991e7712503e87f358b0d5a8fa89978d4a0552e28ce55fda31b3768fdf9e05a1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalProfileLocality"
        },
        "PNP.DirectWire.terminalCandidateProfileObservation_eq_of_gateMembership_iff": {
          "hash": "520e4c036df985fe6f97aa3c59fe3f7b14253fb85fec508464f077031da09d12",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalProfileLocality"
        },
        "PNP.DirectWire.terminalCandidateSaturate_profile_locality": {
          "hash": "90f27df9e3ef24ce34a8ca9ebbe4658cd2c400652701b50f6847f6fbb44aa683",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalProfileLocality"
        },
        "PNP.DirectWire.terminalCandidateSaturate_profile_preserved": {
          "hash": "059c535361ddcce72aae10142584704865fd604cdedc853c71b30e6a213f61da",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalProfileLocality"
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
      "number": 234,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-234",
      "id": "residual-terminal-saturation-trace-fidelity",
      "title": "Computed saturation trace fidelity and metadata cost balance",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite terminal systems and seeds, M234 proves that the actual cost-accounting replay contains exactly the canonical computed saturated records and that every emitted event adds its required record with a valid selected dependency rule. For every finite direct-wire candidate and executable terminal model, the replay and canonical endpoints have equal ambient implementations and equal cost snapshot coordinates, with the stored record list kept explicit. Every generated non-gate metadata event is structurally cost-transparent. All five theorem interfaces are root-built and axiom-audited using only propext and Quot.sound. No trace-validity, replay-correctness, observer-congruence or balance certificate is supplied in place of the existing computation.",
      "nonClaim": "The executable observer and profile model remain supplied data. Influence and semantic minima use exhaustive finite reference constructions; no polynomial runtime is proved. Metadata cost balance does not establish physical-gate transparency, obligation discharge or complete closure safety. The theorem does not derive terminal families from every valid input, prove global route coverage, unconditional SaturatePositive, BCELReady or ZeroSlack, or construct the exact polynomial PCCMin algorithm and certificate bounds. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalSaturationTraceFidelityFormalized": true,
        "leanResidualTerminalSaturationTraceFidelityAxiomAuditPassed": true,
        "leanResidualTerminalSaturationTraceFidelityAuditedDeclarationCount": 5,
        "leanResidualTerminalSaturationReplayTheorem": "PNP.DirectWire.terminalSaturateTrace_replayRecords_iff",
        "leanResidualTerminalSaturationEventValidityTheorem": "PNP.DirectWire.terminalSaturateTrace_event_valid",
        "leanResidualTerminalSaturationMetadataTransparencyTheorem": "PNP.DirectWire.terminalCandidateSaturateTrace_metadata_transparent",
        "leanResidualTerminalSaturationTraceFidelityScope": "all-finite-systems-candidates-executable-models-seeds-generated-events-actual-replay-ambient-endpoint-cost-snapshot-and-metadata-transparency-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalSaturateTrace_replayRecords_iff": {
          "hash": "7f80f837010adcb3f2fae342d28dd62abc409952246ae543f7b42d45e5ad4fa4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalExecutableSaturation"
        },
        "PNP.DirectWire.terminalSaturateTrace_event_valid": {
          "hash": "c1b87935414b4d1f64511851d7a2f16950aabf4a941ecc67f2d377f8c9435733",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalExecutableSaturation"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_ambient_eq": {
          "hash": "9c95df1a18426898db16b49a2181726decbb73bd693034227e0046b98f8dbff5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturationTraceFidelity"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_costSnapshot_eq": {
          "hash": "a71b030f39a2e1a75045b984451b286d3ed66101bebea61d97693f9ba23ba6a5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturationTraceFidelity"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_metadata_transparent": {
          "hash": "e30fc653246ef6cd59ec517a9667f819ad013811f758aa855aa9f02a5ee6fc76",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturationTraceFidelity"
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
      "number": 235,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-235",
      "id": "residual-terminal-physical-saturation-accounting",
      "title": "Actual physical saturation accounting and first-obstruction fidelity",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite terminal systems, seeds and actual generated events, M235 derives that the dependent is already active and the required record is genuinely new. For every finite direct-wire candidate and executable terminal model, the unchanged extractor charges exactly one physical gate for a generated gate event and zero for metadata, and the selected rule/dependent pair belongs to the computed active-owner list. Every generated nontransparent event is a physical insertion with a genuine nonunique-owner, full-minimum-growth or quotient-cost obstruction. The existing total classifier either preserves full slack and nondecreasing projection defect at canonical computed saturation or returns its exact first such obstruction with a transparent prefix. All five general interfaces are root-built and audited using only propext and Quot.sound. No freshness, charge-balance, active-owner, all-transparent-history or preselected-route certificate replaces the actual computation.",
      "nonClaim": "The executable observer and profile model remain supplied data. Influence and semantic minima use exhaustive finite reference constructions; no polynomial runtime is proved. An active dependency owner need not be unique. Exact physical support growth does not establish full-minimum growth, a quotient bound, obligation discharge, complete closure safety or a global named route. The first physical obstruction is not thereby a verified gain, an exact route or strict descent. This theorem does not derive terminal families from every valid input, prove global route coverage, unconditional SaturatePositive, BCELReady or ZeroSlack, or construct the exact polynomial PCCMin algorithm and certificate bounds. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalPhysicalSaturationAccountingFormalized": true,
        "leanResidualTerminalPhysicalSaturationAccountingAxiomAuditPassed": true,
        "leanResidualTerminalPhysicalSaturationAccountingAuditedDeclarationCount": 5,
        "leanResidualTerminalSaturationEventContextTheorem": "PNP.DirectWire.terminalSaturateTrace_event_context",
        "leanResidualTerminalPhysicalSaturationSupportCostTheorem": "PNP.DirectWire.terminalCandidateSaturateTrace_supportCostBalanced",
        "leanResidualTerminalPhysicalSaturationActiveOwnerTheorem": "PNP.DirectWire.terminalCandidateSaturateTrace_event_owner",
        "leanResidualTerminalPhysicalSaturationObstructionTheorem": "PNP.DirectWire.terminalCandidateSaturateTrace_physicalObstruction",
        "leanResidualTerminalPhysicalSaturationBalanceOrObstructionTheorem": "PNP.DirectWire.terminalCandidateSaturateTrace_balance_or_physicalObstruction",
        "leanResidualTerminalPhysicalSaturationAccountingScope": "all-finite-systems-candidates-executable-models-seeds-generated-events-fresh-context-unit-physical-support-cost-active-owner-and-canonical-endpoint-first-obstruction-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalSaturateTrace_event_context": {
          "hash": "ee22de07094e37ab879f32dcf4cd29ca950e0ff9077b7b673478fecc77c14649",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalExecutableSaturation"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_supportCostBalanced": {
          "hash": "0b3ea6401032e726f0e43acba13490d9308e323109d0a1d3d1d33aae44080e66",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSaturationAccounting"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_event_owner": {
          "hash": "ed16113c1dc85a8a77affb8544368ef558cfbccaa8cb6d435ef28f480e10ddb1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSaturationAccounting"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_physicalObstruction": {
          "hash": "7b0e659ae86824ee35ef8c5a449cf39b44768e7d5b78173f68fa9d1541e4f9ab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSaturationAccounting"
        },
        "PNP.DirectWire.terminalCandidateSaturateTrace_balance_or_physicalObstruction": {
          "hash": "7d2d28cb4e283178d5d491a6213190a8895661a46bb0bf9973ba60d5b1a100c0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalSaturationAccounting"
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
      "number": 236,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-236",
      "id": "residual-terminal-physical-charge-ledger",
      "title": "Computed physical-charge partition and introduction provenance",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite terminal systems and seeds, M236 constructs a physical-NAND charge ledger directly from the normalized initial records and actual computed saturation trace. Its physical gate identifiers are duplicate-free and occur exactly when the corresponding gate records occur in the computed saturated support. Each entry has inherited seed provenance or an actual generating event with its exact rule and dependent, active context and fresh required gate. The deterministic lookup returns exactly the provenance of the corresponding ledger entry. For every finite direct-wire candidate and executable terminal model, the complete computed ledger length equals the unchanged extractor's support size at canonical saturation. All five general interfaces are root-built and audited using only propext and Quot.sound. No supplied charge list, coverage certificate, freshness premise or ownership certificate replaces the actual computation.",
      "nonClaim": "This is a physical-NAND charge partition with seed- and traversal-dependent introduction provenance, not the complete manuscript charge universe or its fixed global ownership function. Active requesting pairs are not assigned manuscript owners, and multiple physical charges may have the same requesting dependency. Materializer grouping and cross-support ownership transport remain open. The executable observer and profile model remain supplied data, while influence and semantic minima use exhaustive finite reference constructions. No full-minimum growth, quotient bound, global named route, input-derived terminal family, unconditional SaturatePositive, BCELReady or ZeroSlack, or complete polynomial PCCMin runtime and certificate bounds is established. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalPhysicalChargeLedgerFormalized": true,
        "leanResidualTerminalPhysicalChargeLedgerAxiomAuditPassed": true,
        "leanResidualTerminalPhysicalChargeLedgerAuditedDeclarationCount": 5,
        "leanResidualTerminalPhysicalChargeLedgerNodupTheorem": "PNP.DirectWire.terminalSaturatePhysicalCharges_nodup",
        "leanResidualTerminalPhysicalChargeLedgerCompletenessTheorem": "PNP.DirectWire.terminalSaturatePhysicalCharges_complete",
        "leanResidualTerminalPhysicalChargeLedgerProvenanceTheorem": "PNP.DirectWire.terminalSaturatePhysicalCharges_provenance",
        "leanResidualTerminalPhysicalChargeLedgerLookupTheorem": "PNP.DirectWire.terminalSaturatePhysicalChargeProvenance?_iff",
        "leanResidualTerminalPhysicalChargeLedgerSizeTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalCharges_size",
        "leanResidualTerminalPhysicalChargeLedgerScope": "all-finite-systems-candidates-executable-models-seeds-computed-physical-nand-charge-partition-nodup-completeness-introduction-provenance-lookup-and-total-support-size-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalSaturatePhysicalCharges_nodup": {
          "hash": "0a497b58da7516008c21d16102eb4250efb393185ceb94e1ae5a231c0d52b0ca",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalChargeLedger"
        },
        "PNP.DirectWire.terminalSaturatePhysicalCharges_complete": {
          "hash": "8e0e5f6e186440b15ad4d7df71bd695e66d73c2aa78e1c54464055849ebc884f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalChargeLedger"
        },
        "PNP.DirectWire.terminalSaturatePhysicalCharges_provenance": {
          "hash": "de03b8300d15fd5811d005d572f55ad8cd40c0be743b08c4d0d360937834324a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalChargeLedger"
        },
        "PNP.DirectWire.terminalSaturatePhysicalChargeProvenance?_iff": {
          "hash": "5452a6276bb56f83bdfb7faadf64cf3a3f74e3b33d64f362f202c0c63af3dcb8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalChargeLedger"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalCharges_size": {
          "hash": "0f4f2f19bf24e21a369d29a1ac517235c071f3511f0663dd87af3b854625f8fc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalChargeLedger"
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
      "number": 237,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-11-237",
      "id": "residual-terminal-saturated-support-context",
      "title": "Computed saturated-support replacement context and physical slack",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire candidate, executable terminal model and seed list, M237 computes a concrete replacement frame from production saturation and the actual physical gate complement. Gate-source closure proves that the selected support boundary contains only primary inputs. The unchanged extractor constructs both gate halves, and every complement boundary gate is bound to an actual selected-support interface port. The frame preserves the original ordered Boolean outputs when the extracted support is plugged back in. Every equivalent replacement on the exact extracted boundary and interface preserves the whole circuit, with an exact gate-count equation that counts every original physical NAND gate once and permits arbitrary replacement size. Transport through the existing constructive frame theorem bounds the computed support's physical Boolean residual slack by whole-circuit slack. All five general interfaces are root-built and audited using only propext and Quot.sound. No caller-supplied frame, fan-in-closure certificate, gate partition or whole-circuit correctness proof replaces the computation.",
      "nonClaim": "These are physical Boolean replacement and slack laws for actual production saturated supports, not arbitrary raw supports or full-profile compatibility. The complete manuscript profile/materializer charge universe, fixed global ownership map and full-profile replacement transport remain open. The executable observer and profile model remain supplied data, while influence and semantic minima use exhaustive finite reference constructions; no polynomial runtime is proved. No full-minimum growth, quotient bound, global named route, input-derived complete terminal family, unconditional SaturatePositive, BCELReady or ZeroSlack, or complete polynomial PCCMin runtime and certificate bounds is established. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root theorem remain absent; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalSaturatedSupportContextFormalized": true,
        "leanResidualTerminalSaturatedSupportContextAxiomAuditPassed": true,
        "leanResidualTerminalSaturatedSupportContextAuditedDeclarationCount": 5,
        "leanResidualTerminalSaturatedSupportContextBoundaryTheorem": "PNP.DirectWire.terminalCandidateSaturate_boundary_isInput",
        "leanResidualTerminalSaturatedSupportContextSizeTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_size",
        "leanResidualTerminalSaturatedSupportContextReconstructionTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_equivalent",
        "leanResidualTerminalSaturatedSupportContextReplacementTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_replace_equivalent",
        "leanResidualTerminalSaturatedSupportContextSlackTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalSupport_slack_le",
        "leanResidualTerminalSaturatedSupportContextScope": "all-finite-candidates-executable-models-seeds-production-saturated-supports-computed-physical-complement-context-primary-input-boundary-exact-gate-partition-whole-boolean-reconstruction-equivalent-replacement-and-physical-slack-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalCandidateSaturate_boundary_isInput": {
          "hash": "ec26a0d3919ff6dcf860984c92310bb49a1e5d608e863c05be8733603bd5b270",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_size": {
          "hash": "f0bc6f7e663522a203de0c795593b631dbee10e250ea098434e7b43798182f17",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_equivalent": {
          "hash": "86fb01c46c418f630fcf7d85b8b1706bb78c03e0df292f42c877673258555323",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalContext_replace_equivalent": {
          "hash": "b3404c4072cad4b15a86c1b1a58c83869093f77d1ca15684e61c7d0c22b74aca",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSaturatedSupportContext"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalSupport_slack_le": {
          "hash": "70f1c100034d2f37d8e2f6cc4f437b392e5f9c4adacfbb416fff852c763ec742",
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
      "number": 238,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-238",
      "id": "residual-terminal-physical-gain",
      "title": "Computed proper-support physical gain and exact slack descent",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire candidate, executable terminal profile model and seed list, M238 computes the whole physical replacement using the existing reference-minimum witness and the actual production saturated-support context. The complete ordered Boolean output word is preserved. The replacement gate count plus the computed local gain equals the original gate count, and replacement residual slack plus that gain equals the original physical residual slack. These equations require no properness, positivity, supplied frame or supplied charge partition. The total optional gain step maps this construction over the existing candidate-derived proper-positive support search. Every returned result carries an actually selected canonical proper positive seed and strictly decreases whole physical gate count and residual slack. Failure is exactly absence of every canonical proper positive seed for that computed system, not global minimality. All five universal interfaces are root-built and audited using only propext and Quot.sound. The caller supplies no search result, replacement, seed, context or correctness certificate to the gain-step algorithm.",
      "nonClaim": "These are physical Boolean reference gain-realization and search-failure laws, not full-profile replacement compatibility or a complete named global route. The observer and profile model remain supplied data, while influence, canonical seed search and semantic minima use exhaustive finite reference constructions; no polynomial encoded-size or runtime bound is proved. Failure of the proper-support search does not imply global minimality or ZeroSlack. Complete profile/materializer charge coverage, fixed global ownership, obligation transport, full-minimum growth, quotient bounds, input-derived complete terminal families and global rank-decreasing route coverage remain open. No unconditional SaturatePositive, BCELReady or ZeroSlack, complete polynomial PCCMin, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalPhysicalGainFormalized": true,
        "leanResidualTerminalPhysicalGainAxiomAuditPassed": true,
        "leanResidualTerminalPhysicalGainAuditedDeclarationCount": 5,
        "leanResidualTerminalPhysicalGainEquivalenceTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_equivalent",
        "leanResidualTerminalPhysicalGainSizeTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_size_gain",
        "leanResidualTerminalPhysicalGainSlackTheorem": "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_slack_gain",
        "leanResidualTerminalPhysicalGainSearchSoundnessTheorem": "PNP.DirectWire.findTerminalCandidatePhysicalGain_sound",
        "leanResidualTerminalPhysicalGainSearchFailureTheorem": "PNP.DirectWire.findTerminalCandidatePhysicalGain_eq_none_iff",
        "leanResidualTerminalPhysicalGainScope": "all-finite-candidates-executable-models-production-saturated-supports-computed-reference-minimum-replacements-exact-physical-size-and-slack-descent-and-complete-proper-positive-search-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_equivalent": {
          "hash": "e1da67101c515204dd045a2f04fb5e8b50cd2c930eb6ae526c3192657180af4a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalGain"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_size_gain": {
          "hash": "3b1b137f09a7681341f12a83c5de1713d4116c1baa6f98ac0300da039342cf31",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalGain"
        },
        "PNP.DirectWire.terminalCandidateSaturatePhysicalMinimumReplacement_slack_gain": {
          "hash": "96dac6e6f5ecc546b311cf0bab666075da5143cd31563aa1e09eaf9cfba4de66",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalGain"
        },
        "PNP.DirectWire.findTerminalCandidatePhysicalGain_sound": {
          "hash": "f5e4ab7db43a4f9476b036cbed4d58aa0a5a46889ff738e76c71bf354ea79479",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalGain"
        },
        "PNP.DirectWire.findTerminalCandidatePhysicalGain_eq_none_iff": {
          "hash": "de932d3dd29285c67a55cce7e67378b4ecd805f7daf84516e8c0b9ed3cc7f0fd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalGain"
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
      "number": 239,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-239",
      "id": "residual-terminal-gain-profile-firewall",
      "title": "Computed full-profile gain acceptance and exact slack descent",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire candidate and supplied executable terminal profile model, M239 classifies the exact result of the existing production physical-gain search. No result is exactly the existing proper-support search failure. A result is scanned at every full-profile coordinate in canonical order. Rejection identifies the actual first mismatching coordinate and complete agreeing prefix; acceptance constructs the existing full-carrier realization without a caller-supplied result, seed, profile-equality proof or correctness certificate. Complete full-carrier realizations preserve the exhaustive full-profile minimum, and every accepted computed gain decreases full-profile slack by exactly the local physical gain of its actually selected proper-positive support. Existing obligation discharge transports through the full realization; an open obligation is not thereby discharged. The seven universal interfaces are explicit-root built with their reviewed standard axiom closures. The classifier reuses M238's proved Boolean equivalence rather than repeating an exhaustive equivalence check.",
      "nonClaim": "These are computed finite full-profile acceptance and accepted-result transport laws for the supplied executable profile system, not a derivation of manuscript carrier data or a theorem that every physical gain is full-profile compatible. A first profile mismatch is not a completed named global route. The observer and profile model remain supplied data; influence, canonical seed search and semantic minima remain exhaustive finite reference constructions, with no polynomial encoded-size or runtime theorem. The classifier does not search alternative physical gains after a mismatch or identify ambient observations with the differently typed global profile system. Complete materializer charges, fixed global ownership, full-minimum growth during saturation, quotient bounds, terminal-family derivation and global rank-decreasing route coverage remain open. No unconditional SaturatePositive, BCELReady or ZeroSlack, complete polynomial PCCMin, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalGainProfileFirewallFormalized": true,
        "leanResidualTerminalGainProfileFirewallAxiomAuditPassed": true,
        "leanResidualTerminalGainProfileFirewallAuditedDeclarationCount": 7,
        "leanResidualTerminalGainProfileFirewallProfileScanTheorem": "PNP.DirectWire.firstTerminalGainProfileMismatch_eq_none_iff",
        "leanResidualTerminalGainProfileFirewallFirstMismatchTheorem": "PNP.DirectWire.firstTerminalGainProfileMismatch_spec",
        "leanResidualTerminalGainProfileFirewallFullMinimumTheorem": "PNP.DirectWire.terminalFullProfileMinimum_eq_of_fullRealization",
        "leanResidualTerminalGainProfileFirewallAcceptanceTheorem": "PNP.DirectWire.classifyTerminalCandidateGainProfile_accepted_iff",
        "leanResidualTerminalGainProfileFirewallSearchFailureTheorem": "PNP.DirectWire.classifyTerminalCandidateGainProfile_noGain_iff",
        "leanResidualTerminalGainProfileFirewallRejectionTheorem": "PNP.DirectWire.classifyTerminalCandidateGainProfile_mismatch_iff",
        "leanResidualTerminalGainProfileFirewallFullSlackTheorem": "PNP.DirectWire.TerminalCandidateFullProfileGain.fullSlack_gain",
        "leanResidualTerminalGainProfileFirewallScope": "all-finite-candidates-supplied-executable-profile-models-computed-physical-gain-full-coordinate-first-mismatch-acceptance-and-exact-accepted-full-profile-slack-descent-only"
      },
      "theorems": {
        "PNP.DirectWire.firstTerminalGainProfileMismatch_eq_none_iff": {
          "hash": "52aa9325d4a4b8f913638324e694e3d80d7640a630e29e2000b040a28d4dfcb8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.firstTerminalGainProfileMismatch_spec": {
          "hash": "0296facc7457cb22362c0ba0417f1d9db05f472c05a7a80785270f1d0778f7a6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.terminalFullProfileMinimum_eq_of_fullRealization": {
          "hash": "e86e3fcdfbc81b6f1a6d14d631dae151b60d34950ac04f4a0b71b5c1c76764f9",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.classifyTerminalCandidateGainProfile_accepted_iff": {
          "hash": "5271b9a9fdc0a1e07d5fe34f74d101a6ebd23ca15f7e21cc9779020761caeefa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.classifyTerminalCandidateGainProfile_noGain_iff": {
          "hash": "1d9f1e3ab39bdfed1ef6692e9aef6042a169a2d74f5d5dae632d5ad5ab036e4a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.classifyTerminalCandidateGainProfile_mismatch_iff": {
          "hash": "dfc8ea46b715beacd6afa5b64988becc4d208d8c19ef8191d592bd4f3dc34a20",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
        },
        "PNP.DirectWire.TerminalCandidateFullProfileGain.fullSlack_gain": {
          "hash": "52a4af27b6946c6dee5fc9a0d00f3f5b1fc80a7a8a23c7153f0621953fff3ab9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalGainProfileFirewall"
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
      "number": 240,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-240",
      "id": "residual-independent-materializer-cost",
      "title": "Independent NAND materializer exact minimum-cost additivity",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire circuit and every finite bank size, M240 physically appends one NAND for each disjoint pair of fresh Boolean inputs while retaining all original ordered outputs. The seven universal interfaces prove exact size and both output semantics, preservation of complete Boolean equivalence, a lower bound against every equivalent competing topology, exact reference-minimum additivity and unchanged physical residual slack. The original circuit need not be minimum, and its outputs may be constant, repeated or direct primary-input wires. The lower bound derives distinct actual bank-output gates from semantic output conditions, restricts fresh inputs to false and computes an erasure/rebinding that removes exactly those gates, including through retained consumers. The resulting implementation realizes the original function. Appending the bank to its attained minimum witness gives the matching upper bound. No correctness certificate or supplied minimum is an algorithm input. All seven interfaces are explicit-root built with their exact reviewed standard axiom closures.",
      "nonClaim": "This is an independent physical Boolean materializer forced-cost subcase, not transparency of every manuscript profile materializer or every actual saturation step. Fresh primary inputs and distinct appended NAND outputs are essential; repeating an existing output or reusing the original input pair does not justify additive cost. The result does not change or derive the full profile observer, global materializer ownership, quotient costs, obligation discharge, terminal families or complete rank-decreasing route coverage. Reference minima remain exhaustive finite constructions, not a polynomial-time algorithm. No unconditional SaturatePositive, BCELReady or ZeroSlack, complete polynomial PCCMin, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanResidualIndependentMaterializerCostFormalized": true,
        "leanResidualIndependentMaterializerCostAxiomAuditPassed": true,
        "leanResidualIndependentMaterializerCostAuditedDeclarationCount": 7,
        "leanResidualIndependentMaterializerCostSizeTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_size",
        "leanResidualIndependentMaterializerCostOriginalOutputsTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_original",
        "leanResidualIndependentMaterializerCostFreshOutputsTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_materializer",
        "leanResidualIndependentMaterializerCostLowerBoundTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_lower_bound",
        "leanResidualIndependentMaterializerCostEquivalenceTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_equivalent",
        "leanResidualIndependentMaterializerCostMinimumTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_referenceMinimum",
        "leanResidualIndependentMaterializerCostSlackTheorem": "PNP.DirectWire.appendIndependentNandMaterializers_residualSlack",
        "leanResidualIndependentMaterializerCostScope": "all-finite-original-candidates-and-bank-sizes-disjoint-fresh-input-nand-materializers-computed-erasure-unrestricted-competitors-exact-reference-minimum-additivity-and-physical-slack-preservation-only"
      },
      "theorems": {
        "PNP.DirectWire.appendIndependentNandMaterializers_size": {
          "hash": "b9e62d820791057b85d460f0f0e4fcdf75b548ade178ffb02f6afbe43342007f",
          "axioms": [],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_original": {
          "hash": "7e65839855b25defa669921d118f54469f1adad851557433c6b2a3916bd0497b",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_materializer": {
          "hash": "b4ec58852a66b2b707ddac5378b3fce1481889d9e89a3be878cf3345fcdc81a1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_lower_bound": {
          "hash": "d775d0bd12c5cb8af9a3ab08fd05a21637f1d724aff0bf3f28c93997db70ccdf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_equivalent": {
          "hash": "e4ca1a4bc815ba9e1be215fff9ca41e24e10e90a43f627ea000eee029899ca68",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_referenceMinimum": {
          "hash": "0b9830efe900d365e70e4150003eb0df18c3da3ba28e17df580edd64db48ccf8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
        },
        "PNP.DirectWire.appendIndependentNandMaterializers_residualSlack": {
          "hash": "d4809059a0690effa9e02fa217a7d6ce6b59faaef074efb2f42a9d728e1e35c2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualIndependentMaterializerCost"
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
      "number": 241,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-241",
      "id": "residual-terminal-physical-ownership",
      "title": "Support-independent physical ownership and exact materializer charges",
      "classification": "formalized-foundation-only",
      "scope": "For every finite candidate, arbitrary finite raw request family and terminal record list, M241 computes a first-requesting ambient owner before support selection, retaining unrequested physical gates in a fixed remainder bucket. Ten universal interfaces characterize the first requester and unrequested case, exact partition membership, disjointness and restriction stability, actual extracted gate counts, the complete integer charge identity, open semantics, induced-boundary reconnection and the whole-circuit charge total. Overlapping and duplicate requests require no supplied disjointness or coverage certificate. Each owned piece is an existing physical support extraction with its actual NAND size, not an arbitrary numerical weight. All ten interfaces are explicit-root built with their exact reviewed standard axiom closures.",
      "nonClaim": "This is a support-independent physical ownership and charge partition kernel, not the complete manuscript computational-record universe or proof of admissible materializer ownership. The raw finite request family is supplied data; a canonical assignment does not discharge unique active ownership, carrier, frontier or obligation conditions. The existing production nonunique-owner rejection is unchanged. Metadata records do not become free computational materializers or receive invented physical cost. The result does not establish HN assembly, forced full-profile minimum growth, quotient bounds, terminal-family derivation or complete rank-decreasing routes. Reference minima remain exhaustive finite constructions, not a polynomial-time algorithm. No unconditional SaturatePositive, BCELReady or ZeroSlack, complete polynomial PCCMin, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanResidualTerminalPhysicalOwnershipFormalized": true,
        "leanResidualTerminalPhysicalOwnershipAxiomAuditPassed": true,
        "leanResidualTerminalPhysicalOwnershipAuditedDeclarationCount": 10,
        "leanResidualTerminalPhysicalOwnershipUnrequestedTheorem": "PNP.DirectWire.terminalPhysicalOwner_none_iff",
        "leanResidualTerminalPhysicalOwnershipFirstOwnerTheorem": "PNP.DirectWire.terminalPhysicalOwner_first",
        "leanResidualTerminalPhysicalOwnershipPartitionTheorem": "PNP.DirectWire.terminalOwnedPhysicalGates_partition",
        "leanResidualTerminalPhysicalOwnershipDisjointTheorem": "PNP.DirectWire.terminalOwnedPhysicalGates_disjoint",
        "leanResidualTerminalPhysicalOwnershipRestrictionTheorem": "PNP.DirectWire.terminalOwnedPhysicalGates_restrict",
        "leanResidualTerminalPhysicalOwnershipGateCountTheorem": "PNP.DirectWire.terminalOwnedPhysicalMaterializer_gateCount",
        "leanResidualTerminalPhysicalOwnershipChargeIdentityTheorem": "PNP.DirectWire.terminalOwnedPhysicalMaterializer_chargeIdentity",
        "leanResidualTerminalPhysicalOwnershipOpenSemanticsTheorem": "PNP.DirectWire.terminalOwnedPhysicalMaterializer_semantics",
        "leanResidualTerminalPhysicalOwnershipInducedSemanticsTheorem": "PNP.DirectWire.terminalOwnedPhysicalMaterializer_induced",
        "leanResidualTerminalPhysicalOwnershipWholeChargeTheorem": "PNP.DirectWire.terminalOwnedPhysicalMaterializer_wholeCharge",
        "leanResidualTerminalPhysicalOwnershipScope": "all-finite-candidates-raw-request-families-and-supports-first-requester-ambient-ownership-fixed-remainder-disjoint-stable-physical-pieces-actual-extracted-nand-counts-open-semantics-and-exact-charge-total-only"
      },
      "theorems": {
        "PNP.DirectWire.terminalPhysicalOwner_none_iff": {
          "hash": "ffc0ed143bf7e48c93f51515386fd85a50d91876ef9079208c85da56384caecc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalPhysicalOwner_first": {
          "hash": "ea71fecbc78798ce11593d9f1a9991444ed2441a909b02e9a9e64fdbb0791ac7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalGates_partition": {
          "hash": "fcc78b43e37b2ecff81821ca824b6846cbd7dedbc034a964e02604780c234792",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalGates_disjoint": {
          "hash": "309b77fc6c02991fe447b18c499ffded34920f11e8e5738eb915edbdebceec60",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalGates_restrict": {
          "hash": "5ad710531d391c95b4159defd761557215dfc0bceefcbced744060569dee942f",
          "axioms": [
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalMaterializer_gateCount": {
          "hash": "fa95da38296729083ca7fc691fb6ddb2519b8cb14a5cdd7131a56baacd838678",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalMaterializer_chargeIdentity": {
          "hash": "536ab6d2243bb5599225af8762bebc639928dd957692cc58a4e38c16f7d05fbe",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalMaterializer_semantics": {
          "hash": "8de6988c721b8734eea3bea0f9c66a58ef6b149f93a3366e195570422ca02c3b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalMaterializer_induced": {
          "hash": "6382079281a6e01dc636253438900d6528f761ff9c5fc8e2001d02da554fac7a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
        },
        "PNP.DirectWire.terminalOwnedPhysicalMaterializer_wholeCharge": {
          "hash": "2cf21f36ac2063dd4093521f5eb5de20647af79da6848811ce8fae59b33b27a0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalPhysicalOwnership"
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
      "number": 242,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-242",
      "id": "pccmin-constructive-nand-sharing",
      "title": "Constructive whole-program NAND sharing and checked normalization",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire NAND program and complete ordered output word, M242 computes a full structural-sharing traversal, translating every source through earlier computed aliases and searching the actual retained program for equal or commuted NAND input pairs. Each successful lookup reuses one existing gate; each unsuccessful lookup appends one translated gate. Nine universal interfaces prove every alias value, exact retained-plus-fold gate accounting, complete multi-output equivalence, non-increasing physical size, invariant reference minimum, exact residual-slack savings, strict gain exactly when a fold occurs, strict residual descent and the computed normalizer outcome. The caller supplies only the implementation, not an optimizer or correctness certificate. The pass performs structural lookup, not semantic enumeration. All nine interfaces are explicit-root built with only propext and Quot.sound.",
      "nonClaim": "This is a computed physical R1/R4 structural-sharing stage, not complete manuscript N1-N10 normalization or a proof that every latent-sharing opportunity is found. A no-fold branch does not imply semantic minimality, absence of other gains or ZeroSlack; a checked regression gives a smaller equivalent circuit after the pass has no structural fold. The result does not construct a proper-support Package E ledger, arbitrary replacement pullback, full-profile carrier or obligation transport, terminal-derived families, global rank-decreasing route coverage or the complete PCCMin oracle. Reference minimum occurs in specification theorems, not in execution of this pass. No uniformly encoded-size polynomial execution theorem for the complete PCCMin construction is proved. No unconditional SaturatePositive, BCELReady or ZeroSlack, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinConstructiveNANDSharingFormalized": true,
        "leanPCCMinConstructiveNANDSharingAxiomAuditPassed": true,
        "leanPCCMinConstructiveNANDSharingAuditedDeclarationCount": 9,
        "leanPCCMinConstructiveNANDSharingAliasSemanticsTheorem": "PNP.DirectWire.compileNANDSharing_alias_semantics",
        "leanPCCMinConstructiveNANDSharingGateAccountingTheorem": "PNP.DirectWire.compileNANDSharing_exact_accounting",
        "leanPCCMinConstructiveNANDSharingEquivalenceTheorem": "PNP.DirectWire.sharingImplementation_equivalent",
        "leanPCCMinConstructiveNANDSharingGateCountTheorem": "PNP.DirectWire.sharingImplementation_gateCount_le",
        "leanPCCMinConstructiveNANDSharingReferenceMinimumTheorem": "PNP.DirectWire.sharingImplementation_referenceMinimum",
        "leanPCCMinConstructiveNANDSharingResidualSlackTheorem": "PNP.DirectWire.sharingImplementation_residualSlack",
        "leanPCCMinConstructiveNANDSharingStrictGainTheorem": "PNP.DirectWire.sharingImplementation_strictGain_iff",
        "leanPCCMinConstructiveNANDSharingStrictResidualDescentTheorem": "PNP.DirectWire.sharingImplementation_strictResidualDescent",
        "leanPCCMinConstructiveNANDSharingNormalizerTheorem": "PNP.DirectWire.nandSharingNormalizer_checked",
        "leanPCCMinConstructiveNANDSharingScope": "all-finite-nand-programs-and-ordered-outputs-computed-structural-and-commuted-reuse-alias-semantics-exact-fold-accounting-invariant-reference-minimum-residual-descent-and-concrete-normalizer-stage-only"
      },
      "theorems": {
        "PNP.DirectWire.compileNANDSharing_alias_semantics": {
          "hash": "4deb034903ad839c8a3b4b239a3eedac0b9015b2ca80f813887ab3fe0da96822",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.compileNANDSharing_exact_accounting": {
          "hash": "164deeba19f4e72d48b14460ecf95cab0aaaa5d9f1bd0d7c162197c2254c0c82",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_equivalent": {
          "hash": "bf6462df6f7b2be0f1e107c0de6e9dbfe0d60f95207d32da437ba4d3e9bba1f8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_gateCount_le": {
          "hash": "2e8b717281088e2f705da023dcf9c3e70c36eb734e6b2e1cc21d011f743fe5b4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_referenceMinimum": {
          "hash": "1765f52468d594f9b61339121daf6522ab56cc1b1b2ce3c8ea0bc7a5b339a263",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_residualSlack": {
          "hash": "a5dee1ecca503f2fbc2d154a79fece88bf4c9b22ba1b836c17222e62731cae1d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_strictGain_iff": {
          "hash": "5de93eb4cd692308ffce27770919129d605624fc0b0983d46cbe1f6fc675104d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.sharingImplementation_strictResidualDescent": {
          "hash": "78ca908349b5ce03bd5e8585dcfed98eb3a24cd860337fab2681d8e435cc19cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
        },
        "PNP.DirectWire.nandSharingNormalizer_checked": {
          "hash": "9ad481fa3cf574495fe90302d3f8945fe4917791935b065cbc86f51aef60b7fd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstructiveNANDSharing"
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
      "number": 243,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-243",
      "id": "concrete-final-report-bridge",
      "title": "Checked concrete SAT hardness in the active conditional final-report bridge",
      "classification": "formalized-foundation-only",
      "scope": "M243 connects the already checked all-input Cook-Levin NP-hardness and NP-completeness theorem to the exact report-facing SAT predicate. The existing accepted-generated-package consequence and final_report_bridge no longer take a CheckerTrustModel or supplied SAT-hardness argument. They consume the checked theorem while retaining the explicit PCCMinLoopCertificate, its concrete residual-band polynomial decider and the loop-existence antecedent. This strengthens the active conditional interface rather than adding an unused parallel route. Four reviewed interfaces have exact kernel types and the same standard axioms as the consumed M231 theorem: Classical.choice, Quot.sound and propext.",
      "nonClaim": "This is a conditional final-report bridge, not the eligible unconditional root theorem. No complete PCCMin loop certificate is constructed: the concrete residual-band decider remains an explicit certificate field. Canonical package acceptance does not supply missing algorithmic correctness, encoded-size bounds or loop existence. This does not establish unconditional SaturatePositive, BCELReady or ZeroSlack, a complete exact polynomial PCCMin construction, polynomial output and certificate bounds, deterministic CNFSAT in P or P = NP. M231 hardness was already credited; connecting it here earns no duplicate checkpoint points. No fixed weighted checkpoint or global gate closes.",
      "fields": {
        "leanConcreteFinalReportBridgeFormalized": true,
        "leanConcreteFinalReportBridgeAxiomAuditPassed": true,
        "leanConcreteFinalReportBridgeAuditedDeclarationCount": 4,
        "leanConcreteFinalReportBridgeSATHardnessTheorem": "PNP.sat_np_hard_checked",
        "leanConcreteFinalReportBridgeSATCompletenessTheorem": "PNP.sat_np_complete_checked",
        "leanConcreteFinalReportBridgePackageConsequenceTheorem": "PNP.accepted_generated_package_implies_p_eq_np",
        "leanConcreteFinalReportBridgeFinalReportTheorem": "PNP.final_report_bridge",
        "leanConcreteFinalReportBridgeRequiresSuppliedSATHardness": false,
        "leanConcreteFinalReportBridgeLoopCertificateExistenceDischarged": false,
        "leanConcreteFinalReportBridgeScope": "checked-all-input-concrete-cook-levin-hardness-consumed-by-the-active-conditional-final-report-bridge-explicit-proof-bearing-pccmin-loop-existence-still-required"
      },
      "theorems": {
        "PNP.sat_np_hard_checked": {
          "hash": "ebcaa13f070d5b1f8fc0105e0feea71c65010f94a5e135ae0c4abaf4544fb382",
          "axioms": [
            "Classical.choice",
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.SAT"
        },
        "PNP.sat_np_complete_checked": {
          "hash": "4ed163e43a3c4fd3be9ea3d1d5c348a0ce4951beb322aca3c617265e63b0fd26",
          "axioms": [
            "Classical.choice",
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.SAT"
        },
        "PNP.accepted_generated_package_implies_p_eq_np": {
          "hash": "89cfb0983711ce18a75e458324047e6007ac456dbdc926f09080db41d826379f",
          "axioms": [
            "Classical.choice",
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Bridge"
        },
        "PNP.final_report_bridge": {
          "hash": "956062f71216218a1edb59039ae63f85c01564a93e7a1e891754127f3e22c8a5",
          "axioms": [
            "Classical.choice",
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.Bridge"
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
      "number": 244,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-244",
      "id": "pccmin-output-cone-pruning",
      "title": "Derived physical output cones and checked unused-gate pruning",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire NAND candidate and complete ordered output word, M244 computes the least physical gate-predecessor closure of actual gate-valued outputs using the existing finite work-list saturation. It proves output inclusion, predecessor closure, leastness and absence of gate-valued external boundary wires. The existing checked support extractor is reused, its boundary is renamed to original primary inputs, and every ordered output position is reconnected, including constants and repeated wires. Eleven universal interfaces establish complete input/output equivalence, non-increasing physical gate count, exact retained-plus-deleted accounting, invariant semantic reference minimum, exact residual-slack savings, strict gain exactly when a gate is deleted and the concrete PCCMin normalizer outcome. The caller supplies only the implementation. All eleven interfaces are explicit-root built with only propext and Quot.sound.",
      "nonClaim": "This is a computed physical unused-gate pruning stage, not complete manuscript N1-N10 normalization or full-profile/metadata support derivation. The empty profile index describes only this physical closure; arbitrary full-profile observers may distinguish the pruned implementation. A no-deletion branch does not imply semantic minimality or ZeroSlack. The pass reuses executable closure and checked extraction; reference minimum occurs in specification theorems, not in execution. No proper-support Package E rewrite ledger, full-profile carrier/obligation transport, global terminal family, complete rank-decreasing route coverage or total PCCMin oracle is constructed. No uniformly encoded-size polynomial execution theorem for the complete construction is proved. No unconditional SaturatePositive, BCELReady or ZeroSlack, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinOutputConePruningFormalized": true,
        "leanPCCMinOutputConePruningAxiomAuditPassed": true,
        "leanPCCMinOutputConePruningAuditedDeclarationCount": 11,
        "leanPCCMinOutputConePruningOutputCoverageTheorem": "PNP.DirectWire.outputConeRecords_output",
        "leanPCCMinOutputConePruningPredecessorClosureTheorem": "PNP.DirectWire.outputConeRecords_closed",
        "leanPCCMinOutputConePruningLeastConeTheorem": "PNP.DirectWire.outputConeRecords_least",
        "leanPCCMinOutputConePruningNoExternalGateTheorem": "PNP.DirectWire.outputConeRecords_noExternalGate",
        "leanPCCMinOutputConePruningEquivalenceTheorem": "PNP.DirectWire.outputConeImplementation_equivalent",
        "leanPCCMinOutputConePruningGateCountTheorem": "PNP.DirectWire.outputConeImplementation_gateCount_le",
        "leanPCCMinOutputConePruningGateAccountingTheorem": "PNP.DirectWire.outputConeImplementation_exact_accounting",
        "leanPCCMinOutputConePruningReferenceMinimumTheorem": "PNP.DirectWire.outputConeImplementation_referenceMinimum",
        "leanPCCMinOutputConePruningResidualSlackTheorem": "PNP.DirectWire.outputConeImplementation_residualSlack",
        "leanPCCMinOutputConePruningStrictGainTheorem": "PNP.DirectWire.outputConeImplementation_strictGain_iff",
        "leanPCCMinOutputConePruningNormalizerTheorem": "PNP.DirectWire.outputConeNormalizer_checked",
        "leanPCCMinOutputConePruningFullProfilePreservationProved": false,
        "leanPCCMinOutputConePruningPolynomialRuntimeProved": false,
        "leanPCCMinOutputConePruningScope": "all-finite-nand-candidates-derived-least-physical-output-predecessor-cone-checked-support-extraction-original-io-semantics-exact-deletion-accounting-and-physical-normalizer-stage-only"
      },
      "theorems": {
        "PNP.DirectWire.outputConeRecords_output": {
          "hash": "4a84fda6540cca8fb6973022a6b2fd87a24e4dcb3d9fb88fdfd7c8a220fb4cd3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeRecords_closed": {
          "hash": "35b36dfb577ea36b54a521a9821c3e8d8fd9b561aa8621f87160088ad2607005",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeRecords_least": {
          "hash": "acbdad00014ed703ae3b6e5d8752f55e13d47c0238b477892758b9ca0fbb572d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeRecords_noExternalGate": {
          "hash": "378d1260b7d2ee62fe165ac89564e432ba1747781f13686e17d9a83e75cf47be",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_equivalent": {
          "hash": "064356bbc6da79448d31aa75eb34b149ee082822f42a2521b60da9930f85bcb6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_gateCount_le": {
          "hash": "8da639dbcc1460fb5ef3f78e62cc27e8379c52ce5a8181a0ef9fe54644fe95cc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_exact_accounting": {
          "hash": "c794c33214594e260a14552758c307ea23e1c3c945388c3a27a496263cb739a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_referenceMinimum": {
          "hash": "a607337089e55510c9b9c32b166b739b728b3626fa58c63f043d35817b82308b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_residualSlack": {
          "hash": "8a9a1ad3414ffd5caf2ee0ee7a3bc9f1f7db7ac3654b34eff9d189fdeb5c327b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeImplementation_strictGain_iff": {
          "hash": "74d077b8e8abb30b93dfefa3d0b836c39794144e2fa3b55883b6ea1040e5ef35",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.outputConeNormalizer_checked": {
          "hash": "943e610f7a7ff686071f1adda11a52a5659428fa1fa8649254444ca20e982fd6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
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
      "number": 245,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-245",
      "id": "pccmin-dead-support-context",
      "title": "Computed dead-support frames and proper physical deletion",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire NAND implementation, M245 computes the physical complement of its output cone and proves that the actual extracted dead support has no outgoing interface. Its incoming wires are connected to original inputs or the computed live frontier; the live program also carries every original ordered output as bypass. The support is the actual extracted candidate, reindexed only by its proved empty interface. A concrete FramedContext inserts that support with the original physical gate count and plugs a zero-gate replacement with complete original output semantics. Twenty general interfaces establish exact boundary values, extraction identity, local and framed equivalence, retained-plus-dead gate accounting, exact residual-slack savings and a computed physical gain witness precisely when both dead support and live cone are nonempty. All twenty interfaces are explicit-root built with only propext and Quot.sound. No support, frame or correctness certificate is supplied by the caller.",
      "nonClaim": "This is a computed proper physical deletion component, not complete manuscript Package E admissibility or a complete N1-N10 rewrite ledger. Properness concerns the actual gate subset and concrete frame, not full-profile carrier and obligation compatibility. An all-unused circuit is not accepted as a proper-subset witness. Rejecting this route does not imply semantic minimality or ZeroSlack. The construction does not search reference minima; the reference minimum occurs only in specification theorems. No arbitrary full-profile preservation, complete Package E verifier, terminal-derived global family, complete rank-decreasing route coverage or total PCCMin oracle is constructed. No uniformly encoded-size polynomial execution theorem for the complete construction is proved. No unconditional SaturatePositive, BCELReady or ZeroSlack, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinDeadSupportContextFormalized": true,
        "leanPCCMinDeadSupportContextAxiomAuditPassed": true,
        "leanPCCMinDeadSupportContextAuditedDeclarationCount": 20,
        "leanPCCMinDeadSupportContextFrontierSemanticsTheorem": "PNP.DirectWire.outputConeFrontierCandidate_semantics",
        "leanPCCMinDeadSupportContextEmptyInterfaceTheorem": "PNP.DirectWire.deadSupport_interface_empty",
        "leanPCCMinDeadSupportContextGatePartitionTheorem": "PNP.DirectWire.deadSupportGateCount_partition",
        "leanPCCMinDeadSupportContextDeletedCountTheorem": "PNP.DirectWire.deadSupportGateCount_eq_deleted",
        "leanPCCMinDeadSupportContextBoundaryValuesTheorem": "PNP.DirectWire.deadSupportEnvironment_boundary",
        "leanPCCMinDeadSupportContextBypassOutputsTheorem": "PNP.DirectWire.deadSupportEnvironment_bypass",
        "leanPCCMinDeadSupportContextActualExtractionTheorem": "PNP.DirectWire.deadSupportCandidate_extracted",
        "leanPCCMinDeadSupportContextExtractedProgramTheorem": "PNP.DirectWire.deadSupportCandidate_program",
        "leanPCCMinDeadSupportContextLocalEquivalenceTheorem": "PNP.DirectWire.deadSupportEmptyReplacement_equivalent",
        "leanPCCMinDeadSupportContextFramedEquivalenceTheorem": "PNP.DirectWire.deadSupportContext_plug_equivalent",
        "leanPCCMinDeadSupportContextOriginalFrameSizeTheorem": "PNP.DirectWire.deadSupportContext_original_size",
        "leanPCCMinDeadSupportContextReplacementGateCountTheorem": "PNP.DirectWire.deadSupportReplacement_gateCount",
        "leanPCCMinDeadSupportContextReplacementEquivalenceTheorem": "PNP.DirectWire.deadSupportReplacement_equivalent",
        "leanPCCMinDeadSupportContextReplacementAccountingTheorem": "PNP.DirectWire.deadSupportReplacement_accounting",
        "leanPCCMinDeadSupportContextResidualSlackTheorem": "PNP.DirectWire.deadSupportReplacement_residualSlack",
        "leanPCCMinDeadSupportContextStrictGainTheorem": "PNP.DirectWire.deadSupportReplacement_strictGain_iff",
        "leanPCCMinDeadSupportContextProperAcceptanceTheorem": "PNP.DirectWire.deadSupportProperGain_isSome_iff",
        "leanPCCMinDeadSupportContextProperGainSoundnessTheorem": "PNP.DirectWire.deadSupportProperGain_sound",
        "leanPCCMinDeadSupportContextAllDeadRejectionTheorem": "PNP.DirectWire.deadSupportProperGain_none_of_all_dead",
        "leanPCCMinDeadSupportContextNoDeadRejectionTheorem": "PNP.DirectWire.deadSupportProperGain_none_of_no_dead",
        "leanPCCMinDeadSupportContextFullProfileAdmissibilityProved": false,
        "leanPCCMinDeadSupportContextCompletePackageEVerifierProved": false,
        "leanPCCMinDeadSupportContextPolynomialRuntimeProved": false,
        "leanPCCMinDeadSupportContextScope": "all-finite-nand-implementations-computed-dead-gate-complement-empty-interface-exact-extracted-support-live-frontier-environment-framed-replacement-and-nonempty-proper-physical-gain-only"
      },
      "theorems": {
        "PNP.DirectWire.outputConeFrontierCandidate_semantics": {
          "hash": "3dc1bb632f4ffbc3f0f1c8b32c170e70b6ba9812eb06eb4066c75d9a6f3f0055",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinOutputConePruning"
        },
        "PNP.DirectWire.deadSupport_interface_empty": {
          "hash": "906b882fffcfde65b4de880537a04e1ec9dacb5647cbcb9bc8ec4d80abbf83f8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportGateCount_partition": {
          "hash": "6edafb52a2e5ff5d1866967dd0a8b4a94b759429dc0d71486ccd5b6d76ad563a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportGateCount_eq_deleted": {
          "hash": "82d59d27ed1c3cd19002619b0d1cfbb0606623acafcaf1c6fa659905da8a368b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportEnvironment_boundary": {
          "hash": "162da320d61d2549c4fdbf27b8c6d91d1462fa130d351b14d87af2e39fcca254",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportEnvironment_bypass": {
          "hash": "7a706583784a3a8000d311fc7d744eee0afcda9bbeb244cb59df9ad5aa3f5c68",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportCandidate_extracted": {
          "hash": "eda366bcc7644aad67a9a8ff4a47b8911fe7d9defe1cfb08e707913c29605cf1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportCandidate_program": {
          "hash": "e3b9e0c33c87b292695750a5e2b3b17ff3c190ccbe5b314647ca6367496c7fb2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportEmptyReplacement_equivalent": {
          "hash": "a491c8f37fa95a7803005f043458bf5e0d62066c51082781b9d3764acede3e9f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportContext_plug_equivalent": {
          "hash": "5de578a40f9d237158105924b2591a08cf0576898fed1eaab43799879c6343ec",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportContext_original_size": {
          "hash": "4c0b8ad72564b492a3e161db0f6c3d4f5731da4959b699585c8d8dbe5da54d71",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportReplacement_gateCount": {
          "hash": "e3049d0cee3f4870ea9d8f60100ff98dcd8105310e20579ba4f80b0f53d4870c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportReplacement_equivalent": {
          "hash": "d5c1b86dfb34461c8b300d3647fcf54e8cf46b3104122595beb6368b2660bc2a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportReplacement_accounting": {
          "hash": "61abe459f6ba20d1aea0ec9b3c26821fbf405e12aea50fdaa986a89c90fb186c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportReplacement_residualSlack": {
          "hash": "5adb0248d3e63508b978489c8710df0d8ee4835cd2e8e33ea6d8fd7f4971225c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportReplacement_strictGain_iff": {
          "hash": "9620a0e22c4e3cafafdf4ee248b08b0d5205b3e378e4bed1aa743be59a8f7b26",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportProperGain_isSome_iff": {
          "hash": "c031fe639898d6671d76e28409b5204852aa290dd37c6e294b6a641fd1cc55b2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportProperGain_sound": {
          "hash": "51cc13a8b4d0c917107a5199e03f5a5a862e30b01ad4c3d6265c2065daf755a2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportProperGain_none_of_all_dead": {
          "hash": "c7b2036d09f1e80c0f2367ed5046c49fc5aea9412e2b59b7404ddc4bad68dc11",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
        },
        "PNP.DirectWire.deadSupportProperGain_none_of_no_dead": {
          "hash": "36242686b99f11d533a8fd54ab724dd586c89e621d25d9bea4b0ab3e57d0c40a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportContext"
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
      "number": 246,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-246",
      "id": "pccmin-dead-support-full-mode",
      "title": "Full finite-profile and obligation acceptance for computed dead-support gains",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire implementation and input finite profile observation system, M246 classifies the actual M245 proper dead-support replacement without an exhaustive physical support or reference-minimum search. It reuses the complete profile mismatch scan and adds a canonical obligation-role scan. No proper support, first full-profile mismatch, first open obligation and accepted full-mode result are distinct proof-bearing outcomes. Eight general interfaces prove exact obligation-scan completeness, first-failure prefixes, acceptance precisely when computed properness, complete profile equality and observed obligation discharge all hold, exact no-proper-support rejection, full-profile minimum invariance as a specification theorem, and branch soundness with physical equivalence, properness, exact size/slack savings and strict descent. Accepted results inhabit the existing full-carrier interface. All eight interfaces are explicit-root built with only propext and Quot.sound. No result, profile-invariance premise or correctness certificate is supplied by the caller.",
      "nonClaim": "This is computed acceptance against an input finite profile observation system, not derivation of the manuscript carrier or its semantic dependency graph. Checking observed obligation bits is not a constructed R5 creation or R6-R8 discharge ledger, and does not by itself establish complete Package E admissibility. Full-profile equality is not replaced by quotient equality; matching profiles with an open obligation are rejected. No-proper-support rejection excludes only this computed dead-support route, not every physical gain or a smaller semantic implementation. A mismatch or open obligation is explicit rejecting data, not a completed global routing theorem. The full-profile reference minimum appears only in a specification theorem; it is not computed by the classifier. No bound on the supplied observer computation or uniformly encoded-size polynomial runtime is established. No terminal-derived global family, complete N1-N10 normalization, full Package E verifier, total PCCMin oracle, unconditional SaturatePositive, BCELReady or ZeroSlack, deterministic CNFSAT in P or eligible root theorem is established. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinDeadSupportFullModeFormalized": true,
        "leanPCCMinDeadSupportFullModeAxiomAuditPassed": true,
        "leanPCCMinDeadSupportFullModeAuditedDeclarationCount": 8,
        "leanPCCMinDeadSupportFullModeObligationScanTheorem": "PNP.DirectWire.firstTerminalOpenObligation_eq_none_iff",
        "leanPCCMinDeadSupportFullModeFirstOpenObligationTheorem": "PNP.DirectWire.firstTerminalOpenObligation_spec",
        "leanPCCMinDeadSupportFullModeCurrentObligationsTheorem": "PNP.DirectWire.DeadSupportFullModeGain.currentObligationsDischarged",
        "leanPCCMinDeadSupportFullModeAcceptanceTheorem": "PNP.DirectWire.classifyDeadSupportFullMode_accepted_iff",
        "leanPCCMinDeadSupportFullModeNoProperSupportTheorem": "PNP.DirectWire.classifyDeadSupportFullMode_noProperSupport_iff",
        "leanPCCMinDeadSupportFullModeFullProfileMinimumTheorem": "PNP.DirectWire.DeadSupportFullModeGain.fullProfileMinimum",
        "leanPCCMinDeadSupportFullModeAcceptedSoundnessTheorem": "PNP.DirectWire.DeadSupportFullModeGain.checked",
        "leanPCCMinDeadSupportFullModeClassifierSoundnessTheorem": "PNP.DirectWire.classifyDeadSupportFullMode_checked",
        "leanPCCMinDeadSupportFullModeManuscriptCarrierDerived": false,
        "leanPCCMinDeadSupportFullModeCompletePackageEVerifierProved": false,
        "leanPCCMinDeadSupportFullModePolynomialRuntimeProved": false,
        "leanPCCMinDeadSupportFullModeScope": "computed-proper-dead-support-complete-finite-profile-and-observed-obligation-acceptance-over-input-observation-system-no-derived-manuscript-carrier-or-discharge-ledger"
      },
      "theorems": {
        "PNP.DirectWire.firstTerminalOpenObligation_eq_none_iff": {
          "hash": "1a0c93b1d9ce168b0e077280cb41ed9ab682db406f7d6915b2fe6e327a1de60d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.firstTerminalOpenObligation_spec": {
          "hash": "123d777771db64aaaf53b9dd42a834694d86f7088c8d422008be7f445842e8be",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.DeadSupportFullModeGain.currentObligationsDischarged": {
          "hash": "4439af8e42be526327a645db512351e9373ca77858c4adb172d5167b23a684d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.classifyDeadSupportFullMode_accepted_iff": {
          "hash": "b552736e74904695506adb00c52b18047de6cdc4af1890f01d5a66a4b8cca642",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.classifyDeadSupportFullMode_noProperSupport_iff": {
          "hash": "d08c20b2c7b9af0a2cdc926dcf66fe1bb7809c1d0cddd3f5ecee698c6454188a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.DeadSupportFullModeGain.fullProfileMinimum": {
          "hash": "feeab8f455701e6dd448e31dab4a596148cc02258492127d0f40cdde76a99f44",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.DeadSupportFullModeGain.checked": {
          "hash": "4cad2c9d19dd6d8d490643fe8145e7962898c2cb63eef3af2560f31a21baf729",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
        },
        "PNP.DirectWire.classifyDeadSupportFullMode_checked": {
          "hash": "e45814982c40279fd2e49a52e93e7428012a6dc5003e3effc7222977a0fb8e50",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinDeadSupportFullMode"
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
      "number": 247,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-247",
      "id": "pccmin-constant-propagation",
      "title": "Computed constant propagation through arbitrary NAND programs",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire NAND program, M247 computes retained-source aliases for all original gates, substitutes them before inspecting each NAND operation, eliminates a gate exactly when literal constant NAND identities determine its value, and rewrites the complete ordered output tuple. Ten general interfaces prove primitive constant recognition sound for every valuation, alias semantics, exact retained-plus-eliminated gate accounting, complete multi-output equivalence, non-increasing size, invariant reference minimum, exact residual-slack savings, strict gain exactly when an elimination occurs, strict residual descent and the computed outcome of the existing total normalizer interface. Earlier constant eliminations propagate through arbitrarily later gates. The primitive recognition theorem is axiom-free; the other nine interfaces use only propext and Quot.sound. No optimizer, result, semantic equivalence certificate or caller correctness assertion is supplied.",
      "nonClaim": "This is the physical literal-constant structural-congruence component, not complete manuscript R1-R9 verification or N1-N10 normalization. No-elimination does not imply semantic minimality or ZeroSlack: the regression retains NAND(x, NAND(x,x)) even though a zero-gate constant-true word is equivalent. No full-profile preservation, derived manuscript carrier, arbitrary-support pullback/expansion, obligation lifecycle ledger, complete Package E or total PCCMin oracle is established. The reference minimum is used only in specification theorems, not executed by the pass. No uniformly encoded-size polynomial runtime, output-size or certificate-size theorem is established. Unconditional SaturatePositive, BCELReady and ZeroSlack, deterministic CNFSAT in P and the eligible root theorem remain open. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinConstantPropagationFormalized": true,
        "leanPCCMinConstantPropagationAxiomAuditPassed": true,
        "leanPCCMinConstantPropagationAuditedDeclarationCount": 10,
        "leanPCCMinConstantPropagationConstantRuleTheorem": "PNP.DirectWire.constantGateValue_sound",
        "leanPCCMinConstantPropagationAliasSemanticsTheorem": "PNP.DirectWire.compileNANDConstantPropagation_alias_semantics",
        "leanPCCMinConstantPropagationGateAccountingTheorem": "PNP.DirectWire.compileNANDConstantPropagation_exact_accounting",
        "leanPCCMinConstantPropagationEquivalenceTheorem": "PNP.DirectWire.constantPropagationImplementation_equivalent",
        "leanPCCMinConstantPropagationGateCountTheorem": "PNP.DirectWire.constantPropagationImplementation_gateCount_le",
        "leanPCCMinConstantPropagationReferenceMinimumTheorem": "PNP.DirectWire.constantPropagationImplementation_referenceMinimum",
        "leanPCCMinConstantPropagationResidualSlackTheorem": "PNP.DirectWire.constantPropagationImplementation_residualSlack",
        "leanPCCMinConstantPropagationStrictGainTheorem": "PNP.DirectWire.constantPropagationImplementation_strictGain_iff",
        "leanPCCMinConstantPropagationResidualDescentTheorem": "PNP.DirectWire.constantPropagationImplementation_strictResidualDescent",
        "leanPCCMinConstantPropagationNormalizerTheorem": "PNP.DirectWire.nandConstantPropagationNormalizer_checked",
        "leanPCCMinConstantPropagationFullProfilePreservationProved": false,
        "leanPCCMinConstantPropagationCompleteNormalizationProved": false,
        "leanPCCMinConstantPropagationPolynomialRuntimeProved": false,
        "leanPCCMinConstantPropagationScope": "all-finite-direct-wire-nand-programs-computed-literal-constant-propagation-through-source-aliases-complete-ordered-io-exact-elimination-accounting-physical-normalizer-stage-only"
      },
      "theorems": {
        "PNP.DirectWire.constantGateValue_sound": {
          "hash": "0ec6cff2be375dc0eb181e160e267405a485d3e2ac41b4a8cec33b994f02b2a8",
          "axioms": [],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.compileNANDConstantPropagation_alias_semantics": {
          "hash": "499c24a8a4455a18159223191f8879034e87f39f45493973fb81c4076c4ced7e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.compileNANDConstantPropagation_exact_accounting": {
          "hash": "50d1f42a8732f6563a48dec3a1c364f41ed9fccfb0b4c7ed72faa382c3013c87",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_equivalent": {
          "hash": "85b42a5ccf8a28af9ba9b19ee9b73eecc63dfe63ca306777b395881fc6c9aabc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_gateCount_le": {
          "hash": "7da5157348a386861cf8b2cb5ef617fc89d16409f8640de9376957b344b3ab29",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_referenceMinimum": {
          "hash": "9631c6094e82f3e0ce1b4c45bb4fa4e892321fd2746ff3437cddafd9130c9ae3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_residualSlack": {
          "hash": "532ee6acbab9c551e3da7a3cb6296b1c405458f6bb821e059826bb3aed1c0981",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_strictGain_iff": {
          "hash": "f2447341b74dc43f0d98a5fb3a63dc153eef0da71d28017060be06238796d7e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.constantPropagationImplementation_strictResidualDescent": {
          "hash": "96c02d048c9f50fb371e546364a55c1d5bf364fdcb626b38aafda1f9724fb785",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
        },
        "PNP.DirectWire.nandConstantPropagationNormalizer_checked": {
          "hash": "7d26c6a7ceba21244ab334e8524b55ee9ff5e0f046c5c535506d2553f8106b3b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinConstantPropagation"
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
      "number": 248,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-248",
      "id": "pccmin-physical-normalization-closure",
      "title": "Computed closure of constant propagation, NAND sharing and output-cone pruning",
      "classification": "formalized-foundation-only",
      "scope": "For every finite direct-wire implementation, M248 computes a priority-respecting loop over the actual constant-propagation, NAND-sharing and output-cone-pruning constructions. It selects the first positive saving, recurses on strictly smaller physical gate count, and stops only when all three computed savings vanish on the same final implementation. Twelve general interfaces prove complete ordered-output equivalence, exact per-pass and telescoping trace savings, strict selected gains, priority, common quiescence, unchanged quiescent inputs, idempotent re-execution, invariant semantic reference minimum, exact residual-slack savings and a gain-iteration bound by the original slack. The existing normalizer interface exposes every positive total saving as a strict gain. All proof fields are derived by the construction, with no supplied normalizer, oracle, result or stopping certificate. The twelve interfaces use only propext and Quot.sound.",
      "nonClaim": "This is operational quiescence for exactly three physical passes, not semantic minimality, all structural congruences, complete manuscript N1-N10 normalization or ZeroSlack. The regression remains quiescent on NAND(x, NAND(x,x)) while a zero-gate constant-true word is strictly smaller and equivalent. The trace is not the arbitrary-support Pull/Expand materializer transport required by the complete Traceable normalization theorem. Full-profile preservation, the manuscript carrier and R5/R6-R8 obligation lifecycle ledger, complete Package E and the total PCCMin oracle remain open. Semantic reference minima occur only in specifications and are not executed by this loop. An iteration bound is not a runtime bound: no uniformly encoded-size polynomial construction, runtime, output-size or certificate-size theorem is established. Unconditional SaturatePositive, BCELReady and ZeroSlack, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanPCCMinPhysicalNormalizationClosureFormalized": true,
        "leanPCCMinPhysicalNormalizationClosureAxiomAuditPassed": true,
        "leanPCCMinPhysicalNormalizationClosureAuditedDeclarationCount": 12,
        "leanPCCMinPhysicalNormalizationClosurePassEquivalenceTheorem": "PNP.DirectWire.physicalNormalizationPass_equivalent",
        "leanPCCMinPhysicalNormalizationClosurePassAccountingTheorem": "PNP.DirectWire.physicalNormalizationPass_exact_accounting",
        "leanPCCMinPhysicalNormalizationClosureSelectedGainTheorem": "PNP.DirectWire.PhysicalNormalizationGain.checked",
        "leanPCCMinPhysicalNormalizationClosurePrioritySelectionTheorem": "PNP.DirectWire.nextPhysicalNormalizationStep_checked",
        "leanPCCMinPhysicalNormalizationClosureTraceAccountingTheorem": "PNP.DirectWire.PhysicalNormalizationTrace.checked",
        "leanPCCMinPhysicalNormalizationClosureComputedClosureTheorem": "PNP.DirectWire.runPhysicalNormalization_checked",
        "leanPCCMinPhysicalNormalizationClosureQuiescentInputTheorem": "PNP.DirectWire.runPhysicalNormalization_of_quiescent",
        "leanPCCMinPhysicalNormalizationClosureIdempotenceTheorem": "PNP.DirectWire.runPhysicalNormalization_idempotent",
        "leanPCCMinPhysicalNormalizationClosureReferenceMinimumTheorem": "PNP.DirectWire.runPhysicalNormalization_referenceMinimum",
        "leanPCCMinPhysicalNormalizationClosureResidualSlackTheorem": "PNP.DirectWire.runPhysicalNormalization_residualSlack",
        "leanPCCMinPhysicalNormalizationClosureIterationBoundTheorem": "PNP.DirectWire.runPhysicalNormalization_gainIterations_le_residualSlack",
        "leanPCCMinPhysicalNormalizationClosureNormalizerTheorem": "PNP.DirectWire.physicalClosureNormalizer_checked",
        "leanPCCMinPhysicalNormalizationClosureFullProfilePreservationProved": false,
        "leanPCCMinPhysicalNormalizationClosureCompleteNormalizationProved": false,
        "leanPCCMinPhysicalNormalizationClosurePolynomialRuntimeProved": false,
        "leanPCCMinPhysicalNormalizationClosureScope": "all-finite-direct-wire-implementations-computed-priority-three-pass-physical-closure-common-quiescence-actual-strict-trace-exact-savings-idempotent-result-no-complete-manuscript-normalization-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.physicalNormalizationPass_equivalent": {
          "hash": "1e98dba1264aa27ff4c269a804a91c3280100aafeb59f4f000c84c1916f3d186",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.physicalNormalizationPass_exact_accounting": {
          "hash": "229aea7c24bfd7a753d61ab458d77663ab7afe172c669dae30155cf90dceccdb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.PhysicalNormalizationGain.checked": {
          "hash": "427337b3b71051ea6183892626f713e70e71a95dbc47a589b6d041d5a82d1a33",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.nextPhysicalNormalizationStep_checked": {
          "hash": "1790d801558465f07fa0c179acef3b6ef54ce7e749207a96844b0bc38d5166b8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.PhysicalNormalizationTrace.checked": {
          "hash": "a0a622312d96848ad1fa1080be5fe4922be9e260ef640539d021401739cb0ec5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_checked": {
          "hash": "dcc99d344b550bc094a11cb3c5276d275222849728f0532089e7b5cdf5b266a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_of_quiescent": {
          "hash": "289992dec9ffe984bb89f69e00a6b4e2fdc7187c4bda3d53130f7d87c6195c8e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_idempotent": {
          "hash": "b11d9128d7a75c26f45a83ea6a800200f61acf33709d285bd809d1ae13031664",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_referenceMinimum": {
          "hash": "962346c00f368bc0320f4008d01920dddab26c57f4cfb6e0c66571c7bfebecb1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_residualSlack": {
          "hash": "798ff693e7e90fbfd2d71794a07d1b9fe44c00d9e7509d6f73f412002276106b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.runPhysicalNormalization_gainIterations_le_residualSlack": {
          "hash": "681cc73dd14a8ec8a6df53b1317bfb870911e3b54646d8ce58cccc4cba8378c9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
        },
        "PNP.DirectWire.physicalClosureNormalizer_checked": {
          "hash": "b5ae9aa84bf7be2011daca12a1a9f6213b8182b8a968265d116fecccdaa4509a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.PCCMinPhysicalNormalizationClosure"
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
      "number": 249,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-249",
      "id": "arbitrary-support-splice",
      "title": "Computed arbitrary-support literal NAND replacement and topological compilation",
      "classification": "formalized-foundation-only",
      "scope": "For all finite raw NAND graphs, M249 computes a topological order from the actual source fields or rejects the unresolved cyclic remainder. The ordered program has one position for every original node, exact size and complete output semantics for every solution of the original equations. For arbitrary finite terminal support records, it then constructs the actual literal splice from the canonical exterior gates, computed boundary and interface, replacement word and every original ordered output. Every accepted splice has exactly the exterior size plus replacement size; an equivalent replacement preserves all outputs, and a strict local physical saving yields a strict whole-program saving. Actual production saturation derives a primary-input-only boundary and hence unconditional compilation success, without a supplied frame, order, wiring map or acyclicity certificate. Its result agrees in size and semantics with the existing production physical constructor. Twenty-four interfaces have exactly reviewed dependencies contained in propext and Quot.sound.",
      "nonClaim": "Arbitrary raw port compatibility and equal open Boolean functions do not by themselves guarantee acyclic literal wiring. The regression gives an equivalent replacement with a raw graph solution but a genuine dependency cycle, which the compiler rejects. This is a physical substitution and well-formedness result, not a contradiction of the manuscript's unconstructed complete carrier premises. Full-profile preservation, the manuscript carrier and R5/R6-R8 obligation lifecycle, arbitrary-support Pull/Expand materializer identities, complete Package E and complete normalization remain open. No semantic minimum is computed, no unconditional global route is supplied, and a finite node-count termination argument is not a total encoded-size polynomial runtime theorem. Unconditional SaturatePositive, BCELReady and ZeroSlack, exact polynomial PCCMin, deterministic CNFSAT in P and the eligible root remain open. No fixed weighted checkpoint or global gate closes; P = NP is not proved.",
      "fields": {
        "leanArbitrarySupportSpliceFormalized": true,
        "leanArbitrarySupportSpliceAxiomAuditPassed": true,
        "leanArbitrarySupportSpliceAuditedDeclarationCount": 24,
        "leanArbitrarySupportSpliceCompilerSuccessTheorem": "PNP.DirectWire.compileRawNandGraph_success_iff",
        "leanArbitrarySupportSpliceCompilerFailureTheorem": "PNP.DirectWire.compileRawNandGraph_failure_iff",
        "leanArbitrarySupportSpliceRawOutputSemanticsTheorem": "PNP.DirectWire.CompiledRawNandGraph.candidate_semantics",
        "leanArbitrarySupportSpliceExactGateCountTheorem": "PNP.DirectWire.ArbitrarySupportSplice.result_gateCount",
        "leanArbitrarySupportSpliceGraphEquationsTheorem": "PNP.DirectWire.ArbitrarySupportSplice.values_solution",
        "leanArbitrarySupportSpliceGlobalSemanticsTheorem": "PNP.DirectWire.ArbitrarySupportSplice.result_semantics",
        "leanArbitrarySupportSplicePartitionTheorem": "PNP.DirectWire.ArbitrarySupportSplice.exterior_accounting",
        "leanArbitrarySupportSpliceExactAccountingTheorem": "PNP.DirectWire.ArbitrarySupportSplice.result_exact_accounting",
        "leanArbitrarySupportSpliceStrictGainTheorem": "PNP.DirectWire.ArbitrarySupportSplice.result_strict_gain",
        "leanArbitrarySupportSpliceProductionOrderTheorem": "PNP.DirectWire.ArbitrarySupportSplice.graph_rank_decreases",
        "leanArbitrarySupportSpliceProductionSuccessTheorem": "PNP.DirectWire.ArbitrarySupportSplice.production_compiles",
        "leanArbitrarySupportSpliceProductionAgreementTheorem": "PNP.DirectWire.ArbitrarySupportSplice.production_agreement",
        "leanArbitrarySupportSpliceUnrestrictedReplacementSuccessProved": false,
        "leanArbitrarySupportSpliceFullProfilePreservationProved": false,
        "leanArbitrarySupportSpliceCompletePackageEProved": false,
        "leanArbitrarySupportSplicePolynomialRuntimeProved": false,
        "leanArbitrarySupportSpliceScope": "all-finite-actual-supports-computed-literal-exterior-replacement-graph-derived-topological-order-complete-ordered-output-semantics-exact-accounting-cyclic-rejection-production-saturation-success-physical-only"
      },
      "theorems": {
        "PNP.DirectWire.RawNandCompilationState.readSource_sound": {
          "hash": "249ab589fff275624335e93a95c3b2862e7571861f602a9a70b13a65f877b61c",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.RawNandCompilationState.readGate_sound": {
          "hash": "2122df5770802861ba07cdbd547afc012daaae5702e26b0ed87181952af491cb",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.RawNandReadyStep.apply_remaining_lt": {
          "hash": "a167205196de2bd40e72deecb2cf8d099f4c3e64fc9b638a866d324547db644e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.RawNandCompilationStop.unresolved_predecessor": {
          "hash": "05ebc6f9f02d6a05eeca50202e1cb0b913b033ecfe8e548b43569b8aeb033959",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.RawNandCompilationStop.complete_of_wellFounded": {
          "hash": "1bb645c9e89c90ce8195e4185efc1bb97909240430e67450da59cf4087748d0c",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.CompiledRawNandGraph.wellFounded": {
          "hash": "4e407ec0b1b11c26e305f4b6933706dbafecb931aee26181165cb570de6e2353",
          "axioms": [],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.compileRawNandGraph_success_iff": {
          "hash": "93307f1d06f33a85af1e05f01ec9cb33db389877e5c9f7bd1838b989ae1100b7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.compileRawNandGraph_failure_iff": {
          "hash": "5c942c77b078d5717609c444cea6c87b8bdbd45d707659bccad6c810dabc1d66",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.CompiledRawNandGraph.candidate_gateCount": {
          "hash": "e8190898d052060480bd4856f59cc987c79c8f0127fdfbaced645bce19e40156",
          "axioms": [],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.CompiledRawNandGraph.candidate_semantics": {
          "hash": "cc989aa0ce66ace1cf344b38d9f00f6cd0c7057f5bddae614e2d4c0c9913aaa1",
          "axioms": [],
          "module": "PNP.NANDTopologicalCompiler"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.result_gateCount": {
          "hash": "e54d5da539b9ee0e0d8334b9bca202caaea0d91c02a040ca33773eda06c0efe4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.compile_success_iff": {
          "hash": "50d8a57ea6ec2910278d2f8d31b8b580d18486f4bef6a051ee0bf546e534df8b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.compile_failure_iff": {
          "hash": "3ccc9106581f2cae3f36f17be8f58d78c0071aa0c39f3d4863f3144970ce558e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.replacementSource_eval": {
          "hash": "6e1004ed4845279079fee1f84c482fdeb9bad1c0b34174b94215098871f0f553",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.originalSource_eval": {
          "hash": "a78632aaf6fd18c70508d245380e821a57d1961c728ffca10021a3327560042a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.values_solution": {
          "hash": "510b56c2ce6bb2e14b51d6b5921d6cac369c5b88e127bf54b6ddad1e156af91d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.result_semantics": {
          "hash": "6940158e70561f97abcff887d83b2ee27c06864ea746b60c80fa4a06b6324200",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.exterior_accounting": {
          "hash": "cfc111a947f4eb06bd738d6258c46e598a3bfcfc7fccabe13aef8a8bb8a8c994",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.result_exact_accounting": {
          "hash": "6da5b36305b6fd26bfb41c1554e744f5c6dd11308b5e20ea9df7829b657ea763",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.result_strict_gain": {
          "hash": "acc58cbe89243294ea56091b30ffa196725aeb3ba18c3577923ba033711b06f3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_rank_decreases": {
          "hash": "67c8f06262ace5918cb8e3f61c626b82fc4ef041148c7cac0b553fff6238e7ec",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_wellFounded_of_primaryBoundary": {
          "hash": "f3976f6579060f445aefe21487ac307efdcc929f9b469af1f56fc92cb2a9fb86",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.production_compiles": {
          "hash": "900469aefe05cde3d9a9976d31672a502e532ee629545d7392785b2db9e3a00c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.production_agreement": {
          "hash": "4184ac9ce3304d128becafaeeaeb180ab9a96b5431e4a3fb3ad7280bf99b6846",
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
      "number": 250,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-250",
      "id": "wire-carrier-transport",
      "title": "Computed wire-backed carrier preservation under physical normalization and replacement",
      "classification": "formalized-foundation-only",
      "scope": "For all finite implementations with an ordered tuple of literal computational field sources, M250 exposes ordinary outputs followed by every field without adding NAND gates. Exact pack/unpack identities retain the program and ordered sources. The actual three-pass physical normalizer preserves every ordinary output and field value, has exact trace accounting, reaches common quiescence and is idempotent. Every selected field producer belongs to the computed support interface, even when no ordinary output uses it. The actual arbitrary-support splice compiler preserves both observation classes under equality of the complete extracted open function, counts every exterior and replacement gate, transfers strict local savings and rejects cyclic literal wiring. Production predecessor closure is derived from the combined physical program without a supplied observer, order, map or successful result. Sixteen interfaces have exactly reviewed dependencies contained in propext and Quot.sound.",
      "nonClaim": "This represents and transports wire-backed computational fields; the wire bindings are actual input data, not a derivation of the complete manuscript carrier or every noncomputational record, role and history. Proof-only records do not become Boolean sources. The empty additional abstract profile in the physical specialization does not assert that the full manuscript profile is empty. R5/R6-R8 obligation creation and discharge, arbitrary-support Pull/Expand materializer identities, complete Package E and N1-N10, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact PCCMin and total encoded-size polynomial bounds remain open. Equal local Boolean functions do not guarantee acyclic arbitrary literal splicing; the compiler can reject them. No semantic minimum is executed, no fixed weighted checkpoint or global gate closes, deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireCarrierTransportFormalized": true,
        "leanWireCarrierTransportAxiomAuditPassed": true,
        "leanWireCarrierTransportAuditedDeclarationCount": 16,
        "leanWireCarrierTransportPackUnpackTheorem": "PNP.DirectWire.WireCarrier.exposed_unpack",
        "leanWireCarrierTransportUnpackPackTheorem": "PNP.DirectWire.WireCarrier.unpack_exposed",
        "leanWireCarrierTransportNormalizationOutputTheorem": "PNP.DirectWire.WireCarrier.normalize_output",
        "leanWireCarrierTransportNormalizationFieldTheorem": "PNP.DirectWire.WireCarrier.normalize_field",
        "leanWireCarrierTransportNormalizationAccountingTheorem": "PNP.DirectWire.WireCarrier.normalize_exact_accounting",
        "leanWireCarrierTransportNormalizationQuiescenceTheorem": "PNP.DirectWire.WireCarrier.normalize_quiescent",
        "leanWireCarrierTransportNormalizationIdempotenceTheorem": "PNP.DirectWire.WireCarrier.normalize_idempotent",
        "leanWireCarrierTransportHiddenFieldInterfaceTheorem": "PNP.DirectWire.WireCarrier.field_producer_visible",
        "leanWireCarrierTransportSpliceOutputTheorem": "PNP.DirectWire.WireCarrier.splice_output",
        "leanWireCarrierTransportSpliceFieldTheorem": "PNP.DirectWire.WireCarrier.splice_field",
        "leanWireCarrierTransportSpliceAccountingTheorem": "PNP.DirectWire.WireCarrier.splice_exact_accounting",
        "leanWireCarrierTransportSpliceStrictGainTheorem": "PNP.DirectWire.WireCarrier.splice_strict_gain",
        "leanWireCarrierTransportSpliceExecutionTheorem": "PNP.DirectWire.WireCarrier.splice_checked",
        "leanWireCarrierTransportCyclicRejectionTheorem": "PNP.DirectWire.WireCarrier.splice_failure_iff",
        "leanWireCarrierTransportProductionBoundaryTheorem": "PNP.DirectWire.WireCarrier.production_boundary_isInput",
        "leanWireCarrierTransportProductionSuccessTheorem": "PNP.DirectWire.WireCarrier.production_compiles",
        "leanWireCarrierTransportFullManuscriptCarrierDerived": false,
        "leanWireCarrierTransportObligationLifecycleProved": false,
        "leanWireCarrierTransportUnrestrictedReplacementSuccessProved": false,
        "leanWireCarrierTransportCompletePackageEProved": false,
        "leanWireCarrierTransportPolynomialRuntimeProved": false,
        "leanWireCarrierTransportScope": "all-finite-literal-wire-backed-computational-fields-complete-ordered-exposure-computed-normalization-and-arbitrary-support-splice-value-preservation-exact-physical-accounting-derived-production-predecessors-no-full-manuscript-carrier-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireCarrier.exposed_unpack": {
          "hash": "52b06e232ee698792723138e1bd7c233a0df92fc0596e5d1cb5a5ad3a6998ab2",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.unpack_exposed": {
          "hash": "e4bc75b87eb806542a29c7a7c6e523ba784ae91d2cdd3f258df74dee3a50190f",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.normalize_output": {
          "hash": "16061da3c8919111c1c6978a464a20b8569b0699b37cd393eb2dcdec5c9056aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.normalize_field": {
          "hash": "7db27122f63ded43c385da4a7261d23c7e9879d028553550b08aa876d4792416",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.normalize_exact_accounting": {
          "hash": "a198f6730e3dc53bbc9b1ab5c0422213e3d608a01e5db509eecdba8758f2ff2b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.normalize_quiescent": {
          "hash": "34ab38584d59be857e7cf3a55c64f5c88f1f90c4dd2f40d67daa464aa8075ecd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.normalize_idempotent": {
          "hash": "f7cce5f43df79ea96c60e655cb5b86173522fde20c2234a439868221011420c5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.field_producer_visible": {
          "hash": "bc09f579729f6afb62951d1703ece5a713fe6a4beeed9cc53ca40c6fe3761b84",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_output": {
          "hash": "411dc13ea230fc22b77724331e9e1c33714d660a4a604cfd7898538c8786f74c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_field": {
          "hash": "4ba4f77a1c9283281452654d90c7345f8d0f8c6dc9191e0605cda7c42484bb0d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_exact_accounting": {
          "hash": "5f466be2d9ebc3e5d9cf6e0e846f82bbaf1b888e89e12f38adf89aef53fd7d58",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_strict_gain": {
          "hash": "4123bc53c6f2b6de684443b5c59fc548ccec92315b2f414fe8bc2a34a4585be6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_checked": {
          "hash": "98107b6a054e0da36408a39910ff8938933712f48a4a2f5dd669b98900d303f9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.splice_failure_iff": {
          "hash": "8267d78155cac9ef72b19406e8a7b9e94064d7c675dddea99d1ef3e7c6fb881e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.production_boundary_isInput": {
          "hash": "685e00c4d3d3038805c3db5f9c6b028a28ae8ef39c7cadab56e116151fafc1fc",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
        },
        "PNP.DirectWire.WireCarrier.production_compiles": {
          "hash": "09f0bee838b9d67f46d451c461a6272810bef6ec49d7b00cd1e4c615cefa8e22",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireCarrier"
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
      "number": 251,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-251",
      "id": "wire-obligation-restoration",
      "title": "Computed lost-wire projection obligations and fully charged restoration",
      "classification": "formalized-foundation-only",
      "scope": "For every finite wire-backed carrier and finite keep mask, M251 computes the actual projected NAND word and one shared materializer for all forgotten computational fields. Literal common-input concatenation restores every ordinary output and every ordered field for all valuations, with exact projected-plus-materializer physical gate charge and an output gate-count bound of twice the original. The mask derives exactly the forgotten coordinates, each with an original-source-bound R5 creation and actual restored-source-bound full-value R8 discharge. The computed independent event ledger creates and discharges every lost coordinate once and closes under replay; whole-trace identity validation rejects reusing an already discharged identity. Gain detection pays the complete materializer before requiring a strict decrease. No observer, restoration program, discharge trace or correctness certificate is supplied. Twenty-two interfaces have exactly reviewed dependencies contained in propext and Quot.sound.",
      "nonClaim": "This is the computational lost-wire slice of the manuscript's projection and R5/full-R8 requirements, not the full carrier or complete finite-kernel rewrite and obligation calculus. The keep mask is an input, not a derived global route. Noncomputational records, R6/R7 cancellation, arbitrary obligation-dependency DAGs, complete Package E and N1-N10, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact PCCMin and total encoded-size polynomial runtime remain open. Quotient padding is not full-field agreement. Restoration need not be a net gain or a semantic minimum. The twice-original gate bound is only an output-size fact, not a total polynomial execution or certificate-size theorem. No fixed weighted checkpoint or global gate closes, deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireObligationRestorationFormalized": true,
        "leanWireObligationRestorationAxiomAuditPassed": true,
        "leanWireObligationRestorationAuditedDeclarationCount": 22,
        "leanWireObligationRestorationProjectedOutputTheorem": "PNP.DirectWire.WireObligationRestoration.projected_output",
        "leanWireObligationRestorationProjectedKeptFieldTheorem": "PNP.DirectWire.WireObligationRestoration.projected_kept_field",
        "leanWireObligationRestorationMaterializerForgottenFieldTheorem": "PNP.DirectWire.WireObligationRestoration.materializer_forgotten_field",
        "leanWireObligationRestorationJoinOutputTheorem": "PNP.DirectWire.WireObligationRestoration.join_output",
        "leanWireObligationRestorationJoinKeptFieldTheorem": "PNP.DirectWire.WireObligationRestoration.join_kept_field",
        "leanWireObligationRestorationJoinForgottenFieldTheorem": "PNP.DirectWire.WireObligationRestoration.join_forgotten_field",
        "leanWireObligationRestorationRestoredOutputTheorem": "PNP.DirectWire.WireObligationRestoration.restored_output",
        "leanWireObligationRestorationRestoredFieldTheorem": "PNP.DirectWire.WireObligationRestoration.restored_field",
        "leanWireObligationRestorationExactGateChargeTheorem": "PNP.DirectWire.WireObligationRestoration.restored_exact_gate_charge",
        "leanWireObligationRestorationGateBoundTheorem": "PNP.DirectWire.WireObligationRestoration.restored_gate_bound",
        "leanWireObligationRestorationCreatedCoordinatesTheorem": "PNP.DirectWire.WireObligationRestoration.created_exact",
        "leanWireObligationRestorationDischargedCoordinatesTheorem": "PNP.DirectWire.WireObligationRestoration.discharged_exact",
        "leanWireObligationRestorationForgottenMaskTheorem": "PNP.DirectWire.WireObligationRestoration.mem_forgottenCoordinates_iff",
        "leanWireObligationRestorationCreationMembershipTheorem": "PNP.DirectWire.WireObligationRestoration.creation_iff",
        "leanWireObligationRestorationDischargeMembershipTheorem": "PNP.DirectWire.WireObligationRestoration.discharge_iff",
        "leanWireObligationRestorationClosedReplayTheorem": "PNP.DirectWire.WireObligationRestoration.replay_closed",
        "leanWireObligationRestorationFullDischargeValueTheorem": "PNP.DirectWire.WireObligationRestoration.dischargeR8_full_value",
        "leanWireObligationRestorationGainIffTheorem": "PNP.DirectWire.WireObligationRestoration.gain?_isSome_iff",
        "leanWireObligationRestorationCheckedGainTheorem": "PNP.DirectWire.WireObligationRestoration.gain_checked",
        "leanWireObligationRestorationCreationUniquenessTheorem": "PNP.DirectWire.WireObligationRestoration.created_nodup",
        "leanWireObligationRestorationDischargeUniquenessTheorem": "PNP.DirectWire.WireObligationRestoration.discharged_nodup",
        "leanWireObligationRestorationDuplicateIdentityRejectionTheorem": "PNP.DirectWire.WireObligationRestoration.replay_rejects_duplicate_ids",
        "leanWireObligationRestorationFullManuscriptCarrierDerived": false,
        "leanWireObligationRestorationCompleteObligationCalculusProved": false,
        "leanWireObligationRestorationGeneralDependencyDAGProved": false,
        "leanWireObligationRestorationCompletePackageEProved": false,
        "leanWireObligationRestorationPolynomialRuntimeProved": false,
        "leanWireObligationRestorationScope": "all-finite-computational-wire-fields-actual-quotient-projection-shared-materializer-full-value-restoration-exact-gate-charge-derived-r5-full-r8-coordinate-ledger-whole-trace-unique-identities-no-full-manuscript-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireObligationRestoration.projected_output": {
          "hash": "9db137ff572598f27b8978c1e20592987442afe9518444b13a1a82be7389eafe",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.projected_kept_field": {
          "hash": "18eb453392e344b669686f436529edc8eac10935796c5d660dadd58dae0dd27e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.materializer_forgotten_field": {
          "hash": "443dd40f055b1440727c3b6bae6e475ed159bf3fbe5d61093d6730f33d7f5950",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.join_output": {
          "hash": "39bf1aac304078048078a936243756c731ef9e036aa97339424f1134457abab9",
          "axioms": [],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.join_kept_field": {
          "hash": "2beb641b17d6f90f1029f1c56ea226ba65d1b4a59e8bc22f39c08f9b1cd671e3",
          "axioms": [],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.join_forgotten_field": {
          "hash": "dbf92adf17c0520daefcd37b20bdae3868600663f73e69ccfd63479f6018b061",
          "axioms": [],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.restored_output": {
          "hash": "f2700308348906c76b750ce766a97d50c2c3e1c59f590ddc475384824b87cd37",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.restored_field": {
          "hash": "64df896b2a0483021625f23df9f82a1b4d3316916a5b3e49acdc52fb3300ea24",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.restored_exact_gate_charge": {
          "hash": "1dce5aeceb99a472a85441e2e20f95970b141bc335e78f0c6cbf8914ae355196",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.restored_gate_bound": {
          "hash": "024165d580947e53951cc622e0da244a7b8b1c4073546afb4688274afa4bfb25",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.created_exact": {
          "hash": "4e4f8fd06ec135760827ee6c7912f228bacb3c130c6265ca4f6a613e24cf947b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.discharged_exact": {
          "hash": "5768997e5f284d7fcd7f257d1c98475dd57c5c94c0183077411b26e656173b77",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.mem_forgottenCoordinates_iff": {
          "hash": "fd19fd4184326b9f8b1a2d2c366ae70cc639af00735742284e1027676d54a47a",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.creation_iff": {
          "hash": "f1b7532d0e888e57ce1b16f0ddce0fb03687dd335558c639939cde0654bcc0a0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.discharge_iff": {
          "hash": "4ae3a648df20849a27c29b2ad75f4dc2493b20b56ee7a970431a22d427cd7bab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.replay_closed": {
          "hash": "fe9eebebe76bf2c9468b1c74b8283cac786fe19c63c2b7e66eb11b38bbb2d842",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.dischargeR8_full_value": {
          "hash": "ece2b699fc6d36735d7a62f772db312386c33ff388e1c0ed2b2a1ecba9bac05f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.gain?_isSome_iff": {
          "hash": "d0d8ddb1749b477af29863f43640eb7241a06445a9db2aa09f661b1fdaf0ad20",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.gain_checked": {
          "hash": "6371bbe19d03e7455d308a83c48154ad5a8e97f39508b74b05e040314d9d877c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.created_nodup": {
          "hash": "c13d5f7f593ff543a7d6367f4513a07b09fac14a1bd804494d2b4f58418608ae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.discharged_nodup": {
          "hash": "de37f4291ba5722db2e4309d9d837e4ed439a819ee82f6fb1fc131be2b87954e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
        },
        "PNP.DirectWire.WireObligationRestoration.replay_rejects_duplicate_ids": {
          "hash": "e946fbe19d83be47720897f76d693bace11654c868189c7bbf1ef43ddcf679e6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireObligationRestoration"
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
      "number": 252,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-252",
      "id": "wire-quotient-lift",
      "title": "Computed quotient replacement lift with matched materializer costs",
      "classification": "formalized-foundation-only",
      "scope": "For every finite computational wire carrier, finite keep mask and replacement satisfying local quotient agreement on all ordinary outputs and every kept field, M252 constructs the literal replacement-plus-shared-materializer word. All ordinary outputs and all ordered computational fields agree with the original for every valuation. The same derived materializer gives exact natural gate charges and matched integer cost differences for the reference lift and the replacement expansion. Cancellation transports a saving only against the lifted reference; an original-circuit gain separately requires the full replacement-plus-materializer cost to be strictly smaller than the original. Lost-field discharges bind the original R5 source to the actual expanded source and derive full-value witnesses without any agreement about the replacement's forgotten fields. The computed gain test retains the local quotient premise and returns a complete equivalent strict gain with every field preserved. Seventeen general interfaces have exact reviewed dependencies propext and Quot.sound.",
      "nonClaim": "This is a computational word-level quotient lift, not arbitrary-support Pull/Expand or an embedding of the reference lift into the original circuit. The keep mask, replacement and local quotient agreement are inputs; the construction does not discover replacements or derive that local agreement. The lifted reference can exceed the original gate count, and a relative saving can leave no original gain. It does not complete the manuscript carrier, R6/R7 and general obligation-dependency DAG calculus, N1-N10, Package E, global routing, unconditional SaturatePositive, BCELReady or ZeroSlack, exact PCCMin or total encoded-size polynomial construction, runtime, output and certificate bounds. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireQuotientLiftFormalized": true,
        "leanWireQuotientLiftAxiomAuditPassed": true,
        "leanWireQuotientLiftAuditedDeclarationCount": 17,
        "leanWireQuotientLiftExpandedReferenceTheorem": "PNP.DirectWire.WireQuotientLift.expanded_reference",
        "leanWireQuotientLiftReferenceChargeTheorem": "PNP.DirectWire.WireQuotientLift.referenceLift_charge",
        "leanWireQuotientLiftExpandedChargeTheorem": "PNP.DirectWire.WireQuotientLift.expanded_charge",
        "leanWireQuotientLiftReferenceChargeDifferenceTheorem": "PNP.DirectWire.WireQuotientLift.referenceLift_charge_difference",
        "leanWireQuotientLiftExpandedChargeDifferenceTheorem": "PNP.DirectWire.WireQuotientLift.expanded_charge_difference",
        "leanWireQuotientLiftMatchedMaterializerChargeTheorem": "PNP.DirectWire.WireQuotientLift.matched_materializer_charge",
        "leanWireQuotientLiftRelativeSavingIffTheorem": "PNP.DirectWire.WireQuotientLift.relative_saving_iff",
        "leanWireQuotientLiftOriginalGainIffTheorem": "PNP.DirectWire.WireQuotientLift.original_gain_iff",
        "leanWireQuotientLiftExpandedOutputTheorem": "PNP.DirectWire.WireQuotientLift.expanded_output",
        "leanWireQuotientLiftExpandedKeptFieldTheorem": "PNP.DirectWire.WireQuotientLift.expanded_kept_field",
        "leanWireQuotientLiftExpandedForgottenFieldTheorem": "PNP.DirectWire.WireQuotientLift.expanded_forgotten_field",
        "leanWireQuotientLiftExpandedFieldTheorem": "PNP.DirectWire.WireQuotientLift.expanded_field",
        "leanWireQuotientLiftExpandedEquivalenceTheorem": "PNP.DirectWire.WireQuotientLift.expanded_equivalent",
        "leanWireQuotientLiftDischargeSourceExactTheorem": "PNP.DirectWire.WireQuotientLift.discharge_source_exact",
        "leanWireQuotientLiftDischargeFullValueTheorem": "PNP.DirectWire.WireQuotientLift.discharge_full_value",
        "leanWireQuotientLiftGainIffTheorem": "PNP.DirectWire.WireQuotientLift.checkedGain_isSome_iff",
        "leanWireQuotientLiftCheckedGainTheorem": "PNP.DirectWire.WireQuotientLift.CheckedGain.checked",
        "leanWireQuotientLiftFullManuscriptPullExpandProved": false,
        "leanWireQuotientLiftReferenceLiftIdentifiedWithOriginal": false,
        "leanWireQuotientLiftAutomaticQuotientAgreementDerived": false,
        "leanWireQuotientLiftCompleteObligationCalculusProved": false,
        "leanWireQuotientLiftCompletePackageEProved": false,
        "leanWireQuotientLiftPolynomialRuntimeProved": false,
        "leanWireQuotientLiftScope": "all-finite-computational-wire-quotient-compatible-replacements-literal-shared-materializer-full-value-lift-exact-matched-integer-charges-original-cost-gain-test-expanded-source-bound-discharge-no-arbitrary-support-embedding-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireQuotientLift.expanded_reference": {
          "hash": "dad34b516523dd4761eed9fe0e51f4ea277af7b09f47963376a231f88769b9cd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.referenceLift_charge": {
          "hash": "8ef5fa5a1c3f72b8696d60b96ef30bf041e06d6e0118eddbd369e9724eff784e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_charge": {
          "hash": "2c390754add81c66fce0e7f06d9645887fe99f409f56ba5017ff019de0bddafe",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.referenceLift_charge_difference": {
          "hash": "161d81be5eddf99fbe120d07fe2e28283f4f1ab98ea1f44bfca25d8008074f7c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_charge_difference": {
          "hash": "20cc0581c6b78bc09932db012b163951a02c5e74a768868d168ee7798d9ca5e7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.matched_materializer_charge": {
          "hash": "c406464ebafae4e77738d6900db05342b1eb36847dd4c16a949349a336dceba7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.relative_saving_iff": {
          "hash": "f01eace00b52eeaabe4b5144a8d72ae541387ecd4d6aa29b4e7b93ce11d96be8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.original_gain_iff": {
          "hash": "cd38b27471456bec443545e4111706f83a73acfeadc512c9bde1ceb01f6e4ff5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_output": {
          "hash": "e56816eefc3ae363d597a4f30f061a13912dbbfcc6bbbcdc7c563680de9264b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_kept_field": {
          "hash": "68f9c76da6c2c6180c8093c20d9e72ad9e718ddd3bc5b632cfbb1624ba946969",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_forgotten_field": {
          "hash": "1f311380a7b47553cc0b7c9e271589f1cb34ea176ae44f84850935604aff7191",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_field": {
          "hash": "ad7fd204b29e8141d7942bfbed034296c89b8aea9996e92d2e915e6e8326c0af",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.expanded_equivalent": {
          "hash": "39f297948af422b3a8643984303c0773bcea23dc75a1a4b834f31245346d6da1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.discharge_source_exact": {
          "hash": "4f253f28d63c4ef390842de5ec99c84a819d2fa3e69b0f67ecaecb5ac7d4547f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.discharge_full_value": {
          "hash": "7b121a128cf884fcad0435492949da493316ec268b54a558c1c5c89ff3745677",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.checkedGain_isSome_iff": {
          "hash": "79cbe56d948918e2995435dee395b44858bc98bd351f66b8a341479318d7db93",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
        },
        "PNP.DirectWire.WireQuotientLift.CheckedGain.checked": {
          "hash": "61ca863d7794e9ce01dd17ac5f76237d0c0d0019009f62d3c07decfe4f977fd7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireQuotientLift"
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
      "number": 253,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-12-253",
      "id": "wire-frontier-lift",
      "title": "Computed original-accounted frontier replacement",
      "classification": "formalized-foundation-only",
      "scope": "For every finite computational wire carrier and keep mask, M253 computes the predecessor cone of ordinary and kept observations, then extracts its complete interface from the original fully exposed carrier. Selected forgotten field producers and exterior consumers participate in that frontier. Predecessor closure derives a primary-input-only boundary and actual replacement compiler success without a supplied support, order or success certificate. Every original exterior gate is retained exactly once. Original and expanded gate counts split into pulled or replacement gates plus the same actual exterior charge, giving matched integer differences and an exact original-saving equivalence. Equality with the complete extracted open function derives all ordinary and ordered computational field values and full discharges bound to the actual expanded sources. The computed proper-gain query separately requires proper support and strict local saving, then returns an actual original-circuit equivalent strict gain with every field preserved. Eighteen general interfaces have exact reviewed dependencies propext and Quot.sound.",
      "nonClaim": "This is a computational frontier lift for one input-derived visible predecessor cone, not arbitrary-support Pull/Expand across all manuscript traces. The keep mask, replacement and complete local open-function agreement are inputs. Ordinary-output or quotient-only agreement does not imply the stronger completed-frontier premise. No replacement search or automatic local agreement is proved. A whole-support saving is not a proper-support certificate. The construction does not complete the full manuscript carrier, noncomputational profile fields, R6/R7 and general obligation-dependency DAG calculus, N1-N10, Package E, global routing, unconditional SaturatePositive, BCELReady or ZeroSlack, exact PCCMin or total encoded-size polynomial construction, runtime, output and certificate bounds. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireFrontierLiftFormalized": true,
        "leanWireFrontierLiftAxiomAuditPassed": true,
        "leanWireFrontierLiftAuditedDeclarationCount": 18,
        "leanWireFrontierLiftOrdinaryOutputSelectedTheorem": "PNP.DirectWire.WireFrontierLift.ordinary_output_selected",
        "leanWireFrontierLiftKeptFieldSelectedTheorem": "PNP.DirectWire.WireFrontierLift.kept_field_selected",
        "leanWireFrontierLiftPredecessorClosureTheorem": "PNP.DirectWire.WireFrontierLift.records_predecessor_closed",
        "leanWireFrontierLiftSelectedFieldFrontierTheorem": "PNP.DirectWire.WireFrontierLift.selected_field_in_frontier",
        "leanWireFrontierLiftPrimaryBoundaryTheorem": "PNP.DirectWire.WireFrontierLift.primary_boundary",
        "leanWireFrontierLiftOriginalChargeTheorem": "PNP.DirectWire.WireFrontierLift.original_charge",
        "leanWireFrontierLiftCompileIsSomeTheorem": "PNP.DirectWire.WireFrontierLift.compile_isSome",
        "leanWireFrontierLiftExpandedChargeTheorem": "PNP.DirectWire.WireFrontierLift.expanded_charge",
        "leanWireFrontierLiftMatchedOriginalChargeTheorem": "PNP.DirectWire.WireFrontierLift.matched_original_charge",
        "leanWireFrontierLiftOriginalGainIffTheorem": "PNP.DirectWire.WireFrontierLift.original_gain_iff",
        "leanWireFrontierLiftExpandedOutputTheorem": "PNP.DirectWire.WireFrontierLift.expanded_output",
        "leanWireFrontierLiftExpandedFieldTheorem": "PNP.DirectWire.WireFrontierLift.expanded_field",
        "leanWireFrontierLiftExpandedEquivalenceTheorem": "PNP.DirectWire.WireFrontierLift.expanded_equivalent",
        "leanWireFrontierLiftDischargeSourceExactTheorem": "PNP.DirectWire.WireFrontierLift.discharge_source_exact",
        "leanWireFrontierLiftDischargeFullValueTheorem": "PNP.DirectWire.WireFrontierLift.discharge_full_value",
        "leanWireFrontierLiftProperIffExteriorPositiveTheorem": "PNP.DirectWire.WireFrontierLift.proper_iff_exterior_positive",
        "leanWireFrontierLiftProperGainIffTheorem": "PNP.DirectWire.WireFrontierLift.checkedProperGain_isSome_iff",
        "leanWireFrontierLiftCheckedProperGainTheorem": "PNP.DirectWire.WireFrontierLift.ProperGain.checked",
        "leanWireFrontierLiftEveryArbitrarySupportCovered": false,
        "leanWireFrontierLiftAutomaticLocalAgreementDerived": false,
        "leanWireFrontierLiftFullManuscriptPullExpandProved": false,
        "leanWireFrontierLiftCompleteObligationCalculusProved": false,
        "leanWireFrontierLiftCompletePackageEProved": false,
        "leanWireFrontierLiftPolynomialRuntimeProved": false,
        "leanWireFrontierLiftScope": "all-finite-computational-wire-input-derived-quotient-visible-cone-completed-original-frontier-primary-boundary-actual-compiler-full-local-open-agreement-original-exterior-once-exact-integer-charges-strict-proper-gain-no-full-manuscript-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireFrontierLift.ordinary_output_selected": {
          "hash": "8931e68e92d35b11528e401a2794cd957f15aa680c3fc0d403792565c3877b60",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.kept_field_selected": {
          "hash": "f1e883390878267faaeb4e079fe8a8e6b1beaa818ee6289321b290e4569fd7a3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.records_predecessor_closed": {
          "hash": "aaac754e3944140d3f9ab991fe42cc844199ca686b2df52f3853c289f980dc22",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.selected_field_in_frontier": {
          "hash": "4562d68496b552354fc79fa2203f76209b5c82152af04989e379d7661041e2c6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.primary_boundary": {
          "hash": "5f646ed8a46cd2fa78f3546ae15d17d10c7885b90c986df52e58dfd81c92bacd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.original_charge": {
          "hash": "4eb5b3b2bea74fa2ef8f74430443fcf91703578efaa7c5bd240750acab1fe673",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.compile_isSome": {
          "hash": "c7c54aca037e1809f3dc247e6b2fdd8400610a8534d0c13421fd92b7e1a68e9f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.expanded_charge": {
          "hash": "e1cd44f5181734485e18c9715033158ca360b888eda0f51e70b366d77760e88a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.matched_original_charge": {
          "hash": "3a44ac86b851eae886ec1c90d7f6a70b18873d9c25053910cf09fdd27c27b16a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.original_gain_iff": {
          "hash": "2f4fcc36271b2b7ccbc96c064df4296c60498f617f0e9a7b0335a2f727ce584b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.expanded_output": {
          "hash": "bf326f0b42446e9c7acb8321afdbba90d86db4221d2a49b46ab390dc6fdf82af",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.expanded_field": {
          "hash": "d44019f1b34aea6e5192f1121e790d79176267f1a59f0a6d69153e4a38061378",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.expanded_equivalent": {
          "hash": "71984fb9b72d71ad9ea78dd7d83d517064e2ec2a8f911fb1508962c71627c0ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.discharge_source_exact": {
          "hash": "5648f9e263315b547073b009e005fbeb0dc23065179daa94744fabe0068bb945",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.discharge_full_value": {
          "hash": "5f76bac96ea0779b49d2e6c7db6cdc3f3d6a953ba834835e0a449c951a741738",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.proper_iff_exterior_positive": {
          "hash": "3ad5423b315def909a850c9f775b9bf51ced9833a9566b82978770b779319441",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.checkedProperGain_isSome_iff": {
          "hash": "419ea770c1d5c32e79ec2f3bc59d1d4497d1b447f3e363a5e70e9e2326d5a01e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
        },
        "PNP.DirectWire.WireFrontierLift.ProperGain.checked": {
          "hash": "a3092c4aca64494c0ac7112cf82d000da02b4a4a61ae545f8b74719dc436a2a4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireFrontierLift"
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
      "number": 254,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-254",
      "id": "wire-matched-cancellation",
      "title": "Computed full-mode wire cancellation",
      "classification": "formalized-foundation-only",
      "scope": "For every finite computational wire carrier and keep mask, M254 computes canonical retained representatives by literal source identity in the original ordinary outputs and kept fields. The precise local quotient-agreement premise derives each matched forgotten wire's full value in the actual replacement. A computed resolved mask selects one actual shared materializer for the remaining unresolved wires, with an explicit zero-gate case when all fields resolve. The expanded word preserves every ordinary output and ordered computational field, and has exactly replacement gates plus its actual materializer charge. Computed R6 cancellations and R8 restorations carry full-value witnesses bound to that expanded source. Their generated R5/discharge ledger covers exactly the forgotten coordinates, closes with no pending obligations and rejects creation-identity reuse across the whole transcript, including already discharged entries. The fully paid whole-word gain query compares the actual expansion with the original gate count. Twenty-six general interfaces have reviewed propext-only or propext-and-Quot.sound dependencies.",
      "nonClaim": "This is an original-source-identity computational R6 case, not every semantic cancellation or the complete manuscript obligation calculus. The keep mask, replacement and precise local quotient agreement are inputs; forgotten-field equality, supplied representatives, materializer weights and global correctness certificates are not. Syntactically different but semantically equal wires may remain unresolved. No universal comparison with independently normalized earlier materializers is proved. A whole-word strict gain is not a proper-support Package E certificate. The full manuscript carrier, noncomputational profile fields, R7 and arbitrary dependency DAGs, all-trace N1-N10 normalization, complete Package E, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact PCCMin and total encoded-size polynomial construction, runtime, output and certificate bounds remain open. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireMatchedCancellationFormalized": true,
        "leanWireMatchedCancellationAxiomAuditPassed": true,
        "leanWireMatchedCancellationAuditedDeclarationCount": 26,
        "leanWireMatchedCancellationRepresentativeAvailabilityTheorem": "PNP.DirectWire.WireMatchedCancellation.representative_isSome_iff",
        "leanWireMatchedCancellationRetainedObservationValueTheorem": "PNP.DirectWire.WireMatchedCancellation.observation_value",
        "leanWireMatchedCancellationRepresentativeFullValueTheorem": "PNP.DirectWire.WireMatchedCancellation.Representative.full_value",
        "leanWireMatchedCancellationAllResolvedSoundnessTheorem": "PNP.DirectWire.WireMatchedCancellation.allResolved_sound",
        "leanWireMatchedCancellationAllResolvedChargeTheorem": "PNP.DirectWire.WireMatchedCancellation.charge_allResolved",
        "leanWireMatchedCancellationUnresolvedMaterializerFieldTheorem": "PNP.DirectWire.WireMatchedCancellation.missing_unresolved_field",
        "leanWireMatchedCancellationMaterializerChargeBoundTheorem": "PNP.DirectWire.WireMatchedCancellation.charge_bound",
        "leanWireMatchedCancellationVisibleResolvedFieldTheorem": "PNP.DirectWire.WireMatchedCancellation.visible_resolved_field",
        "leanWireMatchedCancellationExpandedChargeTheorem": "PNP.DirectWire.WireMatchedCancellation.expanded_charge",
        "leanWireMatchedCancellationExpandedOutputTheorem": "PNP.DirectWire.WireMatchedCancellation.expanded_output",
        "leanWireMatchedCancellationExpandedFieldTheorem": "PNP.DirectWire.WireMatchedCancellation.expanded_field",
        "leanWireMatchedCancellationExpandedEquivalenceTheorem": "PNP.DirectWire.WireMatchedCancellation.expanded_equivalent",
        "leanWireMatchedCancellationDischargeWitnessFullValueTheorem": "PNP.DirectWire.WireMatchedCancellation.Discharge.full_value",
        "leanWireMatchedCancellationDischargeSourceExactTheorem": "PNP.DirectWire.WireMatchedCancellation.discharge_source_exact",
        "leanWireMatchedCancellationDischargeKindIffTheorem": "PNP.DirectWire.WireMatchedCancellation.discharge_isR6_iff",
        "leanWireMatchedCancellationComputedDischargeFullValueTheorem": "PNP.DirectWire.WireMatchedCancellation.discharge_full_value",
        "leanWireMatchedCancellationGainIffTheorem": "PNP.DirectWire.WireMatchedCancellation.checkedGain_isSome_iff",
        "leanWireMatchedCancellationCheckedGainTheorem": "PNP.DirectWire.WireMatchedCancellation.CheckedGain.checked",
        "leanWireMatchedCancellationCreatedExactTheorem": "PNP.DirectWire.WireMatchedCancellation.created_exact",
        "leanWireMatchedCancellationDischargedExactTheorem": "PNP.DirectWire.WireMatchedCancellation.discharged_exact",
        "leanWireMatchedCancellationCreationIffTheorem": "PNP.DirectWire.WireMatchedCancellation.creation_iff",
        "leanWireMatchedCancellationDischargeIffTheorem": "PNP.DirectWire.WireMatchedCancellation.discharge_iff",
        "leanWireMatchedCancellationCreatedNodupTheorem": "PNP.DirectWire.WireMatchedCancellation.created_nodup",
        "leanWireMatchedCancellationDischargedNodupTheorem": "PNP.DirectWire.WireMatchedCancellation.discharged_nodup",
        "leanWireMatchedCancellationReplayClosedTheorem": "PNP.DirectWire.WireMatchedCancellation.replay_closed",
        "leanWireMatchedCancellationRejectDuplicateIdsTheorem": "PNP.DirectWire.WireMatchedCancellation.replay_rejects_duplicate_ids",
        "leanWireMatchedCancellationAllSemanticCancellationsDerived": false,
        "leanWireMatchedCancellationArbitraryObligationDAGsCovered": false,
        "leanWireMatchedCancellationAutomaticLocalAgreementDerived": false,
        "leanWireMatchedCancellationFullManuscriptCarrierProved": false,
        "leanWireMatchedCancellationCompleteObligationCalculusProved": false,
        "leanWireMatchedCancellationCompletePackageEProved": false,
        "leanWireMatchedCancellationPolynomialRuntimeProved": false,
        "leanWireMatchedCancellationScope": "all-finite-computational-wire-original-visible-source-identity-scan-local-quotient-agreement-derived-full-r6-cancellation-unresolved-shared-r8-materializer-actual-expanded-source-exact-charge-whole-trace-unique-ids-no-complete-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireMatchedCancellation.representative_isSome_iff": {
          "hash": "9a0ce14691f7d8efab0f371697999b2d067b00a5bfc9fcd44f862f21bcc4e6ba",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.observation_value": {
          "hash": "f94cb4b0dc8e6c033764ada12c4f515a90797071f034c88ae12b3d823f08ec68",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.Representative.full_value": {
          "hash": "b427980991225d6ec290732313658035f0423b39e96246f5f2cc3dcd3eca38f3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.allResolved_sound": {
          "hash": "b8d11d28fe4db2ec5cd7e0425e4151719df9a47c68eb71bdc4f36cdeab857cd6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.charge_allResolved": {
          "hash": "315efbe39ca329c5d4d6e122ace539f26c3f3d89dbd486cbff820cc4c52d5ae7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.missing_unresolved_field": {
          "hash": "66dd6694892b90af070b2842905361dcdd6f7aa20ecb4e9b3b96b44272b43b59",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.charge_bound": {
          "hash": "1adaf4f65352bbcf5056894a1f581a8d4d2104e789f18e770823c90b6fffacde",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.visible_resolved_field": {
          "hash": "11a959061c3465bb82fa0daaabc34c0b0af67467602e70fa8838e02910ebbc5b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.expanded_charge": {
          "hash": "5c010930b10c343eb99b555161171751238b45c577a7b2ef7a27675d9cb0b2ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.expanded_output": {
          "hash": "50f302457ac646b61330aab04da7d1cdc0ac4ef53ba18b9ab1967c3d9f2c882c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.expanded_field": {
          "hash": "fd823a6e1a7a2eb2896ae0f86a9405acb41eb35d5a560e92ce5877157a5d2caa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.expanded_equivalent": {
          "hash": "d739a414f98686dfc8eacb28580976115794150dc2339039706874eb98e47488",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.Discharge.full_value": {
          "hash": "9743c4ea11a1b3ef791893c7c4700e1dfd49d8d342f318241d92e5e104c353ab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharge_source_exact": {
          "hash": "527fa079d1da2264a7c958b78b3264c08e89da693cbc4d579471d8c0a91b8fd5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharge_isR6_iff": {
          "hash": "344e9293b8d23622e47cfc82a3d9f4a7311e085d78f1111a58a118c012a6478e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharge_full_value": {
          "hash": "b2f03c46a68b1d103f2bb60d2ffebcea476463787a73e138b7db27110d4b8398",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.checkedGain_isSome_iff": {
          "hash": "75d6ee1639773cb2417ca3077af8011f6677d6c042f869b1d6691d7be3865b57",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.CheckedGain.checked": {
          "hash": "7729efcecab7e56556163bdc2bcf218be41a062a6ee285b9807ae6bd3ac2dea7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.created_exact": {
          "hash": "e32e06f39dd7a79aeeb8194892b45d5bf39b86e9014f267b438e7613d26e03c9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharged_exact": {
          "hash": "485a37483687566eff84234d8322dce65af02f4614c43d62a1c3bcddb4643cc3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.creation_iff": {
          "hash": "213a77f56b3cf7580de96510516a7c919f1b983cf81c79d8547f639d754e2ba1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharge_iff": {
          "hash": "14291497e107583d0464ec07e6ad74851f49fcc1526ef0fd7dc6e5dd7199dbcf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.created_nodup": {
          "hash": "6768c54d50fa580f817703b0ebdd6ec8bccc1e149aefc968836a475bc6055986",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.discharged_nodup": {
          "hash": "92d6396ff619ed082c562af3e0e469c7745091c66a916ff678ed6dd9cd0d4dae",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.replay_closed": {
          "hash": "1abaf7da81590fa0607285d5e8576843119d5c2dd0c92e0862235f982aa4d53e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
        },
        "PNP.DirectWire.WireMatchedCancellation.replay_rejects_duplicate_ids": {
          "hash": "fbd380c2eb40962a25bccbbcd30b86d60ec182ca41ee71beb486532d92223602",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireMatchedCancellation"
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
      "number": 255,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-255",
      "id": "wire-unary-realization",
      "title": "Computed unary full-word realization",
      "classification": "formalized-foundation-only",
      "scope": "For every unary computational wire carrier, with arbitrary original gate count, ordered ordinary outputs and computational fields, M255 derives both unary observation values from the actual source and constructs a complete zero-or-one-gate realization. Constants and the input cost zero gates; every negated observation shares the same actual NOT gate. The result preserves every ordinary output and computational field at every unary valuation. Its exact gate formula is minimal among all equivalent full computational carriers: a zero-gate source cannot negate the only boundary input. The constructor accepts no replacement, truth table, local agreement or minimizer. Source-exact R7 discharge witnesses for original R5 identities refer to the actual computed program and the original full field values. The whole-word strict-gain query succeeds whenever any equivalent full unary carrier is smaller. Eighteen general interfaces have reviewed axiom closures: five are axiom-free and thirteen use only propext and Quot.sound.",
      "nonClaim": "This is a complete unary computational word realization component for manuscript R7, not an arbitrary ambient-cut embedding, every R7 case or the complete manuscript obligation calculus. Minimum size is relative to all exposed computational observations, not ordinary outputs alone. A whole-word strict gain is not a proper-support Package E certificate. The keep mask and source-bound R5 identity are used only by the discharge interface; no supplied full-value agreement is a construction premise. There is no enumeration of implementations, but evaluating two unary inputs with recursive Program.eval does not prove polynomial encoded runtime. The full manuscript carrier, noncomputational profile fields, arbitrary obligation dependency DAGs, all-trace N1-N10 normalization, complete Package E, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and total encoded-size polynomial construction, runtime, output and certificate bounds remain open. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireUnaryRealizationFormalized": true,
        "leanWireUnaryRealizationAxiomAuditPassed": true,
        "leanWireUnaryRealizationAuditedDeclarationCount": 18,
        "leanWireUnaryRealizationObservationValueTheorem": "PNP.DirectWire.WireUnaryRealization.observation_value",
        "leanWireUnaryRealizationNegationIffTheorem": "PNP.DirectWire.WireUnaryRealization.needsNegation_iff",
        "leanWireUnaryRealizationImplementationValueTheorem": "PNP.DirectWire.WireUnaryRealization.implementation_value",
        "leanWireUnaryRealizationOutputTheorem": "PNP.DirectWire.WireUnaryRealization.realize_output",
        "leanWireUnaryRealizationFieldTheorem": "PNP.DirectWire.WireUnaryRealization.realize_field",
        "leanWireUnaryRealizationEquivalenceTheorem": "PNP.DirectWire.WireUnaryRealization.realize_equivalent",
        "leanWireUnaryRealizationFullEquivalenceTheorem": "PNP.DirectWire.WireUnaryRealization.realize_full_equivalent",
        "leanWireUnaryRealizationExactGateCountTheorem": "PNP.DirectWire.WireUnaryRealization.realize_gateCount",
        "leanWireUnaryRealizationNegationLowerBoundTheorem": "PNP.DirectWire.WireUnaryRealization.negation_requires_gate",
        "leanWireUnaryRealizationFullMinimumTheorem": "PNP.DirectWire.WireUnaryRealization.realize_minimal",
        "leanWireUnaryRealizationNonincreaseTheorem": "PNP.DirectWire.WireUnaryRealization.realize_nonincrease",
        "leanWireUnaryRealizationGateBoundTheorem": "PNP.DirectWire.WireUnaryRealization.realize_gate_bound",
        "leanWireUnaryRealizationR7WitnessFullValueTheorem": "PNP.DirectWire.WireUnaryRealization.R7Discharge.full_value",
        "leanWireUnaryRealizationR7SourceExactTheorem": "PNP.DirectWire.WireUnaryRealization.dischargeR7_source_exact",
        "leanWireUnaryRealizationComputedR7FullValueTheorem": "PNP.DirectWire.WireUnaryRealization.dischargeR7_full_value",
        "leanWireUnaryRealizationGainIffTheorem": "PNP.DirectWire.WireUnaryRealization.checkedGain_isSome_iff",
        "leanWireUnaryRealizationGainCompletenessTheorem": "PNP.DirectWire.WireUnaryRealization.checkedGain_complete",
        "leanWireUnaryRealizationCheckedGainTheorem": "PNP.DirectWire.WireUnaryRealization.CheckedGain.checked",
        "leanWireUnaryRealizationArbitraryAmbientCutsCovered": false,
        "leanWireUnaryRealizationAllR7CasesDerived": false,
        "leanWireUnaryRealizationArbitraryObligationDAGsCovered": false,
        "leanWireUnaryRealizationFullManuscriptCarrierProved": false,
        "leanWireUnaryRealizationCompleteObligationCalculusProved": false,
        "leanWireUnaryRealizationCompletePackageEProved": false,
        "leanWireUnaryRealizationPolynomialRuntimeProved": false,
        "leanWireUnaryRealizationScope": "all-unary-computational-wire-actual-two-source-valuations-arbitrary-gate-and-full-observation-counts-computed-zero-or-one-shared-not-complete-full-values-universal-full-word-minimum-source-exact-r7-discharge-complete-whole-word-gain-no-ambient-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireUnaryRealization.observation_value": {
          "hash": "0e33500a57b8014755eb324cb94a88a8003b72c517e85b6b7e9992dac62f186a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.needsNegation_iff": {
          "hash": "83a83a00275421eb25c735e9f8f24785bc9f64ba58065c0bfe8be3340d4b696d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.implementation_value": {
          "hash": "62a7a8db007388000aa40dc102f35ff142b1a810c3d490728bd4d1795a318f63",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_output": {
          "hash": "092307fb96200f321c54e0765a5bb5cf31be1013de71bf3a708e70d9a51c92e0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_field": {
          "hash": "4ad51b9f8bb60af80b01543e78080aafbb42d0a5cf812e908ba90ca4233ca484",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_equivalent": {
          "hash": "57b87868b12c3b735c89b6b006d160e423cf327024c5a6b2c3a34220e7b03718",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_full_equivalent": {
          "hash": "cb77aa4f7f9b6269386b9d8fdf342c3bfc377b24e2f7e2d8e95d5b0fc72f4113",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_gateCount": {
          "hash": "b4755d75e4153c374e4db394a5ec4bf6cd1dcce17168a45b796137b439c7bc0f",
          "axioms": [],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.negation_requires_gate": {
          "hash": "0830bed847d01bcb5eb79ae2f6558568880e61075a5d5dc0dfc4e94ea7615214",
          "axioms": [],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_minimal": {
          "hash": "8687f6a8fcc08bcb32f606829cb3fc7758013acbee8d66fc69ad3ca0c1bc3430",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_nonincrease": {
          "hash": "f23591915fb7fc1e714aeb1a108377802de42cc868ff8fe3af087e07e2a4acf6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.realize_gate_bound": {
          "hash": "8fa89009a88967d4df395926dd7a1f7c4143d1223997b2b4bf62c63fbbd2cb5a",
          "axioms": [],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.R7Discharge.full_value": {
          "hash": "9d0c1905736bf1019e6604996d70fefb515f1e137406ed5503ad0681c35b33ee",
          "axioms": [],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.dischargeR7_source_exact": {
          "hash": "19945f8412e44faedfc91210ef4e83439d564a2824edfc1f90b1a1db07d59e61",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.dischargeR7_full_value": {
          "hash": "cffef514537ebcbd880834578e28877e24ba3c25394b490fab04b0045ca064aa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.checkedGain_isSome_iff": {
          "hash": "7858c41c4efdbb472ae418a27f5d2329fff99241ac349df86b2feffd9d44b79a",
          "axioms": [],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.checkedGain_complete": {
          "hash": "8a9b3ad847ac134d943f18e2247041be14b9042a8f4aa393bf2fe50a308223f2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
        },
        "PNP.DirectWire.WireUnaryRealization.CheckedGain.checked": {
          "hash": "785fbaa771e7477604ab00a32d2db483d958dade5d53f96e2c88ceea95ccbe75",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryRealization"
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
      "number": 256,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-256",
      "id": "wire-unary-frontier",
      "title": "Computed constant and unary frontier replacement",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary computational wire carriers, original gate counts, ordered ordinary outputs, computational fields and keep masks, M256 computes the visible predecessor cone and its completed full frontier. When the actual incoming boundary has zero or one port, it derives a zero-gate constant word or the minimum complete unary word, preserving every local output at every open valuation. No replacement, truth table, semantic agreement, wire map, compilation order, compiler result or minimizer is supplied. The actual primary-boundary compiler substitutes this word into the original exterior, retained exactly once. Every ordinary output and computational field is preserved, including forgotten selected frontier fields and exterior fields depending on other ambient inputs. The result has exact replacement-plus-exterior gate count and cannot increase the original count. Source-bound R7 witnesses discharge original R5 identities with their full values in the actual expanded program. The proper-gain query computes boundary recognition, positive actual exterior and strict local saving separately; it succeeds whenever any complete local realization is smaller on such a proper recognized cone. Thirty general interfaces have reviewed axiom closures: two are axiom-free, one uses only Quot.sound and twenty-seven use only propext and Quot.sound.",
      "nonClaim": "This is source-derived constant/unary R7 realization for the computed visible predecessor cone, not every arbitrary ambient support or an external-gate boundary. Minimum size is relative to the complete fixed local frontier, not all ambient circuits with different exteriors. A whole-support saving is not a proper-support Package E certificate. More-than-unary boundaries are rejected rather than supplied with correctness certificates. Finite source evaluation and actual compiler termination are not encoded-size polynomial runtime theorems. The full manuscript carrier, noncomputational profile fields, arbitrary obligation dependency DAGs, every R5-R8 interaction, all-trace N1-N10 normalization, complete Package E, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and total encoded-size polynomial construction, runtime, output and certificate bounds remain open. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireUnaryFrontierFormalized": true,
        "leanWireUnaryFrontierAxiomAuditPassed": true,
        "leanWireUnaryFrontierAuditedDeclarationCount": 30,
        "leanWireUnaryFrontierConstantValueTheorem": "PNP.DirectWire.WireUnaryFrontier.constantWord_value",
        "leanWireUnaryFrontierConstantGateCountTheorem": "PNP.DirectWire.WireUnaryFrontier.constantWord_gateCount",
        "leanWireUnaryFrontierUnaryValueTheorem": "PNP.DirectWire.WireUnaryFrontier.unaryWord_value",
        "leanWireUnaryFrontierUnaryMinimumTheorem": "PNP.DirectWire.WireUnaryFrontier.unaryWord_minimal",
        "leanWireUnaryFrontierUnaryGateBoundTheorem": "PNP.DirectWire.WireUnaryFrontier.unaryWord_gate_bound",
        "leanWireUnaryFrontierLocalValueTheorem": "PNP.DirectWire.WireUnaryFrontier.localWord_value",
        "leanWireUnaryFrontierLocalMinimumTheorem": "PNP.DirectWire.WireUnaryFrontier.localWord_minimal",
        "leanWireUnaryFrontierLocalNonincreaseTheorem": "PNP.DirectWire.WireUnaryFrontier.localWord_nonincrease",
        "leanWireUnaryFrontierLocalGateBoundTheorem": "PNP.DirectWire.WireUnaryFrontier.localWord_gate_bound",
        "leanWireUnaryFrontierReplacementAgreementTheorem": "PNP.DirectWire.WireUnaryFrontier.replacement_agreement",
        "leanWireUnaryFrontierReplacementMinimumTheorem": "PNP.DirectWire.WireUnaryFrontier.replacement_minimal",
        "leanWireUnaryFrontierReplacementNonincreaseTheorem": "PNP.DirectWire.WireUnaryFrontier.replacement_nonincrease",
        "leanWireUnaryFrontierReplacementGateBoundTheorem": "PNP.DirectWire.WireUnaryFrontier.replacement_gate_bound",
        "leanWireUnaryFrontierZeroBoundaryGateCountTheorem": "PNP.DirectWire.WireUnaryFrontier.replacement_zero_gateCount",
        "leanWireUnaryFrontierOutputTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_output",
        "leanWireUnaryFrontierFieldTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_field",
        "leanWireUnaryFrontierEquivalenceTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_equivalent",
        "leanWireUnaryFrontierExactChargeTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_charge",
        "leanWireUnaryFrontierNonincreaseTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_nonincrease",
        "leanWireUnaryFrontierGainIffTheorem": "PNP.DirectWire.WireUnaryFrontier.expanded_gain_iff",
        "leanWireUnaryFrontierAttemptIffTheorem": "PNP.DirectWire.WireUnaryFrontier.attempt_isSome_iff",
        "leanWireUnaryFrontierAttemptOutputTheorem": "PNP.DirectWire.WireUnaryFrontier.attempt_output",
        "leanWireUnaryFrontierAttemptFieldTheorem": "PNP.DirectWire.WireUnaryFrontier.attempt_field",
        "leanWireUnaryFrontierAttemptNonincreaseTheorem": "PNP.DirectWire.WireUnaryFrontier.attempt_nonincrease",
        "leanWireUnaryFrontierAttemptChargeTheorem": "PNP.DirectWire.WireUnaryFrontier.attempt_charge",
        "leanWireUnaryFrontierR7SourceExactTheorem": "PNP.DirectWire.WireUnaryFrontier.dischargeR7_source_exact",
        "leanWireUnaryFrontierR7FullValueTheorem": "PNP.DirectWire.WireUnaryFrontier.dischargeR7_full_value",
        "leanWireUnaryFrontierProperGainIffTheorem": "PNP.DirectWire.WireUnaryFrontier.checkedProperGain_isSome_iff",
        "leanWireUnaryFrontierProperGainCompletenessTheorem": "PNP.DirectWire.WireUnaryFrontier.checkedProperGain_complete",
        "leanWireUnaryFrontierCheckedProperGainTheorem": "PNP.DirectWire.WireUnaryFrontier.ProperGain.checked",
        "leanWireUnaryFrontierArbitraryAmbientCutsCovered": false,
        "leanWireUnaryFrontierAllR7CasesDerived": false,
        "leanWireUnaryFrontierArbitraryObligationDAGsCovered": false,
        "leanWireUnaryFrontierFullManuscriptCarrierProved": false,
        "leanWireUnaryFrontierCompleteObligationCalculusProved": false,
        "leanWireUnaryFrontierCompletePackageEProved": false,
        "leanWireUnaryFrontierPolynomialRuntimeProved": false,
        "leanWireUnaryFrontierScope": "all-finite-computational-wire-source-derived-visible-predecessor-cone-completed-frontier-zero-or-one-primary-boundary-computed-minimum-local-word-actual-original-exterior-once-full-field-preservation-source-exact-r7-proper-strict-gain-no-arbitrary-support-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireUnaryFrontier.constantWord_value": {
          "hash": "582c6c6da7e892847079603a2c1e999c56485675a943444c8b3ce863e41d5129",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.constantWord_gateCount": {
          "hash": "02c30022268edc2f89c7ebdffe570f0d212a3dd21b63a796cacab6f49d47ef93",
          "axioms": [],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.unaryWord_value": {
          "hash": "095947adf6640b07f3284119fff23335824743c4e75f2adeebc1b070e5ebcff6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.unaryWord_minimal": {
          "hash": "9644515dbe2ccf8a8021425df0f39167e4cf22a038a1c2ad8c126011ba303796",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.unaryWord_gate_bound": {
          "hash": "195c48ead6423dd5bcfc9bc200792004fab15abee61174b71b96ccace8529123",
          "axioms": [],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.localWord_value": {
          "hash": "bcdc116ead3fb88e37f646a064753ec35b5e3b1178a8df46dcc945e7cd7763ed",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.localWord_minimal": {
          "hash": "9de87539b360cf8c0040e5d4768a2a55e97383687ca2414022916c4cc9a22183",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.localWord_nonincrease": {
          "hash": "7a06ee455f9fad686535a2a5f4d8112080bf2c6baf994721eba3a74c8a69dc9a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.localWord_gate_bound": {
          "hash": "bf005c2e94935b87a0cd21dd610ddffc40623f6b3da8ef76b52df09d8747ad6e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.replacement_agreement": {
          "hash": "5a6ce39f55892427c9cfe2ece32206a856269003ea4bda810911bb5ab85893ef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.replacement_minimal": {
          "hash": "1ade002576afaf298c69d90c456ef5dcf632df1b05becd67531e1907e5ac02c2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.replacement_nonincrease": {
          "hash": "4b11aeb29500651f8c1dc09bb581bafc090f2a9acb51791ce3f64cc279c422f1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.replacement_gate_bound": {
          "hash": "aaae4b28519807c79aa38af67108af95ec1bc30e1d969f9e188cf8052afe1ab2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.replacement_zero_gateCount": {
          "hash": "e2777f23b123d0c48b7d0e42400e6014da1a9ffce5dc4995999854bdd58ee444",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_output": {
          "hash": "7cf73ecff68ca9b077e40aa7dcbc504d02075a7a5211bcac5c57f54119209508",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_field": {
          "hash": "c0ed63d53076dbe42cfcaffee3b4eb437882a597efeed79fb4fd4228c35fcc09",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_equivalent": {
          "hash": "91e8aa94ca777f69bd55519d8edbdae015ac8145d978483c41aacb841ce420ab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_charge": {
          "hash": "3a064a55c067237139602b7293bc814d9502dd3f1da2fafc0cb523205816f24b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_nonincrease": {
          "hash": "aaedf60953e5cc274403a301d8dac0a256d840eb2bc45d5bad6c8953cb1336fa",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.expanded_gain_iff": {
          "hash": "e5649fb91a1558e9051e72261560f136d0a2b2de40c1aa84f336f7882688de95",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.attempt_isSome_iff": {
          "hash": "2ae8fcec0f69a026cb3401b20e819003fb80aae5a8fe31293aeeabdc60c659ea",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.attempt_output": {
          "hash": "43115671e93b1bf19c367b8f8eb3a97ea31037b8a53666824101be7777d5124a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.attempt_field": {
          "hash": "55dc6f57b5361080f99936d93b325868b463b8c9269e90ab42e9e953f831bf21",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.attempt_nonincrease": {
          "hash": "daa30772b0fb2b3c92d3772f171487a7644122cb8dd63618b857b24d3f49e521",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.attempt_charge": {
          "hash": "c13da7ce02b9d415ce896effe5b499a9b2249bede31138071b8f3c162e851519",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.dischargeR7_source_exact": {
          "hash": "07674631131aa34ff0ec625e1c1955d34fbeb54da913b397adb298da6cabaa40",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.dischargeR7_full_value": {
          "hash": "b15b4a349ce8c1670d63d9cb844eedac3b76cd855e18f328cd95782a6c5618c8",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.checkedProperGain_isSome_iff": {
          "hash": "a985b9427b18b7dd80fc8b442e23d5931780297c0743d36f051e3fafc0760769",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.checkedProperGain_complete": {
          "hash": "b3a94c1864f51e3aa6295526c3435ad710721875c202426d39e40562b44a488f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
        },
        "PNP.DirectWire.WireUnaryFrontier.ProperGain.checked": {
          "hash": "27dfb2128a2da21e7d2b104627b9e7860979c1f3332580f7ac52e1db64948521",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryFrontier"
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
      "number": 257,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-257",
      "id": "wire-unary-arbitrary-support",
      "title": "Computed constant and unary replacement on arbitrary completed supports",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire carriers, original gate counts, ordered ordinary outputs, computational fields and finite terminal-record supports, M257 derives the complete boundary and frontier from the actual exposed program. Every actual zero- or one-port boundary has a computed minimum complete local word with at most one shared NOT gate. General open-evaluation prefix causality proves that a selected frontier gate before the sole external boundary gate is represented by a literal constant. A rank derived from original gate indices then proves well-foundedness and successful compilation of this actual replacement, without a supplied rank, acyclicity certificate, order, agreement, replacement program or compiler result. Empty and primary-input boundaries are covered as well as a sole external-gate boundary. The actual exterior is retained exactly once. Every ordinary output and computational field is preserved at every ambient valuation, with exact replacement-plus-exterior charge, nonincrease and equivalent strict local-to-global saving. Source-exact full-value R7 witnesses discharge the original R5 identities. The proper-gain query computes boundary recognition, positive exterior and strict local saving, and succeeds whenever any complete local realization is smaller on a recognized proper support. Thirty-one general interfaces have reviewed axiom closures: one is axiom-free, one uses only Quot.sound and twenty-nine use only propext and Quot.sound.",
      "nonClaim": "Arbitrary support refers to the choice of finite physical support in a computational wire carrier, not arbitrary boundary width or the full manuscript carrier. Boundaries with more than one incoming port are rejected. The minimum is over complete local open realizations for the fixed extracted frontier, not over all ambient circuits or different exteriors. A whole-support saving is not a proper-support Package E certificate. Prefix causality and the source-derived rank prove termination of this compiler, not uniformly polynomial encoded-size execution. Noncomputational profile fields, arbitrary obligation dependency DAGs, every R5-R8 interaction, all-trace N1-N10 normalization, complete Package E, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and total encoded-size polynomial construction, runtime, output and certificate bounds remain open. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireUnaryArbitrarySupportFormalized": true,
        "leanWireUnaryArbitrarySupportAxiomAuditPassed": true,
        "leanWireUnaryArbitrarySupportAuditedDeclarationCount": 31,
        "leanWireUnaryArbitrarySupportPrefixCausalityTheorem": "PNP.DirectWire.terminalOpenGateEvaluation_prefix_congr",
        "leanWireUnaryArbitrarySupportSingleBoundaryCausalityTheorem": "PNP.DirectWire.terminalOpenGateEvaluation_single_gate_prefix",
        "leanWireUnaryArbitrarySupportSingleBoundaryRankTheorem": "PNP.DirectWire.ArbitrarySupportSplice.graph_wellFounded_of_singleGateBoundary",
        "leanWireUnaryArbitrarySupportConstantSourceTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.constantWord_source",
        "leanWireUnaryArbitrarySupportUnaryLiteralConstantTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.unaryWord_source_of_constant",
        "leanWireUnaryArbitrarySupportLocalLiteralConstantTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.localWord_source_of_constant",
        "leanWireUnaryArbitrarySupportReplacementAgreementTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_agreement",
        "leanWireUnaryArbitrarySupportReplacementGateBoundTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_gate_bound",
        "leanWireUnaryArbitrarySupportReplacementMinimumTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_minimal",
        "leanWireUnaryArbitrarySupportReplacementNonincreaseTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_nonincrease",
        "leanWireUnaryArbitrarySupportEarlyFrontierConstantTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_early_constant",
        "leanWireUnaryArbitrarySupportWellFoundedTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.graph_wellFounded",
        "leanWireUnaryArbitrarySupportCompilerSuccessTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.compile_isSome",
        "leanWireUnaryArbitrarySupportOriginalChargeTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.original_charge",
        "leanWireUnaryArbitrarySupportOutputTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_output",
        "leanWireUnaryArbitrarySupportFieldTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_field",
        "leanWireUnaryArbitrarySupportEquivalenceTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_equivalent",
        "leanWireUnaryArbitrarySupportExactChargeTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_charge",
        "leanWireUnaryArbitrarySupportNonincreaseTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_nonincrease",
        "leanWireUnaryArbitrarySupportGainIffTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_gain_iff",
        "leanWireUnaryArbitrarySupportProperExteriorIffTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.proper_iff_exterior_positive",
        "leanWireUnaryArbitrarySupportAttemptIffTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_isSome_iff",
        "leanWireUnaryArbitrarySupportAttemptOutputTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_output",
        "leanWireUnaryArbitrarySupportAttemptFieldTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_field",
        "leanWireUnaryArbitrarySupportAttemptNonincreaseTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_nonincrease",
        "leanWireUnaryArbitrarySupportAttemptChargeTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_charge",
        "leanWireUnaryArbitrarySupportR7SourceExactTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.dischargeR7_source_exact",
        "leanWireUnaryArbitrarySupportR7FullValueTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.dischargeR7_full_value",
        "leanWireUnaryArbitrarySupportProperGainIffTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.checkedProperGain_isSome_iff",
        "leanWireUnaryArbitrarySupportProperGainCompletenessTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.checkedProperGain_complete",
        "leanWireUnaryArbitrarySupportCheckedProperGainTheorem": "PNP.DirectWire.WireUnaryArbitrarySupport.ProperGain.checked",
        "leanWireUnaryArbitrarySupportAllBoundaryWidthsCovered": false,
        "leanWireUnaryArbitrarySupportAllR7CasesDerived": false,
        "leanWireUnaryArbitrarySupportArbitraryObligationDAGsCovered": false,
        "leanWireUnaryArbitrarySupportFullManuscriptCarrierProved": false,
        "leanWireUnaryArbitrarySupportCompleteObligationCalculusProved": false,
        "leanWireUnaryArbitrarySupportCompletePackageEProved": false,
        "leanWireUnaryArbitrarySupportPolynomialRuntimeProved": false,
        "leanWireUnaryArbitrarySupportScope": "all-finite-computational-wire-arbitrary-physical-support-completed-frontier-zero-or-one-actual-boundary-including-external-gate-source-derived-prefix-causality-minimum-local-word-ranked-actual-compiler-original-exterior-once-full-fields-source-exact-r7-proper-gain-no-general-calculus-or-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.terminalOpenGateEvaluation_prefix_congr": {
          "hash": "0061f7c437b7e27d395569d35d48fe9855416854bdfb7cd22e4c78821cebff01",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.terminalOpenGateEvaluation_single_gate_prefix": {
          "hash": "d245e3b3e3315e77d7e1f0ca38c2bc9ac0ad8bc60ce4d85eb6fbb61dc628dc7f",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.ResidualTerminalSupportExtraction"
        },
        "PNP.DirectWire.ArbitrarySupportSplice.graph_wellFounded_of_singleGateBoundary": {
          "hash": "131ac4d4b954bfccdfb334f7592d63c49f7b0f8cbef14dfbd9708672f0622d9b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDArbitrarySupportSplice"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.constantWord_source": {
          "hash": "b18c68167c2cf5438f22a797e59049c228249a41db1df94fb3c68f4a255963cc",
          "axioms": [],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.unaryWord_source_of_constant": {
          "hash": "60d8adc847127db61ed6db043d02138664e66b9a200bc99b9b1b3f0510fdeace",
          "axioms": [
            "Quot.sound"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.localWord_source_of_constant": {
          "hash": "4b8ba04460c91c0e6ee0f01e22d3c0be608d2ea54dd0224826f961d937f5965b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_agreement": {
          "hash": "74d4b769ab2f48a65f221ba3e8811d4bc83b47ee8d4e49f70ceefacbda5f5cfd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_gate_bound": {
          "hash": "ef7907c6929e65f812aa3844e922101642a88044dbcdc1136626452789aa8fef",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_minimal": {
          "hash": "3418c00e0587573e9846fe69fe66c478ed027632bf7d0f50cd3d1485106967d1",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_nonincrease": {
          "hash": "9a691e352f9e7e2343d297c759286c8cee0962cd9a15e4bcf8a890f8027530ac",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.replacement_early_constant": {
          "hash": "3220d6d9eda3f54ad07c5fb7db7f0bf00b44327d56638164662a08dbe56e4bfb",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.graph_wellFounded": {
          "hash": "657338f0205eadf7e6f37e70791da590374f199c08f737cd117ecfd42b819fb0",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.compile_isSome": {
          "hash": "0b40032fd8e0e14732dac199a115ec61ef9290c916860bd70bd3b15f42d92e61",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.original_charge": {
          "hash": "9c1feaa37b5a1fef557510998992eb40d5e5da7dde9b473b0b01868cd9cfabe3",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_output": {
          "hash": "ef4023d873287ec9b791acd9fc6756f06f96f287cbc0944dbe960b80c6b21e67",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_field": {
          "hash": "292b86e2253a9767a078cce964dd0896d49a644dd64a322bd85fff531ecf7481",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_equivalent": {
          "hash": "e28606e602cc080a5d5a140f2101ecf705212c55372cedc7d96b63857af0c8b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_charge": {
          "hash": "55ec202abef861068266ee283243cfe5064fcf6378328f4df87e59c39f9e278d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_nonincrease": {
          "hash": "29f691ff3546ab68f504a9d1afa7e6d320ad8c486061be0eff2c5a287dadafe7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.expanded_gain_iff": {
          "hash": "a30977882e20c40433ceafe9b8c2a6c1766563afe36815f233e25c5ddd2fddfd",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.proper_iff_exterior_positive": {
          "hash": "59d8d725ad98e586da3887e5ffbdc7f8dba0c98a209dd9d6c1fbb41fb23dca43",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_isSome_iff": {
          "hash": "b3fd2f73e6aa15a4f4f5eee75d4261473c49a1d994ef023bd12e74f9950cebff",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_output": {
          "hash": "c3f76011dd727f6e2479a1074dc8cf1b9f5c2ab4b85306dd038c0fdb1126b881",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_field": {
          "hash": "82d5498fcea1f4c0e8fbdbbc3f0f74cee2a44c97d84ad9b5e987301d5ab30924",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_nonincrease": {
          "hash": "10a5d687494ddb4e1b7f549b0d5de87af50285e7c753b2e63a4f720ef6bdcfb9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.attempt_charge": {
          "hash": "9c3d33ffd1e0e2506aba7e7b4303991bda2bbb8b5f2cb685a7345ff1a8a5544a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.dischargeR7_source_exact": {
          "hash": "17e1f9fe0e9e1ab2675094cb0ac78aef910bd5874ac89abd74fa24f564335764",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.dischargeR7_full_value": {
          "hash": "aa59004c5807cf81b93fee7ba5b990c274d19760237740386541a96ad82b587b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.checkedProperGain_isSome_iff": {
          "hash": "b5b5fcf8e6bfcc58f1fa6350972dbc222bd0219cad0409163191075f333f39b6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.checkedProperGain_complete": {
          "hash": "d6a6a6ab8f1b05050a450e078a96abf2fdd9b1e23557191928fc6ec00603bd41",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
        },
        "PNP.DirectWire.WireUnaryArbitrarySupport.ProperGain.checked": {
          "hash": "0b9d4a813bdd0931dc63942366a1e181a2f7d13a84aaf796aeda9b75b6687961",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnaryArbitrarySupport"
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
      "number": 258,
      "coordinate": "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-258",
      "id": "wire-unary-support-search",
      "title": "Computed complete search for proper constant and unary R7 gains",
      "classification": "formalized-foundation-only",
      "scope": "For arbitrary finite computational wire carriers, original gate counts, ordinary outputs and full computational fields, M258 computes a complete family of proper zero/unary support-gain candidates from the actual program. Optional boundary choices use only source wires actually consumed by gates, plus no boundary. For each choice and omitted gate, a topological maximal scan derives a support with at most one actual incoming wire and a nonempty exterior; canonical singleton supports handle one-gate savings. Any arbitrary proper zero/unary support is contained in the corresponding maximal candidate, and extraction is invariant under repeated or metadata records selecting the same gates. A support with at least two gates yields a strict saving because the complete zero/unary frontier word uses at most one shared NOT; a one-gate saving transfers to its canonical singleton. The carrier-only executable search is therefore complete whenever any proper zero/unary support admits a strictly smaller equivalent complete local word, without a supplied support family, replacement, rank, order, compiler result or completeness certificate. An accepted result constructs the actual expanded carrier, preserves every ordinary output and computational field at every valuation, charges the original exterior once, gives a strict fully paid saving and retains source-exact full-value R7 discharges for original R5 identities. A negative result excludes every such gain in this exact class. With g original gates, the computed family has at most (2*g+1)*g+g entries, each containing at most g gate records.",
      "nonClaim": "Completeness is for proper physical supports with zero or one actual incoming boundary in a computational wire carrier. It is not completeness for all boundary widths, every R7 case or all ambient circuit optimizations. A negative search result is not global minimality or unconditional ZeroSlack; a guarded two-boundary duplicate fixture has an explicit smaller global realization while this scoped search correctly returns no gain. A whole-support saving is not a proper-support Package E certificate. Boundary-choice enumeration excludes unused declared inputs, but inherited physical-port extraction and compilation retain their own execution costs. The physical candidate and record counts are not a theorem of total uniformly polynomial encoded-input-size execution, output size or certificate size. The full manuscript carrier, noncomputational profile fields, arbitrary obligation dependency DAGs, every R5-R8 interaction, all-trace N1-N10 normalization, complete Package E, global routing, unconditional SaturatePositive, BCELReady and ZeroSlack, exact general PCCMin and its complete polynomial bounds remain open. No fixed weighted checkpoint or global gate closes. Deterministic CNFSAT in P and the eligible root remain absent, and P = NP is not proved.",
      "fields": {
        "leanWireUnarySupportSearchFormalized": true,
        "leanWireUnarySupportSearchAxiomAuditPassed": true,
        "leanWireUnarySupportSearchAuditedDeclarationCount": 36,
        "leanWireUnarySupportSearchMaximalAdmissibilityTheorem": "PNP.DirectWire.WireUnarySupportSearch.maximalSelection_admissible",
        "leanWireUnarySupportSearchMaximalContainmentTheorem": "PNP.DirectWire.WireUnarySupportSearch.maximalSelection_contains",
        "leanWireUnarySupportSearchCanonicalSelectionIffTheorem": "PNP.DirectWire.WireUnarySupportSearch.gateRecords_selected_iff",
        "leanWireUnarySupportSearchCanonicalSelectionTheorem": "PNP.DirectWire.WireUnarySupportSearch.gateRecords_selected",
        "leanWireUnarySupportSearchActualBoundaryTheorem": "PNP.DirectWire.WireUnarySupportSearch.admissible_boundary",
        "leanWireUnarySupportSearchUnaryBoundaryTheorem": "PNP.DirectWire.WireUnarySupportSearch.admissible_boundary_small",
        "leanWireUnarySupportSearchCandidateBoundaryTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateRecords_boundary",
        "leanWireUnarySupportSearchCandidatePropernessTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateRecords_proper",
        "leanWireUnarySupportSearchConsumedWireCountTheorem": "PNP.DirectWire.WireUnarySupportSearch.consumedWires_length",
        "leanWireUnarySupportSearchBoundaryEnumerationCompletenessTheorem": "PNP.DirectWire.WireUnarySupportSearch.boundary_mem_consumedWires",
        "leanWireUnarySupportSearchBoundaryChoiceCountTheorem": "PNP.DirectWire.WireUnarySupportSearch.boundaryChoices_length",
        "leanWireUnarySupportSearchCandidateFamilyCountTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_length",
        "leanWireUnarySupportSearchMaximalFamilyMembershipTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_maximal_mem",
        "leanWireUnarySupportSearchSingletonFamilyMembershipTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_singleton_mem",
        "leanWireUnarySupportSearchActualChoiceMembershipTheorem": "PNP.DirectWire.WireUnarySupportSearch.supportChoice_wire_mem",
        "leanWireUnarySupportSearchActualChoiceCompletenessTheorem": "PNP.DirectWire.WireUnarySupportSearch.supportChoice_of_mem",
        "leanWireUnarySupportSearchActualChoiceExteriorTheorem": "PNP.DirectWire.WireUnarySupportSearch.supportChoice_external",
        "leanWireUnarySupportSearchChoiceFamilyMembershipTheorem": "PNP.DirectWire.WireUnarySupportSearch.supportChoice_mem",
        "leanWireUnarySupportSearchGeneralSupportAdmissibilityTheorem": "PNP.DirectWire.WireUnarySupportSearch.support_admissible",
        "leanWireUnarySupportSearchGeneralSupportContainmentTheorem": "PNP.DirectWire.WireUnarySupportSearch.support_contained_in_candidate",
        "leanWireUnarySupportSearchSelectionCountMonotonicityTheorem": "PNP.DirectWire.WireUnarySupportSearch.selected_length_mono",
        "leanWireUnarySupportSearchSelectionCountBoundTheorem": "PNP.DirectWire.WireUnarySupportSearch.selected_length_le",
        "leanWireUnarySupportSearchCandidateRecordBoundTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_entry_length",
        "leanWireUnarySupportSearchExtractedCountMonotonicityTheorem": "PNP.DirectWire.WireUnarySupportSearch.extracted_gateCount_mono",
        "leanWireUnarySupportSearchSingletonCanonicalizationTheorem": "PNP.DirectWire.WireUnarySupportSearch.singleton_selection",
        "leanWireUnarySupportSearchGainCanonicalizationTheorem": "PNP.DirectWire.WireUnarySupportSearch.checkedGain_selection_invariant",
        "leanWireUnarySupportSearchCandidateFamilyCompletenessTheorem": "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_complete",
        "leanWireUnarySupportSearchSearchCompletenessTheorem": "PNP.DirectWire.WireUnarySupportSearch.findGain_complete",
        "leanWireUnarySupportSearchSearchFamilyMembershipTheorem": "PNP.DirectWire.WireUnarySupportSearch.findGain_member",
        "leanWireUnarySupportSearchSearchRecordBoundTheorem": "PNP.DirectWire.WireUnarySupportSearch.findGain_records_bound",
        "leanWireUnarySupportSearchCheckedResultTheorem": "PNP.DirectWire.WireUnarySupportSearch.GainResult.checked",
        "leanWireUnarySupportSearchNoResultExclusionTheorem": "PNP.DirectWire.WireUnarySupportSearch.findGain_none_excludes",
        "leanWireUnarySupportSearchR7SourceExactTheorem": "PNP.DirectWire.WireUnarySupportSearch.GainResult.dischargeR7_source_exact",
        "leanWireUnarySupportSearchR7FullValueTheorem": "PNP.DirectWire.WireUnarySupportSearch.GainResult.dischargeR7_full_value",
        "leanWireUnarySupportSearchReplacementRecognitionTheorem": "PNP.DirectWire.WireUnarySupportSearch.findReplacement_isSome",
        "leanWireUnarySupportSearchReplacementSoundnessTheorem": "PNP.DirectWire.WireUnarySupportSearch.findReplacement_sound",
        "leanWireUnarySupportSearchProperZeroUnaryCompletenessProved": true,
        "leanWireUnarySupportSearchPhysicalCandidateCountBoundProved": true,
        "leanWireUnarySupportSearchPhysicalRecordCountBoundProved": true,
        "leanWireUnarySupportSearchCallerSuppliedFamilyRequired": false,
        "leanWireUnarySupportSearchAllBoundaryWidthsCovered": false,
        "leanWireUnarySupportSearchAllR7CasesDerived": false,
        "leanWireUnarySupportSearchNoResultProvesGlobalMinimality": false,
        "leanWireUnarySupportSearchArbitraryObligationDAGsCovered": false,
        "leanWireUnarySupportSearchFullManuscriptCarrierProved": false,
        "leanWireUnarySupportSearchCompleteObligationCalculusProved": false,
        "leanWireUnarySupportSearchCompletePackageEProved": false,
        "leanWireUnarySupportSearchPolynomialRuntimeProved": false,
        "leanWireUnarySupportSearchScope": "all-finite-computational-wire-source-derived-proper-zero-or-one-actual-boundary-support-search-complete-maximal-and-singleton-candidates-physical-count-bounds-full-field-actual-replacement-source-exact-r7-no-global-minimum-or-total-encoded-polynomial-runtime"
      },
      "theorems": {
        "PNP.DirectWire.WireUnarySupportSearch.maximalSelection_admissible": {
          "hash": "70718895c2c12e9a1b2af6e777e6117f87418fa2b0462269f7545c516502d7cf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.maximalSelection_contains": {
          "hash": "f88938f8c16b9e730c9bbe267d4f8c89ee5cadfbc0045afdc70ad3999383d22e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.gateRecords_selected_iff": {
          "hash": "8c1966ce09ff72f86c881dd7f8d03cde5b6532909f13ba4b2bda0171069737d5",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.gateRecords_selected": {
          "hash": "28310bf0e776eb00c6ddab4969e490171a045f6381b0280d7ca5cfcba8b6b39a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.admissible_boundary": {
          "hash": "c485b8b5321f2d1fa7d8bbec9e8c6c8dafaaeaea118e2531571578f0484d3181",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.admissible_boundary_small": {
          "hash": "5fee27f35b298617410c0bb3f73c1b2ba6903840661f08032877aa243a0fc5c9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateRecords_boundary": {
          "hash": "45ea7f1d043b44229e95a189f531c40ca12462ff49e977e06846165473859910",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateRecords_proper": {
          "hash": "6c086a77b1c970c1866350cd6b71c59404f725aa71a441ddeb54019d5827091d",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.consumedWires_length": {
          "hash": "030e909521cdbb6875562dde63d2d1a1e879440fd034c32e5a32ce79df396d04",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.boundary_mem_consumedWires": {
          "hash": "e07d702982967607422305510ad6bd38c998d9c4194f5a122c64ff25afa1b8b4",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.boundaryChoices_length": {
          "hash": "6c3daa4bbe197385783bf050624d6941da972ed3dca1c09ea203b62c1ab1ead1",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_length": {
          "hash": "5ce4eb7077f3268b4fa8f7325d231721bff04ac3f601adee25463b6d46a2a272",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_maximal_mem": {
          "hash": "a5a638feff27bbcf22136a6e3f3fe99e258d9bbae8d563dc276b5795979991a6",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_singleton_mem": {
          "hash": "4af1de31fd4bf4d201e49818b9c1e0b9036ac6b530ee3eaa595f90d110912adf",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.supportChoice_wire_mem": {
          "hash": "e5a7155113a150e4aaf7b68426b1e90b908c19d2ef957df26e5b91f0893b8717",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.supportChoice_of_mem": {
          "hash": "150fae8fa479784aa8b872ee5ee64e33e7ffa0977b0842a74a4c8083a2cef015",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.supportChoice_external": {
          "hash": "021b77ef9449c5607058ebe310fc6ca6a4dde395583092f1495482dd3120b571",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.supportChoice_mem": {
          "hash": "33c62ed28a83b297c5c587ea70cef6d79ac6bbb6d29be514466fbc83b77a8a9a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.support_admissible": {
          "hash": "6a2f0d90b9e1a74a0bd4978489f13438b4e0d47b2caf32d86d2514292354dac2",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.support_contained_in_candidate": {
          "hash": "bdf998053acbc7c9b0ffb39d091d7354c2d67e389bf909fede832f4755e8b6e9",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.selected_length_mono": {
          "hash": "458a84c5f76b84a54aba3ea5dd87967669fda126c21624f20a860d6c7aee424e",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.selected_length_le": {
          "hash": "eec3020b2c61f8352307c58580448422619506f4b6f007a4792f33eb0a402d57",
          "axioms": [
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_entry_length": {
          "hash": "78bb59833db65bb63a805949322c55631c163ff4a419a3512227e60a2a169b8e",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.extracted_gateCount_mono": {
          "hash": "567c07c22d6bf483761fdf3f2064e21a35c0041cfa2b975e2df6560bc6128714",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.singleton_selection": {
          "hash": "4ebcad2581a27e2d0a261fcdc656f874fc61f088c8c97c70bf39a77d124e097b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.checkedGain_selection_invariant": {
          "hash": "66cc45fcb13c84e7b8069467b95dc2a0f79bd4dd78f65727b7c0698e7b36adab",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.candidateFamily_complete": {
          "hash": "80e9036cfa4a719acd036e4a33a52dcff6ef6ca5e8c91733e761f8fac5394b7c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findGain_complete": {
          "hash": "2a680bd477e64a55707a1f892fa3567ec338de4762b201287e4b13601728653c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findGain_member": {
          "hash": "688799871ec61a8a9962bf3c1cfc47793194efe5842cec84a62cbedd9599ae78",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findGain_records_bound": {
          "hash": "995f1f43b1064187a69323a68140af8b49d4526774b38a4f598e9fd50afc560a",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.GainResult.checked": {
          "hash": "4d4132cd01b501b8f103399b3c57c47e45342692e0e6054fd3814448326180ba",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findGain_none_excludes": {
          "hash": "7e9d9d59b2ce85081194c5ab4fb513ebfd1c4e62017889c5fd3b7774e769fd1b",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.GainResult.dischargeR7_source_exact": {
          "hash": "dc48bbffd059b2660b83265da71e67eb8891cee01bb97f2a69c2a7f210cacb9c",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.GainResult.dischargeR7_full_value": {
          "hash": "96904c09e21b42e091484c33a93aa8cb2949f6992410fcdce7f524ca36bd1b53",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findReplacement_isSome": {
          "hash": "c5b472a9d7dba978e4fc789aae984d010d13d659da7054cb5ed8d88b3fc67435",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
        },
        "PNP.DirectWire.WireUnarySupportSearch.findReplacement_sound": {
          "hash": "1fb66b7bb02ed8dab6d84d4dc001e8fcdf6b07f39a61c7bf95c3105ae850d3c7",
          "axioms": [
            "Quot.sound",
            "propext"
          ],
          "module": "PNP.NANDWireUnarySupportSearch"
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
export const M258_BATCH_FIELDS = freezeDeep0(Object.assign({},
  ...M258_BATCH.milestones.map(row => row.fields)));
export const M258_BATCH_THEOREMS = freezeDeep0(Object.assign({},
  ...M258_BATCH.milestones.map(row => row.theorems)));

export const M258_BATCH_SCOPE_SUFFIX = '+plus-' + M258_BATCH.milestones.map(row => row.id).join('+plus-');

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

export function assertM258BatchPublicationMap(map) {
  for (const expected of M258_BATCH.milestones) {
    const rows = map?.milestones?.filter(row => row?.id === expected.id);
    require0(rows?.length === 1, 'core publication map', expected, 'milestone count');
    checkMilestone0(rows[0], expected, 'core publication map');
    for (const [name, proof] of Object.entries(expected.theorems))
      require0(map.earnedMilestoneTheoremKernelTypeSha256?.[name] === proof.hash,
        'core publication map', expected, name, 'fingerprint');
  }
}

export function assertM258BatchStatus(status) {
  for (const expected of M258_BATCH.milestones) {
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

function assertM258BatchInventoryMetadata0(inventory) {
  const byName = new Map();
  for (const row of inventory?.milestoneCandidates ?? []) {
    if (!byName.has(row?.name)) byName.set(row?.name, []);
    byName.get(row?.name).push(row);
  }
  for (const milestone of M258_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems)) {
      const rows = byName.get(name), row = rows?.[0];
      require0(rows?.length === 1 && row.kind === 'theorem'
        && row.module === expected.module && same0(row.axioms, expected.axioms)
        && typeof row.kernelType === 'string',
      'inventory', milestone, name, 'theorem');
    }
}

export function assertM258BatchInventory(inventory) {
  assertM258BatchInventoryMetadata0(inventory);
  const byName = new Map(inventory.milestoneCandidates.map(row => [row.name, row]));
  for (const milestone of M258_BATCH.milestones)
    for (const [name, expected] of Object.entries(milestone.theorems))
      require0(fingerprint0(byName.get(name)) === expected.hash,
        'inventory', milestone, name, 'theorem');
}

export function m258BatchManifestBoundary() {
  return {
    kind: 'PNPLabsCompiledMilestoneBatch0',
    batchId: M258_BATCH.batchId,
    reviewedSource: { ...M258_BATCH.reviewedSource },
    milestones: M258_BATCH.milestones.map(row => ({
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

export function assertM258BatchManifest(manifest) {
  const expected = m258BatchManifestBoundary();
  const actual = manifest?.earnedBoundary?.milestoneBatchM232M258;
  require0(Array.isArray(actual?.milestones) && actual.milestones.length === expected.milestones.length,
    'current manifest', {number:258}, 'reviewed batch');
  for (const [index, milestone] of expected.milestones.entries()) {
    const row = actual.milestones[index];
    require0(row?.id === milestone.id, 'current manifest', milestone, 'milestone order');
    require0(same0(row.theoremKernelTypeSha256, milestone.theoremKernelTypeSha256),
      'current manifest', milestone, 'reviewed theorem', 'fingerprint');
  }
  require0(same0(actual, expected), 'current manifest', {number:258}, 'reviewed batch');
  const scope = manifest?.earnedBoundary?.scope;
  for (const milestone of M258_BATCH.milestones)
    require0(typeof scope === 'string' && scope.split('+plus-').includes(milestone.id),
      'current manifest', milestone, 'scope');
}

// The classic browser checks this generated descriptor after verifying the
// complete inventory's pinned byte digest. Node additionally hashes every type.
export function renderM258BrowserDescriptor() {
  return '// M232-M258-BATCH-DESCRIPTOR:BEGIN\n' +
    'const FORMAL_M232_M258_BATCH = Object.freeze(' + JSON.stringify(M258_BATCH, null, 2) + ');\n' +
    'const FORMAL_M232_M258_VALIDATORS = (() => {\n' +
    'const M258_BATCH = FORMAL_M232_M258_BATCH;\n' +
    'const same0 = ' + same0.toString() + ';\n' +
    'const require0 = ' + require0.toString() + ';\n' +
    [checkMilestone0, assertM258BatchStatus, assertM258BatchInventoryMetadata0]
      .map(fn => fn.toString()).join('\n') + '\n' +
    'return Object.freeze({status: assertM258BatchStatus, inventory: assertM258BatchInventoryMetadata0});\n' +
    '})();\n' +
    '// M232-M258-BATCH-DESCRIPTOR:END';
}

export function assertM258BrowserDescriptor(source) {
  const matches = [...source.matchAll(/\/\/ M232-M258-BATCH-DESCRIPTOR:BEGIN[\s\S]*?\/\/ M232-M258-BATCH-DESCRIPTOR:END/gu)];
  require0(matches.length === 1 && matches[0][0] === renderM258BrowserDescriptor(),
    'browser', {number:258}, 'generated descriptor');
}
