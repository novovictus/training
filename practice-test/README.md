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