# Audience and usability contract

PNPLabs serves readers ranging from people seeing P versus NP for the first time
to specialists auditing Lean kernel types. The site must present one conservative
status at every depth. A simpler explanation may omit detail, but it must never
widen the mathematical claim.

## Information order

1. State the result in ordinary language: **P = NP is not established.**
2. Explain the subject and the latest bounded change without assuming a
   mathematics or formal-methods background.
3. Link readers to Updates, FAQ, Formal status, and Technical review according to
   the depth they want.
4. Put exact theorem names, coordinates, rule counts, bounds, and axiom closures
   in clearly labelled technical sections.

The primary navigation is fixed as Overview, Updates, FAQ, Formal status, and
Technical review. Contact routes to the review hub. Public pages also expose the
stable Atom feed at `https://pnplabs.com.au/updates.xml`.

## Milestone updates

Every newly earned formal milestone has exactly two reviewed plain-language
paragraphs before its technical disclosure. The technical text is generated from
the canonical status milestone rather than maintained as a second editorial
description. It includes the exact verified scope, non-claim, theorem-pin count,
core commit/tree, status coordinate, and publication coordinate.

Following updates requires no account, email address, or third-party provider.
The HTML page and Atom feed are deterministic products of
`content/milestone-updates.json` and the current formal payloads.

## Disclosures and no-JavaScript behavior

Long technical material uses native `details` and `summary` controls. Each
collapsed control must say what can be shown, include a visible chevron, expose a
keyboard focus indicator, and have a target at least 44 CSS pixels high. The
homepage theorem boundary, release identifiers, update technical records, and
full milestone ledger are collapsed by default.

The essential result, latest update, navigation, FAQ answers, and technical
fallback copy live in HTML. JavaScript may validate and enhance current formal
payloads, but it must not inject or rewrite the page's substantive meaning. A
reader with JavaScript disabled receives the same claim boundary.

## Progress metrics

Current pages keep two measures visibly separate. **Formal artefact coverage** is
the earned-row ratio in the current scoped publication ledger. It is not proof
completion, and its denominator can grow as dependencies are discovered or
decomposed. **Risk-weighted proof completion** is generated only from the fixed
100-point checkpoint ledger mirrored at `public/pnp-proof-progress.json`.

The risk-weighted estimate is never the probability that the proposed route is
correct, a confidence score, a theorem-correctness measure, or a time estimate.
It may decrease when assumptions, hidden complexity, invalidated dependencies, or
new blockers are found. The uncertainty range and non-claim must appear next to
the estimate wherever it is presented. Historical editorial percentages remain
labelled as superseded historical measures rather than rewritten as current
proof-completion scores.

## Artefact identity

Coordinates, commits, trees, byte counts, and SHA-256 digests identify exact
source and artefact bytes and help detect drift. They do not establish the truth
of a theorem. Plain-language pages must not present a green check, matching hash,
successful build, external review, or historical checker result as mathematical
proof.

## Review checks

The durable usability tests require consistent navigation and feed discovery on
every public HTML route; static plain-language orientation; labelled, collapsed,
keyboard-visible technical disclosures; the two separately qualified progress metrics; and the
absence of runtime copy-rewrite helpers. Formal source-bound tests remain the
authority for theorem identities and the fail-closed publication boundary.
