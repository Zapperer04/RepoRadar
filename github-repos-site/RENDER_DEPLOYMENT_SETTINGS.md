# 🚀 Render Deployment Settings for RepoRadar API

Use these settings when creating a new **Web Service** on [Render](https://render.com).

## 📋 General Settings
- **Runtime**: `Node`
- **Region**: Select closest to your database (e.g., `Oregon (US West)` for Neon default)
- **Root Directory**: `.`
- **Build Command**: `npm install`
- **Start Command**: `npm run server`
- **Plan**: `Free` or `Starter`

## 🔐 Environment Variables
Add these keys in the **Environment** tab:

| Key | Value / Source | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | Port for the backend (Render default) |
| `CLIENT_URL` | `https://your-app.vercel.app` | Your deployed Vercel frontend URL |
| `DATABASE_URL` | `postgres://...` | Pooled connection string from Neon |
| `JWT_SECRET` | `your_random_secret_string` | Secret for authentication tokens |
| `GITHUB_TOKEN` | `ghp_your_personal_token` | Optional: GitHub API token for higher limits |
| `GITHUB_API_BASE_URL`| `https://api.github.com` | Base URL for GitHub API |

## 📡 Health Check
- **Health Check Path**: `/api/health`

## 🔄 Deployment Order
1. Connect this repository to Render.
2. Add the environment variables above.
3. Deploy.
4. Verify by visiting `https://your-render-url.onrender.com/api/health`.

---
*Note: The backend must be active before the frontend can fully function in production.*
