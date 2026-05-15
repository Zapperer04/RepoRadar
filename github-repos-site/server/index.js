const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { initializeDatabase } = require('./db/init');

// Load controllers and routes
const repoController = require('./controllers/repo.controller');
const repoRoutes = require('./routes/repo.routes');
const savedRoutes = require('./routes/saved.routes');
const collectionRoutes = require('./routes/collections.routes');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const userRoutes = require('./routes/user');
const savedController = require('./controllers/saved.controller');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Traffic logger
app.use((req, res, next) => {
  const msg = `[TRAFFIC] ${req.method} ${req.url}\n`;
  if (req.url.startsWith('/api')) {
    console.log(msg);
  }
  next();
});

// Basic health check
app.get('/', (req, res) => res.json({ status: 'online', service: 'RepoRadar Engine' }));
app.get('/api/health', repoController.getHealth);

// API Routes
console.log('[ROUTES] Registering API routes...');
app.use('/api/repos', repoRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/user', userRoutes);

// Backward compatible aliases
app.get('/api/search', repoController.searchRepos);
app.get('/api/hiddenGems', repoController.getHiddenGems);
app.get('/api/trending', repoController.getTrending);
app.get('/api/domains', repoController.getDomains);

// Legacy favorites aliases
app.get('/api/favorites', verifyToken, savedController.getSavedRepos);
app.post('/api/favorites', verifyToken, savedController.saveRepo);
app.delete('/api/favorites/:repoId', verifyToken, savedController.unsaveRepo);

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