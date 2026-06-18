# PNP Labs public review package

This checkout is a public website, bundled report, checksum manifest, reviewer documentation, minimal fixture harness, and smoke-test package for a claimed proof of `P = NP`.

It is not evidence of external acceptance or consensus, and it is not the full source/checker repository named by the bundled report.

## Read This First

**Claim as stated by the report:** `CheckPCCPackexp(GeneratePCCPack())=accept => P = NP`. The report states that the generated finite proof-carrying package over a locked NAND residual-slack construction is accepted by the sealed checker stack. This README records that claim boundary; it does not establish the claim.

**Local verification status:** this checkout can verify public report file identity via SHA-256, minimal educational fixture pass/fail behavior, negative fixture rejection reasons, and local documentation links.

**Not verified here:** theorem correctness, soundness of the full checker implementation, correctness of the mathematical reductions, completeness of the generated package, or reproduction of the source/checker acceptance run.

**Trust boundaries:** a hash match verifies artefact identity only. It does not verify theorem correctness. Minimal fixtures demonstrate named local invariants only; they are not proof evidence.

**Checker claim to audit:** the report states that `CheckPCCPackexp(GeneratePCCPack())=accept` is replayed through final certificate, release gate, and `CheckFinalPNPProofReport0`. Auditing that claim requires the source/checker revision `final-pnp-proof-report-hardened-7072f8d` at commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`.

**Release-reference model:** [docs/source_checker_map.md](docs/source_checker_map.md) separates `sourceRef` for source/checker code, `docsRef` for 7072f8d release documentation, and `artifactRef` for generated proof-report artefacts. Do not use one default `pnp` ref for all paths.

**Access boundary:** the source/checker repository is not included in this checkout. If `aisknab/pnp` is private or unavailable to a reviewer, they cannot independently retrieve or run the source/checker validation until access is granted.

**Terminology status:** [docs/terminology_crosswalk.md](docs/terminology_crosswalk.md) maps internal names to standard terms and classifies evidence status. Author clarification may resolve ambiguity, but it is not verification evidence.

## Full Source/Checker Audit

This website checkout does not run the full source/checker stack. For cross-repo audit targets, use [docs/source_checker_map.md](docs/source_checker_map.md). Paths there are pinned separately as source/checker code, release documentation, generated artefacts, or public-review files.

When an authorized sibling source/checker checkout exists, it can be used to audit the implementation and reproduce its validation run. That validation is still not external mathematical acceptance.

Run the smallest local verification:

```bash
npm test
```

Reviewers should start with:

- [docs/reviewer_guide.md](docs/reviewer_guide.md)
- [docs/proof_pipeline.md](docs/proof_pipeline.md)
- [docs/trust_model.md](docs/trust_model.md)
- [docs/terminology_crosswalk.md](docs/terminology_crosswalk.md)
- [docs/audit_questions.md](docs/audit_questions.md)
- [docs/reproducibility.md](docs/reproducibility.md)
- [examples/minimal/README.md](examples/minimal/README.md)

## Local Commands

```bash
npm run test:unit          # fixture-checker unit tests
npm run verify:seal        # public file identity only
npm run examples:minimal   # educational pass/fail fixtures
npm run test:negative      # named negative fixture tests
npm run test:audit-targets # optional cross-repo provenance check; skips if ../pnp is unavailable
npm run repro:smoke        # public reproducibility smoke test
npm run test:docs          # local documentation link check
npm test                   # all local checks
```

## Included Public Files

- `index.html`, `paper.html`, `architecture.html`, `verify.html`, `faq.html`, `review.html` - static public pages.
- `downloads/canonical_proof_report.pdf` and `downloads/canonical_proof_report.tex` - bundled report artefacts.
- `downloads/source-checker-release.json` - source/checker audit-target reference; it does not establish theorem correctness.
- `downloads/release-seal.json` and `downloads/SHA256SUMS` - public file-identity manifest and ledger.
- `tools/` - local smoke-test and fixture-check scripts.
- `tests/negative/` - negative fixture tests.
- `docs/` - reviewer-first audit documentation.
- `examples/minimal/` - minimal pass/fail examples for terminology onboarding.

## Website Development

There is no build step for the static site. Run the local server with:

```bash
npm start
```

The pages load `assets/styles.min.css`. Regenerate it from `assets/styles.css` after CSS edits:

```bash
npx clean-css-cli -o assets/styles.min.css assets/styles.css
```

The first viewport also uses an inline critical CSS block in each HTML page. If that block changes, update the matching `style-src` SHA-256 hash in `_headers` and `server.mjs`.

## Deployment Boundary

Public hosting should serve only the static pages, `assets/`, `downloads/`, `robots.txt`, `sitemap.xml`, `security.txt`, `.well-known/security.txt`, and `CNAME`. Do not present this website checkout as a substitute for the source/checker repository.
