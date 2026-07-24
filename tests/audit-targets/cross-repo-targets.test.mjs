import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  AuditTargetValidationError,
  validateAuditTargets
} from "../../tools/check-cross-repo-targets.mjs";

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

const publishedInventory = JSON.parse(readFileSync(
  new URL("../../public/pnp-theorem-inventory.json", import.meta.url),
  "utf8"
));
const publishedStatus = JSON.parse(readFileSync(
  new URL("../../public/pnp-status.json", import.meta.url),
  "utf8"
));
const publishedRelease = JSON.parse(readFileSync(
  new URL("../../downloads/formal-publication-release.json", import.meta.url),
  "utf8"
));
const FORMULA_CURSOR_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256;
const FORMULA_CURSOR_THEOREM_NAMES = Object.keys(FORMULA_CURSOR_THEOREM_HASHES);
const FORMULA_CURSOR_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => FORMULA_CURSOR_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(FORMULA_CURSOR_THEOREM_NAMES.length, 16);
assert.equal(FORMULA_CURSOR_CANDIDATES.length, 16);
const BUILDER_INPUT_LENGTH_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256;
const BUILDER_INPUT_LENGTH_THEOREM_NAMES = Object.keys(BUILDER_INPUT_LENGTH_THEOREM_HASHES);
const BUILDER_INPUT_LENGTH_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_INPUT_LENGTH_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_INPUT_LENGTH_THEOREM_NAMES.length, 10);
assert.equal(BUILDER_INPUT_LENGTH_CANDIDATES.length, 10);
const BUILDER_INPUT_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256;
const BUILDER_INPUT_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_INPUT_PREFIX_THEOREM_HASHES);
const BUILDER_INPUT_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_INPUT_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_INPUT_PREFIX_THEOREM_NAMES.length, 14);
assert.equal(BUILDER_INPUT_PREFIX_CANDIDATES.length, 14);
const BUILDER_TOKEN_APPENDER_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256;
const BUILDER_TOKEN_APPENDER_THEOREM_NAMES = Object.keys(BUILDER_TOKEN_APPENDER_THEOREM_HASHES);
const BUILDER_TOKEN_APPENDER_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_TOKEN_APPENDER_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_TOKEN_APPENDER_THEOREM_NAMES.length, 17);
assert.equal(BUILDER_TOKEN_APPENDER_CANDIDATES.length, 17);
const BUILDER_FIRST_TOKEN_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256;
const BUILDER_FIRST_TOKEN_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FIRST_TOKEN_PREFIX_THEOREM_HASHES);
const BUILDER_FIRST_TOKEN_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIRST_TOKEN_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_FIRST_TOKEN_PREFIX_THEOREM_NAMES.length, 25);
assert.equal(BUILDER_FIRST_TOKEN_PREFIX_CANDIDATES.length, 25);
const BUILDER_UNARY_POLYNOMIAL_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256;
const BUILDER_UNARY_POLYNOMIAL_THEOREM_NAMES = Object.keys(BUILDER_UNARY_POLYNOMIAL_THEOREM_HASHES);
const BUILDER_UNARY_POLYNOMIAL_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_UNARY_POLYNOMIAL_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_UNARY_POLYNOMIAL_THEOREM_NAMES.length, 10);
assert.equal(BUILDER_UNARY_POLYNOMIAL_CANDIDATES.length, 10);
const BUILDER_COMPLETE_HEADER_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256;
const BUILDER_COMPLETE_HEADER_THEOREM_NAMES = Object.keys(BUILDER_COMPLETE_HEADER_THEOREM_HASHES);
const BUILDER_COMPLETE_HEADER_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_COMPLETE_HEADER_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_COMPLETE_HEADER_THEOREM_NAMES.length, 38);
assert.equal(BUILDER_COMPLETE_HEADER_CANDIDATES.length, 38);
const BUILDER_BODY_START_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256;
const BUILDER_BODY_START_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_BODY_START_PREFIX_THEOREM_HASHES);
const BUILDER_BODY_START_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_BODY_START_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_BODY_START_PREFIX_THEOREM_NAMES.length, 42);
assert.equal(BUILDER_BODY_START_PREFIX_CANDIDATES.length, 42);
const BUILDER_FIRST_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_FIRST_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FIRST_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_FIRST_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIRST_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_FIRST_LITERAL_PREFIX_THEOREM_NAMES.length, 52);
assert.equal(BUILDER_FIRST_LITERAL_PREFIX_CANDIDATES.length, 52);
const BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256;
const BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_HASHES);
const BUILDER_FIRST_CLAUSE_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES.length, 43);
assert.equal(BUILDER_FIRST_CLAUSE_PREFIX_CANDIDATES.length, 43);
const BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256;
const BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_HASHES);
const BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES.length, 31);
assert.equal(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_CANDIDATES.length, 31);
const BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256;
const BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_HASHES);
const BUILDER_FIRST_CLAUSE_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES.length, 48);
assert.equal(BUILDER_FIRST_CLAUSE_PADDING_RUN_CANDIDATES.length, 48);
const BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_CANDIDATES.length, 40);
const BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.length, 58);
assert.equal(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES.length, 58);
const BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.length, 75);
assert.equal(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES.length, 75);
const BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256;
const BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_HASHES);
const BUILDER_SECOND_CLAUSE_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CLAUSE_PREFIX_NEW_CANDIDATES = BUILDER_SECOND_CLAUSE_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClausePrefix.')
);
assert.equal(BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES.length, 41);
assert.equal(BUILDER_SECOND_CLAUSE_PREFIX_CANDIDATES.length, 41);
assert.equal(BUILDER_SECOND_CLAUSE_PREFIX_NEW_CANDIDATES.length, 39);
const BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256;
const BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_HASHES);
const BUILDER_SECOND_CLAUSE_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CLAUSE_PADDING_RUN_NEW_CANDIDATES = BUILDER_SECOND_CLAUSE_PADDING_RUN_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.')
);
assert.equal(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES.length, 39);
assert.equal(BUILDER_SECOND_CLAUSE_PADDING_RUN_CANDIDATES.length, 39);
assert.equal(BUILDER_SECOND_CLAUSE_PADDING_RUN_NEW_CANDIDATES.length, 37);
const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256;
const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES);
const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES = BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.')
);
assert.equal(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES.length, 34);
const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES = BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.')
);
assert.equal(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.length, 58);
assert.equal(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES.length, 58);
assert.equal(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES.length, 48);
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES = BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.')
);
assert.equal(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.length, 92);
assert.equal(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES.length, 92);
assert.equal(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES.length, 90);
const BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256;
const BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_HASHES);
const BUILDER_THIRD_CLAUSE_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_THIRD_CLAUSE_PREFIX_NEW_CANDIDATES = BUILDER_THIRD_CLAUSE_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClausePrefix.')
);
assert.equal(BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_NAMES.length, 41);
assert.equal(BUILDER_THIRD_CLAUSE_PREFIX_CANDIDATES.length, 41);
assert.equal(BUILDER_THIRD_CLAUSE_PREFIX_NEW_CANDIDATES.length, 39);
const BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256;
const BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_HASHES);
const BUILDER_THIRD_CLAUSE_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_THIRD_CLAUSE_PADDING_RUN_NEW_CANDIDATES = BUILDER_THIRD_CLAUSE_PADDING_RUN_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.')
);
assert.equal(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_NAMES.length, 39);
assert.equal(BUILDER_THIRD_CLAUSE_PADDING_RUN_CANDIDATES.length, 39);
assert.equal(BUILDER_THIRD_CLAUSE_PADDING_RUN_NEW_CANDIDATES.length, 37);
const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256;
const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES);
const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES = BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.')
);
assert.equal(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES.length, 34);
const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES = BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.')
);
assert.equal(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES.length, 75);
assert.equal(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES.length, 75);
assert.equal(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES.length, 61);
const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256;
const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES);
const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES = BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.')
);
assert.equal(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES.length, 92);
assert.equal(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES.length, 92);
assert.equal(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES.length, 74);
const BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFourthClausePrefixTheoremKernelTypeSha256;
const BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_NAMES = Object.keys(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_HASHES);
const BUILDER_FOURTH_CLAUSE_PREFIX_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FOURTH_CLAUSE_PREFIX_NEW_CANDIDATES = BUILDER_FOURTH_CLAUSE_PREFIX_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFourthClausePrefix.')
);
assert.equal(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_NAMES.length, 41);
assert.equal(BUILDER_FOURTH_CLAUSE_PREFIX_CANDIDATES.length, 41);
assert.equal(BUILDER_FOURTH_CLAUSE_PREFIX_NEW_CANDIDATES.length, 39);
const BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFourthClausePaddingRunTheoremKernelTypeSha256;
const BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_HASHES);
const BUILDER_FOURTH_CLAUSE_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FOURTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES = BUILDER_FOURTH_CLAUSE_PADDING_RUN_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.')
);
assert.equal(BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_NAMES.length, 39);
assert.equal(BUILDER_FOURTH_CLAUSE_PADDING_RUN_CANDIDATES.length, 39);
assert.equal(BUILDER_FOURTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES.length, 37);
const BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFifthClausePaddingRunTheoremKernelTypeSha256;
const BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_HASHES);
const BUILDER_FIFTH_CLAUSE_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FIFTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES = BUILDER_FIFTH_CLAUSE_PADDING_RUN_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.')
);
assert.equal(BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_NAMES.length, 39);
assert.equal(BUILDER_FIFTH_CLAUSE_PADDING_RUN_CANDIDATES.length, 39);
assert.equal(BUILDER_FIFTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES.length, 37);
const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunTheoremKernelTypeSha256;
const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_NAMES = Object.keys(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_HASHES);
const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_NEW_CANDIDATES = BUILDER_FIRST_CONSTRAINT_PADDING_RUN_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.')
);
assert.equal(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_NAMES.length, 39);
assert.equal(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_CANDIDATES.length, 39);
assert.equal(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_NEW_CANDIDATES.length, 37);
const PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run'
);
assert.ok(PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_CANDIDATES.filter(
  (candidate) => candidate.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_NEW_CANDIDATES.length, 34);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_CANDIDATES.filter(
  (candidate) => !BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_NEW_CANDIDATES.length, 40);
const PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES.length, 40);
const PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES.filter(
  (candidate) => !BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES.length, 35);
const PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE);
const BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES =
  publishedRelease.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256;
const BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES = Object.keys(BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES);
const BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES = publishedInventory.milestoneCandidates.filter(
  (candidate) => BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.includes(candidate.name)
);
const BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES = BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES.filter(
  (candidate) => !BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.includes(candidate.name)
);
assert.equal(BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES.length, 40);
assert.equal(BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES.length, 35);
const PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE = publishedStatus.formalPublicationMilestones.find(
  (row) => row.id === 'concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step'
);
assert.ok(PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE);

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function write(root, relativePath, content) {
  const filePath = path.join(root, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function makeProject(t) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-targets-"));
  const sourceDir = path.join(root, "pnp");
  mkdirSync(sourceDir, { recursive: true });
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const status = json({
    kind: "PNPFormalReconstructionStatus0",
    concretePublicationGate: { passed: false },
    publicationStatusDerivedOnlyFromConcreteGate: true,
    mathematicalTheoremEstablished: false,
    publicTheoremEmissionAllowed: false,
    publicTheoremStatement: null,
    leanConcreteCNFSATMembershipFormalized: true,
    leanConcreteCNFSATMembershipTheorem: "PNP.Concrete.FinalUniversalDesign.cnfSATInNP",
    leanConcreteCNFWorkAxiomAuditPassed: true,
    leanConcreteCNFWorkAuditedDeclarationCount: 766,
    leanConcretePipelineStateNamespaceFormalized: true,
    leanConcretePipelineStateNamespaceAxiomAuditPassed: true,
    leanConcretePipelineStateNamespaceAuditedDeclarationCount: 39,
    leanConcretePipelineStageBridgesFormalized: true,
    leanConcretePipelineStageBridgesAxiomAuditPassed: true,
    leanConcretePipelineStageBridgesAuditedDeclarationCount: 56,
    leanConcretePipelineStageLaunchFormalized: true,
    leanConcretePipelineVerdictPreservationFormalized: true,
    leanConcretePipelineInternalOutputHandoffComposed: true,
    leanConcretePipelineTerminalOutputPackingFormalized: true,
    leanConcretePipelineTerminalOutputPackerAxiomAuditPassed: true,
    leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount: 69,
    leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized: true,
    leanConcretePipelineTerminalBridgeAxiomAuditPassed: true,
    leanConcretePipelineTerminalBridgeAuditedDeclarationCount: 59,
    leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized: true,
    leanConcretePipelineInputFramerAxiomAuditPassed: true,
    leanConcretePipelineInputFramerAuditedDeclarationCount: 70,
    leanConcretePipelineAllInputFramingFormalized: true,
    leanConcretePipelinePairedCompilerAxiomAuditPassed: true,
    leanConcretePipelinePairedCompilerAuditedDeclarationCount: 28,
    leanConcretePipelineCanonicalPairCompilationFormalized: true,
    leanConcretePipelineCompilerAxiomAuditPassed: true,
    leanConcretePipelineCompilerAuditedDeclarationCount: 29,
    leanConcretePipelineAllInputCompilationFormalized: true,
    leanConcretePipelineMalformedInputBehaviorFormalized: true,
    leanConcretePipelineRawRefinementFormalized: true,
    leanConcretePipelineExternalInputSizePolynomialFormalized: true,
    leanConcretePipelineSequentialNamespaceFormalized: true,
    leanConcretePipelineSequentialNamespaceAxiomAuditPassed: true,
    leanConcretePipelineSequentialNamespaceAuditedDeclarationCount: 26,
    leanConcretePipelineSequentialCompilationFormalized: true,
    leanConcretePipelineSequentialCompilerAxiomAuditPassed: true,
    leanConcretePipelineSequentialCompilerAuditedDeclarationCount: 31,
    leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized: true,
    leanConcretePipelineSequentialExternalInputSizePolynomialFormalized: true,
    leanConcretePipelineSequentialStuckFirstTimeoutFormalized: true,
    leanConcretePipelineRefinementAxiomAuditPassed: true,
    leanConcretePipelineRefinementAuditedDeclarationCount: 16,
    leanConcreteFunctionProgramRecursiveCompilationFormalized: true,
    leanConcreteDecisionProgramRecursiveCompilationFormalized: true,
    leanConcretePolynomialTimeDeciderRawCompilationFormalized: true,
    standardComplexityModelFormalized: true,
    leanConcreteCookLevinBuilderInputLengthFormalized: true,
    leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount: 39,
    leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized: true,
    leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount: 40,
    leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount: 68,
    leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized: true,
    leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixFormalized: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount: 37,
    leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized: true,
    leanConcreteCookLevinBuilderUnaryPolynomialFormalized: true,
    leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount: 74,
    leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized: true,
    leanConcreteCookLevinBuilderCompleteHeaderFormalized: true,
    leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount: 84,
    leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount: 60,
    leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount: 74,
    leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount: 79,
    leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount: 47,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount: 84,
    leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount: 56,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount: 87,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount: 115,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount: 57,
    leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount: 68,
    leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount: 56,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount: 87,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount: 145,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount: 57,
    leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount: 68,
    leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount: 56,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount: 115,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount: 147,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount: 57,
    leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount: 68,
    leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount: 68,
    leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed: true,
    leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized: true,
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderFirstConstraintPaddingRun")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintSeparatorStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep")
    ))),
    ...structuredClone(Object.fromEntries(Object.entries(publishedStatus).filter(
      ([name]) => name.startsWith("leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep")
    ))),
    leanConcreteCookLevinBuilderDynamicCursorFormalized: false,
    leanConcreteCookLevinFormulaBuilderFormalized: false,
    leanConcreteCookLevinBuilderRawRefinementFormalized: false,
    leanConcreteCookLevinBuilderPolynomialReductionFormalized: false,
    formalPublicationMilestones: [{
      id: "concrete-cook-levin-formula-size",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true
    }, {
      id: "concrete-cook-levin-formula-schedule",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true
    }, {
      id: "concrete-cook-levin-formula-cursor",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: FORMULA_CURSOR_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-input-length",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_INPUT_LENGTH_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-input-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_INPUT_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-token-appender",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_TOKEN_APPENDER_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-first-token-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FIRST_TOKEN_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-complete-header",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: [
        ...BUILDER_UNARY_POLYNOMIAL_THEOREM_NAMES,
        ...BUILDER_COMPLETE_HEADER_THEOREM_NAMES
      ]
    }, {
      id: "concrete-cook-levin-builder-body-start-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_BODY_START_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-first-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FIRST_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-first-clause-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-dynamic-token-cursor-step",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-first-clause-padding-run",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-second-clause-separator-step",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-second-clause-first-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-second-clause-second-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-second-clause-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-second-clause-padding-run",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-third-clause-separator-step",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-third-clause-first-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-third-clause-second-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-third-clause-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-third-clause-padding-run",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-separator-step",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-first-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-second-literal-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-prefix",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-padding-run",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_NAMES
    }, {
      id: "concrete-cook-levin-builder-fifth-clause-padding-run",
      earned: true,
      allPresent: true,
      allKernelTypesMatch: true,
      axiomClosureUsesOnlyLeanStandardAllowlist: true,
      requiredTheorems: BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_NAMES
    }, {
      ...structuredClone(PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE)
    }, {
      ...structuredClone(PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE)
    }],
    leanConcreteCNFSATInPFormalized: false,
    leanConcreteCNFNPCompletenessFormalized: false
  });
  const inventory = json({
    kind: "PNPLeanTheoremInventory0",
    declarationCount: 11301,
    theoremCount: 6482,
    assumptionFreeTheoremCount: 3474,
    excludedPrivateDeclarationCount: 4349,
    sourceClosureModuleCount: 99,
    axiomCount: 4,
    milestoneCandidates: [{
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language",
      module: "PNP.Concrete.CookLevinRawTapeBridge",
      kind: "theorem",
      axioms: ["Classical.choice", "Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le",
      module: "PNP.Concrete.CookLevinFormulaSize",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      module: "PNP.Concrete.CookLevinFormulaSchedule",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula",
      module: "PNP.Concrete.CookLevinFormulaSchedule",
      kind: "theorem",
      axioms: ["Quot.sound", "propext"]
    }, {
      name: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      module: "PNP.Concrete.TerminalOutputPacker",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      module: "PNP.Concrete.PipelineTerminalBridge",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      module: "PNP.Concrete.PipelinePairedCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout",
      module: "PNP.Concrete.PipelineInputFramer",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_correct",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact",
      module: "PNP.Concrete.PipelineCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact",
      module: "PNP.Concrete.PipelineSequentialCompiler",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, {
      name: "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff",
      module: "PNP.Concrete.PipelineRefinement",
      kind: "theorem",
      axioms: []
    }, ...FORMULA_CURSOR_CANDIDATES, ...BUILDER_INPUT_LENGTH_CANDIDATES, ...BUILDER_INPUT_PREFIX_CANDIDATES, ...BUILDER_TOKEN_APPENDER_CANDIDATES, ...BUILDER_FIRST_TOKEN_PREFIX_CANDIDATES, ...BUILDER_UNARY_POLYNOMIAL_CANDIDATES, ...BUILDER_COMPLETE_HEADER_CANDIDATES, ...BUILDER_BODY_START_PREFIX_CANDIDATES, ...BUILDER_FIRST_LITERAL_PREFIX_CANDIDATES, ...BUILDER_FIRST_CLAUSE_PREFIX_CANDIDATES, ...BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_CANDIDATES, ...BUILDER_FIRST_CLAUSE_PADDING_RUN_CANDIDATES, ...BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_CANDIDATES, ...BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_CANDIDATES, ...BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_CANDIDATES, ...BUILDER_SECOND_CLAUSE_PREFIX_NEW_CANDIDATES, ...BUILDER_SECOND_CLAUSE_PADDING_RUN_NEW_CANDIDATES, ...BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES, ...BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES, ...BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES, ...BUILDER_THIRD_CLAUSE_PREFIX_NEW_CANDIDATES, ...BUILDER_THIRD_CLAUSE_PADDING_RUN_NEW_CANDIDATES, ...BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_NEW_CANDIDATES, ...BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_NEW_CANDIDATES, ...BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_NEW_CANDIDATES, ...BUILDER_FOURTH_CLAUSE_PREFIX_NEW_CANDIDATES, ...BUILDER_FOURTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES, ...BUILDER_FIFTH_CLAUSE_PADDING_RUN_NEW_CANDIDATES, ...BUILDER_FIRST_CONSTRAINT_PADDING_RUN_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES, ...BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_NEW_CANDIDATES, ...Array.from({ length: 246 }, (_, index) => ({
      name: `PNP.Test.Filler${index}`,
      module: "PNP.Test",
      kind: "theorem",
      axioms: []
    }))],
    compatibilityRootCandidate: null,
    concreteTargetCandidate: {
      name: "PNP.Main.ConcretePEqualsNP",
      kind: "definition",
      axioms: []
    }
  });
  const publicationMap = json({
    kind: "TestPublicationMap",
    coordinate: "TEST-PUBLICATION-MAP",
    milestoneSourceClosureSha256: "1".repeat(64),
    gate: { passed: false },
    earnedMilestoneTheoremKernelTypeSha256: {
      "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact": "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact": "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact": "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact": "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq": "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq": "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout": "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff": "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9",
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact": "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents": "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted": "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le": "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound": "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent": "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept": "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout": "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_correct": "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq": "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq": "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout": "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff": "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact": "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin": "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq": "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin": "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq": "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965",
      "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff": "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language": "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length": "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula": "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943",
      ...FORMULA_CURSOR_THEOREM_HASHES,
      ...BUILDER_INPUT_LENGTH_THEOREM_HASHES,
      ...BUILDER_INPUT_PREFIX_THEOREM_HASHES,
      ...BUILDER_TOKEN_APPENDER_THEOREM_HASHES,
      ...BUILDER_FIRST_TOKEN_PREFIX_THEOREM_HASHES,
      ...BUILDER_UNARY_POLYNOMIAL_THEOREM_HASHES,
      ...BUILDER_COMPLETE_HEADER_THEOREM_HASHES,
      ...BUILDER_BODY_START_PREFIX_THEOREM_HASHES,
      ...BUILDER_FIRST_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_HASHES,
      ...BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_HASHES,
      ...BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_HASHES,
      ...BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES,
      ...BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_HASHES,
      ...BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_HASHES,
      ...BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_HASHES,
      ...BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_HASHES,
      ...BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES,
      ...BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_HASHES
    },
    milestones: [{
      id: "concrete-cook-levin-builder-first-clause-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the complete first canonical clause after the width header and retains the following coordinate as data. It does not implement a dynamic formula cursor or remaining formula-body emission, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-dynamic-token-cursor-step",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES,
      nonClaim: "This milestone proves one fixed padding-coordinate transition after the complete first clause. It is not a general dynamic cursor loop or raw decoder; it emits no token and supplies no remaining formula body, complete builder, FunctionProgram.RawRefinement, PolynomialReduction, CNFSAT NP-completeness or in-P result, or P = NP theorem."
    }, {
      id: "concrete-cook-levin-builder-first-clause-padding-run",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES,
      nonClaim: "This is the exact remaining first-clause padding block and second-clause boundary only, not a general dynamic formula cursor, remaining formula-body emitter, complete builder, RawRefinement, PolynomialReduction, CNFSAT NP-completeness or in-P result, or P = NP theorem."
    }, {
      id: "concrete-cook-levin-builder-second-clause-separator-step",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed populated Sep transition beginning clause two and advances to the following F coordinate. It is not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit that F or the remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-second-clause-first-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed negative literal on variable zero and advances to the following negative-sign coordinate. It does not complete clause two, implement a general dynamic formula cursor or arbitrary raw decoder, emit the remaining formula body, supply a complete builder or builder RawRefinement, package a PolynomialReduction, establish CNFSAT NP-completeness or in-P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-second-clause-second-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed negative literal on variable one in clause two and advances to the following Finish coordinate. It does not emit the clause terminator or that following Finish, complete clause two, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-second-clause-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed Finish terminator that completes clause two and advances to its first padding coordinate. It does not traverse clause-two padding, reach clause three, implement a general dynamic formula cursor or arbitrary raw decoder, emit the remaining formula body, supply a complete builder or builder RawRefinement, package a PolynomialReduction, establish CNFSAT NP-completeness or in-P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-second-clause-padding-run",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES,
      nonClaim: "This milestone executes exactly the remaining second-clause padding block and identifies the third-clause separator boundary without emitting a token. It reaches clause three only as a retained coordinate. It is not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit the third-clause separator or remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-third-clause-separator-step",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed populated Sep transition beginning clause three and advances to the following F coordinate. It is not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit that F or the remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-third-clause-first-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed negative literal on variable zero in clause three and advances to the following negative-sign coordinate. It does not emit that following F, complete clause three, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-third-clause-second-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed negative literal on variable two in clause three and advances to the following Finish coordinate. It does not emit the following Finish, complete clause three, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-third-clause-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_THIRD_CLAUSE_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits only the fixed Finish terminator that completes clause three and advances to its first padding coordinate. It does not traverse clause-three padding, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-third-clause-padding-run",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREM_NAMES,
      nonClaim: "This milestone executes exactly the remaining third-clause padding block and identifies the fourth-clause separator boundary without emitting a token. It reaches clause four only as a retained coordinate. It is not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit the fourth-clause separator or remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-separator-step",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES,
      nonClaim: "This milestone emits exactly one token: the fixed Sep that starts clause four. It observes but does not emit the following F, does not complete clause four, does not implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit the remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-first-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits exactly the fixed first negative literal on variable one in clause four. It observes but does not emit the following second-literal F, does not complete clause four, does not implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit the remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-second-literal-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits exactly the fixed second negative literal on variable two in clause four. It observes but does not emit the following Finish, does not complete clause four, does not implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, does not emit the remaining formula body, and does not construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-prefix",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FOURTH_CLAUSE_PREFIX_THEOREM_NAMES,
      nonClaim: "This milestone emits exactly the fixed Finish terminator that completes clause four and advances to its first padding coordinate. It does not traverse clause-four padding, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fourth-clause-padding-run",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREM_NAMES,
      nonClaim: "This milestone traverses the remaining clause-four padding block without emitting a token and reaches the first padding coordinate of the intentionally empty fifth clause rectangle. It does not traverse that empty rectangle, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: "concrete-cook-levin-builder-fifth-clause-padding-run",
      classification: "formalized-foundation-only",
      requiredTheorems: BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREM_NAMES,
      nonClaim: "This milestone traverses only the intentionally empty fifth clause rectangle and retains the first opportunity in the intentionally empty sixth clause rectangle. It does not traverse that sixth rectangle, reach the next constraint, emit another token, implement a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates, emit the remaining formula body, construct a complete formula builder or FunctionProgram.RawRefinement, package a concrete PolynomialReduction, establish CNFSAT NP-hardness or NP-completeness, establish CNFSAT in P, or prove P = NP."
    }, {
      id: PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE.id,
      classification: PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE.classification,
      requiredTheorems: BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREM_NAMES,
      nonClaim: PUBLISHED_FIRST_CONSTRAINT_PADDING_RUN_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_SEPARATOR_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.nonClaim
    }, {
      id: PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.id,
      classification: PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.classification,
      requiredTheorems: BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_THEOREM_NAMES,
      nonClaim: PUBLISHED_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_MILESTONE.nonClaim
    }]
  });

  git(sourceDir, ["init"]);
  git(sourceDir, ["config", "user.email", "audit@example.invalid"]);
  git(sourceDir, ["config", "user.name", "Audit Test"]);
  write(sourceDir, "public/pnp-status.json", status);
  write(sourceDir, "public/pnp-theorem-inventory.json", inventory);
  write(sourceDir, "publication/FORMAL_PUBLICATION_MAP.json", publicationMap);
  git(sourceDir, ["add", "."]);
  git(sourceDir, ["commit", "-m", "fixture"]);
  const commit = git(sourceDir, ["rev-parse", "HEAD"]);
  const tree = git(sourceDir, ["rev-parse", "HEAD^{tree}"]);

  write(root, "public/pnp-status.json", status);
  write(root, "public/pnp-theorem-inventory.json", inventory);

  const release = {
    kind: "PNPFormalPublicationRelease0",
    version: 0,
    status: "current-formal-reconstruction-publication-theorem-gate-closed",
    authority: "current",
    source: {
      commit,
      proofCommit: commit,
      tree,
      ref: commit,
      formalPublicationMapCoordinate: "TEST-PUBLICATION-MAP",
      formalPublicationMapSha256: sha256(Buffer.from(publicationMap)),
      leanSourceClosureSha256: "1".repeat(64),
      coordinateAloneIsAuthority: false,
      identityRequiresCommitTreeAndArtifactHashes: true
    },
    artifacts: {
      status: {
        sourcePath: "public/pnp-status.json",
        publicPath: "public/pnp-status.json",
        bytes: Buffer.byteLength(status),
        sha256: sha256(Buffer.from(status))
      },
      theoremInventory: {
        sourcePath: "public/pnp-theorem-inventory.json",
        publicPath: "public/pnp-theorem-inventory.json",
        bytes: Buffer.byteLength(inventory),
        sha256: sha256(Buffer.from(inventory))
      },
      report: {
        pageCount: publishedRelease.artifacts.report.pageCount,
        pdf: { publicPaths: [] },
        tex: { publicPaths: [] }
      }
    },
    publicationBoundary: {
      derivedOnlyFromConcreteGate: true,
      concreteGatePassed: false,
      mathematicalTheoremEstablished: false,
      publicTheoremEmissionAllowed: false,
      publicTheoremStatement: null,
      compatibilityRootPresent: false,
      concreteTargetPresent: true,
      projectSpecificAxiomsRemaining: true,
      remainingBlockerCount: 6
    },
    earnedBoundary: {
      pipelineStateNamespacesFormalized: true,
      pipelineStateNamespaceAxiomAuditPassed: true,
      pipelineStateNamespaceAuditedDeclarationCount: 39,
      pipelineStageBridgesFormalized: true,
      pipelineStageBridgeAxiomAuditPassed: true,
      pipelineStageBridgeAuditedDeclarationCount: 56,
      pipelineStageLaunchFormalized: true,
      pipelineVerdictPreservationFormalized: true,
      pipelineInternalOutputHandoffComposed: true,
      pipelineTargetTerminationFormalized: false,
      pipelineTerminalRawOutputPackingFormalized: true,
      pipelineTerminalOutputPackerAxiomAuditPassed: true,
      pipelineTerminalOutputPackerAuditedDeclarationCount: 69,
      pipelineTerminalOutputPackerTheorem: "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq",
      pipelineTerminalOutputPackerKernelTypeSha256: "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66",
      pipelineTerminalOutputPackerAxiomClosure: [],
      pipelineTerminalOutputPackerCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 6",
      pipelineTerminalOutputPackerConnectedToBridge: true,
      pipelineTerminalBridgeAxiomAuditPassed: true,
      pipelineTerminalBridgeAuditedDeclarationCount: 59,
      pipelineTerminalBridgeAcceptingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents",
      pipelineTerminalBridgeAcceptingOutputKernelTypeSha256: "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001",
      pipelineTerminalBridgeRejectingOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents",
      pipelineTerminalBridgeRejectingOutputKernelTypeSha256: "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db",
      pipelineTerminalBridgeAxiomClosure: [],
      pipelineTerminalBridgeCompiledRawTimeBound: "18 * outputLength^2 + 36 * outputLength + 12",
      pipelineSuppliedTraceWorkCostTheorem: "PNP.Concrete.PipelineTerminalBridge.suppliedTraceTerminalWorkSteps_eq",
      pipelineSuppliedTraceWorkCostKernelTypeSha256: "7d9b5bf70b1675c1843f538e046030753b7e0be7c3bd50ec5d64ce9eb5b0869e",
      pipelineSuppliedAcceptTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedAcceptTraceKernelTypeSha256: "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29",
      pipelineSuppliedRejectTraceTheorem: "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact",
      pipelineSuppliedRejectTraceKernelTypeSha256: "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c",
      pipelineSuppliedAcceptVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptVerdictKernelTypeSha256: "bbc633544f84f156eef71f1aa488a359c35ecb46b1ba1d0dfaa393d1e045fde4",
      pipelineSuppliedRejectVerdictTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectVerdictKernelTypeSha256: "a2cee1b6edc38318bd4b57c82bbc6f708b3c6e676f42128be00f787477a6fbfe",
      pipelineStuckTimeoutTheorem: "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_timeout_of_stuck_rawRunExact",
      pipelineStuckTimeoutKernelTypeSha256: "0ce3f2337117d81a1a25b923c5604dcd9b8235e69598390825caae68c93d9488",
      pipelineSuppliedAcceptMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact",
      pipelineSuppliedAcceptMachineOutputKernelTypeSha256: "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01",
      pipelineSuppliedRejectMachineOutputTheorem: "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact",
      pipelineSuppliedRejectMachineOutputKernelTypeSha256: "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd",
      pipelinePriorTraceTransportToTerminalBridgeFormalized: true,
      pipelineInputFramerAxiomAuditPassed: true,
      pipelineInputFramerAuditedDeclarationCount: 70,
      pipelineAllInputFramingFormalized: true,
      pipelineInputFramerWorkTraceTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      pipelineInputFramerWorkTraceKernelTypeSha256: "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a",
      pipelineInputFramerRepresentedEndpointTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      pipelineInputFramerRepresentedEndpointKernelTypeSha256: "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af",
      pipelineInputFramerHaltedEndpointTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      pipelineInputFramerHaltedEndpointKernelTypeSha256: "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa",
      pipelineInputFramerRawBoundTheorem: "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      pipelineInputFramerRawBoundKernelTypeSha256: "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab",
      pipelineInputFramerOrdinaryStartTheorem: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      pipelineInputFramerOrdinaryStartKernelTypeSha256: "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b",
      pipelineInputFramerBlankEquivalentTheorem: "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      pipelineInputFramerBlankEquivalentKernelTypeSha256: "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a",
      pipelineInputFramerAcceptTheorem: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      pipelineInputFramerAcceptKernelTypeSha256: "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4",
      pipelineInputFramerNoTimeoutTheorem: "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout",
      pipelineInputFramerNoTimeoutKernelTypeSha256: "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe",
      pipelineInputFramerAxiomClosure: [],
      pipelineInputFramerEmptyWorkSteps: "4",
      pipelineInputFramerCompleteCellsWorkSteps: "4 * k * k + 9 * k + 7",
      pipelineInputFramerPartialCellWorkSteps: "4 * k * k + 9 * k + 5",
      pipelineInputFramerRawTimePolynomial: "6 * m * m + 39 * m + 75",
      pipelinePairedCompilerAxiomAuditPassed: true,
      pipelinePairedCompilerAuditedDeclarationCount: 28,
      pipelineCanonicalPairCompilationFormalized: true,
      pipelineMalformedInputBehaviorFormalized: false,
      pipelinePairedVerdictTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq",
      pipelinePairedVerdictKernelTypeSha256: "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731",
      pipelinePairedMachineOutputTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq",
      pipelinePairedMachineOutputKernelTypeSha256: "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267",
      pipelinePairedNoTimeoutTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout",
      pipelinePairedNoTimeoutKernelTypeSha256: "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab",
      pipelinePairedAcceptsTheorem: "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff",
      pipelinePairedAcceptsKernelTypeSha256: "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9",
      pipelinePairedCompilerAxiomClosure: [],
      pipelinePairedOutputSizePolynomial: "B(m) = m + p(m) + 1",
      pipelinePairedRawTimePolynomial: "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))",
      pipelineCompilerAxiomAuditPassed: true,
      pipelineCompilerAuditedDeclarationCount: 29,
      pipelineAllInputCompilationFormalized: true,
      pipelineCompilerCorrectTheorem: "PNP.Concrete.PipelineCompiler.pipeline_correct",
      pipelineCompilerCorrectKernelTypeSha256: "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303",
      pipelineVerdictTheorem: "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      pipelineVerdictKernelTypeSha256: "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e",
      pipelineMachineOutputTheorem: "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      pipelineMachineOutputKernelTypeSha256: "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7",
      pipelineNoTimeoutTheorem: "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      pipelineNoTimeoutKernelTypeSha256: "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a",
      pipelineAcceptsTheorem: "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      pipelineAcceptsKernelTypeSha256: "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6",
      pipelineAllInputStuckTimeoutTheorem: "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact",
      pipelineAllInputStuckTimeoutKernelTypeSha256: "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de",
      pipelineCompilerAxiomClosure: [],
      pipelineOutputSizePolynomial: "B(m) = m + p(m) + 1",
      pipelineRawTimePolynomial: "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))",
      pipelineMalformedInputBehaviorFormalized: true,
      pipelineRawRefinementFormalized: true,
      pipelineExternalInputSizePolynomialFormalized: true,
      pipelineSequentialNamespaceFormalized: true,
      pipelineSequentialNamespaceAxiomAuditPassed: true,
      pipelineSequentialNamespaceAuditedDeclarationCount: 26,
      pipelineSequentialNamespaceAxiomClosure: [],
      pipelineSequentialCompilationFormalized: true,
      pipelineSequentialCompilerAxiomAuditPassed: true,
      pipelineSequentialCompilerAuditedDeclarationCount: 31,
      pipelineSequentialVerdictAndOutputPreservationFormalized: true,
      pipelineSequentialExternalInputSizePolynomialFormalized: true,
      pipelineSequentialStuckFirstTimeoutFormalized: true,
      pipelineSequentialCorrectTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      pipelineSequentialCorrectKernelTypeSha256: "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a",
      pipelineSequentialVerdictTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      pipelineSequentialVerdictKernelTypeSha256: "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386",
      pipelineSequentialMachineOutputTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      pipelineSequentialMachineOutputKernelTypeSha256: "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7",
      pipelineSequentialNoTimeoutTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      pipelineSequentialNoTimeoutKernelTypeSha256: "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af",
      pipelineSequentialAcceptsTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      pipelineSequentialAcceptsKernelTypeSha256: "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e",
      pipelineSequentialStuckFirstTimeoutTheorem: "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact",
      pipelineSequentialStuckFirstTimeoutKernelTypeSha256: "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34",
      pipelineSequentialCompilerAxiomClosure: [],
      pipelineSequentialOutputSizePolynomial: "Bseq(m) = m + p(m) + 1",
      pipelineSequentialRawTimePolynomial: "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)",
      pipelineRefinementAxiomAuditPassed: true,
      pipelineRefinementAuditedDeclarationCount: 16,
      pipelineRefinementAxiomClosure: [],
      functionProgramRecursiveCompilationFormalized: true,
      decisionProgramRecursiveCompilationFormalized: true,
      polynomialTimeDeciderRawCompilationFormalized: true,
      functionProgramCompileHaltsTheorem: "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      functionProgramCompileHaltsKernelTypeSha256: "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d",
      functionProgramCompileOutputTheorem: "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      functionProgramCompileOutputKernelTypeSha256: "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24",
      decisionProgramCompileHaltsTheorem: "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      decisionProgramCompileHaltsKernelTypeSha256: "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5",
      decisionProgramCompileVerdictTheorem: "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      decisionProgramCompileVerdictKernelTypeSha256: "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965",
      polynomialTimeDeciderCompileAcceptsTheorem: "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff",
      polynomialTimeDeciderCompileAcceptsKernelTypeSha256: "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba",
      standardComplexityModelFormalized: true,
      concreteComplexityMachineLinkDischarged: true,
      cookLevinRawTapeBridgeFormalized: true,
      cookLevinRawTapeBridgeAxiomAuditPassed: true,
      cookLevinRawTapeBridgeAuditedDeclarationCount: 54,
      cookLevinSemanticReductionCorrectnessFormalized: true,
      cookLevinSemanticTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language",
      cookLevinSemanticKernelTypeSha256: "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d",
      cookLevinRawTapeBridgeAxiomClosure: ["Classical.choice", "Quot.sound", "propext"],
      cookLevinProjectAxiomClosure: [],
      cookLevinFormulaSizeAxiomAuditPassed: true,
      cookLevinFormulaSizeAuditedDeclarationCount: 108,
      cookLevinEncodedFormulaSizePolynomialFormalized: true,
      cookLevinEncodedFormulaSizeTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le",
      cookLevinEncodedFormulaSizeKernelTypeSha256: "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699",
      cookLevinFormulaSizeAxiomClosure: ["Quot.sound", "propext"],
      cookLevinFormulaSizeProjectAxiomClosure: [],
      cookLevinFormulaScheduleFormalized: true,
      cookLevinFormulaScheduleAxiomAuditPassed: true,
      cookLevinFormulaScheduleAuditedDeclarationCount: 79,
      cookLevinFormulaScheduleAnswerIndependent: true,
      cookLevinFormulaScheduleExactEmissionFormalized: true,
      cookLevinFormulaScheduleExactLengthPolynomialFormalized: true,
      cookLevinFormulaScheduleLengthTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      cookLevinFormulaScheduleLengthKernelTypeSha256: "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4",
      cookLevinFormulaScheduleEmitTheorem: "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula",
      cookLevinFormulaScheduleEmitKernelTypeSha256: "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943",
      cookLevinFormulaScheduleAxiomClosure: ["Quot.sound", "propext"],
      cookLevinFormulaScheduleProjectAxiomClosure: [],
      cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized: false,
      ...structuredClone(Object.fromEntries(Object.entries(publishedRelease.earnedBoundary).filter(
        ([name]) => name.startsWith("cookLevinFormulaCursor")
      ))),
      ...structuredClone(Object.fromEntries(Object.entries(publishedRelease.earnedBoundary).filter(
        ([name]) => name.startsWith("cookLevinBuilder") || name.startsWith("cookLevinCompleteRawFormulaBuilder")
      ))),
      cookLevinRawFormulaBuilderFormalized: false,
      cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized: false,
      cookLevinFormulaConstructionRuntimePolynomialFormalized: false,
      cookLevinPolynomialReductionFormalized: false,
      cnfSATNPCompletenessFormalized: false,
      cnfSATInPFormalized: false,
      pEqualsNPFormalized: false
    },
    historicalArchive: {
      status: "historical-quarantined-not-current-authority",
      currentArtifactEligible: false,
      mayActivateTheoremPublication: false
    }
  };
  write(root, "downloads/formal-publication-release.json", json(release));

  const targets = {
    kind: "PNPLabsCrossRepositoryAuditTargets0",
    version: 2,
    refs: {
      currentCoreRef: {
        repo: "test/pnp",
        ref: commit,
        expectedCommit: commit,
        expectedTree: tree,
        class: "current"
      },
      publicCheckout: { repo: "test/pnplabs", ref: "working tree", class: "public" }
    },
    targets: [
      { id: "core.status", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-status.json" },
      { id: "core.inventory", kind: "current core publication file", refClass: "currentCoreRef", path: "public/pnp-theorem-inventory.json" },
      { id: "core.publication_map", kind: "current core publication file", refClass: "currentCoreRef", path: "publication/FORMAL_PUBLICATION_MAP.json" },
      { id: "public.formal_publication_manifest", kind: "pnplabs current release metadata", refClass: "publicCheckout", path: "downloads/formal-publication-release.json" },
      { id: "public.status", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-status.json", mirrorOf: "core.status" },
      { id: "public.inventory", kind: "pnplabs current core mirror", refClass: "publicCheckout", path: "public/pnp-theorem-inventory.json", mirrorOf: "core.inventory" }
    ]
  };
  write(root, "docs/audit_targets.json", json(targets));

  return { root, sourceDir, commit, tree, release, targets };
}

function rewriteCorePayload(project, relativePath, payload) {
  const content = json(payload);
  write(project.sourceDir, relativePath, content);

  if (relativePath === "public/pnp-status.json") {
    write(project.root, relativePath, content);
    project.release.artifacts.status.bytes = Buffer.byteLength(content);
    project.release.artifacts.status.sha256 = sha256(Buffer.from(content));
  } else if (relativePath === "public/pnp-theorem-inventory.json") {
    write(project.root, relativePath, content);
    project.release.artifacts.theoremInventory.bytes = Buffer.byteLength(content);
    project.release.artifacts.theoremInventory.sha256 = sha256(Buffer.from(content));
  } else if (relativePath === "publication/FORMAL_PUBLICATION_MAP.json") {
    project.release.source.formalPublicationMapSha256 = sha256(Buffer.from(content));
  } else {
    throw new Error(`unsupported core fixture payload: ${relativePath}`);
  }

  git(project.sourceDir, ["add", relativePath]);
  git(project.sourceDir, ["commit", "--amend", "--no-edit"]);
  project.commit = git(project.sourceDir, ["rev-parse", "HEAD"]);
  project.tree = git(project.sourceDir, ["rev-parse", "HEAD^{tree}"]);
  Object.assign(project.release.source, {
    commit: project.commit,
    proofCommit: project.commit,
    tree: project.tree,
    ref: project.commit
  });
  Object.assign(project.targets.refs.currentCoreRef, {
    ref: project.commit,
    expectedCommit: project.commit,
    expectedTree: project.tree
  });
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  write(project.root, "docs/audit_targets.json", json(project.targets));
}

function validate(project, overrides = {}) {
  return validateAuditTargets({
    root: project.root,
    sourceDir: project.sourceDir,
    expectedCoreIdentity: { commit: project.commit, proofCommit: project.commit, tree: project.tree },
    ...overrides
  });
}

function expectFailure(project, pattern, overrides = {}) {
  assert.throws(
    () => validate(project, overrides),
    (error) => {
      assert.ok(error instanceof AuditTargetValidationError);
      assert.match(error.failures.join("\n"), pattern);
      return true;
    }
  );
}

test("accepts exact current mirrors pinned to one core commit and tree", (t) => {
  const project = makeProject(t);
  let result;
  try {
    result = validate(project, { requireSource: true });
  } catch (error) {
    assert.fail(error.failures?.join("\n") || String(error));
  }
  assert.equal(result.skipped, false);
  assert.equal(result.mirroredTargets, 2);
  assert.equal(result.refs.currentCoreRef.commit, project.commit);
  assert.equal(result.refs.currentCoreRef.tree, project.tree);
});

test("rejects byte drift in a current public mirror", (t) => {
  const project = makeProject(t);
  write(project.root, "public/pnp-status.json", "{}\n");
  expectFailure(project, /release artifact identity mismatch: public\/pnp-status\.json/);
});

test("rejects a current core target assigned to the public checkout", (t) => {
  const project = makeProject(t);
  project.targets.targets[0].refClass = "publicCheckout";
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /core\.status: current core publication file must use currentCoreRef/);
});

test("rejects historical refs that are not explicitly quarantined", (t) => {
  const project = makeProject(t);
  project.targets.refs.historicalSourceRef = {
    repo: "test/pnp",
    ref: project.commit,
    expectedCommit: project.commit,
    class: "historical",
    status: "current"
  };
  write(project.root, "docs/audit_targets.json", json(project.targets));
  expectFailure(project, /historicalSourceRef: historical ref is not explicitly quarantined/);
});

test("rejects a self-consistent manifest that opens theorem publication", (t) => {
  const project = makeProject(t);
  project.release.publicationBoundary.publicTheoremEmissionAllowed = true;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication manifest does not fail closed/);
});

test("rejects pipeline bridge publication without the compiled axiom audits", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication pipeline stage-bridge boundary mismatch/);
});

