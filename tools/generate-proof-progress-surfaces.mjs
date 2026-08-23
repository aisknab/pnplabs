#!/usr/bin/env node

// Purpose: render current proof-progress values into active non-archive pages.
// Inputs: the validated public proof-progress, status, and inventory payloads.
// Outputs: deterministic marked regions in index.html, status.html, and faq.html.
// Invariants enforced: active values come from one canonical ledger and the two
// metrics remain explicitly separate in every generated current surface.
// Assumptions not checked: historical archived wording outside marked current regions.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { loadProofProgressModel, renderProofProgressDashboard } from "./proof-progress-model.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function escaped(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function markers(id) {
  return {
    start: `<!-- PROOF_PROGRESS:${id}:START -->`,
    end: `<!-- PROOF_PROGRESS:${id}:END -->`
  };
}

function replaceRegion(source, id, rendered, relativePath) {
  const { start, end } = markers(id);
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`${relativePath}: missing or misordered ${id} progress markers`);
  }
  if (source.indexOf(start, startIndex + start.length) !== -1 || source.indexOf(end, endIndex + end.length) !== -1) {
    throw new Error(`${relativePath}: duplicate ${id} progress markers`);
  }
  return `${source.slice(0, startIndex)}${start}\n${rendered}\n${end}${source.slice(endIndex + end.length)}`;
}

function replaceCssRegion(source, model) {
  const start = "/* PROOF_PROGRESS:CSS:START */";
  const end = "/* PROOF_PROGRESS:CSS:END */";
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error("assets/styles.css: missing or misordered CSS progress markers");
  }
  const rendered = `.proof-tape-graphic {\n  --proof-progress: ${model.percent}%;\n  --proof-progress-low: ${model.uncertaintyLowPercent}%;\n  --proof-progress-high: ${model.uncertaintyHighPercent}%;\n}`;
  return `${source.slice(0, startIndex)}${start}\n${rendered}\n${end}${source.slice(endIndex + end.length)}`;
}

