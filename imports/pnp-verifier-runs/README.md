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
