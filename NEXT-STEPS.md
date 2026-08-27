# SecAI+ Training Next Steps

State captured: 2026-08-27

This file records the stabilization work completed before the next practice-test development pass and the remaining persistence work.

## Completed: GitHub Pages hosting and origin migration

The existing `novovictus/training` repository is deployed directly as a GitHub Pages project site. No separate application repository, build system, backend, or package manager is required.

Canonical public entry point:

```text
https://ninja-neer.net/training/
```

The project root redirects to the application:

```text
https://ninja-neer.net/training/practice-test/
```

The custom domain on the `novovictus.github.io` user site is inherited by the `novovictus/training` project site. No separate DNS record is required for the `/training/` path.

The hosted HTTPS application is the supported normal-use environment and is intended for the live online audience.

The migration was smoke-tested successfully by:

1. Loading the hosted application over HTTPS.
2. Loading the terminology bank.
3. Importing existing local progress.
4. Confirming the imported progress and mastery state.
5. Closing and reopening the hosted application.
6. Confirming that state remained preserved.
7. Loading the deployed application successfully in Firefox as an additional smoke test.

This establishes the GitHub Pages deployment and HTTPS browser origin as the current normal-use baseline.

## Completed: local development workflow documentation

Local execution is for development and validation.

A developer can clone the repository or download and extract the repository ZIP, then run an ordinary static HTTP server from the repository root. For example:

```powershell
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

The root redirects to:

```text
http://localhost:8000/practice-test/
```

Direct `file://` execution may still function but is not the supported persistent-use or development workflow.

Browser local storage remains origin-specific. State does not automatically move between `file://`, localhost, and the hosted HTTPS origin. `Export progress` and `Import progress` are the supported portability and origin-migration mechanism.

## Pending: add a direct-file warning

If the application detects:

```javascript
location.protocol === 'file:'
```

show a visible warning explaining that:

- browser storage behavior may be unreliable under `file://`
- programmatic downloads may be suppressed or blocked
- GitHub Pages over HTTPS is the supported normal-user path
- localhost is the supported development and local-testing path

The application does not need to refuse to run under `file://`, but users should not mistake it for the recommended persistent environment.

## Pending: clean up persistence ownership

Current behavior spans two layers.

`practice-test/app.js` directly reads and writes the generic key:

```text
secai-plus-test-engine-v2
```

At the same time, `practice-test/index.html` wraps that generic key with bank-specific archival keys such as:

```text
secai-plus-test-engine-v2:<bankId>
```

The current flow is effectively:

```text
bank-specific state
        |
        v
index.html copies state
        |
        v
generic working key
        |
        v
      app.js
        |
        v
generic working key
        |
        v
index.html copies state back
```

This was a practical compatibility layer for adding multiple-bank support, but it creates unnecessary indirection and splits persistence responsibility between `index.html` and `app.js`.

The target architecture is for `app.js` to own training-state persistence directly.

The engine should derive the canonical storage key from the loaded bank identity, using both:

```text
bankId
bankVersion
```

Conceptually:

```javascript
function progressStorageKey() {
  return `secai-plus-test-engine-v2:${bankConfig.bankId}:${bankConfig.bankVersion}`;
}
```

Then `app.js` should directly read and write that bank/version-specific key.

The exact key formatting may change, but bank ID and bank version should define the canonical training-state identity consistently.

## Pending: remove generic-key state shuffling from index.html

Once `app.js` directly owns bank-scoped persistence, remove the need for `index.html` to move progress into and out of the generic working key.

Specifically, the current responsibilities represented by functions such as:

```text
archiveCurrent()
activateState()
```

should no longer be required for training-state persistence.

`index.html` should remain responsible only for bootstrap and bank-selection concerns, such as:

- which bank source is selected
- loading the bundled bank
- retaining a selected custom bank
- switching between bundled and custom banks

It should not have to proxy completed attempts, mastery, active attempts, or other training state between storage namespaces.

## Pending: keep application-level preferences separate from bank training state

Some storage is legitimately application-global.

Examples include:

```text
secai-plus-selected-bank-source
secai-plus-custom-bank
```

