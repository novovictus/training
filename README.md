# CompTIA SecAI+ Training Project

Private working repository for CompTIA SecAI+ CY0-001 preparation, question-bank development, and practice-engine validation.

## Current state

- `practice-test/` contains the static browser application.
- `practice-test/questions.js` is the active bank.
- The active bank is a 40-question unvalidated legacy draft retained for application testing and content review.
- `QUESTION-BANK-REBUILD.md` records the known defects and replacement-bank requirements.
- `test-banks/` contains deterministic application fixtures and a restricted private sample bank.

The supplied CompTIA practice questions are isolated under `test-banks/private/` and must not be included in external packages.

## Application

Open `practice-test/index.html` in Google Chrome. Chrome is the only validated browser. Direct `file://` operation and local-storage persistence in other browsers are unverified.

The application supports portable question banks, randomized question and displayed-answer order, configurable runs, timers, flags, confidence ratings, resume, review, mastery, history, export/import, and bank identity mismatch protection.

See `practice-test/README.md` for operation and schema details.

## Bank status

The current active bank uses:

```text
bankId: secai-plus-cy0-001-legacy-draft-40
bankVersion: 1.0.0
questions: 40
```

It is not a valid final diagnostic. Do not cosmetically repair its answer distribution. Build and independently review a replacement bank aligned to the CY0-001 blueprint.

## Repository layout

```text
.
├── CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf
├── SecAI+ Practice Test V1.docx
├── README.md
├── QUESTION-BANK-REBUILD.md
├── practice-test/
│   ├── README.md
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── questions.js
└── test-banks/
    ├── README.md
    ├── test-bank-42.js
    ├── sample-bank-100.js
    └── private/
        └── comptia-sample-20.js
```

## Next task

Create a new 60-question, project-authored diagnostic with documented blueprint weighting and independent review of every stem, distractor set, answer key, target, and domain mapping.