function replaceMinifiedCssVariables(source, model) {
  const pattern = /\.proof-tape-graphic\{--proof-progress:[0-9]+%;--proof-progress-low:[0-9]+%;--proof-progress-high:[0-9]+%/gu;
  const matches = source.match(pattern) ?? [];
  if (matches.length !== 1) {
    throw new Error("assets/styles.min.css: expected exactly one minified proof-progress variable block");
  }
  return source.replace(
    pattern,
    `.proof-tape-graphic{--proof-progress:${model.percent}%;--proof-progress-low:${model.uncertaintyLowPercent}%;--proof-progress-high:${model.uncertaintyHighPercent}%`
  );
}

function renderHome(model) {
  const coverage = model.formalArtefactCoverage;
  const tracks = model.tracks.map((track) => `<li><span>${escaped(track.title)}</span><strong>${track.pointsEarned}/${track.pointsAvailable}</strong></li>`).join("");
  const gates = model.globalGates.map((gate) => `<li><span>${escaped(gate.title)}</span><strong>${gate.status === "open" ? "Open" : "Closed"}</strong></li>`).join("");
  return `      <aside class="home-progress-rail" aria-labelledby="home-progress-title" data-proof-progress-model="${escaped(model.modelId)}" data-proof-progress-coordinate="${escaped(model.coordinate)}">\n`
    + `        <div class="home-progress-heading">\n`
    + `          <span class="home-progress-kicker">Risk-weighted proof completion estimate</span>\n`
    + `          <p class="home-progress-number" aria-label="${model.percent} percent risk-weighted proof completion estimate"><strong>${model.percent}</strong><span>%</span></p>\n`
    + `          <span class="home-progress-estimate">uncertainty ${model.uncertaintyLowPercent}% to ${model.uncertaintyHighPercent}%</span>\n`
    + `        </div>\n`
    + `        <div class="proof-tape-graphic" role="img" aria-label="Risk-weighted proof completion estimate ${model.percent} percent, with uncertainty from ${model.uncertaintyLowPercent} to ${model.uncertaintyHighPercent} percent" data-proof-progress="${model.percent}" data-proof-progress-low="${model.uncertaintyLowPercent}" data-proof-progress-high="${model.uncertaintyHighPercent}">\n`
    + `          <div class="proof-tape-scale" aria-hidden="true"><span>100</span><span>${model.percent}</span><span>0</span></div>\n`
    + `          <div class="proof-tape-track" aria-hidden="true"><span class="proof-tape-uncertainty"></span><span class="proof-tape-fill"><span class="proof-tape-head"></span></span></div>\n`
    + `          <div class="proof-tape-legend" aria-hidden="true"><span>burden retired</span><span>complete proof burden</span></div>\n`
    + `        </div>\n`
    + `        <div class="home-progress-copy">\n`
    + `          <h2 id="home-progress-title">${model.percent}% risk-weighted estimate</h2>\n`
    + `          <p>A conservative estimate of how much of the complete formal proof burden has been retired. It is not confidence that P=NP is true, a probability of success, or a time estimate. It may decrease.</p>\n`
    + `          <h3>Formal artefact coverage</h3>\n`
    + `          <p class="home-coverage"><strong>${coverage.earnedRows} of ${coverage.totalRows}</strong> current scoped publication rows earned (${coverage.percentRoundedOneDecimal}%). This is evidence-ledger coverage, not proof completion, and its denominator can grow.</p>\n`
    + `          <h3>Five-track score</h3><ul class="home-progress-breakdown" aria-label="Risk-weighted track scores">${tracks}</ul>\n`
    + `          <h3>Global gates</h3><p><strong>${model.globalGatesClosed} of ${model.globalGatesAvailable} closed</strong></p><ul class="home-progress-gates" aria-label="Current global proof gate states">${gates}</ul>\n`
    + `          <p class="home-progress-caveat">Project-specific axioms remaining: <strong>${model.projectSpecificAxiomsRemaining.length}</strong><br>Root theorem <code>${escaped(model.rootTheorem.name)}</code>: <strong>${model.rootTheorem.present ? "present" : "absent"}</strong><br>Publication gate: <strong>${String(model.publicationGate.passed)}</strong></p>\n`
    + `        </div>\n`
    + `        <div class="home-progress-actions"><a class="btn primary" href="status.html#proof-progress">Inspect the tracker</a><a class="btn secondary" href="updates.xml" type="application/atom+xml">Subscribe</a></div>\n`
    + `      </aside>`;
}

function renderStatus(model) {
  return `    <section id="proof-progress" class="section compact proof-progress-section" aria-labelledby="status-proof-progress-heading">\n`
    + `${renderProofProgressDashboard(model, { headingId: "status-proof-progress-heading" })}\n`
    + `      <p class="progress-source-note">Current values are generated from the byte-mirrored <a href="public/pnp-proof-progress.json"><code>PNPProofProgress0</code> ledger</a> and checked against the formal reconstruction status and compiled theorem inventory.</p>\n`
    + `    </section>`;
}

function renderFaq(model) {
  const coverage = model.formalArtefactCoverage;
  return `    <details id="why-progress-changed"><summary class="disclosure-summary"><span>Why did the progress figure change from 98% to about ${model.percent}%?</span><span class="disclosure-control" aria-hidden="true"><span class="disclosure-closed">Show</span><span class="disclosure-open">Hide</span><span class="disclosure-chevron">⌄</span></span></summary>\n`
    + `      <p>The earlier 98% figure was a narrower scoped-row/editorial measure that readers could too easily interpret as proof completion. The current formal artefact coverage is ${coverage.earnedRows} of ${coverage.totalRows} scoped publication rows earned, or ${coverage.percentRoundedOneDecimal}% of the current evidence ledger. Evidence rows are not equal units of mathematical difficulty, and the denominator can grow when dependencies are discovered or split into smaller rows.</p>\n`
    + `      <p>The two remaining global publication rows aggregate five large proof blockers. Adding completed local submilestones can therefore make the old ratio approach 100% while none of those load-bearing gates closes. Historical mentions of 98% are retained as superseded scoped-row/editorial estimates, not current proof-completion claims.</p>\n`
    + `      <p>The replacement is a fixed 100-point, risk-weighted checkpoint model. It currently awards ${model.pointsEarned} points, so the risk-weighted proof completion estimate is ${model.percent}%, with an uncertainty range of ${model.uncertaintyLowPercent}% to ${model.uncertaintyHighPercent}%. It can move down as well as up if assumptions, hidden complexity, invalidated dependencies, or new blockers are found.</p>\n`
    + `      <p>Neither ${model.percent}% nor ${coverage.percentRoundedOneDecimal}% is confidence that P=NP is true, the probability that the proposed route is correct, or an estimate of time remaining. See the <a href="status.html#proof-progress">five tracks and global gates</a> or inspect the <a href="public/pnp-proof-progress.json">canonical machine-readable tracker</a>.</p>\n`
    + `    </details>`;
}

const SURFACES = Object.freeze([
  ["index.html", "HOME", renderHome],
  ["status.html", "STATUS", renderStatus],
  ["faq.html", "FAQ", renderFaq]
]);

async function generateProofProgressSurfaces({ root = repositoryRoot, write = false } = {}) {
  const model = await loadProofProgressModel(root);
  for (const [relativePath, id, render] of SURFACES) {
    const target = path.join(root, relativePath);
    const actual = await readFile(target, "utf8");
    const expected = replaceRegion(actual, id, render(model), relativePath);
    if (write) {
      if (expected !== actual) await writeFile(target, expected);
    } else if (expected !== actual) {
      throw new Error(`${relativePath}: proof-progress region is stale; run npm run progress:generate`);
    }
  }
  const cssPath = path.join(root, "assets/styles.css");
  const cssActual = await readFile(cssPath, "utf8");
  const cssExpected = replaceCssRegion(cssActual, model);
  if (write) {
    if (cssExpected !== cssActual) await writeFile(cssPath, cssExpected);
  } else if (cssExpected !== cssActual) {
    throw new Error("assets/styles.css: proof-progress variables are stale; run npm run progress:generate");
  }
  const minCssPath = path.join(root, "assets/styles.min.css");
  const minCssActual = await readFile(minCssPath, "utf8");
  const minCssExpected = replaceMinifiedCssVariables(minCssActual, model);
  if (write) {
    if (minCssExpected !== minCssActual) await writeFile(minCssPath, minCssExpected);
  } else if (minCssExpected !== minCssActual) {
    throw new Error("assets/styles.min.css: proof-progress variables are stale; run npm run progress:generate");
  }
  return model;
}

function parseArguments(argv) {
  if (argv.length === 0) return { write: true };
  if (argv.length === 1 && argv[0] === "--check") return { write: false };
  throw new Error("usage: node tools/generate-proof-progress-surfaces.mjs [--check]");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const model = await generateProofProgressSurfaces(parseArguments(process.argv.slice(2)));
    process.stdout.write(`proof-progress-surfaces-valid: ${model.percent}% risk-weighted, ${model.formalArtefactCoverage.earnedRows}/${model.formalArtefactCoverage.totalRows} formal artefact rows\n`);
  } catch (error) {
    process.stderr.write(`${error.name}: ${error.message}\n`);
    process.exitCode = 1;
  }
}

export {
  generateProofProgressSurfaces,
  parseArguments,
  renderFaq,
  renderHome,
  renderStatus,
  replaceCssRegion,
  replaceMinifiedCssVariables,
  replaceRegion
};
