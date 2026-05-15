import api from './apiClient.js';
import { mockRepos } from '../data/mockRepos.js';

// Safe wrapper around API calls with fallback
const fetchWithFallback = async (endpoint, fallbackData) => {
  try {
    const response = await api.get(endpoint);
    // Our backend sends { success, source, data }
    if (response.data && response.data.success) {
      return { data: response.data.data, source: response.data.source || 'github' };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn(`API failed for ${endpoint}, using fallback.`, error.message);
    return { data: fallbackData, source: 'fallback' };
  }
};

export const repoService = {
  getRepos: async () => {
    return fetchWithFallback('/repos', mockRepos);
  },

  searchRepos: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/repos/search${query ? `?${query}` : ''}`;
    let fallback = mockRepos;
    if (params.q) {
      fallback = fallback.filter(r => r.name.toLowerCase().includes(params.q.toLowerCase()));
    }
    return fetchWithFallback(endpoint, fallback);
  },

  getHiddenGems: async () => {
    return fetchWithFallback('/repos/hidden-gems', mockRepos.filter(r => r.isHiddenGem));
  },

  getTrending: async () => {
    return fetchWithFallback('/repos/trending', mockRepos.filter(r => r.isTrending));
  },

  getDomains: async () => {
    // Domains count usually rely on constants on frontend anyway
    return fetchWithFallback('/repos/domains', []);
  },

  getReposByDomain: async (domain) => {
    return fetchWithFallback(`/repos/domain/${encodeURIComponent(domain)}`, mockRepos.filter(r => r.domain === domain));
  },

  getRepoDetails: async (owner, repoName) => {
    const fallback = mockRepos.find(r => r.owner === owner && r.name === repoName) || null;
    return fetchWithFallback(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`, fallback);
  },

  getSimilarRepos: async (owner, repoName) => {
    const fallbackTarget = mockRepos.find(r => r.owner === owner && r.name === repoName);
    let fallbacks = [];
    if (fallbackTarget) {
      fallbacks = mockRepos.filter(r => r.id !== fallbackTarget.id && (r.domain === fallbackTarget.domain || r.language === fallbackTarget.language));
    }
    return fetchWithFallback(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/similar`, fallbacks);
  }
};
