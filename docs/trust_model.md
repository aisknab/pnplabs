# Trust Model

The claim is not a single trust decision. It crosses mathematical, implementation, parsing, hashing, build, CI, publication, and website layers. A reviewer should decide which layers to trust, which to re-check, and which to replace.

## Trust Boundaries

| Component | Input | Output | Trusted? | Why it must be trusted | How to independently verify or replace it | Failure mode | Relevant tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mathematical definitions | Definitions in the report | Formal objects such as NAND words, residual slack, modes, packages | Yes, for the claim | The checker can only validate the formalization it is given | Rewrite definitions in standard notation; compare against checker data structures | Ambiguous or too-strong definition makes acceptance meaningless | Manual audit; `docs/audit_questions.md` |
| Mathematical lemmas/theorems | Definitions and prior lemmas | Claimed implications ending in `P = NP` | Yes, unless fully formalized and checked | The route depends on theorem correctness | Independent proof review or formalization in another prover | Invalid implication, missing case, circular proof | Manual audit |
| Generated certificates | `GeneratePCCPack()` output, final certificate, replay records | Finite objects accepted by checkers | No | Generator should be untrusted; checker should validate bytes | Regenerate from source/checker tag; compare canonical bytes and accepted fields | Generator emits malformed, stale, or selectively crafted records | Requires source/checker repo; not executable here |
| Checker implementation | Canonical bytes and proof package | Accept/reject records | Yes | If checker is unsound, acceptance has no force | Read source; implement independent checker; run mutation tests | Accepts invalid package or rejects only generic errors | Reported source suite; local fixture tests are only illustrative |
| Parser/canonical encoder | Bytes, JSON-like records, names, integers | Typed normal forms and canonical bytes | Yes | Parser ambiguity can change all downstream meanings | Fuzz parser; prove round trips; compare independent encoder | Multiple parses, trailing bytes, noncanonical encodings accepted | `tests/negative/reviewer-fixtures.test.mjs` only illustrates parser mismatch |
| Hash/seal mechanism | File bytes or canonical bytes | SHA-256 digest, manifest entries | Partially | It identifies bytes but does not prove semantics | Recompute SHA-256 independently; inspect canonical-byte comparison after digest lookup | Digest used as object equality; stale or mismatched artefact | `npm run verify:seal`; browser check in `verify.html` |
| Build environment | OS, Node, source checkout, dependencies | Executed checker and generated artefacts | Partially | Reproducibility depends on deterministic tooling | Build in clean containers; pin toolchain; compare accepted fields | Environment-dependent output or hidden dependency | `npm run repro:smoke` for public repo only |
| CI | Repository scripts | Test pass/fail result | No | CI reports convenience status, not proof validity | Re-run locally; inspect workflow; use independent CI | Skipped test, wrong branch, missing source artefacts | `.github/workflows/ci.yml` |
| Published PDF/report | TeX/PDF bytes | Human-readable claim | Partially | It is the public statement of the route | Compare PDF and TeX hashes; inspect source/checker records | PDF diverges from accepted records or overstates status | `npm run verify:seal` |
| Website verification flow | Browser, JS, bundled PDF | Digest match/mismatch UI | No for theorem correctness; yes only for file identity if browser is trusted | It helps users check the bundled PDF bytes | Use command-line SHA-256 instead; inspect `assets/main.js` | Browser or page script misreports digest; user misreads meaning | `npm run verify:seal`; `npm run test:docs` |

## Hashes And Seals

A SHA-256 digest check confirms that bytes match a named digest. It does not confirm:

- that the theorem is correct;
- that the checker is sound;
- that the PDF faithfully reports the checker output;
- that the source/checker revision was run;
- that a digest-labelled object has the expected semantics.

The report itself states that digest equality must not be used as object equality. The claimed checker stack is supposed to follow digest lookup with full key or canonical-byte comparison. That rule is a high-priority audit target.

## Local Public-Repo Tests

The tests in this public checkout have a narrow scope:

- `npm run verify:seal` verifies listed report files against the local manifest and ledger.
- `npm run examples:minimal` runs educational pass/fail fixtures.
- `npm run test:negative` checks that negative fixtures fail for named reasons.
- `npm run test:docs` checks local documentation links.

These tests improve review hygiene. They are not a substitute for auditing the source/checker repository.
