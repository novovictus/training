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

Open `index.html` in Chrome. Bank loading is currently wired in `index.html`; `app.js` validates and consumes the resulting `window.SECAI_QUESTION_BANK` payload.

`questions.js` is the shipped default bank payload. It currently mirrors the canonical named comprehensive bank at `../test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js`.

A valid outside `.js` or `.json` bank can be opened through Customize > Open bank file. The selected custom bank is retained in browser local storage until `Use bundled bank` is selected. Automatic discovery of bank files under `../test-banks/` is not implemented in this baseline.

## Default bank

```text
bankId: secai-plus-cy0-001-comprehensive-v1
bankVersion: 1.0.0
questions: 168
```

The named source of record is `../test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js`.

Additional real banks are stored under `../test-banks/`:

- `secai-plus-cy0-001-terminology-drill-bank-v1.js`: terminology-focused drill bank, 195 questions.
- `secai-plus-cy0-001-diagnostic-v2.js`: archived prior Diagnostic v2 bank, 60 questions.
- `secai-plus-minimal-independent-bank-v1.js`: independent validation bank, 60 questions.

## Authoring format

Question banks use a compact row format because it is easier to scan and compare manually:

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

The application stores settings, mastery, attempts, active-run state, run mode, selected custom-bank data, and practice-mode answer-lock state in browser local storage.

`Quit run` abandons only the current active attempt after confirmation. It clears that attempt's answers, flags, confidence ratings, notes, timer state, and resume state. It does not remove completed attempts, mastery, settings, selected bank, or selected run mode.

## Run modes

The Customize dialog provides two run modes.

### Exam mode

- Questions can be answered and revisited freely.
- Answers remain editable until the full run is submitted.
- Correctness is withheld until the results view.
- Timer, review, scoring, mastery, resume, quit, and export behavior remain available.

### Practice mode

- Select an answer, or leave the question unanswered, then use `Submit answer`.
- The submitted answer becomes locked and cannot be changed.
- Correct or incorrect feedback appears immediately.
- A blank submitted response is shown as incorrect with `Your answer: Not answered`.
- The correct option is highlighted; an incorrectly selected option is highlighted separately.
- After feedback, the control changes to `Next`, or `Finish run` on the last question.
- Navigating back to a submitted question restores the locked answer and feedback.
- Locked state survives reload and resume.
- Scoring and mastery use the answer submitted before feedback was shown.
- `Quit run` discards the active practice attempt without recording it as completed.

The selected run mode is stored per bank and is copied into each new active attempt. Existing attempts without mode metadata are treated as exam-mode attempts.

## Practice behavior

The application supports randomized question and displayed-answer order, configurable run size and timer, confidence ratings, flags, per-question free-form notes, resume, explicit active-run abandonment, review, mastery, history, export, and import.

## Per-question notes

Each active question includes one optional multiline `Notes` field.

- Notes belong to the specific run response, not to the base question bank.
- Notes autosave into the active run through the same local-storage state used for answers, flags, and confidence.
- Notes are restored when moving between questions.
- Notes are restored after reloading the page and resuming an interrupted run.
- Quitting the active run discards its notes along with the rest of that active attempt.
- Notes do not affect scoring, mastery, answer randomization, question randomization, confidence, or flag behavior.

Older saved state without note fields remains compatible. Missing or invalid note values are treated as empty strings when a run is restored.

## Run export

Completed runs can be exported manually from the results view with `Export run`.

- Export is manual. Submitting a run does not automatically download files.
- Quitting a run does not create a completed run or an exportable run record.
- Each `Export run` click creates two files from the same completed run:
  - the existing machine-readable JSON run record
  - a complete human-readable plain-text report
- Both files share one local timestamp generated once per click.
- The JSON file remains the authoritative machine-readable run record.
- The text report contains a complete human-readable representation of the same run.
- Both formats include the active bank identity and base-bank question count.
- Both formats include run metadata, run summary totals, per-domain statistics, and one record for every presented question.
- The JSON run record includes `run.mode` with `exam` or `practice`.
- Per-question export data includes the question identifiers and content shown to the engine, canonical answers, displayed option order, selected answer, correctness, confidence, flag state, and the free-form note.
- Every presented question is included, including unanswered and unnoted questions.
- Displayed option order is preserved exactly from the completed run so the export can reconstruct what the user saw.
- In the text report only, `Note present: Yes` or `No` is derived from the trimmed note string. Each question also always includes a separate `Note:` field.

## Run export versus progress export

`Export run` writes one completed run as a self-contained record.

`Export progress` writes the full application state, including settings, mastery, history, active-run state, and any active or completed notes. `Import progress` continues to accept older exports that do not contain note fields or run-mode metadata.

Answer imbalance must be corrected through content review, not cosmetic letter rotation. Displayed choices are randomized during each run.

## Fixtures

Public regression fixtures are stored in `../test-banks/`. Restricted supplied content is under `../test-banks/private/` and must not be included in external packages.
