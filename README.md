# BookNook – A Small Online Library

Live site:https://a08-booknook-project-client.vercel.app

 Add a book, borrow a book, return a book.

BookNook is a small online library built with Next.js (App Router), BetterAuth, MongoDB and an Express API. Readers can browse every book, add their own, borrow a title for seven days and return it when they are done.

## Features
Email and Google login with BetterAuth + MongoDB adapter, password rules (uppercase, lowercase, 6+ characters) and a redirect back to the page you came from after login
- **Private routes that survive a reload**: a logged in user is never bounced to Login while the session is restored
- **Full book CRUD**: add with imgbb image upload, edit with a prefilled form, delete with a confirm modal
- **Borrow system** with available copies tracked by `$inc`, a "Not Available" state at 0 copies and a no-double-borrow rule
- **JWT protected API**: the client sends a BetterAuth-issued JWT and the Express server verifies it
- **Swiper.js hero slider**, live New Arrivals (latest 6, newest first), plus "How Borrowing Works", "Top Categories" and "Reader Reviews" sections
- **Light and dark theme** toggle, Framer Motion animations, toasts for every success and error, loading spinners, custom 404 and per-page titles
- Fully responsive for mobile, tablet and desktop

## Tech stack
Next.js 16 (App Router) · DaisyUI + Tailwind CSS · BetterAuth (MongoDB adapter, JWT plugin) · Swiper · Framer Motion · react-hot-toast · Express + MongoDB (separate repo)

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

### Environment variables
| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | public URL of this app |
| `MONGODB_URI`, `DB_NAME` | MongoDB used by BetterAuth (use the same DB as the server) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth. Redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` |
| `NEXT_PUBLIC_API_URL` | URL of the Express server |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for cover uploads |

## Deploying (Vercel)
1. Import the repo, add every variable above in project settings.
2. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the Vercel URL.
3. Add the Vercel URL to Google OAuth authorized origins, and add the callback URI.
4. On the server, set `CLIENT_URL` to this URL so it can verify JWTs.
5. Next.js routes reload cleanly on Vercel without extra rewrites.
