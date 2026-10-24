# Ruby Jean B. Solomon — Portfolio

Responsive React + TypeScript + Tailwind CSS portfolio, with Lucide icons and Motion. No backend is needed.

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

`src/components/GitHubActivity.tsx` reads the public GitHub Events API for `Andyyy28`, with no token or backend. It loads on mount, refreshes every five minutes while visible, and supports manual refresh. Public event availability and latency are controlled by GitHub; the feed is not a contribution graph. Loading, empty, timeout, rate-limit, and network-error states are handled. On refresh errors, previously fetched events remain visible and are identified as older results.

Certificate originals are in `public/certificates/`. The gallery provides an accessible modal, full-size viewing, and downloads. Project previews in `public/projects/` are screenshots of the supplied live sites.
