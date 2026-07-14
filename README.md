# CompTIA SecAI+ Training Project

## Purpose

This private repository is the working source of truth for preparing for the CompTIA SecAI+ CY0-001 certification exam.

The project is intentionally structured as an engineering and validation effort rather than a traditional certification study plan. The goal is to use AI as an active preparation tool while preserving authoritative source material, test artifacts, decisions, and results in version control.

The working assumption is that every practice run contains 60 scored questions and should be completed in 60 minutes. This deliberately ignores unscored beta, psychometric, integrity, or cheating-detection items so that timing, comprehension, decision-making, and execution can be trained against a consistent full-load scenario.

## Candidate background

The candidate has more than 20 years of cybersecurity experience and extensive certification, academic, operational, governance, research, leadership, and exam-development experience.

### Certifications and education

- Microsoft MCSE: Security
- Microsoft MCITP: Enterprise Administrator
- Microsoft MCITP: Enterprise Desktop Administrator
- Microsoft MCITP: Enterprise Desktop Support Technician
- CompTIA A+
- CompTIA Network+
- CompTIA Project+
- CompTIA Server+
- CompTIA Linux+
- CompTIA Cloud+
- CompTIA Security+
- EC-Council Certified Hacking Forensic Investigator
- EC-Council Certified Ethical Hacker
- ISC2 CISSP
- Check Point CCSPA
- Cisco CCENT, expired
- Bachelor of Science in Information Technology: Security
- Master of Science in Information Security and Assurance
- Doctor of Science in Cybersecurity

### Certification and curriculum development experience

The candidate has worked as a subject matter expert for Western Governors University, ISC2, and EC-Council. Relevant work includes:

- Undergraduate and graduate cybersecurity program development and review
- Course quality assurance and curriculum revision
- Pre-assessment and practice-exam review
- Certification item writing
- CISSP item-writing workshop participation
- CHFI item-bank development
- Introductory network security course design and revision
- Cybersecurity mentoring

This experience is relevant because it provides direct familiarity with competency mapping, distractor design, item-writing conventions, exam abstraction levels, and the distinction between technically correct and best-answer responses.

### Recent cybersecurity and GRC experience

Recent professional experience includes:

- Independent cybersecurity consulting across industry, government, and academia
- DREN endpoint administration, imaging, patching, configuration, and deployment
- Software assurance tooling and Army SwAT support
- Docker, VMware Workstation, and Oracle VirtualBox administration
- Network-access management and physical network deployment
- CMMC consulting
- RDT&E project review and technical direction
- DAU software assurance credential development feedback
- Cloud modernization planning and proposal scoping
- JFrog Artifactory administration
- Dissertation-chair work involving research design, problem statements, ARB and IRB submissions, and doctoral mentoring
- Program management, contractual governance, PWS compliance, budgeting, subcontractor coordination, and deliverable validation
- Leadership of more than 60 personnel across cyber-related capabilities
- RMF, security assessments, coding, IT operations, and lab-network management
- ACAS and Nessus vulnerability scanning
- STIG, SCC, and SCAP assessment and remediation support
- Tactical accreditation and defense R&D support

This experience is expected to provide strong coverage of traditional cybersecurity operations, governance, risk, compliance, control selection, evidence, traceability, remediation, and risk acceptance.

### Current AI experience

The candidate also works as an AI Trainer - Cybersecurity Expert through the Handshake AI Fellowship. Relevant work includes:

- Developing domain-specific prompts for cybersecurity evaluation
- Evaluating large-language-model responses for scientific accuracy, clarity, and depth
- Providing expert feedback on complex cybersecurity topics
- Conducting independent research to support prompt development and evaluation

This makes the preparation approach intentionally recursive: AI is both the subject being tested and a tool used to decompose objectives, generate scenarios, challenge assumptions, validate understanding, and identify gaps.

## Preparation philosophy

The project will not begin with the candidate's traditional sequence of videos, broad practice-test repetition, and book reading.

Instead, the current method is:

