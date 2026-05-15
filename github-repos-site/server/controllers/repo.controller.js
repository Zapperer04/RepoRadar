const githubService = require('../services/github.service');
const fallbackRepos = require('../data/fallbackRepos');

function buildResponse(data, isFallback = false, errorMessage = null) {
  return {
    success: true,
    source: isFallback ? 'fallback' : 'github',
    count: Array.isArray(data) ? data.length : undefined,
    errorMessage: isFallback ? (errorMessage || 'GitHub API unavailable, using local fallback data') : null,
    data
  };
}

exports.getHealth = (req, res) => {
  res.json({
    success: true,
    service: "RepoRadar API",
    status: "ok",
    timestamp: new Date().toISOString(),
    githubTokenConfigured: !!process.env.GITHUB_TOKEN
  });
};

// Ensure the fallback behaves like the real mock so UI keeps working.
function filterFallback(filterFn) {
  return fallbackRepos.filter(filterFn);
}

exports.getRepos = async (req, res) => {
  try {
    const repos = await githubService.searchRepositories({ query: 'stars:>500', sort: 'stars', order: 'desc' });
    if (repos) return res.json(buildResponse(repos));
    
    console.error('[BACKEND] getRepos: GitHub service returned null, using fallback.');
    return res.json(buildResponse(fallbackRepos, true, 'GitHub service returned null'));
  } catch (error) {
    console.error('[BACKEND] getRepos error:', error.message);
    return res.json(buildResponse(fallbackRepos, true, error.message));
  }
};

exports.searchRepos = async (req, res) => {
  try {
    const { q, domain, language, stars, activity, type, sort } = req.query;
    
    let query = q || 'stars:>100';
    if (language) query += ` language:${language}`;
    if (stars === '1') query += ' stars:<1000';
    else if (stars === '2') query += ' stars:1000..5000';
    else if (stars === '3') query += ' stars:>5000';
    
    const repos = await githubService.searchRepositories({ query, sort: sort === 'stars' ? 'stars' : 'updated' });
    if (repos) return res.json(buildResponse(repos));
    
    console.error(`[BACKEND] searchRepos: GitHub search failed for query "${query}", using fallback.`);
    let fallbacks = fallbackRepos;
    if (q) fallbacks = fallbacks.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
    return res.json(buildResponse(fallbacks, true, 'GitHub search failed'));
  } catch (error) {
    console.error('[BACKEND] searchRepos error:', error.message);
    return res.json(buildResponse(fallbackRepos, true, error.message));
  }
};

exports.getHiddenGems = async (req, res) => {
  try {
    const repos = await githubService.getHiddenGemRepositories();
    if (repos) return res.json(buildResponse(repos));
    
    console.error('[BACKEND] getHiddenGems: GitHub service returned null, using fallback.');
    return res.json(buildResponse(filterFallback(r => r.isHiddenGem), true, 'GitHub service returned null'));
  } catch (error) {
    console.error('[BACKEND] getHiddenGems error:', error.message);
    return res.json(buildResponse(filterFallback(r => r.isHiddenGem), true, error.message));
  }
};

exports.getTrending = async (req, res) => {
  try {
    const repos = await githubService.getTrendingRepositories();
    if (repos) return res.json(buildResponse(repos));
    
    console.error('[BACKEND] getTrending: GitHub service returned null, using fallback.');
    return res.json(buildResponse(filterFallback(r => r.isTrending), true, 'GitHub service returned null'));
  } catch (error) {
    console.error('[BACKEND] getTrending error:', error.message);
    return res.json(buildResponse(filterFallback(r => r.isTrending), true, error.message));
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
    
    console.error(`[BACKEND] getReposByDomain: GitHub query failed for domain "${domain}", using fallback.`);
    return res.json(buildResponse(filterFallback(r => r.domain === domain), true, 'GitHub query failed'));
  } catch (error) {
    console.error('[BACKEND] getReposByDomain error:', error.message);
    return res.json(buildResponse(filterFallback(r => r.domain === req.params.domain), true, error.message));
  }
};

exports.getRepoDetails = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const repo = await githubService.getRepositoryDetails(owner, repoName);
    
    if (repo) return res.json(buildResponse(repo));
    
    console.error(`[BACKEND] getRepoDetails: GitHub fetch failed for ${owner}/${repoName}, attempting fallback.`);
    const fallback = fallbackRepos.find(r => r.owner === owner && r.name === repoName);
    if (fallback) return res.json(buildResponse(fallback, true, 'GitHub fetch failed'));
    
    return res.status(404).json({ success: false, error: 'Repository not found' });
  } catch (error) {
    console.error('[BACKEND] getRepoDetails error:', error.message);
    const fallback = fallbackRepos.find(r => r.owner === req.params.owner && r.name === req.params.repoName);
    if (fallback) return res.json(buildResponse(fallback, true, error.message));
    return res.status(404).json({ success: false, error: 'Repository not found' });
  }
};

exports.getSimilarRepos = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const repos = await githubService.getSimilarRepositories(owner, repoName);
    if (repos) return res.json(buildResponse(repos));
    
    console.error(`[BACKEND] getSimilarRepos: GitHub service returned null for ${owner}/${repoName}, using fallback.`);
    const fallbackTarget = fallbackRepos.find(r => r.owner === owner && r.name === repoName);
    let fallbacks = [];
    if (fallbackTarget) {
      fallbacks = fallbackRepos.filter(r => r.id !== fallbackTarget.id && (r.domain === fallbackTarget.domain || r.language === fallbackTarget.language));
    }
    return res.json(buildResponse(fallbacks, true, 'GitHub service returned null'));
  } catch (error) {
    console.error('[BACKEND] getSimilarRepos error:', error.message);
    return res.json(buildResponse([], true, error.message));
  }
};
