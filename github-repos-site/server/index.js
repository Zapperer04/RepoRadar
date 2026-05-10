const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub API Configuration
const TOKEN = process.env.GITHUB_TOKEN;
const githubHeaders = TOKEN ? { 
  'Authorization': `token ${TOKEN}`,
  'User-Agent': 'Goat-Repo-Finder-Audit'
} : {
  'User-Agent': 'Goat-Repo-Finder-Audit'
};

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

/**
 * Search Repositories Endpoint
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
    console.error('Search error:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

/**
 * Fetch README with Robust Parallel Failover
 */
app.get('/api/readme/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  console.log(`[AUDIT START] ${owner}/${repo}`);

  // Layer 1: GitHub API Attempt
  try {
    const apiRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: githubHeaders,
      timeout: 8000
    });
    console.log(`[AUDIT] Layer 1 Success`);
    return res.json(apiRes.data);
  } catch (apiError) {
    console.warn(`[AUDIT] Layer 1 Fail, pivoting to Parallel Raw...`);
    
    // Layer 2: Parallel Raw Fetch (Highly Compatible)
    const branches = ['main', 'master', 'develop'];
    const extensions = ['.md', '.markdown', ''];
    const fetchTargets = [];

    branches.forEach(branch => {
      extensions.forEach(ext => {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README${ext}`;
        fetchTargets.push(
          axios.get(url, { timeout: 6000 }).then(r => ({
            content: Buffer.from(r.data.toString()).toString('base64'),
            encoding: 'base64',
            source: branch
          }))
        );
      });
    });

    try {
      // Manual implementation of "any" for maximum compatibility
      const results = await Promise.allSettled(fetchTargets);
      const firstValid = results.find(r => r.status === 'fulfilled');
      
      if (firstValid) {
        console.log(`[AUDIT] Layer 2 Success - Found on branch ${firstValid.value.source}`);
        return res.json(firstValid.value);
      }
      
      throw new Error('All documentation vectors exhausted');
    } catch (err) {
      console.error('[AUDIT] Layer 2 TOTAL FAIL');
      res.status(apiError.response?.status || 500).json({ 
        error: `Infrastructure Failure: ${apiError.message}` 
      });
    }
  }
});

/**
 * AI Explanation Endpoint
 */
app.post('/api/explain', async (req, res) => {
  try {
    const { content } = req.body;
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'AI Service Key Missing' });
    }

    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const truncatedContent = content ? content.substring(0, 10000) : "No content provided.";
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a ruthless technical auditor. Provide ONLY a 2-sentence tactical brief. No intros." },
        { role: "user", content: `Analyze: ${truncatedContent}` }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'AI Briefing Offline' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GOAT BACKEND RUNNING ON PORT ${PORT}`);
});