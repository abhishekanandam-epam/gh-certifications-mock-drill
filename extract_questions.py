#!/usr/bin/env python3
"""
Script to extract 300 questions from GitHub gh-300 repository
and convert them to JSON format for local questions.json
"""

import json
import re
import urllib.request
from typing import List, Dict, Any

def fetch_file_content(owner: str, repo: str, path: str) -> str:
    """Fetch file content from GitHub raw content URL"""
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{path}"
    try:
        with urllib.request.urlopen(url) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {path}: {e}")
        return None

def extract_questions_from_markdown(content: str) -> List[Dict[str, Any]]:
    """
    Extract questions from markdown format used in gh-300 repository.
    Format:
    **Question:** [ID]
    Question text...
    **Options:**  
    A. Option A  
    B. Option B  
    ...
    **Correct Answer(s):** A, B (or just B)
    **Explanation:** ...
    """
    questions = []
    
    # Split by question markers - look for the pattern more carefully
    # Find all questions by looking for **Question:** [number]
    pattern = r'\*\*Question:\*\*\s*\[(\d+)\]\s*\n(.+?)(?=\*\*Question:\*\*\s*\[|$)'
    question_matches = re.finditer(pattern, content, re.DOTALL)
    
    for match in question_matches:
        try:
            q_id = f"q{match.group(1).zfill(3)}"
            block = match.group(0)
            
            # Extract question text (after ID, before Options)
            question_text_match = re.search(
                r'\*\*Question:\*\*\s*\[\d+\]\s*\n(.+?)\n\*\*Options:\*\*',
                block,
                re.DOTALL
            )
            if not question_text_match:
                continue
            question_text = question_text_match.group(1).strip()
            # Clean up the text
            question_text = re.sub(r'\s+', ' ', question_text)
            
            # Extract options - handle multiline options
            options_match = re.search(
                r'\*\*Options:\*\*\s*\n(.*?)(?:\n\*\*Correct Answer|$)',
                block,
                re.DOTALL
            )
            if not options_match:
                continue
            
            options_text = options_match.group(1)
            
            # Parse options more carefully - they can span multiple lines
            options = []
            # Split by lines starting with A, B, C, D
            lines = options_text.split('\n')
            current_option = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if this line starts a new option
                match_opt = re.match(r'^([A-D])\.\s+(.*)$', line)
                if match_opt:
                    # Save previous option
                    if current_option:
                        options.append(current_option)
                    current_option = match_opt.group(2)
                elif current_option is not None:
                    # Continue previous option
                    current_option += " " + line
            
            # Don't forget the last option
            if current_option:
                options.append(current_option)
            
            # Clean up options
            options = [re.sub(r'\*\*(.+?)\*\*', r'\1', opt).strip() for opt in options]
            options = [re.sub(r'\s+', ' ', opt) for opt in options]
            
            if len(options) < 1:
                continue
            
            # Extract correct answers
            correct_match = re.search(
                r'\*\*Correct Answer\(s\):\*\*\s*([A-D](?:,\s*[A-D])*)',
                block
            )
            if not correct_match:
                continue
            
            correct_answers_str = correct_match.group(1)
            # Convert letter answers to indices (A=0, B=1, C=2, D=3)
            correct_indices = []
            for ans in correct_answers_str.split(','):
                ans = ans.strip()
                idx = ord(ans) - ord('A')
                correct_indices.append(idx)
            
            # Extract explanation
            explanation_match = re.search(
                r'\*\*Explanation:\*\*\s*\n(.*?)(?:\n\*\*Tips and Tricks:|$)',
                block,
                re.DOTALL
            )
            explanation = ""
            if explanation_match:
                explanation = explanation_match.group(1).strip()
                # Remove markdown formatting for cleaner text
                explanation = re.sub(r'\*\*(.+?)\*\*', r'\1', explanation)
                # Normalize whitespace
                explanation = re.sub(r'\s+', ' ', explanation)
            
            # Determine domain based on question content
            domain = "general"  # Default domain
            text_lower = (question_text + " " + explanation).lower()
            
            if any(word in text_lower for word in ['responsible', 'ai', 'fairness', 'bias', 'ethical', 'privacy', 'transparency', 'accountability']):
                domain = "responsible-ai"
            elif any(word in text_lower for word in ['suggestion', 'chat', 'copilot', 'completion', 'prompt', 'test', 'debug']):
                domain = "copilot-features"
            elif any(word in text_lower for word in ['governance', 'policy', 'admin', 'enterprise']):
                domain = "governance"
            elif any(word in text_lower for word in ['pull request', 'review', 'github.com', 'workflow']):
                domain = "github-workflow"
            
            # Determine difficulty
            difficulty = "medium"  # Default
            if "Which of the following is NOT" in question_text or "Which of the following is not" in question_text:
                difficulty = "medium"
            elif len(question_text) > 150:
                difficulty = "hard"
            else:
                difficulty = "easy"
            
            question = {
                "id": q_id,
                "domain": domain,
                "question": question_text,
                "options": options,
                "correctAnswers": correct_indices,
                "explanation": explanation,
                "difficulty": difficulty
            }
            
            questions.append(question)
            
        except Exception as e:
            print(f"Error parsing question {q_id}: {e}")
            continue
    
    return questions

def main():
    """Main function to fetch and convert all questions"""
    
    owner = "ElmentorProgram"
    repo = "gh-300"
    
    # List of detailed practice test files (1-10)
    detailed_test_files = [
        f"source/docs/practice/detailed/{i:02d}-practice-test.detailed.md"
        for i in range(1, 11)
    ]
    
    # List of raw practice test files (1-3)
    raw_test_files = [
        f"source/docs/practice/raw/{i:02d}-practice-test.raw.md"
        for i in range(1, 4)
    ]
    
    all_questions = []
    
    print("Fetching and parsing questions from GitHub repository...")
    
    print("\n=== Processing Detailed Practice Tests ===")
    for test_file in detailed_test_files:
        print(f"Processing {test_file}...")
        content = fetch_file_content(owner, repo, test_file)
        
        if content:
            questions = extract_questions_from_markdown(content)
            all_questions.extend(questions)
            print(f"  Extracted {len(questions)} questions")
    
    print(f"\nDetailed tests total: {len(all_questions)} questions")
    
    # Note: Raw practice tests have a different format without explanations
    # They are typically just Q&A with answers, not detailed explanations
    # For now, focus on detailed tests which have complete information
    
    print(f"\nTotal questions extracted: {len(all_questions)}")
    
    # Deduplicate by question ID
    seen_ids = set()
    unique_questions = []
    for q in all_questions:
        if q['id'] not in seen_ids:
            unique_questions.append(q)
            seen_ids.add(q['id'])
    
    print(f"After deduplication: {len(unique_questions)} unique questions")
    
    # Save to local file
    output_path = "server/data/questions.json"
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(unique_questions, f, indent=2, ensure_ascii=False)
        print(f"\nSuccessfully saved {len(unique_questions)} questions to {output_path}")
    except Exception as e:
        print(f"Error saving to file: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
