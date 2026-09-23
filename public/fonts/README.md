# Black Mango Font Setup

## About

Black Mango is the heading font used by Momentum Netball
([momentumnetball.co.uk](https://momentumnetball.co.uk/)).

## What is here

Only `BlackMango-Regular.woff2`. The `.ttf`, `.woff` and `.eot` copies were
removed: `next/font/local` serves whichever single file it is given, and it was
being pointed at the 90KB `.ttf` while the 24KB `.woff2` sat unused next to it.
WOFF2 is supported by every browser this site targets, so the fallbacks were
66KB of render-blocking download for nothing.

There is no Bold. Headings use the regular weight with a CSS `font-weight`, so
do not add a Bold file expecting it to be picked up — it would need its own
`localFont` entry.

## Where to get the font

Purchase from
**[Creative Media Lab](https://creativemedialab.net/typeface/black-mango-branding-font/)**.
Free for personal use; commercial use needs a licence.

If you only have `.ttf` or `.otf`, convert with
[Transfonter](https://transfonter.org/) or the `woff2` CLI, and commit the
`.woff2` only.

## How it is wired up

`app/layout.tsx` loads it through `next/font/local`, which hashes the file into
`_next/static/media`, emits the preload link and sets `font-display: swap`:

```ts
const blackMango = localFont({
  src: "../public/fonts/BlackMango-Regular.woff2",
  variable: "--font-black-mango",
  display: "swap",
});
```

`--font-black-mango` is wired to the `font-black-mango` Tailwind utility in
`tailwind.config.ts`, and `app/globals.css` applies it to headings. Use
`className="font-black-mango"` to apply it anywhere else.

Replacing the file means changing the `src` path above — nothing reads this
directory directly.

## Verification

1. `yarn dev`
2. Open http://127.0.0.1:3110
3. Confirm headings render in Black Mango, and that the Network tab shows one
   `.woff2` under `_next/static/media` and no `.ttf`.

## Licence

⚠️ Make sure the licence covers commercial use before this ships anywhere.