test("rejects a terminal bridge narrowed back to an unconnected packer", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-output packer evidence mismatch/);
});

test("rejects removal of the supplied prior-trace transport", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication terminal-bridge supplied-trace boundary mismatch/);
});

test("rejects publication of the all-input framer without its compiled axiom audit", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineInputFramerAxiomAuditPassed = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input framer audit boundary mismatch/);
});

test("rejects drift in the all-input framer polynomial or theorem fingerprint", (t) => {
  const polynomial = makeProject(t);
  polynomial.release.earnedBoundary.pipelineInputFramerRawTimePolynomial = "0";
  write(polynomial.root, "downloads/formal-publication-release.json", json(polynomial.release));
  expectFailure(polynomial, /formal-publication all-input framer polynomial evidence mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.pipelineInputFramerNoTimeoutKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication all-input framer verdict evidence mismatch/);
});

test("rejects removal of all-input malformed-input behavior", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineMalformedInputBehaviorFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects removal of the all-input external polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized = false;
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects drift in the all-input runtime polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelineRawTimePolynomial = "R(m) = 0";
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication all-input compiler polynomial evidence mismatch/);
});

test("rejects all-input compiler audit, theorem fingerprint, or RawRefinement removal drift", (t) => {
  const audit = makeProject(t);
  audit.release.earnedBoundary.pipelineCompilerAxiomAuditPassed = false;
  write(audit.root, "downloads/formal-publication-release.json", json(audit.release));
  expectFailure(audit, /formal-publication all-input compiler audit boundary mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.pipelineVerdictKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /all-input compiler verdict evidence mismatch/);

  const removed = makeProject(t);
  removed.release.earnedBoundary.pipelineRawRefinementFormalized = false;
  write(removed.root, "downloads/formal-publication-release.json", json(removed.release));
  expectFailure(removed, /formal-publication all-input compiler boundary mismatch/);
});

