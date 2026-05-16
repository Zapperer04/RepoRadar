# 🚀 RepoRadar Deployment Notes

This guide provides recommendations for deploying RepoRadar to production environments.

## 📦 Recommended Hosting Providers
| Layer | Recommended | Alternatives |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Netlify, GitHub Pages |
| **Backend** | **Render** | Railway, Heroku |
| **Database** | **Neon** | Supabase, Railway |

## ⚙️ Environment Configuration

### Frontend (Vercel)
Set these in **Project Settings > Environment Variables**:
- `REACT_APP_API_BASE_URL`: Full URL of your Render backend (e.g., `https://reporadar-api.onrender.com`).

### Backend (Render)
Set these in **Environment**:
- `NODE_ENV`: `production`
- `CLIENT_URL`: Your Vercel app URL (e.g., `https://reporadar.vercel.app`).
- `DATABASE_URL`: Your Neon PostgreSQL connection string (use pooled version).
- `JWT_SECRET`: A secure random string for authentication.
- `GITHUB_TOKEN`: A Personal Access Token to avoid GitHub API rate limits.
- `GITHUB_API_BASE_URL`: `https://api.github.com`

## 🚧 Critical Deployment Steps
1. **Database Initialization**: Open the Neon SQL Editor and run the contents of `server/db/schema.sql` before starting the backend.
2. **Build Command**: The root `npm run build` will build the React application.
3. **Start Command**: Use `npm run server` for the backend service.
4. **Proxy Handling**: The `package.json` proxy is only for local dev. Production relies on `REACT_APP_API_BASE_URL`.


## ⚠️ Known Blockers
- **Profile Endpoint**: The `/api/user/profile` endpoint returns HTTP 500. It is intentionally bypassed in the current UI. Do not attempt to fix this during deployment until the standard data contract is finalized.
