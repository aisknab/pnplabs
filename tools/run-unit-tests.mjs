import { spawnSync } from "node:child_process";
import { lstatSync, mkdtempSync, readdirSync, realpathSync, rmSync, statfsSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const ramFilesystems = new Set([0x01021994, 0x858458f6]);

// Keep the normal npm/deployment entry point safe even when its caller clears
// TMPDIR. Fixtures belong to this invocation and are removed before it returns.
export function runUnitTests({
  root = repositoryRoot,
  execute = spawnSync,
  filesystemType = (directory) => statfsSync(directory).type,
  environment = process.env,
  temporaryParents = [tmpdir(), homedir()]
} = {}) {
  const resolvedRoot = realpathSync(root);
  const storage = temporaryParents.map((directory) => {
    try {
      const resolved = realpathSync(directory);
      return ramFilesystems.has(Number(filesystemType(resolved)) >>> 0) ? null : resolved;
    } catch {
      return null;
    }
  }).find((directory) => directory !== null);
  if (!storage) throw new Error("Unit tests require disk-backed temporary storage.");
  const directory = path.join(resolvedRoot, "tests/unit");
  const files = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.name.endsWith(".test.mjs"))
    .map((entry) => {
      if (!entry.isFile()) throw new Error("Unit test entries must be regular files.");
      return path.join(directory, entry.name);
    }).sort();
  if (files.length === 0) throw new Error("No unit tests were found.");

  const fixtures = mkdtempSync(path.join(storage, ".pnplabs-unit-fixtures-"));
  const identity = lstatSync(fixtures);
  try {
    const result = execute(process.execPath, [
      "--test", "--test-concurrency=2", ...files
    ], {
      cwd: resolvedRoot,
      env: { ...environment, TMPDIR: fixtures, TMP: fixtures, TEMP: fixtures },
      stdio: "inherit"
    });
    if (result.error || result.signal || !Number.isInteger(result.status)) return 1;
    return result.status;
  } finally {
    const current = lstatSync(fixtures);
    if (!current.isDirectory() || current.isSymbolicLink()
      || current.dev !== identity.dev || current.ino !== identity.ino
      || realpathSync(fixtures) !== fixtures) {
      throw new Error("Unit test fixture ownership changed; cleanup stopped.");
    }
    rmSync(fixtures, { recursive: true, force: false });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = runUnitTests();
  } catch {
    // Do not dump environment values, child errors or private paths into CI.
    console.error("Unit tests could not complete safely; check disk-backed fixture storage and test-runner diagnostics.");
    process.exitCode = 1;
  }
}
