const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Auto-migrate/copy new favicon if present in local system
try {
  const fs = require('fs');
  const src = 'C:/Users/Kaustav/.gemini/antigravity/brain/efd2413f-4ad1-40a8-b1fb-ae9f3d050098/reporadar_logo_favicon_1779102954089.png';
  const destPng = path.join(__dirname, '../public/favicon.png');
  const destIco = path.join(__dirname, '../public/favicon.ico');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, destPng);
    fs.copyFileSync(src, destIco);
    console.log('[FAVICON] Successfully copied reporadar favicon logo to public/favicon.png and public/favicon.ico');
  }
} catch (e) {
  console.log('[FAVICON_NOTICE] Copy skipped or local filesystem mismatch:', e.message);
}

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
// Dynamic PORT for deployment, fallback to 5005 for local
const PORT = process.env.PORT || 5005; 

// Safe CORS origins for production and local development
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5006",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Traffic logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  // Removed problematic body logging to prevent crash
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
app.get('/api/me', verifyToken, (req, res) => res.redirect(307, '/api/auth/me'));

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
    console.error('❌ CRITICAL STARTUP ERROR:', error);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
})();