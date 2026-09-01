<!--
Sync Impact Report
- Version change: placeholder scaffold -> 1.0.0
- Modified principles: none; initial ratification
- Added principles:
  - I. Certification-Agnostic by Default
  - II. Question-Bank Integrity
  - III. Contract Alignment
  - IV. Certification-Scoped Local State
  - V. Focused, Verifiable Changes
- Added sections: Architecture and Data Constraints; Development Workflow and Quality Gates
- Removed sections: none; placeholder sections were instantiated
- Follow-up TODOs: none
-->
# GH Certifications Mock Drill Constitution

## Core Principles

### I. Certification-Agnostic by Default
Application behavior MUST operate on a selected certification identifier rather than a hard-coded
certification. Certification-specific assumptions MAY exist only inside that certification's seed
data and documentation explicitly describing it. New certifications MUST be registered through the
shared certification catalog and MUST use the same application contracts. This keeps the product
extensible without parallel feature implementations.

### II. Question-Bank Integrity
Question and domain data MUST remain structured JSON that conforms to the documented data contract.
Every question MUST reference an existing domain, use a unique identifier within its certification,
provide at least one valid zero-based correct-answer index, and include an explanation and supported
difficulty. Grading MUST compare complete answer sets so single-answer and multi-answer questions
remain equally valid. Question content MUST be original and MUST NOT reproduce third-party exam
dumps or proprietary question banks.

### III. Contract Alignment
Shared API shapes and behavior MUST remain aligned across the Express server, React client, and API
boundary. A contract change MUST update the corresponding server types, client types, API handling,
and affected validation in the same change. Mode behavior exposed by the API MUST agree with the
central server configuration. A change that leaves either side compiling against a stale contract
MUST NOT be accepted.

### IV. Certification-Scoped Local State
User progress, attempts, practice sessions, history, and weak-area calculations MUST remain local to
the browser and scoped by certification. Persistent keys MUST follow the established
`ghcert.<certId>.*` pattern, except for the global selected-certification key. Data from one
certification MUST NOT appear in another certification's results. Introducing remote persistence,
accounts, or a database requires an explicit constitution amendment because it changes the privacy
and architecture model.

### V. Focused, Verifiable Changes
Changes MUST be limited to the smallest coherent behavior or contract required by the task and MUST
preserve established project patterns unless a documented reason requires deviation. Shared
constants, including grading thresholds and mode limits, MUST be referenced from their owning module
instead of duplicated. Every changed behavior MUST have an executable validation proportional to
its risk; unrelated refactors and generated output changes MUST be excluded.

## Architecture and Data Constraints

- The client MUST remain a React and TypeScript application built with Vite unless an approved
  architecture change states migration scope and compatibility impact.
- The API MUST remain an Express and TypeScript service that loads certification metadata, domains,
  and questions from static files unless governance approves a persistence-model change.
- Certification records MUST define `id`, `name`, `shortName`, and `description`.
- Domain records MUST define `id`, `name`, and `description`.
- Question records MUST define `id`, `domain`, `question`, `options`, `correctAnswers`,
  `explanation`, and `difficulty`; difficulty MUST be `easy`, `medium`, or `hard`.
- Domain identifier additions or renames MUST update both the domain catalog and all referencing
  questions atomically.
- Generated build output and dependency directories MUST NOT be edited directly.

## Development Workflow and Quality Gates

1. Changes MUST begin from the owning implementation, data contract, or failing behavior and MUST
	preserve unrelated work already present in the workspace.
2. Question-bank changes MUST use JSON-aware editing and MUST validate identifiers, domain
	references, answer indices, and required fields.
3. Server or shared-contract changes MUST pass `cd server; npm run build`.
4. Client, UI, grading, storage, or API-boundary changes MUST pass `cd client; npm run build`.
5. Client source changes MUST pass `cd client; npm run lint` when lint tooling is available.
6. Cross-client/server changes MUST pass both workspace builds. Any skipped or failing gate MUST be
	documented with its reason and residual risk before review.
7. Review MUST verify certification generality, multi-answer correctness, certification-scoped
	persistence, and consistency with the public documentation when those areas are affected.

## Governance

This constitution is the highest-priority project governance document. Repository instructions and
feature specifications MUST comply with it; where they conflict, this constitution governs.

Amendments MUST be proposed as an explicit constitution change with rationale, migration impact,
and an updated Sync Impact Report. Approval requires review by a project maintainer. The version MUST
follow semantic versioning: MAJOR for incompatible principle removals or redefinitions, MINOR for a
new principle or materially expanded requirement, and PATCH for non-semantic clarification.

Every feature plan and code review MUST check applicable principles and quality gates. Exceptions
MUST be documented before merge with scope, rationale, risk, and a removal or review date. Repeated
exceptions require a constitution amendment rather than continued waivers. Operational development
details live in `.github/copilot-instructions.md`, but that guidance MUST remain consistent with this
constitution.

**Version**: 1.0.0 | **Ratified**: 2026-09-01 | **Last Amended**: 2026-09-01
