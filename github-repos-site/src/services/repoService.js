import api from './apiClient.js';
import { mockRepos } from '../data/mockRepos.js';
import { normalizeRepo } from '../utils/normalizeRepo.js';

// Safe wrapper around API calls with fallback
const fetchWithFallback = async (endpoint, fallbackData) => {
  try {
    const response = await api.get(endpoint);
    // Our backend sends { success, source, data }
    if (response.success) {
      const normalizedData = Array.isArray(response.data) 
        ? response.data.map(normalizeRepo) 
        : normalizeRepo(response.data);
      return { data: normalizedData, source: response.source || 'github' };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn(`API failed for ${endpoint}, using fallback.`, error.message);
    const normalizedFallback = Array.isArray(fallbackData)
      ? fallbackData.map(normalizeRepo)
      : normalizeRepo(fallbackData);
    return { data: normalizedFallback, source: 'fallback' };
  }
};

export const repoService = {
  getRepos: async () => {
    return fetchWithFallback('/api/repos', mockRepos);
  },

  searchRepos: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/repos/search${query ? `?${query}` : ''}`;
    let fallback = mockRepos;
    if (params.q) {
      fallback = fallback.filter(r => r.name.toLowerCase().includes(params.q.toLowerCase()));
    }
    return fetchWithFallback(endpoint, fallback);
  },

  getHiddenGems: async () => {
    return fetchWithFallback('/api/repos/hidden-gems', mockRepos.filter(r => r.isHiddenGem));
  },

  getTrending: async () => {
    return fetchWithFallback('/api/repos/trending', mockRepos.filter(r => r.isTrending));
  },

  getDomains: async () => {
    return fetchWithFallback('/api/repos/domains', []);
  },

  getReposByDomain: async (domain) => {
    return fetchWithFallback(`/api/repos/domain/${encodeURIComponent(domain)}`, mockRepos.filter(r => r.domain === domain));
  },

  getRepoDetails: async (owner, repoName) => {
    const fallback = mockRepos.find(r => r.owner === owner && r.name === repoName) || null;
    return fetchWithFallback(`/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`, fallback);
  },

  getSimilarRepos: async (owner, repoName) => {
    const fallbackTarget = mockRepos.find(r => r.owner === owner && r.name === repoName);
    let fallbacks = [];
    if (fallbackTarget) {
      fallbacks = mockRepos.filter(r => r.id !== fallbackTarget.id && (r.domain === fallbackTarget.domain || r.language === fallbackTarget.language));
    }
    return fetchWithFallback(`/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/similar`, fallbacks);
  }
};
