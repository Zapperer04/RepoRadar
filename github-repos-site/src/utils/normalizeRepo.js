/**
 * Repository Data Normalizer
 * Standardizes repository objects from different sources (GitHub API, Backend DB, Mock Data)
 * into a single canonical frontend shape.
 */

export const normalizeRepo = (repo) => {
  if (!repo) return null;

  // Handle potential nested data structure from some API responses
  const r = repo.data || repo;

  // Identify owner and name
  const fullName = r.full_name || r.fullName || '';
  let owner = r.owner || '';
  let name = r.name || r.repo_name || '';

  if (typeof owner === 'object' && owner !== null) {
    owner = owner.login || '';
  }

  if (!owner && fullName.includes('/')) {
    owner = fullName.split('/')[0];
  }
  if (!name && fullName.includes('/')) {
    name = fullName.split('/')[1];
  }

  // Canonical name
  const canonicalFullName = fullName || (owner && name ? `${owner}/${name}` : 'Unknown/Repo');

  // Defensive numbers
  const safeNumber = (val) => {
    const num = Number(val);
    return isFinite(num) ? num : 0;
  };

  return {
    id: r.id || r.repo_id || canonicalFullName,
    name: name || 'Unknown Repo',
    owner: owner || 'Unknown',
    fullName: canonicalFullName,
    description: r.description || r.repo_description || 'No description available.',
    domain: r.domain || 'Developer Tools',
    language: r.language || r.repo_language || 'Unknown',
    stars: safeNumber(r.stars || r.repo_stars || r.star_count || 0),
    forks: safeNumber(r.forks || 0),
    watchers: safeNumber(r.watchers || 0),
    openIssues: safeNumber(r.openIssues || r.open_issues || 0),
    lastUpdated: r.lastUpdated || r.last_updated || r.updated_at || r.saved_at || null,
    license: r.license || 'Unknown',
    topics: Array.isArray(r.topics) ? r.topics : [],
    repoType: r.repoType || r.repo_type || 'Library',
    activityLevel: r.activityLevel || r.activity_level || 'Active',
    
    // Scores
    hiddenGemScore: safeNumber(r.hiddenGemScore || r.hidden_gem_score || 0),
    growthScore: safeNumber(r.growthScore || r.growth_score || 0),
    documentationScore: safeNumber(r.documentationScore || r.documentation_score || 0),
    beginnerScore: safeNumber(r.beginnerScore || r.beginner_score || 0),
    maintenanceScore: safeNumber(r.maintenanceScore || r.maintenance_score || 0),
    
    // Flags
    isHiddenGem: Boolean(r.isHiddenGem || r.is_hidden_gem),
    isTrending: Boolean(r.isTrending || r.is_trending),
    isBeginnerFriendly: Boolean(r.isBeginnerFriendly || r.is_beginner_friendly),
    isSaved: Boolean(r.isSaved || r.is_saved),
    
    // Links
    githubUrl: r.githubUrl || r.github_url || r.repo_url || (owner && name ? `https://github.com/${owner}/${name}` : null)
  };
};

/**
 * Validates if a string is a legitimate GitHub repository URL
 */
export const isValidGithubUrl = (url) => {
  if (typeof url !== 'string') return false;
  // Match https://github.com/owner/repo or http versions
  return /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/.test(url);
};
