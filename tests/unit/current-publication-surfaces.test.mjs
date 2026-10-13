import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENT_PUBLICATION_PAGES, currentPublicationOutputs, renderStaticMilestoneCards,
} from '../../tools/render-current-publication.mjs';

const marker = region => '<!-- CURRENT_CORRECTIONS:' + region + ':START -->\nold correction\n<!-- CURRENT_CORRECTIONS:' + region + ':END -->';
const milestone = {id:'general-construction',title:'Canonical <title>',scope:'Exact construction scope.',
  nonClaim:'This does not solve the complete problem.',earned:true,requiredTheorems:['PNP.Fixture.checked']};
const history = '<p class="muted" data-historical-progress-snapshot="original">Original score: 30%.</p>';
function fixture() {
  const coordinate = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-01-01-300';
  const latest = {id:'current-update',milestoneId:milestone.id,title:'Current <title> & boundary',
    plainLanguage:['Current construction summary.', 'Finding a solution remains open.'],
    source:{commit:'b'.repeat(40),tree:'c'.repeat(40),statusCoordinate:coordinate},milestone};
  const model = {entries:[latest],proofProgress:{percent:30,uncertaintyLowPercent:20,uncertaintyHighPercent:40,
    formalArtefactCoverage:{earnedRows:1,totalRows:2},globalGatesClosed:0,globalGatesAvailable:5,
    projectSpecificAxiomsRemaining:[],rootTheorem:{name:'PNP.Main.p_eq_np',present:false},publicationGate:{passed:false}}};
  const status = {formalPublicationMilestones:[milestone,{...milestone,id:'open',earned:false,title:'Open obligation'}]};
  const index = {sourceCommitRef:'d'.repeat(40),sourceTree:'e'.repeat(40)};
  const progress = {history:[{asOfCoordinate:coordinate,scoreChanged:false}]};
  const inventory = {declarationCount:4,theoremCount:3,assumptionFreeTheoremCount:1,
    excludedPrivateDeclarationCount:2,sourceClosureModuleCount:1,axiomCount:0};
  const primary = '<section class="section compact" data-current-publication-summary>' + marker('SUMMARY') + '<p>Old current summary</p></section>';
  const doc = '<!-- CURRENT_PUBLICATION:START -->\nOld current document\n' + marker('SUMMARY') + '\n<!-- CURRENT_PUBLICATION:END -->';
  const sources = new Map(CURRENT_PUBLICATION_PAGES.map(file => [file,
    (file.endsWith('.md') ? doc : primary) + '\nUntouched historical text: 98%.\n']));
  const add = (file, text) => sources.set(file, sources.get(file) + text);
  add('index.html', '<section class="section compact" data-current-milestone="old">' + marker('BOTTOM_LINE') + '</section>'
    + '<article class="latest-milestone" aria-labelledby="latest-milestone-title">Old card</article>'
    + '<details data-current-milestone="old"><p class="boundary-copy"><strong>Latest earned step:</strong> Old technical scope</p></details>'
    + '<pre data-formal-status-fields>old</pre>');
  add('status.html', '<pre data-formal-status-fields>old</pre><div class="grid three path" data-formal-milestones>'
    + '<article data-milestone-id="general-construction">' + history + '</article></div>'
    + '<p data-formal-inventory-counts>old</p><article class="card"><h3>Current formal report</h3>old</article>');
  add('faq.html', '<details><summary class="disclosure-summary"><span>What did the latest milestone add?</span></summary>old</details>');
  add('architecture.html', '<article class="card"><h3>Scoped milestone classifier</h3>old</article>');
  add('paper.html', '<div class="section-head"><div><div class="section-label">Current formal artefact coverage</div>'
    + '<h2>old</h2></div><p>This row count measures the evidence ledger, not proof completion.</p></div>'
    + '<article class="card"><h3>Earned scoped results</h3>old</article>');
  sources.set('assets/main.js', 'const STATUS_COORDINATE = "fixture";\n'
    + 'function formalStatusFields(payload) { return "rows = " + payload.formalPublicationMilestones.length; }\n'
    + 'function renderFormalStatus() {}');
  return {model,sources,inputs:{status,index,progress,inventory}};
}

test('current surfaces derive the latest reviewed text, two metrics and source roles', () => {
  const {model,sources,inputs} = fixture(), before = structuredClone({model,sources,inputs});
  const outputs = currentPublicationOutputs(model,sources,inputs);
  assert.deepEqual([...outputs.keys()],CURRENT_PUBLICATION_PAGES);
  for (const [file,source] of outputs) {
    assert.ok(source.includes('Current construction summary.'),file);
    assert.ok(source.includes('Finding a solution remains open.'),file);
    assert.ok(source.includes('1 of 2'),file);
    assert.ok(source.includes('30%'),file);
    assert.ok(source.includes('Untouched historical text: 98%.'),file);
    assert.ok(source.includes('old correction'),file + ': correction generator retains ownership');
    assert.doesNotMatch(source,/Old current summary|Old current document/);
    assert.doesNotMatch(source,/\b\d+[- ]pages?\b/u);
  }
  const readme=outputs.get('README.md');
  assert.ok(readme.includes('Current release source: [`'+inputs.index.sourceCommitRef+'`]'));
  assert.ok(readme.includes('Original latest-earned source: [`'+model.entries[0].source.commit+'`]'));
  assert.ok(outputs.get('faq.html').includes(milestone.scope));
  assert.ok(outputs.get('faq.html').includes(milestone.nonClaim));
  assert.ok(outputs.get('index.html').includes('data-current-milestone="general-construction"'));
  assert.ok(outputs.get('index.html').includes(milestone.scope));
  assert.ok(outputs.get('index.html').includes(milestone.nonClaim));
  assert.ok(!outputs.get('index.html').includes('Old technical scope'));
  assert.ok(outputs.get('status.html').includes('<pre data-formal-status-fields>rows = 2</pre>'));
  assert.deepEqual({model,sources,inputs},before);
  const nextSources=new Map([...sources,...outputs]);
  assert.deepEqual(currentPublicationOutputs(model,nextSources,inputs),outputs,'deterministic idempotence');
});

