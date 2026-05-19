import os
import re

def fix_buttons_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def replacer(match):
        class_name = match.group(0)
        
        changed = False
        
        # 1. Any button with hover:bg-white MUST have hover:text-black and NOT hover:text-white
        if 'hover:bg-white' in class_name and 'hover:bg-white/' not in class_name:
            if 'hover:text-white' in class_name:
                class_name = class_name.replace('hover:text-white', 'hover:text-black')
                changed = True
            elif 'hover:text-black' not in class_name:
                class_name = class_name.replace('hover:bg-white', 'hover:bg-white hover:text-black')
                changed = True

        # 2. For the green buttons (bg-[#1dd1a1]), they must be text-black by default
        # because the user said "Mas o texto esta branco tmb, deixo o texto preto"
        # We replace text-white with text-black if it exists, and if there is no text color, we add text-black.
        # But let's be careful not to mess up backgrounds that are transparent like bg-[#1dd1a1]/10
        if 'bg-[#1dd1a1]' in class_name and 'bg-[#1dd1a1]/' not in class_name:
            if 'text-white' in class_name:
                class_name = class_name.replace('text-white', 'text-black')
                changed = True
            elif 'text-black' not in class_name and 'text-[#' not in class_name:
                class_name = class_name.replace('bg-[#1dd1a1]', 'bg-[#1dd1a1] text-black')
                changed = True

        # 3. For any class that has hover:bg-white and text-white, it means default is white, and hover is white bg.
        # Ensure it has hover:text-black (already handled in step 1).

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