test("rejects sequential compiler or recursive refinement evidence drift", (t) => {
  const sequential = makeProject(t);
  sequential.release.earnedBoundary.pipelineSequentialRawTimePolynomial = "Rseq(m) = 0";
  write(sequential.root, "downloads/formal-publication-release.json", json(sequential.release));
  expectFailure(sequential, /formal-publication sequential polynomial evidence mismatch/);

  const refinement = makeProject(t);
  refinement.release.earnedBoundary.pipelineRefinementAxiomAuditPassed = false;
  write(refinement.root, "downloads/formal-publication-release.json", json(refinement.release));
  expectFailure(refinement, /formal-publication recursive refinement boundary mismatch/);

  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.polynomialTimeDeciderCompileAcceptsKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication polynomial-time decider compilation evidence mismatch/);
});

test("rejects Cook-Levin formula-size/schedule identity, axiom, or construction overclaim drift", (t) => {
  const fingerprint = makeProject(t);
  fingerprint.release.earnedBoundary.cookLevinEncodedFormulaSizeKernelTypeSha256 = "0".repeat(64);
  write(fingerprint.root, "downloads/formal-publication-release.json", json(fingerprint.release));
  expectFailure(fingerprint, /formal-publication Cook-Levin formula-size identity mismatch/);

  const axiom = makeProject(t);
  axiom.release.earnedBoundary.cookLevinFormulaSizeProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(axiom.root, "downloads/formal-publication-release.json", json(axiom.release));
  expectFailure(axiom, /formal-publication Cook-Levin formula-size axiom closure mismatch/);

  const scheduleFingerprint = makeProject(t);
  scheduleFingerprint.release.earnedBoundary.cookLevinFormulaScheduleLengthKernelTypeSha256 = "0".repeat(64);
  write(scheduleFingerprint.root, "downloads/formal-publication-release.json", json(scheduleFingerprint.release));
  expectFailure(scheduleFingerprint, /formal-publication Cook-Levin formula-schedule length identity mismatch/);

  const scheduleAxiom = makeProject(t);
  scheduleAxiom.release.earnedBoundary.cookLevinFormulaScheduleProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(scheduleAxiom.root, "downloads/formal-publication-release.json", json(scheduleAxiom.release));
  expectFailure(scheduleAxiom, /formal-publication Cook-Levin formula-schedule axiom closure mismatch/);

  const cursorFingerprint = makeProject(t);
  cursorFingerprint.release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256[
    FORMULA_CURSOR_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(cursorFingerprint.root, "downloads/formal-publication-release.json", json(cursorFingerprint.release));
  expectFailure(cursorFingerprint, /formal-publication Cook-Levin formula-cursor fingerprint mismatch/);

  const cursorAxiom = makeProject(t);
  cursorAxiom.release.earnedBoundary.cookLevinFormulaCursorProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(cursorAxiom.root, "downloads/formal-publication-release.json", json(cursorAxiom.release));
  expectFailure(cursorAxiom, /formal-publication Cook-Levin formula-cursor axiom closure mismatch/);

  const cursorRawInterpreter = makeProject(t);
  cursorRawInterpreter.release.earnedBoundary.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized = true;
  write(cursorRawInterpreter.root, "downloads/formal-publication-release.json", json(cursorRawInterpreter.release));
  expectFailure(cursorRawInterpreter, /formal-publication overstates the Cook-Levin formula cursor/);

  const builderFingerprint = makeProject(t);
  builderFingerprint.release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256[
    BUILDER_INPUT_LENGTH_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(builderFingerprint.root, "downloads/formal-publication-release.json", json(builderFingerprint.release));
  expectFailure(builderFingerprint, /formal-publication Cook-Levin builder input-length fingerprint mismatch/);

  const builderAxiom = makeProject(t);
  builderAxiom.release.earnedBoundary.cookLevinBuilderInputLengthProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(builderAxiom.root, "downloads/formal-publication-release.json", json(builderAxiom.release));
  expectFailure(builderAxiom, /formal-publication Cook-Levin builder input-length axiom closure mismatch/);

  const builderPrefixFingerprint = makeProject(t);
  builderPrefixFingerprint.release.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256[
    BUILDER_INPUT_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(builderPrefixFingerprint.root, "downloads/formal-publication-release.json", json(builderPrefixFingerprint.release));
  expectFailure(builderPrefixFingerprint, /formal-publication Cook-Levin builder input-prefix fingerprint mismatch/);

  const builderPrefixAxiom = makeProject(t);
  builderPrefixAxiom.release.earnedBoundary.cookLevinBuilderInputPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(builderPrefixAxiom.root, "downloads/formal-publication-release.json", json(builderPrefixAxiom.release));
  expectFailure(builderPrefixAxiom, /formal-publication Cook-Levin builder input-prefix axiom closure mismatch/);

  const builderPrefixOverclaim = makeProject(t);
  builderPrefixOverclaim.release.earnedBoundary.cookLevinBuilderInputPrefixFormulaBitsEmittedFormalized = true;
  write(builderPrefixOverclaim.root, "downloads/formal-publication-release.json", json(builderPrefixOverclaim.release));
  expectFailure(builderPrefixOverclaim, /formal-publication overstates the Cook-Levin builder input prefix/);

  const builderTokenFingerprint = makeProject(t);
  builderTokenFingerprint.release.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256[
    BUILDER_TOKEN_APPENDER_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(builderTokenFingerprint.root, "downloads/formal-publication-release.json", json(builderTokenFingerprint.release));
  expectFailure(builderTokenFingerprint, /formal-publication Cook-Levin builder token-appender fingerprint mismatch/);

  const builderTokenAxiom = makeProject(t);
  builderTokenAxiom.release.earnedBoundary.cookLevinBuilderTokenAppenderProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(builderTokenAxiom.root, "downloads/formal-publication-release.json", json(builderTokenAxiom.release));
  expectFailure(builderTokenAxiom, /formal-publication Cook-Levin builder token-appender axiom closure mismatch/);

  const builderTokenOverclaim = makeProject(t);
  builderTokenOverclaim.release.earnedBoundary.cookLevinBuilderTokenAppenderCompleteHeaderFormalized = true;
  write(builderTokenOverclaim.root, "downloads/formal-publication-release.json", json(builderTokenOverclaim.release));
  expectFailure(builderTokenOverclaim, /formal-publication overstates the Cook-Levin builder token appender/);

  const firstTokenFingerprint = makeProject(t);
  firstTokenFingerprint.release.earnedBoundary.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256[
    BUILDER_FIRST_TOKEN_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(firstTokenFingerprint.root, "downloads/formal-publication-release.json", json(firstTokenFingerprint.release));
  expectFailure(firstTokenFingerprint, /formal-publication Cook-Levin builder first-token-prefix fingerprint mismatch/);

  const firstTokenAxiom = makeProject(t);
  firstTokenAxiom.release.earnedBoundary.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(firstTokenAxiom.root, "downloads/formal-publication-release.json", json(firstTokenAxiom.release));
  expectFailure(firstTokenAxiom, /formal-publication Cook-Levin builder first-token-prefix axiom closure mismatch/);

  const unaryFingerprint = makeProject(t);
  unaryFingerprint.release.earnedBoundary.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256[
    BUILDER_UNARY_POLYNOMIAL_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(unaryFingerprint.root, "downloads/formal-publication-release.json", json(unaryFingerprint.release));
  expectFailure(unaryFingerprint, /formal-publication Cook-Levin builder unary-polynomial fingerprint mismatch/);

  const unaryAxiom = makeProject(t);
  unaryAxiom.release.earnedBoundary.cookLevinBuilderUnaryPolynomialProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(unaryAxiom.root, "downloads/formal-publication-release.json", json(unaryAxiom.release));
  expectFailure(unaryAxiom, /formal-publication Cook-Levin builder unary-polynomial axiom closure mismatch/);

  const completeHeaderFingerprint = makeProject(t);
  completeHeaderFingerprint.release.earnedBoundary.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256[
    BUILDER_COMPLETE_HEADER_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(completeHeaderFingerprint.root, "downloads/formal-publication-release.json", json(completeHeaderFingerprint.release));
  expectFailure(completeHeaderFingerprint, /formal-publication Cook-Levin builder complete-header fingerprint mismatch/);

  const completeHeaderAxiom = makeProject(t);
  completeHeaderAxiom.release.earnedBoundary.cookLevinBuilderCompleteHeaderProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(completeHeaderAxiom.root, "downloads/formal-publication-release.json", json(completeHeaderAxiom.release));
  expectFailure(completeHeaderAxiom, /formal-publication Cook-Levin builder complete-header axiom closure mismatch/);

  const completeHeaderRemoved = makeProject(t);
  completeHeaderRemoved.release.earnedBoundary.cookLevinBuilderCompleteHeaderFormalized = false;
  write(completeHeaderRemoved.root, "downloads/formal-publication-release.json", json(completeHeaderRemoved.release));
  expectFailure(completeHeaderRemoved, /formal-publication Cook-Levin builder complete-header boundary mismatch/);

  const completeHeaderOverclaim = makeProject(t);
  completeHeaderOverclaim.release.earnedBoundary.cookLevinBuilderDynamicCursorInterpretationFormalized = true;
  write(completeHeaderOverclaim.root, "downloads/formal-publication-release.json", json(completeHeaderOverclaim.release));
  expectFailure(completeHeaderOverclaim, /formal-publication overstates the Cook-Levin builder dynamic-token-cursor step/);

  const bodyStartFingerprint = makeProject(t);
  bodyStartFingerprint.release.earnedBoundary.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256[
    BUILDER_BODY_START_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(bodyStartFingerprint.root, "downloads/formal-publication-release.json", json(bodyStartFingerprint.release));
  expectFailure(bodyStartFingerprint, /formal-publication Cook-Levin builder body-start-prefix fingerprint mismatch/);

  const bodyStartAxiom = makeProject(t);
  bodyStartAxiom.release.earnedBoundary.cookLevinBuilderBodyStartPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(bodyStartAxiom.root, "downloads/formal-publication-release.json", json(bodyStartAxiom.release));
  expectFailure(bodyStartAxiom, /formal-publication Cook-Levin builder body-start-prefix axiom closure mismatch/);

  const bodyStartRemoved = makeProject(t);
  bodyStartRemoved.release.earnedBoundary.cookLevinBuilderBodyStartPrefixFormalized = false;
  write(bodyStartRemoved.root, "downloads/formal-publication-release.json", json(bodyStartRemoved.release));
  expectFailure(bodyStartRemoved, /formal-publication Cook-Levin builder body-start-prefix boundary mismatch/);

  const firstLiteralFingerprint = makeProject(t);
  firstLiteralFingerprint.release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256[
    BUILDER_FIRST_LITERAL_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(firstLiteralFingerprint.root, "downloads/formal-publication-release.json", json(firstLiteralFingerprint.release));
  expectFailure(firstLiteralFingerprint, /formal-publication Cook-Levin builder first-literal-prefix fingerprint mismatch/);

  const firstLiteralAxiom = makeProject(t);
  firstLiteralAxiom.release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(firstLiteralAxiom.root, "downloads/formal-publication-release.json", json(firstLiteralAxiom.release));
  expectFailure(firstLiteralAxiom, /formal-publication Cook-Levin builder first-literal-prefix axiom closure mismatch/);

  const firstLiteralRemoved = makeProject(t);
  firstLiteralRemoved.release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormalized = false;
  write(firstLiteralRemoved.root, "downloads/formal-publication-release.json", json(firstLiteralRemoved.release));
  expectFailure(firstLiteralRemoved, /formal-publication Cook-Levin builder first-literal-prefix boundary mismatch/);

  const firstLiteralCost = makeProject(t);
  firstLiteralCost.release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixRuleCount = "0";
  write(firstLiteralCost.root, "downloads/formal-publication-release.json", json(firstLiteralCost.release));
  expectFailure(firstLiteralCost, /formal-publication Cook-Levin builder first-literal-prefix cost mismatch/);

  const firstLiteralIdentity = makeProject(t);
  firstLiteralIdentity.release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem =
    "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.forged";
  write(firstLiteralIdentity.root, "downloads/formal-publication-release.json", json(firstLiteralIdentity.release));
  expectFailure(firstLiteralIdentity, /formal-publication Cook-Levin builder first-literal-prefix theorem identity mismatch/);

  const firstClauseFingerprint = makeProject(t);
  firstClauseFingerprint.release.earnedBoundary.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256[
    BUILDER_FIRST_CLAUSE_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(firstClauseFingerprint.root, "downloads/formal-publication-release.json", json(firstClauseFingerprint.release));
  expectFailure(firstClauseFingerprint, /formal-publication Cook-Levin builder first-clause-prefix fingerprint mismatch/);

  const firstClauseAxiom = makeProject(t);
  firstClauseAxiom.release.earnedBoundary.cookLevinBuilderFirstClausePrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(firstClauseAxiom.root, "downloads/formal-publication-release.json", json(firstClauseAxiom.release));
  expectFailure(firstClauseAxiom, /formal-publication Cook-Levin builder first-clause-prefix axiom closure mismatch/);

  const firstClauseRemoved = makeProject(t);
  firstClauseRemoved.release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormalized = false;
  write(firstClauseRemoved.root, "downloads/formal-publication-release.json", json(firstClauseRemoved.release));
  expectFailure(firstClauseRemoved, /formal-publication Cook-Levin builder first-clause-prefix boundary mismatch/);

  const firstClauseCost = makeProject(t);
  firstClauseCost.release.earnedBoundary.cookLevinBuilderFirstClausePrefixRuleCount = "0";
  write(firstClauseCost.root, "downloads/formal-publication-release.json", json(firstClauseCost.release));
  expectFailure(firstClauseCost, /formal-publication Cook-Levin builder first-clause-prefix cost mismatch/);

  const firstClauseIdentity = makeProject(t);
  firstClauseIdentity.release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormulaBitsTheorem =
    "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.forged";
  write(firstClauseIdentity.root, "downloads/formal-publication-release.json", json(firstClauseIdentity.release));
  expectFailure(firstClauseIdentity, /formal-publication Cook-Levin builder first-clause-prefix theorem identity mismatch/);

  const firstClauseOverclaim = makeProject(t);
  firstClauseOverclaim.release.earnedBoundary.cookLevinBuilderDynamicCursorInterpretationFormalized = true;
  write(firstClauseOverclaim.root, "downloads/formal-publication-release.json", json(firstClauseOverclaim.release));
  expectFailure(firstClauseOverclaim, /formal-publication overstates the Cook-Levin builder dynamic-token-cursor step/);

  const dynamicCursorFingerprint = makeProject(t);
  dynamicCursorFingerprint.release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256[
    BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(dynamicCursorFingerprint.root, "downloads/formal-publication-release.json", json(dynamicCursorFingerprint.release));
  expectFailure(dynamicCursorFingerprint, /formal-publication Cook-Levin builder dynamic-token-cursor-step fingerprint mismatch/);

  const dynamicCursorAxiom = makeProject(t);
  dynamicCursorAxiom.release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(dynamicCursorAxiom.root, "downloads/formal-publication-release.json", json(dynamicCursorAxiom.release));
  expectFailure(dynamicCursorAxiom, /formal-publication Cook-Levin builder dynamic-token-cursor-step axiom closure mismatch/);

  const dynamicCursorRemoved = makeProject(t);
  dynamicCursorRemoved.release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFormalized = false;
  write(dynamicCursorRemoved.root, "downloads/formal-publication-release.json", json(dynamicCursorRemoved.release));
  expectFailure(dynamicCursorRemoved, /formal-publication Cook-Levin builder dynamic-token-cursor-step boundary mismatch/);

  const dynamicCursorCost = makeProject(t);
  dynamicCursorCost.release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRuleCount = "0";
  write(dynamicCursorCost.root, "downloads/formal-publication-release.json", json(dynamicCursorCost.release));
  expectFailure(dynamicCursorCost, /formal-publication Cook-Levin builder dynamic-token-cursor-step cost mismatch/);

  const dynamicCursorIdentity = makeProject(t);
  dynamicCursorIdentity.release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem =
    "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.forged";
  write(dynamicCursorIdentity.root, "downloads/formal-publication-release.json", json(dynamicCursorIdentity.release));
  expectFailure(dynamicCursorIdentity, /formal-publication Cook-Levin builder dynamic-token-cursor-step theorem identity mismatch/);

  const dynamicCursorOverclaim = makeProject(t);
  dynamicCursorOverclaim.release.earnedBoundary.cookLevinBuilderDynamicCursorInterpretationFormalized = true;
  write(dynamicCursorOverclaim.root, "downloads/formal-publication-release.json", json(dynamicCursorOverclaim.release));
  expectFailure(dynamicCursorOverclaim, /formal-publication overstates the Cook-Levin builder dynamic-token-cursor step/);

  const paddingRunFingerprint = makeProject(t);
  paddingRunFingerprint.release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256[
    BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(paddingRunFingerprint.root, "downloads/formal-publication-release.json", json(paddingRunFingerprint.release));
  expectFailure(paddingRunFingerprint, /formal-publication Cook-Levin builder first-clause-padding-run fingerprint mismatch/);

  const paddingRunAxiom = makeProject(t);
  paddingRunAxiom.release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(paddingRunAxiom.root, "downloads/formal-publication-release.json", json(paddingRunAxiom.release));
  expectFailure(paddingRunAxiom, /formal-publication Cook-Levin builder first-clause-padding-run axiom closure mismatch/);

  const paddingRunRemoved = makeProject(t);
  paddingRunRemoved.release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunFormalized = false;
  write(paddingRunRemoved.root, "downloads/formal-publication-release.json", json(paddingRunRemoved.release));
  expectFailure(paddingRunRemoved, /formal-publication Cook-Levin builder first-clause-padding-run boundary mismatch/);

  const paddingRunCost = makeProject(t);
  paddingRunCost.release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRuleCount = "0";
  write(paddingRunCost.root, "downloads/formal-publication-release.json", json(paddingRunCost.release));
  expectFailure(paddingRunCost, /formal-publication Cook-Levin builder first-clause-padding-run cost mismatch/);

  const paddingRunIdentity = makeProject(t);
  paddingRunIdentity.release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem =
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.forged";
  write(paddingRunIdentity.root, "downloads/formal-publication-release.json", json(paddingRunIdentity.release));
  expectFailure(paddingRunIdentity, /formal-publication Cook-Levin builder first-clause-padding-run theorem identity mismatch/);

  const separatorStepFingerprint = makeProject(t);
  separatorStepFingerprint.release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256[
    BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(separatorStepFingerprint.root, "downloads/formal-publication-release.json", json(separatorStepFingerprint.release));
  expectFailure(separatorStepFingerprint, /formal-publication Cook-Levin builder second-clause-separator-step fingerprint mismatch/);

  const separatorStepAxiom = makeProject(t);
  separatorStepAxiom.release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(separatorStepAxiom.root, "downloads/formal-publication-release.json", json(separatorStepAxiom.release));
  expectFailure(separatorStepAxiom, /formal-publication Cook-Levin builder second-clause-separator-step axiom closure mismatch/);

  const separatorStepRemoved = makeProject(t);
  separatorStepRemoved.release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepFormalized = false;
  write(separatorStepRemoved.root, "downloads/formal-publication-release.json", json(separatorStepRemoved.release));
  expectFailure(separatorStepRemoved, /formal-publication Cook-Levin builder second-clause-separator-step boundary mismatch/);

  const separatorStepCost = makeProject(t);
  separatorStepCost.release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepRuleCount = "0";
  write(separatorStepCost.root, "downloads/formal-publication-release.json", json(separatorStepCost.release));
  expectFailure(separatorStepCost, /formal-publication Cook-Levin builder second-clause-separator-step cost mismatch/);

  const separatorStepIdentity = makeProject(t);
  separatorStepIdentity.release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.forged";
  write(separatorStepIdentity.root, "downloads/formal-publication-release.json", json(separatorStepIdentity.release));
  expectFailure(separatorStepIdentity, /formal-publication Cook-Levin builder second-clause-separator-step theorem identity mismatch/);

  const secondClauseFirstLiteralFingerprint = makeProject(t);
  secondClauseFirstLiteralFingerprint.release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256[
    BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(secondClauseFirstLiteralFingerprint.root, "downloads/formal-publication-release.json", json(secondClauseFirstLiteralFingerprint.release));
  expectFailure(secondClauseFirstLiteralFingerprint, /formal-publication Cook-Levin builder second-clause-first-literal-prefix fingerprint mismatch/);

  const secondClauseFirstLiteralAxiom = makeProject(t);
  secondClauseFirstLiteralAxiom.release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(secondClauseFirstLiteralAxiom.root, "downloads/formal-publication-release.json", json(secondClauseFirstLiteralAxiom.release));
  expectFailure(secondClauseFirstLiteralAxiom, /formal-publication Cook-Levin builder second-clause-first-literal-prefix axiom closure mismatch/);

  const secondClauseFirstLiteralRemoved = makeProject(t);
  secondClauseFirstLiteralRemoved.release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFormalized = false;
  write(secondClauseFirstLiteralRemoved.root, "downloads/formal-publication-release.json", json(secondClauseFirstLiteralRemoved.release));
  expectFailure(secondClauseFirstLiteralRemoved, /formal-publication Cook-Levin builder second-clause-first-literal-prefix boundary mismatch/);

  const secondClauseFirstLiteralCost = makeProject(t);
  secondClauseFirstLiteralCost.release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixRuleCount = "0";
  write(secondClauseFirstLiteralCost.root, "downloads/formal-publication-release.json", json(secondClauseFirstLiteralCost.release));
  expectFailure(secondClauseFirstLiteralCost, /formal-publication Cook-Levin builder second-clause-first-literal-prefix cost mismatch/);

  const secondClauseFirstLiteralIdentity = makeProject(t);
  secondClauseFirstLiteralIdentity.release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.forged";
  write(secondClauseFirstLiteralIdentity.root, "downloads/formal-publication-release.json", json(secondClauseFirstLiteralIdentity.release));
  expectFailure(secondClauseFirstLiteralIdentity, /formal-publication Cook-Levin builder second-clause-first-literal-prefix theorem identity mismatch/);

  const secondClauseSecondLiteralFingerprint = makeProject(t);
  secondClauseSecondLiteralFingerprint.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256[
    BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(secondClauseSecondLiteralFingerprint.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralFingerprint.release));
  expectFailure(secondClauseSecondLiteralFingerprint, /formal-publication Cook-Levin builder second-clause-second-literal-prefix fingerprint mismatch/);

  const secondClauseSecondLiteralAxiom = makeProject(t);
  secondClauseSecondLiteralAxiom.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(secondClauseSecondLiteralAxiom.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralAxiom.release));
  expectFailure(secondClauseSecondLiteralAxiom, /formal-publication Cook-Levin builder second-clause-second-literal-prefix axiom closure mismatch/);

  const secondClauseSecondLiteralRemoved = makeProject(t);
  secondClauseSecondLiteralRemoved.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFormalized = false;
  write(secondClauseSecondLiteralRemoved.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralRemoved.release));
  expectFailure(secondClauseSecondLiteralRemoved, /formal-publication Cook-Levin builder second-clause-second-literal-prefix boundary mismatch/);

  const secondClauseSecondLiteralAudit = makeProject(t);
  secondClauseSecondLiteralAudit.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount = 114;
  write(secondClauseSecondLiteralAudit.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralAudit.release));
  expectFailure(secondClauseSecondLiteralAudit, /formal-publication Cook-Levin builder second-clause-second-literal-prefix boundary mismatch/);

  const secondClauseSecondLiteralCost = makeProject(t);
  secondClauseSecondLiteralCost.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRuleCount = "0";
  write(secondClauseSecondLiteralCost.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralCost.release));
  expectFailure(secondClauseSecondLiteralCost, /formal-publication Cook-Levin builder second-clause-second-literal-prefix cost mismatch/);

  const secondClauseSecondLiteralIdentity = makeProject(t);
  secondClauseSecondLiteralIdentity.release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.forged";
  write(secondClauseSecondLiteralIdentity.root, "downloads/formal-publication-release.json", json(secondClauseSecondLiteralIdentity.release));
  expectFailure(secondClauseSecondLiteralIdentity, /formal-publication Cook-Levin builder second-clause-second-literal-prefix theorem identity mismatch/);

  const secondClauseFingerprint = makeProject(t);
  secondClauseFingerprint.release.earnedBoundary.cookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256[
    BUILDER_SECOND_CLAUSE_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(secondClauseFingerprint.root, "downloads/formal-publication-release.json", json(secondClauseFingerprint.release));
  expectFailure(secondClauseFingerprint, /formal-publication Cook-Levin builder second-clause-prefix fingerprint mismatch/);

  const secondClauseAxiom = makeProject(t);
  secondClauseAxiom.release.earnedBoundary.cookLevinBuilderSecondClausePrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(secondClauseAxiom.root, "downloads/formal-publication-release.json", json(secondClauseAxiom.release));
  expectFailure(secondClauseAxiom, /formal-publication Cook-Levin builder second-clause-prefix axiom closure mismatch/);

  const secondClauseRemoved = makeProject(t);
  secondClauseRemoved.release.earnedBoundary.cookLevinBuilderSecondClausePrefixFormalized = false;
  write(secondClauseRemoved.root, "downloads/formal-publication-release.json", json(secondClauseRemoved.release));
  expectFailure(secondClauseRemoved, /formal-publication Cook-Levin builder second-clause-prefix boundary mismatch/);

  const secondClauseAudit = makeProject(t);
  secondClauseAudit.release.earnedBoundary.cookLevinBuilderSecondClausePrefixAuditedDeclarationCount = 56;
  write(secondClauseAudit.root, "downloads/formal-publication-release.json", json(secondClauseAudit.release));
  expectFailure(secondClauseAudit, /formal-publication Cook-Levin builder second-clause-prefix boundary mismatch/);

  const secondClauseCost = makeProject(t);
  secondClauseCost.release.earnedBoundary.cookLevinBuilderSecondClausePrefixRuleCount = "0";
  write(secondClauseCost.root, "downloads/formal-publication-release.json", json(secondClauseCost.release));
  expectFailure(secondClauseCost, /formal-publication Cook-Levin builder second-clause-prefix cost mismatch/);

  const secondClauseIdentity = makeProject(t);
  secondClauseIdentity.release.earnedBoundary.cookLevinBuilderSecondClausePrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.forged";
  write(secondClauseIdentity.root, "downloads/formal-publication-release.json", json(secondClauseIdentity.release));
  expectFailure(secondClauseIdentity, /formal-publication Cook-Levin builder second-clause-prefix theorem identity mismatch/);

  const secondClausePaddingFingerprint = makeProject(t);
  secondClausePaddingFingerprint.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256[
    BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(secondClausePaddingFingerprint.root, "downloads/formal-publication-release.json", json(secondClausePaddingFingerprint.release));
  expectFailure(secondClausePaddingFingerprint, /formal-publication Cook-Levin builder second-clause-padding-run fingerprint mismatch/);

  const secondClausePaddingAxiom = makeProject(t);
  secondClausePaddingAxiom.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(secondClausePaddingAxiom.root, "downloads/formal-publication-release.json", json(secondClausePaddingAxiom.release));
  expectFailure(secondClausePaddingAxiom, /formal-publication Cook-Levin builder second-clause-padding-run axiom closure mismatch/);

  const secondClausePaddingRemoved = makeProject(t);
  secondClausePaddingRemoved.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFormalized = false;
  write(secondClausePaddingRemoved.root, "downloads/formal-publication-release.json", json(secondClausePaddingRemoved.release));
  expectFailure(secondClausePaddingRemoved, /formal-publication Cook-Levin builder second-clause-padding-run boundary mismatch/);

  const secondClausePaddingAudit = makeProject(t);
  secondClausePaddingAudit.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount = 67;
  write(secondClausePaddingAudit.root, "downloads/formal-publication-release.json", json(secondClausePaddingAudit.release));
  expectFailure(secondClausePaddingAudit, /formal-publication Cook-Levin builder second-clause-padding-run boundary mismatch/);

  const secondClausePaddingCost = makeProject(t);
  secondClausePaddingCost.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRuleCount = "0";
  write(secondClausePaddingCost.root, "downloads/formal-publication-release.json", json(secondClausePaddingCost.release));
  expectFailure(secondClausePaddingCost, /formal-publication Cook-Levin builder second-clause-padding-run cost mismatch/);

  const secondClausePaddingIdentity = makeProject(t);
  secondClausePaddingIdentity.release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.forged";
  write(secondClausePaddingIdentity.root, "downloads/formal-publication-release.json", json(secondClausePaddingIdentity.release));
  expectFailure(secondClausePaddingIdentity, /formal-publication Cook-Levin builder second-clause-padding-run theorem identity mismatch/);

  const thirdClauseSeparatorFingerprint = makeProject(t);
  thirdClauseSeparatorFingerprint.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256[
    BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(thirdClauseSeparatorFingerprint.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorFingerprint.release));
  expectFailure(thirdClauseSeparatorFingerprint, /formal-publication Cook-Levin builder third-clause-separator-step fingerprint mismatch/);

  const thirdClauseSeparatorAxiom = makeProject(t);
  thirdClauseSeparatorAxiom.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(thirdClauseSeparatorAxiom.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorAxiom.release));
  expectFailure(thirdClauseSeparatorAxiom, /formal-publication Cook-Levin builder third-clause-separator-step axiom closure mismatch/);

  const thirdClauseSeparatorRemoved = makeProject(t);
  thirdClauseSeparatorRemoved.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFormalized = false;
  write(thirdClauseSeparatorRemoved.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorRemoved.release));
  expectFailure(thirdClauseSeparatorRemoved, /formal-publication Cook-Levin builder third-clause-separator-step boundary mismatch/);

  const thirdClauseSeparatorAudit = makeProject(t);
  thirdClauseSeparatorAudit.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount = 55;
  write(thirdClauseSeparatorAudit.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorAudit.release));
  expectFailure(thirdClauseSeparatorAudit, /formal-publication Cook-Levin builder third-clause-separator-step boundary mismatch/);

  const thirdClauseSeparatorCost = makeProject(t);
  thirdClauseSeparatorCost.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRuleCount = "0";
  write(thirdClauseSeparatorCost.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorCost.release));
  expectFailure(thirdClauseSeparatorCost, /formal-publication Cook-Levin builder third-clause-separator-step cost mismatch/);

  const thirdClauseSeparatorIdentity = makeProject(t);
  thirdClauseSeparatorIdentity.release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.forged";
  write(thirdClauseSeparatorIdentity.root, "downloads/formal-publication-release.json", json(thirdClauseSeparatorIdentity.release));
  expectFailure(thirdClauseSeparatorIdentity, /formal-publication Cook-Levin builder third-clause-separator-step theorem identity mismatch/);

  const thirdClauseFirstLiteralFingerprint = makeProject(t);
  thirdClauseFirstLiteralFingerprint.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256[
    BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(thirdClauseFirstLiteralFingerprint.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralFingerprint.release));
  expectFailure(thirdClauseFirstLiteralFingerprint, /formal-publication Cook-Levin builder third-clause-first-literal-prefix fingerprint mismatch/);

  const thirdClauseFirstLiteralAxiom = makeProject(t);
  thirdClauseFirstLiteralAxiom.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(thirdClauseFirstLiteralAxiom.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralAxiom.release));
  expectFailure(thirdClauseFirstLiteralAxiom, /formal-publication Cook-Levin builder third-clause-first-literal-prefix axiom closure mismatch/);

  const thirdClauseFirstLiteralRemoved = makeProject(t);
  thirdClauseFirstLiteralRemoved.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFormalized = false;
  write(thirdClauseFirstLiteralRemoved.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralRemoved.release));
  expectFailure(thirdClauseFirstLiteralRemoved, /formal-publication Cook-Levin builder third-clause-first-literal-prefix boundary mismatch/);

  const thirdClauseFirstLiteralAudit = makeProject(t);
  thirdClauseFirstLiteralAudit.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount = 86;
  write(thirdClauseFirstLiteralAudit.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralAudit.release));
  expectFailure(thirdClauseFirstLiteralAudit, /formal-publication Cook-Levin builder third-clause-first-literal-prefix boundary mismatch/);

  const thirdClauseFirstLiteralCost = makeProject(t);
  thirdClauseFirstLiteralCost.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount = "0";
  write(thirdClauseFirstLiteralCost.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralCost.release));
  expectFailure(thirdClauseFirstLiteralCost, /formal-publication Cook-Levin builder third-clause-first-literal-prefix cost mismatch/);

  const thirdClauseFirstLiteralIdentity = makeProject(t);
  thirdClauseFirstLiteralIdentity.release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.forged";
  write(thirdClauseFirstLiteralIdentity.root, "downloads/formal-publication-release.json", json(thirdClauseFirstLiteralIdentity.release));
  expectFailure(thirdClauseFirstLiteralIdentity, /formal-publication Cook-Levin builder third-clause-first-literal-prefix theorem identity mismatch/);

  const thirdClauseSecondLiteralFingerprint = makeProject(t);
  thirdClauseSecondLiteralFingerprint.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256[
    BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREM_NAMES[0]
  ] = "0".repeat(64);
  write(thirdClauseSecondLiteralFingerprint.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralFingerprint.release));
  expectFailure(thirdClauseSecondLiteralFingerprint, /formal-publication Cook-Levin builder third-clause-second-literal-prefix fingerprint mismatch/);

  const thirdClauseSecondLiteralAxiom = makeProject(t);
  thirdClauseSecondLiteralAxiom.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(thirdClauseSecondLiteralAxiom.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralAxiom.release));
  expectFailure(thirdClauseSecondLiteralAxiom, /formal-publication Cook-Levin builder third-clause-second-literal-prefix axiom closure mismatch/);

  const thirdClauseSecondLiteralRemoved = makeProject(t);
  thirdClauseSecondLiteralRemoved.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFormalized = false;
  write(thirdClauseSecondLiteralRemoved.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralRemoved.release));
  expectFailure(thirdClauseSecondLiteralRemoved, /formal-publication Cook-Levin builder third-clause-second-literal-prefix boundary mismatch/);

  const thirdClauseSecondLiteralAudit = makeProject(t);
  thirdClauseSecondLiteralAudit.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount = 144;
  write(thirdClauseSecondLiteralAudit.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralAudit.release));
  expectFailure(thirdClauseSecondLiteralAudit, /formal-publication Cook-Levin builder third-clause-second-literal-prefix boundary mismatch/);

  const thirdClauseSecondLiteralCost = makeProject(t);
  thirdClauseSecondLiteralCost.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount = "0";
  write(thirdClauseSecondLiteralCost.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralCost.release));
  expectFailure(thirdClauseSecondLiteralCost, /formal-publication Cook-Levin builder third-clause-second-literal-prefix cost mismatch/);

  const thirdClauseSecondLiteralIdentity = makeProject(t);
  thirdClauseSecondLiteralIdentity.release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.forged";
  write(thirdClauseSecondLiteralIdentity.root, "downloads/formal-publication-release.json", json(thirdClauseSecondLiteralIdentity.release));
  expectFailure(thirdClauseSecondLiteralIdentity, /formal-publication Cook-Levin builder third-clause-second-literal-prefix theorem identity mismatch/);

  const rawBuilder = makeProject(t);
  rawBuilder.release.earnedBoundary.cookLevinRawFormulaBuilderFormalized = true;
  write(rawBuilder.root, "downloads/formal-publication-release.json", json(rawBuilder.release));
  expectFailure(rawBuilder, /formal-publication overstates Cook-Levin construction complexity/);

  const runtime = makeProject(t);
  runtime.release.earnedBoundary.cookLevinFormulaConstructionRuntimePolynomialFormalized = true;
  write(runtime.root, "downloads/formal-publication-release.json", json(runtime.release));
  expectFailure(runtime, /formal-publication overstates Cook-Levin construction complexity/);
});

