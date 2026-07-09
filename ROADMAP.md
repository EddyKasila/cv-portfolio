# PortfolioOS Roadmap

> The living development plan for transforming a static portfolio into a personal professional platform.

## Current Architecture

```
public/
  data/           # Canonical JSON content files (editable)
  assets/         # Images, PDFs
src/
  components/     # Astro components (About, Experience, etc.)
  layouts/        # Page layouts
  lib/            # Core logic (ContentService, auth, validation)
  pages/          # Routes (index, resume, projects, contact, login, admin)
  types/          # TypeScript interfaces
  styles/         # SCSS
  utils/          # Helper utilities
```

**Key patterns:**
- All content is stored as JSON in `public/data/`
- `ContentService` reads JSON at build time (SSG) via `fs` and at runtime (admin) via `fetch`
- Admin dashboard uses a module registry pattern — each content type is a self-contained module
- Authentication uses localStorage with session expiry (lightweight, not enterprise-grade)

## Completed Features

- [x] Static portfolio pages (Home, Resume, Projects, Contact)
- [x] Responsive design with dark/light mode
- [x] Glassmorphism navbar
- [x] Formspree contact form integration
- [x] GitHub Pages deployment via Actions
- [x] Profile section refactored to data-driven JSON
- [x] JSON content files for all data types
- [x] TypeScript interfaces for all content schemas
- [x] Validation library with field-level rules
- [x] Authentication (localStorage-based)
- [x] Admin dashboard shell with module registry
- [x] Profile editing module with preview and JSON export

## Planned Phases

### Phase 1 — Profile Module ✅
- JSON data layer
- Authentication
- Admin dashboard shell
- Reusable content module architecture
- Profile editor (preview, export)
- Public site reads from JSON

### Phase 2 — Experience Manager
- Admin CRUD for experience entries
- Reorder, add, edit, delete
- Rich text for task descriptions
- `experience.json` management

### Phase 3 — Project Manager
- Admin CRUD for projects
- Image upload via GitHub URL or path
- Tag/status management
- `projects.json` management

### Phase 4 — Education & Skills Manager
- Admin CRUD for education entries
- Skills taxonomy editor
- `education.json` and `skills.json` management

### Phase 5 — Contact & SEO ✅
- Contact settings editor (Formspree ID, fields, labels, required)
- SEO metadata editor per page
- Site settings panel (including GitHub token config)
- `contact.json`, `seo.json`, and `settings.json` management

### Phase 6 — Articles / Blog ✅
- Admin CRUD for articles
- Markdown content field
- Tags, slug, published date
- `articles.json` management

### Phase 7 — GitHub API Save ✅
- Direct "Publish to GitHub" from admin dashboard using PAT
- Token configured in Settings (stored in localStorage)
- Available on every module (Profile, Experience, Projects, etc.)

## Future Enhancements

- AI Writing Assistant for summaries and articles
- Job Application Tracker
- Consulting Portfolio Module
- Analytics Dashboard (page views, form submissions)
- Theme/Style customization from admin panel
- Multi-language support
- Resume builder with multiple template exports

## Technical Debt

- Admin dashboard styles are inline — should extract to dedicated SCSS
- Profile module editor uses imperative DOM manipulation — consider a reactive approach later
- No automated tests yet
- JSON schema validation exists but isn't wired into the admin forms yet
- GitHub API save is unimplemented (Phase 7)
- Login credentials are hardcoded — should be configurable via env/settings.json
