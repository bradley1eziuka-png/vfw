# CLAUDE.md — Web Design + Marketing (v2 — Taste/Impeccable System)

## Skills Active This Session

Read and apply each skill file below before starting any work. No exceptions.

| Skill | File |
|-------|------|
| Impeccable (design system/harness) | `impeccable-main/DESIGN.md` + `impeccable-main/skill/` |
| Taste-Skill (anti-slop, taste) | `taste-skill-main/skills/` |
| Context Engineering | `Agent-Skills-for-Context-Engineering-main/SKILL.md` |
| Copywriting | `marketingskills-main/skills/copywriting/SKILL.md` |
| CRO | `marketingskills-main/skills/cro/SKILL.md` |
| SEO Audit | `marketingskills-main/skills/seo-audit/SKILL.md` |
| Competitor Profiling | `marketingskills-main/skills/competitor-profiling/SKILL.md` |
| Customer Research | `marketingskills-main/skills/customer-research/SKILL.md` |
| Site Architecture | `marketingskills-main/skills/site-architecture/SKILL.md` |

Before the first build in this project, also read `impeccable-main/AGENTS.md` and
`impeccable-main/CLAUDE.md` (the repo's own operating instructions) once, to confirm
the skill is being invoked the way its author intended — do not skip this step.

---

## When to Apply Each Skill

- **Impeccable** — read before writing any frontend code, every session. This is the
  primary design authority for this project — layout, visual system, component quality.
- **Taste-Skill** — apply to all output, design and copy alike, as a final anti-generic/
  anti-slop check. If Impeccable and Taste-Skill ever give conflicting guidance on the
  same decision, Impeccable wins on visual/layout matters, Taste-Skill wins on copy/
  microcopy tone.
- **Context Engineering** — apply throughout long sessions to manage context window
  efficiently.
- **Competitor Profiling** — run before any design or copy work begins. Understand
  what the client is up against.
- **Customer Research** — identify the actual buyer, their language, and what they
  care about. Feeds copy and CRO.
- **Site Architecture** — plan the full page structure before writing a single line
  of code.
- **Copywriting** — apply when writing or rewriting any client-facing text on the site.
- **CRO** — apply to page structure and layout decisions to maximize conversions.
- **SEO Audit** — run after the build is complete to ensure search optimization.

---

## Local Server

- Always serve on localhost — never screenshot a `file:///` URL.
- Start dev server: `python3 -m http.server 3000` (serves project root at
  `http://localhost:3000`)
- If server is already running, do not start a second instance.

---

## Screenshot Workflow

- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png`
  (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves
  as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read
  tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card
  gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex),
  alignment, border-radius, shadows, image sizing
- Do at least 2 comparison rounds. Stop only when no visible differences remain
  or user says so.

---

## Output Defaults

- Single `index.html` file, all styles inline, unless user says otherwise.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive.

---

## Brand Assets

- Always check the `Brand Assets/` folder before designing.
- If a logo is present, use it. If a color palette is defined, use those exact values.
- Do not use placeholders where real assets are available.

---

## Reference Image Rules

- If a reference image is provided: match layout, spacing, typography, and color
  exactly. Do not improve or add to the design.
- If no reference image: design from scratch following the Impeccable skill.
- Do not add sections or content not in the reference.
- Do not "improve" a reference — match it exactly.

---

## Anti-Generic Directive

Do not rely on the checklist-style guardrails from the previous system (banned
colors, fixed shadow rules, fixed easing rules). Impeccable and Taste-Skill are
the authority on avoiding generic/AI-templated output now — defer to their
internal logic rather than a static rule list. If output still reads as generic
after applying both skills, flag that directly rather than silently reapplying
old habits (default hero shapes, italic-word emphasis, dash-prefixed eyebrow
labels, pill-button pairs, 4-column icon trust strips — these are known overused
AI-default patterns, avoid regardless of what any skill file does or doesn't
explicitly ban).

---

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not default back to patterns Impeccable/Taste-Skill are meant to replace
