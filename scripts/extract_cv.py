from pathlib import Path
from pypdf import PdfReader

pdf_path = Path(__file__).resolve().parent.parent / "CV_Jackie Tung.pdf"

reader = PdfReader(str(pdf_path))
text = "\n\n".join(page.extract_text() or '' for page in reader.pages)

# Basic cleanup
lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
text_clean = "\n".join(lines)

print("===== RAW TEXT START =====")
print(text_clean)
print("===== RAW TEXT END =====")
