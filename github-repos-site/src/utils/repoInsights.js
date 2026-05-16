/**
 * Repository Insight Generator
 * Deterministic, rule-based copy generation based on repository metadata.
 * No AI used.
 */

const formatCompactNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

export const getWhyRepoMatters = (repo) => {
  if (!repo) return '';

  const {
    name,
    domain,
    language,
    stars,
    isHiddenGem,
    isTrending,
    isBeginnerFriendly,
    growthScore,
    hiddenGemScore,
    topics,
    description
  } = repo;

  let insight = `${name} matters in the ${domain} space because `;

  // Star-based adoption signals
  if (stars > 100000) {
    insight += `it has achieved large-scale adoption with over ${formatCompactNumber(stars)} stars, signaling industry-standard status. `;
  } else if (stars > 10000) {
    insight += `it has seen strong adoption in the developer community, backed by ${formatCompactNumber(stars)} stars. `;
  } else if (stars < 1000 && hiddenGemScore > 70) {
    insight += `it is an underrated project with a high Gem Score, offering high-quality utility despite lower visibility. `;
  } else {
    insight += `it provides focused utility in its domain. `;
  }

  // Language and Stack
  if (language && language !== 'Unknown') {
    insight += `Built primarily with ${language}, `;
  }

  // Topic-based context
  const hasTopic = (term) => topics.some(t => t.toLowerCase().includes(term));
  const descHas = (term) => description.toLowerCase().includes(term);

  if (hasTopic('ai') || hasTopic('machine-learning') || hasTopic('llm') || descHas('ai ') || descHas('artificial intelligence')) {
    insight += `it addresses key challenges in AI infrastructure and model serving. `;
  } else if (hasTopic('react') || hasTopic('frontend') || hasTopic('web') || hasTopic('nextjs')) {
    insight += `it is highly relevant for developers working within the modern web and frontend ecosystem. `;
  } else if (hasTopic('database') || hasTopic('sql') || hasTopic('nosql') || hasTopic('storage')) {
    insight += `it plays a critical role in data management and storage systems. `;
  } else if (hasTopic('security') || hasTopic('auth') || hasTopic('encryption')) {
    insight += `it focuses on security-critical tooling and robust implementation patterns. `;
  } else if (hasTopic('cli') || hasTopic('tool') || descHas('command line')) {
    insight += `it serves as a powerful CLI tool for streamlining developer workflows. `;
  }

  // Momentum / Growth
  if (isTrending || growthScore > 75) {
    insight += `With a strong growth signal, ${name} is currently gaining significant momentum. `;
  } else if (isHiddenGem) {
    insight += `As a verified Hidden Gem, it is a project worth watching before it hits the mainstream. `;
  }

  // Contribution
  if (isBeginnerFriendly) {
    insight += `Its approachable codebase makes it an excellent choice for developers looking to contribute to open source. `;
  }

  return insight.trim();
};

export const getActivityInsight = (repo) => {
  if (!repo) return '';
  const { activityLevel, growthScore, lastUpdated, openIssues } = repo;

  let text = `The repository exhibits a **${activityLevel}** activity profile. `;

  if (growthScore > 80) {
    text += `It is currently experiencing high velocity, with rapid changes and community engagement. `;
  }

  if (lastUpdated) {
    const days = Math.floor((new Date() - new Date(lastUpdated)) / (1000 * 60 * 60 * 24));
    if (days < 7) text += `The codebase was updated within the last week, indicating active maintenance. `;
    else if (days < 30) text += `The most recent update was within the last month. `;
  }

  if (openIssues > 100) {
    text += `A high number of open issues (${openIssues}) suggests a large user base or a need for more contributors. `;
  }

  return text;
};

export const getContributionInsight = (repo) => {
  if (!repo) return '';
  const { beginnerScore, maintenanceScore, isBeginnerFriendly } = repo;

  let text = `With a maintenance score of **${maintenanceScore}/100**, the project appears to be `;
  
  if (maintenanceScore > 80) text += `well-sustained and reliable. `;
  else if (maintenanceScore > 50) text += `moderately maintained. `;
  else text += `in a transitional or experimental phase. `;

  if (isBeginnerFriendly || beginnerScore > 75) {
    text += `The project has strong beginner-friendly signals, making it approachable for those new to the stack. `;
  } else {
    text += `Due to the technical complexity, it likely requires advanced domain knowledge to contribute effectively. `;
  }

  return text;
};

export const getRepoStrengths = (repo) => {
  if (!repo) return [];
  const strengths = [];

  if (repo.stars > 50000) strengths.push('Large-scale Adoption');
  else if (repo.stars > 5000) strengths.push('Strong Community');

  if (repo.growthScore > 75) strengths.push('High Growth Signal');
  if (repo.maintenanceScore > 75) strengths.push('Active Maintenance');
  if (repo.documentationScore > 75) strengths.push('Excellent Documentation');
  if (repo.beginnerScore > 75) strengths.push('Beginner Friendly');
  if (repo.isHiddenGem) strengths.push('Hidden Gem Verified');
  if (repo.isTrending) strengths.push('Currently Trending');

  return strengths;
};