1. Treat the official CompTIA objectives as the authoritative specification.
2. Decompose every objective into explicit testable targets.
3. Do not omit any target based on assumed prior knowledge.
4. Use the CompTIA-provided sample test to establish question style and framing.
5. Build full-length diagnostic runs that expose actual knowledge, taxonomy, and exam-judgment gaps.
6. Use AI to generate targeted follow-up drills, scenario variations, adversarial questions, and explanations.
7. Verify unstable, regulatory, legal, framework-specific, and version-sensitive claims against primary sources.
8. Track results and changes in the repository as an engineering log.

The key distinction is that this is an objective-validation and gap-closure project, not a generic learning curriculum.

## Gap categories

Misses should be classified into at least three categories:

### Knowledge gap

The underlying concept, control, framework, technology, or process is not sufficiently understood.

### Taxonomy gap

The concept is understood, but the candidate does not recognize or use CompTIA's preferred terminology, category, or abstraction.

### Exam-judgment gap

Multiple options may be technically defensible, but one is more appropriate based on sequence, priority, lifecycle phase, scope, or wording such as `best`, `first`, or `most appropriate`.

For an experienced candidate, taxonomy and exam judgment may be more significant risks than basic cybersecurity knowledge.

## AI-specific areas expected to require validation

No objective is being skipped, but likely areas requiring explicit AI-specific mapping include:

- Model risk versus traditional system risk
- Data provenance and lineage
- Model cards and system cards
- AI impact assessments
- Human oversight
- Bias, fairness, and representativeness
- Explainability and transparency
- AI supply-chain risk
- Model monitoring
- Model drift and data drift
- Prompt injection and indirect prompt injection
- Training-data poisoning
- Model inversion and extraction
- Membership inference
- Adversarial examples and evasion
- Retrieval-augmented generation security
- Agent, tool, plugin, and orchestration risk
- AI-specific governance and regulatory obligations

## Current repository state

The repository is intentionally flat for the initial phase.

Current source and working files in the root of `main`:

- `CompTIA SecAI+ CY0-001 Exam Objectives (4.0).pdf`
  - Official exam objectives supplied by CompTIA.
- `SecAI+ Practice Test V1.docx`
  - CompTIA-provided sample practice test used to infer question grammar and framing.
- `secai-plus-initial-diagnostic.md`
  - Initial objective decomposition and human-oriented 60-question diagnostic.
- `secai-plus-question-bank-v1.md`
  - Canonical v1 question bank for later test-engine consumption.
- `README.md`
  - Project context, decisions, engineering log, and resume point.

No directory structure, issue workflow, project board, interactive interface, static-site files, JavaScript, CSS, or GitHub Pages configuration has been created yet. The repository will remain flat until the amount and type of material justify additional structure.

## Initial diagnostic

The first diagnostic was created as a single flat Markdown file.

It contains:

- A list of 72 explicit objective targets across all four CY0-001 domains
- All ten questions from the CompTIA-provided sample practice test
- Fifty additional original questions modeled on the supplied question style
- Sixty total questions
- A 60-minute target duration
- Four-answer multiple-choice format
- Scenario-oriented wording emphasizing best-action and most-appropriate-response judgment
- An answer key
- Primary objective mapping
- Confidence scoring guidance
- Post-test error classification

A single 60-question run cannot independently isolate every one of the 72 decomposed targets. Some questions therefore test multiple adjacent targets. Future 60-question runs should rotate coverage while preserving the same timing and execution constraints.

## Question bank v1 format

`secai-plus-question-bank-v1.md` is the canonical machine-readable and human-readable representation of the first test.

The file uses:

- YAML front matter for bank-level metadata
- Semantic versioning for the bank and schema
- Stable bank identifier `secai-plus-cy0-001-v1`
- Stable question identifiers `Q001` through `Q060`
- Explicit question delimiters in HTML comments
- Fixed metadata keys for each question
- Fixed four-option labels `A` through `D`
- A separate keyed answer and objective-mapping section
- No application-specific HTML, JavaScript, or rendering assumptions

The parser contract for v1 is:

1. Read YAML front matter for bank metadata.
2. Treat each `QUESTION_START` and `QUESTION_END` pair as one question record.
3. Parse the metadata comment immediately after `QUESTION_START`.
4. Read the question stem under `### Qnnn`.
5. Parse exactly four options using the bold labels `**A.**` through `**D.**`.
6. Read correct answers and mappings from the answer-key table by stable question ID.
7. Ignore ordinary explanatory Markdown outside those defined structures.

