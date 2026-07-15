# Run the practice test locally

The practice test is a static browser application. It requires no build process, backend, package manager, or web server.

## Validated browser

Google Chrome is the validated browser. Direct `file://` operation and local-storage persistence have been tested only in Chrome. Export progress before changing browsers, browser profiles, or the application directory.

## Required files

Keep these files together:

```text
index.html
styles.css
app.js
questions.js
```

Open `index.html` in Chrome.

## Active bank

`questions.js` is the complete self-contained 60-question v2 bank.

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

Domain allocation is 10/24/14/12 for Domains 1 through 4.

## Bank schema

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
      options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
      answer: "A"
    }
  ]
};
```

The application validates metadata, unique question IDs, positive question numbers, stems, domains, targets, exactly four non-empty options, and one answer key from A through D.

Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

## State safety

Progress is associated with `bankId` and `bankVersion`. Loading v2 after the legacy bank triggers a blocking mismatch warning. Export old progress if needed, then reset local progress for the v2 bank.

The application stores settings, mastery, attempts, and active-run state in browser local storage.

## Practice behavior

The application supports randomized question and displayed-answer order, configurable run size and timer, confidence ratings, flags, resume, review, mastery, history, export, and import.

The inherited canonical-answer imbalance remains. Displayed choices are randomized, but suspicious or weak items should be corrected based on content quality rather than rotating letters cosmetically.

## Fixtures

Public regression fixtures are stored in `../test-banks/`. Restricted supplied content is under `../test-banks/private/` and must not be included in external packages.
