import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  process.env.WEB_ROOT || path.dirname(fileURLToPath(import.meta.url))
);

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3013);

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
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".tex": "text/plain; charset=utf-8",
  ".zip": "application/zip"
};

function resolveStaticPath(urlPath) {
  let decoded;

  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  let clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");

  if (clean === "/" || clean === "." || clean === "") {
    clean = "/index.html";
  }

  if (clean.endsWith("/")) {
    clean += "index.html";
  }

  const absolute = path.resolve(ROOT, "." + clean);

  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) {
    return null;
  }

  return absolute;
}

function sendSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
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

  let filePath = resolveStaticPath(url.pathname);

  if (!filePath) {
    sendSecurityHeaders(res);
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let statusCode = 200;

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
  const contentType = MIME[ext] || "application/octet-stream";

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