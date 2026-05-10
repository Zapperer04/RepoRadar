const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { initializeDatabase } = require('./db/init');

const app = express();
// Shift to 5005 to avoid collision with the React dev server which is grabbing 5000
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

const TOKEN = process.env.GITHUB_TOKEN;
const githubHeaders = {
  'User-Agent': 'Goat-Repo-Finder-Audit',
  ...(TOKEN ? { 'Authorization': `token ${TOKEN}` } : {})
};

app.get('/', (req, res) => res.json({ status: 'online', service: 'Goat Finder' }));

/**
 * README Proxy - Express 5 Compatible Syntax
 * Using the updated wildcard pattern for Express 5.x
 */
app.get('/api/readme/:owner/:repo', async (req, res) => {
  // Extract owner and repo from URL parameters
  const { owner, repo } = req.params;
  
  console.log(`[AUDIT] Target: ${owner}/${repo}`);

  try {
    let result = null;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    try {
      console.log(`[AUDIT] Attempting GitHub API: ${apiUrl}`);
      const apiRes = await axios.get(apiUrl, { headers: githubHeaders, timeout: 8000 });
      result = { content: apiRes.data.content, encoding: apiRes.data.encoding };
      console.log(`[AUDIT] API Layer Success`);
    } catch (e) {
      console.warn(`[AUDIT] API Layer Fail: ${e.response?.status} - ${e.message}`);
    }

    if (!result) {
      console.log(`[AUDIT] Trying raw GitHub content...`);
      const branches = ['main', 'master'];
      for (const branch of branches) {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
          console.log(`[AUDIT] Attempting raw URL: ${rawUrl}`);
          const rawRes = await axios.get(rawUrl, { timeout: 6000 });
          result = { content: Buffer.from(rawRes.data.toString()).toString('base64'), encoding: 'base64' };
          console.log(`[AUDIT] Raw Layer Success: ${branch}`);
          break;
        } catch (e) { 
          console.warn(`[AUDIT] Raw Layer Fail (${branch}): ${e.message}`);
          continue; 
        }
      }
    }

    if (result) {
      console.log(`[AUDIT] Sending result to client`);
      return res.json(result);
    }
    
    console.warn(`[AUDIT] No documentation found for ${owner}/${repo}`);
    throw new Error('No documentation found');
  } catch (error) {
    console.error(`[AUDIT] ERROR: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    // Validate search query
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}`, {
      headers: githubHeaders,
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/explain', async (req, res) => {
  try {
    const { content } = req.body;
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "Ruthless Auditor. 2 sentences." }, { role: "user", content: `Analyze: ${content.substring(0, 5000)}` }],
      model: "llama-3.3-70b-versatile",
    });
    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI Offline' });
  }
});

// Register API routes
console.log('[ROUTES] Loading route modules...');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const historyRoutes = require('./routes/history');
const collectionRoutes = require('./routes/collections');
const userRoutes = require('./routes/user');

console.log('[ROUTES] Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
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
    // Initialize database first
    await initializeDatabase();
    console.log('[SERVER] Database initialized, starting Express...');
    
    // Then start the Express server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 GOAT DISCOVERY ENGINE ACTIVE ON PORT ${PORT}`);
      console.log(`📡 TOKEN_STATUS: ${TOKEN ? 'AUTHENTICATED' : 'ANONYMOUS'}`);
    });
    
    console.log('[SERVER] Server listening, keeping process alive...');
    
    // Keep the process alive
    process.on('SIGTERM', () => {
      console.log('[SERVER] SIGTERM received, shutting down gracefully...');
      server.close(() => process.exit(0));
    });
    process.on('SIGINT', () => {
      console.log('[SERVER] SIGINT received, shutting down gracefully...');
      server.close(() => process.exit(0));
    });
    
    // Prevent the Node process from exiting
    process.stdin.resume();
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();