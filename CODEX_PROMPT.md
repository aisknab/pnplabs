# Codex prompt for PNP Labs website continuation

You are editing the static website for PNP Labs at `https://pnplabs.com.au/`.

Maintain a professional, audience-facing tone for complexity theorists, proof engineers, institutional reviewers, and security auditors. Do not include owner-facing notes such as “the site should,” “replace this later,” or deployment instructions inside public HTML copy.

Core positioning:

- The site is a public reading layer for a machine-checkable finite-certificate proof-report claim for P = NP.
- The claim boundary must remain visible: `CheckPCCPackexp(GeneratePCCPack()) = accept ⇒ P = NP`.
- The generator is not the trust anchor; the checked package, acceptance run, replay, final certificate, release gate, release audit, and proof report are the reviewed objects.
- The tone should be confident, restrained, precise, and verification-first. Avoid hype and avoid implying independent community acceptance unless such evidence is added.

Preserve and update these facts when the canonical report changes:

- source/checker tag and commit;
- sealed artefact tag;
- artefact bundle path;
- manifest and checksum paths;
- validation test count and accepted fields;
- verification commands;
- proof-report downloads.

When changing copy, run a text scan for phrases that sound like internal instructions, including: `should`, `replace`, `when publishing`, `placeholder`, `ready for deployment`, `copywriter`, and `for you`. Public pages should read as final website content, not as implementation notes.

Keep the site static, accessible, fast, and dependency-free. Preserve working internal links and the downloadable report files.
