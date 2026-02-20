import os
import glob
import xml.etree.ElementTree as ET
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROJECTS_DIR = PROJECT_ROOT / "projects"
IDEA_DIR = PROJECT_ROOT / ".idea"
MODULES_XML = IDEA_DIR / "modules.xml"

def get_project_name_from_file(filepath):
    filename = os.path.basename(filepath)
    name, _ = os.path.splitext(filename) # remove .yml
    name, _ = os.path.splitext(name) # remove .project
    return name

def normalize_name(name):
    return name.replace("-", "_")

def generate_iml_content(module_name):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<module type="PYTHON_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <sourceFolder url="file://$MODULE_DIR$" isTestSource="false" />
    </content>
    <orderEntry type="jdk" jdkName="Python 3.12" jdkType="Python SDK" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>"""

def update_modules_xml(new_modules):
    tree = ET.parse(MODULES_XML)
    root = tree.getroot()
    modules_component = root.find("component[@name='ProjectModuleManager']")
    if modules_component is None:
        modules_component = ET.SubElement(root, "component", name="ProjectModuleManager")

    modules_list = modules_component.find("modules")
    if modules_list is None:
        modules_list = ET.SubElement(modules_component, "modules")

    existing_modules = set()
    for module in modules_list.findall("module"):
        filepath = module.get("filepath")
        if filepath:
            existing_modules.add(filepath)

    for module_path in new_modules:
        relative_path = os.path.relpath(module_path, PROJECT_ROOT)
        project_dir_rel = f"$PROJECT_DIR$/{relative_path}"

        if project_dir_rel not in existing_modules:
            print(f"Adding module: {relative_path}")
            ET.SubElement(modules_list, "module", fileurl=f"file://{project_dir_rel}", filepath=project_dir_rel)
            existing_modules.add(project_dir_rel) # prevent duplicates
        else:
            print(f"Module already exists: {relative_path}")

    # Write back to file with pretty formatting (simple indent)
    ET.indent(tree, space="  ", level=0)
    tree.write(MODULES_XML, encoding="UTF-8", xml_declaration=True)

def main():
    print(f"Scanning projects in {PROJECTS_DIR}...")
    project_files = glob.glob(str(PROJECTS_DIR / "*.project.yml"))
    new_modules = []

    for project_file in project_files:
        if "_template.project.yml" in project_file:
            continue

        project_name = get_project_name_from_file(project_file)
        print(f"Processing project: {project_name}")

        # Determine directory name
        normalized_name = normalize_name(project_name)
        target_dir = PROJECT_ROOT / normalized_name

        if not target_dir.exists():
            # Check if hyphenated version exists
            hyphenated_dir = PROJECT_ROOT / project_name
            if hyphenated_dir.exists():
                target_dir = hyphenated_dir
                normalized_name = project_name # Keep hyphenated name for module file if directory is hyphenated
            else:
                print(f"Creating directory: {target_dir}")
                target_dir.mkdir(parents=True, exist_ok=True)

        # Create .iml file
        iml_filename = f"{normalized_name}.iml"
        iml_path = target_dir / iml_filename

        if not iml_path.exists():
            print(f"Creating .iml file: {iml_path}")
            with open(iml_path, "w") as f:
                f.write(generate_iml_content(normalized_name))
        else:
            print(f".iml file exists: {iml_path}")

        new_modules.append(str(iml_path))

    if new_modules:
        print("Updating modules.xml...")
        update_modules_xml(new_modules)
    else:
        print("No new modules found.")

if __name__ == "__main__":
    main()
