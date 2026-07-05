# PortfolioOS — Architecture & Learning Guide

## What Changed and Why

### Before: Hardcoded Data
Every page had its content written directly in the Astro component or imported from a single TypeScript file (`cv.ts`). Editing meant modifying code.

### After: Data-Driven Architecture
All content lives in JSON files under `public/data/`. The website reads from these files at build time. The admin dashboard lets you edit them in-browser and export the updated JSON.

## File-by-File Breakdown

### `public/data/*.json` — The Content Layer
Each JSON file is the single source of truth for one content type. They live in `public/` so they're:
- Served as static assets for the admin dashboard to `fetch()` at runtime
- Readable by Node.js `fs` during the Astro build (SSG)

**The files:**
| File | What it holds |
|------|---------------|
| `profile.json` | Name, title, tagline, summary, contact info, social links, interests |
| `experience.json` | Array of job entries (role, company, period, tasks) |
| `projects.json` | Array of project entries (name, role, period, description, etc.) |
| `education.json` | Array of education entries (institution, degree, field, period) |
| `skills.json` | Programming skills (with icons) + professional skills |
| `certifications.json` | Certifications and awards |
| `articles.json` | Blog/articles (empty, ready for future) |
| `contact.json` | Formspree ID, field configuration |

### `src/types/index.ts` — Type Safety
Every JSON file has a matching TypeScript interface. This gives us:
- Autocomplete in the editor
- Build-time type checking
- A contract for what each content file must contain

Example:
```typescript
interface Profile {
  name: string;
  title: string;
  email: string;
  social: SocialLink[];
  // ...
}
```

### `src/lib/content.ts` — The ContentService
The bridge between JSON files and the website. Two modes:

**Build time (SSG):**
```typescript
const profile = ContentService.getSync<Profile>('profile');
```
Uses Node.js `fs` to read from `public/data/`. Called in Astro frontmatter.

**Runtime (admin dashboard):**
```typescript
const profile = await ContentService.get<Profile>('profile');
```
Uses `fetch()` to load JSON via HTTP. Called in client-side scripts.

**Why two methods?**
- Astro builds the site once, at build time. `fs` is faster and available then.
- The admin dashboard runs in the browser. `fetch` is the only way to load data there.

### `src/lib/validation.ts` — Input Validation
A lightweight validation engine for admin forms. Each field can have rules:
```typescript
validateField(value, [
  { field: 'email', label: 'Email', required: true, type: 'email' },
  { field: 'name', label: 'Name', required: true, minLength: 2 },
])
```
Returns `{ valid: boolean, errors: Record<string, string> }`.

### `src/lib/auth.ts` — Authentication
A simple localStorage-based auth system:
- Login stores a session with 24-hour expiry
- Admin page checks auth on load (redirects to login if expired)
- Credentials are configurable (currently hardcoded defaults, env var support planned)

**Security note:** This is NOT enterprise-grade security. Since GitHub Pages is a static host, there's no backend to validate against. This prevents casual editing but determined attackers could bypass it.

### `src/lib/admin.ts` — Admin Module System
The admin dashboard uses a **module registry** pattern:

```typescript
adminApp.register({
  id: 'profile',
  label: 'Profile',
  icon: 'fa-user',
  enabled: true,
  render: renderProfileEditor,
});
```

Each content type is a self-contained module. Adding a new one means:
1. Create the JSON file
2. Create the TypeScript interface
3. Register the module in `admin.astro`
4. Write the editor function

This is the "product" architecture — future modules (Experience, Projects, etc.) plug in without modifying core code.

### `src/pages/login.astro` & `admin.astro` — Admin Dashboard
- `login.astro` — Simple login form, stores session in localStorage
- `admin.astro` — Shell with sidebar navigation, loads the active module's editor

The admin page loads modules from a registry, renders the sidebar dynamically, and swaps content areas when you navigate.

## How the Save Workflow Works (Phase 1)

1. **Edit** — Form fields are pre-filled from the JSON file
2. **Preview** — See your changes rendered as a card before saving
3. **Export** — Download the updated JSON file
4. **Commit** — Replace the old JSON in `public/data/` with the downloaded one, then commit to GitHub

**Why not "Save to GitHub"?** GitHub Pages is static — it can't write files. A future phase will add a GitHub API button that commits changes directly using a Personal Access Token.

## How to Add a New Content Type

Let's say you want to add "Testimonials":

1. Create `public/data/testimonials.json`:
```json
[{ "name": "Alice", "quote": "Great work!", "role": "Client" }]
```

2. Add the interface in `src/types/index.ts`:
```typescript
export interface Testimonial {
  name: string;
  quote: string;
  role: string;
}
export interface ContentMap {
  // ...existing
  testimonials: Testimonial[];
}
```

3. Use it in a component:
```typescript
import { ContentService } from '@/lib/content';
import type { Testimonial } from '@/types';
const testimonials = ContentService.getSync<Testimonial[]>('testimonials');
```

4. Register in admin dashboard (add to `admin.astro`):
```typescript
adminApp.register({
  id: 'testimonials',
  label: 'Testimonials',
  icon: 'fa-comment',
  enabled: true,
  render: renderTestimonialEditor,
});
```

## Key Principles

1. **Separation of concerns** — Data (JSON) is separate from presentation (Astro)
2. **Build once, serve everywhere** — SSG for speed, JSON for flexibility
3. **Module registry** — Adding features doesn't mean rewriting existing code
4. **Progressive enhancement** — Phase 1 is simple (export/download); later phases add GitHub API saves
5. **Documentation as product** — Every decision is explained so you understand the "why"