test("rejects second-clause padding-run status, inventory, and publication-map mutation", (t) => {
  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-clause-padding-run evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-clause-padding-run"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-clause-padding-run mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-clause-padding-run theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder second-clause-padding-run theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-clause-padding-run fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-clause-padding-run"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-clause-padding-run milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-clause-padding-run"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-clause-padding-run milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-clause-padding-run fingerprint mismatch/);
});

test("rejects third-clause separator-step status, inventory, and publication-map mutation", (t) => {
  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder third-clause-separator-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-separator-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder third-clause-separator-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder third-clause-separator-step theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder third-clause-separator-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder third-clause-separator-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-separator-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder third-clause-separator-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-third-clause-separator-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder third-clause-separator-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder third-clause-separator-step fingerprint mismatch/);
});

test("rejects clause-three first-literal status, inventory, and publication-map mutation", (t) => {
  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder third-clause-first-literal-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-first-literal-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder third-clause-first-literal-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder third-clause-first-literal-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder third-clause-first-literal-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder third-clause-first-literal-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-first-literal-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder third-clause-first-literal-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-third-clause-first-literal-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder third-clause-first-literal-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder third-clause-first-literal-prefix fingerprint mismatch/);
});

test("rejects clause-three second-literal status, inventory, and publication-map mutation", (t) => {
  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder third-clause-second-literal-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-second-literal-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder third-clause-second-literal-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder third-clause-second-literal-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder third-clause-second-literal-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder third-clause-second-literal-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-second-literal-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder third-clause-second-literal-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-third-clause-second-literal-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder third-clause-second-literal-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder third-clause-second-literal-prefix fingerprint mismatch/);
});

