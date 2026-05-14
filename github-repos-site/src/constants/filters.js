export const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C++", "Ruby", "Shell"
];

export const STAR_RANGES = [
  { label: "Any Stars", min: 0, max: Infinity },
  { label: "Under 1k (Hidden Gems)", min: 0, max: 1000 },
  { label: "1k - 5k", min: 1000, max: 5000 },
  { label: "5k+", min: 5000, max: Infinity }
];

export const ACTIVITY_LEVELS = ["Very High", "High", "Medium", "Low"];

export const REPO_TYPES = ["Library", "Framework", "Tool", "Template"];

export const SORT_OPTIONS = [
  { value: "hiddenGemScore", label: "Hidden Gem Score" },
  { value: "growthScore", label: "Growth Score" },
  { value: "stars", label: "Stars" },
  { value: "lastUpdated", label: "Recently Updated" },
  { value: "beginnerScore", label: "Beginner Friendly" }
];
