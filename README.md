# CompTIA SecAI+ Training Project

Independent record documenting the development and validation of a personal SecAI+ CY0-001 training and assessment system.

## Purpose

This repository records design decisions, implementation details, validation methods, and independently authored training content. It is published as an engineering note and project history, not as an official study guide, commercial training product, or vendor-affiliated resource.

## Current state

- The practice test is deployed as a GitHub Pages project site.
- `https://ninja-neer.net/training/` is the canonical user entry point and redirects to the practice-test application.
- `https://ninja-neer.net/training/practice-test/` is the direct application URL.
- `practice-test/` contains the static browser application used during validation.
- `practice-test/questions.js` is the shipped default bank payload and currently mirrors the canonical comprehensive bank.
- `test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js` is the default comprehensive bank.
- `test-banks/secai-plus-cy0-001-terminology-drill-bank-v1.js` is the terminology-focused drill bank.
- `test-banks/secai-plus-cy0-001-diagnostic-v2.js` preserves the prior Diagnostic v2 bank.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the independent validation bank.
- `test-banks/` also contains deterministic application fixtures used for engine validation.

## Legal notice

Copyright © 2026 novovictus. All rights reserved.

The included questions and supporting content are independently authored working material and are subject to continuing technical review.

CompTIA and SecAI+ are trademarks of CompTIA, Inc. This project is independent and is not affiliated with, sponsored by, or endorsed by CompTIA.

No license is granted to copy, modify, redistribute, publish, or commercially use the contents of this repository except as otherwise permitted by law or by written authorization from the copyright holder.

## Application

For normal use, open:

```text
https://ninja-neer.net/training/
```

The repository root redirects to:

```text
https://ninja-neer.net/training/practice-test/
```

The application is a static GitHub Pages project site. The custom domain on the `novovictus.github.io` user site is inherited by the `novovictus/training` project site, so no separate DNS record is required for the `/training/` path.

Google Chrome remains the primary validated browser. Firefox has also been used successfully as a deployment smoke test. HTTPS is the supported normal-use environment. Local development should use an HTTP localhost server. Direct `file://` launch is retained only as an unreliable compatibility path and should not be used as the authoritative persistent environment.

The application supports randomized question and displayed-answer order, configurable runs, exam and immediate-feedback practice modes, timers, flags, confidence ratings, per-question notes, resume, explicit active-run abandonment, review, mastery, history, dual-format completed-run export, progress export/import, and bank identity mismatch protection.

Exam mode withholds correctness until final submission. Practice mode requires each answer to be submitted, locks it, and immediately shows whether it was correct before navigation continues. Completed-run exports identify the selected mode.

`Quit run` abandons only the current active attempt after confirmation. It discards that run's answers, flags, confidence ratings, notes, and elapsed progress while preserving completed history, mastery, settings, selected bank, and selected run mode.

Bank loading currently lives in `practice-test/index.html`; `practice-test/app.js` validates and consumes the resulting `window.SECAI_QUESTION_BANK` bank. The shipped bundled source is `practice-test/questions.js`. A valid outside `.js` or `.json` bank can be opened through the Customize dialog.

Browser local storage is automatic working state, not a durable backup. `Export progress` is the portable recovery record, and `Import progress` is the supported way to restore state or move it between browser origins, profiles, or environments. The GitHub Pages migration was validated by loading the terminology bank, importing existing local progress, closing and reopening the hosted application, and confirming that state remained preserved.

See `practice-test/README.md` for operation, compact row authoring, runtime schema, state-safety details, and local-development guidance.

## Default bank

`practice-test/questions.js` currently mirrors the comprehensive bank:

```text
bankId: secai-plus-cy0-001-comprehensive-v1
bankVersion: 1.0.0
questions: 168
```

The named source of record is `test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js`.

## Additional banks

- `test-banks/secai-plus-cy0-001-terminology-drill-bank-v1.js`: terminology-focused drill bank, 195 questions.
- `test-banks/secai-plus-cy0-001-diagnostic-v2.js`: archived prior Diagnostic v2 bank, 60 questions.
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
