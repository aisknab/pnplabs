// Purpose: define the exact static website surface and response policy once.
// Inputs: normalized URL paths beginning with "/".
// Outputs: public-path inventories, redirect targets, security headers, and cache policy.
// Invariants enforced: only explicitly listed roots/directories are public; current evidence is not cached.
// Assumptions not checked: reverse-proxy configuration and theorem correctness.

const PUBLIC_ROOT_PATHS = Object.freeze([
  "404.html",
  "architecture.html",
  "CNAME",
  "faq.html",
  "index.html",
  "paper.html",
  "review.html",
  "robots.txt",
  "security.txt",
  "sitemap.xml",
  "status.html",
  "updates.html",
  "updates.xml",
  "verification-runs.html",
  "verifier-run-digests.html",
  "verify.html"
]);

const PUBLIC_EXACT_PATHS = Object.freeze([
  ".well-known/security.txt"
]);

const PUBLIC_DIRECTORY_PATHS = Object.freeze([
  "assets",
  "downloads",
  "public"
]);

const EXTENSIONLESS_REDIRECTS = Object.freeze({
  "/paper": "/paper.html",
  "/report": "/paper.html",
  "/status": "/status.html",
  "/updates": "/updates.html",
  "/verify": "/verify.html"
});

const SECURITY_HEADERS = Object.freeze({
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'sha256-xYFFM6WE1nrMju6f+uvjLsSC4rb22e5i+9hWRaG8wk8='; script-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
});

function cacheControlForPath(urlPath) {
  // Public filenames are stable rather than content-addressed. Every response
  // must revalidate so a successful deployment cannot leave clients on a prior
  // CSS, JavaScript, image, document, or status payload for a year.
  return "no-cache";
}

export {
  EXTENSIONLESS_REDIRECTS,
  PUBLIC_DIRECTORY_PATHS,
  PUBLIC_EXACT_PATHS,
  PUBLIC_ROOT_PATHS,
  SECURITY_HEADERS,
  cacheControlForPath
};
