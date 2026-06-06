import json
from pathlib import Path

images = sorted(
    str(path).replace("\\", "/")
    for path in Path("screenshots").glob("*.jpg")
)

sounds = sorted(
    str(path).replace("\\", "/")
    for path in Path("alerts").glob("*")
    if path.suffix.lower() in [".mp3", ".wav", ".ogg", ".m4a"]
)

manifest = {
    "images": images,
    "sounds": sounds
}

with open("manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print(f"Updated manifest.json with {len(images)} images and {len(sounds)} sounds.")