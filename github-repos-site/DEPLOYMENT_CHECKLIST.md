# ✅ RepoRadar Deployment Checklist

Follow these steps in order to achieve a stable production deployment.

## 1. Database Setup (Neon PostgreSQL)
- [ ] Create a new project on [Neon.tech](https://neon.tech).
- [ ] In the Neon Dashboard, go to **Connection Details**.
- [ ] Ensure **Pooled Connection** is toggled ON.
- [ ] Copy the connection string (`postgres://...`).
- [ ] Open the **SQL Editor** in Neon and paste/run the contents of `server/db/schema.sql`.
  - *Alternatively, if you have Node locally:* `DATABASE_URL=your_neon_url node server/db/init.js`

## 2. Backend Deployment (Render)
- [ ] Create a new **Web Service** on Render.
- [ ] Connect your GitHub repository.
- [ ] Use settings from `RENDER_DEPLOYMENT_SETTINGS.md`.
- [ ] Add all required environment variables.
- [ ] Wait for deployment to finish.
- [ ] **Test**: Visit `https://your-api.onrender.com/api/health`.

## 3. Frontend Deployment (Vercel)
- [ ] Import your project into [Vercel](https://vercel.com).
- [ ] Vercel should automatically detect the Create React App settings.
- [ ] Add the following **Environment Variable**:
  - `REACT_APP_API_BASE_URL`: `https://your-api.onrender.com`
- [ ] Deploy the project.
- [ ] **Update Render**: Once you have your Vercel URL, update the `CLIENT_URL` environment variable on Render to match it.

## 4. Final Verification
- [ ] Open the Vercel app URL.
- [ ] Verify **Home** page loads.
- [ ] Go to **Explore** and verify repo data appears (API connection).
- [ ] Perform a **Signup** and **Login**.
- [ ] Save a repository and verify it appears in **Saved**.
- [ ] Create a collection and verify persistence.

---
**Warning**: If you change the database schema, remember to update the Neon database manually or via the initialization script.
