import json, shutil, html
from pathlib import Path

SITE_TITLE = "2026 Artwork Gallery"
TAGLINE = "Explore the artworks, then vote for your favourite!"
VOTE_URL = "https://forms.gle/your-form-link"   # change this later
SRC, OUT = Path("artworks"), Path("_site")

CSS = """
:root {
  --navy: #0b2545;
  --blue: #1d4ed8;
  --sky: #38bdf8;
  --pale: #e8f1fd;
  --mist: #cfe3fb;
  --ink: #12263f;
}
* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, var(--pale) 0%, var(--mist) 100%) fixed;
}

/* ---------- Banner ---------- */
header.site {
  width: 100%;
  padding: 3rem 1rem 3.5rem;
  color: #fff;
  background: linear-gradient(135deg, var(--navy), var(--blue) 60%, var(--sky));
  border-radius: 0 0 50% 50% / 0 0 40px 40px;
  box-shadow: 0 6px 20px rgba(11, 37, 69, 0.3);
}
header.site h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
.tagline, .artist {
  margin: 0.6rem 0 0;
  font-size: 1.15rem;
  opacity: 0.92;
}

/* ---------- Layout ---------- */
main {
  width: 100%;
  max-width: 1100px;
  flex: 1;
  padding: 2.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---------- Gallery grid ---------- */
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.75rem;
}
.card {
  width: 220px;
  background: #fff;
  border-radius: 16px;
  border-bottom: 4px solid var(--sky);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 14px rgba(11, 37, 69, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover, .card:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.3);
  outline: none;
}
.card img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: var(--mist);
}
.card span {
  display: block;
  padding: 0.9rem 0.6rem;
  font-weight: 600;
  color: var(--navy);
}

/* ---------- Artwork page ---------- */
.frame {
  max-width: 100%;
  padding: 12px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(11, 37, 69, 0.25);
}
.frame iframe, .frame video, .frame img {
  display: block;
  max-width: 100%;
  border: 0;
  border-radius: 10px;
}
.desc {
  max-width: 650px;
  margin-top: 2rem;
  font-size: 1.1rem;
  line-height: 1.7;
}

/* ---------- Buttons ---------- */
.back {
  display: inline-block;
  margin-bottom: 1.2rem;
  padding: 0.4rem 1rem;
  color: #fff;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  transition: background 0.2s ease;
}
.back:hover { background: rgba(255, 255, 255, 0.2); }

.vote {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.85rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, var(--blue), var(--sky));
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(29, 78, 216, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.vote:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 20px rgba(29, 78, 216, 0.5);
}

footer {
  width: 100%;
  padding: 1.5rem 1rem;
  color: #fff;
  background: var(--navy);
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}

/* ---------- Previous / Next ---------- */
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
}
.pg {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  max-width: 220px;
  padding: 0.7rem 1.2rem;
  color: var(--navy);
  font-weight: 700;
  text-decoration: none;
  background: #fff;
  border-bottom: 4px solid var(--sky);
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(11, 37, 69, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pg small {
  max-width: 100%;
  margin-top: 0.2rem;
  overflow: hidden;
  font-weight: 400;
  color: #4b6584;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pg:hover, .pg:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(29, 78, 216, 0.3);
  outline: none;
}
.count { font-weight: 600; color: var(--navy); }
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

# First pass: read every artwork's info so each page knows its neighbours
artworks = []
for folder in sorted(p for p in SRC.iterdir() if p.is_dir()):
    slug = folder.name
    info_file = folder / "info.json"
    info = json.loads(info_file.read_text(encoding="utf-8")) if info_file.exists() else {}
    artworks.append({
        "folder": folder,
        "slug": slug,
        "title": info.get("title", slug.replace("-", " ").title()),
        "artist": info.get("artist", ""),
        "description": info.get("description", ""),
    })

total = len(artworks)
cards = []

# Second pass: build each artwork page
for i, art in enumerate(artworks):
    folder, slug, title = art["folder"], art["slug"], art["title"]
    desc = "".join(f"<p>{esc(p)}</p>" for p in art["description"].split("\n\n") if p.strip())
    byline = f'<p class="artist">by {esc(art["artist"])}</p>' if art["artist"] else ""

    # Neighbours (wraps around: Previous on the first goes to the last, and vice versa)
    prev_art = artworks[(i - 1) % total]
    next_art = artworks[(i + 1) % total]

    if total > 1:
        pager = f"""<nav class="pager">
    <a class="pg" href="../{prev_art['slug']}/" rel="prev">&larr; Previous<small>{esc(prev_art['title'])}</small></a>
    <span class="count">{i + 1} of {total}</span>
    <a class="pg" href="../{next_art['slug']}/" rel="next">Next &rarr;<small>{esc(next_art['title'])}</small></a>
  </nav>"""
        keys = f"""<script>
document.addEventListener("keydown", function (e) {{
  if (e.key === "ArrowLeft") location.href = "../{prev_art['slug']}/";
  if (e.key === "ArrowRight") location.href = "../{next_art['slug']}/";
}});
</script>"""
    else:
        pager = keys = ""

    dest = OUT / "artworks" / slug
    shutil.copytree(folder, dest)

    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} | {esc(SITE_TITLE)}</title>
<link rel="stylesheet" href="../../style.css"></head>
<body>
<header class="site">
  <a class="back" href="../../">&larr; All artworks</a>
  <h1>{esc(title)}</h1>
  {byline}
</header>
<main>
  <div class="frame">{media(folder)}</div>
  <div class="desc">{desc}</div>
  <a class="vote" href="{esc(VOTE_URL)}" target="_blank" rel="noopener">&#11088; Vote for this artwork</a>
  {pager}
</main>
<footer>{esc(SITE_TITLE)}</footer>
{keys}
</body></html>"""
    (dest / "index.html").write_text(page, encoding="utf-8")

    thumb = find(folder, "thumb", ["png", "jpg", "jpeg", "webp", "gif"])
    img = f'<img src="artworks/{slug}/{thumb}" alt="{esc(title)}" loading="lazy">' if thumb else '<img alt="">'
    cards.append(f'<a class="card" href="artworks/{slug}/">{img}<span>{esc(title)}</span></a>')

grid = "".join(cards)
index = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(SITE_TITLE)}</title>
<link rel="stylesheet" href="style.css"></head>
<body>
<header class="site">
  <h1>{esc(SITE_TITLE)}</h1>
  <p class="tagline">{esc(TAGLINE)}</p>
</header>
<main>
  <div class="grid">{grid}</div>
</main>
<footer>{esc(SITE_TITLE)}</footer>
</body></html>"""
(OUT / "index.html").write_text(index, encoding="utf-8")
print(f"Built {total} artworks")
