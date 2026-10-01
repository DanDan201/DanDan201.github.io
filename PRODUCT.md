# PRODUCT.md

## What it is
Anh Nguyen's personal site (anhdnguyen.me): one page with work, education, stack, favourites, travel and contact.

## Target audience
Recruiters and engineering peers checking his background; people he meets who want the person behind the job title. (Inferred from the existing sections, not stated by the user.)

## Brand voice
Technical, precise, human.

## Key messages
1. Data & AI Engineer at Philips, building AI agents for R&D operations.
2. Engineering path: ASML, TU/e MSc, Tilburg BSc.
3. A specific person outside work: flight sim (DCS), F1, Star Trek and Star Wars, a growing country list.

## Brief
- Source: user. Change the layout of the website to something more futuristic.
- Source: user. Change the scrolling transition to be more animated.
- Source: user. Accepted plan: cockpit HUD "final approach" direction, colors.csv row 83, typography.csv row 51.

## Anti-references
Purple/cyan AI glow, glassmorphism on every surface, matrix-green hacker terminal, text-scramble effects, generic dev-portfolio template.

## User-provided facts
- Source: user. Every visible fact lives in `src/content.ts` and `index.html`: name, role, employers, dates, degrees, stack, favourites, countries, contact links, closing quote.

## Missing facts
- Portrait or photography: [NEEDS INPUT] (none in the repo).

## Working assumptions
- Scope: one page, same six sections, same order.
- Light/dark toggle stays and still follows the OS preference until the visitor picks; dark is the designed-first mode.
- Copy stays verbatim; only layout labels are added (section numbers, "Birthday").

## Constraints
- React 19, Vite 8, Motion 13, plain CSS (no Tailwind).
- Pushing to `master` deploys to GitHub Pages; nothing gets pushed.
