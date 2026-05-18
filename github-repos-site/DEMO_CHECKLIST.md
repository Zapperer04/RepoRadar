# RepoRadar Stable Demo Checklist

## 🛠️ Demo Environment
- **Frontend**: `http://localhost:5006` (`npm start`)
- **Backend**: `http://localhost:5005` (`npm run server`)
- **Environment**: `.env` configured with `REACT_APP_API_BASE_URL`
- **Status**: **FULLY OPERATIONAL**

## 🚀 Recommended Demo Flow

### 1. Discovery (Public)
- [ ] Open `http://localhost:5006/`
- [ ] Navigate to **Explore**
- [ ] Apply a filter (e.g., Language: Javascript)
- [ ] Sort by **Stars** or **Hidden Gem Score**
- [ ] Click a repository card to view **Details**

### 2. Authentication
- [ ] From Home or Explore, click **Sign Up**
- [ ] Create a new test account
- [ ] **Verify**: Redirected to Home, Navbar shows user name
- [ ] **Verify**: Click username in Navbar to open **Profile Settings**
- [ ] **Verify**: View details, edit profile, change password, or delete account

### 3. Persistence
- [ ] Go back to any Repository Details page
- [ ] Click the **Save Repository** button
- [ ] Navigate to the **Saved** page
- [ ] **Verify**: Saved repository appears in the list
- [ ] Refresh the page to confirm database persistence

### 4. Organization
- [ ] Navigate to **Collections**
- [ ] Create a new collection (e.g., "AI Tools")
- [ ] **Verify**: Collection card appears

## ✨ Visual Polish & Stability
- [x] **RepoCard Layout**: Action buttons aligned in a consistent 4-column grid (2 on mobile).
- [x] **Footer Stability**: Centered and padded to match page container; no horizontal overflow.
- [x] **State Feedback**: Visible "Saving..." and "Removing..." text on interaction.
- [x] **Animations**: Smooth fade/scale removal on Saved page.

## ⚠️ Known Issues & Mitigations
| Issue | Status | Mitigation |
| :--- | :--- | :--- |
| **Profile Dashboard** | 🟢 STABLE | Account details, edits, password updates, and account deletion are fully functional. |
| **Search History** | 🟡 PARTIAL | Backend endpoint exists, but UI integration is minimal. |
| **GitHub Rate Limit** | 🟢 STABLE | Fallback data layer (`fallbackRepos.js`) will trigger automatically if API fails. |


## 📦 Technical Notes
- **Persistence**: Uses `saved_repositories` and `collections` canonical tables.
- **API Routing**: All calls use `/api` prefix and are proxied correctly.
- **Port Separation**: React (5006) and Express (5005) are decoupled.
