# PNP Labs static website

This package is a complete static site for `https://pnplabs.com.au/`.

The site is written for external technical readers: complexity theorists, proof engineers, institutional reviewers, and security auditors. The public pages avoid owner-facing notes and foreground the theorem boundary, artefact seal, verification workflow, and review channels.

## Included pages

- `index.html` — primary landing page and proof-route overview.
- `paper.html` — reading guide for the canonical proof report.
- `architecture.html` — package-stack architecture and reviewer invariant.
- `verify.html` — artefact verification and regeneration protocol.
- `faq.html` — careful public and technical framing.
- `review.html` — review tracks, contact channels, and request template.
- `downloads/canonical_proof_report.pdf` — bundled canonical proof report.
- `downloads/canonical_proof_report.tex` — bundled TeX source.
- `assets/` — CSS, JavaScript, manifest, and PNG logo/icon assets.

## Deployment

There is no build step. Upload the contents of this directory to the web root so that `index.html` is served at `/`.

### GitHub Pages

```bash
git init
git add .
git commit -m "Launch PNP Labs site"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Then enable GitHub Pages from the repository root, or connect the repository to Cloudflare Pages, Netlify, or Vercel.

## Production checklist

1. Confirm the public repository URL or source repository access process for reviewers.
2. Confirm the current source tag, artefact tag, validation count, manifest path, and checksum ledger.
3. Decide whether the TeX source should remain publicly downloadable.
4. Add a privacy policy before adding analytics or third-party scripts.
5. Keep the review and security addresses monitored.

## Copy principle

The site uses verification-first language. It presents the proof-report claim clearly, names the checker boundary, avoids implying external consensus, and gives reviewers a direct path to inspect public artefacts or request source repository access.
