# DESIGN.md: Visual System

## Brand
- Name: Anh Nguyen
- Concept: Final approach. The page reads as a cockpit HUD flying an approach: each section is a waypoint, Contact is touchdown. Source: the site's own content (DCS approaches, flight sim, Top Gun, Star Trek, Star Wars).
- Voice: technical, precise, human (PRODUCT.md).
- Anti-patterns to avoid: purple or cyan glow, glass panels, matrix green, text scramble, invented telemetry numbers, cards as the default grouping, hover effects on static content.

## Dials
- DESIGN_VARIANCE: 8
- MOTION_INTENSITY: 7
- VISUAL_DENSITY: 4

Developer portfolio preset 6/5/4, redesign overhaul +2/+2, density kept.

## Color System
Source row: colors.csv row 83, Space Tech / Aerospace ("Star white + launch blue"). Dark is the native mode of the row.

- Primary: #F8FAFC (name, headings, active labels)
- On Primary: #0F172A
- Secondary: #94A3B8 (secondary symbology)
- On Secondary: #0F172A
- Accent: #3B82F6 (active state only: lock brackets, tape pointer, lit timeline nodes, link underline, flight path marker)
- On Accent: #FFFFFF
- Background: #0B0B10
- Foreground: #F8FAFC
- Card: #1E1E23 (reserved, no card surfaces in this layout)
- Card Foreground: #F8FAFC
- Muted: #232328 (split-flap cells)
- Muted Foreground: #94A3B8 (labels, meta text, tape labels, module corners)
- Border: #1E293B (hairlines, tick scales, static rails)
- Destructive: #EF4444 (reserved, the site has no destructive actions)
- On Destructive: #FFFFFF
- Ring: #F8FAFC (focus outline)
- Logo plate: #F8FAFC (company logos in the work log sit on it)

Light mode ("daylight"), derived from row 83: swap Background/Foreground and Card/Card Foreground, keep every value inside the row.
- Background: #F8FAFC (derived from row Foreground)
- Foreground: #0B0B10 (derived from row Background)
- Muted Foreground: #1E293B (derived from row Border, 13.9:1 on #F8FAFC)
- Border: #94A3B8 (derived from row Secondary, hairlines only)
- Muted: #FFFFFF (derived from row On Accent, split-flap cells)
- Logo plate: #FFFFFF (derived from row On Accent)
- Ring: #0B0B10 (derived from row Background)
- Accent: #3B82F6 stays; graphics and lines only in light mode (3.5:1 on #F8FAFC), never small text.

Tech icons are monochrome symbology (Muted Foreground). Company logos and country flags are image assets and keep their own colours.

## Typography
Source row: typography.csv row 51, Tech/HUD Mono.
- Heading Font: Share Tech Mono
- Body Font: Fira Code
- Display (name): Share Tech Mono 400, clamp(4.5rem, 1.5rem + 11vw, 8rem), capped at 15svh, tracking -0.01em, leading 0.92, uppercase
- H2: Share Tech Mono 400, clamp(1.5rem, 1.3rem + 0.9vw, 2.125rem), tracking 0.04em, leading 1.1, uppercase
- H3: Fira Code 600, clamp(1.125rem, 1.06rem + 0.3vw, 1.3125rem), leading 1.3
- Body: Fira Code 400, clamp(1rem, 0.97rem + 0.15vw, 1.0625rem), leading 1.65, ligatures off
- Lead: Fira Code 400, clamp(1.125rem, 1.06rem + 0.3vw, 1.3125rem), leading 1.6
- Label (HUD): Share Tech Mono 400, clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem), tracking 0.08em, uppercase
- Avoided as overused defaults: Inter, Roboto, Geist, Plus Jakarta Sans, Space Grotesk.

Type scale ratio: about 1.25 between body, lead and H2; the display size is a deliberate jump.
Max line length: 62ch for body, 58ch for the lead.
Both fonts are self-hosted woff2 (Fontsource, SIL OFL), latin subset, font-display swap.

## Spacing
Base unit: 4px
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 (tokens --s0 to --s8)
Section padding: --s7 (64px) block, gutter clamp(1.25rem, 4vw, 3rem) inline; short desktop screens compress --s6 and --s7.
Component gap: --s3 to --s5
Content max-width: 64rem (hero 72rem)

