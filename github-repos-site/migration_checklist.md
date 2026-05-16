# RepoRadar Migration & Hardening Checklist

## Phase 2: Design System & Routing Normalization
- [x] Canonical route naming implemented:
  - `/explore` (formerly `/search`)
  - `/hidden-gems` (formerly `/gems`)
  - `/trending`
  - `/domains` (formerly `/categories`)
- [x] Backward compatibility redirects configured:
  - `/search` -> Redirects to `/explore`
  - `/gems` -> Redirects to `/hidden-gems`
  - `/categories` -> Redirects to `/domains`
- [x] Hard rule verified: No backend logic touched.
- [x] Hard rule verified: No scoring or AI summaries introduced.
- [x] Hard rule verified: Navbar routing points exactly to standard routes.

## Phase 5.5: Auth & Persistence Verification
- [x] **Diagnostic Audit**: Identified and fixed critical routing and API helper bugs.
- [x] **API Ordering**: Fixed `index.js` require sequence.
- [x] **Service Hardening**: Unified `apiClient` helpers and added `/api` prefixes to `repoService`.
- [x] **State Synchronization**: Resolved `useSavedRepos` hook/context conflict.
- [x] **Validation Script**: Created `scripts/validate-saved-api.js` for authenticated testing.
- [x] **Bug Fix (Demo)**: Fixed RepoCard crash with defensive rendering and normalization.
- [x] **Bug Fix (Demo)**: Standardized GitHub URLs and removed 404 links.
- [x] **Bug Fix (Demo)**: Fixed Domain click -> Explore filter mismatch.
- [x] **Bug Fix (Demo)**: Removed AI placeholder copy from RepoDetails.

## Phase 6: UX Completion & Stabilization
- [x] **Collection Management**: Implemented "Add to Collection" modal from Saved and RepoDetails.
- [x] **Collection Details**: Added dedicated page to view and manage repositories within collections.
- [x] **Interaction Feedback**: Added loading states ("Saving...", "Removing...") to all save actions.
- [x] **Micro-Animations**: Implemented "shrink out" removal animation on Saved page.
- [x] **Footer**: Integrated professional footer on Home and public pages.
- [x] **UX Hardening**: Replaced `prompt()` with inline forms for a more premium experience.
- [x] **RepoCard Action Layout**: Repaired for consistent height and 4-column grid.
- [x] **Footer Layout**: Repaired for proper centering and container alignment.
- [x] **Button States**: Polished labels and loading feedback.
- [x] **Animations**: Refined Saved page removal transition.
- [x] **Repo Insights**: Implemented deterministic, rule-based repository insights (no AI).
- [x] **Content Polish**: Replaced generic "Why this repo matters" placeholders with repo-specific copy.
- [x] **Strengths Indicators**: Added dynamic strengths badges based on repository metadata.

## Known Issues (Demo Stabilization)
- **Profile Dashboard (HTTP 500)**: The `/api/user/profile` and `/api/auth/me` endpoints currently return 500. 
- **Mitigation**: Disabled profile backend calls and added maintenance UI to `/profile`. Removed links from Navbar.
- **Next Step**: Standardize profile data contract and debug backend model/controller.

## Phase 6 (Pending)
- [ ] **AI Summaries & Insights Integration**
- [ ] **Collection Details UI**
- [ ] **Technical Audit UI Hardening**