test('HTML and Markdown text are escaped without changing historical annotations', () => {
  const {model,sources,inputs}=fixture(),output=currentPublicationOutputs(model,sources,inputs);
  assert.ok(output.get('index.html').includes('Current &lt;title&gt; &amp; boundary'));
  assert.ok(output.get('README.md').includes('Current \\<title\\> &amp; boundary'));
  assert.ok(output.get('status.html').includes('Canonical &lt;title&gt;'));
  assert.ok(output.get('status.html').includes(history));
  const cards=renderStaticMilestoneCards(inputs.status,sources.get('status.html'));
  assert.equal((cards.match(/data-reviewed-theorem-pins/gu)??[]).length,1,'unearned rows have no earned pin list');
  assert.equal((cards.match(/<code>PNP.Fixture.checked<\/code>/gu)??[]).length,1);
  assert.throws(()=>renderStaticMilestoneCards(inputs.status,sources.get('status.html')+sources.get('status.html')),/duplicate static milestone/);
});

test('new ledger cards acquire their original snapshot from the validated update, not current totals', () => {
  const {model,sources,inputs}=fixture();
  const entry=model.entries[0];
  entry.progressSnapshot={modelId:'fixed-risk-weighted-checkpoints-v0',
    formalArtefactCoverageEarnedRows:7,formalArtefactCoverageTotalRows:9,
    riskWeightedProofCompletionPercent:31,uncertaintyLowPercent:21,uncertaintyHighPercent:41,
    globalGatesClosed:1,globalGatesAvailable:5};
  sources.set('status.html',sources.get('status.html').replace(history,''));
  const output=currentPublicationOutputs(model,sources,inputs),html=output.get('status.html');
  const original=html.match(/<p[^>]*data-historical-progress-snapshot="[^"]+"[^>]*>[\s\S]*?<\/p>/u)?.[0];
  assert.ok(original,'new earned card must carry an original review');
  for(const value of [entry.source.statusCoordinate,'7 of 9','31%','21% to 41%','1 of 5',
    'updates.html#'+entry.id]) assert.ok(original.includes(value),value);
  assert.ok(!original.includes('1 of 2'),'live coverage is not the historical snapshot');
  const nextSources=new Map([...sources,...output]);
  model.proofProgress.percent=35;
  const later=currentPublicationOutputs(model,nextSources,inputs).get('status.html');
  assert.ok(later.includes(original),'later current values preserve the original annotation byte-for-byte');
  assert.equal((later.match(/data-historical-progress-snapshot=/gu)??[]).length,1);
  const escaped=renderStaticMilestoneCards(inputs.status,'',[{...entry,
    id:'example"<&',source:{...entry.source,statusCoordinate:'review"<&'}}]);
  assert.ok(escaped.includes('data-historical-progress-snapshot="review&quot;&lt;&amp;"'));
  assert.ok(escaped.includes('updates.html#example&quot;&lt;&amp;'));
});

test('a later milestone changes current values without rewriting historical snapshots', () => {
  const {model,sources,inputs}=fixture();
  model.entries[0].title='Later reviewed milestone';
  model.proofProgress.percent=35;
  model.proofProgress.formalArtefactCoverage={earnedRows:2,totalRows:3};
  inputs.progress.history[0].scoreChanged=true;
  const output=currentPublicationOutputs(model,sources,inputs);
  for(const source of output.values()) {
    assert.ok(source.includes('Later reviewed milestone') || source.includes('Current construction summary.'));
    assert.ok(source.includes('2 of 3'));
    assert.ok(source.includes('35%'));
  }
  assert.ok(output.get('status.html').includes(history));
  assert.ok(output.get('README.md').includes('changes the fixed weighted checkpoints recorded in the canonical progress ledger'));
});

test('missing or duplicate current regions and missing inputs fail closed', () => {
  for(const file of CURRENT_PUBLICATION_PAGES) {
    const {model,sources,inputs}=fixture();
    const original=sources.get(file);
    sources.delete(file);
    assert.throws(()=>currentPublicationOutputs(model,sources,inputs),/current surface is missing/,file);
    sources.set(file,original+original);
    assert.throws(()=>currentPublicationOutputs(model,sources,inputs),/expected one current region|correction markers invalid/,file);
  }
  const {model,sources,inputs}=fixture();
  sources.delete('assets/main.js');
  assert.throws(()=>currentPublicationOutputs(model,sources,inputs),/browser source is required/);
  sources.set('assets/main.js','invalid');
  assert.throws(()=>currentPublicationOutputs(model,sources,inputs),/renderer boundary is missing/);
  sources.set('assets/main.js',fixture().sources.get('assets/main.js'));
  inputs.progress.history=[];
  assert.throws(()=>currentPublicationOutputs(model,sources,inputs),/no canonical checkpoint review/);
});
