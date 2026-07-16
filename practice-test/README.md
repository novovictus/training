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

Open `index.html` in Chrome. The page loads `questions.js`, then `app.js`.

## Active bank

`questions.js` is the active 60-question Diagnostic v2 bank.

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

Domain allocation is 10/24/14/12 for Domains 1 through 4.

The alternate independent bank is stored at `../test-banks/secai-plus-minimal-independent-bank-v1.js`.

## Canonical authoring format

Real question banks use a compact row format because it is easier to scan and compare manually:

```javascript
const rows = [
  [
    "1",
    "Target text",
    "Question stem",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "A"
  ]
];

window.SECAI_QUESTION_BANK = {
  schemaVersion: 1,
  bankId: "unique-bank-id",
  bankVersion: "1.0.0",
  title: "Human-readable title",
  questions: rows.map((r, i) => ({
    id: `Q${String(i + 1).padStart(3, "0")}`,
    number: i + 1,
    domain: r[0],
    target: r[1],
    stem: r[2],
    options: { A: r[3], B: r[4], C: r[5], D: r[6] },
    answer: r[7]
  }))
};
```

The compact rows are only an authoring representation. The `rows.map(...)` block produces the same runtime question objects as the previous longhand format, so the engine receives the same schema either way.

Row positions are fixed:

| Index | Meaning |
|---:|---|
| 0 | domain |
| 1 | target |
| 2 | stem |
| 3 | option A |
| 4 | option B |
| 5 | option C |
| 6 | option D |
| 7 | canonical answer |

Because IDs and question numbers are generated from row position, inserting, deleting, or reordering rows changes later IDs. Treat those operations as a bank revision and increment `bankVersion` before reuse with stored progress.

## Runtime schema validation

The application validates metadata, unique question IDs, positive question numbers, stems, domains, targets, exactly four non-empty options, and one answer key from A through D.

Validate stems, distractors, answer keys, targets, and mappings during use and revise under zero-trust review.

## State safety

Progress is associated with `bankId` and `bankVersion`. Loading a different bank triggers a blocking mismatch warning. Export existing progress if needed, then reset local progress for the newly loaded bank.

The application stores settings, mastery, attempts, and active-run state in browser local storage.

## Practice behavior

The application supports randomized question and displayed-answer order, configurable run size and timer, confidence ratings, flags, per-question free-form notes, resume, review, mastery, history, export, and import.

## Per-question notes

Each active question includes one optional multiline `Notes` field.

- Notes belong to the specific run response, not to the base question bank.
- Notes autosave into the active run through the same local-storage state used for answers, flags, and confidence.
- Notes are restored when moving between questions.
- Notes are restored after reloading the page and resuming an interrupted run.
- Notes do not affect scoring, mastery, answer randomization, question randomization, confidence, or flag behavior.

Older saved state without note fields remains compatible. Missing or invalid note values are treated as empty strings when a run is restored.

## Run export

Completed runs can be exported manually from the results view with `Export run`.

- Export is manual. Submitting a run does not automatically download a file.
- The exported filename uses the active bank ID plus a local timestamp, for example:

```text
secai-plus-cy0-001-v2_run_2026-07-15_214327.json
```

- The exported record includes the active bank identity and base-bank question count.
- The exported record includes run metadata, run summary totals, per-domain statistics, and one record for every presented question.
- Per-question export data includes the question identifiers and content shown to the engine, canonical answers, displayed option order, selected answer, correctness, confidence, flag state, and the free-form note.
- Unanswered questions are still exported.
- Displayed option order is preserved exactly from the completed run so the export can reconstruct what the user saw.

## Run export versus progress export

`Export run` writes one completed run as a self-contained record.

`Export progress` still writes the full application state, including settings, mastery, history, active-run state, and any active or completed notes. `Import progress` continues to accept older exports that do not contain note fields.

Canonical-answer imbalance must be corrected through content review, not cosmetic letter rotation. Displayed choices are randomized during each run.

## Fixtures

Public regression fixtures are stored in `../test-banks/`. Restricted supplied content is under `../test-banks/private/` and must not be included in external packages.