These represent bank-selection and application bootstrap preferences rather than mastery or run history, so they can remain outside the bank-specific progress record.

Training state should remain bank-specific, including items such as:

- mastery
- attempt history
- active attempt
- question-count setting
- include-mastered setting
- timer setting
- other bank-specific practice settings

The current separate run-mode key should also be reviewed. A cleaner model may be to keep run mode inside the bank-specific settings/state rather than under an additional key such as:

```text
secai-plus-run-mode:<bankId>
```

This is a cleanup opportunity rather than a requirement if changing it adds unnecessary risk.

## Pending: preserve backward-compatible storage migration

Do not simply replace the storage-key format and discard existing browser state.

The new persistence layer should use a one-time compatibility path similar to:

1. Look for the new canonical bank/version-specific key.
2. If present and valid, use it.
3. Otherwise look for the existing bank-ID-only scoped key.
4. Validate the embedded `bankId` and `bankVersion` before migration.
5. If valid, copy or migrate it to the new canonical key.
6. Otherwise inspect the historical generic key.
7. Validate it against the currently loaded bank before migration.
8. Never silently import state belonging to another bank or bank version.

Initially, legacy keys may be left in place after successful migration rather than immediately deleted. Storage cost is negligible and preserving them provides rollback safety during stabilization.

## Origin migration versus storage-schema migration

The browser-origin migration is complete. The storage-schema migration is not.

Existing browser-local state under a direct-file or localhost origin does not automatically appear at:

```text
https://ninja-neer.net
```

This is expected browser behavior.

The existing progress export/import mechanism remains the supported portability and recovery path:

```text
old browser origin
      |
      v
Export Progress JSON
      |
      v
GitHub Pages / HTTPS
      |
      v
Import Progress
      |
      v
new HTTPS localStorage state
```

Do not attempt to infer or reconstruct historical mastery solely from stale browser-local counts. Exported run records and project documentation remain the historical evidence.

## Default-bank documentation status

Current repository documentation identifies the bundled default as:

```text
bankId: secai-plus-cy0-001-comprehensive-v1
bankVersion: 1.0.0
questions: 168
```

The named source of record is:

```text
test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js
```

Before changing the bundled bank in future development, verify `practice-test/questions.js`, bundled-bank metadata in `practice-test/index.html`, `practice-test/README.md`, and the named source-of-record bank together rather than changing only one representation.

## Validation checklist for the persistence development pass

After the persistence cleanup, validate all of the following in the hosted HTTPS application and, where appropriate, the localhost development environment:

- application loads successfully from GitHub Pages
- bundled bank loads correctly
- custom bank loading works
- switching banks preserves each bank's own state
- switching bank versions does not silently reuse incompatible progress
- progress survives page reload
- active attempts survive reload and resume
- progress survives normal browser restart
- mastery counts remain correct
- completed attempt history remains correct
- practice mode still locks submitted answers
- exam mode still allows normal answer revision until submission
- blank practice answers still behave as designed
- quit-run behavior discards only the active run
- run-mode behavior remains correct
- export progress downloads successfully
- export run downloads JSON and text reports successfully
- import progress restores valid state
- incompatible-bank import remains blocked
- reset affects only the intended bank state
- direct `file://` launch displays the warning after that warning is implemented
- localhost continues to work for development

## Scope control

The persistence stabilization pass should not redesign unrelated behavior.

Do not change the following unless validation reveals a concrete defect:

- question-bank schema
- mastery threshold or algorithm
- score calculation
- question randomization
- answer-choice randomization
- confidence semantics
- per-question notes
- run export schema
- training-bank content

The immediate remaining goal is a single clear owner for persistence and safe migration of existing state, not a broader engine rewrite.

## Target architecture

```text
              GitHub Pages / HTTPS
                      |
                      v
               practice-test
                      |
        +-------------+-------------+
        |                           |
        v                           v
   Bank selection               app.js
 global preference                  |
                                    v
                        canonical bank identity
                         bankId + bankVersion
                                    |
                                    v
                          bank-specific state
```

The GitHub Pages migration has addressed the browser-origin problem. The remaining persistence refactor addresses the application-architecture problem.
