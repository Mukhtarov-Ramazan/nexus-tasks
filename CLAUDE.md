# CLAUDE.md

**NexusTasks** — веб-приложение для управления задачами (SPA) со встроенным мессенджером.

Используй краткие ответы, без лишнего кода - только ключевая информация.

Перед рефакторингом и работой с кодом всегда читай файл @spec.md.

## Commands

All frontend commands must be run from the `frontend/` directory.

```bash
# Development
cd frontend && npm run dev         # Start Vite dev server

# Build
cd frontend && npm run build       # Type-check + build
cd frontend && npm run build-only  # Build without type-check
cd frontend && npm run preview     # Preview production build

# Type checking
cd frontend && npm run type-check  # Run vue-tsc

# Formatting
cd frontend && npm run format      # Run Prettier on src/
```

There is no test suite configured yet. There is no ESLint config — only Prettier for formatting.

## Architecture

**NexusTasks** is a Vue 3 + TypeScript SPA for task management. The backend does not exist yet; the frontend is the only active codebase.

### Tech Stack

- **Vue 3** with Composition API and `<script setup>`
- **Nuxt UI v4** (component library built on Tailwind CSS + Radix Vue) — this is the primary source of UI components, not plain Tailwind
- **Pinia** for state management
- **Vue Router 4** for client-side routing
- **Vite 7** as the build tool
- **SCSS** for custom styles alongside Tailwind

### Folder Structure Convention

The `src/` directory follows a feature-based layered architecture:

```
src/
├── app/            # App bootstrap: App.vue, router, global assets/styles
├── pages/          # Route-level page components (thin wrappers)
├── widgets/        # Composite UI blocks used by pages
├── features/       # Business logic units (forms, actions)
├── layouts/        # Layout wrappers (DefaultLayout, AuthLayout)
├── stores/         # Pinia stores
└── shared/         # api/, config/ (ROUTES), ui/ (PasswordInput), types/
```

Each subdirectory in `pages/`, `widgets/`, and `features/` uses a barrel export `index.ts` and keeps actual components in a `ui/` subfolder.

### Layout System

`App.vue` dynamically selects the layout wrapper based on `route.meta.layout`. Routes set `meta: { layout: 'default' | 'auth' }` (строка; карта в `layouts/index.ts`).

- **DefaultLayout** — full app shell with header, sidebar navigation, avatar dropdown, and color mode toggle
- **AuthLayout** — minimal wrapper (just a `<slot>`)

### Routing

Defined in `src/app/router/index.ts`:

| Path | Page | Layout |
|------|------|--------|
| `/` | HomePage | default |
| `/registration` | RegistrationPage | auth |
| `/login` | LoginPage | auth |

### Nuxt UI Configuration

Configured in `vite.config.ts` via the `NuxtUI()` Vite plugin:

- Primary color: `black`
- Secondary color: `sky`
- Neutral color: `neutral`
- Container max-width: `1920px`

The path alias `@` maps to `./src`.

### Styling

- Global styles entry: `src/app/assets/styles/main.css` (imports Tailwind + Nuxt UI)
- SCSS partials in `src/app/assets/styles/`: `_base.scss`, `_fonts.scss`, `_reset.scss`, `index.scss`
- CSS custom properties (spacing scale, etc.) in `variables.css`
- Fonts: **Inter** (body), **JetBrains Mono** (monospace), loaded from local `assets/fonts/`
