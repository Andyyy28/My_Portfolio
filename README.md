# Ruby Jean B. Solomon — Portfolio

Responsive React + TypeScript + Tailwind CSS portfolio, with Lucide icons and Motion. One small, token-free Vercel Function retrieves the public GitHub contribution calendar; no database is needed.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production bundle in `dist/`.

## Personalize

Edit `src/content.ts` for the name, email, social URLs, education, projects, certificates, and example technologies. Supplied university details, live projects, and all five certificates are included. Unspecified personal content remains visibly labeled as a placeholder.

- Put a real portrait in `public/` and set `profile.photo` to its root-relative URL.
- Put the real PDF résumé in `public/` and set `profile.resume` to its root-relative URL. Until supplied, the résumé button explains that it is unavailable.
- Add real GitHub and demo URLs to each project. Missing links explain their status without navigating to fake destinations.
- Add `profile.email` to enable an email-app draft. Until then, the form downloads a local text draft and explicitly does not send it. No form data is stored or sent to a server.
- The terminal supports `help`, `about`, `projects`, `skills`, `contact`, and `clear`. It does not execute arbitrary code.

Accessibility includes keyboard focus styles, skip navigation, semantic sections, reduced-motion support, labeled form fields, live notices, and native modal focus containment/Escape handling.

## GitHub activity and certificates

`src/components/GitHubActivity.tsx` displays GitHub's rolling yearly contribution calendar: daily squares, month and weekday labels, exact daily counts, GitHub intensity levels, and the yearly total. Hover, tap, or focus a square for details; use arrow keys, Home, and End to navigate. Small screens can scroll the calendar horizontally.

`api/github-contributions.mjs` fetches the public calendar for `Andyyy28` directly from GitHub through `server/contributions.mjs`, without tokens. Vercel caches successful responses for five minutes (with up to ten minutes of stale-while-revalidate). The UI refreshes every five minutes while visible and supports manual refresh. The data timestamp is always shown; a refresh can still return cached data. GitHub controls contribution inclusion and counting delays. This uses public HTML rather than the Events API; if GitHub changes its markup, parsing fails explicitly instead of inventing an empty graph. No private repository details are fetched.

The same handler runs in `npm run dev` through a Vite development middleware. Run parser/error tests with `node --test tests/contributions.test.mjs`. Production needs Vercel Functions (a static-only host cannot serve this endpoint).

Certificate originals are in `public/certificates/`. The gallery provides an accessible modal, full-size viewing, and downloads. Project previews in `public/projects/` are screenshots of the supplied live sites.
