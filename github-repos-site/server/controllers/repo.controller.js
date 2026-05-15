const githubService = require('../services/github.service');
const fallbackRepos = require('../data/fallbackRepos');

function buildResponse(data, isFallback = false) {
  return {
    success: true,
    source: isFallback ? 'fallback' : 'github',
    count: Array.isArray(data) ? data.length : undefined,
    data
  };
}

// Ensure the fallback behaves like the real mock so UI keeps working.
function filterFallback(filterFn) {
  return fallbackRepos.filter(filterFn);
}

exports.getRepos = async (req, res) => {
  try {
    const repos = await githubService.searchRepositories({ query: 'stars:>500', sort: 'stars', order: 'desc' });
    if (repos) return res.json(buildResponse(repos));
    
    return res.json(buildResponse(fallbackRepos, true));
  } catch (error) {
    console.error('getRepos error:', error);
    return res.json(buildResponse(fallbackRepos, true));
  }
};

exports.searchRepos = async (req, res) => {
  try {
    const { q, domain, language, stars, activity, type, sort } = req.query;
    
    let query = q || 'stars:>100';
    if (language) query += ` language:${language}`;
    // Simple mapping for stars since GitHub API needs specific formats
    if (stars === '1') query += ' stars:<1000';
    else if (stars === '2') query += ' stars:1000..5000';
    else if (stars === '3') query += ' stars:>5000';
    
    const repos = await githubService.searchRepositories({ query, sort: sort === 'stars' ? 'stars' : 'updated' });
    if (repos) return res.json(buildResponse(repos));
    
    // Fallback logic
    let fallbacks = fallbackRepos;
    if (q) fallbacks = fallbacks.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
    return res.json(buildResponse(fallbacks, true));
  } catch (error) {
    console.error('searchRepos error:', error);
    return res.json(buildResponse(fallbackRepos, true));
  }
};

exports.getHiddenGems = async (req, res) => {
  try {
    const repos = await githubService.getHiddenGemRepositories();
    if (repos) return res.json(buildResponse(repos));
    
    return res.json(buildResponse(filterFallback(r => r.isHiddenGem), true));
  } catch (error) {
    return res.json(buildResponse(filterFallback(r => r.isHiddenGem), true));
  }
};

exports.getTrending = async (req, res) => {
  try {
    const repos = await githubService.getTrendingRepositories();
    if (repos) return res.json(buildResponse(repos));
    
    return res.json(buildResponse(filterFallback(r => r.isTrending), true));
  } catch (error) {
    return res.json(buildResponse(filterFallback(r => r.isTrending), true));
  }
};

exports.getDomains = async (req, res) => {
  try {
    // For now we don't have dynamic domain counts, we just let the frontend use constants.
    // If we wanted to, we could return a predefined list.
    return res.json(buildResponse([])); 
  } catch (error) {
    return res.json(buildResponse([], true));
  }
};

exports.getReposByDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    const repos = await githubService.getRepositoriesByDomain(domain);
    if (repos) return res.json(buildResponse(repos));
    
    return res.json(buildResponse(filterFallback(r => r.domain === domain), true));
  } catch (error) {
    return res.json(buildResponse(filterFallback(r => r.domain === req.params.domain), true));
  }
};

exports.getRepoDetails = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const repo = await githubService.getRepositoryDetails(owner, repoName);
    
    if (repo) return res.json(buildResponse(repo));
    
    const fallback = fallbackRepos.find(r => r.owner === owner && r.name === repoName);
    if (fallback) return res.json(buildResponse(fallback, true));
    
    return res.status(404).json({ success: false, error: 'Repository not found' });
  } catch (error) {
    const fallback = fallbackRepos.find(r => r.owner === req.params.owner && r.name === req.params.repoName);
    if (fallback) return res.json(buildResponse(fallback, true));
    return res.status(404).json({ success: false, error: 'Repository not found' });
  }
};

exports.getSimilarRepos = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const repos = await githubService.getSimilarRepositories(owner, repoName);
    if (repos) return res.json(buildResponse(repos));
    
    // Simplistic fallback for similar
    const fallbackTarget = fallbackRepos.find(r => r.owner === owner && r.name === repoName);
    let fallbacks = [];
    if (fallbackTarget) {
      fallbacks = fallbackRepos.filter(r => r.id !== fallbackTarget.id && (r.domain === fallbackTarget.domain || r.language === fallbackTarget.language));
    }
    return res.json(buildResponse(fallbacks, true));
  } catch (error) {
    return res.json(buildResponse([], true));
  }
};
