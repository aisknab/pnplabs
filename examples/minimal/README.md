# Minimal Reviewer Examples

These examples are deliberately small JSON fixtures for onboarding and negative-test coverage. They are not the proof checker and do not validate `P = NP`.

Run all examples:

```bash
npm run examples:minimal
```

Run one example:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/pass-basic-all-invariants.json
```

## Passing Example: All Fixture Invariants

Human-readable input: `minimal locked NAND fixture: NAND(a,b)=not(a and b); size=6; mu=2; residual=4`

Expected certificate:

- PCCPack fixture version is `review-fixture-v1`;
- locked NAND truth table is `1110` in row order `00, 01, 10, 11`;
- residual slack is `6 - 2 = 4`;
- no executable minimization token appears;
- quotient equality is not used as full replacement;
- seal hash matches `minimal release payload: fixture identity only`;
- parser digest matches the human-readable input.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/pass-basic-all-invariants.json
```

Expected output:

```text
ACCEPT pass-basic-all-invariants
```

What it proves: the educational fixture is internally consistent under the local fixture checker.

What it does not prove: theorem correctness, real `PCCPack` acceptance, checker soundness, or source/checker reproducibility.

## Failing Example: Invalid Locked NAND

Human-readable input: same as the passing fixture, but the JSON truth table is changed to `1111`.

Expected certificate: all non-locked-NAND fields are otherwise well formed.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-invalid-locked-nand.json
```

Expected output:

```text
REJECT INVALID_LOCKED_NAND locked NAND truth table must be NAND in row order 00, 01, 10, 11
```

What it proves: the fixture checker rejects a wrong NAND truth table with a named reason.

What it does not prove: the real Package G checker rejects every possible locked-NAND error.

## Failing Example: Residual Slack Mismatch

Human-readable input: same as the passing fixture, but the certificate records residual slack `3`.

Expected certificate: size is `6`, minimum size is `2`, so the only valid residual slack is `4`.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-residual-slack-mismatch.json
```

Expected output:

```text
REJECT RESIDUAL_SLACK_MISMATCH residual slack must equal circuit.size - certificate.minimumSize and stay within the stated bound
```

What it proves: the local fixture arithmetic is checked rather than trusted.

What it does not prove: the report's minimum-size definition is correct.

## Failing Example: Hidden Minimization Attempt

Human-readable input: same as the passing fixture, but an executable row calls `minimumEquivalent(row)`.

Expected certificate: all structural fields are valid; only the executable forbidden symbol should fail.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-hidden-minimization-attempt.json
```

Expected output:

```text
REJECT HIDDEN_MINIMIZATION_ATTEMPT executable row bad-row contains forbidden minimization syntax
```

What it proves: the local fixture checker flags a representative forbidden minimization token.

What it does not prove: the real checker expands every macro, alias, generated template, and import correctly.

## Failing Example: Mode Firewall Violation

Human-readable input: same as the passing fixture, but quotient equality is consumed as a full-mode replacement.

Expected certificate: full-mode replacement must require a checked lift and zero open obligations.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-mode-firewall-violation.json
```

Expected output:

```text
REJECT MODE_FIREWALL_VIOLATION quotient equality cannot be consumed as a constructive full-mode replacement
```

What it proves: the local fixture checker distinguishes quotient comparison from full replacement.

What it does not prove: the source checker enforces every mode boundary in the generated package.

## Failing Example: Malformed PCCPack

Human-readable input: same as the passing fixture, but the PCCPack fixture version is unsupported.

Expected certificate: unsupported package schema must be rejected before downstream checks.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-malformed-pccpack.json
```

Expected output:

```text
REJECT MALFORMED_PCCPACK unsupported PCCPack fixture version
```

What it proves: the local fixture checker does not silently accept unknown package schemas.

What it does not prove: the real parser and package checker are complete.

## Failing Example: Invalid ZeroSlack Condition

Human-readable input: a zero-slack variant with size `2`, minimum size `2`, and residual slack `0`.

Expected certificate: ZeroSlack must be closed and leave no positive residual witness.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-invalid-zeroslack.json
```

Expected output:

```text
REJECT INVALID_ZEROSLACK_CONDITION zero residual slack must close ZeroSlack and leave no positive residual witness
```

What it proves: the local fixture checker rejects an open ZeroSlack state.

What it does not prove: the report's ZeroSlack contradiction or residual descent theorem is correct.

## Failing Example: Hash Mismatch

Human-readable input: same as the passing fixture, but the seal digest is all zeroes.

Expected certificate: SHA-256 of `minimal release payload: fixture identity only` must match the recorded digest.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-hash-mismatch.json
```

Expected output:

```text
REJECT HASH_MISMATCH seal SHA-256 does not match payload text
```

What it proves: the local fixture checker recomputes a digest before accepting identity.

What it does not prove: a matching hash says anything about theorem correctness.

## Failing Example: Certificate/Parser Mismatch

Human-readable input: same as the passing fixture, but the certificate records the digest of different text.

Expected certificate: `certificate.parsedSourceSha256` must equal the SHA-256 of `sourceText`.

Checker command:

```bash
node tools/reviewer-fixture-checker.mjs examples/minimal/fail-certificate-parser-mismatch.json
```

Expected output:

```text
REJECT CERTIFICATE_PARSER_MISMATCH certificate parser digest does not match the human-readable source text
```

What it proves: the local fixture checker catches one parser/certificate linkage error.

What it does not prove: the real parser is canonical or unambiguous.
