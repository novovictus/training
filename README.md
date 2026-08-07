# CompTIA SecAI+ Training Project

Independent engineering record documenting the development and validation of a personal SecAI+ CY0-001 training and assessment system.

## Purpose

This repository records design decisions, implementation details, validation methods, and independently authored training content. It is published as an engineering note and project history, not as an official study guide, commercial training product, or vendor-affiliated resource.

## Current state

- `practice-test/` contains the static browser application used during validation.
- `practice-test/questions.js` is the shipped default bank payload and currently mirrors the canonical comprehensive bank.
- `test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js` is the canonical named comprehensive bank.
- `test-banks/secai-plus-cy0-001-terminology-drill-bank-v1.js` is the terminology-focused drill bank.
- `test-banks/secai-plus-cy0-001-diagnostic-v2.js` preserves the prior Diagnostic v2 bank.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the independent validation bank.
- Real banks use the compact row authoring format documented in `practice-test/README.md`.
- `test-banks/` also contains deterministic application fixtures used for engine validation.

## Legal notice

Copyright © 2026 novovictus. All rights reserved.

This repository does not include vendor-supplied exam questions, exam-objective documents, logos, or other restricted training material. The included questions and supporting content are independently authored working material and are subject to continuing technical review.

CompTIA and SecAI+ are trademarks of CompTIA, Inc. This project is independent and is not affiliated with, sponsored by, or endorsed by CompTIA.

No license is granted to copy, modify, redistribute, publish, or commercially use the contents of this repository except as otherwise permitted by law or by written authorization from the copyright holder.

## Application

Open `practice-test/index.html` in Google Chrome. Chrome is the only validated browser. Direct `file://` operation and local-storage persistence in other browsers are unverified.

The application supports randomized question and displayed-answer order, configurable runs, exam and immediate-feedback practice modes, timers, flags, confidence ratings, per-question notes, resume, explicit active-run abandonment, review, mastery, history, dual-format completed-run export, progress export/import, and bank identity mismatch protection.

Exam mode withholds correctness until final submission. Practice mode requires each answer to be submitted, locks it, and immediately shows whether it was correct before navigation continues. Completed-run exports identify the selected mode.

`Quit run` abandons only the current active attempt after confirmation. It discards that run's answers, flags, confidence ratings, notes, and elapsed progress while preserving completed history, mastery, settings, selected bank, and selected run mode.

Bank loading is currently wired in `practice-test/index.html`; `practice-test/app.js` validates and consumes the resulting `window.SECAI_QUESTION_BANK` payload. The shipped bundled source is `practice-test/questions.js`. A valid outside `.js` or `.json` bank can be opened through the Customize dialog. Automatic discovery of bank files in `test-banks/` is not implemented in this baseline.

See `practice-test/README.md` for operation, compact row authoring, runtime schema, and state-safety details.

## Default bank

`practice-test/questions.js` currently mirrors the canonical comprehensive bank:

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

Canonical-answer imbalance must be corrected through content review rather than cosmetic key rotation. Displayed answer choices are randomized during each run.

## Repository layout

```text
.
├── README.md
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
    ├── sample-bank-100.js
    └── private/
```
