#!/usr/bin/env python3
import json
import sys

try:
    with open('server/data/questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Total questions: {len(data)}")
    print(f"First 5 IDs: {[q['id'] for q in data[:5]]}")
    print(f"Last 5 IDs: {[q['id'] for q in data[-5:]]}")
    
    # Check domains
    domains = {}
    for q in data:
        domain = q.get('domain', 'unknown')
        domains[domain] = domains.get(domain, 0) + 1
    
    print(f"\nDomains breakdown:")
    for domain, count in sorted(domains.items()):
        print(f"  {domain}: {count}")
        
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
