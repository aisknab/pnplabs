# Audit Questions

Use this worksheet to turn review concerns into precise checks. A refutation can be mathematical, implementation-level, or reproducibility-level; record which layer failed.

| Major claim | Where it appears | Supporting file/function/theorem | How to test or inspect it | What would count as a refutation |
| --- | --- | --- | --- | --- |
| The public claim is `P = NP` under the accepted package/checker boundary. | `downloads/canonical_proof_report.tex`, "Executive status and claim boundary" | Final accepted finite-certificate theorem; `CheckFinalPNPProofReport0` | Inspect theorem fields in the report and source/checker final proof record. | The accepted theorem field differs, is conditional in an undisclosed way, or is not produced by replay. |
| SAT reduces to the locked NAND target in polynomial time. | Report "Locked NAND and final integration" | Package G, `GPack`, `CheckSATDecision`, `CheckSATBounds` | Reconstruct the reduction and check size/time bounds. | A SAT instance maps incorrectly, requires exponential construction, or relies on exact minimization. |
| Locked NAND macro tables implement the claimed Boolean functions. | Report Appendix A | Macro truth signatures; `CheckGPack` | Independently compute truth tables and compare signatures. | A listed signature is wrong or a macro lacks required lock dependence/disjointness. |
| Constructed locked NAND instances have residual slack at most four. | Report "Central scale correction" and Package G sections | `Lambda(C)=|C|-mu(C)`; residual slack checks | Verify size convention, minimum-size notion, and slack proof for generated instances. | Any constructed instance has slack greater than four or uses a different minimum notion. |
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
| Reproduction from source/checker tag yields accepted theorem fields. | Report "Independent verification protocol" | Source/checker tag `final-pnp-proof-report-hardened-7072f8d` | Fresh clone of source/checker repo; run documented validation. | Re-run does not accept, theorem fields differ, or central canonical digests mismatch without explanation. |

## Notes For Findings

When reporting an issue, include:

- layer: mathematics, checker, parser, hash/seal, build, CI, PDF/site wording;
- exact file/section/function;
- minimal counterexample or reproduction command;
- expected reject reason, if implementation-level;
- whether the issue refutes the theorem claim, weakens auditability, or only affects presentation.