test("rejects complete clause-three status, inventory, and publication-map mutation", (t) => {
  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder third-clause-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder third-clause-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder third-clause-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder third-clause-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder third-clause-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder third-clause-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-third-clause-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder third-clause-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder third-clause-prefix fingerprint mismatch/);
});

test("rejects clause-three padding-run release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder third-clause-padding-run boundary mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder third-clause-padding-run evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-padding-run"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder third-clause-padding-run mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder third-clause-padding-run theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder third-clause-padding-run theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder third-clause-padding-run fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-third-clause-padding-run"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder third-clause-padding-run milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-third-clause-padding-run"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder third-clause-padding-run milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder third-clause-padding-run fingerprint mismatch/);
});

test("rejects fourth-clause separator-step release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fourth-clause-separator-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fourth-clause-separator-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fourth-clause-separator-step axiom closure mismatch/);

  const releaseAudit = makeProject(t);
  releaseAudit.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount = 55;
  write(releaseAudit.root, "downloads/formal-publication-release.json", json(releaseAudit.release));
  expectFailure(releaseAudit, /formal-publication Cook-Levin builder fourth-clause-separator-step boundary mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fourth-clause-separator-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fourth-clause-separator-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fourth-clause-separator-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-separator-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fourth-clause-separator-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fourth-clause-separator-step theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fourth-clause-separator-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fourth-clause-separator-step fingerprint mismatch/);

  const suffixFingerprint = makeProject(t);
  const suffixPayload = JSON.parse(readFileSync(path.join(suffixFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  suffixPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.suffix_workRunExact"
  ).kernelType += " ";
  rewriteCorePayload(suffixFingerprint, "public/pnp-theorem-inventory.json", suffixPayload);
  expectFailure(suffixFingerprint, /public inventory Cook-Levin builder fourth-clause-separator-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-separator-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fourth-clause-separator-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fourth-clause-separator-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fourth-clause-separator-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fourth-clause-separator-step fingerprint mismatch/);
});

test("rejects fourth-clause first-literal release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix axiom closure mismatch/);

  const releaseAudit = makeProject(t);
  releaseAudit.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount = 114;
  write(releaseAudit.root, "downloads/formal-publication-release.json", json(releaseAudit.release));
  expectFailure(releaseAudit, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix boundary mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fourth-clause-first-literal-prefix theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fourth-clause-first-literal-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-first-literal-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fourth-clause-first-literal-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fourth-clause-first-literal-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fourth-clause-first-literal-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch/);

  const suffixFingerprint = makeProject(t);
  const suffixPayload = JSON.parse(readFileSync(path.join(suffixFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  suffixPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length"
  ).kernelType += " ";
  rewriteCorePayload(suffixFingerprint, "public/pnp-theorem-inventory.json", suffixPayload);
  expectFailure(suffixFingerprint, /public inventory Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-first-literal-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fourth-clause-first-literal-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fourth-clause-first-literal-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fourth-clause-first-literal-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fourth-clause-first-literal-prefix fingerprint mismatch/);
});

test("rejects fourth-clause second-literal release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix axiom closure mismatch/);

  const releaseAudit = makeProject(t);
  releaseAudit.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount = 146;
  write(releaseAudit.root, "downloads/formal-publication-release.json", json(releaseAudit.release));
  expectFailure(releaseAudit, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix boundary mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fourth-clause-second-literal-prefix theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fourth-clause-second-literal-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-second-literal-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fourth-clause-second-literal-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fourth-clause-second-literal-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fourth-clause-second-literal-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch/);

  const suffixFingerprint = makeProject(t);
  const suffixPayload = JSON.parse(readFileSync(path.join(suffixFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  suffixPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length"
  ).kernelType += " ";
  rewriteCorePayload(suffixFingerprint, "public/pnp-theorem-inventory.json", suffixPayload);
  expectFailure(suffixFingerprint, /public inventory Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-second-literal-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fourth-clause-second-literal-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fourth-clause-second-literal-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fourth-clause-second-literal-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fourth-clause-second-literal-prefix fingerprint mismatch/);
});

test("rejects complete-fourth-clause release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fourth-clause-prefix boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFourthClausePrefixTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fourth-clause-prefix fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFourthClausePrefixProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fourth-clause-prefix axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFourthClausePrefixRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fourth-clause-prefix cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFourthClausePrefixNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fourth-clause-prefix theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fourth-clause-prefix evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-prefix"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fourth-clause-prefix mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fourth-clause-prefix theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fourth-clause-prefix theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fourth-clause-prefix fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-prefix"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fourth-clause-prefix milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fourth-clause-prefix"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fourth-clause-prefix milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fourth-clause-prefix fingerprint mismatch/);
});

test("rejects fourth-clause-padding release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fourth-clause-padding-run boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fourth-clause-padding-run fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fourth-clause-padding-run axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fourth-clause-padding-run cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunDirectFifthClausePaddingTheorem =
    "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fourth-clause-padding-run theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fourth-clause-padding-run evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-padding-run"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fourth-clause-padding-run mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fourth-clause-padding-run theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fourth-clause-padding-run theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder fourth-clause-padding-run theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fourth-clause-padding-run fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fourth-clause-padding-run"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fourth-clause-padding-run milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fourth-clause-padding-run"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fourth-clause-padding-run milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fourth-clause-padding-run fingerprint mismatch/);
});

