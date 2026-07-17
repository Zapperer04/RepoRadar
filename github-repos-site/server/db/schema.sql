-- Goat Repo Finder Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Favorites table (legacy)
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_id VARCHAR(255) NOT NULL,
  repo_name VARCHAR(255) NOT NULL,
  repo_url VARCHAR(500),
  repo_owner VARCHAR(255),
  repo_description TEXT,
  repo_stars INTEGER,
  repo_language VARCHAR(100),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, repo_id)
);

-- Saved Repositories table (Canonical)
CREATE TABLE IF NOT EXISTS saved_repositories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(100),
  language VARCHAR(100),
  stars INTEGER,
  forks INTEGER,
  github_url VARCHAR(500),
  hidden_gem_score INTEGER,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, full_name)
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query VARCHAR(500) NOT NULL,
  results_count INTEGER,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection items (legacy)
CREATE TABLE IF NOT EXISTS collection_items (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  repo_id VARCHAR(255) NOT NULL,
  repo_name VARCHAR(255) NOT NULL,
  repo_url VARCHAR(500),
  repo_owner VARCHAR(255),
  repo_description TEXT,
  repo_stars INTEGER,
  repo_language VARCHAR(100),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, repo_id)
);

-- Collection Repositories table (Canonical mapping)
CREATE TABLE IF NOT EXISTS collection_repositories (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  saved_repo_id INTEGER NOT NULL REFERENCES saved_repositories(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, saved_repo_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_repos_user_id ON saved_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_repos_collection_id ON collection_repositories(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
