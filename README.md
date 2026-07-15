# CompTIA SecAI+ Training Project

## Purpose

This private repository is the working source of truth for preparation for the CompTIA SecAI+ CY0-001 certification exam.

The project is treated as an engineering and validation effort rather than a conventional study plan. Official source material, question banks, test-engine code, deterministic fixtures, results, decisions, and changes are preserved in version control.

The normal training target is 60 scored questions in 60 minutes. Smaller banks are supported for testing and targeted drills, and larger banks are sampled down to the configured run size.

## Candidate context

The candidate has more than 20 years of cybersecurity experience across operations, governance, risk, compliance, research, leadership, curriculum development, certification item development, and AI evaluation.

Relevant credentials include CompTIA A+, Network+, Project+, Server+, Linux+, Cloud+, and Security+; Microsoft MCSE: Security and MCITP credentials; EC-Council CHFI and CEH; ISC2 CISSP; Check Point CCSPA; and a Doctor of Science in Cybersecurity.

The preparation strategy therefore emphasizes AI-specific concepts, CompTIA terminology, best-answer judgment, and objective coverage rather than broad introductory cybersecurity review.

## Preparation method

1. Treat the official CompTIA objectives as the authoritative specification.
2. Decompose each objective into explicit testable targets.
3. Use the supplied CompTIA sample test to infer question grammar and framing.
4. Build full-length diagnostic runs that expose knowledge, taxonomy, and exam-judgment gaps.
5. Use AI to generate targeted follow-up drills, scenario variations, adversarial questions, and explanations.
6. Verify unstable, regulatory, legal, framework-specific, and version-sensitive claims against primary sources.
7. Preserve results, bank changes, and implementation decisions in the repository.

## Gap categories

Misses should be classified as one or more of:

- **Knowledge gap:** the underlying concept, control, framework, technology, or process is not sufficiently understood.
- **Taxonomy gap:** the concept is understood, but CompTIA's preferred terminology, category, or abstraction was not recognized.
- **Exam-judgment gap:** more than one option is technically defensible, but one is better based on sequence, priority, lifecycle phase, scope, or wording such as `best`, `first`, or `most appropriate`.
- **Question-quality concern:** the item, answer key, distractors, or mapping may be defective or ambiguous.

## Repository structure

```text
.
├── CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf
├── SecAI+ Practice Test V1.docx
├── README.md
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
    └── sample-bank-100.js
```

## Source and bank artifacts

- `CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf` is the authoritative objective source.
- `SecAI+ Practice Test V1.docx` is the supplied sample used to infer CompTIA question style.
- `secai-plus-initial-diagnostic.md` is the original human-oriented 60-question diagnostic.
- `secai-plus-question-bank-v1.md` preserves the initial Markdown-based canonical bank and parser contract.
- `practice-test/questions.js` is the active structured portable bank used by the browser application.
- `test-banks/` contains deterministic fixture banks for boundary and state testing.

The Markdown bank remains useful as a reviewable source artifact. The runnable application now consumes the structured bank object in `practice-test/questions.js`.

## Static practice-test application

The application in `practice-test/` is complete enough for local diagnostic use and requires no build process, backend, package manager, or web server.

Open:

```text
practice-test/index.html
```

Direct `file://` operation is supported.

The application provides:

- randomized question selection and question order
- randomized answer order with preserved answer mapping
- configurable question count and time limit
- optional inclusion of mastered questions
- confidence ratings
- question flags
- navigation and resume support
- delayed scoring until submission
- review of answered, flagged, and confidence-marked questions
- mastery tracking after three correct answers
- attempt history
- progress export and import
- portable bank validation
- bank identity and version mismatch protection

See `practice-test/README.md` for operating instructions and the bank schema.

## Portable question-bank architecture

The active bank file is always:

```text
practice-test/questions.js
```

It assigns a structured data object to `window.SECAI_QUESTION_BANK`. The file contains bank data, not application behavior.

Required bank-level fields are:

- `schemaVersion`
- `bankId`
- `bankVersion`
- `title`
- `questions`

Each question has a stable ID, number, domain, target, stem, four labeled options, and a canonical answer key.

