import { createServer } from "node:http";
import { createReadStream, realpathSync } from "node:fs";
import { lstat, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXTENSIONLESS_REDIRECTS,
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS,
  SECURITY_HEADERS,
  cacheControlForPath
} from "./public-surface.mjs";

// Purpose: serve only the public static website files during local review.
// Inputs: GET/HEAD requests under WEB_ROOT or this repository root.
// Outputs: static files with security headers, or deterministic 403/404/405/500 responses.
// Invariants enforced: path normalization, dotfile blocking, explicit public allowlist.
// Assumptions not checked: theorem correctness and release artefact validity.
// Failure modes: forbidden path, missing file, unsupported method, or filesystem error.
const ROOT = path.resolve(
  process.env.WEB_ROOT || path.dirname(fileURLToPath(import.meta.url))
);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3013);

const PUBLIC_ROOT_FILES = new Set(PUBLIC_ROOT_PATHS.map((entry) => `/${entry}`));
const PUBLIC_EXACT_FILES = new Set(PUBLIC_EXACT_PATHS.map((entry) => `/${entry}`));
const PUBLIC_PREFIXES = PUBLIC_DIRECTORY_PATHS.map((entry) => `/${entry}/`);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".tex": "text/plain; charset=utf-8",
  ".zip": "application/zip"
};

const MIME_BY_BASENAME = {
  "SHA256SUMS": "text/plain; charset=utf-8"
};

function normalizeUrlPath(urlPath) {
  let decoded;

  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  if (!decoded.startsWith("/")) {
    decoded = `/${decoded}`;
  }

  if (decoded.includes("\\")) {
    return null;
  }

  const segments = decoded.split("/");
  if (segments.some((segment) => segment === "..")) {
    return null;
  }

  let clean = path.posix.normalize(decoded);

  if (clean === "/" || clean === "." || clean === "") {
    clean = "/index.html";
  }

  if (clean.endsWith("/")) {
    clean += "index.html";
  }

  return clean;
}

function isPublicPath(clean) {
  if (PUBLIC_ROOT_FILES.has(clean) || PUBLIC_EXACT_FILES.has(clean)) {
    return true;
  }

  if (PUBLIC_PREFIXES.some((prefix) => clean.startsWith(prefix))) {
    const segments = clean.split("/").filter(Boolean);
    return !segments.some((segment) => segment.startsWith("."));
  }

  return false;
}

function isBlockedPath(clean) {
  const segments = clean.split("/").filter(Boolean);

  if (segments.some((segment) => segment.startsWith("."))) {
    return !PUBLIC_EXACT_FILES.has(clean);
  }

  return segments.some((segment) =>
    [
      "_headers",
      "CODEX_PROMPT.md",
      "package.json",
      "README.md",
      "server.mjs"
    ].includes(segment)
  );
}

function resolveStaticPath(urlPath, root = ROOT) {
  const clean = normalizeUrlPath(urlPath);

  if (!clean) {
    return { status: "forbidden" };
  }

  if (!isPublicPath(clean)) {
    return { status: isBlockedPath(clean) ? "forbidden" : "not-found" };
  }

  const absolute = path.resolve(root, "." + clean);

  if (absolute !== root && !absolute.startsWith(root + path.sep)) {
    return { status: "forbidden" };
  }

  return { status: "ok", filePath: absolute, cleanPath: clean };
}

class ForbiddenStaticPathError extends Error {}

function isContained(root, candidate) {
  return candidate === root || candidate.startsWith(root + path.sep);
}

async function resolveSafeRegularFile(root, filePath) {
  const relative = path.relative(root, filePath);
  if (path.isAbsolute(relative) || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    throw new ForbiddenStaticPathError("static path escapes web root");
  }

  let cursor = root;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    const info = await lstat(cursor);
    if (info.isSymbolicLink()) throw new ForbiddenStaticPathError("static path contains a symlink");
  }

  const [rootReal, fileReal] = await Promise.all([realpath(root), realpath(filePath)]);
  if (!isContained(rootReal, fileReal)) throw new ForbiddenStaticPathError("resolved static path escapes web root");
  const info = await stat(fileReal);
  if (info.isDirectory()) return resolveSafeRegularFile(root, path.join(filePath, "index.html"));
  if (!info.isFile()) throw new ForbiddenStaticPathError("static path is not a regular file");
  return fileReal;
}

function sendSecurityHeaders(res) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
}

async function serveFile(req, res, root = ROOT) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendSecurityHeaders(res);
    res.writeHead(405, {
      Allow: "GET, HEAD",
      "Cache-Control": "no-cache",
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("Method Not Allowed");
    return;
  }

  const redirectTarget = EXTENSIONLESS_REDIRECTS[url.pathname];
  if (redirectTarget) {
    sendSecurityHeaders(res);
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Location", `${redirectTarget}${url.search}`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.writeHead(308);
    res.end(req.method === "HEAD" ? undefined : `Permanent Redirect: ${redirectTarget}${url.search}`);
    return;
  }

  const resolution = resolveStaticPath(url.pathname, root);

  if (!resolution || resolution.status === "forbidden") {
    sendSecurityHeaders(res);
    res.writeHead(403, {
      "Cache-Control": "no-cache",
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("Forbidden");
    return;
  }

  let statusCode = 200;
  let filePath = resolution.filePath;
  const cleanPath = resolution.cleanPath || "/404.html";

  if (resolution.status === "not-found") {
    statusCode = 404;
    filePath = path.join(root, "404.html");
  }

  try {
    filePath = await resolveSafeRegularFile(root, filePath);
  } catch (error) {
    if (error instanceof ForbiddenStaticPathError) {
      sendSecurityHeaders(res);
      res.writeHead(403, {
        "Cache-Control": "no-cache",
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end("Forbidden");
      return;
    }
    statusCode = 404;
    filePath = path.join(root, "404.html");

    try {
      filePath = await resolveSafeRegularFile(root, filePath);
    } catch {
      sendSecurityHeaders(res);
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_BY_BASENAME[path.basename(filePath)] || MIME[ext] || "application/octet-stream";

  sendSecurityHeaders(res);
  res.setHeader("Content-Type", contentType);

  res.setHeader("Cache-Control", cacheControlForPath(cleanPath));

  res.writeHead(statusCode);

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}

function createStaticServer(options = {}) {
  const root = path.resolve(options.root || ROOT);
  return createServer((req, res) => {
    serveFile(req, res, root).catch((error) => {
      console.error(error);
      sendSecurityHeaders(res);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
    });
  });
}

function isMainModule(argvPath = process.argv[1]) {
  if (!argvPath) return false;
  try {
    return realpathSync(path.resolve(argvPath)) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

const isMain = isMainModule();

if (isMain) {
  const server = createStaticServer();
  server.listen(PORT, HOST, () => {
    console.log(`PNP Labs static site serving ${ROOT} on http://${HOST}:${PORT}`);
  });
}

export { createStaticServer, isMainModule, resolveStaticPath };
