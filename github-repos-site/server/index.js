const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { initializeDatabase } = require('./db/init');

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

console.log('[MIDDLEWARE] Adding traffic logger...');
app.use((req, res, next) => {
  const msg = `[TRAFFIC] ${req.method} ${req.url}\n`;
  console.log(msg);
  process.stdout.write(msg);
  process.stderr.write(`[STDERR_TRAFFIC] ${req.method} ${req.url}\n`);
  next();
});
console.log('[MIDDLEWARE] Traffic logger added');

app.get('/', (req, res) => res.json({ status: 'online', service: 'RepoRadar Engine' }));

// Load route modules
console.log('[ROUTES] Loading route modules...');
const repoRoutes = require('./routes/repo.routes');
const searchRoutes = require('./routes/search.routes');
const hiddenGemsRoutes = require('./routes/hiddenGems.routes');
const trendingRoutes = require('./routes/trending.routes');
const domainsRoutes = require('./routes/domains.routes');
const compareRoutes = require('./routes/compare.routes');
const savedRoutes = require('./routes/saved.routes');
const favoriteRoutes = require('./routes/favorites');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const collectionRoutes = require('./routes/collections');
const userRoutes = require('./routes/user');

console.log('[ROUTES] Registering routes...');
app.use('/api/repos', repoRoutes);

// Backward compatible aliases mapping to new repo controller
const repoController = require('./controllers/repo.controller');
app.get('/api/search', repoController.searchRepos);
app.get('/api/hiddenGems', repoController.getHiddenGems);
app.get('/api/trending', repoController.getTrending);
app.get('/api/domains', repoController.getDomains);

// Existing routes (commented out or kept if they actually exist and aren't superseded)
// app.use('/api/compare', compareRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/user', userRoutes);
console.log('[ROUTES] All routes registered');

// Catch-all 404 handler
app.use((req, res) => {
  console.log('[404] Unmatched route:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

// Start server with database initialization
(async () => {
  try {
    console.log('[SERVER] Starting initialization...');
    await initializeDatabase();
    console.log('[SERVER] Database initialized, starting Express...');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 REPORADAR ENGINE ACTIVE ON PORT ${PORT}`);
      const TOKEN = process.env.GITHUB_TOKEN;
      const tokenPreview = TOKEN ? `${TOKEN.substring(0, 4)}...${TOKEN.substring(TOKEN.length - 4)}` : 'NONE';
      console.log(`📡 TOKEN_STATUS: ${TOKEN ? 'AUTHENTICATED' : 'ANONYMOUS'} (${tokenPreview})`);
    });
    
    console.log('[SERVER] Server listening, keeping process alive...');
    
    process.on('SIGTERM', () => {
      console.log('[SERVER] SIGTERM received, shutting down gracefully...');
      server.close(() => process.exit(0));
    });
    process.on('SIGINT', () => {
      console.log('[SERVER] SIGINT received, shutting down gracefully...');
      server.close(() => process.exit(0));
    });
    
    process.stdin.resume();
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();