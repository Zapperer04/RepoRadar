/**
 * Deterministic scoring service for Repositories
 * Uses simple heuristics based on GitHub data.
 */

function calculateHiddenGemScore(repo) {
  let score = 50;
  
  if (repo.stars < 1000) score += 20;
  else if (repo.stars < 5000) score += 10;
  else score -= 20; // Penalize high star counts as they aren't hidden

  if (repo.description && repo.description.length > 20) score += 10;
  if (repo.topics && repo.topics.length >= 3) score += 10;
  
  const daysSinceUpdate = (new Date() - new Date(repo.lastUpdated)) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 10;
  else if (daysSinceUpdate > 365) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function calculateGrowthScore(repo) {
  let score = 40;
  
  const daysSinceUpdate = (new Date() - new Date(repo.lastUpdated)) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) score += 30;
  else if (daysSinceUpdate < 30) score += 15;

  if (repo.forks > repo.stars * 0.1) score += 15; // High fork ratio = activity
  if (repo.openIssues > 0 && repo.openIssues < 50) score += 15; // Active issues

  return Math.max(0, Math.min(100, score));
}

function calculateDocumentationScore(repo) {
  let score = 40;
  
  if (repo.description && repo.description.length > 50) score += 20;
  if (repo.topics && repo.topics.length >= 4) score += 20;
  if (repo.license && repo.license !== 'None') score += 20;

  return Math.max(0, Math.min(100, score));
}

function calculateBeginnerScore(repo) {
  let score = 40;
  
  const topics = repo.topics ? repo.topics.map(t => t.toLowerCase()) : [];
  if (topics.includes('good-first-issue') || topics.includes('beginner-friendly') || topics.includes('education')) {
    score += 40;
  }
  
  if (repo.license && repo.license !== 'None') score += 10;
  if (repo.openIssues > 0 && repo.openIssues < 100) score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculateMaintenanceScore(repo) {
  let score = 50;
  
  const daysSinceUpdate = (new Date() - new Date(repo.lastUpdated)) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 30;
  else if (daysSinceUpdate > 180) score -= 30;
  else if (daysSinceUpdate > 365) score -= 50;

  if (repo.openIssues > 500) score -= 20; // Issue bankruptcy

  return Math.max(0, Math.min(100, score));
}

function classifyActivityLevel(repo) {
  const daysSinceUpdate = (new Date() - new Date(repo.lastUpdated)) / (1000 * 60 * 60 * 24);
  
  if (daysSinceUpdate < 7) return "Very High";
  if (daysSinceUpdate < 30) return "High";
  if (daysSinceUpdate < 90) return "Medium";
  return "Low";
}

function classifyRepoType(repo) {
  const topics = repo.topics ? repo.topics.join(' ').toLowerCase() : '';
  const desc = repo.description ? repo.description.toLowerCase() : '';
  
  if (topics.includes('framework') || desc.includes('framework')) return 'Framework';
  if (topics.includes('library') || desc.includes('library')) return 'Library';
  if (topics.includes('template') || desc.includes('boilerplate') || desc.includes('starter')) return 'Template';
  if (topics.includes('tool') || topics.includes('cli') || desc.includes('cli tool')) return 'Tool';
  
  return 'Library'; // Default
}

function classifyDomain(repo) {
  const text = ((repo.topics ? repo.topics.join(' ') : '') + ' ' + (repo.description || '')).toLowerCase();
  
  if (text.includes('machine learning') || text.includes('ai ') || text.includes('llm') || text.includes('gpt')) return 'AI & Machine Learning';
  if (text.includes('react') || text.includes('vue') || text.includes('frontend') || text.includes('ui') || text.includes('css')) return 'Frontend';
  if (text.includes('backend') || text.includes('api') || text.includes('express') || text.includes('server')) return 'Backend';
  if (text.includes('docker') || text.includes('kubernetes') || text.includes('devops') || text.includes('ci/cd')) return 'DevOps';
  if (text.includes('security') || text.includes('crypto') || text.includes('audit')) return 'Cybersecurity';
  if (text.includes('data') || text.includes('analytics') || text.includes('d3')) return 'Data Science';
  if (text.includes('ios') || text.includes('android') || text.includes('mobile') || text.includes('react-native')) return 'Mobile';
  if (text.includes('database') || text.includes('sql') || text.includes('postgres') || text.includes('mongo')) return 'Databases';
  if (text.includes('cli') || text.includes('linter') || text.includes('tooling')) return 'Developer Tools';
  
  return 'Backend'; // Fallback default
}

module.exports = {
  calculateHiddenGemScore,
  calculateGrowthScore,
  calculateDocumentationScore,
  calculateBeginnerScore,
  calculateMaintenanceScore,
  classifyActivityLevel,
  classifyRepoType,
  classifyDomain
};
