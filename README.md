# CompTIA SecAI+ Training Project

Private working repository for CompTIA SecAI+ CY0-001 preparation and practice-engine validation.

## Current state

- `practice-test/` contains the static browser application.
- `practice-test/questions.js` contains the unchanged 40-question legacy base.
- `practice-test/questions-v2.js` adds 20 questions and activates the 60-question v2 diagnostic.
- `test-banks/` contains deterministic application fixtures and a restricted private sample bank.

The supplied CompTIA practice questions are isolated under `test-banks/private/` and must not be included in external packages.

## Application

Open `practice-test/index.html` in Google Chrome. Chrome is the only validated browser. Direct `file://` operation and local-storage persistence in other browsers are unverified.

The application supports randomized question and displayed-answer order, configurable runs, timers, flags, confidence ratings, resume, review, mastery, history, export/import, and bank identity mismatch protection.

See `practice-test/README.md` for operation and schema details.

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

The v2 bank preserves all 40 legacy questions and adds 20 targeted coverage questions. It is a working self-validation bank. Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

The inherited canonical-answer imbalance remains. Displayed choices are randomized, but suspicious or weak items should be corrected based on content quality rather than rotating letters cosmetically.

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
│   ├── questions.js
│   └── questions-v2.js
└── test-banks/
    ├── README.md
    ├── test-bank-42.js
    ├── sample-bank-100.js
    └── private/
        └── comptia-sample-20.js
```