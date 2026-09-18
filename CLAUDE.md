# Momentum Netball marketing site

Next.js 15 (App Router, React 19, Tailwind 3, Framer Motion) site that replaces the WordPress
site at momentumnetball.co.uk. It is the front door only. Booking and payments live in
Mini Momentum (`~/projects/mini-momentum`, events build at booking.momentumnetball.co.uk).
Fixtures and standings are embedded from Momentum Sports Technology's public league pages.
Plan and cutover steps: `docs/PLAN-wordpress-replacement.md`.

## Commands

```bash
yarn dev            # http://127.0.0.1:3110 (port fixed in package.json; ./stack start does the same in tmux)
yarn build          # must pass before commit; also runs typechecking
yarn tsc --noEmit -p .
```

`.env.local` needs `ADMIN_PASSWORD` for the admin panel. `SENDGRID_API_KEY` is optional in dev:
without it emails are logged, not sent. There is no ESLint config yet; `yarn lint` prompts to
create one.

## Layout

| Path                                                                                                  | What                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                                                                                        | Homepage, server component, reads `content/site.json`                                                                                                                                                                                                                                  |
| `app/book`, `app/shop`, `app/player-of-the-season`, `app/code-of-conduct`, `app/terms`, `app/privacy` | Inner pages, one content file each (terms is static and links the PDF in `public/docs`)                                                                                                                                                                                                |
| `app/mixed`                                                                                           | Mixed League page with its registration form                                                                                                                                                                                                                                           |
| `app/links`                                                                                           | Link tree for the Instagram bio. Renders without the nav and footer — `components/Chrome.tsx` hides them on the routes listed there. 404s rather than 500s when `content/links.json` is missing, because on a running deployment it is                                                  |
| `app/admin`                                                                                           | Password-protected editor. Tabs map to content files and must be added by hand — the registry in `lib/content.ts` does not drive them. Mixed League has a form editor, the rest edit validated JSON                                                                                     |
| `app/api/content/[slug]`                                                                              | GET public, PUT requires `Authorization: Bearer <session>`                                                                                                                                                                                                                             |
| `app/api/contact`, `app/api/newsletter`, `app/api/register`                                           | Form endpoints: zod-validated, honeypot field `website`, append to `data/*.jsonl`, email via SendGrid                                                                                                                                                                                  |
| `lib/content.ts`                                                                                      | Zod schema per content file and the `getContent` / `updateContent` registry. Add a new file here first                                                                                                                                                                                 |
| `lib/sessions.ts`                                                                                     | Stateless HMAC session tokens signed with `SESSION_SECRET` or `ADMIN_PASSWORD`                                                                                                                                                                                                         |
| `lib/urls.ts`                                                                                         | `BOOKING_URL` and `resolveCta`; client-safe, no Node imports                                                                                                                                                                                                                           |
| `lib/booking.ts`, `components/BookableCard.tsx`                                                       | Booking site's public API (`/api/event-categories`, `/api/event-availability`), cached 5 min. `/book` renders what is actually bookable — name, venue, price, next date, places left — instead of a hand-kept copy. Falls back to `site.programmes` if the booking site is unreachable |
| `lib/mst.ts`, `components/LeagueCentre.tsx`, `components/LeagueChampions.tsx`                         | MST public league API (`/api/public/leagues/<id>`), cached 5 min; homepage tables/results/fixtures and the champions on Players of the Season. MST share pages cannot be iframed (X-Frame-Options SAMEORIGIN)                                                                          |
| `content/*.json`                                                                                      | The CMS. Edited through admin in production (Docker volume), committed here for dev                                                                                                                                                                                                    |

## Conventions

- Server components read content with `getContent(slug)`; pages that read content declare
  `export const dynamic = "force-dynamic"` so admin edits show without a rebuild.
- Client components never import `lib/content.ts` (it uses `fs`). Use `lib/urls.ts` or props.
- Programme `ctaHref` values starting with `/events/` or `/my-bookings` are paths on the booking site, resolved by
  `resolveCta`. Anything else is used as-is.
- Redirects for old WordPress URLs live in `next.config.js`. Keep them when adding routes.
- Design tokens are in `tailwind.config.ts` (`momentum-orange`, `momentum-dark`). Headings use
  the Black Mango local font via `globals.css`.

## The /book page

Two sections. **Book now** comes from the booking system through `lib/booking.ts`
— never edit those cards here, edit the programme in booking admin. **Other ways
to play** is editorial: the `content/site.json` programmes whose `ctaHref` does
_not_ start with `/events/` (enquiries — Women's League, New to Netball,
Individual Players).

A programme therefore moves between sections by where its `ctaHref` points. Give
it an `/events/<slug>` href and it leaves the editorial section, because the
booking system is then describing it.

The homepage stays editorial throughout: its featured cards are marketing copy.

If the booking site cannot be reached, `/book` renders the full editorial list
with no section headings — exactly what the page was before. Look for
`[booking]` warnings in the server log if the live section is missing.

## Deploy

Docker on hetzner-ts, git-pull, `docker compose -f docker-compose.production.yml up -d --build`.
Container `momentum-marketing-prod` on 127.0.0.1:3120 behind nginx. Content and form data are
on named volumes; the image seeds `/app/content` on first run only. Content changes committed to
`content/*.json` therefore do not reach a running deployment: edit them in admin, or merge the
file into the volume (`docker exec -i momentum-marketing-prod sh -c 'cat > /app/content/<file>.json'`).

**A brand-new content file needs the same step**, or the page that reads it has nothing to read
— seed it from the repo after the deploy:

```bash
ssh hetzner-ts "docker exec -i momentum-marketing-prod sh -c 'cat > /app/content/<file>.json'" < content/<file>.json
``` Env in `.env` on the server,
template in `.env.production.example`.
