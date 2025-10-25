# Momentum Netball Marketing Site

A modern Next.js marketing website for Momentum Netball with a custom CMS admin panel, inspired by sleek Framer designs.

## ✨ Features

- 🎨 **Modern Design** - Framer-inspired aesthetic with gradient accents and smooth animations
- 📱 **Fully Responsive** - Mobile-first design that looks great on all devices
- ✨ **Smooth Animations** - Powered by Framer Motion for buttery smooth interactions
- 🔐 **Admin Panel** - Simple password-protected CMS for content management
- 📝 **JSON-based Content** - Easy-to-edit content files (no database required)
- 📧 **Registration Forms** - Built-in form handling with email integration ready
- 🎯 **Production Ready** - Built with Next.js 15, TypeScript, and Tailwind CSS
- ⚡ **Fast Performance** - Optimized for speed and SEO

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Environment

The `.env.local` file is already created with default values. **Important:** Change the `ADMIN_PASSWORD` before deploying!

```env
ADMIN_PASSWORD=your-secure-password-here
```

### 3. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Access Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with the password you set in `.env.local`.

## 🎛️ Admin Panel

Access the admin panel at `/admin` to manage content without touching code.

**Login:**
- Password: Whatever you set in `ADMIN_PASSWORD` (default: `momentum2025`)

### Managing Content

The admin panel provides a user-friendly interface to edit:
- **Hero Section** - Main headline, subtitle, and call-to-action
- **Features** - 4 key feature cards with titles and descriptions
- **FAQ** - Frequently asked questions and answers
- **Stats** - Numbers and metrics to display

All content is stored in JSON files under `/content/` directory and updates instantly.

## Project Structure

```
/app
  /(public pages)
    /mixed          # Mixed league page
    page.tsx        # Homepage
  /admin            # Admin panel
  /api              # API routes
/components         # Reusable UI components
/content            # JSON content files
/lib                # Utilities and helpers
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Configure environment variables:
   ```
   ADMIN_PASSWORD=your-secure-password
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://your-domain.com
   ```
4. Deploy! Your site will be live in minutes.

### Other Platforms

This is a standard Next.js app and works on any platform supporting Next.js:
- **Netlify** - Import from Git, set env vars, deploy
- **AWS Amplify** - Connect repo, configure, deploy
- **Self-hosted** - `yarn build && yarn start` on any Node.js server

### Important: Before Going Live

- [ ] Change `ADMIN_PASSWORD` to something secure
- [ ] Generate a secure `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Test the admin panel on production
- [ ] Set up email integration for registration forms (optional)

## Future Enhancements

- Email integration for registration forms (Resend/SendGrid)
- Additional league pages (Women's, Juniors)
- Database migration from JSON
- Integration with booking systems
- Results/fixtures display

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Authentication:** NextAuth.js
- **Icons:** Lucide React

## License

Copyright © 2025 Momentum Netball Ltd. All rights reserved.

