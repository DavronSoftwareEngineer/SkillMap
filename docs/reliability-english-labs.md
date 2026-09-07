# Reliability and English practical labs

## Decisions

- Existing module IDs and storage keys remain unchanged. `english_worklabs` is additive and included in the version-1 backup allowlist. Old SkillMap/MyAcademy version-1 backups remain supported; unknown keys are ignored, malformed known values are rejected before writes.
- Backup restoration validates all recognized records first, persists a raw pre-import recovery snapshot under `skillmap_pre_import_recovery`, then writes. A failed write triggers rollback, including removal of newly created keys. This is best-effort rollback, not a database transaction: denied storage access or browser termination can prevent restoration. Never claim otherwise. Recovery snapshots contain personal data and must not be shared publicly.
- Imports notify mounted assessment/lab consumers and theme settings. Storage failures produce a persistent visible warning rather than silent success. Progress still lives locally, not in a cloud account.
- Failed course loads expose retry and full reload (the latter handles cached dynamic-import failures after a deploy). Empty courses are distinguished from failed downloads.
- Writing and speaking review remains human/self-review. No API key, LLM service, invented score, verified assessor identity, or certification is implied.

## Use

Open English → WriteLab / AudioLab / WorkLab → **Amaliy lab**.

- Writing: independent first draft, five 0–2 criteria with reasons, fact-check evidence, separate revision, reviewer notes, Markdown export. A self-review ready result requires 8/10+, technical accuracy 2/2, all reasons, draft, revision, and fact-check text. The app checks completeness, not truthfulness of the evidence.
- Speaking: current recording URL, previous attempt reference, self-review, comparison, assessor feedback, and AI/tutor disclosure. Recording files remain outside SkillMap; no microphone recorder or upload service has been implemented.
- Listening: three specific linked publisher lessons, original SkillMap comprehension prompts, self-check notes, and saved first-pass/transcript corrections. Audio/transcripts are played/read at their source; they are not copied or bundled for offline use. This starter catalog does not yet cover three verified accents or a full client-call library.
- WorkLab: six separately saved weekly scenarios (issue, update, PR review, ADR, outreach, mock interview).
- Autosave is local to the browser. Use the global backup for migration and Markdown export for feedback. Do not put client secrets in drafts or publicly accessible recording links.

## Source provenance

Publisher pages reviewed 2026-09-07:

- [British Council: A design presentation](https://learnenglish.britishcouncil.org/comment/204958), B2.
- [British Council: A project management meeting](https://learnenglish.britishcouncil.org/comment/135187), C1 stretch lesson.
- [VOA: Teamwork Works Best With a Team](https://learningenglish.voanews.com/a/lets-learn-english-lesson-41-teamwork/3635015.html), beginner American English course.

No redistribution license is assumed. Publisher pages include original audio/video and transcript. Practice-time estimates are not audio duration measurements. Accent is left unverified when the source does not identify it.

## Verification and remaining work

Run `npm test`, `npm run build`, and `npm run test:e2e`. Tests cover invalid backup rejection, quota-failure rollback, mounted lab restore, writing gate, separate weekly records, local persistence, browser download, storage-error visibility, and failed-course recovery.

System Design and Founder content now load on demand. Compare production bundle reports against the pre-change main JS baseline of 502.55 KB (165.38 KB gzip). Bundle size does not establish real network latency or render performance. Real-device network measurements and Netlify smoke tests remain separate deployment checks.

Future work: verified multi-accent collection, optional consent-based local recorder, cross-tab conflict resolution, large drafts in IndexedDB, and authenticated independent assessor workflows if this becomes a multi-user academy.

### Local verification result (2026-09-07)

- Unit/content/component checks: 19 files, 144 tests passed.
- Chromium E2E: 7 tests passed (three navigation checks and four reliability/lab flows).
- TypeScript + production build: passed. Main JS 404.50 KB, gzip 132.71 KB, versus baseline 502.55/165.38 KB. This is a bundle-size comparison only, not a page-speed benchmark.
- Mobile 390px viewport checked for horizontal overflow; screenshot visually inspected.
- A new mounted-assessment test exposed deferred use of React `event.currentTarget` inside state updaters. Reviewer, notes and checkbox handlers now capture values synchronously before updating state.
- No commit, push, Netlify deployment, or live microphone recording test was performed.
