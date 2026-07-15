# Question-bank fixtures

## Public deterministic fixtures

These files are safe application fixtures, not certification practice content:

- `test-bank-42.js`: 42 questions, Q001-Q042, rotating canonical answers A-D. Validates behavior below the normal 60-question run size.
- `sample-bank-100.js`: 100 questions, Q001-Q100, rotating canonical answers A-D. Validates 60-question selection from a larger bank.

Both exercise schema validation, randomized question and displayed-answer order, scoring, flags, confidence, review, mastery, resume, export/import, mismatch detection, and reset behavior.

## Restricted private content

`private/comptia-sample-20.js` contains supplied third-party assessment content retained only for private reference and validation.

Do not include `test-banks/private/` in any external package, release, shared archive, or published repository export.

## Swap workflow

From the repository root:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.active.js -Force
Copy-Item .\test-banks\test-bank-42.js .\practice-test\questions.js -Force
```

Install the 100-question fixture:

```powershell
Copy-Item .\test-banks\sample-bank-100.js .\practice-test\questions.js -Force
```

Restore the active bank:

```powershell
Copy-Item .\practice-test\questions.active.js .\practice-test\questions.js -Force
Remove-Item .\practice-test\questions.active.js
```

Reload `practice-test/index.html` after each swap. A bank mismatch warning is expected when identities differ. Before committing, restore the intended active bank, remove temporary backups, and inspect `git status`.