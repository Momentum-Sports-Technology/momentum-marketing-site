# Black Mango Font Setup

## About

Black Mango is the font used by Momentum Netball ([momentumnetball.co.uk](https://momentumnetball.co.uk/)).

## Required Font Files

Place the following font files in this directory:

- `BlackMango-Regular.woff2`
- `BlackMango-Regular.woff`
- `BlackMango-Bold.woff2`
- `BlackMango-Bold.woff`

## Where to Get the Font

### Option 1: Purchase from Creative Media Lab

The Black Mango font can be purchased from:
**[Creative Media Lab - Black Mango Font](https://creativemedialab.net/typeface/black-mango-branding-font/)**

- **Personal Use**: Free
- **Commercial Use**: Requires license purchase

### Option 2: Extract from Momentum Netball Website

If you already work with Momentum Netball or have permission, you can:

1. Visit [momentumnetball.co.uk](https://momentumnetball.co.uk/)
2. Open browser DevTools (F12)
3. Go to Network tab
4. Filter by "Font" or "woff"
5. Download the font files
6. Convert to `.woff2` and `.woff` formats if needed

## Font Conversion

If you only have `.ttf` or `.otf` files, convert them using:

- **Online**: [Transfonter](https://transfonter.org/) (recommended)
- **Command Line**: Use `fonttools` or `woff2` npm packages

## Usage in Project

The font is already configured in `/frontend/src/index.css` and applied to all `h1` and `h2` elements:

```css
h1,
h2 {
  font-family: "Black Mango", sans-serif;
}
```

To use it elsewhere:

```css
.my-class {
  font-family: "Black Mango", sans-serif;
}
```

## Verification

After adding the font files:

1. Start the dev server: `yarn dev`
2. Open http://localhost:3000
3. Check h1/h2 headings use the Black Mango font
4. Inspect element in DevTools to confirm font loading

## License Note

⚠️ **Important**: Ensure you have the proper license for your use case (personal vs commercial).
