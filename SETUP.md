# Setup Guide

## Initial Setup (5 minutes)

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

The `.env.local` file is already created. Update these values:

```env
# Change this to a secure password!
ADMIN_PASSWORD=your-secure-password-here

# Keep these for local development
NEXTAUTH_SECRET=change-this-to-a-random-secret-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
yarn dev
```

Visit: http://localhost:3000

## Using the Admin Panel

### Access

1. Navigate to http://localhost:3000/admin
2. Enter your `ADMIN_PASSWORD`
3. Edit content and save

### Content Structure

All content is in `/content/mixed-league.json`:

```json
{
  "hero": {
    "title": "Your headline",
    "subtitle": "Your subheading",
    "ctaText": "Button text",
    "ctaLink": "#register",
    "badge": "4.9 ★ Player Rating"
  },
  "features": [...],
  "faq": {...}
}
```

You can edit this file directly or use the admin panel.

## Adding More Pages

### Create a New League Page

1. **Add content file:** `content/womens-league.json`
2. **Create page:** `app/womens/page.tsx`
3. **Add to navigation:** Update `components/Navigation.tsx`
4. **Create content loader:** Add function to `lib/content.ts`

Example:

```typescript
// lib/content.ts
export async function getWomensLeagueContent() {
  const filePath = path.join(contentDirectory, "womens-league.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

// app/womens/page.tsx
import { getWomensLeagueContent } from "@/lib/content";

export default async function WomensLeaguePage() {
  const content = await getWomensLeagueContent();
  return <Hero {...content.hero} />;
}
```

## Email Integration

### Form email

Contact, registration and newsletter forms email `ADMIN_EMAIL` through SendGrid's HTTP API
(`lib/email.ts`). Set `SENDGRID_API_KEY`; without it, messages are logged and still saved to
`data/*.jsonl`, readable in the admin Submissions tab.

### Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  momentum: {
    purple: "#6B46C1",  // Your brand purple
    pink: "#E91E63",     // Your brand pink
    blue: "#2563EB",     // Accent blue
  },
}
```

### Fonts

Edit `app/layout.tsx`:

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({ subsets: ["latin"] });
```

### Images

Add images to `/public/images/` and reference:

```typescript
<Image src="/images/your-image.jpg" alt="..." />
```

## Troubleshooting

### Build Errors

```bash
rm -rf .next node_modules
yarn install
yarn build
```

### Content Not Updating

- Check JSON syntax in content files
- Restart dev server: `yarn dev`

### Admin Panel Not Working

- Verify `ADMIN_PASSWORD` is set in `.env.local`
- Check browser console for errors
- Clear localStorage and try again

## Production Checklist

Before deploying:

- [ ] Change `ADMIN_PASSWORD` to something secure (min 12 characters)
- [ ] Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Test all pages and forms
- [ ] Set up email integration (if needed)
- [ ] Add Google Analytics (optional)
- [ ] Test admin panel on production
- [ ] Set up custom domain
- [ ] Configure SSL certificate (handled by Vercel/Netlify)

## Need Help?

- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
