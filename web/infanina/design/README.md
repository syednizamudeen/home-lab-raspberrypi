# Source artwork

Files here are **not served and not deployed**. They are the originals that
shipped assets are derived from, kept so any asset can be rebuilt without
regenerating art from scratch. `.dockerignore` excludes this directory from the
image.

## singapore-skyline.source.png

Raw generated line drawing of the Singapore skyline, 1584×672. Used by the hero
band on the home page.

It is not usable as-is: it carries the generator's watermark in the
bottom-right corner, its background is `241,238,229` rather than the site's
paper, and roughly half the canvas is empty space above and below the ink.

### Rebuilding `public/singapore-skyline.webp`

Run from the project root. Requires ImageMagick (`brew install imagemagick`).

```bash
magick design/singapore-skyline.source.png \
  -crop 1584x594+0+0 +repage \
  -fuzz 9% -fill "srgb(245,243,238)" -opaque "srgb(241,238,229)" \
  -fuzz 4% -trim +repage \
  -bordercolor "srgb(245,243,238)" -border 6 \
  -filter Lanczos -resize 200% \
  -dither None -colors 64 \
  -define webp:lossless=true -define webp:method=6 \
  public/singapore-skyline.webp
```

What each step is for, since none of it is optional:

| Step | Why |
|---|---|
| `-crop 1584x594+0+0` | Removes the generator watermark from the bottom edge |
| `-opaque` to `245,243,238` | Matches the file's background to `--paper` **exactly**. Four values off renders as a visible rectangle across the page |
| `-trim` | Cuts the empty canvas above and below the ink, taking the band from 2.67:1 to 5.05:1 |
| `-border 6` | Safety margin so resampling cannot clip the outermost ink |
| `-resize 200%` | 2x for high-density screens |
| `-colors 64` + lossless WebP | Flat line art compresses to ~300KB with no visible loss. It must stay **lossless**: `next/image`'s lossy re-encode shifts the flat background and the seam returns, which is why the hero sets `unoptimized` |

After rebuilding, confirm the background still matches:

```bash
magick public/singapore-skyline.webp -format "%[pixel:p{5,5}]\n" info:
# expect: srgb(245,243,238)
```

Then check the hero at 390, 768 and 1440px wide. The image is displayed
uncropped and scaled up on small screens, so a change in aspect ratio needs the
widths in [../components/home/Hero.tsx](../components/home/Hero.tsx) revisited.

### Replacing the drawing

Prompt and composition notes are in the git history of this file's first
commit. Keep to three colours: paper ground `#F5F3EE`, ink `#2A2531`, and the
acid accent on two or three elements only. Generate at 21:9 or wider.

## Identity assets

All generated from the same static Archivo ExtraBold used by the share card
(`app/og-default/Archivo-ExtraBold.ttf`, SIL Open Font License, licence text
alongside it). Run from the project root; requires ImageMagick.

```bash
F=app/og-default/Archivo-ExtraBold.ttf
INK="#2A2531"; PAPER="#F5F3EE"; ACID="#A8E63C"

# public/logo.png — wordmark on paper, referenced by Organization JSON-LD
magick -size 1200x630 xc:"$PAPER" \
  -font $F -fill "$INK" -pointsize 190 -gravity center -annotate +-30+0 "infanina" \
  -fill "$ACID" -draw "circle 990,392 990,414" \
  public/logo.png

# app/icon.png — square mark: ink tile, paper "i", acid dot
magick -size 512x512 xc:"$INK" \
  -font $F -fill "$PAPER" -pointsize 380 -gravity center -annotate +-46+18 "i" \
  -fill "$ACID" -draw "circle 320,352 320,404" \
  app/icon.png

magick app/icon.png -resize 180x180 app/apple-icon.png
magick app/icon.png -define icon:auto-resize=48,32,16 app/favicon.ico
```

The square mark exists because the wordmark is unreadable at 16px. It reduces
the identity to its two distinguishing parts, the lowercase "i" and the acid
dot, and stays legible in a browser tab.

**A trap worth remembering:** the share card at [app/og-default/route.tsx](../app/og-default/route.tsx)
must use a *static* font instance. Satori hard-crashes the rendering process on
Archivo's variable TTF, killing the request with no error thrown and no log
line. If the OG route ever starts returning an empty reply, that is why.
