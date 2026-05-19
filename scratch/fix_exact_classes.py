import os
import re

def fix_classes(class_str):
    classes = class_str.split()
    changed = False

    # Check for hover:bg-white (exact match)
    has_hover_bg_white = 'hover:bg-white' in classes
    has_bg_green = 'bg-[#1dd1a1]' in classes

    if has_hover_bg_white:
        if 'hover:text-white' in classes:
            classes = ['hover:text-black' if c == 'hover:text-white' else c for c in classes]
            changed = True
        elif 'hover:text-black' not in classes:
            # Add hover:text-black right after hover:bg-white
            idx = classes.index('hover:bg-white')
            classes.insert(idx + 1, 'hover:text-black')
            changed = True

    if has_bg_green:
        if 'text-white' in classes:
            classes = ['text-black' if c == 'text-white' else c for c in classes]
            changed = True
        elif 'text-black' not in classes:
            # Need to add text-black unless it has some other text color
            has_other_text_color = any(c.startswith('text-') and c != 'text-center' and c != 'text-left' and c != 'text-right' and c != 'text-justify' for c in classes if c not in ['text-sm', 'text-xs', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-[10px]', 'text-[11px]', 'text-[12px]', 'text-[13px]', 'text-[15px]'])
            if not has_other_text_color:
                idx = classes.index('bg-[#1dd1a1]')
                classes.insert(idx + 1, 'text-black')
                changed = True

    return " ".join(classes), changed

def fix_buttons_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def replacer(match):
        class_name = match.group(1)
        new_classes, changed = fix_classes(class_name)
        if changed:
            return match.group(0).replace(class_name, new_classes)
        return match.group(0)

    new_content = re.sub(r'className="([^"]+)"', replacer, content)
    new_content = re.sub(r"className=\{`([^`]+)`\}", replacer, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            fix_buttons_in_file(filepath)
