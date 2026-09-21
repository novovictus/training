# SecAI+ Training Next Steps

State captured: 2026-08-27

This file records the current stabilized application architecture, completed deployment and persistence work, and remaining field validation.

## Completed: GitHub Pages hosting and origin migration

The `novovictus/training` repository is deployed directly as a GitHub Pages project site. No separate application repository, build system, backend, or package manager is required.

Canonical public entry point:

```text
https://ninja-neer.net/training/
```

The project root redirects to:

```text
https://ninja-neer.net/training/practice-test/
```

The custom domain on the `novovictus.github.io` user site is inherited by the `novovictus/training` project site. No separate DNS record is required for `/training/`.

The hosted HTTPS application is the supported normal-use environment for the live online audience.

The origin migration was smoke-tested successfully by loading the hosted application, loading the terminology bank, importing existing local progress, confirming mastery/progress, closing and reopening the application, and confirming that state remained preserved. Firefox was also used successfully as an independent deployment smoke test.

## Completed: local development workflow

Local execution is for development and validation. Clone the repository or download/extract the repository ZIP, then run an ordinary static HTTP server from the repository root, for example:

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

Browser local storage remains origin-specific. State does not automatically move between `file://`, localhost, and the hosted HTTPS origin. `Export progress` and `Import progress` remain the supported portability and origin-migration mechanism.

## Completed: direct-file warning

The application now detects:

```javascript
location.protocol === 'file:'
```

and displays a visible, non-blocking warning. It explains that direct-file launch is not the supported persistent-use or development path, that local-storage/download behavior may differ under `file://`, and directs normal users to the hosted application and developers to localhost.

Direct-file execution remains available as a compatibility path.

## Completed: persistence ownership cleanup

Implemented on `main` in commit `6bd3255` (`refactor: scope persistence by bank version`).

`practice-test/app.js` now owns training-state persistence directly. The canonical storage key includes both bank identity components:

```text
secai-plus-test-engine-v2:<bankId>:<bankVersion>
```

Conceptually:

```javascript
function progressStorageKey() {
  return `${STORAGE_KEY_PREFIX}:${bankConfig.bankId}:${bankConfig.bankVersion}`;
}
```

This makes each bank version an independent persistence namespace. A bank or version with no compatible stored state starts fresh rather than being blocked by unrelated progress from another bank.

`practice-test/index.html` no longer moves training state through the historical generic working key. The previous `archiveCurrent()` / `activateState()` copy-in/copy-out layer and page-hide archival dependency were removed.

`index.html` remains responsible for bootstrap concerns:

- selected bundled/custom bank source
- retained custom-bank payload
- loading the bundled bank
- switching between bundled and custom sources

Application-global bootstrap keys remain separate:

```text
secai-plus-selected-bank-source
secai-plus-custom-bank
```

## Completed: backward-compatible storage migration

The application preserves existing compatible browser state using this precedence:

1. canonical bank/version key
2. previous bank-ID-only key
3. historical generic key
4. fresh default state

Legacy state is migrated only when its embedded `bankId` and `bankVersion` exactly match the currently loaded bank. Incompatible state is ignored rather than relabeled or silently reused.

A compatible legacy record is copied into the canonical bank/version key. Legacy keys are intentionally left in place during stabilization because storage cost is negligible and retaining them provides rollback safety.

Migration is idempotent and does not depend on page-hide or browser-shutdown timing.

Existing progress-export files remain the portability/recovery format. Import continues to validate bank identity before accepting state and saves valid imported state through the canonical persistence path.

## Deferred: run-mode storage consolidation

Run-mode preference remains under the separate per-bank namespace:

```text
secai-plus-run-mode:<bankId>
```

Moving run mode into the canonical training-state record was optional and was intentionally deferred because it was not required to eliminate the generic-state shuffling architecture. Active attempts continue to carry their run mode, and existing behavior is preserved.

This can be reconsidered later if there is a concrete maintenance or behavioral reason to consolidate it.

## Origin migration versus storage-schema migration

Both migrations are now implemented, but they solve different problems.

Browser-origin migration remains explicit because browser security boundaries prevent state from automatically moving between:

```text
file://...
http://localhost:8000
https://ninja-neer.net
```

The supported cross-origin path remains:

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

Storage-schema migration occurs automatically within an origin when compatible legacy state is found and moves that state into the canonical `bankId + bankVersion` namespace.

## Bundled default bank

The shipped `practice-test/questions.js` payload is currently Diagnostic v2:

```text
bankId: secai-plus-cy0-001-v2
bankVersion: 2.0.0
questions: 60
```

Its source of record is:

```text
test-banks/secai-plus-cy0-001-diagnostic-v2.js
```

The larger comprehensive bank remains available separately:

```text
test-banks/secai-plus-cy0-001-comprehensive-bank-v1.js
```

Before changing the bundled bank in future development, verify `practice-test/questions.js`, bundled-bank metadata in `practice-test/index.html`, `practice-test/README.md`, and the intended source-of-record bank together.

## Post-change field validation

The implementation is complete. Continue exercising the deployed HTTPS application and localhost development copy, with particular attention to:

- application loads successfully from GitHub Pages
- bundled bank loads with the correct identity and count
- custom bank loading works
- switching banks preserves each bank's independent state
- switching bank versions does not silently reuse incompatible progress
- compatible legacy state migrates to the canonical key
- progress survives reload and normal browser restart
- active attempts survive reload and resume
- mastery counts and completed history remain correct
- practice mode retains submitted-answer locks
- exam mode retains normal answer revision until submission
- quit-run behavior discards only the active run
- run-mode behavior remains correct
- export progress downloads successfully
- import progress restores compatible state and rejects incompatible banks
- export run continues to produce JSON and text reports
- reset affects only the intended canonical bank/version state
- direct `file://` launch displays the warning while remaining usable
- localhost continues to work for development

Failures found during field use should be treated as concrete defects and fixed narrowly rather than triggering a broader rewrite.

## Scope control

The persistence stabilization pass did not intentionally redesign:

- question-bank schema
- mastery threshold or algorithm
- score calculation
- question randomization
- answer-choice randomization
- confidence semantics
- per-question notes
- run export schema
- training-bank content

Future changes to those areas should be driven by separate requirements or observed defects.

## Current architecture

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

GitHub Pages provides the normal-use browser origin. `index.html` owns bank-source bootstrap. `app.js` owns canonical bank/version training state. Export/import provides explicit portability between browser origins.
