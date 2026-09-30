import test from "node:test";
import assert from "node:assert/strict";
import {
  CURRENT_CORRECTION_SURFACES, currentCorrectionOutputs, renderCurrentCorrections
} from "../../tools/generate-milestone-updates.mjs";
import { FIXED_WINDOW_CORRECTION } from "../../tools/fixed-window-correction-contract.mjs";

const marker = (region, side) => "<!-- CURRENT_CORRECTIONS:" + region + ":" + side + " -->";
const fixture = () => ({
  corrections: [
    {
      id: FIXED_WINDOW_CORRECTION.id,
      title: "A synthetic current finding",
      publishedAt: "2030-02-03T04:05:06Z",
      plainLanguage: ["A reviewed limitation is stated plainly.", "This fixture awards no proof credit."]
    },
    {
      id: "synthetic-historical-correction",
      title: "An earlier recorded finding",
      publishedAt: "2029-01-02T03:04:05Z",
      plainLanguage: ["The earlier scope remains intact.", "Its original evidence remains linked."]
    }
  ]
});
const surfaceFixture = () => new Map(CURRENT_CORRECTION_SURFACES.map(([file, _format, regions]) => [
  file, "unchanged prefix\n" + regions.map((region) => marker(region, "START") + "\nstale\n"
    + marker(region, "END")).join("\nunchanged middle\n") + "\nunchanged suffix"
]));

test("the current correction surface set covers primary pages, bottom line and current documentation only", () => {
  assert.deepEqual(CURRENT_CORRECTION_SURFACES.map(([file]) => file).sort(), [
    "README.md", "architecture.html", "docs/activated_claim_wording.md", "docs/audit_questions.md",
    "docs/one_command_verify_upload.md", "docs/proof_pipeline.md", "docs/reproducibility.md",
    "docs/reviewer_guide.md", "docs/source_checker_map.md", "docs/trust_model.md",
    "faq.html", "index.html", "paper.html", "status.html"
  ].sort());
  assert.deepEqual(CURRENT_CORRECTION_SURFACES.find(([file]) => file === "index.html")[2],
    ["SUMMARY", "BOTTOM_LINE"]);
  assert.ok(CURRENT_CORRECTION_SURFACES.every(([file]) => !/archive|history/u.test(file)));
});

test("HTML summaries retain every original notice, chronology and distinct correction label", () => {
  const model = fixture(), before = structuredClone(model), html = renderCurrentCorrections(model);
  for (const notice of model.corrections) {
    assert.ok(html.includes('data-progress-correction="' + notice.id + '"'));
    assert.ok(html.includes('<time datetime="' + notice.publishedAt + '">'));
    assert.ok(html.includes('href="updates.html#' + notice.id + '"'));
    for (const paragraph of notice.plainLanguage) assert.ok(html.includes("<p>" + paragraph + "</p>"));
  }
  assert.ok(html.indexOf(model.corrections[0].id) < html.indexOf(model.corrections[1].id));
  assert.equal(html.match(/Correction, not an earned milestone/gu).length, 2);
  assert.equal(html.match(/This correction adds no earned positive publication row or fixed checkpoint credit\./gu).length, 2);
  assert.doesNotMatch(html, /data-milestone-id|earnedOrdinal|proof completion estimate:|Formal artefact coverage:/u);
  assert.deepEqual(model, before);
});

test("HTML summary prose is escaped and technical inventories are not copied into cards", () => {
  const model = fixture();
  model.corrections[0].title = '<script>alert("fixture")</script> & evidence';
  model.corrections[0].plainLanguage[0] = "A < B & C's \"example\".";
  model.corrections[0].evidence = { theorems: [{ name: "Fixture.NotPublicCardContent" }] };
  const html = renderCurrentCorrections(model);
  assert.ok(html.includes("&lt;script&gt;alert(&quot;fixture&quot;)&lt;/script&gt; &amp; evidence"));
  assert.ok(html.includes("A &lt; B &amp; C&#39;s &quot;example&quot;."));
  assert.doesNotMatch(html, /<script>|Fixture\.NotPublicCardContent/u);
});

