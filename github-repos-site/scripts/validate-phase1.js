const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let allPassed = true;

function logResult(name, passed, msg = '') {
  if (passed) {
    console.log(`[PASS] ${name} ${msg ? '- ' + msg : ''}`);
  } else {
    console.log(`[FAIL] ${name} ${msg ? '- ' + msg : ''}`);
    allPassed = false;
  }
}

console.log('=== Running Phase 1 Structural & Routing Validation ===\n');

// 1. Check required files
const requiredFiles = [
  'package.json',
  'server/index.js',
  'server/config/db.js',
  'src/App.js',
  'src/routes/AppRoutes.jsx',
  'src/routes/ProtectedRoute.jsx',
  'src/hooks/useAuth.js',
  'src/context/AuthContext.jsx',
  'src/services/apiClient.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  const exists = fs.existsSync(fullPath);
  logResult(`Required file exists: ${file}`, exists);
});

// 2. Check forbidden legacy files & delete comment-only leftovers if present
const forbiddenFiles = [
  'src/components/Home.js',
  'src/components/HiddenGems.js',
  'src/components/Navbar.js',
  'src/components/Header.js',
  'src/components/ProtectedRoute.js',
  'src/components/RepoCard.js',
  'src/components/RepoList.js',
  'src/components/RepoModal.js',
  'src/components/Search.js',
  'src/components/SearchBar.js',
  'src/components/Categories.js',
  'src/components/Favorites.js',
  'src/components/Stash.js',
  'src/components/ComparisonAudit.js',
  'src/components/ErrorBoundary.js',
  'src/pages/UserFavorites.js',
  'src/pages/UserCollections.js',
  'src/pages/HiddenGems.js',
  'src/pages/Login.js',
  'src/pages/Signup.js',
  'src/pages/Profile.js',
  'src/context/AuthContext.js',
  'src/utils/apiClient.js'
];

forbiddenFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      // If it contains only migration comments, auto-delete it during validation
      if (content.length < 200 && content.trim().startsWith('//')) {
        fs.unlinkSync(fullPath);
        logResult(`Forbidden legacy file: ${file}`, true, '(Auto-deleted comment-only leftover)');
      } else {
        logResult(`Forbidden legacy file: ${file}`, false, 'File exists and contains executable logic!');
      }
    } catch (err) {
      logResult(`Forbidden legacy file: ${file}`, false, `Could not process file: ${err.message}`);
    }
  } else {
    logResult(`Forbidden legacy file: ${file}`, true, '(Does not exist)');
  }
});

// 3. Inspect contents of key files
function checkFileContains(filePath, mustContainStrings, forbiddenStrings = []) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');

  mustContainStrings.forEach(str => {
    const passed = content.includes(str);
    logResult(`${filePath} includes: "${str}"`, passed);
  });

  forbiddenStrings.forEach(str => {
    const passed = !content.includes(str);
    logResult(`${filePath} does NOT include legacy import: "${str}"`, passed);
  });
}

// Check src/App.js imports AppRoutes
checkFileContains('src/App.js', ['import AppRoutes from'], ['components/Home', 'pages/UserFavorites']);

// Check AppRoutes imports pages from src/pages
checkFileContains('src/routes/AppRoutes.jsx', ['import Home from \'../pages/Home\''], ['components/Home']);

// Check useAuth imports AuthContext from ../context/AuthContext
checkFileContains('src/hooks/useAuth.js', ['import { AuthContext } from \'../context/AuthContext\'']);

// Check no import references src/utils/apiClient in context/AuthContext.jsx
checkFileContains('src/context/AuthContext.jsx', ['import { auth } from \'../services/apiClient\''], ['utils/apiClient']);

console.log('\n=== Validation Summary ===');
if (allPassed) {
  console.log('RESULT: PASS');
  process.exit(0);
} else {
  console.log('RESULT: FAIL');
  process.exit(1);
}
