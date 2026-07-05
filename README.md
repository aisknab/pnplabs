# PNP Labs public status package

This checkout is a public website, bundled report, checksum manifest, reviewer documentation, minimal fixture harness, and smoke-test package for a claimed proof of `P = NP`.

It is not evidence of external consensus, and it is not the full source/checker repository named by the bundled report.

## Read This First

**Activated source/checker status:** the mirrored source/checker status now records `publicTheoremEmissionAllowed = true`, `publicTheoremStatement = "P = NP"`, and `remainingBlockers = []` under the repository checker trust model. See [`status.html`](status.html) and [`public/pnp-status.json`](public/pnp-status.json).

**Independent-review status:** external review is not treated as a mathematical premise for theorem emission. It remains invited as reproducibility evidence, bug-finding, and audit work. This website does not claim independent external consensus.

**Local verification status:** this checkout can verify public report file identity via SHA-256, minimal educational fixture pass/fail behavior, negative fixture rejection reasons, local documentation links, and the activated status payload shape.

**Trust boundaries:** a hash match verifies artefact identity only. It does not verify theorem correctness. Minimal fixtures demonstrate named local invariants only; they are not proof evidence. The theorem-emission status comes from the source/checker repository.

**Checker claim to audit:** the report and source/checker status state that the accepted proof stack emits `P = NP` under the explicit checker trust model. Auditing that claim requires the source/checker repository `aisknab/pnp` and the verifier command below.

**Release-reference model:** [docs/source_checker_map.md](docs/source_checker_map.md) separates `sourceRef` for source/checker code, `docsRef` for 7072f8d release documentation, and `artifactRef` for generated proof-report artefacts. Do not use one default `pnp` ref for all paths.

**Access boundary:** if `aisknab/pnp` is private or unavailable to a reviewer, they cannot independently retrieve or run the source/checker validation until access is granted.

**Terminology status:** [docs/terminology_crosswalk.md](docs/terminology_crosswalk.md) maps internal names to standard terms and classifies evidence status. Author clarification may resolve ambiguity, but it is not verification evidence.

## Full Source/Checker Audit

This website checkout does not run the full source/checker stack. For cross-repo audit targets, use [docs/source_checker_map.md](docs/source_checker_map.md). Paths there are pinned separately as source/checker code, release documentation, generated artefacts, or public-review files.

When an authorized sibling source/checker checkout exists, it can be used to audit the implementation and reproduce its validation run. That validation is still not external consensus.

## Activated source/checker payloads

The activated source/checker repository state is mirrored into static payloads under `public/`. These payloads are site-facing summaries only; the source of truth remains `aisknab/pnp` and the reviewer command remains:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
npm ci
npm run pnp:verify
```

Current mirrored boundary:

```text
publicTheoremEmissionAllowed = true
publicTheoremStatement = "P = NP"
publicTheoremConclusion = "P = NP"
publicTheoremUnderCheckerTrustModel = true
finalTheoremReady = true
internalFinalTheoremReady = true
unrestrictedFinalSoundnessDischarged = true
remainingBlockers = []
```

The public status page is [`status.html`](status.html).

Static payloads for public consumers:

- [`public/pnp-index.json`](public/pnp-index.json) - payload index.
- [`public/pnp-status.json`](public/pnp-status.json) - activated status and coordinate mirror.
- [`public/pnp-public-review.json`](public/pnp-public-review.json) - legacy public-review entrypoint, handoff, and boundary summary.
- [`public/pnp-theorem-emission-gate.json`](public/pnp-theorem-emission-gate.json) - legacy public-review theorem-emission gate payload, superseded by the activated status payload.
- [`public/pnp-external-review-status.json`](public/pnp-external-review-status.json) - legacy external-review status summary.

The activated payloads record public theorem emission under the repository checker trust model. They do not claim independent external consensus and do not mutate the historical sealed report.

Run the smallest local verification:

```bash
npm test
```

Reviewers should start with:

- [status.html](status.html)
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

- `index.html`, `status.html`, `paper.html`, `architecture.html`, `verify.html`, `faq.html`, `review.html` - static public pages.
- `public/pnp-index.json`, `public/pnp-status.json`, `public/pnp-public-review.json`, `public/pnp-theorem-emission-gate.json`, `public/pnp-external-review-status.json` - status-bound source/checker payloads mirrored from `aisknab/pnp`.
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

Public hosting should serve only the static pages, `assets/`, `downloads/`, `robots.txt`, `sitemap.xml`, `security.txt`, `.well-known/security.txt`, `CNAME`, and public review-status material. Do not present this website checkout as a substitute for the source/checker repository.
