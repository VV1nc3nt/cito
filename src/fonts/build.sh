#!/usr/bin/env sh
# Rebuilds the self-hosted woff2 files in this directory from the upstream OFL sources.
# Requires fontTools with brotli: `pip install fonttools brotli`. See README.md for sources.
#
# Usage: src/fonts/build.sh <dir with Onest[wght].ttf and JetBrainsMono-{Regular,Medium}.ttf>
set -eu

SRC=${1:?usage: build.sh <source dir>}
OUT=$(cd "$(dirname "$0")" && pwd)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Same ranges as the Google Fonts "latin" and "cyrillic" subsets.
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
CYRILLIC='U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'

subset() {
  pyftsubset "$1" \
    --unicodes="$LATIN,$CYRILLIC" \
    --layout-features='*' \
    --flavor=woff2 \
    --output-file="$2"
}

for weight in 400 500 600 700; do
  fonttools varLib.instancer -q "$SRC/Onest[wght].ttf" "wght=$weight" --static \
    --output="$TMP/Onest-$weight.ttf"
  subset "$TMP/Onest-$weight.ttf" "$OUT/Onest-$weight.woff2"
done

subset "$SRC/JetBrainsMono-Regular.ttf" "$OUT/JetBrainsMono-400.woff2"
subset "$SRC/JetBrainsMono-Medium.ttf" "$OUT/JetBrainsMono-500.woff2"
