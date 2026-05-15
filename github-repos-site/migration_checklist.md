# Phase 2 Migration Checklist — RepoRadar (Goat Repo Finder)

## Routing Architecture Normalization
- [x] Official route definitions synchronized in `src/routes/AppRoutes.jsx`
  - `/` -> `<Home />`
  - `/explore` -> `<Explore />`
  - `/hidden-gems` -> `<HiddenGems />`
  - `/trending` -> `<Trending />`
  - `/domains` -> `<Domains />`
  - `/login` -> `<Login />`
  - `/signup` -> `<Signup />`
  - `/profile` -> `<ProtectedRoute><Profile /></ProtectedRoute>`
  - `/collections` -> `<ProtectedRoute><Collections /></ProtectedRoute>`
  - `/saved` -> `<ProtectedRoute><SavedRepos /></ProtectedRoute>`
- [x] Backward compatibility redirect mapping explicitly configured:
  - `/search` -> Redirects to `/explore`
  - `/gems` -> Redirects to `/hidden-gems`
  - `/categories` -> Redirects to `/domains`
- [x] Hard rule verified: No backend logic touched.
- [x] Hard rule verified: No scoring or AI summaries introduced.
- [x] Hard rule verified: Navbar routing points exactly to standard routes.

## Pages Implementation Check
- [x] `src/pages/Trending.jsx` verified: High-fidelity layout using `MainLayout`, displaying official page header and `EmptyState` placeholder.
- [x] `src/pages/Domains.jsx` verified: Fully complete implementation importing custom `DomainGrid` inside `MainLayout`.

## CSS Architecture Audit & Integration
- [x] Verified `src/index.css` master design system imports exactly:
  - `./styles/variables.css`
  - `./styles/globals.css`
  - `./styles/layout.css`
  - `./styles/components.css`
  - `./styles/animations.css`
- [x] Legacy CSS imports audited:
  - `Auth.css`, `Collections.css`, `Favorites.css`, `Navbar.css`, `Profile.css` are completely unimported in all JS/JSX source files.
- [x] `App.css` verified: Exclusively provides custom non-conflicting structure for un-normalized custom discovery interfaces (`.deep-dive-modal`, `.explorer-dashboard-layout`, etc.) using core design tokens/aliases.

## Complete Design System Verification
- [x] Core Design Tokens & UI Utilities present and active:
  - `Button.jsx`, `Input.jsx`, `Card.jsx`, `Badge.jsx`, `Skeleton.jsx`, `EmptyState.jsx`, `Loader.jsx` exporting standard prefix layouts.
- [x] Premium Global Layout components present and active:
  - `MainLayout.jsx`, `DashboardLayout.jsx`, `AuthLayout.jsx` properly utilizing the standardized `Navbar.jsx`.

## Phase 3 Core UI Integration
- [x] **Data Layer**: Mock repository layer (`mockRepos.js`) implemented with rich domain intelligence fields.
- [x] **Constants Layer**: Filter parameters, core routes, and domain mappings strictly decoupled.
- [x] **Repo Engine Components**: Custom domain grid tools extracted successfully to `RepoCard`, `RepoGrid`, `RepoFilters`, `RepoSortBar`, `RepoSearchBar`.
- [x] **Page Refactoring**:
  - `Home.jsx` completely rebuilt to highlight hidden gem value proposition.
  - `Explore.jsx` structured into a powerful local filtering dashboard.
  - `HiddenGems.jsx`, `Trending.jsx`, `Domains.jsx` transformed with specialized content arrays.
  - `SavedRepos.jsx`, `Collections.jsx` cleanly mapped to user data schemas.
  - `RepoDetails.jsx` placeholder created for direct repository intelligence viewing.
- [x] **Rule Verification**: Zero backend logic or DB scoring implemented. Strictly UI.

## Phase 3.5 Visual QA & Polish
- [x] **Component Polish**: `RepoCard` strictly aligned with clamped text, flex-bottom buttons, and stable dimensions. Empty states centered in `RepoGrid`.
- [x] **Responsive Scaling**: Mobile fluid typography applied to `Home` hero text. `Navbar` horizontally bounds links to prevent overflow.
- [x] **Interaction Hardening**: `Explore` page search deeply parses multiple mock data fields case-insensitively. Added "Reset Filters" and URL query parsing for Domain CTA linking.
- [x] **Defensive Rendering**: `RepoDetails` gracefully handles missing object fields. Sections on `HiddenGems` hide if data arrays are empty.

## Phase 4 Backend API Contract & GitHub Service
- [x] **Contract Definition**: Established identical shape for `normalizeGitHubRepo` to match legacy mock data.
- [x] **GitHub Service**: Built robust `github.service.js` querying `/search/repositories`.
- [x] **Scoring Functions**: Created simple, deterministic formulas for Hidden Gem, Growth, Docs, and Maintenance.
- [x] **Fallback Engine**: Implemented `fallbackRepos.js` backend safety net preventing HTTP 500s during rate limits.
## Phase 4.5 Backend API Verification & Fallback Transparency
- [x] **Route Audit**: Confirmed route order prevents dynamic route swallow. Added `/api/health`.
- [x] **Diagnostic Injection**: API responses now include `errorMessage` on fallback. Server logs endpoint failures.
- [x] **Health Check**: Verified token status reporting in health endpoint.
- [x] **Validation Suite**: Created `scripts/validate-api.js` and integrated into `package.json`.
- [x] **Frontend Transparency**: Source badges verified across all dynamic pages.

## Phase 5 (Pending)
- [ ] **Saved Repos & Persistence**
- [ ] **User Collections**
- [ ] **AI Summaries**
