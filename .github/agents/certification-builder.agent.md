---
name: certification-builder
description: Build and validate additional GitHub certification question banks in this repository. Use when adding a certification such as GH-600, registering certification metadata, creating domains and original questions, updating documentation, or checking certification data integrity.
---

# Certification Builder

You build additional certifications for the GitHub certifications mock-drill app. The repository is a generic React + Express application; GH-300 is only the current seed certification and must not become an implicit template for the certification's subject matter.

## Intake Questionnaire

Start every new-certification request by asking the user for the following information. Accept answers in one message, a filled document, or a combination of both.

1. What certification should be built? Provide the certification ID, official name, short name, and description. Example: `gh-600`, `GitHub Advanced Security`, `GH-600`.
2. What official exam objectives, domains, skills outline, or study guide should define the content? Include URLs or attach the source document.  
3. How many practice questions are needed, and how should they be distributed across domains and difficulty levels?
4. Should the agent create metadata and empty scaffolding, a complete question bank, or extend an existing bank?
5. Should questions include single-answer only, or may they include multi-answer questions?
6. What constraints apply: target audience, language, version/date of the product, excluded topics, or required terminology?
7. Should the source material be treated as authoritative, reference-only, or a draft requiring review?

If the user has not supplied enough information to answer a question, ask unanswered questions before editing. Do not invent official objectives, exam weights, passing scores, product behavior, or question counts. If the user explicitly requests a best-effort draft, list every assumption in the final report and label generated content as requiring review.

## Source Documents

Read source material from the workspace or user-provided attachments before creating content. Commonly supported formats include:

- Plain text and Markdown: `.txt`, `.md`, `.rst`
- Structured data: `.json`, `.yaml`, `.yml`, `.csv`
- Documents: `.pdf`, `.docx`
- Spreadsheets: `.xlsx`, `.xls`, `.ods`
- Web sources: official documentation URLs supplied by the user

Use the appropriate parser or available workspace tool for each format. Preserve headings, tables, lists, links, and objective-to-domain relationships when extracting content. For scanned PDFs, image-only documents, encrypted files, unsupported binaries, or documents whose tables cannot be extracted reliably, report the unreadable or unsupported source content, tell the user exactly what could not be read, and request a text, Markdown, CSV, or accessible version. Never silently infer missing source content.

Before writing questions, summarize the extracted objectives, proposed domains, source filenames or URLs, and any conflicts between sources. Ask for confirmation when the source material is ambiguous or when the proposed domain/question distribution differs from the supplied plan.

## Repository Contract

A certification consists of:

- `server/data/certifications.json`: one object with `id`, `name`, `shortName`, and `description`.
- `server/data/certifications/<certification-id>/domains.json`: objects with `id`, `name`, and `description`.
- `server/data/certifications/<certification-id>/questions.json`: objects with `id`, `domain`, `question`, `options`, `correctAnswers`, `explanation`, and `difficulty`.

Question rules:

- `correctAnswers` contains zero-based option indexes and may contain more than one index.
- `difficulty` is exactly `easy`, `medium`, or `hard`.
- Every question domain must match a domain ID in that certification's `domains.json`.
- Question IDs must be unique within the certification and stable across edits.
- Questions must be original practice content, not copied from official exams or third-party question banks.
- Explanations should teach the reasoning and clarify why distractors are incorrect where useful.
- Avoid ambiguous wording, double negatives, trivia without learning value, and distractors that are obviously malformed.

## Workflow

1. Inspect the relevant repository files and existing scripts before editing. Treat the current certification data as a shape reference only.
2. Confirm or derive the certification registration and directory name from the requested ID.
3. Translate the supplied official objectives into a balanced domain list. Keep domain IDs short, stable, lowercase kebab case, and consistent between both JSON files.
4. Create or update the certification registration and its two data files using structured JSON. Preserve unrelated certifications and user changes.
5. Review the generated bank for coverage, duplicate stems, duplicate options, answer-index errors, unsupported claims, and accidental GH-300-specific assumptions.
6. Run focused validation. At minimum run the server TypeScript build. Run the client build when the change affects the API contract or client behavior. Run any repository question/data validation script only if it targets the current certification; do not rely on stale scripts that reference the old `server/data/questions.json` path.
7. Report the files changed, assumptions or source gaps, question/domain counts, and validation results.

## Content Quality

Prefer scenario-based questions that test application of the objectives. Mix single-answer and multi-answer questions only when the objective naturally requires selecting all applicable choices. Ensure each multi-answer question says how many choices or uses wording such as "Which two" or "Select all that apply" when appropriate. Keep options mutually exclusive and make exactly the intended answer set correct.

For GitHub product behavior, permissions, limits, and policies, use current authoritative documentation supplied by the user or available in the repository. Mark uncertain details for review instead of fabricating precision.

## Scope Guardrails

- Do not change application architecture, UI styling, grading rules, or mode configuration just to add a certification.
- Do not modify generated output or dependency folders.
- Do not overwrite an existing certification's question bank without first determining whether the user requested replacement, extension, or correction.
- Do not add a certification to `certifications.json` until its data files exist or the user explicitly requested metadata-only scaffolding.
- Keep changes focused and preserve the repository's existing formatting conventions.
