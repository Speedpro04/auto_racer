import os
import re

def fix_buttons_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex para encontrar className="..." que tenham bg-[#1dd1a1] e hover:bg-white
    # e não tenham hover:text-black
    
    def replacer(match):
        class_name = match.group(0)
        if 'bg-[#1dd1a1]' in class_name and 'hover:bg-white' in class_name and 'hover:text-black' not in class_name:
            # Inserir hover:text-black logo após hover:bg-white
            return class_name.replace('hover:bg-white', 'hover:bg-white hover:text-black')
        return class_name

    new_content = re.sub(r'className="[^"]+"', replacer, content)
    new_content = re.sub(r"className=\{`[^`]+`\}", replacer, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            fix_buttons_in_file(filepath)
