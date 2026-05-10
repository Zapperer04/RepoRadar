const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

// Import database and routes
const { initializeDatabase } = require('./db/init');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const favoritesRoutes = require('./routes/favorites');
const historyRoutes = require('./routes/history');
const collectionsRoutes = require('./routes/collections');

const app = express();

// ============================================================================
// ENVIRONMENT VALIDATION - Check required env vars on startup
// ============================================================================
const requiredEnvVars = ['GITHUB_TOKEN', 'GROQ_API_KEY', 'PORT', 'JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ FATAL: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('   Please create a .env file using .env.example as a template');
  process.exit(1);
}

console.log('✅ All required environment variables loaded');

// ============================================================================
// CORS CONFIGURATION - Allow all origins in development
// ============================================================================
if (process.env.NODE_ENV === 'development') {
  app.use(cors());  // Allow all origins in development
} else {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.use(cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
  }));
}

// ============================================================================
// MIDDLEWARE
// ============================================================================
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rate limiting - max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to API endpoints
app.use('/api/', limiter);

// ============================================================================
// CONFIGURATION
// ============================================================================
const TOKEN = process.env.GITHUB_TOKEN;
const githubHeaders = TOKEN ? { Authorization: `token ${TOKEN}` } : {};
const AXIOS_TIMEOUT = 10000; // 10 second timeout for API calls
const MAX_CONTENT_LENGTH = 20000; // Max characters for AI processing

// Initialize Groq client
const groqKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groqKey });

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates search query parameters
 */
function validateSearchQuery(queryObj) {
  const errors = [];
  
  if (!queryObj.q) {
    errors.push('Query parameter "q" is required');
  }
  
  if (queryObj.per_page) {
    const perPage = parseInt(queryObj.per_page);
    if (isNaN(perPage) || perPage < 1 || perPage > 100) {
      errors.push('per_page must be between 1 and 100');
    }
  }
  
  if (queryObj.page) {
    const page = parseInt(queryObj.page);
    if (isNaN(page) || page < 1) {
      errors.push('page must be a positive integer');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates repository owner and name
 */
function validateRepoPath(owner, repo) {
  const errors = [];
  const repoRegex = /^[a-zA-Z0-9._-]+$/;
  
  if (!owner || !repo) {
    errors.push('Owner and repo name are required');
  } else {
    if (!repoRegex.test(owner)) {
      errors.push('Invalid owner name format');
    }
    if (!repoRegex.test(repo)) {
      errors.push('Invalid repo name format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    groqEnabled: !!groqKey
  });
});

/**
 * Search repositories proxy
 */
app.get('/api/search', async (req, res) => {
  try {
    // Validate input
    const validation = validateSearchQuery(req.query);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid query parameters',
        details: validation.errors 
      });
    }

    const query = new URLSearchParams(req.query).toString();
    const response = await axios.get(
      `https://api.github.com/search/repositories?${query}`,
      {
        headers: githubHeaders,
        timeout: AXIOS_TIMEOUT
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.response?.status, error.response?.data || error.message);
    
    // Handle rate limiting
    if (error.response?.status === 422) {
      return res.status(422).json({ 
        error: 'Invalid search query. Please check your filters.' 
      });
    }
    
    if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'GitHub API rate limit exceeded. Please try again later.' 
      });
    }

    const message = error.response?.data?.message || error.message || 'Search failed';
    res.status(error.response?.status || 500).json({ error: message });
  }
});

/**
 * Fetch README proxy
 */
app.get('/api/readme/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // Validate input
    const validation = validateRepoPath(owner, repo);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid repository path',
        details: validation.errors 
      });
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: githubHeaders,
        timeout: AXIOS_TIMEOUT
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`README error for ${req.params.owner}/${req.params.repo}:`, error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Repository or README not found' });
    }
    
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch README' 
    });
  }
});

/**
 * AI Explanation endpoint
 */
app.post('/api/explain', async (req, res) => {
  console.log('🤖 Received AI request...');

  try {
    const { content } = req.body;
    
    // Validate input
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content must be a string' });
    }
    
    if (!groqKey) {
      throw new Error('Server is missing GROQ_API_KEY');
    }

    // Clean and truncate content
    const cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '');
    const truncatedContent = cleanContent.substring(0, MAX_CONTENT_LENGTH);

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a senior code auditor. Your job is to identify the TECH STACK and ARCHITECTURE. Ignore generic 'About Us' text. If the text is vague, use your internal knowledge about this specific repository to fill in the missing technical details." 
        },
        { 
          role: "user", 
          content: `Analyze this repository and give me a 2-sentence summary for a senior engineer:
          1. Exact Tech Stack (Languages, Frameworks, Databases).
          2. What does the software actually DO?
          
          README CONTENT (Truncated):
          ${truncatedContent}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const summary = completion.choices[0]?.message?.content || "No summary generated.";
    console.log('✅ Summary generated successfully!');
    res.json({ summary });

  } catch (error) {
    console.error('❌ AI ERROR:', error.message);
    
    if (error.message.includes('rate_limit')) {
      return res.status(429).json({ 
        error: 'AI service rate limited. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Could not generate summary. Please try again or check the README directly.' 
    });
  }
});

// ============================================================================
// USER AUTHENTICATION & PERSONALIZATION ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/collections', collectionsRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`📦 Node environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✅ All systems ready');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    // Keep process alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();