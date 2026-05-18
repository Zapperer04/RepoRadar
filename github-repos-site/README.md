# 🛰️ RepoRadar

**Discover underrated open-source repositories before they blow up.**

RepoRadar is a developer intelligence dashboard designed to help engineers and contributors find "hidden gem" projects on GitHub. It uses repository scoring and discovery metrics to surface high-quality, growing projects that haven't hit the mainstream yet.

## 🚀 Features
- **Discovery Engine**: Browse high-potential repositories by domain or language.
- **Hidden Gem Scoring**: Projects are ranked by a proprietary "Gem Score" based on activity, documentation, and growth.
- **Trending & Growth**: Track projects that are gaining momentum in real-time.
- **Personal Stash**: Save repositories to your personal dashboard.
- **Collections**: Organize projects into custom collections.
- **Fallback Resilience**: Seamlessly switches to cached data if the GitHub API is unavailable.

## 🛠️ Tech Stack
- **Frontend**: React (Create React App), Vanilla CSS, React Router 7.
- **Backend**: Express.js, PostgreSQL.
- **Auth**: JWT (JSON Web Tokens).
- **APIs**: GitHub REST API.

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (local or hosted)
- GitHub Personal Access Token (optional, for higher rate limits)

### 2. Installation
```bash
git clone https://github.com/yourusername/reporadar.git
cd reporadar
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5005
PORT=5005
JWT_SECRET=your_secret_here
DATABASE_URL=postgresql://user:password@localhost:5432/goat_repo_finder
GITHUB_TOKEN=your_token_here
```

### 4. Start the Application
**Start Backend (Port 5005):**
```bash
npm run server
```

**Start Frontend (Port 5006):**
```bash
npm start
```

## 📜 Scripts
- `npm start`: Runs the frontend on port 5006.
- `npm run server`: Runs the backend on port 5005.
- `npm run build`: Builds the production-ready frontend bundle.
- `npm run validate:auth`: Runs API validation for auth and profile.