test("Markdown summaries escape supplied syntax and use document-relative update links", () => {
  const model = fixture();
  model.corrections[0].title = "[fixture](unsafe) & *literal*";
  model.corrections[0].plainLanguage[0] = "First line\nSecond line with <markup>.";
  const markdown = renderCurrentCorrections(model, { format: "markdown", updatesPath: "../updates.html" });
  assert.ok(markdown.includes("### \\[fixture\\](unsafe) &amp; \\*literal\\*"));
  assert.ok(markdown.includes("First line Second line with \\<markup\\>."));
  assert.ok(markdown.includes("](../updates.html#" + FIXED_WINDOW_CORRECTION.id + ")"));
  assert.ok(markdown.includes("Published 2030-02-03."));
  assert.ok(markdown.includes(model.corrections[1].plainLanguage[0]));
});

test("summary renderers reject unexpected formats and destinations", () => {
  assert.throws(() => renderCurrentCorrections(fixture(), { format: "json" }), /unsupported.*format/u);
  assert.throws(() => renderCurrentCorrections(fixture(), { updatesPath: "javascript:fixture" }), /unsupported.*link/u);
});

test("the pre-correction publication remains byte-unchanged without new markers", () => {
  const model = fixture();
  model.corrections.shift();
  const sources = new Map([["index.html", "existing active page"]]);
  assert.equal(currentCorrectionOutputs(model, sources).size, 0);
  assert.equal(sources.get("index.html"), "existing active page");
});

test("marked current regions regenerate from the ledger and preserve surrounding bytes", () => {
  const model = fixture(), beforeModel = structuredClone(model);
  const sources = surfaceFixture(), beforeSources = new Map(sources);
  const outputs = currentCorrectionOutputs(model, sources);
  assert.equal(outputs.size, CURRENT_CORRECTION_SURFACES.length);
  for (const [file, format, regions] of CURRENT_CORRECTION_SURFACES) {
    const source = outputs.get(file);
    assert.ok(source.startsWith("unchanged prefix\n"), file);
    assert.ok(source.endsWith("\nunchanged suffix"), file);
    assert.ok(!source.includes("\nstale\n"), file);
    for (const region of regions) {
      assert.ok(source.includes(marker(region, "START")), file);
      assert.ok(source.includes(marker(region, "END")), file);
    }
    assert.ok(source.includes(model.corrections[0].title), file);
    assert.ok(source.includes(model.corrections[1].title), file);
    if (format === "markdown" && file.startsWith("docs/")) assert.ok(source.includes("](../updates.html#"), file);
  }
  assert.deepEqual(currentCorrectionOutputs(model, outputs), outputs, "generation is idempotent");
  assert.deepEqual(model, beforeModel);
  assert.deepEqual(sources, beforeSources);
});

test("a published fixed-window correction requires every configured page and every region", () => {
  for (const [file, _format, regions] of CURRENT_CORRECTION_SURFACES) {
    const missingFile = surfaceFixture();
    missingFile.delete(file);
    assert.throws(() => currentCorrectionOutputs(fixture(), missingFile), /missing current correction surface/u, file);
    for (const region of regions) {
      const missingRegion = surfaceFixture();
      missingRegion.set(file, missingRegion.get(file)
        .replace(marker(region, "START"), "").replace(marker(region, "END"), ""));
      assert.throws(() => currentCorrectionOutputs(fixture(), missingRegion), /missing or misordered/u, file + ":" + region);
    }
  }
});

test("partial, duplicate and reversed marker pairs fail closed, including before activation", () => {
  for (const legacy of [false, true]) {
    const model = fixture();
    if (legacy) model.corrections.shift();
    for (const [content, diagnostic] of [
      [marker("SUMMARY", "START"), /missing or misordered/u],
      [marker("SUMMARY", "END"), /missing or misordered/u],
      [marker("SUMMARY", "END") + marker("SUMMARY", "START"), /missing or misordered/u],
      [marker("SUMMARY", "START") + marker("SUMMARY", "START") + marker("SUMMARY", "END"), /duplicate/u],
      [marker("SUMMARY", "START") + marker("SUMMARY", "END") + marker("SUMMARY", "END"), /duplicate/u]
    ]) {
      const sources = surfaceFixture();
      sources.set("status.html", content);
      assert.throws(() => currentCorrectionOutputs(model, sources), diagnostic);
    }
  }
});