A compatible bank can be installed by replacing `practice-test/questions.js` with another file that follows the same schema and filename convention. No application changes are required.

## Bank identity and state safety

Saved state and exported progress are associated with `bankId` and `bankVersion`.

When the loaded bank does not match stored progress, the application blocks normal startup and requires an explicit reset. It does not silently apply mastery, attempts, settings, or active-run data to a different bank.

When question content, answer keys, stable IDs, or mappings change within an existing bank, increment `bankVersion`. Reusing the same `bankId` and `bankVersion` for changed content can create undetected progress skew.

Use a new `bankId` for a logically different bank. Use a new `bankVersion` for a revised edition of the same bank.

## Deterministic fixture banks

Two fixture banks are available:

- `test-banks/test-bank-42.js`
  - 42 sequential questions
  - validates runs smaller than the normal 60-question target
  - confirms question-count clamping and lower-bound initialization
- `test-banks/sample-bank-100.js`
  - 100 sequential questions
  - validates random selection of a 60-question run from a larger bank

Both fixtures rotate canonical answers through A, B, C, and D and use obvious deterministic text so answer-order mapping, scoring, review, mastery, export/import, and bank-switch behavior can be checked without interpreting real content.

See `test-banks/README.md` for the swap and restore workflow.

## Current decisions

- The repository remains private during development and preparation.
- The default branch is `main`.
- The official objectives and supplied sample remain the primary source artifacts.
- Every objective area receives a litmus test regardless of expected mastery.
- The normal practice target remains 60 questions in 60 minutes.
- The application remains static and works through `file://`.
- Question banks remain separate from application logic and use a validated portable schema.
- Bank replacement uses the fixed `practice-test/questions.js` filename rather than a runtime import workflow.
- Progress is isolated by bank identity and version.
- Repository history serves as the engineering log and restart mechanism.
- Primary-source verification remains required for regulatory, legal, standards, and version-sensitive claims.

## Validation status

The portable-bank refactor has been tested with:

- the 60-question production bank
- a 42-question deterministic fixture
- a 100-question deterministic fixture
- real `file://` browser loads
- temporary question-bank file swaps
- legacy production-state migration
- bank mismatch and reset handling
- question-count clamping
- 60-question sampling from a larger bank
- randomized answer mapping
- scoring, flags, confidence, review, mastery, resume, export, and import behavior

Manual validation remains appropriate after any change to the application, schema, or production bank.

## Recommended diagnostic process

1. Complete the configured run without consulting the answer key.
2. Record confidence for each answered question.
3. Flag ambiguous or questionable items during the run.
4. Submit and review every incorrect answer.
5. Review correct answers with low confidence.
6. Classify misses as knowledge, taxonomy, exam judgment, or question-quality concerns.
7. Use the results to generate targeted follow-up work rather than defaulting to broad study.
8. Export progress before major bank or application changes.

## Resume point

The repository now contains the source artifacts, objective decomposition, initial diagnostic, preserved Markdown bank, static practice-test application, structured 60-question production bank, and deterministic 42- and 100-question fixture banks.

The next learning step is to run and analyze the production diagnostic. The next engineering step should be driven by observed defects or training needs rather than additional architecture work.

## Session log

### 2026-07-14 - Project initialization

- Created the private repository and established `main` as the default branch.
- Added the official CY0-001 objectives and supplied sample practice test.
- Decomposed the objectives into explicit testable targets.
- Created the initial 60-question diagnostic.
- Created the Markdown-based v1 question bank and parser contract.

### 2026-07-14 - Static practice engine

- Added the browser-based practice-test application.
- Added local progress, mastery, history, resume, export, and import behavior.
- Added randomized question and answer order.
- Corrected review filtering, displayed answer mapping, flagged review badges, and review-heading spacing.

### 2026-07-14 - Portable bank and fixture validation

- Converted the active production bank to the structured portable-bank schema.
- Added bank metadata validation and visible startup errors.
- Added bank identity and version handling to saved state and exports.
- Added legacy production-state migration.
- Added mismatch blocking and explicit reset behavior.
- Added deterministic 42-question and 100-question fixture banks.
- Validated production, lower-than-60, and greater-than-60 browser scenarios through direct local file loads.