test("rejects fifth-clause-padding release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder fifth-clause-padding-run boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder fifth-clause-padding-run fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder fifth-clause-padding-run axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder fifth-clause-padding-run cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunDirectSixthClausePaddingTheorem =
    "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder fifth-clause-padding-run theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder fifth-clause-padding-run evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fifth-clause-padding-run"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder fifth-clause-padding-run mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder fifth-clause-padding-run theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder fifth-clause-padding-run theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder fifth-clause-padding-run theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder fifth-clause-padding-run fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-fifth-clause-padding-run"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder fifth-clause-padding-run milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-fifth-clause-padding-run"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder fifth-clause-padding-run milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder fifth-clause-padding-run fingerprint mismatch/);
});

test("rejects first-constraint-padding release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder first-constraint-padding-run boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder first-constraint-padding-run fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder first-constraint-padding-run axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder first-constraint-padding-run cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunDirectSecondConstraintSeparatorTheorem =
    "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder first-constraint-padding-run theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder first-constraint-padding-run evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-first-constraint-padding-run"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder first-constraint-padding-run mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder first-constraint-padding-run theorem mismatch/);

  const inventoryModule = makeProject(t);
  const inventoryModulePayload = JSON.parse(readFileSync(path.join(inventoryModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(inventoryModule, "public/pnp-theorem-inventory.json", inventoryModulePayload);
  expectFailure(inventoryModule, /public inventory Cook-Levin builder first-constraint-padding-run theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder first-constraint-padding-run theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder first-constraint-padding-run fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-first-constraint-padding-run"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder first-constraint-padding-run milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-first-constraint-padding-run"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder first-constraint-padding-run milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder first-constraint-padding-run fingerprint mismatch/);
});

test("rejects second-constraint-separator release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-separator-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-separator-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-separator-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-separator-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-separator-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-separator-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-separator-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-separator-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-separator-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-separator-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-separator-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-separator-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-separator-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-separator-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-separator-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-separator-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-sign release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-sign-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-sign-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-sign-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-sign-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-sign-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-sign-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-sign-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-sign-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-sign-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-sign-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-sign-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-sign-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-sign-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-sign-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-sign-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-sign-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-first-unary-unit release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-first-unary-unit-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-first-unary-unit-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-first-unary-unit-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-first-unary-unit-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-first-unary-unit-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-first-unary-unit-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-first-unary-unit-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-first-unary-unit-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-first-unary-unit-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-first-unary-unit-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-first-unary-unit-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-first-unary-unit-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-first-unary-unit-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-second-unary-unit release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-second-unary-unit-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-second-unary-unit-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-second-unary-unit-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-second-unary-unit-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-second-unary-unit-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-second-unary-unit-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-second-unary-unit-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-second-unary-unit-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-second-unary-unit-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-second-unary-unit-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-second-unary-unit-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-second-unary-unit-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-second-unary-unit-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-third-unary-unit release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-third-unary-unit-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.nextTokenSlot_direct_eq_f"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-third-unary-unit-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-third-unary-unit-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-third-unary-unit-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-third-unary-unit-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-third-unary-unit-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-third-unary-unit-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-third-unary-unit-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-third-unary-unit-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralThirdUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-third-unary-unit-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-third-unary-unit-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-third-unary-unit-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-third-unary-unit-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-terminator release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-terminator-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.nextTokenSlot_direct_eq_finish_or_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-terminator-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-terminator-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-terminator-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepNextTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-terminator-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-terminator-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-terminator-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-terminator-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-terminator-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-terminator-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralTerminator"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-terminator-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-terminator-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-terminator-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-terminator-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-terminator-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-terminator-step fingerprint mismatch/);
});

