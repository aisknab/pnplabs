# Audit Questions

> **Current status:** Formal reconstruction is in progress. The repository does not currently
> establish `P = NP`, and public theorem emission is disabled. The authoritative site payload is
> [`../public/pnp-status.json`](../public/pnp-status.json). The upstream status and reconstruction
> notice are [`status/FORMAL_RECONSTRUCTION_STATUS.json`](https://github.com/aisknab/pnp/blob/305443db5a3954be42d1d56912c7f64232efff2a/status/FORMAL_RECONSTRUCTION_STATUS.json)
> and [`docs/FORMAL_RECONSTRUCTION.md`](https://github.com/aisknab/pnp/blob/305443db5a3954be42d1d56912c7f64232efff2a/docs/FORMAL_RECONSTRUCTION.md).
> Claims and release records below are historical assertion-checker audit targets only.

The current canonical download is the nine-page inventory-derived report. Every numbered section or
named report citation in the historical worksheet below refers instead to the 56-page manuscript at
source tag `final-pnp-proof-report-hardened-7072f8d`, commit
`7072f8d0bda6d44d240f9bb3fad624fd357e1278`; it never refers to the current download aliases.

## Current Formal-Evidence Checks

| Evidence boundary | How to inspect it | What would count as a failure |
| --- | --- | --- |
| Inventory identity | Compare `public/pnp-theorem-inventory.json` with the merged-core mirror and with `status.leanTheoremInventorySha256`. | Missing, stale, noncanonical, or digest-mismatched inventory bytes. |
| Milestone earning | Check all 172 reviewed theorem kinds, kernel-type fingerprints, empty axiom closures, and the full Lean-source digest. | Same-name type weakening, an added axiom, an absent theorem, or source drift still earns a milestone. |
| Concrete gate | Recompute `passed` as the strict conjunction of every subcheck. Verify that a fingerprint-match subcheck can be true only when its reviewed expected fingerprint is non-null; in this release the null expected fingerprints must remain unconfigured and nonmatching. | Null matches null, the abstract bridge is eligible, a project/unknown axiom passes, or an output field bypasses the gate. |
| Non-claim boundary | Confirm nine earned scoped milestones, including `CNFSAT ∈ NP` and the four-stage compiler's exact all-input verdict, output, no-timeout, malformed-input behavior, and external polynomial bounds, plus three unearned global milestones, four project axioms, and seven blockers. Confirm that recursive function/decision `RawRefinement`, CNF-SAT in P, and NP-completeness remain false. | The all-input compiler is widened into recursive charged-program composition, a local/conditional result is presented as global, or a blocker/axiom is hidden. |
| Canonical report | Compare both PDF aliases and both TeX aliases with the current merged-core files; require nine PDF pages. | An alias differs, the old 56-page hash returns, or report text conflicts with generated status. |

## Historical Assertion-Checker Worksheet

Use this worksheet to turn review concerns into precise checks. A refutation can be mathematical, implementation-level, or reproducibility-level; record which layer failed.

| Major claim | Where it appears | Supporting file/function/theorem | How to test or inspect it | What would count as a refutation |
| --- | --- | --- | --- | --- |
| The historical report claimed `P = NP` under an accepted package/checker boundary. | Pinned 7072f8d manuscript, "Executive status and claim boundary" | Superseded assertion-bearing final record; `CheckFinalPNPProofReport0` | Inspect historical theorem fields and compare them with the current formal-reconstruction status. | The recorded field differs, is conditional in an undisclosed way, or is presented as current proof authority. |
| SAT reduces to the locked NAND target in polynomial time. | Report "Locked NAND and final integration" | Package G, `GPack`, `CheckSATDecision`, `CheckSATBounds` | Reconstruct the reduction and check size/time bounds. | A SAT instance maps incorrectly, requires exponential construction, or relies on exact minimization. |
| Locked NAND macro tables implement the claimed Boolean functions. | Report Appendix A | Macro truth signatures; `CheckGPack` | Independently compute truth tables and compare signatures. | A listed signature is wrong or a macro lacks required lock dependence/disjointness. |
| Constructed locked NAND instances have residual slack at most four. | Report "Central scale correction" and Package G sections | `Lambda(C)=size(C)-mu(C)`; residual slack checks | Verify size convention, minimum-size notion, and slack proof for generated instances. | Any constructed instance has slack greater than four or uses a different minimum notion. |
| Residual-band exact minimization is polynomial under package acceptance. | Report Packages O/PACK | Package O, bounds checks, package sufficiency theorem | Audit all bounds and finite state universes. | A table, DP, or route enumerates exponentially many objects without a polynomial bound. |
| No hidden exact minimization occurs in executable paths. | Report "Hardened checker suite" | `CheckNoHiddenMin0`, no-hidden-minimization rows | Expand macros, aliases, templates, and imports; scan executable code. | An executable path calls `mu`, `argmin`, `minimumEquivalent`, `exactMinSearch`, or an alias. |
| Quotient equality is never used as full equality without a full lift. | Report "Mode firewall and transfer identity" | `CheckModeUse0`, Package E obligation checks | Trace all quotient-to-full transfers and obligation ledgers. | A constructive replacement consumes quotient equality alone. |
| Hashes are never used as semantic equality. | Report "Concrete Codec_0 and Digest_0" | `CheckHashProtocol`, `DigestObject0` | Inspect every digest lookup; require full-key or canonical-byte comparison. | A checker accepts because two digest labels match without comparing the underlying canonical object. |
| Parser and encoder are canonical. | Report codec sections | `Parse0`, `Encode0`, `NFSerialize0` | Fuzz noncanonical integers, names, trailing bytes, duplicate encodings. | One object has multiple accepted encodings, or one byte string has multiple accepted parses. |
| Proof references are typed and acyclic. | Report PCC-K and global proof DAG sections | Kernel implementation, Sigma registry, global proof DAG | Traverse proof DAG and imported packages. | A proof node depends on itself, an unchecked blob, or a theorem outside its stated type. |
| Package O and Package G do not assume each other. | Report FinalMatch and import checks | `CheckFinalFrameworkMatch_exp`, import graph checks | Inspect import graph and framework match artefact. | An import cycle or hidden dependency exists between minimizer package and SAT embedding package. |
| The generator is untrusted and replay verifies canonical bytes. | Report "Final acceptance run and deterministic generator" | `CheckAcceptRun0`, `ReplayAcceptRun0` | Modify generator output and confirm replay rejects first mismatch. | Replay accepts digest-only drift or fails to compare canonical bytes. |
| The final certificate is linked to release audit and replay. | Report final release sections | `CheckFinalPNPCertificate0`, `CheckFinalPNPReleaseGate0` | Trace certificate digests and canonical-byte roots into release gate. | Final report accepts with a stale, missing, or unlinked certificate. |
| Public SHA-256 checks establish file identity only. | `verify.html`, `downloads/release-seal.json`, `docs/trust_model.md` | `tools/verify-release-seal.mjs`, browser Web Crypto flow | Run `npm run verify:seal`; inspect UI copy. | The site or docs imply that a hash match proves theorem correctness. |
| Minimal examples are not proof evidence. | `examples/minimal/README.md` | `tools/reviewer-fixture-checker.mjs` | Run examples and read fixture comments. | A doc claims fixture acceptance validates the real theorem. |
| Historical replay from pinned refs reproduces accepted assertion fields. | Report "Independent verification protocol"; [docs/source_checker_map.md](source_checker_map.md) | `sourceRef`, `docsRef`, and `artifactRef` for the 7072f8d release | Fresh clone of the source/checker repo at the pinned historical refs; treat all acceptance as implementation evidence only. | Replay differs, central canonical digests mismatch without explanation, a path is validated at the wrong ref, or replay acceptance is presented as theorem proof. |

## Notes For Findings

When reporting an issue, include:

- layer: mathematics, checker, parser, hash/seal, build, CI, PDF/site wording;
- exact file/section/function;
- minimal counterexample or reproduction command;
- expected reject reason, if implementation-level;
- whether the issue refutes the theorem claim, weakens auditability, or only affects presentation.
