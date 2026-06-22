# OutScope Designs — Brand Reference

## Colors

| Role | Hex | Notes |
|------|-----|-------|
| **Brand / Primary** | `#5B6CFF` | Indigo-blue. The main brand color (the circle in the logo). |
| **Accent** | `#FF8966` | Coral. Use as the invoice accent (the square in the logo). |
| Secondary accent | `#4ECCA3` | Mint green. Used for checkmarks / "success" on the site. |
| Ink / Text | `#1A1A1A` | Body and heading text. |
| Muted text | `#6B6B68` | Secondary text. |
| Background | `#FAFAF7` | Warm off-white. |
| Border | `#ECECE6` | Hairline borders. |
| Logo overlap | `#5B3A66` | Where the circle meets the square (multiply of primary × accent). |

**For your invoice:** Brand = `#5B6CFF`, Accent = `#FF8966`.

## Logo files (in `/assets`)

| File | What it is |
|------|------------|
| `logo-mark.svg` | Icon only (circle + square). Scalable, font-independent. |
| `logo-full.svg` | Icon + "OutScope Designs" wordmark. Loads Clash Display in browsers. |
| `favicon.svg` | The mark, sized for a browser tab (wired into `index.html`). |
| `logo-mark-512.png` / `-1024.png` / `-2048.png` | Ready-to-use transparent PNGs of the mark. |
| `export-png.html` | Open in a browser to download PNGs of the **mark or full lockup** at any size (256–2048 px), with the real Clash Display font and transparent background. |

### Usage notes
- Prefer the **SVG** files wherever the tool supports them (infinitely sharp).
- For the **full lockup as a PNG** (icon + wordmark), use `export-png.html` so the
  wordmark bakes in the real Clash Display typeface — generic SVG-to-PNG converters
  don't have that font and will substitute a fallback.
- The logo works on light backgrounds. On dark backgrounds, give it some padding and
  consider placing it on a light chip (the site uses an off-white `#FAFAF7` chip).
- Don't recolor, rotate, or stretch the mark — keep the indigo circle + coral square.

## Typography
- Display / headings: **Clash Display** (fallback: Space Grotesk)
- Body: **General Sans** (fallback: Plus Jakarta Sans)
