# Deterministic question-bank fixtures

These files are test fixtures for the static practice-test application. They are not certification practice content.

## Files

- `test-bank-42.js`
  - 42 questions
  - stems `Test question 1` through `Test question 42`
  - options `Answer 1` through `Answer 4`
  - correct answers rotate `A`, `B`, `C`, `D`
- `sample-bank-100.js`
  - 100 questions
  - stems `Sample question 1` through `Sample question 100`
  - options `Answer 1` through `Answer 4`
  - correct answers rotate `A`, `B`, `C`, `D`

Both fixtures use the portable structured-bank format assigned to `window.SECAI_QUESTION_BANK`. The application must parse the bank metadata and its `questions` array.

## Swap a fixture into the application

Back up the production bank:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.production.js
```

Test the 42-question bank:

```powershell
Copy-Item .\test-banks\test-bank-42.js .\practice-test\questions.js -Force
```

Test the 100-question bank:

```powershell
Copy-Item .\test-banks\sample-bank-100.js .\practice-test\questions.js -Force
```

Restore the production bank:

```powershell
Move-Item .\practice-test\questions.production.js .\practice-test\questions.js -Force
```

Reload `practice-test\index.html` after each swap.

## State warning

Each bank has a distinct `bankId` and `bankVersion`. Progress, mastery, attempts, and active-run data created for one bank must not be silently reused with another bank. The application should detect a bank mismatch and require a progress reset before continuing.

## Intended validation

The fixtures exercise:

- initialization with fewer than 60 available questions
- initialization with more than 60 available questions
- question-count limits and clamping
- random selection from a larger bank
- randomized answer ordering
- displayed-answer mapping
- scoring across canonical answers A, B, C, and D
- review filtering and ordering
- mastery behavior
- progress export and import
- bank-change detection and reset handling
