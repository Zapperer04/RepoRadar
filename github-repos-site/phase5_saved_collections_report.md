# Phase 5: Saved Repositories & Collections Persistence Report

## 1. Auth Audit & Integration
- **Mechanism:** JWT-based authentication via `Authorization: Bearer <token>` headers.
- **Identity:** `userId` extracted in `verifyToken` middleware and injected into `req.userId`.
- **Frontend:** `AuthContext.jsx` and `apiClient.js` synchronized to handle token storage and injection.

## 2. Database Schema Normalization
- **New Tables:**
  - `saved_repositories`: Canonical storage for user-tracked projects.
  - `collection_repositories`: Mapping table for grouping saved repos into collections.
- **Legacy Preservation:** Kept `favorites` and `collection_items` in `schema.sql` for potential data migration/backward compatibility, but all new logic uses canonical tables.
- **Indexes:** Added performance indexes on `user_id` and `collection_id` for all relevant tables.

## 3. Backend Implementation
- **Saved Controller:** Implemented `getSavedRepos`, `saveRepo`, `unsaveRepo`, and `checkSaved`.
- **Collections Controller:** Implemented full CRUD for collections and repo-to-collection mapping logic.
- **Backward Compatibility:** Aliased `/api/favorites` endpoints to the new `savedController` methods in `server/index.js`.

## 4. Frontend Services & Hooks
- **Services:** Created `savedService.js` and `collectionService.js` as clean wrappers around `apiClient`.
- **Global State:** Implemented `SavedReposContext.jsx` and `useSavedRepos` hook to manage saved state across the entire application without redundant API calls.
- **Collections Hook:** Created `useCollections` for managing folders and organization.

## 5. UI Wiring
- **RepoCard:** "Save" button now reactive to auth state. Redirects to `/login` if unauthenticated; toggles save/unsave if logged in.
- **RepoDetails:** "Save to Stash" button fully functional with backend persistence.
- **Saved Page:** `/saved` now renders real data from the database.
- **Collections Page:** `/collections` allows creating and deleting folders.

## 6. Manual Validation Results
- [x] Signup/Login flow: **Verified**
- [x] Save repository persistence: **Verified**
- [x] Duplicate save prevention: **Verified**
- [x] Collection creation/deletion: **Verified**
- [x] Protected route redirection: **Verified**

## 7. Known Limitations
- **Collection UI:** While the backend supports adding repos to collections, the frontend "Add to Collection" dropdown/modal on the RepoCard is scheduled for Phase 6.

## Phase 5 Status: COMPLETE
The foundation for a personalized developer experience is now live and persistent.
