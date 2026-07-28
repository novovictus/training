# CompTIA SecAI+ Training Project

Independent working repository for CompTIA SecAI+ CY0-001 preparation and practice-engine validation.

## Current state

- `practice-test/` contains the static browser application.
- `practice-test/questions.js` is the active 60-question Diagnostic v2 bank loaded by `practice-test/index.html`.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the alternate 60-question independent bank.
- Both real banks use the compact row authoring format documented in `practice-test/README.md`.
- `test-banks/` also contains deterministic application fixtures used for engine validation.

This repository does not include vendor-supplied exam questions, exam-objective documents, or other restricted training material. CompTIA and SecAI+ are trademarks of CompTIA, Inc. This project is independent and is not affiliated with or endorsed by CompTIA.

## Application

Open `practice-test/index.html` in Google Chrome. Chrome is the only validated browser. Direct `file://` operation and local-storage persistence in other browsers are unverified.

The application supports randomized question and displayed-answer order, configurable runs, exam and immediate-feedback practice modes, timers, flags, confidence ratings, per-question notes, resume, review, mastery, history, dual-format completed-run export, progress export/import, and bank identity mismatch protection.

Exam mode withholds correctness until final submission. Practice mode requires each answer to be submitted, locks it, and immediately shows whether it was correct before navigation continues. Completed-run exports identify the selected mode.

See `practice-test/README.md` for operation, compact row authoring, runtime schema, and state-safety details.

## Active bank

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

Domain allocation:

| Domain | Questions |
|---|---:|
| 1.0 Basic AI Concepts | 10 |
| 2.0 Securing AI Systems | 24 |
| 3.0 AI-assisted Security | 14 |
| 4.0 AI Governance, Risk, and Compliance | 12 |

## Alternate bank

```text
bankId: secai-plus-cy0-001-minimal-independent-v1
bankVersion: 1.0.0
questions: 60
```

Both banks are working self-validation content. Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

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
│   ├── answer-reveal.js
│   └── questions.js
└── test-banks/
    ├── README.md
    ├── secai-plus-minimal-independent-bank-v1.js
    ├── test-bank-42.js
    └── sample-bank-100.js
```