test("rejects second-constraint-first-literal-successor-token release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-first-literal-successor-token-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.followingTokenSlot_direct_eq_padding_or_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-first-literal-successor-token-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-first-literal-successor-token-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-first-literal-successor-token-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFollowingTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-first-literal-successor-token-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-first-literal-successor-token-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-first-literal-successor-token-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-first-literal-successor-token-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-first-literal-successor-token-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSuccessor"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-first-literal-successor-token-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-first-literal-successor-token-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-first-literal-successor-token-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-first-literal-successor-token-step fingerprint mismatch/);
});

test("rejects second-constraint-padding-or-unary-opportunity release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-padding-or-unary-opportunity-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-padding-or-unary-opportunity-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-padding-or-unary-opportunity-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-padding-or-unary-opportunity-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFollowingTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-padding-or-unary-opportunity-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-padding-or-unary-opportunity-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-padding-or-unary-opportunity-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_opportunity_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-padding-or-unary-opportunity-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_optional_unary"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-padding-or-unary-opportunity-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintPaddingOrUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-padding-or-unary-opportunity-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-padding-or-unary-opportunity-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-padding-or-unary-opportunity-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-padding-or-unary-opportunity-step fingerprint mismatch/);
});

test("rejects second-constraint-second-padding-or-unary-opportunity release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFollowingTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_opportunity_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_two_optional_unary"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSecondPaddingOrUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-second-padding-or-unary-opportunity-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-second-padding-or-unary-opportunity-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-second-padding-or-unary-opportunity-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-second-padding-or-unary-opportunity-step fingerprint mismatch/);
});

test("rejects second-constraint-third-padding-or-unary-opportunity release, status, inventory, and publication-map mutation", (t) => {
  const releaseFlag = makeProject(t);
  releaseFlag.release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized = false;
  write(releaseFlag.root, "downloads/formal-publication-release.json", json(releaseFlag.release));
  expectFailure(releaseFlag, /formal-publication Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step boundary mismatch/);

  const releaseFingerprint = makeProject(t);
  releaseFingerprint.release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t"
  ] = "0".repeat(64);
  write(releaseFingerprint.root, "downloads/formal-publication-release.json", json(releaseFingerprint.release));
  expectFailure(releaseFingerprint, /formal-publication Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step fingerprint mismatch/);

  const releaseAxiom = makeProject(t);
  releaseAxiom.release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepProjectAxiomClosure = ["PNP.ForgedAxiom"];
  write(releaseAxiom.root, "downloads/formal-publication-release.json", json(releaseAxiom.release));
  expectFailure(releaseAxiom, /formal-publication Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step axiom closure mismatch/);

  const releaseCost = makeProject(t);
  releaseCost.release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRuleCount = "0";
  write(releaseCost.root, "downloads/formal-publication-release.json", json(releaseCost.release));
  expectFailure(releaseCost, /formal-publication Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step cost mismatch/);

  const releaseIdentity = makeProject(t);
  releaseIdentity.release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFollowingTokenTheorem =
    "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.forged";
  write(releaseIdentity.root, "downloads/formal-publication-release.json", json(releaseIdentity.release));
  expectFailure(releaseIdentity, /formal-publication Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step theorem identity mismatch/);

  const statusFlag = makeProject(t);
  const statusFlagPayload = JSON.parse(readFileSync(path.join(statusFlag.sourceDir, "public/pnp-status.json"), "utf8"));
  statusFlagPayload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = false;
  rewriteCorePayload(statusFlag, "public/pnp-status.json", statusFlagPayload);
  expectFailure(statusFlag, /public status Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step evidence mismatch/);

  const statusMilestone = makeProject(t);
  const statusMilestonePayload = JSON.parse(readFileSync(path.join(statusMilestone.sourceDir, "public/pnp-status.json"), "utf8"));
  statusMilestonePayload.formalPublicationMilestones = statusMilestonePayload.formalPublicationMilestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(statusMilestone, "public/pnp-status.json", statusMilestonePayload);
  expectFailure(statusMilestone, /public status Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step mismatch/);

  const inventoryAxiom = makeProject(t);
  const inventoryAxiomPayload = JSON.parse(readFileSync(path.join(inventoryAxiom.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryAxiomPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_opportunity_step"
  ).axioms = ["PNP.ForgedAxiom"];
  rewriteCorePayload(inventoryAxiom, "public/pnp-theorem-inventory.json", inventoryAxiomPayload);
  expectFailure(inventoryAxiom, /public inventory Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step theorem mismatch/);

  const reusedModule = makeProject(t);
  const reusedModulePayload = JSON.parse(readFileSync(path.join(reusedModule.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  reusedModulePayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_three_optional_unary"
  ).module = "PNP.ForgedModule";
  rewriteCorePayload(reusedModule, "public/pnp-theorem-inventory.json", reusedModulePayload);
  expectFailure(reusedModule, /public inventory Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step theorem mismatch/);

  const inventoryFingerprint = makeProject(t);
  const inventoryFingerprintPayload = JSON.parse(readFileSync(path.join(inventoryFingerprint.sourceDir, "public/pnp-theorem-inventory.json"), "utf8"));
  inventoryFingerprintPayload.milestoneCandidates.find(
    (row) => row.name === "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintThirdPaddingOrUnary"
  ).kernelType += " ";
  rewriteCorePayload(inventoryFingerprint, "public/pnp-theorem-inventory.json", inventoryFingerprintPayload);
  expectFailure(inventoryFingerprint, /public inventory Cook-Levin builder second-constraint-third-padding-or-unary-opportunity-step fingerprint mismatch/);

  const mapMilestone = makeProject(t);
  const mapMilestonePayload = JSON.parse(readFileSync(path.join(mapMilestone.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapMilestonePayload.milestones = mapMilestonePayload.milestones.filter(
    (row) => row.id !== "concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step"
  );
  rewriteCorePayload(mapMilestone, "publication/FORMAL_PUBLICATION_MAP.json", mapMilestonePayload);
  expectFailure(mapMilestone, /core publication map builder second-constraint-third-padding-or-unary-opportunity-step milestone mismatch/);

  const mapNonClaim = makeProject(t);
  const mapNonClaimPayload = JSON.parse(readFileSync(path.join(mapNonClaim.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapNonClaimPayload.milestones.find(
    (row) => row.id === "concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step"
  ).nonClaim = "forged";
  rewriteCorePayload(mapNonClaim, "publication/FORMAL_PUBLICATION_MAP.json", mapNonClaimPayload);
  expectFailure(mapNonClaim, /core publication map builder second-constraint-third-padding-or-unary-opportunity-step milestone mismatch/);

  const mapFingerprint = makeProject(t);
  const mapFingerprintPayload = JSON.parse(readFileSync(path.join(mapFingerprint.sourceDir, "publication/FORMAL_PUBLICATION_MAP.json"), "utf8"));
  mapFingerprintPayload.earnedMilestoneTheoremKernelTypeSha256[
    "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workRunExact"
  ] = "0".repeat(64);
  rewriteCorePayload(mapFingerprint, "publication/FORMAL_PUBLICATION_MAP.json", mapFingerprintPayload);
  expectFailure(mapFingerprint, /core publication map builder second-constraint-third-padding-or-unary-opportunity-step fingerprint mismatch/);
});

test("rejects drift in the retained canonical-pair runtime polynomial", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePairedRawTimePolynomial = "Rpair(m) = 0";
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /formal-publication canonical-pair polynomial evidence mismatch/);
});

test("rejects a drifted canonical-pair theorem fingerprint", (t) => {
  const project = makeProject(t);
  project.release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256 = "0".repeat(64);
  write(project.root, "downloads/formal-publication-release.json", json(project.release));
  expectFailure(project, /canonical-pair verdict evidence mismatch/);
});

test("skips only the cross-repository phase when a source checkout is optional", (t) => {
  const project = makeProject(t);
  const result = validate(project, { sourceDir: path.join(project.root, "missing-pnp") });
  assert.equal(result.skipped, true);
  assert.match(result.skipReason, /not a git checkout/);
});

test("fails when the exact source checkout is required but absent", (t) => {
  const project = makeProject(t);
  expectFailure(project, /not a git checkout/, {
    sourceDir: path.join(project.root, "missing-pnp"),
    requireSource: true
  });
});
