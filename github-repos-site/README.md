# RepoRadar

RepoRadar is a full-stack open-source repository discovery dashboard that helps developers find trending, underrated, and domain-specific GitHub repositories.

*Originally started as **Goat Repo Finder** (Greatest of All Time Repository Finder), rebuilt and normalized into **RepoRadar**.*

---

## 🔗 Live Deployments

* **Live Frontend App:** [https://goat-repo-finder.vercel.app](https://goat-repo-finder.vercel.app)
* **Backend Health Check:** [https://reporadar-trfo.onrender.com/api/health](https://reporadar-trfo.onrender.com/api/health)
* **GitHub Repository:** [https://github.com/Zapperer04/Goat-Repo-Finder](https://github.com/Zapperer04/Goat-Repo-Finder)

---

## 📖 Project Overview

### The Problem
GitHub's built-in discovery mechanisms often suffer from the "winner-takes-all" effect, heavily prioritizing already-popular repositories with thousands of stars. This makes it difficult for developers, students, and open-source contributors to discover underrated, well-maintained, high-potential projects (the "hidden gems") or browse repositories systematically organized by domain.

### The Solution
RepoRadar is a full-stack developer portfolio project designed to orchestrate GitHub API metadata, calculate rule-based quality signals, and enable customized user dashboards. It structures repositories by active domain, growth momentum, rule-based "Hidden Gem" scores, and lets authenticated users stash discoveries and build curated collections.

This is a production-hardened engineering showcase demonstrating clean REST API design, JWT session persistence, relational database foreign-key cascade deletes, resilient fallback caching, and beautiful custom CSS layout systems.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React, React Router, Custom CSS Design System |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Neon DB |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt (password hashing) |
| **External API** | GitHub REST API |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Tooling & Libs** | pg (node-postgres), dotenv, CORS |

---

## ✨ Features

### 🔍 Repository Discovery & Intelligence
* **Smart Search & Filters:** Find projects by keyword or language, and sort by star counts, growth rate, or domain metadata.
* **Rule-Based "Hidden Gem" Scoring:** Algorithmic calculation assessing repositories using specific parameters:
  $$\text{Gem Score} = f(\text{Stars}, \text{Forks}, \text{Active Issues}, \text{Recent Growth}, \text{Documentation Quality})$$
  Surfaces high-quality repositories that are well-maintained but under-starred.
* **Domain-Based Browsing:** Discover open-source utilities organized cleanly into dedicated areas like *Developer Tools*, *Web Frameworks*, *AI & Machine Learning*, and *Data Engineering*.
* **Resilient Fallback Engine:** Features a JSON data-caching layer that seamlessly switches to high-fidelity local repository mocks if the GitHub API hits rate-limiting constraints or experiences downtime.

### 👤 User Workspace (Authenticated)
* **JWT Authentication:** Secure user signup and login with cookie/token-based protected routes.
* **Personal Stash:** Save/unsave repositories directly to a personal dashboard with persistent state.
* **Curated Collections:** Group saved repositories into custom, user-defined folders (collections) for structured technical research.
* **Premium Profile Settings:**
  * **Dynamic Metrics Dashboard:** Real-time counters showing saves, collections, and search history.
  * **Editable Details:** Modify active account username and contact email address with live validation.
  * **Security Management:** Standard password reset forms using Bcrypt validation.
  * **Secure Account Closure:** A hardened danger zone requiring the user to enter the exact confirmation phrase `DELETE` alongside their current password to execute cascade database purging.

---

## 📐 System Architecture

RepoRadar utilizes a decoupled full-stack architecture separating client presentation, API routing, and database storage:

```
                  +-----------------------------------+
                  |        Client Browser             |
                  |     (React SPA on Vercel)         |
                  +-----------------+-----------------+
                                    |
                                    | HTTPS / REST API
                                    v
                  +-----------------+-----------------+
                  |      Backend Web Server           |
                  |     (Express.js on Render)        |
                  +--------+-----------------+--------+
                           |                 |
            PostgreSQL DB  |                 | HTTP Request
            (Pooled connection)              |
                           v                 v
                  +--------+--------+  +-----+----------------+
                  |  Database Layer |  |   External API       |
                  |   (Neon DB)     |  | (GitHub REST API)    |
                  +-----------------+  +-----+----------------+
                                             | (If Rate Limited)
                                             v
                                       +-----+----------------+
                                       | Local Resiliency     |
                                       | Cache (Fallback Data)|
                                       +----------------------+
```

### Resiliency Design
When a user requests repository details, the Express server queries the GitHub API. If the server detects rate limiting (`403 Forbidden`) or connection timeouts, it automatically merges the query with a local structured database fallback of curated repository indexes, guaranteeing that the application is always functional and interactive.

---

## 📡 API Overview

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/signup` - Register a new account.
* `POST /api/auth/login` - Authenticate and receive a JWT.
* `GET /api/auth/me` - Retrieve authenticated user profile session.
* `PUT /api/auth/me` - Update username and contact email.
* `PUT /api/auth/password` - Securely change login password.
* `DELETE /api/auth/me` - Delete account and cascade delete all user-owned data.

### 📦 Repositories (`/api/repos`)
* `GET /api/repos` - List active curated repositories.
* `GET /api/repos/search` - Query repositories using text and filters.
* `GET /api/repos/hidden-gems` - Retrieve repositories sorted by Gem Score.
* `GET /api/repos/trending` - Fetch trending repositories based on recent star growth.
* `GET /api/repos/domains` - List supported domain groups.
* `GET /api/repos/:owner/:repoName` - Fetch full metadata details for a specific repository.

### 💾 Saved Items (`/api/saved`)
* `GET /api/saved` - Get all saved repositories for the active session.
* `POST /api/saved` - Save a new repository to stash.
* `DELETE /api/saved/:repoId` - Remove a repository from stash.
* `GET /api/saved/check/:owner/:repoName` - Validate if a specific repository is already saved.

### 📂 Collections (`/api/collections`)
* `GET /api/collections` - List all collections created by the user.
* `POST /api/collections` - Create a new empty collection.
* `PUT /api/collections/:id` - Update collection name/details.
* `DELETE /api/collections/:id` - Delete a collection.
* `POST /api/collections/:id/repos` - Add a saved repository to a collection.
* `DELETE /api/collections/:id/repos/:repoId` - Remove a repository from a collection.

---

## 📸 Screenshots

> Screenshots can be captured and added to the directories below during local verification.

<!--
![Home Dashboard](github-repos-site/public/screenshots/home.png)
![Explore Grid](github-repos-site/public/screenshots/explore.png)
![Deep Dive Detail Page](github-repos-site/public/screenshots/details.png)
![Saved & Collections Board](github-repos-site/public/screenshots/collections.png)
![Profile & Danger Zone Settings](github-repos-site/public/screenshots/profile.png)
-->

---

## 👤 Author

**Kaustav Kumar**
* Deployed Project: [https://goat-repo-finder.vercel.app](https://goat-repo-finder.vercel.app)
* Repository Code: [https://github.com/Zapperer04/Goat-Repo-Finder](https://github.com/Zapperer04/Goat-Repo-Finder)
* Feel free to submit an issue or pull request to contribute!
