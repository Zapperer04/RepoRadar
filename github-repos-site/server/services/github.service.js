const axios = require('axios');
const { normalizeGitHubRepo } = require('../contracts/repo.contract');

const GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';

const getHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoRadar-Backend'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

const makeRequest = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
      params,
      timeout: 5000 // 5 seconds timeout
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`GitHub API Error (${url}):`, error.message);
    return { data: null, error: error.message };
  }
};

async function searchRepositories({ query = 'stars:>1', sort = 'stars', order = 'desc', page = 1, perPage = 20 }) {
  const url = `${GITHUB_API_BASE_URL}/search/repositories`;
  const { data, error } = await makeRequest(url, { q: query, sort, order, per_page: perPage, page });
  
  if (error || !data || !data.items) return null;
  return data.items.map(normalizeGitHubRepo);
}

async function getTrendingRepositories({ language, page = 1, perPage = 20 } = {}) {
  // Mocking trending using search sorted by recent updates and stars
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const dateString = date.toISOString().split('T')[0];
  
  let query = `created:>${dateString}`;
  if (language) query += ` language:${language}`;
  
  return searchRepositories({ query, sort: 'stars', order: 'desc', page, perPage });
}

async function getHiddenGemRepositories({ page = 1, perPage = 20 } = {}) {
  // Repos updated recently, under 1000 stars, with good-first-issue etc.
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const dateString = date.toISOString().split('T')[0];
  
  let query = `stars:100..1000 pushed:>${dateString} size:>100`;
  
  return searchRepositories({ query, sort: 'updated', order: 'desc', page, perPage });
}

async function getRepositoryDetails(owner, repoName) {
  const url = `${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}`;
  const { data, error } = await makeRequest(url);
  
  if (error || !data) return null;
  return normalizeGitHubRepo(data);
}

async function getSimilarRepositories(owner, repoName) {
  // Simplistic approach: get repo details, find its main language/topics, and search
  const repo = await getRepositoryDetails(owner, repoName);
  if (!repo) return null;
  
  let query = '';
  if (repo.language && repo.language !== 'Unknown') {
    query += `language:${repo.language} `;
  }
  if (repo.topics && repo.topics.length > 0) {
    query += `topic:${repo.topics[0]} `;
  }
  
  if (!query) query = 'stars:>100'; // fallback
  
  const results = await searchRepositories({ query, sort: 'stars', order: 'desc', perPage: 5 });
  if (!results) return null;
  
  return results.filter(r => r.fullName !== `${owner}/${repoName}`);
}

async function getRepositoriesByDomain(domain, { page = 1, perPage = 20 } = {}) {
  // Simplistic domain mapping
  const domainMap = {
    'AI & Machine Learning': 'topic:ai OR topic:machine-learning',
    'Frontend': 'topic:frontend OR topic:react OR topic:vue',
    'Backend': 'topic:backend OR topic:api',
    'DevOps': 'topic:devops OR topic:docker OR topic:kubernetes',
    'Cybersecurity': 'topic:security OR topic:crypto',
    'Data Science': 'topic:data-science OR topic:data-analysis',
    'Mobile': 'topic:ios OR topic:android OR topic:react-native',
    'Developer Tools': 'topic:cli OR topic:tooling',
    'Databases': 'topic:database OR topic:sql OR topic:nosql',
    'UI Libraries': 'topic:ui-library OR topic:design-system'
  };
  
  const queryPart = domainMap[domain] || 'stars:>100';
  return searchRepositories({ query: `${queryPart} stars:>50`, sort: 'stars', order: 'desc', page, perPage });
}

async function getDomainSummary() {
  // Not heavily relying on GitHub for count summaries as it's expensive without specific DB aggregations.
  // We'll return null to let the controller fall back to mock data or return a minimal placeholder.
  return null; 
}

module.exports = {
  searchRepositories,
  getTrendingRepositories,
  getHiddenGemRepositories,
  getRepositoryDetails,
  getSimilarRepositories,
  getRepositoriesByDomain,
  getDomainSummary
};
