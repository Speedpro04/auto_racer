import os
import re

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            classes = re.findall(r'className="([^"]+)"', content)
            classes += re.findall(r'className=\{`([^`]+)`\}', content)
            for c in classes:
                if 'bg-[#1dd1a1]' in c:
                    if 'text-white' in c or 'text-black' not in c:
                        print(f"File: {filepath} \nClass: {c}\n")
