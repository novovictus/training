# Question Bank Rebuild Requirements

## Status

The current active bank in `practice-test/questions.js` is a 40-question legacy draft retained for application testing and content review. It is not considered a valid final diagnostic bank.

The 20 questions from the supplied CompTIA practice test were removed from the active bank and isolated in `test-banks/private/comptia-sample-20.js`. That private bank must not be distributed externally.

## Known defects in the legacy draft

### Canonical answer imbalance

Among the 40 project-authored questions retained from the initial extension batch:

- A: 37
- B: 2
- C: 1
- D: 0

The browser randomizes displayed answer order, so the canonical-key imbalance is not directly exploitable in the UI. It is still evidence that the batch was not independently reviewed and may contain weak distractors, answer-key errors, wording clues, or other item-quality defects.

Do not cosmetically rotate answer keys. Every retained or replacement item must be independently reviewed for:

- correctness of the keyed answer
- plausibility and exclusivity of distractors
- ambiguity or multiple defensible answers
- wording that reveals the answer
- alignment with CompTIA terminology and best-answer judgment
- domain and objective mapping

### Domain weighting

The original 60-question bank used a 20/20/10/10 domain split. That does not match the CY0-001 blueprint.

Official weights:

| Domain | Weight |
|---|---:|
| 1.0 Basic AI Concepts | 17% |
| 2.0 Securing AI Systems | 40% |
| 3.0 AI-assisted Security | 24% |
| 4.0 AI Governance, Risk, and Compliance | 19% |

A new 60-question diagnostic should use a documented integer allocation close to the official blueprint. A defensible target is:

| Domain | Questions |
|---|---:|
| 1.0 | 10 |
| 2.0 | 24 |
| 3.0 | 14 |
| 4.0 | 12 |
| Total | 60 |

### Review status

The current 40-question bank has no recorded independent item review. Treat it as an unvalidated legacy draft.

## Replacement-bank requirements

The next diagnostic bank must:

1. contain only project-authored or appropriately licensed questions
2. contain 60 questions unless a different diagnostic size is explicitly documented
3. follow the official domain weighting closely
4. receive independent review of every stem, option set, answer key, target, and domain mapping
5. avoid suspicious canonical-answer concentration
6. preserve stable question IDs within the bank
7. use a new `bankId` or a new major `bankVersion` so legacy progress cannot be reused silently
8. pass the application schema validation and deterministic browser smoke tests

## Current bank identity

The active legacy draft uses:

```text
bankId: secai-plus-cy0-001-legacy-draft-40
bankVersion: 1.0.0
```

The replacement diagnostic must not reuse that identity.
