#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.execPath,
  ["tools/sync-public-access-docs.mjs", ...process.argv.slice(2)],
  { cwd: process.cwd(), encoding: "utf8", env: process.env }
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
