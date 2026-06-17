# PNP Labs proof review package

This repository is the public website, report, checksum manifest, reviewer documentation, and smoke-test harness for a claimed proof of `P = NP`.

The extraordinary claim is not externally accepted by virtue of this repository. The bundled report states that a generated finite proof-carrying package over a locked NAND residual-slack construction is accepted by a checker stack, and that this acceptance yields `P = NP`. This checkout does not include the full source/checker implementation named by the report.

Current verification status:

- Public file identity can be checked here with SHA-256.
- Minimal reviewer examples and negative fixtures can be run here.
- Theorem correctness, checker soundness, and full source/checker reproduction remain external-review tasks.

A hash check can establish only that local bytes match `downloads/release-seal.json` and `downloads/SHA256SUMS`. It cannot establish theorem correctness.

The checker claim, as stated by the report, is that `CheckPCCPackexp(GeneratePCCPack())=accept` is replayed through final certificate, release gate, and `CheckFinalPNPProofReport0`. To audit that claim, reviewers need the source/checker revision `final-pnp-proof-report-hardened-7072f8d` at commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`.

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
npm run repro:smoke        # public reproducibility smoke test
npm run test:docs          # local documentation link check
npm test                   # all local checks
```

## Included Public Files

- `index.html`, `paper.html`, `architecture.html`, `verify.html`, `faq.html`, `review.html` - static public pages.
- `downloads/canonical_proof_report.pdf` and `downloads/canonical_proof_report.tex` - bundled report artefacts.
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
