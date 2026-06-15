# PNP Labs static website

This package is a complete static site for `https://pnplabs.com.au/`.

The site is written for public credibility across technical readers, institutional reviewers, media, and security auditors. The public pages foreground the release status, theorem boundary, artefact seal, verification workflow, and review channels without implying external community verification.

## Included pages

- `index.html` — primary landing page and argument-route overview.
- `paper.html` — review guide for the canonical report.
- `architecture.html` — package-stack architecture and reviewer invariant.
- `verify.html` — artefact verification and regeneration protocol.
- `faq.html` — current status and technical framing.
- `review.html` — review tracks, contact channels, and request template.
- `downloads/canonical_proof_report.pdf` — bundled canonical report.
- `downloads/canonical_proof_report.tex` — bundled TeX source.
- `downloads/release-seal.json` — site-level manifest for bundled public report files.
- `downloads/SHA256SUMS` — SHA-256 ledger for bundled public report files.
- `.well-known/security.txt` — security disclosure contact metadata.
- `assets/` — CSS, JavaScript, manifest, SVG logo, image, and icon assets.

The pages load `assets/styles.min.css`. Regenerate it from `assets/styles.css` after CSS edits:

```bash
npx clean-css-cli -o assets/styles.min.css assets/styles.css
```

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

Then enable GitHub Pages from the repository root, or connect the repository to Cloudflare Pages, Netlify, or Vercel. Public hosting should serve only the HTML pages, `assets/`, `downloads/`, `robots.txt`, `sitemap.xml`, `security.txt`, `.well-known/security.txt`, and `CNAME`.

## Production checklist

1. Confirm the public repository URL or source repository access process for reviewers.
2. Confirm the current source tag, artefact tag, validation count, manifest path, and checksum ledger.
3. Decide whether the TeX source should remain publicly downloadable.
4. Add a privacy policy before adding analytics or third-party scripts.
5. Keep the review and security addresses monitored.

## Copy principle

The site uses public-credibility language. It presents the claim clearly, states that external community verification has not yet been established, names the internal checker record, and gives reviewers a direct path to inspect public artefacts or request source repository access.
