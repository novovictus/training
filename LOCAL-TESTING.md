# Local testing

The practice test is now intended to run over HTTP or HTTPS rather than directly from the filesystem.

## Normal use

Use the deployed GitHub Pages application:

```text
https://ninja-neer.net/training/
```

That entry point redirects to:

```text
https://ninja-neer.net/training/practice-test/
```

The hosted HTTPS application is the supported persistent-use environment.

## Local development

From the repository root, start an ordinary static HTTP server. For example:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/practice-test/
```

No build process, backend, package manager, or application installation is required.

The application files remain ordinary static files:

- `practice-test/index.html`
- `practice-test/styles.css`
- `practice-test/questions.js`
- `practice-test/app.js`

## Direct file launch

Opening `practice-test/index.html` directly with a `file://` URL may still run the application, but it is not the supported persistent-use or development path.

Direct-file browser behavior can differ from HTTP/HTTPS behavior, particularly for:

- local-storage origin handling
- programmatic downloads
- persistence when files or directories move
- behavior across browsers and browser profiles

Use localhost when testing local code changes.

## Progress and browser origins

Browser local storage belongs to the origin from which the application is opened. These are separate storage environments:

```text
file://...
http://localhost:8000
https://ninja-neer.net
```

Progress does not automatically move between them.

Local storage is automatic working state, not a durable backup. Use `Export progress` to create the portable recovery record and `Import progress` to restore it into another browser origin, browser profile, or environment.

The GitHub Pages migration was validated by importing existing local progress into the hosted application and confirming that the imported state survived closing and reopening the application.
