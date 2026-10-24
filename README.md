# Ruby Jean B. Solomon — Portfolio

Responsive React + TypeScript + Tailwind CSS portfolio, with Lucide icons and Motion. No backend is needed.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production bundle in `dist/`.

## Personalize

Edit `src/content.ts` for the name, email, social URLs, education, projects, and example technologies. All unspecified personal content is visibly labeled as a placeholder. Replace inline bracketed biography and certification placeholders in `src/main.tsx`.

- Put a real portrait in `public/` and set `profile.photo` to its root-relative URL.
- Put the real PDF résumé in `public/` and set `profile.resume` to its root-relative URL. Until supplied, the résumé button explains that it is unavailable.
- Add real GitHub and demo URLs to each project. Missing links explain their status without navigating to fake destinations.
- Add `profile.email` to enable an email-app draft. Until then, the form downloads a local text draft and explicitly does not send it. No form data is stored or sent to a server.
- The terminal supports `help`, `about`, `projects`, `skills`, `contact`, and `clear`. It does not execute arbitrary code.

Accessibility includes keyboard focus styles, skip navigation, semantic sections, reduced-motion support, labeled form fields, live notices, and native modal focus containment/Escape handling.
