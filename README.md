# CompTIA SecAI+ Training Project

Independent record documenting the development and validation of a personal SecAI+ CY0-001 training and assessment system.

## Purpose

This repository records design decisions, implementation details, validation methods, and independently authored training content. It is published as an engineering note and project history, not as an official study guide, commercial training product, or vendor-affiliated resource.

## Current state

- The practice test is deployed as a live GitHub Pages project site.
- `https://ninja-neer.net/training/` is the canonical public entry point and redirects to the practice-test application.
- `https://ninja-neer.net/training/practice-test/` is the direct application URL.
- `practice-test/` contains the static browser application used during validation and deployment.
- `practice-test/questions.js` is the shipped default bank payload and currently mirrors Diagnostic v2.
- `test-banks/secai-plus-cy0-001-diagnostic-v2.js` is the source-of-record Diagnostic v2 bank.
- `test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js` is the larger comprehensive bank.
- `test-banks/secai-plus-cy0-001-terminology-drill-bank-v1.js` is the terminology-focused drill bank.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the independent validation bank.
- `test-banks/` also contains deterministic application fixtures used for engine validation.

## Legal notice

Copyright © 2026 novovictus. All rights reserved.

The included questions and supporting content are independently authored working material and are subject to continuing technical review.

CompTIA and SecAI+ are trademarks of CompTIA, Inc. This project is independent and is not affiliated with, sponsored by, or endorsed by CompTIA.

No license is granted to copy, modify, redistribute, publish, or commercially use the contents of this repository except as otherwise permitted by law or by written authorization from the copyright holder.

## Live application

For normal use, open:

```text
https://ninja-neer.net/training/
```

The repository root redirects to:

```text
https://ninja-neer.net/training/practice-test/
```

The GitHub Pages deployment is the supported live instance intended for the online audience. No download, installation, account, backend, or package manager is required to use the hosted application.

The application is deployed as a GitHub Pages project site. The custom domain on the `novovictus.github.io` user site is inherited by the `novovictus/training` project site, so no separate DNS record is required for the `/training/` path.

Google Chrome remains the primary validated browser. Firefox has also been used successfully as a deployment smoke test.

HTTPS is the supported normal-use environment.

## Local development and validation

A local copy of the application can be used for development, modification, testing, and validation.

Clone the repository with Git:

```powershell
git clone https://github.com/novovictus/training.git
cd training
```

Alternatively, download the repository ZIP from GitHub, extract it, and open a terminal or PowerShell window in the extracted repository root.

The repository is entirely static. No build process, backend, package manager, or application installation is required.

From the repository root, start an ordinary local HTTP server. For example, with Python:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

The root `index.html` redirects to:

```text
http://localhost:8000/practice-test/
```

The local HTTP-hosted copy is intended for development and validation. It reproduces the HTTP/HTTPS execution model of the live GitHub Pages deployment without publishing local changes.

See `LOCAL-TESTING.md` for additional local-testing and browser-origin details.

## Direct file launch

The application consists of ordinary static files, so opening `practice-test/index.html` directly from an extracted repository may still run the application with a `file://` URL.

Direct filesystem execution is not the supported development or persistent-use workflow. The application displays a warning when launched through `file://` and points users to the hosted site for normal use or localhost for development and validation.

Browser behavior under `file://` can differ from HTTP/HTTPS, particularly for:

- local-storage origin handling
- programmatic downloads
- persistence when files or directories move
- behavior across browsers and browser profiles

Use the live GitHub Pages deployment for normal use and a localhost HTTP server for local development and validation.

## Application

The application supports randomized question and displayed-answer order, configurable runs, exam and immediate-feedback practice modes, timers, flags, confidence ratings, per-question notes, resume, explicit active-run abandonment, review, mastery, history, dual-format completed-run export, progress export/import, and bank identity isolation.

Exam mode withholds correctness until final submission. Practice mode requires each answer to be submitted, locks it, and immediately shows whether it was correct before navigation continues. Completed-run exports identify the selected mode.

`Quit run` abandons only the current active attempt after confirmation. It discards that run's answers, flags, confidence ratings, notes, and elapsed progress while preserving completed history, mastery, settings, selected bank, and selected run mode.

Bank loading currently lives in `practice-test/index.html`; `practice-test/app.js` validates and consumes the resulting `window.SECAI_QUESTION_BANK` bank. The shipped bundled source is `practice-test/questions.js`. A valid outside `.js` or `.json` bank can be opened through the Customize dialog.

Training state is stored directly by `app.js` under a canonical bank/version key:

```text
secai-plus-test-engine-v2:<bankId>:<bankVersion>
```

Legacy bank-ID-only and historical generic state are migrated only when their stored bank identity exactly matches the loaded bank. Legacy keys are retained during stabilization for rollback safety.

## Progress and portability

Browser local storage is automatic working state, not a durable backup.

`Export progress` creates the portable recovery record. `Import progress` is the supported way to restore state or move it between browser origins, browser profiles, or environments.

For example, these are separate browser-storage environments:

```text
file://...
http://localhost:8000
https://ninja-neer.net
```

Progress stored in one does not automatically appear in another.

The GitHub Pages migration was validated by loading the terminology bank, importing existing local progress into the hosted application, closing and reopening the hosted application, and confirming that state remained preserved. Firefox was also used successfully as an independent deployment smoke test.

See `practice-test/README.md` for operation, compact row authoring, runtime schema, state-safety details, and local-development guidance.

## Default bank

`practice-test/questions.js` currently mirrors Diagnostic v2:

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

The named source of record is `test-banks/secai-plus-cy0-001-diagnostic-v2.js`.

## Additional banks

- `test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js`: comprehensive bank, 168 questions.
- `test-banks/secai-plus-cy0-001-terminology-drill-bank-v1.js`: terminology-focused drill bank, 195 questions.
- `test-banks/secai-plus-minimal-independent-bank-v1.js`: independent validation bank, 60 questions.

All banks are working self-validation content. Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

Displayed answer choices are randomized during each run.

## Repository layout

```text
.
├── README.md
├── NEXT-STEPS.md
├── LOCAL-TESTING.md
├── index.html
├── practice-test/
│   ├── README.md
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── questions.js
└── test-banks/
    ├── README.md
    ├── secai-plus-cy0-001-comprehensive-bank-v1.js
    ├── secai-plus-cy0-001-terminology-drill-bank-v1.js
    ├── secai-plus-cy0-001-diagnostic-v2.js
    ├── secai-plus-minimal-independent-bank-v1.js
    ├── test-bank-42.js
    └── sample-bank-100.js
```
