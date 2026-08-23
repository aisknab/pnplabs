# Production Deployment Verification

This deployment layer answers one operational question: which exact PNPLabs commit and public
bytes are being served? It does not establish theorem correctness. The current mathematical
boundary remains the fail-closed boundary in `public/pnp-status.json` and the compiled Lean
inventory it identifies.

## Runtime provenance

The deployment command generates two files inside the staged release, after `npm test` and the
release-seal check pass:

- `/public/deployment-content-manifest.json` hashes every file in the static server's explicit
  public allowlist;
- `/public/deployment-provenance.json` identifies the PNPLabs commit/tree, the pinned `pnp`
  publication commit/tree, the release-manifest digest, deployment time and content-manifest
  digest.

Those files are intentionally ignored by Git. A commit cannot truthfully contain a runtime record
that names that same commit without creating a self-reference. The content manifest excludes both
runtime files, and the provenance record hashes the content manifest. Both records are unsigned;
they provide inspectable deployment identity, not independent attestation or mathematical evidence.

## Atomic home-server deployment

Create separate locked-down deployment and origin accounts, then install the reviewed script and
service unit:

```bash
sudo useradd --system --user-group --home-dir /var/cache/pnplabs-deploy --create-home --shell /usr/sbin/nologin pnplabs-deploy
sudo useradd --system --user-group --home-dir /nonexistent --no-create-home --shell /usr/sbin/nologin pnplabs-origin
sudo install -m 0755 deploy/deploy-pnp /usr/local/bin/deploy-pnp
sudo install -D -m 0755 deploy/pnplabs-origin-launcher /usr/local/libexec/pnplabs-origin-launcher
sudo install -m 0644 deploy/pnplabs-origin.service /etc/systemd/system/pnplabs-origin.service
sudo systemctl daemon-reload
sudo systemctl enable pnplabs-origin.service
```

For agent-triggered deployment on a deployment host, adapt the generic `pnplabs-operator` and
`pnplabs-host` principals in the reviewed narrow sudoers sample to site-local identities outside
the public repository. From a clean checkout, validate the adapted source first, stage it under an
ignored suffix, validate that copy, then activate it atomically:

```bash
/usr/sbin/visudo -cf deploy/pnplabs-deploy.sudoers
sudo install -o root -g root -m 0440 deploy/pnplabs-deploy.sudoers /etc/sudoers.d/pnplabs-deploy.pending
sudoedit /etc/sudoers.d/pnplabs-deploy.pending
sudo /usr/sbin/visudo -cf /etc/sudoers.d/pnplabs-deploy.pending
sudo mv /etc/sudoers.d/pnplabs-deploy.pending /etc/sudoers.d/pnplabs-deploy
sudo /usr/sbin/visudo -c
sudo -k
```

This one policy permits the adapted deployment operator to run only `/usr/bin/env -i` with one lowercase 40-hex
`PNPLABS_COMMIT` and the fixed root-owned `/usr/local/bin/deploy-pnp` path. It does not grant a
shell, arbitrary environment settings, `systemctl`, or general passwordless sudo. The `-n` flag
on the client command makes missing or drifted authorization fail immediately instead of prompting
for a password. Codex or another client may still enforce its own independent approval policy.
Installing the policy does not create a timer, hook, or merge-triggered deployment. An agent may
invoke it only after the intended commit is merged to `main`, every durable check is green, and an
exact clean checkout of that merge commit has passed verification.

To revoke the authorization without deleting its reviewed contents, move the policy outside the
included sudoers directory, validate the remaining configuration, and expire cached credentials:

```bash
sudo mv /etc/sudoers.d/pnplabs-deploy /root/pnplabs-deploy.sudoers.disabled
sudo /usr/sbin/visudo -c
sudo -k
```

The root-owned launcher resolves `current/server.mjs` before invoking Node. That makes the first
migration and rollback compatible with the prior release's symlink-sensitive entry-point check.
The service runs the allowlisting Node origin as `pnplabs-origin`, binds only
`127.0.0.1:3013`, treats `/srv/pnplabs` as read-only, and applies systemd filesystem, capability,
device and privilege restrictions. The repository URL, release paths, service name, account,
public origin and lock path are fixed in the deployment script rather than accepted from a
privileged caller.

The script accepts only an exact lowercase 40-hex commit equal to the fetched `origin/main`. It
holds an exclusive deployment lock; creates one staging directory writable only by
`pnplabs-deploy`; runs all cloned repository code as that unprivileged, non-service account;
generates and locally verifies provenance; atomically switches the `current` symlink; restarts the
origin; waits for bounded loopback readiness; and compares the complete live public surface with
the staged release. On success the staged tree becomes root-owned and non-writable. A failed
post-switch check restores the prior symlink and restarts the service; an incomplete rollback is
reported as a critical failure rather than suppressed.

