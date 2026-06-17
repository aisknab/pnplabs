import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Purpose: serve only the public static website files during local review.
// Inputs: GET/HEAD requests under WEB_ROOT or this repository root.
// Outputs: static files with security headers, or deterministic 403/404/405/500 responses.
// Invariants enforced: path normalization, dotfile blocking, explicit public allowlist.
// Assumptions not checked: theorem correctness and release artefact validity.
// Failure modes: forbidden path, missing file, unsupported method, or filesystem error.
const ROOT = path.resolve(
  process.env.WEB_ROOT || path.dirname(fileURLToPath(import.meta.url))
);

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3013);

const PUBLIC_ROOT_FILES = new Set([
  "/404.html",
  "/architecture.html",
  "/CNAME",
  "/faq.html",
  "/index.html",
  "/paper.html",
  "/review.html",
  "/robots.txt",
  "/security.txt",
  "/sitemap.xml",
  "/verify.html"
]);

const PUBLIC_EXACT_FILES = new Set([
  "/.well-known/security.txt"
]);

const PUBLIC_PREFIXES = [
  "/assets/",
  "/downloads/"
];

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

function resolveStaticPath(urlPath) {
  const clean = normalizeUrlPath(urlPath);

  if (!clean) {
    return { status: "forbidden" };
  }

  if (!isPublicPath(clean)) {
    return { status: isBlockedPath(clean) ? "forbidden" : "not-found" };
  }

  const absolute = path.resolve(ROOT, "." + clean);

  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) {
    return { status: "forbidden" };
  }

  return { status: "ok", filePath: absolute };
}

function sendSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'sha256-xYFFM6WE1nrMju6f+uvjLsSC4rb22e5i+9hWRaG8wk8='; script-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  );
}

async function serveFile(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendSecurityHeaders(res);
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end("Method Not Allowed");
    return;
  }

  const resolution = resolveStaticPath(url.pathname);

  if (!resolution || resolution.status === "forbidden") {
    sendSecurityHeaders(res);
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let statusCode = 200;
  let filePath = resolution.filePath;

  if (resolution.status === "not-found") {
    statusCode = 404;
    filePath = path.join(ROOT, "404.html");
  }

  try {
    const info = await stat(filePath);

    if (info.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      await stat(filePath);
    }
  } catch {
    statusCode = 404;
    filePath = path.join(ROOT, "404.html");

    try {
      await stat(filePath);
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

  if (url.pathname.startsWith("/assets/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("Cache-Control", "no-cache");
  }

  res.writeHead(statusCode);

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}

const server = createServer((req, res) => {
  serveFile(req, res).catch((error) => {
    console.error(error);
    sendSecurityHeaders(res);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  });
});

server.listen(PORT, HOST, () => {
  console.log(`PNP Labs static site serving ${ROOT} on http://${HOST}:${PORT}`);
});
