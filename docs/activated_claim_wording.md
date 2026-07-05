# Activated theorem-status wording guard

This site now mirrors the activated theorem-emission status from `aisknab/pnp`.

The allowed public theorem wording is:

```text
P = NP public theorem emission is activated under the repository checker trust model.
```

or equivalently:

```text
publicTheoremEmissionAllowed = true
publicTheoremStatement = "P = NP"
publicTheoremUnderCheckerTrustModel = true
```

## Required boundary

Every activated public surface must preserve these statements:

```text
externalReviewIsMathematicalPremise = false
externalReviewAcceptanceRequiredForEmission = false
remainingBlockers = []
```

External review remains invited as reproducibility, audit, and bug-finding evidence. It is not a theorem premise and is not represented as independent consensus.

## Permitted language

Use language like:

```text
activated under the repository checker trust model
source/checker verifier
machine-readable activated status payload
external review remains audit evidence
reproducible verifier run evidence
```

## Forbidden language

Do not claim:

```text
independent external consensus
peer-reviewed acceptance
external review proves the theorem
external review is the proof premise
reviewers are vanity
Clay prize awarded
practical cures or guaranteed applications
```

Do not state downstream applications as established consequences on this public site. Applications can be described only as future or potential work after separate extraction, benchmarking, and audit.

## Source of truth

The live site status payload is:

```text
public/pnp-status.json
```

The legacy public-review payloads remain available as historical surfaces, but they do not override the activated status payload.
