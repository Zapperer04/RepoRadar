# 🚀 RepoRadar Deployment Notes

This guide provides recommendations for deploying RepoRadar to production environments.

## 📦 Recommended Hosting Providers
| Layer | Recommended | Alternatives |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Netlify, GitHub Pages |
| **Backend** | **Render** | Railway, Heroku |
| **Database** | **Neon** | Supabase, Railway |

## ⚙️ Environment Configuration

### Frontend (Build Time)
Ensure the following variables are set in your CI/CD environment (Vercel/Netlify settings):
- `REACT_APP_API_BASE_URL`: The full URL of your deployed backend (e.g., `https://api.reporadar.com`).

### Backend (Runtime)
Ensure the following variables are set in your backend hosting environment:
- `PORT`: Usually 10000 or 5000 (standard on Render).
- `DATABASE_URL`: Your production PostgreSQL connection string.
- `JWT_SECRET`: A long, random string for signing tokens.
- `GITHUB_TOKEN`: Recommended to avoid rate limits.

## 🚧 Critical Deployment Steps
1. **CORS Policy**: Update the `cors()` configuration in `server/index.js` to allow your production frontend domain.
2. **Database Migration**: Ensure the database is initialized using `server/db/schema.sql`.
3. **Build Command**: Use `npm run build` to generate the `build/` folder for the frontend.
4. **Proxy Removal**: In production, the `package.json` proxy field is ignored. Ensure the frontend is calling the full absolute URL of the backend.

## ⚠️ Known Blockers
- **Profile Endpoint**: The `/api/user/profile` endpoint returns HTTP 500. It is intentionally bypassed in the current UI. Do not attempt to fix this during deployment until the standard data contract is finalized.
