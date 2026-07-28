# CompTIA SecAI+ Training Project

Independent engineering record documenting the development and validation of a personal SecAI+ CY0-001 training and assessment system.

## Purpose

This repository records design decisions, implementation details, validation methods, and independently authored training content. It is published as an engineering note and project history, not as an official study guide, commercial training product, or vendor-affiliated resource.

## Current state

- `practice-test/` contains the static browser application used during validation.
- `practice-test/questions.js` is the active 60-question Diagnostic v2 bank loaded by `practice-test/index.html`.
- `test-banks/secai-plus-minimal-independent-bank-v1.js` is the alternate 60-question independent bank.
- Both real banks use the compact row authoring format documented in `practice-test/README.md`.
- `test-banks/` also contains deterministic application fixtures used for engine validation.

## Legal notice

Copyright © 2026 novovictus. All rights reserved.

This repository does not include vendor-supplied exam questions, exam-objective documents, logos, or other restricted training material. The included questions and supporting content are independently authored working material and are subject to continuing technical review.

CompTIA and SecAI+ are trademarks of CompTIA, Inc. This project is independent and is not affiliated with, sponsored by, or endorsed by CompTIA.

No license is granted to copy, modify, redistribute, publish, or commercially use the contents of this repository except as otherwise permitted by law or by written authorization from the copyright holder.

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
│   └── questions.js
└── test-banks/
    ├── README.md
    ├── secai-plus-minimal-independent-bank-v1.js
    ├── test-bank-42.js
    └── sample-bank-100.js
```
