<div align="center">

# ✿ Reading Atelier ✿

*A little atelier for the books that have ever touched you.*

<br/>

> Track your collection, log your progress, and write personal reviews — all kept neatly in your own quiet corner.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

<br/>

✽ &nbsp; ❀ &nbsp; ✿ &nbsp; ❋ &nbsp; ✦ &nbsp; ❋ &nbsp; ✿ &nbsp; ❀ &nbsp; ✽

</div>

---

## ✿ About the Atelier

**Reading Atelier** is a personal digital library designed as a quiet space to record, celebrate, and care for every book you have ever touched. It is not just a to-read list — it is an **atelier**: a small studio where books are kept, read, and remembered.

Every page is crafted with a soft **letterpress** feel and gentle **kinetic typography**, so logging a book feels less like filling out a form and more like writing in a real paper journal.

> ✦ *"Reading is dreaming with open eyes."*

---

## ✿ Why This Project Exists

At its core, this is a **mini exploration project** built to try out and stress-test [**Storybook**](https://storybook.js.org/) as a *component playground* and *documentation tool* inside a modern Next.js codebase.

Almost every core UI component (button, card, badge, dialog, etc.) ships with a matching `.stories.tsx` file so it can be developed, tested, and documented in isolation — without booting the whole application.

A good reference if you want to learn how to:

- ✽ Set up Storybook 10 with Next.js 16 and Vite
- ❀ Run visual component tests with addon-a11y and addon-vitest
- ❋ Mock network requests with Mock Service Worker (MSW)
- ✿ Wire Tailwind v4 into the Storybook preview

---

## ✿ Tech Stack

| Layer              | Tools                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router) · React 19 · TypeScript 5                      |
| **Styling**        | Tailwind CSS 4 · `tailwind-merge` · `class-variance-authority`         |
| **Animation**      | Framer Motion 12 (kinetic typography, page transitions, parallax)      |
| **UI Primitives**  | Base UI · Lucide React · RemixIcon                                     |
| **Backend / Data** | Supabase (Postgres + Auth + RLS)                                       |
| **Storybook**      | Storybook 10 + `@storybook/nextjs-vite` · addon-docs · addon-a11y      |
| **Testing**        | Vitest 4 · Playwright (browser) · addon-vitest                         |
| **Fonts**          | Fraunces · Inter · JetBrains Mono (via `next/font/google`)             |

---

## ✿ Features

- ❀ **Dashboard** — Kinetic hero typography, shelf stats, in-progress books, and recently finished stories
- ❋ **Collection** — Manage your books with filters for genre, status, and search
- ✦ **Book Detail** — Page-by-page progress notes per book
- ✽ **Reviews** — Dedicated review page with star ratings
- ❀ **Page Transition** — Curtain veil that shifts palette on every route
- ❋ **Cursor Glow** — Soft luminous halo following the pointer
- ✿ **Empty States** — Friendly placeholders, never just *"no data"*
- ✦ **A11y** — Semantic HTML, ARIA labels, and a11y testing right inside Storybook

---

## ✿ Installation

### 1. Clone & Install

```bash
git clone https://github.com/your-username/reading-atelier.git
cd reading-atelier
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SUPABASE_USER_ID=your-user-uuid
```

> ❋ You can grab these from **Supabase Dashboard → Project → Settings → API**.

### 3. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your atelier is ready to be touched. ✿

---

## ✿ Storybook

### Run Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) — the component playground opens up. ✦

### Build a Static Storybook

```bash
npm run build-storybook
```

Output goes to `storybook-static/` — ready to deploy to Chromatic, Vercel, or any static host.

### Run Storybook Tests

```bash
npm run test-storybook
```

This runs **addon-vitest** with Playwright in a real browser for visual + interaction tests.

### Where Stories Live

Stories live **right next to** their components:

```
src/components/book/
├── BookCard.tsx
├── BookCard.stories.tsx    ← ✿ the story lives here
├── StatCard.tsx
├── StatCard.stories.tsx
└── ...
```

> ✽ Convention: one story file per component, named `<ComponentName>.stories.tsx`.

### Available Addons

| Addon                       | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `@storybook/addon-docs`     | Auto-generated docs (MDX + autodocs)               |
| `@storybook/addon-a11y`     | Accessibility testing with axe-core                |
| `@storybook/addon-vitest`   | Component testing with Vitest + Playwright         |
| `@storybook/addon-mcp`      | MCP server for AI assistant integration            |
| `@chromatic-com/storybook`  | Visual regression testing                          |

---

## ✿ Project Structure

```
reading-atelier/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, navbar, footer)
│   │   ├── page.tsx            # Dashboard (hero, stats, collection)
│   │   ├── koleksi/            # Book collection pages
│   │   └── review/             # Review pages
│   ├── components/
│   │   ├── book/               # ✿ Domain components (BookCard, StatCard, …)
│   │   │   └── *.stories.tsx   # Stories for each component
│   │   └── ui/                 # UI primitives (button, card, dialog, …)
│   ├── hooks/                  # Custom hooks (useBooks, …)
│   └── lib/                    # Utilities & Supabase client
├── .storybook/
│   ├── main.ts                 # Storybook config
│   └── preview.tsx             # Global decorators & parameters
└── public/                     # Static assets
```

---

## ✿ Scripts

| Command                     | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `npm run dev`               | Start the Next.js dev server (port 3000)             |
| `npm run build`             | Production build                                     |
| `npm run start`             | Run the production build                             |
| `npm run lint`              | Run ESLint                                           |
| `npm run storybook`         | Start Storybook (port 6006)                          |
| `npm run build-storybook`   | Build a static Storybook                             |
| `npm run test-storybook`    | Run component tests inside Storybook                 |

---

## ✿ Dev Notes

- ❀ Theme colors are defined in `globals.css` as CSS variables (`--blue-soft`, `--pink-soft`, `--navy`, …) — open that file to tweak the atelier palette.
- ❋ Framer Motion transitions are wrapped in `AnimatePresence` inside `PageTransition.tsx` — edit it to tune the page-to-page motion.
- ✿ All book components live in `src/components/book/` — drop new components and their stories into the same folder.
- ✦ This project is not production-deployed — the focus is Storybook exploration and UI aesthetics, not live users.

---

<div align="center">

✽ &nbsp; ❀ &nbsp; ✿ &nbsp; ❋ &nbsp; ✦ &nbsp; ❋ &nbsp; ✿ &nbsp; ❀ &nbsp; ✽

*Handcrafted with care · 2026*

**Reading Atelier** — *A little atelier for the books that have ever touched you.*

</div>