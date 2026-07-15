# Run the practice test locally

The practice test is a static browser application. It does not require Python, Node.js, a web server, a build process, or an installation.

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

## Practice behavior

The question bank is not limited to 60 questions. Additional questions can be appended to `questions.js` as long as each question has a unique stable ID.

Each new practice run:

- Selects questions from the available bank
- Randomizes question order
- Randomizes answer order while preserving the correct-answer mapping
- Excludes mastered questions by default
- Stores the selected questions and answer order so a resumed run remains unchanged

A question is marked mastered after it has been answered correctly three times. Mastery remains set after it is earned.

Use **Customize** before starting a run to set:

- Number of questions
- Time limit in minutes
- `0` minutes to disable the countdown and automatic submission
- Whether mastered questions should be included

Progress, mastery, settings, active runs, and attempt history are stored in browser local storage. Use the export and import controls to move or back up that data.
