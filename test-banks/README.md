# Deterministic question-bank fixtures

These files are deterministic test fixtures for the static practice-test application. They are not certification practice content.

## Files

### `test-bank-42.js`

- bank ID: `test-bank-42`
- bank version: `1.0.0`
- 42 questions
- stable IDs `Q001` through `Q042`
- stems `Test question 1` through `Test question 42`
- options `Answer 1` through `Answer 4`
- targets `Test target 1` through `Test target 42`
- canonical answers rotate `A`, `B`, `C`, `D`

### `sample-bank-100.js`

- bank ID: `sample-bank-100`
- bank version: `1.0.0`
- 100 questions
- stable IDs `Q001` through `Q100`
- stems `Sample question 1` through `Sample question 100`
- options `Answer 1` through `Answer 4`
- targets `Sample target 1` through `Sample target 100`
- canonical answers rotate `A`, `B`, `C`, `D`

Both fixtures use the same structured portable-bank schema as the production bank and assign it to `window.SECAI_QUESTION_BANK`.

## Purpose

The fixtures exercise multiple initialization and state paths without requiring interpretation of real exam content.

The 42-question bank validates:

- startup with fewer than 60 available questions
- automatic question-count clamping
- customization limits below the normal run size
- a complete run containing every available question

The 100-question bank validates:

- startup with more than 60 available questions
- the normal default run size of 60
- random question selection from a larger source bank

Both banks validate:

- schema parsing and validation
- unique stable IDs
- randomized question order
- randomized answer order
- displayed-answer mapping
- scoring across canonical answers A, B, C, and D
- flags and confidence
- review filtering and ordering
- mastery behavior
- active-run resume
- progress export and import
- bank mismatch detection
- explicit reset behavior

## Swap a fixture into the application

Run these commands from the repository root.

Back up the production bank:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.production.js -Force
```

Install the 42-question fixture:

```powershell
Copy-Item .\test-banks\test-bank-42.js .\practice-test\questions.js -Force
```

Install the 100-question fixture:

```powershell
Copy-Item .\test-banks\sample-bank-100.js .\practice-test\questions.js -Force
```

Restore the production bank:

```powershell
Copy-Item .\practice-test\questions.production.js .\practice-test\questions.js -Force
Remove-Item .\practice-test\questions.production.js
```

Reload `practice-test\index.html` after every swap.

## Expected state behavior

Each fixture has a different `bankId` from the production bank and from the other fixture.

When switching banks with existing local progress:

1. The application should display a blocking mismatch warning.
2. It should identify that the loaded bank differs from the stored bank state.
3. It should not reuse mastery, attempts, settings, or an active run.
4. It should require an explicit reset before enabling the newly loaded bank.
5. After reset, the start screen should show the loaded bank title, version, and question count.

The warning is expected behavior, not a fixture failure.

## Versioning warning

Do not modify fixture question content while retaining the same `bankId` and `bankVersion` unless the test specifically requires simulated state skew.

For ordinary fixture revisions, increment `bankVersion`. The application compares bank identity and version, not a cryptographic content hash.

## Suggested validation sequence

1. Start with the production bank and create or retain production progress.
2. Back up `practice-test\questions.js`.
3. Install `test-bank-42.js`.
4. Confirm the mismatch warning appears.
5. Reset progress and confirm the bank reports 42 questions.
6. Confirm a run cannot exceed 42 questions.
7. Exercise answer shuffling, flags, confidence, review, and scoring.
8. Install `sample-bank-100.js`.
9. Confirm another mismatch warning appears.
10. Reset progress and confirm the bank reports 100 questions.
11. Confirm the default run contains 60 questions selected from the bank.
12. Exercise export and import with matching and mismatched bank identities.
13. Restore the production bank.
14. Confirm the production identity is shown and reset fixture state before normal use.

## Repository hygiene

Before committing application changes after fixture testing:

- restore the production `practice-test\questions.js`
- remove `practice-test\questions.production.js`
- confirm no fixture is left installed as the active bank
- inspect `git status`
- validate the active production bank before pushing