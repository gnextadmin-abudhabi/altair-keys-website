#!/usr/bin/env python3
"""Re-optimize WebP images for web — smaller, faster."""
import subprocess, sys
from pathlib import Path

subprocess.run([sys.executable, "-m", "pip", "install", "Pillow", "-q"], check=True)
from PIL import Image

SRC = Path("/Users/apple/Downloads/Projects - Client Details/Al Tair/Website/public/images")
ORIG = Path("/Users/apple/Downloads/Projects - Client Details/Al Tair/Website/Images")

# First copy any missing WebPs from original images
for jpg in sorted(ORIG.glob("*.jpeg")):
    out = SRC / (jpg.stem[:40].replace(" ", "-") + ".webp")
    if out.exists(): continue
    img = Image.open(jpg)
    if img.width > 1200:
        img = img.resize((1200, int(img.height * 1200 / img.width)), Image.LANCZOS)
    img.save(out, "WEBP", quality=75, method=6)

# Then re-encode ALL existing WebPs with lower quality
total = saved = 0
for webp in sorted(SRC.glob("*.webp")):
    old_size = webp.stat().st_size / 1024
    img = Image.open(webp)
    if img.width > 1200:
        img = img.resize((1200, int(img.height * 1200 / img.width)), Image.LANCZOS)
    img.save(webp, "WEBP", quality=70, method=6)
    new_size = webp.stat().st_size / 1024
    saved += old_size - new_size
    total += 1
    print(f"  {webp.name}: {old_size:.0f}KB → {new_size:.0f}KB ({int((1-new_size/old_size)*100)}% smaller)")

print(f"\n✅ {total} images optimized, saved {saved:.0f}KB")
