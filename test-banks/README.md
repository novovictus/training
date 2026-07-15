# Question banks and fixtures

## Real SecAI+ banks

- `secai-plus-minimal-independent-bank-v1.js` is the default 60-question bank loaded by `practice-test/index.html`.
- `../practice-test/questions.js` is the alternate 60-question Diagnostic v2 bank.

Both use the compact row authoring format documented in `../practice-test/README.md`. The row mapper produces the runtime object schema consumed by `app.js`.

To load Diagnostic v2 instead, change the first script near the end of `practice-test/index.html` to:

```html
<script src="questions.js"></script>
```

To restore the default independent bank:

```html
<script src="../test-banks/secai-plus-minimal-independent-bank-v1.js"></script>
```

A bank mismatch warning is expected when identities differ.

## Public deterministic fixtures

These files are safe application fixtures, not certification practice content:

- `test-bank-42.js`: 42 questions, Q001-Q042, rotating canonical answers A-D. Validates behavior below the normal 60-question run size.
- `sample-bank-100.js`: 100 questions, Q001-Q100, rotating canonical answers A-D. Validates 60-question selection from a larger bank.

Both exercise schema validation, randomized question and displayed-answer order, scoring, flags, confidence, review, mastery, resume, export/import, mismatch detection, and reset behavior.

## Restricted private content

`private/comptia-sample-20.js` contains supplied third-party assessment content retained only for private reference and validation.

Do not include `test-banks/private/` in any external package, release, shared archive, or published repository export.

## Fixture swap workflow

From the repository root:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.active.js -Force
Copy-Item .\test-banks\test-bank-42.js .\practice-test\questions.js -Force
```

Install the 100-question fixture:

```powershell
Copy-Item .\test-banks\sample-bank-100.js .\practice-test\questions.js -Force
```

When using this file-copy workflow, `practice-test/index.html` must temporarily load `questions.js`. Restore the intended bank reference, restore `questions.js` if backed up, remove temporary files, reload the page, and inspect `git status` before committing.