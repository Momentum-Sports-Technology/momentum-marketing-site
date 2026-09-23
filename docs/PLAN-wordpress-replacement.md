# Plan: replace momentumnetball.co.uk (WordPress) with this site

Status: done and live. Proposed 2026-09-07, cut over to the Next.js site during
September 2026. Kept as the record of what the replacement covered — see
"Where it stands" below for what is still open.

## Where it stands (2026-09-23)

Live on the apex. DNS is Cloudflare, proxied to 138.199.209.100. The site runs
as `momentum-marketing-prod` on 127.0.0.1:3120 behind nginx.

Done: every URL in the parity table resolves or 301s; the homepage league
tables, results and fixtures come from MST and update without a deploy; contact,
registration and newsletter forms deliver email through SendGrid; admin edits
content without a rebuild; `/links` link tree for the Instagram bio; the repo is
in the portmap with its prod block.

Still open:

- **Shop has no Stripe Payment Links.** Both products show "coming soon"
  because `paymentLinkUrl` is empty. Nothing can be bought until those links
  exist. Needs the Momentum Netball Stripe account (decision 3 below).
- **Newsletter goes to email and `data/newsletter.jsonl`, not Astonish.**
  Decision 4 was never taken; email is the fallback the plan allowed.
- **Lighthouse**: run 2026-09-23. The live site scored **44** on mobile
  performance: LCP 9.6s, of which 7.6s was the hero sitting at `opacity: 0`
  waiting for framer-motion to hydrate, and 1.27MB of unoptimized images. Both
  are fixed. On a local production build, medians of five runs, performance goes
  **75 to 94** and page weight 1,582KB to 617KB. Accessibility went 93 to 100
  once the brand orange was darkened for contrast. **The live figure still needs
  measuring after this deploy** — the local harness has no TTFB and scores the
  old code 75 where the live site scored 44.
- **Still not static-first**: `Stats` and `FAQ` are framer-motion client
  components whose content server-renders at `opacity: 0`, so those sections
  need JavaScript to become visible. The hero no longer does.
- **Search Console**: the sitemap exists at `/sitemap.xml` but has not been
  submitted.
- **WordPress fallback**: the plan allowed leaving the old host up for 30 days.
  Whether it is still running, and when it gets switched off, is Adam's call.

## Goal

Retire the WordPress site (Elementor + Amelia + WooCommerce, slow) and serve momentumnetball.co.uk from this Next.js repo. Booking moves to Mini Momentum on `booking.momentumnetball.co.uk`. Fixtures and standings come from MST via its public league embed. Shop moves to Stripe Payment Links.

Three systems, one job each:

| System         | Repo                                  | Role after cutover                                        |
| -------------- | ------------------------------------- | --------------------------------------------------------- |
| Marketing site | `momentum-marketing-site` (this repo) | Front door: content, SEO, forms, links into the other two |
| Booking        | `mini-momentum` (Go + React, Stripe)  | Event booking, my-bookings, vouchers, waiting list        |
| Fixtures       | `momentum-sports-technology` (MST)    | Public league page, embedded via iframe                   |

## URL parity with WordPress

These URLs exist today and must keep working (same path, or a 301).

| WordPress URL            | New behaviour                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `/`                      | Homepage, all sections rebuilt (see phase 1)                                        |
| `/book/`                 | `/book` page: programme cards linking to `booking.momentumnetball.co.uk/<category>` |
| `/my-bookings/`          | 301 to `booking.momentumnetball.co.uk/my-bookings`                                  |
| `/player-of-the-season/` | `/player-of-the-season` page, content from JSON via admin                           |
| `/code-of-conduct/`      | `/code-of-conduct` page (footer already links here)                                 |
| `/shop/`                 | `/shop` page, products with Stripe Payment Link buttons                             |
| `/shop/product/<slug>/`  | 301 to `/shop`                                                                      |
| `/mixed` (this repo)     | Keep; also link to `mixed-league.momentumnetball.co.uk` for tables                  |
| anything else            | 404 page with links to home, book, contact                                          |

