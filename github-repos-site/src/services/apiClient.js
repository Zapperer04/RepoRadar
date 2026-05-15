/**
 * API Client Utility
 * Centralized API communication with built-in error handling and timeouts
 */

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const DEFAULT_TIMEOUT = 15000;

function createAbortController(timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

async function apiCall(endpoint, options = {}) {
  const targetUrl = `${API_URL}${endpoint}`;
  window.DEBUG_API_CALLS = (window.DEBUG_API_CALLS || 0) + 1;
  console.log(`[API_CALL_${window.DEBUG_API_CALLS}] Making request to: ${targetUrl}`);
  const { controller, timeoutId } = createAbortController(options.timeout || DEFAULT_TIMEOUT);
  
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
      throw new Error(`Connection Timeout: The backend at ${API_URL} is too slow to respond.`);
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error(`CRITICAL: Cannot reach the backend at ${API_URL}. Ensure server is active.`);
    }
    throw error;
  }
}

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

export async function searchRepositories(query, page = 1, perPage = 30, sort = 'stars', order = 'desc') {
  if (!query) throw new Error('Search query is required');
  let cleanQuery = query;
  if (cleanQuery.startsWith('q=')) cleanQuery = cleanQuery.substring(2);
  cleanQuery = cleanQuery.split('&').filter(part => !part.startsWith('sort=') && !part.startsWith('order=')).join('&');
  const queryString = `q=${cleanQuery}&page=${page}&per_page=${perPage}&sort=${sort}&order=${order}`;
  return apiCall(`/api/search?${queryString}`);
}

export async function fetchReadme(owner, repo) {
  if (!owner || !repo) throw new Error('Owner and repo name are required');
  const fetchWithTimeout = (url, opts = {}, ms = 10000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
  };

  const directGitHub = async () => {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { 'Accept': 'application/vnd.github.v3+json' } }, 10000);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    return { content: data.content, encoding: data.encoding };
  };

  const backendProxy = async () => {
    const data = await apiCall(`/api/readme/${owner}/${repo}`, { timeout: 10000 });
    if (!data || !data.content) throw new Error('Empty response from backend');
    return data;
  };

  const rawGitHub = async () => {
    for (const branch of ['main', 'master']) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
        const res = await fetchWithTimeout(rawUrl, {}, 8000);
        if (res.ok) {
          const text = await res.text();
          const encoded = btoa(unescape(encodeURIComponent(text)));
          return { content: encoded, encoding: 'base64' };
        }
      } catch (e) {}
    }
    throw new Error('Raw GitHub content not found');
  };

  try {
    return await Promise.any([directGitHub(), backendProxy(), rawGitHub()]);
  } catch (e) {
    throw new Error(`Could not retrieve README for ${owner}/${repo}. All sources failed.`);
  }
}

export async function getAIExplanation(content) {
  if (!content) throw new Error('Content is required');
  return apiCall('/api/explain', { method: 'POST', body: JSON.stringify({ content }) });
}

export const user = {
  getSaved: () => apiCall('/api/saved'),
  saveRepo: (repoData) => apiCall('/api/saved', { method: 'POST', body: JSON.stringify(repoData) }),
  unsaveRepo: (id) => apiCall(`/api/saved/${id}`, { method: 'DELETE' }),
  checkSaved: (owner, repoName) => apiCall(`/api/saved/check/${owner}/${repoName}`),
  
  getHistory: () => apiCall('/api/history'),
  clearHistory: () => apiCall('/api/history', { method: 'DELETE' }),
  
  getCollections: () => apiCall('/api/collections'),
  getCollection: (id) => apiCall(`/api/collections/${id}`),
  createCollection: (name, description) => apiCall('/api/collections', { method: 'POST', body: JSON.stringify({ name, description }) }),
  updateCollection: (id, data) => apiCall(`/api/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCollection: (id) => apiCall(`/api/collections/${id}`, { method: 'DELETE' }),
  addRepoToCollection: (collectionId, repo) => apiCall(`/api/collections/${collectionId}/repos`, { method: 'POST', body: JSON.stringify({ repo }) }),
  removeRepoFromCollection: (collectionId, savedRepoId) => apiCall(`/api/collections/${collectionId}/repos/${savedRepoId}`, { method: 'DELETE' }),
  
  getProfile: () => apiCall('/api/user/profile'),
  getStats: () => apiCall('/api/user/stats'),
  updateProfile: (profileData) => apiCall('/api/user/profile', { method: 'PUT', body: JSON.stringify(profileData) })
};

export async function getHiddenGems(language = '') {
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
  const dateStr = fortyEightHoursAgo.toISOString().split('T')[0];
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
  const query = `created:>${dateStr}${langQuery}`;
  return searchRepositories(query, 1, 30, 'stars', 'desc');
}

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
  get: (endpoint, options) => apiCall(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiCall(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => apiCall(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => apiCall(endpoint, { ...options, method: 'DELETE' }),
  API_URL
};

export default apiClient;
