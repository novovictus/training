# Run the practice test locally

The practice test is a static browser application. It requires no build process, backend, package manager, or web server.

## Validated browser

Google Chrome is the validated browser.

Direct `file://` operation and local-storage persistence have been tested only in Chrome. Edge, Firefox, Safari, and other browsers are currently unverified. Export progress before changing browsers, browser profiles, or the application directory.

## Required files

Keep these four files together:

```text
index.html
styles.css
app.js
questions.js
```

Open `index.html` in Chrome.

## Active bank

`questions.js` is the active bank. It may be replaced with another compatible file using the same filename and schema.

The current active bank is:

```text
bankId: secai-plus-cy0-001-legacy-draft-40
bankVersion: 1.0.0
questions: 40
```

It contains the unchanged project-authored Q021-Q060 extension items from the original mixed bank. It is retained for application testing and content review and is not considered a valid final diagnostic. See `../QUESTION-BANK-REBUILD.md`.

## Portable bank schema

```javascript
window.SECAI_QUESTION_BANK = {
  schemaVersion: 1,
  bankId: "unique-bank-id",
  bankVersion: "1.0.0",
  title: "Human-readable title",
  questions: [
    {
      id: "Q001",
      number: 1,
      domain: "1",
      target: "Target text",
      stem: "Question text",
      options: {
        A: "Option A",
        B: "Option B",
        C: "Option C",
        D: "Option D"
      },
      answer: "A"
    }
  ]
};
```

The application validates bank metadata, unique question IDs, question numbers, stems, domains, targets, exactly four non-empty options, and an answer key of A-D.

Use a new `bankId` for a logically different bank. Increment `bankVersion` whenever content or mappings change within the same bank.

## State safety

Progress is associated with `bankId` and `bankVersion`. A different loaded bank triggers a blocking warning and requires an explicit reset. Incompatible progress imports are rejected.

The application stores settings, mastery, attempts, and active-run state in browser local storage. Export progress before significant changes.

## Practice behavior

The application supports randomized question order, randomized displayed answer order, configurable run size and timer, confidence ratings, flags, resume, review, mastery, history, export, and import.

Runs are capped at the loaded bank size. The current 40-question legacy draft therefore cannot produce a run larger than 40.

## Deterministic fixtures

Public regression fixtures:

```text
../test-banks/test-bank-42.js
../test-banks/sample-bank-100.js
```

Restricted supplied content is stored separately under `../test-banks/private/` and must not be included in external packages.

## Swap workflow

From the repository root:

```powershell
Copy-Item .\practice-test\questions.js .\practice-test\questions.active.js -Force
Copy-Item .\test-banks\test-bank-42.js .\practice-test\questions.js -Force
```

Restore:

```powershell
Copy-Item .\practice-test\questions.active.js .\practice-test\questions.js -Force
Remove-Item .\practice-test\questions.active.js
```

Reload `index.html` after each swap. A bank mismatch warning is expected when identities differ.
