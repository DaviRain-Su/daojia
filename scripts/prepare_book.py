#!/usr/bin/env python3
import json
import re
import subprocess
from pathlib import Path


ROOT = Path("/Users/davirian/dev/daojia")
OCR_PDF = ROOT / "data/raw/qitiyuanliu.ocr.pdf"
FULL_TXT = ROOT / "data/raw/qitiyuanliu.full.txt"
PAGES_DIR = ROOT / "data/raw/pages"
CHAPTERS_JSON = ROOT / "data/processed/chapters.json"
CHAPTERS_DIR = ROOT / "data/processed/chapters"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)

def get_page_count(pdf: Path) -> int:
    info = subprocess.check_output(["pdfinfo", str(pdf)], text=True, encoding="utf-8", errors="ignore")
    match = re.search(r"^Pages:\s+(\d+)", info, flags=re.MULTILINE)
    if not match:
        raise RuntimeError("Unable to detect page count from pdfinfo")
    return int(match.group(1))


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def chapter_title(line: str) -> str | None:
    s = line.strip()
    if not s:
        return None
    if re.match(r"^第[一二三四五六七八九十百千0-9]+[章节回讲部卷篇]", s):
        return s
    if re.match(r"^[0-9]{1,3}[\.、]\s*\S+", s):
        return s
    return None


def split_chapters(text: str, page_count: int) -> list[dict]:
    lines = text.splitlines()
    starts: list[tuple[int, str]] = []
    for i, line in enumerate(lines):
        title = chapter_title(line)
        if title:
            starts.append((i, title))

    if not starts:
        return [{
            "id": "chapter-001",
            "title": "全书正文",
            "content": text.strip(),
            "sourcePageStart": 1,
            "sourcePageEnd": page_count,
        }]

    chapters = []
    for idx, (start_line, title) in enumerate(starts):
        end_line = starts[idx + 1][0] if idx + 1 < len(starts) else len(lines)
        content = "\n".join(lines[start_line:end_line]).strip()
        if len(content) < 60:
            continue
        chapters.append({
            "id": f"chapter-{len(chapters)+1:03d}",
            "title": title,
            "content": content,
            "sourcePageStart": None,
            "sourcePageEnd": None,
        })

    if not chapters:
        chapters = [{
            "id": "chapter-001",
            "title": "全书正文",
            "content": text.strip(),
            "sourcePageStart": 1,
            "sourcePageEnd": page_count,
        }]
    return chapters


def main() -> None:
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)

    page_count = get_page_count(OCR_PDF)
    run(["pdftotext", "-layout", str(OCR_PDF), str(FULL_TXT)])
    for page in range(1, page_count + 1):
        out_file = PAGES_DIR / f"page-{page:03d}.txt"
        run(["pdftotext", "-layout", "-f", str(page), "-l", str(page), str(OCR_PDF), str(out_file)])

    clean = clean_text(FULL_TXT.read_text(encoding="utf-8", errors="ignore"))
    FULL_TXT.write_text(clean, encoding="utf-8")

    chapters = split_chapters(clean, page_count)
    if len(chapters) <= 1:
        chapters = []
        for page in range(1, page_count + 1):
            page_file = PAGES_DIR / f"page-{page:03d}.txt"
            content = clean_text(page_file.read_text(encoding="utf-8", errors="ignore"))
            if len(content.strip()) < 20:
                continue
            chapters.append({
                "id": f"page-{page:03d}",
                "title": f"第 {page} 页",
                "content": content,
                "sourcePageStart": page,
                "sourcePageEnd": page,
            })
    CHAPTERS_JSON.write_text(
        json.dumps(chapters, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    for chapter in chapters:
        md = f"# {chapter['title']}\n\n{chapter['content']}\n"
        (CHAPTERS_DIR / f"{chapter['id']}.md").write_text(md, encoding="utf-8")

    print(f"chapters: {len(chapters)}")


if __name__ == "__main__":
    main()
