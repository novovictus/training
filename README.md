# CompTIA SecAI+ Training Project

## Purpose

This private repository is the working source of truth for preparation for the CompTIA SecAI+ CY0-001 certification exam.

The project treats preparation as an engineering and validation effort. Official source material, question banks, the static browser application, deterministic fixtures, known defects, and implementation decisions are preserved in version control.

## Current repository state

```text
.
├── CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf
├── SecAI+ Practice Test V1.docx
├── README.md
├── QUESTION-BANK-REBUILD.md
├── secai-plus-initial-diagnostic.md
├── secai-plus-question-bank-v1.md
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
        ├── README.md
        └── comptia-sample-20.js
```

## Active application bank

`practice-test/questions.js` is the active bank loaded by the browser application.

The current active bank is a 40-question legacy draft containing only the unchanged project-authored Q021-Q060 extension items from the original mixed bank:

```text
bankId: secai-plus-cy0-001-legacy-draft-40
bankVersion: 1.0.0
```

It is retained for application testing and content review. It is not considered a valid final diagnostic bank.

The 20 questions from the supplied CompTIA practice-test document were removed from the active bank and isolated under:

```text
test-banks/private/comptia-sample-20.js
```

That private directory must not be included in external packages or releases.

## Known bank defects

The current legacy draft has a severely imbalanced canonical answer distribution and no recorded independent item review. The original 60-question mixed bank also used domain weighting that did not match the CY0-001 blueprint.

Do not cosmetically rebalance the old questions. The requirements for a replacement diagnostic are recorded in `QUESTION-BANK-REBUILD.md`.

## Static practice-test application

The application in `practice-test/` requires no build process, backend, package manager, or web server.

Google Chrome is the validated browser. Direct `file://` operation and local-storage persistence have been tested only in Chrome. Other browsers are unverified.

The application supports:

- portable structured question banks
- randomized question and displayed-answer order
- configurable run size and timer
- flags and confidence ratings
- resume and navigation
- delayed scoring and review
- mastery and attempt history
- progress export/import
- bank identity and version mismatch protection

See `practice-test/README.md` for operation and schema details.

## Fixture banks

Public deterministic fixtures:

- `test-banks/test-bank-42.js`
- `test-banks/sample-bank-100.js`

Restricted supplied content:

- `test-banks/private/comptia-sample-20.js`

The private directory is not part of any external validation package.

## Preparation method

1. Treat the official CompTIA objectives as the authoritative specification.
2. Decompose each objective into explicit testable targets.
3. Use supplied sample material only as private style/reference input.
4. Build project-authored diagnostic banks aligned to the official blueprint.
5. Independently review every item, distractor, answer key, target, and domain mapping.
6. Use results to distinguish knowledge, taxonomy, exam-judgment, and question-quality gaps.
7. Verify unstable, regulatory, legal, framework-specific, and version-sensitive claims against primary sources.

## Resume point

The application architecture and bank-swap workflow are functional. The supplied sample has been isolated from the active bank, and the remaining 40-question legacy draft is explicitly marked as unvalidated.

The next content task is to build and independently review a new 60-question diagnostic aligned to the CY0-001 domain weights. The remaining application task is to replace silent eligible-pool shortening with an explicit confirmation before starting a shorter run.
