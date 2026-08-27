# SecAI+ Training Next Steps

State captured: 2026-08-27

This file records the agreed stabilization and hosting work to complete before additional practice-test changes are attempted.

## 1. Host the existing repository with GitHub Pages

Use the existing `novovictus/training` repository as both the source repository and the GitHub Pages source. No separate repository, build system, backend, or package manager is required.

Expected hosted practice-test path:

```text
https://novovictus.github.io/training/practice-test/
```

Normal-user execution should move from direct `file://` launch to GitHub Pages over HTTPS.

Development and local testing should use localhost, for example:

```powershell
cd C:\Users\plays\source\github_training\training
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/practice-test/
```

Direct `file://` launch should no longer be treated as the normal persistent-use path.

## 2. Add a direct-file warning

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

## 3. Clean up persistence ownership

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

## 4. Remove generic-key state shuffling from index.html

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

## 5. Keep application-level preferences separate from bank training state

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

This is a cleanup opportunity, not a requirement for the first hosted release if changing it would add unnecessary risk.

## 6. Preserve backward-compatible migration

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

## 7. Treat origin migration separately from storage-schema migration

Moving from `file://` to GitHub Pages creates a different browser origin.

Existing browser-local state under a direct-file origin will not automatically appear at:

```text
https://novovictus.github.io
```

This is expected browser behavior, not another rollback or corruption event.

The existing progress export/import mechanism is the supported portability and recovery path:

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

Do not attempt to infer or reconstruct historical mastery solely from stale browser-local counts. Exported run records and the project SITREP remain the historical evidence.

## 8. Resolve the bundled-bank documentation mismatch

Before release, reconcile the current default-bank inconsistency.

Current implementation and documentation have diverged between at least:

```text
secai-plus-cy0-001-v2
Diagnostic v2
60 questions
```

and documentation describing:

```text
secai-plus-cy0-001-comprehensive-v1
Comprehensive v1
168 questions
```

Determine which bank is intended to ship as:

```text
practice-test/questions.js
```

Then make the following agree:

- `practice-test/questions.js`
- bundled-bank metadata in `practice-test/index.html`
- `practice-test/README.md`
- any root documentation that identifies the production/default bank

Do not resolve this by blindly changing only one file. Verify the actual source-of-record bank under `test-banks/` first.

## 9. Documentation updates

Update repository documentation to clearly state the supported execution model.

### Normal users

Use GitHub Pages over HTTPS.

### Developers

Use localhost for local development and validation.

### Direct file launch

Document `file://` as unsupported or unreliable for persistent use because:

- browser storage is origin-specific
- local-file origins can behave differently from HTTP/HTTPS origins
- programmatic download behavior may be restricted
- switching origins creates a separate localStorage namespace

Also make clear that:

- localStorage is automatic working state, not a durable backup
- exported progress JSON is the durable portable record
- import is the supported restoration and origin-migration mechanism

## 10. Validation checklist before considering the hosted iteration complete

After the persistence cleanup and GitHub Pages deployment, validate all of the following in the hosted HTTPS application:

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
- direct `file://` launch displays the warning
- localhost continues to work for development

## 11. Scope control

This stabilization pass should not redesign unrelated behavior.

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

The immediate goal is a stable hosted execution model and a single clear owner for persistence, not a broader engine rewrite.

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

The GitHub Pages migration addresses the browser-origin problem. The persistence refactor addresses the application-architecture problem. Both should be completed and validated independently before additional feature work proceeds.
