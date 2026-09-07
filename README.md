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

Create `.env.local` with an admin password:

```env
ADMIN_PASSWORD=your-secure-password-here
```

### 3. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3110](http://localhost:3110) to view the site.

### 4. Access Admin Panel

Visit [http://localhost:3110/admin](http://localhost:3110/admin) and sign in with the password you set in `.env.local`.

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

See `CLAUDE.md` for the file map and conventions, and `docs/PLAN-wordpress-replacement.md` for
how this site, Mini Momentum (booking) and Momentum Sports Technology (fixtures) fit together.

## 🚀 Deployment

Docker on Hetzner via git-pull:

```bash
cp .env.production.example .env   # fill in ADMIN_PASSWORD and RESEND_API_KEY
docker compose -f docker-compose.production.yml up -d --build
```

The container listens on 127.0.0.1:3120; nginx terminates TLS in front of it. Content edits made
in `/admin` are stored on a Docker volume and survive rebuilds.

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
