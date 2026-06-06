#!/usr/bin/env fish

mkdir -p ../og_screenshots

set highest 0

for f in screenshots/*.jpg
    set num (string replace -r '.*/([0-9]+)\.jpg$' '$1' "$f")

    if test "$num" -gt $highest
        set highest $num
    end
end

for f in screenshots/*.png
    set highest (math $highest + 1)
    set newname (printf "screenshots/%03d.jpg" $highest)

    magick "$f" -quality 85 "$newname"
    mv "$f" ../og_screenshots/
end

python update_manifest.py