# SecAI+ Question Bank Generation Contract

## Purpose

This document defines the generation, validation, and preservation requirements for CompTIA SecAI+ CY0-001 practice banks in this repository.

It applies to humans and AI systems creating or reviewing banks. It is intentionally stored at the repository root so it governs all bank locations without becoming part of the minimal browser runtime.

## Source hierarchy

Before generating a bank, review these sources in order:

1. `CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf`
2. `README.md`
3. `practice-test/README.md`
4. `practice-test/questions.js`
5. Existing practice banks under `test-banks/`
6. Restricted supplied content under `test-banks/private/` only when explicitly authorized

The official objectives define scope. Existing banks define prior coverage and must be checked for duplication. The active application schema is defined in `practice-test/README.md` and demonstrated by `practice-test/questions.js`.

## Preservation rules

- Never overwrite, rename, delete, or revise an existing bank when asked to create an independent bank.
- Add the new bank as a separate file unless the request explicitly names an existing file to revise.
- Do not modify application files, README files, fixtures, or the active bank unless explicitly requested.
- Do not copy restricted supplied questions into public fixtures, independent banks, releases, or published sites.
- Keep generated practice content separate from deterministic application fixtures.
- Preserve repository history as the engineering log.

## Bank size

Unless the request specifies otherwise:

- Minimum: 60 questions
- Preferred range: 60 to 120 questions
- Maximum: 200 questions

A standard timed run remains 60 questions in 60 minutes even when the source bank contains more than 60 items.

## Independence and duplication

An independent bank must contain new assessment items.

- Do not repeat stems from existing banks.
- Do not create cosmetic rewrites that preserve the same scenario, facts, option structure, and answer logic.
- Do not reuse the supplied CompTIA sample questions.
- A repeated objective is allowed and often necessary, but it must be tested through a meaningfully different scenario or cognitive task.
- Compare the proposed bank against the active bank and all prior practice banks before committing.
- Check for exact duplicate stems and manually review near-duplicates.

## Objective coverage

- Do not omit an objective because the candidate is expected to know it.
- Allocate questions intentionally across all four CY0-001 domains.
- Use the official exam weighting as the default distribution when practical.
- A larger bank should broaden sub-objective coverage rather than merely repeat high-level concepts.
- Each question must have a concise `target` describing the primary competency being tested.
- Maintain enough coverage diversity to expose knowledge, taxonomy, and exam-judgment gaps.

## Item-writing standard

Questions should follow the short scenario-driven style established by the supplied CompTIA sample.

Each item must:

- Test one primary decision or distinction.
- Use a clear, self-contained stem.
- Include exactly four non-empty options labeled A through D.
- Have one defensible best answer.
- Use qualifiers such as `best`, `first`, `most appropriate`, or `most likely` only when the scenario supports prioritization.
- Avoid trivia that is not grounded in the objectives.
- Avoid relying on unstated assumptions.
- Avoid trick wording, double negatives, and irrelevant detail.
- Avoid answer options that differ only by vague wording.
- Avoid making the correct option conspicuously longer, more specific, or better written than every distractor.
- Avoid `all of the above` and `none of the above` unless explicitly required.

## Distractor standard

Distractors should be plausible to a partially prepared candidate but incorrect for a specific reason.

Good distractors may be:

- A valid control applied at the wrong lifecycle phase
- A technically true statement that does not answer the question
- A related attack or framework term
- A less appropriate sequence or priority
- A control that addresses a secondary rather than primary risk

Do not use absurd, unserious, or obviously unrelated distractors merely to fill four options.

## Answer-key distribution

- Do not force a perfectly even distribution.
- Do inspect the canonical answer distribution for severe imbalance or suspicious runs.
- Correct content-quality problems rather than rotating answer letters cosmetically.
- Displayed answer order may be randomized by the application, but the canonical bank should still withstand review.

## Explanations

The default bank format contains no explanations or rationales.

This is deliberate: missed or uncertain items should generate research tasks. Add explanations only when explicitly requested, and keep them structurally separate from the question stem and answer options.

## Schema contract

Banks intended for the browser engine must use this structure:

```javascript
window.SECAI_QUESTION_BANK = {
  schemaVersion: 1,
  bankId: "unique-bank-id",
  bankVersion: "1.0.0",
  title: "Human-readable title",
  questions: [
    {
      id: "I001",
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

Required properties:

- `schemaVersion`: currently `1`
- `bankId`: unique and stable
- `bankVersion`: semantic version string
- `title`: human-readable bank name
- `questions`: array of question objects
- `id`: unique within the bank
- `number`: unique positive integer within the bank
- `domain`: string value `1`, `2`, `3`, or `4`
- `target`: non-empty competency label
- `stem`: non-empty question text
- `options`: exactly A, B, C, and D
- `answer`: one of A, B, C, or D

## Naming conventions

Recommended generated-bank path:

```text
test-banks/secai-plus-<descriptor>-bank-v<major>.js
```

Recommended bank identity:

```text
secai-plus-cy0-001-<descriptor>-v<major>
```

Use a question-ID prefix distinct from prior banks when practical, such as `I001` for an independent bank. IDs must remain stable if the bank is later revised.

Increment:

- Patch version for corrections that do not materially change item identity
- Minor version for additions or meaningful item revisions
- Major version for a replacement bank or incompatible redesign

## Validation before commit

Complete all applicable checks before pushing:

1. Confirm the new file does not already exist.
2. Confirm no existing file was modified unintentionally.
3. Confirm question count is within the requested bounds.
4. Confirm all IDs are unique.
5. Confirm all question numbers are unique and sequential unless intentionally documented.
6. Confirm every domain value is valid.
7. Confirm every target and stem is non-empty.
8. Confirm every item has exactly four non-empty options.
9. Confirm every answer is A, B, C, or D and references an existing option.
10. Confirm JavaScript syntax and object closure are valid.
11. Check exact duplicate stems against existing banks.
12. Review likely near-duplicates manually.
13. Review answer distribution and repeated-letter runs.
14. Review distractors for plausibility.
15. Review each answer key under a zero-trust standard.
16. Confirm the bank contains no explanations unless requested.
17. Confirm restricted supplied content was not copied.
18. Inspect the final commit and repository status.

## Quality status

Generated banks are working self-validation artifacts, not authoritative exam content. They should be treated under zero-trust review.

During use, record:

- Disputed answers
- Ambiguous stems
- Weak distractors
- Incorrect target mappings
- Duplicate concepts
- Missing objective coverage
- Regulatory or framework claims requiring primary-source verification

Corrections should be evidence-based and versioned rather than silently edited.

## Current bank classes

- `practice-test/questions.js`: active runtime bank
- `test-banks/secai-plus-*.js`: independent or alternate practice banks
- `test-banks/test-bank-42.js` and `test-banks/sample-bank-100.js`: deterministic application fixtures, not study content
- `test-banks/private/`: restricted supplied third-party content

## Default generation instruction

When asked to create a new independent bank without additional details:

- Read the objectives and all existing practice banks.
- Create a new file under `test-banks/`.
- Generate 60 to 120 original questions, never more than 200.
- Cover all four domains intentionally.
- Use the current JavaScript schema.
- Include no explanations.
- Do not modify existing files.
- Validate and commit only the new bank.
