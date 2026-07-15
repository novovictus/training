# CompTIA SecAI+ Training Project

Private working repository for CompTIA SecAI+ CY0-001 preparation and practice-engine validation.

## Current state

- `practice-test/` contains the static browser application.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the default 60-question bank loaded by `practice-test/index.html`.
- `practice-test/questions.js` is the alternate 60-question Diagnostic v2 bank.
- Both real banks use the compact row authoring format documented in `practice-test/README.md`.
- `test-banks/` also contains deterministic application fixtures and a restricted private sample bank.

The supplied CompTIA practice questions are isolated under `test-banks/private/` and must not be included in external packages.

## Application

Open `practice-test/index.html` in Google Chrome. Chrome is the only validated browser. Direct `file://` operation and local-storage persistence in other browsers are unverified.

The application supports randomized question and displayed-answer order, configurable runs, timers, flags, confidence ratings, resume, review, mastery, history, export/import, and bank identity mismatch protection.

See `practice-test/README.md` for operation, compact row authoring, runtime schema, and state-safety details.

## Default bank

```text
bankId: secai-plus-cy0-001-minimal-independent-v1
bankVersion: 1.0.0
questions: 60
```

## Alternate bank

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

The banks are working self-validation content. Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

Canonical-answer imbalance must be corrected through content review rather than cosmetic key rotation. Displayed answer choices are randomized during each run.

## Repository layout

```text
.
├── CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf
├── SecAI+ Practice Test V1.docx
├── README.md
├── practice-test/
│   ├── README.md
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── questions.js
└── test-banks/
    ├── README.md
    ├── secai-plus-minimal-independent-bank-v1.js
    ├── test-bank-42.js
    ├── sample-bank-100.js
    └── private/
        └── comptia-sample-20.js
```