# FactBusiness English — Learning Platform

**FactBusiness English Learning Platform** — a full-stack online learning system for
Business English from **Level 1 (Basic)** to **Level 5 (Advanced)**: business
communication, vocabulary (with Thai glosses), grammar, listening, reading,
writing, speaking practice, quizzes, progress tracking, gamification and
certificates.

Built as one Next.js project (App Router, Server Components, Server Actions and
Route Handlers) with a real backend — no mockups, no fake data.

## Tech Stack

| Layer        | Choice                                                        |
| ------------ | ------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router) · React · TypeScript (strict)          |
| Styling      | Tailwind CSS v4                                               |
| Database     | Neon PostgreSQL via Prisma ORM 6                              |
| Auth         | Custom server-side sessions — DB-backed, HTTP-only cookie, **24 h expiry** |
| Validation   | Zod                                                           |
| Passwords    | bcryptjs                                                      |
| UI/Icons     | Lucide React · Recharts (admin analytics) · date-fns          |
| Tests        | Node test runner + tsx                                        |
| Deployment   | Netlify (`netlify.toml`)                                      |

## Project layout

```
prisma/
  schema.prisma          # ~30 models: User, Session, Level…Certificate, attempts…
  seed.ts                # orchestrator — levels/courses/topics/lessons + demo users
  seed-level1.ts         # authored Level 1 content (real conversations, vocab, grammar)
  seed-levels.ts         # L2–L5 course & topic inventory
  seed-grammar.ts        # one grammar focus + quiz item per course (all levels)
  seed-vocab.ts          # vocab banks per course
  seed-works.ts          # writing tasks per course
src/lib/
  auth.ts                # sessions, bcrypt, cookie handling
  services/              # server-side business logic (content, progress, quiz,
                         #   listening, exercise, gamification, certificate, admin, student)
  actions/               # server actions (auth, learning, admin) — thin over services
src/app/
  (public)/              # home, levels, courses, search, certificate verify
  (auth)/                # login, register, forgot-password
  (student)/             # dashboard, learn, quiz, listening, exercises, progress,
                         #   bookmarks, notes, profile, settings, certificates
  admin/                 # admin dashboard + content CMS
  api/                   # REST route handlers (levels, courses, search, session, progress…)
middleware.ts            # fast anonymous-traffic guard + security headers
tests/                   # auth & scoring unit tests (18)
```

## Getting started

### 1. Environment

Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

| Variable              | Purpose                                                        |
| --------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`        | Neon pooled endpoint (`...-pooler.c-REGION.aws.neon.tech`)     |
| `DIRECT_URL`          | Neon direct endpoint — used by the Prisma CLI                  |
| `AUTH_SECRET`         | `openssl rand -hex 32` — used for signed links/fallback        |
| `NEXTAUTH_URL`        | Public site URL                                                |
| `NEXT_PUBLIC_APP_URL` | Public site URL (certificate verification links)               |

Never commit real credentials — `.env` is gitignored.

### 2. Install & database

```bash
npm install
npx prisma migrate deploy   # apply migrations (Neon)
npm run db:seed             # full catalogue + demo accounts
```

The seed creates **5 levels, 40 courses, 200 topics, 200 lessons**, vocabulary,
grammar, listening (5 questions each), quizzes (20 questions each), reading &
writing exercises, achievements, and demo accounts:

| Account | Email                      | Password      | Role    |
| ------- | -------------------------- | ------------- | ------- |
| Admin   | `admin@factbusiness.app`   | `Admin@12345` | ADMIN   |
| Student | `student@factbusiness.app` | `Student@12345` | STUDENT |

### 3. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Scripts

```bash
npm run dev          # Next dev server
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint (src, prisma, middleware, tests)
npm run typecheck    # tsc --noEmit
npm test             # 18 unit tests (auth validation, quiz & listening scoring)
npm run db:generate  # prisma generate
npm run db:migrate   # prisma migrate dev
npm run db:push      # prisma db push (schema-only sync)
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # prisma studio
```

## Security notes

- Passwords are bcrypt-hashed (`passwordHash`, never plain text).
- Sessions live in the DB; the browser only holds an opaque random token in an
  HTTP-only, SameSite=Lax cookie. **Every session expires 24 h after creation** —
  enforced server-side on every request, not by the client.
- `localStorage` is never used for authentication.
- Every server action re-checks the session, validates with Zod and uses
  `session.user.id` — never client-supplied ids (IDOR protection).
- Quiz/listening correct answers are never sent to the client; scoring happens
  server-side against the database and attempts are recorded.
- Anonymous traffic to `/dashboard`, `/learn`, `/quiz`, `/api/progress`, … is
  blocked in `middleware.ts`; layouts re-validate the session against the DB.
- Rate limiting is applied to login, register and assessment submissions.

## Deployment (Netlify + Neon)

1. Create a Neon project → copy `DATABASE_URL` and `DIRECT_URL` into the
   project settings under **Environment variables** (plus `AUTH_SECRET`,
   `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`).
2. Push this repo to GitHub and import it in Netlify (or connect via CLI).
   `netlify.toml` is already configured (build command, Next.js plugin).
3. In the Netlify UI, run **`npx prisma migrate deploy`** once after the first
   deploy to create the schema, then **`npm run db:seed`** (Build command or a
   one-off). For a fresh site, running the seed inside the build command also
   works: `npx prisma generate && npm run db:seed && npm run build`.
4. Deploy. Pages render in tens of milliseconds — dev-mode compile overhead
   does not exist in production.

## Performance

Reported slow page loads (e.g. `/register`) happen only in `next dev`: the first
request per route compiles on demand (~1–2 s), and every render carries dev
overhead. The production build serves these routes in ~20–70 ms (see
`npm run build && npm run start`).

## Learning system (in brief)

- Levels unlock sequentially (Level 1 open; completing a level unlocks the next;
  admins can bypass per user). Topics lock until the previous topic is complete.
- A lesson is complete when **read + listening ≥ 70 % + quiz ≥ 70 %** — each
  component is recorded and progress rolls up lesson → topic → course → level,
  awarding XP, streaks, achievements and (on level completion) a verifiable
  certificate (public `/verify/<code>` page).
- Vocabulary flashcards, TTS-backed listening player (real `audioUrl` when set),
  speaking practice with read-aloud prompts, writing practice with self review —
  all architected so voice-recognition / AI evaluation can be added later.
