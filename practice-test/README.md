# Run the practice test locally

The practice test is a static browser application. It does not require Python, Node.js, a web server, a build process, or an installation. Opening `practice-test\index.html` directly with `file://` remains supported.

## Download only the runnable files with curl

Run this command from the directory where you want the four files saved:

```powershell
curl.exe -O "https://raw.githubusercontent.com/novovictus/training/main/practice-test/{index.html,styles.css,questions.js,app.js}"
```

`-O` saves each download using its existing filename. The braces expand the URL once for each listed file.

After the download completes, open `index.html` in a browser:

```powershell
.\index.html
```

Keep all four files together in the same directory.

## Download the repository with Git

```powershell
git clone --depth 1 https://github.com/novovictus/training.git
```

The runnable test will be located at:

```text
training\practice-test\index.html
```

Open `index.html` directly in a browser. Progress is stored locally by that browser on that machine.

## Active bank file

`practice-test\questions.js` is the active question bank. A compatible bank is installed by replacing that file with another file of the same name.

Compatible banks must assign the structured portable-bank object to `window.SECAI_QUESTION_BANK`:

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

Every compatible bank must provide:

- `schemaVersion: 1`
- a non-empty `bankId`
- a non-empty `bankVersion`
- a non-empty `title`
- a non-empty `questions` array

Each question must provide:

- a unique non-empty `id`
- a positive integer `number`
- string `domain`
- string `target`
- non-empty string `stem`
- exactly four options: `A`, `B`, `C`, and `D`
- non-empty option strings
- an `answer` that references one of those four option keys

## Bank identity and saved progress

Saved progress is associated with the loaded bank by `bankId` and `bankVersion`.

- Progress exports include both values.
- Imports for a different `bankId` or `bankVersion` are rejected.
- If the loaded `questions.js` file does not match the bank associated with stored progress, the app shows a blocking warning and requires a reset before continuing.
- The app does not silently reuse mastery, attempts, settings, or active-run state across different banks.

Legacy version-2 production progress without bank identity is migrated as:

- `bankId: secai-plus-cy0-001-v1`
- `bankVersion: 1.0.0`

That preserves existing production mastery and attempt history when the structured production bank is loaded for the first time.

## Practice behavior

Each new practice run:

- selects questions from the available bank
- randomizes question order
- randomizes answer order while preserving the correct-answer mapping
- excludes mastered questions by default
- stores the selected questions and answer order so a resumed run remains unchanged

Question-count behavior depends on the loaded bank:

- runs are capped at the number of questions available in the loaded bank
- Customize does not preserve or allow a value above the loaded bank size
- larger banks still default to a normal 60-question run

A question is marked mastered after it has been answered correctly three times. Unanswered questions do not increment mastery attempts.

Use **Customize** before starting a run to set:

- Number of questions
- Time limit in minutes
- `0` minutes to disable the countdown and automatic submission
- Whether mastered questions should be included

Progress, mastery, settings, active runs, and attempt history are stored in browser local storage. Use the export and import controls to move or back up that data for the same bank.

## Fixture banks

Deterministic fixture banks are provided here:

- `test-banks\test-bank-42.js`
- `test-banks\sample-bank-100.js`

These fixtures use the same structured portable-bank format as the production bank. The 42-question fixture exercises the lower-than-60 case, and the 100-question fixture exercises the larger-than-60 case.

## Swap and restore workflow

Use the same copy and restore workflow documented in [test-banks\README.md](..\test-banks\README.md):

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