## Grid
- Desktop (62rem and up): fixed altitude tape on the left, content column offset by 11rem, 12-column grids inside sections.
- Tablet (48rem to 62rem): 2-column module grid in Stack, other sections single column.
- Mobile (below 48rem): single column, fixed 3.5rem status bar on top.
- Breakpoints: 40rem, 48rem, 62rem (HUD layout switches here, kept from the previous site).

## Radius
All sharp: 0 on every surface, button, plate and focus ring. Only exception: country flags stay circular (they are round image assets).

## Elevation
- Level 0 everywhere. No shadows.
- Hierarchy comes from 1px hairlines and corner brackets, the way HUD symbology works.

## Motion (see animate skill for canonical timing table)
- Easing: ease-out-quint cubic-bezier(0.22, 1, 0.36, 1); releases use ease-in-quint cubic-bezier(0.64, 0, 0.78, 0).
- Entrance: 280ms ease-out-quint, opacity plus at most 16px translate or scale 0.92 to 1.
- Exit: 200ms ease-in-quint, lock brackets releasing when a section stops being active.
- Hover: 160ms ease-out, colour, border colour and a 2px translate on links and buttons only.
- Active/Press: 100ms, scale 0.97.
- Stagger: 70ms between children (60ms in chip and flag grids, 90ms at the top of the hero).
- Lock: 320ms ease-out-quint, corner brackets close from scale 1.3 to 1 with opacity 0 to 1, replayed every time a section becomes active.
- Draw: 480ms ease-out-quint, scaleX or scaleY from 0 for the horizon line and the dotted leaders.
- Flap: 360ms ease-out-quint, rotateX from -90deg for departure board rows.
- Shutter: 520ms ease-out-quint, the name is uncovered by a panel sliding right with a 2px accent edge.
- Scroll-linked (desktop): each section's content rises 8vh into place while its top travels up the viewport, then shrinks to 0.94, dims to 30% opacity and drifts up 6vh while its bottom leaves. The hero banks the horizon 8deg and lifts the name away on the way out. The work timeline draws with scroll on every viewport. The tape pointer follows scroll through a spring (stiffness 400, damping 40).
- Pinned/horizontal: none. Desktop keeps scroll-snap (one section per gesture) so every transition settles on a finished frame.
- Mobile: no snap, no depth effect, no parallax, no hero bank; reveals and the timeline draw only.
- Reduced motion: no scroll-linked transforms, no boot sequence, no flaps, draws or shutters. Content renders in its final state. The tape pointer, progress fill and heading brackets jump to the active section with no transition; smooth scrolling is off.

## Component Patterns
- Shell: fixed viewport corner brackets and a right-edge tick scale (desktop), altitude tape navigation with a moving pointer (desktop), status bar with progress strip (mobile).
- Hero: asymmetric. Name top left, pitch ladder top right, full-width horizon with flight path marker, lead bottom left, data block bottom right.
- Work: flight-log timeline with diamond nodes, then compact education rows.
- Stack: instrument modules with corner brackets in an asymmetric 2+3 grid (6+6, then 3+3+6).
- Favourites: flight-computer readout, label and value joined by a dotted leader.
- Travel: visited flag grid by region, departure board of next destinations in split-flap cells.
- Contact: note, labelled link buttons, then the closing quote.
- Pricing, testimonials, logo walls: none.

## Image Style
- Photography: none provided (PRODUCT.md marks it NEEDS INPUT). The hero visual is HUD symbology built from plain lines plus a single flight path marker.
- Logos: company logos sit on a square plate, 2rem tall. Education logos have their outer white made transparent and sit straight on the page (2.25rem tall), so no white box shows in dark mode; Tilburg keeps the white inside its ring because its navy lettering needs it.
- Flags: existing circle flags, 20px.
- Icons: existing sprite, monochrome.

## Accessibility
- Color contrast: #F8FAFC on #0B0B10 about 19:1; #94A3B8 on #0B0B10 about 7.6:1; #1E293B on #F8FAFC about 13.9:1; accent never carries small text in light mode.
- Focus indicators: 2px solid Ring, offset 3px, square.
- Touch targets: minimum 44x44px (tape links, contact links, theme toggle, home mark).
- Semantic HTML: one h1 (the name), one h2 per section, h3 inside; main landmark; sections labelled by their headings.
- Reduced motion: as listed under Motion.