Before the first run, complete the Nginx replacement in the next section, validate it with
`nginx -t`, and reload Nginx. The mandatory post-switch public audit exercises those routes and
headers; running the deploy before the proxy migration is expected to fail closed and roll back.

Run it after the intended PR is merged:

```bash
sudo -n /usr/bin/env -i PNPLABS_COMMIT=<exact-merged-main-commit> /usr/local/bin/deploy-pnp
```

`PNPLABS_COMMIT` is the only deployment input. The script always uses the public GitHub repository,
`/srv/pnplabs/releases`, `/srv/pnplabs/current`, `pnplabs-origin.service`, and
`https://pnplabs.com.au`. No GitHub write credential, webhook secret, or signing key is required.

The script deliberately does not delete older releases. Retention is a separate operator decision;
the previous release must remain available for rollback.

## Best-effort progress notification

The active phone-notification transport is a direct UnifiedPush request. Supply the complete
capability URL only through `UNIFIEDPUSH_ENDPOINT`; never place it in repository files, command
output, CI logs, or notification text. The sender preserves the configured URL exactly and posts a
URL-encoded body with only `title` and `message`. It sets
`Content-Type: application/x-www-form-urlencoded; charset=UTF-8`,
`Content-Encoding: aes128gcm`, and `Accept: application/json`.

After the exact PNPLabs merge has passed every release gate, inspect the message without delivery,
then invoke the notifier once with the capability supplied only to that process:

```bash
npm run notify:deployment-ready -- --commit <exact-merged-main-commit> --dry-run
UNIFIEDPUSH_ENDPOINT=... npm run notify:deployment-ready -- --commit <exact-merged-main-commit>
```

The notification derives the risk-weighted proof estimate, formal artefact coverage, and global
gate count from the canonical progress mirror. It reports those measures separately. Delivery uses
an approximately ten-second timeout and at most three total attempts, retrying network failures,
HTTP 429, and HTTP 5xx only. A missing or unavailable endpoint is reported without revealing the
destination and does not invalidate the verified release.

`npm run notify:test:live` is the separate explicit transport integration command. It sends one
real test message only when `UNIFIEDPUSH_ENDPOINT` is configured and is deliberately absent from
the normal test suite. Do not use it as a routine health check or retry it to diagnose client-side
display.

## Nginx boundary

Replace the existing PNPLabs `location` directives inside the TLS `server {}` block with
`deploy/nginx-pnplabs-locations.conf`; do not include it alongside another `location /`, because
that is an invalid duplicate Nginx location. Remove conflicting regex/static locations so the Node
origin remains the single public-file authority. The fragment proxies the complete request path to
the loopback origin and explicitly protects `/paper`, `/report`, `/status`, and `/verify` from a
broader rewrite rule. The origin returns exact 308 redirects to the canonical `.html` pages and
preserves the query string. Canonical links, navigation and `sitemap.xml` continue to use `.html`;
`/report` is only a convenience alias for `/paper.html`.

Do not configure an Nginx content cache for this origin. Public filenames are stable rather than
content-addressed, so the Node server returns `no-cache` for every public response, including CSS,
images, downloads, JSON, JavaScript and runtime provenance. If the surrounding TLS server injects
any of the same security headers, remove the duplicate so that each response has one exact policy
value.

After editing Nginx configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Read-only checks

Inside a staged or active release:

```bash
npm run deployment:check -- --site-commit <commit> --site-tree <tree>
npm run verify:production -- --base-url https://pnplabs.com.au
```

The production checker performs no writes. It verifies that the browser report console derives its
expected byte count and SHA-256 from the current release seal, with no copied digest in the HTML.
It also verifies the local release seal; deployment schema;
site and proof coordinates; exact bytes for the complete allowlisted surface and `/`; bounded
response sizes; content types; cache policy; security headers; exact extensionless redirects;
GET/HEAD/POST behavior; and representative forbidden, dotfile, source-file, encoded-traversal and
near-miss paths. It aggregates all drift findings so a stale or over-broad deployment is visible in
one run. A hash match in this output means byte identity only, not theorem correctness.

The `production-deployment-consistency` GitHub workflow runs the same live audit only when manually
dispatched. It is intentionally not a pull-request or scheduled required check: production is
expected to remain on the prior merged commit while a PR is under review, and a host deployment is
an operator action outside GitHub Actions.
