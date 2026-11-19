import json, shutil, html
from pathlib import Path

SITE_TITLE = "2026 Artwork Gallery"
VOTE_URL = "https://forms.gle/your-form-link"   # change this later
SRC, OUT = Path("artworks"), Path("_site")

CSS = """
body{font-family:sans-serif;max-width:1000px;margin:2rem auto;padding:0 1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
.grid a{text-decoration:none;color:inherit}
.grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;background:#eee}
iframe,video,.art img{max-width:100%;border:0}
.artist{color:#666}
.vote{display:inline-block;padding:.6rem 1rem;background:#222;color:#fff;border-radius:6px;text-decoration:none}
"""

def esc(s):
    return html.escape(str(s), quote=True)

def find(folder, stem, exts):
    for e in exts:
        if (folder / f"{stem}.{e}").exists():
            return f"{stem}.{e}"
    return None

def media(folder):
    if (folder / "sketch" / "index.html").exists():
        return '<iframe src="sketch/index.html" width="800" height="600"></iframe>'
    video = find(folder, "sketch", ["mp4", "webm"])
    if video:
        return f'<video src="{video}" controls loop muted playsinline></video>'
    img = find(folder, "sketch", ["gif", "png", "jpg", "jpeg", "webp"])
    if img:
        return f'<img src="{img}" alt="">'
    return "<p>(No sketch found in this folder)</p>"

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
(OUT / "style.css").write_text(CSS)

cards = []
for folder in sorted(p for p in SRC.iterdir() if p.is_dir()):
    slug = folder.name
    info_file = folder / "info.json"
    info = json.loads(info_file.read_text(encoding="utf-8")) if info_file.exists() else {}
    title = info.get("title", slug.replace("-", " ").title())
    artist = info.get("artist", "")
    desc = "".join(f"<p>{esc(p)}</p>" for p in info.get("description", "").split("\n\n") if p.strip())

    dest = OUT / "artworks" / slug
    shutil.copytree(folder, dest)

    page = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} | {esc(SITE_TITLE)}</title>
<link rel="stylesheet" href="../../style.css"></head>
<body>
<p><a href="../../">← All artworks</a></p>
<h1>{esc(title)}</h1>
<p class="artist">{"by " + esc(artist) if artist else ""}</p>
<div class="art">{media(folder)}</div>
{desc}
<p><a class="vote" href="{esc(VOTE_URL)}" target="_blank">Vote for this artwork</a></p>
</body></html>"""
    (dest / "index.html").write_text(page, encoding="utf-8")

    thumb = find(folder, "thumb", ["png", "jpg", "jpeg", "webp", "gif"])
    img = f'<img src="artworks/{slug}/{thumb}" alt="{esc(title)}" loading="lazy">' if thumb else '<img alt="">'
    cards.append(f'<a href="artworks/{slug}/">{img}<span>{esc(title)}</span></a>')

index = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(SITE_TITLE)}</title>
<link rel="stylesheet" href="style.css"></head>
<body><h1>{esc(SITE_TITLE)}</h1>
<div class="grid">{"".join(cards)}</div>
</body></html>"""
(OUT / "index.html").write_text(index, encoding="utf-8")
print(f"Built {len(cards)} artworks")
