# Phase 5 Validation: Saved Repositories & Collections

Since this phase involves authentication and database state, follow these manual steps to verify the implementation.

## 1. Authentication Flow
- [ ] **Signup:** Create a new user at `/signup`. Verify redirection to `/explore`.
- [ ] **Login:** Logout and log back in at `/login`.
- [ ] **State Persistence:** Refresh the page and ensure the user remains logged in (Navbar shows username/profile).

## 2. Saved Repositories (Canonical)
- [ ] **Save from Explore:** Go to `/explore`, click "Save" on a repo card. 
  - [ ] Button text changes to "Saved".
  - [ ] Badge color changes to secondary.
- [ ] **Save from Details:** Go to `/repo/:owner/:name`, click "Save to Stash".
- [ ] **Verify List:** Go to `/saved`. The repositories should appear in the grid.
- [ ] **Unsave:** Click "Saved" button again to unsave. Verify repo disappears from `/saved` after refresh.
- [ ] **Duplicate Prevention:** Try to save the same repo multiple times (should be handled gracefully by UI/API).

## 3. Collections Flow
- [ ] **Create Collection:** Go to `/collections`, click "+ New Collection". Enter a name.
  - [ ] New card appears immediately.
- [ ] **Delete Collection:** Click the 🗑️ icon on a collection card. Verify it is removed.
- [ ] **Add to Collection (API Check):** 
  - *Note: Full UI for "Add to Collection" modal is pending Phase 6, but backend endpoint `POST /api/collections/:id/repos` is ready.*
  - Manual verification via Postman/Curl:
    ```bash
    POST /api/collections/1/repos
    { "repo": { "fullName": "facebook/react", ... } }
    ```

## 4. Protected Route Security
- [ ] **Direct Access:** Logout and try to visit `/saved` or `/collections` directly via URL.
  - [ ] Should redirect to `/login`.
- [ ] **Unauthorized Save:** Logout and try to click "Save" on a card.
  - [ ] Should redirect to `/login`.

## 5. Backward Compatibility (Legacy Aliases)
- [ ] **API Alias:** Verify `GET /api/favorites` returns the same data as `GET /api/saved`.
- [ ] **Collection Alias:** Verify `/api/collections` still works as it did before but uses the new schema logic.

## Summary
Phase 5 establishes the persistence layer for user intelligence. The app now transitions from a discovery tool to a personalized developer dashboard.
