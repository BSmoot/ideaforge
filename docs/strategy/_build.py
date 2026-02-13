import pathlib

doc_path = pathlib.Path("C:/Users/bsmoo/projects/ideaforge/docs/strategy/strategy-document.md")
doc_path.parent.mkdir(parents=True, exist_ok=True)

# Read the template file and write it
template_path = pathlib.Path("C:/Users/bsmoo/projects/ideaforge/docs/strategy/_template.md")
content = template_path.read_text(encoding="utf-8")
doc_path.write_text(content, encoding="utf-8")
print(f"Written {len(content)} chars")