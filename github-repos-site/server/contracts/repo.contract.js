/**
 * Normalized RepoRadar Repository Contract
 */

const { 
  calculateHiddenGemScore, 
  calculateGrowthScore, 
  calculateDocumentationScore, 
  calculateBeginnerScore, 
  calculateMaintenanceScore,
  classifyActivityLevel,
  classifyRepoType,
  classifyDomain
} = require('../services/repoScoring.service');

function normalizeGitHubRepo(repoData) {
  if (!repoData) return null;

  // Ensure robust fallback mapping
  const repo = {
    id: repoData.id?.toString() || `${Date.now()}-${Math.random()}`,
    name: repoData.name || 'unknown-repo',
    owner: repoData.owner?.login || 'unknown-owner',
    fullName: repoData.full_name || `${repoData.owner?.login || 'unknown-owner'}/${repoData.name || 'unknown-repo'}`,
    description: repoData.description || 'No description provided.',
    language: repoData.language || 'Unknown',
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    watchers: repoData.subscribers_count || repoData.watchers_count || 0,
    openIssues: repoData.open_issues_count || 0,
    lastUpdated: repoData.updated_at || repoData.pushed_at || new Date().toISOString(),
    license: repoData.license?.spdx_id || 'None',
    topics: repoData.topics || [],
    githubUrl: repoData.html_url || `https://github.com/${repoData.full_name}`
  };

  // Determine custom classifications
  repo.domain = classifyDomain(repo);
  repo.repoType = classifyRepoType(repo);
  repo.activityLevel = classifyActivityLevel(repo);

  // Calculate deterministic scores
  repo.hiddenGemScore = calculateHiddenGemScore(repo);
  repo.growthScore = calculateGrowthScore(repo);
  repo.documentationScore = calculateDocumentationScore(repo);
  repo.beginnerScore = calculateBeginnerScore(repo);
  repo.maintenanceScore = calculateMaintenanceScore(repo);

  // Apply booleans
  repo.isHiddenGem = repo.stars < 1000 && repo.hiddenGemScore > 75;
  repo.isTrending = repo.growthScore > 80;
  repo.isBeginnerFriendly = repo.beginnerScore > 80;
  repo.isSaved = false; // Usually handled separately by DB logic

  return repo;
}

module.exports = { normalizeGitHubRepo };
