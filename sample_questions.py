#!/usr/bin/env python3
import json

with open('server/data/questions.json', encoding='utf-8') as f:
    data = json.load(f)

print("Sample Questions:")
print("=" * 80)

for i in [0, 100, 200, 254]:
    q = data[i]
    print(f"\nQuestion ID: {q['id']}")
    print(f"Domain: {q['domain']}")
    print(f"Difficulty: {q['difficulty']}")
    print(f"Question: {q['question'][:100]}...")
    print(f"Number of options: {len(q['options'])}")
    print(f"Correct answer indices: {q['correctAnswers']}")
    print(f"Explanation: {q['explanation'][:100]}...")
    print("-" * 80)