This keeps the bank directly readable in GitHub while avoiding brittle parsing based only on heading order or visual spacing.

## Deferred online test engine plan

The eventual target is a static test engine hosted with GitHub Pages. Implementation is intentionally deferred.

The expected design direction is:

- Use `secai-plus-question-bank-v1.md` as the source bank.
- Parse or transform the bank during build time rather than duplicating questions manually in application code.
- Present one question at a time or in a reviewable exam sequence.
- Enforce or display the 60-minute run target.
- Capture selected answer, confidence score, flagged status, and elapsed time.
- Delay answer disclosure until submission.
- Score by question, target, and domain.
- Preserve missed-question and low-confidence analysis.
- Support later banks and schema versions without breaking v1.
- Keep source questions distinct from original generated questions.
- Avoid exposing the answer key in the active test view even though the static repository contains it.

No site implementation should begin until the desired interaction model, result persistence, answer-key exposure model, and public-versus-private deployment implications are decided.

## Current decisions

The following decisions were made during the initial session:

- The repository remains private during initial development.
- The default branch is `main`.
- Files remain in the repository root for now.
- No scaffolding or folder hierarchy will be added prematurely.
- The official objectives and sample test remain the primary source artifacts.
- Every objective area receives a litmus test, regardless of expected mastery.
- Practice tests remain 60 questions and 60 minutes.
- Initial practice content follows the format and framing of the supplied CompTIA sample.
- AI is used as an examiner, tutor, adversarial reviewer, decomposer, and validation assistant.
- Primary-source verification is required for regulatory, legal, standards, and version-sensitive claims.
- Repository history serves as the engineering log and future resume mechanism.
- The canonical initial bank is explicitly versioned as v1.
- The bank must remain both deterministic to parse and comfortable to review in rendered Markdown.
- GitHub Pages is the intended future delivery mechanism, but implementation is deferred.

## Recommended execution process

For the first diagnostic run:

1. Complete all 60 questions in 60 minutes.
2. Record one answer for every question.
3. Record confidence using the scale in the diagnostic:
   - `3` - certain
   - `2` - probable
   - `1` - uncertain
   - `0` - guessed
4. Do not consult the answer key until the run is complete.
5. Record total completion time.
6. Review every incorrect answer.
7. Review every correct answer with confidence `0` or `1`.
8. Classify each issue as knowledge, taxonomy, exam judgment, or question-quality concern.
9. Use the results to generate the next targeted test rather than defaulting to broad study.

## Resume point

The source artifacts, objective decomposition, human-oriented diagnostic, and canonical v1 question bank are initialized. The question bank is ready to serve as the future back end for a static test engine, but no site implementation has begun.

The next meaningful learning step remains taking the initial 60-question diagnostic under timed conditions and preserving responses, confidence values, completion time, and question-quality objections. The next engineering step, when intentionally resumed, is to define the test engine's interaction and persistence model before creating GitHub Pages files.

## Session log

### 2026-07-14 - Project initialization

- Established the CompTIA SecAI+ certification effort as a new project.
- Confirmed that the candidate's cybersecurity, academic, certification-development, GRC, research, leadership, and AI-evaluation background supports a diagnostic-first approach.
- Selected AI-assisted objective decomposition and adversarial assessment instead of a conventional video, book, and practice-test sequence.
- Created the private GitHub repository `novovictus/training`.
- Added the official CY0-001 exam objectives and CompTIA sample practice test.
- Verified repository access and write permissions.
- Decomposed the objectives into 72 testable targets without assuming mastery.
- Created and committed the initial 60-question diagnostic in `secai-plus-initial-diagnostic.md`.
- Added this README to preserve project context and provide a reliable restart point for future sessions.
- Created `secai-plus-question-bank-v1.md` as the canonical parseable bank.
- Added stable IDs, explicit delimiters, versioned metadata, and a documented parser contract.
- Recorded the future GitHub Pages test-engine direction without beginning implementation.