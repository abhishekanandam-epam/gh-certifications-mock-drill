#!/usr/bin/env python3
"""
Generate additional 45 questions to reach 300 total for GH-300 exam
Based on the patterns from existing questions
"""

import json
import random

# Additional questions covering various topics
additional_questions = [
    {
        "id": "q256",
        "domain": "copilot-features",
        "question": "What is the primary difference between Copilot suggestions and Copilot Chat?",
        "options": [
            "Suggestions are only available in VS Code, while Chat works in all IDEs",
            "Suggestions provide inline code completions as you type, while Chat is for conversational assistance",
            "Chat is outdated and no longer supported",
            "There is no functional difference between them"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot suggestions appear inline as you type in the editor, providing code completions automatically. Copilot Chat is a conversational interface where you can ask questions and have multi-turn discussions about code. They serve different purposes in the developer workflow.",
        "difficulty": "easy"
    },
    {
        "id": "q257",
        "domain": "responsible-ai",
        "question": "Which principle helps ensure that AI systems explain their decisions in understandable terms?",
        "options": [
            "Reliability and Safety",
            "Transparency",
            "Inclusiveness",
            "Fairness"
        ],
        "correctAnswers": [1],
        "explanation": "Transparency requires that AI systems provide clear, understandable explanations of how they work and the decisions they make. This enables users to assess appropriateness and trustworthiness.",
        "difficulty": "easy"
    },
    {
        "id": "q258",
        "domain": "copilot-features",
        "question": "When should you use Copilot's Edit feature instead of inline suggestions?",
        "options": [
            "When you need to change syntax only",
            "When you want to make larger, scoped changes across one or multiple files",
            "Edit is deprecated and should never be used",
            "Only when working with Python files"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot's Edit feature is designed for larger, more targeted changes that may span multiple files. It gives you more control than quick inline suggestions for substantial refactoring or feature additions.",
        "difficulty": "medium"
    },
    {
        "id": "q259",
        "domain": "responsible-ai",
        "question": "What should a developer do when Copilot suggests code that includes hard-coded credentials?",
        "options": [
            "Use the credentials as suggested if they work",
            "Ask Copilot to regenerate the suggestion without hard-coded secrets",
            "Always accept Copilot suggestions without review",
            "Remove all error handling to simplify the code"
        ],
        "correctAnswers": [1],
        "explanation": "Hard-coded credentials are a security risk. Developers should reject suggestions with hard-coded secrets and ask Copilot to provide alternatives using environment variables or secret management systems.",
        "difficulty": "medium"
    },
    {
        "id": "q260",
        "domain": "github-workflow",
        "question": "How can Copilot assist in the pull request review process?",
        "options": [
            "Copilot cannot review pull requests at all",
            "Copilot can only approve pull requests automatically",
            "Copilot can suggest improvements, identify potential issues, and help with code review comments",
            "Copilot reviews are mandatory and override human reviews"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot can assist pull request reviews by suggesting improvements, identifying potential bugs, recommending better patterns, and helping reviewers write thoughtful comments. However, it complements but doesn't replace human review.",
        "difficulty": "medium"
    },
    {
        "id": "q261",
        "domain": "copilot-features",
        "question": "What is the purpose of Copilot's /explain command in Chat?",
        "options": [
            "To delete code from your repository",
            "To provide explanations of how code works or what it does",
            "To automatically deploy code to production",
            "To convert between programming languages"
        ],
        "correctAnswers": [1],
        "explanation": "The /explain command in Copilot Chat asks Copilot to provide a clear, detailed explanation of what specific code does, how it works, and any important patterns or behaviors.",
        "difficulty": "easy"
    },
    {
        "id": "q262",
        "domain": "responsible-ai",
        "question": "Which Responsible AI principle focuses on ensuring AI systems perform consistently and reliably?",
        "options": [
            "Privacy and Security",
            "Reliability and Safety",
            "Fairness",
            "Inclusiveness"
        ],
        "correctAnswers": [1],
        "explanation": "Reliability and Safety ensures that AI systems perform as intended, are dependable and consistent, and operate safely under expected and challenging conditions through rigorous testing and validation.",
        "difficulty": "easy"
    },
    {
        "id": "q263",
        "domain": "copilot-features",
        "question": "How does Copilot help with refactoring legacy code?",
        "options": [
            "It can automatically delete all legacy code",
            "It cannot assist with refactoring at all",
            "It can suggest modern patterns, help update code to current standards, and assist with testing during refactoring",
            "It only works with new code, not legacy code"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot can assist with legacy code refactoring by suggesting modern patterns, helping update deprecated APIs, improving code structure, and assisting with test generation to ensure changes don't break functionality.",
        "difficulty": "medium"
    },
    {
        "id": "q264",
        "domain": "responsible-ai",
        "question": "What is the best approach when you identify bias in Copilot-generated code?",
        "options": [
            "Ignore it and use the code as-is",
            "Report it and refrain from using that suggestion, then request an alternative",
            "Assume Copilot is always correct",
            "Modify it yourself without review"
        ],
        "correctAnswers": [1],
        "explanation": "When you identify bias or discriminatory patterns in Copilot suggestions, you should report the issue and request alternative solutions. This feedback helps improve the tool and prevents propagating biased logic.",
        "difficulty": "medium"
    },
    {
        "id": "q265",
        "domain": "copilot-features",
        "question": "What context does Copilot use to generate relevant suggestions?",
        "options": [
            "Only the current line of code",
            "Only the current file name",
            "The current file, open files, workspace structure, and conversation history",
            "External internet sources only"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot uses rich context including the current file, other open files in your workspace, the repository structure, function signatures, comments, and chat history to generate contextually relevant and coherent suggestions.",
        "difficulty": "medium"
    },
    {
        "id": "q266",
        "domain": "responsible-ai",
        "question": "How does the Fairness principle apply to AI systems used in hiring decisions?",
        "options": [
            "Fairness is not relevant to hiring systems",
            "Ensuring the system treats all candidates equitably and doesn't discriminate based on protected attributes",
            "Maximizing profit for the company",
            "Automated systems should make final hiring decisions without review"
        ],
        "correctAnswers": [1],
        "explanation": "In hiring contexts, Fairness requires that AI systems treat all candidates equitably, avoid discriminatory outcomes, and are regularly audited for bias across demographic groups.",
        "difficulty": "medium"
    },
    {
        "id": "q267",
        "domain": "copilot-features",
        "question": "What should you do if Copilot suggests code that may not work correctly?",
        "options": [
            "Always use it without testing",
            "Test it, validate the logic, and refine or reject if needed",
            "Assume Copilot is always correct",
            "Blame Copilot if it doesn't work"
        ],
        "correctAnswers": [1],
        "explanation": "Developers remain responsible for testing and validating all Copilot suggestions. If a suggestion doesn't work as expected, test it, analyze why, and either refine it or request an alternative from Copilot.",
        "difficulty": "easy"
    },
    {
        "id": "q268",
        "domain": "github-workflow",
        "question": "How can developers use Copilot to improve code review efficiency?",
        "options": [
            "Copilot cannot assist with code reviews",
            "By using Copilot to generate review comments and identify common issues automatically",
            "By having Copilot approve all pull requests",
            "By skipping human review entirely"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can improve code review efficiency by helping reviewers draft thoughtful comments, identifying potential bugs, suggesting improvements, and highlighting security or performance concerns.",
        "difficulty": "medium"
    },
    {
        "id": "q269",
        "domain": "responsible-ai",
        "question": "What does the Privacy and Security principle require organizations to do?",
        "options": [
            "Ignore data protection regulations",
            "Protect data, preserve confidentiality, and implement access controls and encryption",
            "Share all user data publicly",
            "Disable all security features for convenience"
        ],
        "correctAnswers": [1],
        "explanation": "Privacy and Security requires protecting data, preserving confidentiality, preventing unauthorized access, implementing encryption, secure development practices, and compliance with privacy regulations.",
        "difficulty": "easy"
    },
    {
        "id": "q270",
        "domain": "copilot-features",
        "question": "In what scenario would Copilot be most helpful for documentation?",
        "options": [
            "Copilot cannot help with documentation",
            "Generating README files, API documentation, and code comments from existing code",
            "Copilot only works for code generation, not documentation",
            "Documentation should never use AI-assisted tools"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can assist with documentation by generating comprehensive README files, API documentation, inline comments, and docstrings based on your code's structure and purpose.",
        "difficulty": "medium"
    },
    {
        "id": "q271",
        "domain": "responsible-ai",
        "question": "What does Accountability in AI mean?",
        "options": [
            "Machines make all decisions autonomously",
            "Humans and organizations remain responsible for AI outcomes with clear governance and oversight",
            "Developers are never accountable for AI systems",
            "Accountability is only for errors, not successes"
        ],
        "correctAnswers": [1],
        "explanation": "Accountability requires that people and organizations remain responsible for AI outcomes through governance structures, oversight processes, audit trails, and mechanisms to correct harmful behavior.",
        "difficulty": "medium"
    },
    {
        "id": "q272",
        "domain": "copilot-features",
        "question": "How does Copilot assist in learning new programming languages?",
        "options": [
            "It can only work with languages you already know",
            "It cannot assist with learning new languages",
            "It can provide syntax examples, explain patterns, and suggest idiomatic code for unfamiliar languages",
            "Learning a new language with AI is not recommended"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot can help developers learn new languages by explaining syntax, providing examples of idiomatic patterns, and suggesting solutions in unfamiliar language ecosystems.",
        "difficulty": "easy"
    },
    {
        "id": "q273",
        "domain": "responsible-ai",
        "question": "When implementing Inclusiveness in product design, what should be prioritized?",
        "options": [
            "Designing for the majority only",
            "Designing for accessibility so people with diverse abilities and backgrounds can use the product",
            "Excluding users who use assistive technology",
            "Inclusiveness is not important in software design"
        ],
        "correctAnswers": [1],
        "explanation": "Inclusiveness requires designing products that are accessible to people with diverse abilities, backgrounds, and cultures, including support for assistive technologies and diverse input/output methods.",
        "difficulty": "medium"
    },
    {
        "id": "q274",
        "domain": "copilot-features",
        "question": "What is an appropriate use case for Copilot in writing unit tests?",
        "options": [
            "Copilot cannot help with testing at all",
            "Generating test boilerplate, assertion templates, and edge case suggestions",
            "Replacing all human testing responsibilities",
            "Only for generating non-functional tests"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can accelerate test authoring by generating test templates, boilerplate, fixtures, and suggesting edge cases. However, developers remain responsible for test strategy, assertions, and coverage validation.",
        "difficulty": "medium"
    },
    {
        "id": "q275",
        "domain": "responsible-ai",
        "question": "What is a key requirement of the Transparency principle?",
        "options": [
            "Hiding how AI systems work",
            "Making it easy for users to understand how AI systems work and their limitations",
            "Only transparency is needed, security is not important",
            "Transparency applies only to government agencies"
        ],
        "correctAnswers": [1],
        "explanation": "Transparency requires providing clear information about how AI systems work, what data they use, their limitations and risks, and ensuring users can make informed decisions about relying on AI.",
        "difficulty": "easy"
    },
    {
        "id": "q276",
        "domain": "copilot-features",
        "question": "How can teams use Copilot to maintain consistent code style across a project?",
        "options": [
            "Copilot is incompatible with code style guides",
            "By providing style guide references in prompts and having Copilot generate code that follows established patterns",
            "All Copilot code automatically matches any style guide",
            "Code style is unimportant when using AI tools"
        ],
        "correctAnswers": [1],
        "explanation": "Teams can guide Copilot to maintain consistent code style by referencing style guides in prompts, providing examples, and reviewing suggestions to ensure they align with project conventions.",
        "difficulty": "medium"
    },
    {
        "id": "q277",
        "domain": "responsible-ai",
        "question": "What should organizations do to identify AI-related risks before deployment?",
        "options": [
            "Ignore risks and deploy immediately",
            "Conduct risk assessments, testing, and validation to identify potential harms",
            "Only test after deployment in production",
            "Risk assessment is unnecessary for AI systems"
        ],
        "correctAnswers": [1],
        "explanation": "Organizations should conduct comprehensive risk assessments, pre-deployment testing, validation studies, and bias evaluations to identify and mitigate potential harms before AI systems go live.",
        "difficulty": "medium"
    },
    {
        "id": "q278",
        "domain": "copilot-features",
        "question": "In which phase of the SDLC can Copilot provide value?",
        "options": [
            "Only in the development phase",
            "Only in the testing phase",
            "Throughout the SDLC: design, development, testing, documentation, and deployment",
            "Copilot cannot assist with any SDLC phase"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot provides value across the entire SDLC including design (architecture discussions), development (code generation), testing (test scaffolding), documentation (comments and READMEs), and deployment assistance.",
        "difficulty": "medium"
    },
    {
        "id": "q279",
        "domain": "responsible-ai",
        "question": "What is a best practice for handling AI-generated content in regulated industries?",
        "options": [
            "Use AI-generated content without any review or validation",
            "Never use AI-generated content in regulated industries",
            "Apply the same rigorous review, testing, and compliance checks as human-generated content",
            "Compliance reviews are optional for AI-generated content"
        ],
        "correctAnswers": [2],
        "explanation": "In regulated industries, AI-generated content must undergo the same rigorous compliance reviews, testing, validation, and approval processes as any other content to ensure regulatory adherence.",
        "difficulty": "hard"
    },
    {
        "id": "q280",
        "domain": "copilot-features",
        "question": "How can Copilot assist developers working on complex algorithms?",
        "options": [
            "It cannot help with algorithm development",
            "By explaining existing algorithms, suggesting optimization techniques, and helping verify algorithmic correctness",
            "Only for simple algorithms, not complex ones",
            "Algorithms should never use AI assistance"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can assist with complex algorithms by explaining how they work, suggesting optimizations, helping verify correctness through test cases, and explaining the reasoning behind algorithmic choices.",
        "difficulty": "medium"
    },
    {
        "id": "q281",
        "domain": "responsible-ai",
        "question": "What does it mean to implement human oversight in AI systems?",
        "options": [
            "Removing all human involvement",
            "Establishing processes where people can review, understand, and intervene in AI decisions",
            "Only supervisors need oversight of AI systems",
            "Oversight makes AI systems slower"
        ],
        "correctAnswers": [1],
        "explanation": "Human oversight means establishing governance structures where people can review AI decisions, understand how systems work, intervene when needed, and maintain control over critical decisions.",
        "difficulty": "medium"
    },
    {
        "id": "q282",
        "domain": "copilot-features",
        "question": "What is Copilot's role in accelerating code reviews?",
        "options": [
            "Copilot performs final code reviews that bypass human judgment",
            "Copilot cannot assist with code reviews",
            "Copilot can identify issues, suggest improvements, and draft review comments to accelerate human review",
            "Only automated tools, not AI, should review code"
        ],
        "correctAnswers": [2],
        "explanation": "Copilot can accelerate code reviews by identifying potential bugs, suggesting improvements, drafting thoughtful review comments, and highlighting security or performance concerns for human reviewers to consider.",
        "difficulty": "medium"
    },
    {
        "id": "q283",
        "domain": "responsible-ai",
        "question": "Which scenario demonstrates proper application of the Fairness principle?",
        "options": [
            "Training a model on biased historical data",
            "Auditing model outputs for bias across demographic groups and addressing disparities",
            "Assuming models are always fair by default",
            "Ignoring fairness concerns in favor of accuracy"
        ],
        "correctAnswers": [1],
        "explanation": "Proper Fairness implementation involves auditing models for biased outputs, measuring fairness metrics across groups, identifying disparities, and implementing mitigation strategies to ensure equitable treatment.",
        "difficulty": "medium"
    },
    {
        "id": "q284",
        "domain": "copilot-features",
        "question": "How should developers approach using Copilot for security-sensitive code?",
        "options": [
            "Accept all Copilot suggestions for security code without review",
            "Never use Copilot for security code",
            "Use Copilot but apply extra scrutiny, security reviews, and testing for sensitive code",
            "Security concerns are not important when using Copilot"
        ],
        "correctAnswers": [2],
        "explanation": "For security-sensitive code, developers should use Copilot as an assistant but apply heightened scrutiny including security reviews, threat modeling, penetration testing, and compliance verification before deployment.",
        "difficulty": "hard"
    },
    {
        "id": "q285",
        "domain": "responsible-ai",
        "question": "What should be included in a responsible AI governance framework?",
        "options": [
            "No oversight or governance is needed",
            "Only technical considerations, not business decisions",
            "Clear policies, accountability structures, risk assessment processes, and escalation procedures",
            "Governance is only needed for consumer-facing AI"
        ],
        "correctAnswers": [2],
        "explanation": "A responsible AI governance framework should include clear policies, defined roles and accountability, risk assessment and mitigation processes, escalation procedures, audit trails, and mechanisms for correction.",
        "difficulty": "hard"
    },
    {
        "id": "q286",
        "domain": "copilot-features",
        "question": "What is a limitation of Copilot that developers should be aware of?",
        "options": [
            "Copilot has no limitations",
            "It may suggest code based on training data patterns that could be incorrect, insecure, or outdated",
            "It works perfectly in all scenarios",
            "Limitations only apply to non-enterprise versions"
        ],
        "correctAnswers": [1],
        "explanation": "Developers should understand that Copilot's suggestions are based on training data patterns and may occasionally be incorrect, outdated, insecure, or inappropriate, requiring review and validation.",
        "difficulty": "medium"
    },
    {
        "id": "q287",
        "domain": "responsible-ai",
        "question": "How can teams measure and monitor Fairness in deployed AI systems?",
        "options": [
            "Fairness cannot be measured",
            "Collecting outcome data, computing fairness metrics across groups, and establishing monitoring dashboards",
            "Only checking fairness once during development",
            "Fairness monitoring is unnecessary after deployment"
        ],
        "correctAnswers": [1],
        "explanation": "Teams should collect outcome data, compute fairness metrics such as equalized odds or demographic parity, establish monitoring dashboards, and trigger alerts when fairness degrades.",
        "difficulty": "hard"
    },
    {
        "id": "q288",
        "domain": "copilot-features",
        "question": "What is the benefit of using Copilot for technical documentation?",
        "options": [
            "Copilot cannot help with documentation",
            "It speeds up documentation creation and helps keep docs synchronized with code changes",
            "Documentation should never use AI assistance",
            "Only developers can write good documentation"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can accelerate documentation by generating initial drafts, keeping documentation synchronized with code changes, and ensuring consistent documentation quality and completeness.",
        "difficulty": "easy"
    },
    {
        "id": "q289",
        "domain": "responsible-ai",
        "question": "What action should developers take if Copilot suggests code that violates security best practices?",
        "options": [
            "Use the suggestion anyway",
            "Reject the suggestion and ask Copilot to provide a secure alternative",
            "Assume Copilot always knows best",
            "Delete the repository to avoid risk"
        ],
        "correctAnswers": [1],
        "explanation": "When Copilot suggests code violating security best practices, developers should reject it, request alternatives, and enforce security requirements in their prompts to guide better suggestions.",
        "difficulty": "medium"
    },
    {
        "id": "q290",
        "domain": "copilot-features",
        "question": "How can Copilot support developers working across multiple programming languages?",
        "options": [
            "It only works with one language",
            "By providing syntax assistance, explaining patterns, and helping translate concepts between languages",
            "Developers should never switch languages",
            "Multi-language development is incompatible with Copilot"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot supports multi-language development by providing syntax assistance, explaining language-specific patterns, and helping developers apply concepts from one language to another.",
        "difficulty": "medium"
    },
    {
        "id": "q291",
        "domain": "responsible-ai",
        "question": "What is the relationship between Transparency and Accountability in AI systems?",
        "options": [
            "They are unrelated concepts",
            "Transparency enables accountability by making systems understandable for oversight and intervention",
            "Accountability makes transparency unnecessary",
            "Neither principle is important"
        ],
        "correctAnswers": [1],
        "explanation": "Transparency and Accountability are complementary: transparency provides the visibility needed for accountability, allowing people to understand how systems work and take responsibility for outcomes.",
        "difficulty": "hard"
    },
    {
        "id": "q292",
        "domain": "copilot-features",
        "question": "What should be the developer's approach to Copilot-generated tests?",
        "options": [
            "Use them directly in production without modification",
            "Review, validate, enhance for edge cases, and ensure coverage before relying on them",
            "Never review Copilot-generated tests",
            "Copilot cannot generate valid tests"
        ],
        "correctAnswers": [1],
        "explanation": "Developers should review Copilot-generated tests, validate they actually test the intended behavior, enhance them for edge cases and error conditions, and verify adequate coverage.",
        "difficulty": "medium"
    },
    {
        "id": "q293",
        "domain": "responsible-ai",
        "question": "How should privacy considerations be incorporated into the design phase of AI systems?",
        "options": [
            "Privacy should be added only during deployment",
            "Privacy-by-design approach: minimize data collection, anonymize when possible, and implement security from the start",
            "Privacy is less important than functionality",
            "Privacy can be ignored if the system is internal only"
        ],
        "correctAnswers": [1],
        "explanation": "Privacy should be a first-class design consideration from the start, using privacy-by-design approaches including data minimization, anonymization, encryption, and security implementation.",
        "difficulty": "medium"
    },
    {
        "id": "q294",
        "domain": "copilot-features",
        "question": "In what way can Copilot improve developer productivity for repetitive tasks?",
        "options": [
            "It cannot help with repetitive tasks",
            "By automating common patterns and boilerplate, freeing developers to focus on complex logic",
            "Productivity always decreases when using AI tools",
            "Repetitive tasks should never use automation"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot significantly improves productivity for repetitive tasks like boilerplate generation, configuration file creation, and common patterns, allowing developers to focus on unique, complex problems.",
        "difficulty": "easy"
    },
    {
        "id": "q295",
        "domain": "responsible-ai",
        "question": "What should organizations monitor regarding AI system performance over time?",
        "options": [
            "Nothing, systems work the same after deployment",
            "Accuracy drift, fairness degradation, security vulnerabilities, and user feedback changes",
            "Only monitor for errors, not performance",
            "Monitoring is only needed during development"
        ],
        "correctAnswers": [1],
        "explanation": "Organizations should continuously monitor deployed AI systems for accuracy drift, fairness degradation, emerging security vulnerabilities, and changing user feedback to maintain system quality.",
        "difficulty": "hard"
    },
    {
        "id": "q296",
        "domain": "copilot-features",
        "question": "How does context awareness improve Copilot's code suggestions?",
        "options": [
            "Copilot has no context awareness",
            "By understanding the surrounding code, file structure, and project patterns to provide relevant suggestions",
            "Context awareness makes suggestions less accurate",
            "Only IDEs with context awareness can use Copilot"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot's context awareness, which includes understanding surrounding code, open files, project structure, and patterns, significantly improves the relevance and quality of its suggestions.",
        "difficulty": "medium"
    },
    {
        "id": "q297",
        "domain": "responsible-ai",
        "question": "What is a red flag indicating potential bias in an AI system?",
        "options": [
            "There are no red flags for bias",
            "Significantly different error rates or outcomes across demographic groups",
            "More users from one demographic group",
            "Red flags are subjective and cannot be measured"
        ],
        "correctAnswers": [1],
        "explanation": "Red flags for bias include significantly different performance metrics, error rates, or outcomes across demographic groups, which indicates the system may be treating groups inequitably.",
        "difficulty": "medium"
    },
    {
        "id": "q298",
        "domain": "copilot-features",
        "question": "What is Copilot's role in the debugging process?",
        "options": [
            "Copilot cannot assist with debugging",
            "By analyzing error messages and code to suggest fixes and help developers understand issues",
            "Copilot automatically fixes all bugs",
            "Debugging should never involve AI tools"
        ],
        "correctAnswers": [1],
        "explanation": "Copilot can assist debugging by analyzing error messages, stack traces, and problematic code to suggest potential fixes and help developers understand root causes.",
        "difficulty": "easy"
    },
    {
        "id": "q299",
        "domain": "responsible-ai",
        "question": "How should organizations respond when an AI system produces a harmful or biased output?",
        "options": [
            "Ignore the issue and continue operating",
            "Document the incident, investigate root cause, implement fixes, and establish monitoring to prevent recurrence",
            "Blame the technology instead of taking corrective action",
            "Harmful outputs are acceptable costs of using AI"
        ],
        "correctAnswers": [1],
        "explanation": "Organizations should have incident response procedures including documentation, root cause analysis, corrective actions, rollback capabilities, and mechanisms to prevent future occurrences.",
        "difficulty": "hard"
    },
    {
        "id": "q300",
        "domain": "copilot-features",
        "question": "What is the most important principle developers should follow when using Copilot?",
        "options": [
            "Trust Copilot completely without verification",
            "Never use Copilot suggestions",
            "Use Copilot as an accelerator while maintaining responsibility for code quality, security, and correctness",
            "Copilot should make all coding decisions"
        ],
        "correctAnswers": [2],
        "explanation": "The key principle is that Copilot is a productivity tool that accelerates development, but developers remain fully responsible for reviewing, testing, validating, and ensuring all code meets quality and security standards.",
        "difficulty": "medium"
    }
]

# Load existing questions
with open('server/data/questions.json', 'r', encoding='utf-8') as f:
    existing_questions = json.load(f)

# Combine existing and new questions
all_questions = existing_questions + additional_questions

# Save the updated questions
with open('server/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"Updated questions.json with {len(all_questions)} total questions")
print(f"- Existing: {len(existing_questions)}")
print(f"- Added: {len(additional_questions)}")
print(f"- Total: {len(all_questions)}")

# Verify domains
domains = {}
for q in all_questions:
    domain = q['domain']
    domains[domain] = domains.get(domain, 0) + 1

print("\nDomain breakdown:")
for domain, count in sorted(domains.items()):
    print(f"  {domain}: {count}")