## Phase 1 — content parity in this repo

Files to create:

- `app/book/page.tsx` — programme cards (Women's League, Mixed League, Coaching, Pay-to-Play, New to Netball, Team subscription £400/season). Each card's CTA goes to the matching Mini Momentum category URL.
- `app/player-of-the-season/page.tsx` + `content/players-of-the-season.json` + admin editor tab.
- `app/code-of-conduct/page.tsx` + `content/code-of-conduct.json`. Copy text from WordPress.
- `app/shop/page.tsx` + `content/shop.json` (name, price, image, Stripe Payment Link URL).
- `app/terms/page.tsx`, `app/privacy/page.tsx` — footer links to these already; they 404 today.
- `app/not-found.tsx`.
- `components/FixturesEmbed.tsx` — iframe of `https://momentumsportstechnology.com/share/leagues/<id>?embed=1`, lazy-loaded, one per league. League id per section comes from `content/site.json`.
- `components/ContactForm.tsx` + `app/api/contact/route.ts` — replaces the WordPress "Enquire Now" mailto buttons. Sends via Resend to hello@momentumnetball.co.uk.
- `components/NewsletterSignup.tsx` + `app/api/newsletter/route.ts` — posts to Astonish (Adam's newsletter tool, MCP already configured). Confirm Astonish is the target.
- `content/site.json` — venues with addresses and map links, reviews, coming-soon events, contact details, MST league ids. Admin editor tab for it.

Files to modify:

- `app/page.tsx` — add Results & Fixtures (FixturesEmbed), Contact (ContactForm), real venue list, Coming Soon Events, Newsletter. Remove the three "visit main site" links that point at WordPress. Move the hard-coded copy into `content/site.json` so the admin can edit it.
- `components/Navigation.tsx` — nav becomes Home, Book, My Bookings (external), Fixtures (`/#fixtures`), Players of the Season, Code of Conduct, Shop, Contact.
- `components/Footer.tsx` — point at the new pages; keep Instagram, Facebook, email.
- `app/api/register/route.ts` — stop writing JSON to disk. Send via Resend, and also hand the lead to Mini Momentum's customers table if we want one CRM. Default: email only.
- `app/admin/page.tsx` — tabs for the new content files.
- `next.config.js` — `redirects()` for the WordPress URLs above, `images` config, and `output: 'standalone'` for Docker.
- `middleware.ts` — no change expected; admin auth stays.

Not in scope: rebranding. The existing design, fonts (Black Mango) and orange palette stay. Framer Motion stays but every section gets a static first paint so the page is usable before JavaScript loads.

## Phase 2 — booking on Mini Momentum

The backend never lost the event endpoints. `/event-categories`, `/event-category/:slug`, `/event-availability`, `/create-checkout-session`, `/quick-booking`, `/validate-voucher` all still exist in `server/`. Only the frontend pages were deleted in PR #184.

- Restore `src/pages/EventSelection.tsx` and `src/pages/EventRegistration.tsx` from commit `2d218cb^`. Rewrite them against the current API contracts (`docs/api-contracts.json`) and current shadcn components. Follow Page → Hook → Component: the fetches move into `useEventCategories` / `useEventBooking` hooks.
- Do not restore `LandingPage.tsx` hostname sniffing. Add a `VITE_SITE_MODE=events|schools` build flag. The events build's `/` route is EventSelection.
- New public **My Bookings** flow (WordPress has it, Mini Momentum's `/bookings` is admin-only): `POST /api/my-bookings/request` sends a magic link; `GET /api/my-bookings?token=` lists that customer's upcoming bookings with cancel. Page `src/pages/MyBookings.tsx`. Needs a `booking_access_tokens` table (token, customer_id, expires_at) migration.
- Branding: events build uses Momentum Netball orange, not the purple gradient in the deleted page.
- Deployment on hetzner-ts:
  - Directory `/var/www/apps/deployments/production/booking-momentum` already exists (a 2025-10-24 checkout). `git pull`, then deploy with `docker-compose.booking-prod.yml`. Database `booking_momentum`, containers `booking-momentum-prod-app` and `booking-momentum-prod-postgres`, per `docs/BOOKING_DEPLOYMENT.md`.
  - Fix nginx `booking.momentumnetball.co.uk` upstream port to match the compose file. It returns 502 today because nothing listens on its upstream.
  - `trash` the stale `/var/www/apps/deployments/production/momentum-booking` folder (no git remote, duplicate of the above). Confirm with Adam first.
  - Add a `momentum-booking` entry to `~/.claude/local-port-map.json` and run `portmap sync`.
- Stripe: same account as Mini Momentum or a separate Momentum Netball account? Webhook endpoint must be registered for the booking domain either way.

## Phase 3 — shop

WooCommerce is the heaviest part of the current site and sells a handful of kit items (water bottle and similar). Recommendation: Stripe Payment Links, one per product, listed on `/shop` from `content/shop.json`. Stripe handles checkout, shipping address, receipts and stock. No cart, no backend.

Fallback if Adam wants a cart: Mini Momentum already has `addon_products` and Stripe, but it is tied to registrations. That is a bigger change and not recommended for a few kit lines.

## Phase 4 — deployment and cutover

- `Dockerfile` (multi-stage, `output: 'standalone'`), `docker-compose.production.yml`, `.env.production.example` (`ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`, `ASTONISH_*`). Content JSON and uploaded images live on a volume mount (small, single server, rebuild-safe, so a mount is fine per the storage rule).
- Server: hetzner-ts, `/var/www/apps/deployments/production/momentum-marketing-site`, git-pull deploy, nginx site for `momentumnetball.co.uk` and `www`. Add to portmap.
- Staging first at `new.momentumnetball.co.uk`. Adam reviews every page against WordPress side by side.
- Cutover: repoint the apex and `www` A records at 138.199.209.100, issue the certificate, leave WordPress running on its old host for 30 days as a fallback. Need to know where DNS lives (Cloudflare or the WP host) before this step.
- Post-cutover: Lighthouse on `/`, `/book`, `/shop`; check all redirects; submit the new sitemap in Search Console.

## Phase 5 — data and content migration from WordPress

- Export Amelia events and customers (CSV from the Amelia admin). Recreate upcoming events as Mini Momentum event categories and events before cutover. Historic bookings stay in the WordPress export; do not import them.
- Export WooCommerce orders and customers for the records. Nothing imports.
- Copy across: Code of Conduct text, Players of the Season entries, FAQ, reviews, venue list, images (re-encode to WebP).
- Newsletter subscribers: export from whichever WordPress plugin holds them and import into Astonish.

## Done means

- Every WordPress URL in the parity table resolves to the right page or 301.
- A visitor can book and pay for an event on `booking.momentumnetball.co.uk` and see it under My Bookings.
- Fixtures and standings on the homepage come from MST and update without a deploy.
- A visitor can buy a shop item and Adam receives the Stripe order.
- Contact and registration forms deliver email.
- Homepage Lighthouse performance score of 90 or above on mobile.
- Both apps deployed by git-pull on hetzner-ts, containers healthy, entries in the portmap.
- This repo's CLAUDE.md rewritten to describe the real project instead of the GitNexus boilerplate.

## Decisions needed from Adam

1. ~~MST league ids to embed~~ — settled. They live in `content/site.json` under `fixtures.leagues` and are edited in admin.
2. ~~Shop: Stripe Payment Links or drop the shop~~ — Payment Links chosen. The page is built; the links themselves are not created yet.
3. Stripe account for Momentum Netball bookings: shared with Mini Momentum or separate.
4. Newsletter target: Astonish, or something else. **Still open** — sign-ups currently email the admin and append to `data/newsletter.jsonl`.
5. ~~Where DNS for momentumnetball.co.uk is managed~~ — Cloudflare.
6. OK to trash the stale `momentum-booking` folder on Hetzner.

## Order of work

Phase 2 and phase 1 run in parallel (different repos). Phase 3 is small and goes with phase 1. Phase 4 staging as soon as phase 1 renders every page. Phase 5 is the last thing before the DNS change.
