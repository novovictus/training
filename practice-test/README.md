# Run the practice test locally

The practice test is a static browser application. It requires no Python, Node.js, package installation, build process, backend, or web server. Opening `practice-test\index.html` directly through `file://` is supported.

## Required files

Keep these four files together:

```text
index.html
styles.css
app.js
questions.js
```

`questions.js` is the active question bank. The other three files are the application.

## Download only the runnable files

Run this command from the directory where the files should be saved:

```powershell
curl.exe -O "https://raw.githubusercontent.com/novovictus/training/main/practice-test/{index.html,styles.css,questions.js,app.js}"
```

Open the application:

```powershell
.\index.html
```

## Download the repository

```powershell
git clone --depth 1 https://github.com/novovictus/training.git
```

The runnable application is located at:

```text
training\practice-test\index.html
```

Progress is stored by the browser on that machine and browser profile.

## Active question bank

The application always loads:

```text
practice-test\questions.js
```

A compatible bank is installed by replacing that file with another bank that uses the same filename and schema. No changes to `app.js`, `index.html`, or `styles.css` are required.

The bank assigns a structured data object to `window.SECAI_QUESTION_BANK`:

```javascript
window.SECAI_QUESTION_BANK = {
  schemaVersion: 1,
  bankId: "unique-bank-id",
  bankVersion: "1.0.0",
  title: "Human-readable bank title",
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

## Bank requirements

Every bank must provide:

- `schemaVersion: 1`
- a non-empty `bankId`
- a non-empty `bankVersion`
- a non-empty `title`
- a non-empty `questions` array

Every question must provide:

- a unique non-empty `id`
- a positive integer `number`
- string `domain`
- string `target`
- non-empty string `stem`
- exactly four options named `A`, `B`, `C`, and `D`
- non-empty option strings
- an `answer` of `A`, `B`, `C`, or `D`

The application validates the bank during startup and displays a visible error if the schema is invalid.

## Bank identity and versioning

Saved progress is associated with the loaded bank by `bankId` and `bankVersion`.

Use these rules:

- Use a different `bankId` for a logically different question bank.
- Increment `bankVersion` whenever question text, options, answer keys, stable IDs, domains, or targets change within the same bank.
- Do not reuse the same `bankId` and `bankVersion` for modified content.

Reusing an unchanged identity for changed content can create undetected progress skew because the application has no content hash.

When the loaded bank identity differs from stored progress, the application:

- blocks normal startup
- displays a bank mismatch warning
- does not silently reuse mastery, attempts, settings, or an active run
- requires an explicit local-progress reset before the loaded bank can be used

Legacy version-2 progress without bank identity is treated as production-bank progress:

```text
bankId: secai-plus-cy0-001-v1
bankVersion: 1.0.0
```

Progress exports include bank identity. Imports for another bank ID or version are rejected without partially changing local state.

## Practice behavior

Each new run:

- selects from the available questions
- randomizes question order
- randomizes answer order while preserving canonical answer mapping
- excludes mastered questions by default
- stores question and option order so resumed runs remain stable

The configured run size is capped at the number of available questions. Larger banks default to a normal 60-question run. Smaller banks cannot create a run larger than the bank.

A question is marked mastered after three correct answers. Unanswered questions do not increment mastery attempts.

Use **Customize** to configure:

- question count
- time limit in minutes
- `0` minutes for no countdown or automatic submission
- whether mastered questions are included

Answered, flagged, and confidence-marked questions appear in review. Untouched unanswered questions are omitted.

## Progress handling

The browser stores:

- settings
- mastery
- attempt history
- active-run state
- bank identity

Use export before major application or bank changes. Import only into the matching bank identity and version.

Resetting progress removes the locally stored state for the application. It does not modify any files.

## Deterministic fixture banks

The repository includes:

- `test-banks\test-bank-42.js`
- `test-banks\sample-bank-100.js`

The 42-question bank tests behavior below the normal 60-question run size. The 100-question bank tests 60-question random selection from a larger source bank.

Both fixtures rotate canonical answers through A, B, C, and D and use obvious deterministic text.

## Swap and restore workflow

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

Reload `practice-test\index.html` after every swap. A bank mismatch warning is expected when switching identities. Reset local progress only after confirming the active bank shown by the application.

## Manual validation checklist

For the production bank:

- bank title, version, and 60-question count are shown
- a normal 60-question run starts
- existing production progress migrates without a reset

For the 42-question fixture:

- a mismatch warning appears after production use
- reset enables the fixture
- the displayed bank count is 42
- customization is capped at 42
- the run contains 42 questions

For the 100-question fixture:

- a mismatch warning appears after another bank
- reset enables the fixture
- the displayed bank count is 100
- the default run contains 60 questions

After restoring production:

- the production identity is shown
- the mismatch warning appears if fixture state remains
- reset returns the application to clean production state