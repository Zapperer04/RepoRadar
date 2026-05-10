/**
 * API Client Utility
 * Centralized API communication with built-in error handling and timeouts
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DEFAULT_TIMEOUT = 15000; // 15 seconds

/**
 * Create abort controller with timeout
 */
function createAbortController(timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

/**
 * Generic fetch wrapper with error handling and timeout
 */
async function apiCall(endpoint, options = {}) {
  const { controller, timeoutId } = createAbortController(options.timeout || DEFAULT_TIMEOUT);
  
  // Add authentication header if token exists
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // 204 No Content handling
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to server at ${API_URL}. Is the backend running?`);
    }
    
    throw error;
  }
}

/**
 * Authentication APIs
 */
export const auth = {
  login: (email, password) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  signup: (userData) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  verify: () => apiCall('/api/auth/verify', { method: 'POST' }),
  
  me: () => apiCall('/api/auth/me'),
  
  logout: () => apiCall('/api/auth/logout', { method: 'POST' })
};

/**
 * Repository Search & Data
 */
export async function searchRepositories(query, page = 1, perPage = 30) {
  if (!query) throw new Error('Search query is required');
  const cleanQuery = query.startsWith('q=') ? query : `q=${query}`;
  return apiCall(`/api/search?${cleanQuery}&page=${page}&per_page=${perPage}`);
}

export async function fetchReadme(owner, repo) {
  if (!owner || !repo) throw new Error('Owner and repo name are required');
  return apiCall(`/api/readme/${owner}/${repo}`);
}

/**
 * AI Features
 */
export async function getAIExplanation(content) {
  if (!content) throw new Error('Content is required');
  return apiCall('/api/explain', {
    method: 'POST',
    body: JSON.stringify({ content })
  });
}

/**
 * User Personalization
 */
export const user = {
  getFavorites: () => apiCall('/api/favorites'),
  addFavorite: (repoData) => apiCall('/api/favorites', {
    method: 'POST',
    body: JSON.stringify(repoData)
  }),
  removeFavorite: (id) => apiCall(`/api/favorites/${id}`, { method: 'DELETE' }),
  
  getHistory: () => apiCall('/api/history'),
  clearHistory: () => apiCall('/api/history', { method: 'DELETE' }),
  
  getCollections: () => apiCall('/api/collections'),
  createCollection: (name, description) => apiCall('/api/collections', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  })
};

/**
 * Advanced Discovery Engine
 */
export async function getHiddenGems(language = '') {
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
  const dateStr = fortyEightHoursAgo.toISOString().split('T')[0];
  
  // Logic: Low stars (<1000) + Recent Activity + Not a Fork
  const langQuery = language ? `+language:${language}` : '';
  const query = `stars:<1000+pushed:>${dateStr}+fork:false${langQuery}`;
  return searchRepositories(query, 1, 30);
}

export async function getTrendingByGrowth(timeWindow = 'week', language = '') {
  const now = new Date();
  const pastDate = new Date();
  if (timeWindow === 'week') pastDate.setDate(now.getDate() - 7);
  else if (timeWindow === 'month') pastDate.setDate(now.getDate() - 30);
  else pastDate.setFullYear(now.getFullYear() - 1);
  
  const dateStr = pastDate.toISOString().split('T')[0];
  const langQuery = language ? `+language:${language}` : '';
  // Logic: Created recently + High star count (Velocity indicator)
  const query = `created:>${dateStr}${langQuery}&sort=stars&order=desc`;
  return searchRepositories(query, 1, 30);
}

/**
 * Health check
 */
export async function checkHealth() {
  try {
    return await apiCall('/api/health');
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

const apiClient = {
  auth,
  user,
  searchRepositories,
  fetchReadme,
  getAIExplanation,
  getHiddenGems,
  getTrendingByGrowth,
  checkHealth,
  API_URL
};

export default apiClient;
