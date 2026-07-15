# Question-bank fixtures

## Public deterministic fixtures

These files are safe deterministic fixtures for application validation. They are not certification practice content.

### `test-bank-42.js`

- bank ID `test-bank-42`
- 42 questions, Q001-Q042
- fixed stems and options
- canonical answers rotate A, B, C, D
- validates behavior below the normal 60-question run size

### `sample-bank-100.js`

- bank ID `sample-bank-100`
- 100 questions, Q001-Q100
- fixed stems and options
- canonical answers rotate A, B, C, D
- validates 60-question selection from a larger bank

Both fixtures exercise schema validation, randomized question and displayed-answer order, scoring, flags, confidence, review, mastery, resume, export/import, mismatch detection, and reset behavior.

## Restricted private content

`private/` contains supplied third-party assessment content retained only for private reference and validation.

Do not include this directory in external packages:

```text
test-banks/private/
```

See `private/README.md` for the restriction.

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

Reload `practice-test/index.html` after each swap. A bank mismatch warning is expected when switching identities.

Before committing, restore the intended active bank, remove temporary backups, and inspect `git status`.
