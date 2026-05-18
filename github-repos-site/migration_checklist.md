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

## Phase 7: Profile Completion (Completed)
- [x] **API Standardized**: Implemented `/api/auth/me` (GET, PUT, DELETE) and `/api/auth/password` (PUT) routes.
- [x] **Fallback Support**: Updated token decoding to handle both `userId` and `id` keys.
- [x] **Stats Integration**: Connected profile dashboard to user metrics API.
- [x] **Delete Cascade**: Confirmed automatic cascaded deletion of all collections and stashed repos when user is deleted.
- [x] **Secure Confirmation**: Added standard confirmation prompts and a "DELETE" typed check before deletion to prevent accidental loss.
- [x] **User Syncing**: Connected profile updates to React's `AuthContext` so user data stays perfectly in sync.

## Known Issues (Demo Stabilization)
- **Search History**: Backend endpoint exists, but UI integration is minimal.
- **GitHub Rate Limit**: Fallback data layer will trigger automatically if API fails.

## Phase 6 (Pending)
- [ ] **AI Summaries & Insights Integration**
- [ ] **Collection Details UI**
- [ ] **Technical Audit UI Hardening**
