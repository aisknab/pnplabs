# Reproducibility

This file separates reproducibility for this public website checkout from reproducibility for the source/checker release named in the report.

## Public Website Checkout

### Required Toolchain

- OS: Linux, macOS, or Windows with a POSIX-like shell for the commands below.
- Node.js: version 20 or newer.
- npm: the version bundled with Node 20 or newer.
- No package install is required for the current smoke tests because they use only Node built-ins.

This change set was verified on Linux `6.12.90+deb13.1-amd64` with Node `v20.19.2` and npm `10.8.1`.

### Fresh Clone Steps

```bash
git clone <this-repository-url> pnplabs
cd pnplabs
node --version
npm test
```

### One-Command Verification

```bash
npm test
```

This runs:

- `npm run test:unit`;
- `npm run verify:seal`;
- `npm run examples:minimal`;
- `npm run test:negative`;
- `npm run repro:smoke`;
- `npm run test:docs`.

### Expected Hashes

The local public manifest records these file hashes:

| File | SHA-256 |
| --- | --- |
| `downloads/canonical_proof_report.pdf` | `53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d` |
| `downloads/canonical-proof-report.pdf` | `53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d` |
| `downloads/canonical_proof_report.tex` | `414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7` |
| `downloads/canonical-proof-report.tex` | `414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7` |
| `downloads/source-checker-release.json` | `7c2845c2ef0878764f662650cb829313040e3f8cd2d8ad61be9c43f51f3f9cbc` |

### Expected Runtime Range

On a normal development machine, the public checkout smoke tests should complete in under 10 seconds. They do not run the full proof/checker validation.

The bundled report records a source/checker validation duration of `2033521.892701 ms` for the sealed run. That run cannot be reproduced from this website-only checkout.

### Generated Artefacts

The public smoke tests do not generate durable proof artefacts. They print verification output and leave the repository tree unchanged.

### Comparing Regenerated And Published Artefacts

For this checkout, compare file identity with:

```bash
npm run verify:seal
sha256sum downloads/canonical_proof_report.pdf downloads/canonical_proof_report.tex downloads/source-checker-release.json
```

The first command compares files against `downloads/release-seal.json` and `downloads/SHA256SUMS`. The second command is an independent shell-level digest check on systems that provide `sha256sum`. These checks verify artefact identity only, not theorem correctness.

## Source/Checker Reproduction

The report names:

- source/checker tag: `final-pnp-proof-report-hardened-7072f8d`;
- source/checker commit: `7072f8d0bda6d44d240f9bb3fad624fd357e1278`;
- sealed artefact tag: `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed`;
- proof-report bundle path: `proof-artifacts/final-pnp-proof-report-hardened-7072f8d/`.

Those source/checker files are not present in this repository. A full theorem-level reproduction requires obtaining that source/checker repository or release bundle, then running the validation commands documented there. The result to compare is not merely a PDF hash; it is the accepted theorem fields, package/replay/certificate linkage, and central canonical-byte digests reported in the final proof report.

### Full Source/Checker Reproduction From Sibling Repo

When both repositories are local siblings, this is the concrete source/checker audit path. The checksum commands verify artefact identity only, not theorem correctness. `npm run validate` checks the `pnp` source/checker package according to its implementation; it is not external mathematical acceptance.

```bash
cd ../pnp
git fetch --tags --force
git checkout final-pnp-proof-report-artifacts-hardened-7072f8d-sealed

BUNDLE=proof-artifacts/final-pnp-proof-report-hardened-7072f8d
sha256sum -c "$BUNDLE/SHA256SUMS"
sha256sum -c "$BUNDLE/SHA256SUMS.sha256"

git checkout final-pnp-proof-report-hardened-7072f8d
npm ci
npm run validate
```

## Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `node: command not found` | Node.js is not installed | Install Node.js 20 or newer. |
| `npm test` fails in `verify:seal` | A bundled file changed or is missing | Inspect `downloads/release-seal.json`, `downloads/SHA256SUMS`, and the reported file path. |
| `examples:minimal` fails | A reviewer fixture or fixture checker changed | Run the failing command directly and inspect the named rejection reason. |
| `test:docs` fails | A local Markdown or HTML link points to a missing file | Fix the link or add the intended file. |
| Browser digest check fails | The served PDF bytes differ from the expected digest | Use `npm run verify:seal`; do not rely on the bundled artefact until resolved. |
| Full checker reproduction cannot start | This checkout lacks the source/checker implementation | Request or locate the source/checker release named above. |
