import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { runUnitTests } from "../../tools/run-unit-tests.mjs";

function fixture(t, names = ["z.test.mjs", "a.test.mjs", "notes.md"]) {
  const root = mkdtempSync(path.join(tmpdir(), "pnplabs-unit-runner-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, "tests/unit"), { recursive: true });
  for (const name of names) writeFileSync(path.join(root, "tests/unit", name), "");
  return root;
}

test("normal unit entry point selects every test and bounds worker fan-out", (t) => {
  const root = fixture(t);
  let selectedFixtures;
  const result = runUnitTests({
    root, temporaryParents: [root], filesystemType: () => 0xef53,
    environment: { PNP_SOURCE_DIR: "source-coordinate", TMPDIR: "ignored", TMP: "ignored", TEMP: "ignored" },
    execute(command, args, options) {
      assert.equal(command, process.execPath);
      assert.deepEqual(args, ["--test", "--test-concurrency=2",
        path.join(root, "tests/unit/a.test.mjs"), path.join(root, "tests/unit/z.test.mjs")]);
      assert.equal(options.cwd, root);
      assert.equal(options.stdio, "inherit");
      assert.equal(options.env.PNP_SOURCE_DIR, "source-coordinate");
      selectedFixtures = options.env.TMPDIR;
      assert.equal(path.dirname(selectedFixtures), root);
      assert.match(path.basename(selectedFixtures), /^\.pnplabs-unit-fixtures-/);
      assert.equal(options.env.TMP, selectedFixtures);
      assert.equal(options.env.TEMP, selectedFixtures);
      assert.equal(statSync(selectedFixtures).mode & 0o777, 0o700);
      writeFileSync(path.join(selectedFixtures, "example"), "temporary");
      return { status: 0, signal: null };
    }
  });
  assert.equal(result, 0);
  assert.equal(existsSync(selectedFixtures), false);
});

for (const [label, outcome, expected] of [
  ["test assertion failure", { status: 1, signal: null }, 1],
  ["nonzero child exit", { status: 2, signal: null }, 2],
  ["terminated child", { status: null, signal: "SIGTERM" }, 1],
  ["launch failure", { status: null, error: new Error("private diagnostic") }, 1]
]) {
  test("removes owned fixtures after " + label, (t) => {
    const root = fixture(t);
    const preserved = path.join(root, ".pnplabs-unit-fixtures-user-owned");
    mkdirSync(preserved);
    writeFileSync(path.join(preserved, "keep"), "unrelated");
    let selectedFixtures;
    assert.equal(runUnitTests({
      root, temporaryParents: [root], filesystemType: () => 0xef53,
      execute(command, args, options) {
        selectedFixtures = options.env.TMPDIR;
        return outcome;
      }
    }), expected);
    assert.equal(existsSync(selectedFixtures), false);
    assert.equal(readFileSync(path.join(preserved, "keep"), "utf8"), "unrelated");
  });
}

test("cleans owned fixtures if child invocation throws", (t) => {
  const root = fixture(t);
  let selectedFixtures;
  assert.throws(() => runUnitTests({
    root, temporaryParents: [root], filesystemType: () => 0xef53,
    execute(command, args, options) {
      selectedFixtures = options.env.TMPDIR;
      throw new Error("synthetic invocation failure");
    }
  }), /synthetic invocation failure/);
  assert.equal(existsSync(selectedFixtures), false);
});

for (const filesystem of [0x01021994, 0x858458f6]) {
  test("rejects RAM-backed fixture storage before starting workers: " + filesystem, (t) => {
    const root = fixture(t);
    let launched = false;
    assert.throws(() => runUnitTests({
      root, temporaryParents: [root], filesystemType: () => filesystem,
      execute() { launched = true; }
    }), /disk-backed/);
    assert.equal(launched, false);
    assert.equal(readdirSync(root).some((name) => name.startsWith(".pnplabs-unit-fixtures-")), false);
  });
}

test("rejects an empty or nonregular unit-test selection without launching", (t) => {
  const root = fixture(t, []);
  assert.throws(() => runUnitTests({
    root, temporaryParents: [root], filesystemType: () => 0xef53, execute() { assert.fail("must not launch"); }
  }), /No unit tests/);
  mkdirSync(path.join(root, "tests/unit/not-a-file.test.mjs"));
  assert.throws(() => runUnitTests({
    root, temporaryParents: [root], filesystemType: () => 0xef53, execute() { assert.fail("must not launch"); }
  }), /regular files/);
});

test("npm preserves the complete verification chain through the bounded unit runner", () => {
  const manifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  assert.equal(manifest.scripts["test:unit"], "node tools/run-unit-tests.mjs");
  assert.equal(manifest.scripts.test,
    "npm run progress:validate && npm run progress:check && npm run updates:check && npm run verify:browser-report && npm run test:unit && npm run test:negative && npm run repro:smoke && npm run test:docs");
});

test("refuses to follow a replaced fixture directory during cleanup", (t) => {
  const root = fixture(t);
  const outside = path.join(root, "unrelated");
  mkdirSync(outside);
  writeFileSync(path.join(outside, "keep"), "preserve");
  assert.throws(() => runUnitTests({
    root, temporaryParents: [root], filesystemType: () => 0xef53,
    execute(command, args, options) {
      rmSync(options.env.TMPDIR, { recursive: true, force: false });
      symlinkSync(outside, options.env.TMPDIR);
      return { status: 0, signal: null };
    }
  }), /ownership changed/);
  assert.equal(readFileSync(path.join(outside, "keep"), "utf8"), "preserve");
});

test("executes a real isolated child with its owned temporary directory", (t) => {
  const root = fixture(t, []);
  writeFileSync(path.join(root, "tests/unit/smoke.test.mjs"), [
    'import test from "node:test";',
    'import assert from "node:assert/strict";',
    'import {tmpdir} from "node:os";',
    'import path from "node:path";',
    'test("isolated fixture environment", () => {',
    '  assert.equal(path.dirname(tmpdir()), process.cwd());',
    '  assert.match(path.basename(tmpdir()), /^\\.pnplabs-unit-fixtures-/);',
    '});'
  ].join("\n"));
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  assert.equal(runUnitTests({ root, temporaryParents: [root], environment }), 0);
  assert.deepEqual(readdirSync(root), ["tests"]);
});

test("uses a disk-backed fallback without creating fixtures in RAM-backed storage", (t) => {
  const root = fixture(t);
  const ram = path.join(root, "ram"), disk = path.join(root, "disk");
  mkdirSync(ram); mkdirSync(disk);
  assert.equal(runUnitTests({
    root, temporaryParents: [ram, disk],
    filesystemType: (directory) => directory === ram ? 0x01021994 : 0xef53,
    execute(command, args, options) {
      assert.equal(path.dirname(options.env.TMPDIR), disk);
      assert.deepEqual(readdirSync(ram), []);
      return { status: 0, signal: null };
    }
  }), 0);
  assert.deepEqual(readdirSync(disk), []);
});
