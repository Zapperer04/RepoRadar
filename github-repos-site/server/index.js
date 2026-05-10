const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Safe AI Service Loading
let groq = null;
try {
  const Groq = require('groq-sdk');
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (e) {
  console.warn('⚠️ AI Service Library Missing');
}

// GitHub API Configuration
const TOKEN = process.env.GITHUB_TOKEN;
const githubHeaders = {
  'User-Agent': 'Goat-Repo-Finder-Audit',
  ...(TOKEN ? { 'Authorization': `token ${TOKEN}` } : {})
};

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', node_version: process.version });
});

/**
 * README Proxy with Parallel Stability
 */
app.get('/api/readme/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  console.log(`[AUDIT] Starting Discovery for ${owner}/${repo}`);

  try {
    // 1. GitHub API Attempt
    try {
      const apiRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: githubHeaders,
        timeout: 8000
      });
      return res.json(apiRes.data);
    } catch (apiError) {
      console.warn(`[AUDIT] Layer 1 Fail: ${apiError.message}`);
    }

    // 2. Parallel Raw Fallback
    const branches = ['main', 'master', 'develop'];
    const extensions = ['.md', '.markdown', ''];
    const targets = [];

    branches.forEach(branch => {
      extensions.forEach(ext => {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README${ext}`;
        targets.push(
          axios.get(url, { timeout: 6000 }).then(r => ({
            content: Buffer.from(r.data.toString()).toString('base64'),
            encoding: 'base64',
            branch
          })).catch(() => null)
        );
      });
    });

    const results = await Promise.all(targets);
    const validResult = results.find(r => r !== null);

    if (validResult) {
      return res.json(validResult);
    }

    throw new Error('All documentation vectors exhausted');
  } catch (error) {
    res.status(500).json({ error: `Discovery Failed: ${error.message}` });
  }
});

/**
 * Search Proxy
 */
app.get('/api/search', async (req, res) => {
  try {
    const { q, page, per_page, sort, order } = req.query;
    const queryString = `q=${q}&page=${page || 1}&per_page=${per_page || 30}&sort=${sort || 'stars'}&order=${order || 'desc'}`;
    
    const response = await axios.get(`https://api.github.com/search/repositories?${queryString}`, {
      headers: githubHeaders,
      timeout: 15000
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

/**
 * AI Briefing Proxy
 */
app.post('/api/explain', async (req, res) => {
  if (!groq) return res.status(503).json({ error: 'AI Service Offline' });

  try {
    const { content } = req.body;
    const truncated = content ? content.substring(0, 8000) : "No context.";
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Ruthless Technical Auditor. 2 sentences. Fact-only. No intro." },
        { role: "user", content: `Analyze: ${truncated}` }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Briefing Failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GOAT DISCOVERY ENGINE ACTIVE ON PORT ${PORT}`);
  console.log(`📡 TOKEN SECURITY: ${TOKEN ? 'AUTHENTICATED' : 'ANONYMOUS (RATE-LIMITED)'}`);
});