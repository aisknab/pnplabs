# PNP verifier run imports

Place candidate source/checker verifier run records in this directory before importing them into the public registry.

Expected record kind:

```text
PNPActivatedVerificationRunRecord0
```

Expected record classes:

```text
source-checker-verifier-run
external-source-checker-verifier-run
first-party-source-checker-ci
```

Normalize an import candidate before review:

```bash
npm run pnp:normalize-run -- --json imports/pnp-verifier-runs/<record>.json
```

Attach normalized digests in-place:

```bash
npm run pnp:normalize-run -- --write imports/pnp-verifier-runs/<record>.json
```

The normalizer writes:

```text
normalizedDigests.policy = PNPActivatedRunDigestNormalization0
normalizedDigests.runRecordNormalizedSha256
normalizedDigests.verdictNormalizedSha256
normalizedDigests.activatedStatusNormalizedSha256
normalizedDigests.proofScriptOutputsNormalizedSha256
normalizedDigests.artifactsOrLogsNormalizedSha256
```

It normalizes timestamps, ANSI escapes, line endings, blank lines, and trailing whitespace so verifier logs can be compared across CI providers.

Check an import candidate without editing the registry:

```bash
npm run pnp:import-run -- --check imports/pnp-verifier-runs/<record>.json public/pnp-verification-runs.json
```

Apply an accepted import to the registry:

```bash
npm run pnp:import-run -- --write imports/pnp-verifier-runs/<record>.json public/pnp-verification-runs.json
```

The import validator requires:

```text
publicTheoremEmissionAllowed = true
publicTheoremStatement = "P = NP"
remainingBlockers = []
externalReviewIsMathematicalPremise = false
statusPayloadSha256 = <64 lowercase hex characters>
```

It also requires focused proof-script evidence for:

```text
proof:activated-pnp-status
proof:public-theorem-activation
proof:unrestricted-final-soundness-release
proof:uniform-complexity-conclusion
```

A registry entry records reproducibility evidence. It is not an external-consensus claim or peer-review acceptance.
