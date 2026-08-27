# SecAI+ Training Next Steps

State updated: 2026-08-27

This file records the completed hosting migration and the remaining stabilization work to complete before additional practice-test feature development.

## Completed: GitHub Pages hosting and browser-origin migration

The existing `novovictus/training` repository is now deployed as a GitHub Pages project site. No separate repository, build system, backend, or package manager was required.

Canonical user entry point:

```text
https://ninja-neer.net/training/
```

The repository-root `index.html` redirects relatively to:

```text
https://ninja-neer.net/training/practice-test/
```

The `novovictus.github.io` user site owns the `ninja-neer.net` custom domain. GitHub Pages project-site behavior makes the `novovictus/training` project available under the same domain at `/training/`; no separate DNS change is required for that path.

The temporary redirect previously added under the landing-page repository was verified to be redundant because the project site owns the `/training/` namespace. The authoritative redirect is the root `index.html` in this repository.

### Hosting smoke tests completed

The hosted application has been validated for the migration-critical path:

- GitHub Pages deployment completes successfully.
- `https://ninja-neer.net/training/` redirects to the practice test.
- the direct practice-test URL loads successfully over HTTPS.
- the terminology bank can be loaded in the hosted application.
- existing local progress can be imported into the hosted application.
- imported state survives closing and reopening the application.
- Firefox successfully loaded the deployed redirect/application path as an independent smoke test.

The hosted HTTPS origin is now the supported normal-use environment.

## Completed: execution-model documentation

Repository documentation now treats:

- `https://ninja-neer.net/training/` as the canonical user entry point
- `https://ninja-neer.net/training/practice-test/` as the direct application URL
- HTTPS as the normal persistent-use environment
- localhost as the local development and validation environment
- direct `file://` launch as an unreliable compatibility path rather than the supported persistent-use model
- `Export progress` as the portable recovery record
- `Import progress` as the supported restoration and browser-origin migration mechanism

Browser local storage remains automatic working state, not a durable backup.

## Pending 1: add a direct-file warning

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

## Pending 2: clean up persistence ownership

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

## Pending 3: remove generic-key state shuffling from index.html

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

## Pending 4: keep application-level preferences separate from bank training state

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

This is a cleanup opportunity, not a requirement if changing it would add unnecessary risk.

## Pending 5: preserve backward-compatible storage migration

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

The browser-origin migration is complete, but it is separate from the pending storage-schema refactor.

Moving from `file://` to GitHub Pages created a different browser origin. Existing browser-local state did not automatically appear under:

```text
https://ninja-neer.net
```

That behavior was expected. The existing progress export/import mechanism successfully moved state into the hosted origin:

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

The imported state was confirmed to persist after the hosted application was closed and reopened.

## Default-bank documentation status

The current live documentation identifies the bundled/default bank as:

```text
bankId: secai-plus-cy0-001-comprehensive-v1
bankVersion: 1.0.0
questions: 168
```

with source of record:

```text
test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js
```

Before changing bank content or metadata, re-verify `practice-test/questions.js`, the bundled-bank metadata in `practice-test/index.html`, and the named source under `test-banks/` remain aligned. Do not alter bank identity as part of the persistence refactor unless a concrete mismatch is found.

## Validation checklist for the persistence refactor

The hosting-specific smoke tests listed above are complete. After the persistence cleanup, validate the remaining state-management behavior in the hosted HTTPS application:

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
- direct `file://` launch displays the warning once that warning is implemented
- localhost continues to work for development

## Scope control

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

The immediate development goal is now a single clear owner for persistence and safe migration of existing state, not a broader engine rewrite.

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

The GitHub Pages/browser-origin migration is complete. The persistence refactor remains the next development task and should be validated independently before additional feature work proceeds.
