# Question banks and fixtures

## Real SecAI+ banks

- `../practice-test/questions.js` is the shipped default bank payload and currently mirrors the canonical comprehensive bank.
- `secai-plus-cy0-001-comprehensive-bank-v1.js` is the canonical named comprehensive bank, 168 questions.
- `secai-plus-cy0-001-terminology-drill-bank-v1.js` is the terminology-focused drill bank, 195 questions.
- `secai-plus-cy0-001-diagnostic-v2.js` preserves the prior Diagnostic v2 bank, 60 questions.
- `secai-plus-minimal-independent-bank-v1.js` is the independent validation bank, 60 questions.

All real banks use the compact row authoring format documented in `../practice-test/README.md`. The row mapper produces the runtime object schema consumed by `app.js`.

Bank selection/loading is currently wired in `../practice-test/index.html`; `app.js` validates and consumes `window.SECAI_QUESTION_BANK`. Automatic discovery of newly introduced outside banks is not implemented in this baseline.

For direct testing of an outside or unregistered bank, back up the shipped default and copy the desired bank over `practice-test/questions.js`:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.active.js -Force
Copy-Item .\test-banks\secai-plus-minimal-independent-bank-v1.js .\practice-test\questions.js -Force
```

Restore the shipped default afterward:

```powershell
Copy-Item .\practice-test\questions.active.js .\practice-test\questions.js -Force
Remove-Item .\practice-test\questions.active.js
```

A bank mismatch warning is expected when identities differ.

## Public deterministic fixtures

These files are safe application fixtures, not certification practice content:

- `test-bank-42.js`: 42 questions, Q001-Q042, rotating canonical answers A-D. Validates behavior below the normal 60-question run size.
- `sample-bank-100.js`: 100 questions, Q001-Q100, rotating canonical answers A-D. Validates 60-question selection from a larger bank.

Both exercise schema validation, randomized question and displayed-answer order, exam mode, immediate-feedback practice mode, answer locking, scoring, flags, confidence, per-question notes, review, mastery, resume, dual-format completed-run export, progress export/import, mismatch detection, and reset behavior.

For practice-mode validation, confirm that submitting an answer locks it, shows immediate correctness feedback, persists through navigation and reload, and records `practice` in the completed run export. Existing saved attempts without mode metadata should continue as exam-mode attempts.

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

Restore the shipped default:

```powershell
Copy-Item .\practice-test\questions.active.js .\practice-test\questions.js -Force
Remove-Item .\practice-test\questions.active.js
```

Reload `practice-test/index.html` after each swap. Before committing, restore `questions.js`, remove temporary files, and inspect `git status`.
