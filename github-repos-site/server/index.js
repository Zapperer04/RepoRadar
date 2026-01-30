const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors()); // Allows your React app to talk to this server

const GITHUB_API = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN;

// 1. Search Proxy
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q; // Pass the query string exactly as is
    const response = await axios.get(`${GITHUB_API}/search/repositories?${query}`, {
      headers: {
        Authorization: `token ${TOKEN}`, // This unlocks the 5000 limit
        Accept: 'application/vnd.github.v3+json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch repos' });
  }
});

// 2. Readme Proxy
app.get('/api/readme/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
      headers: { Authorization: `token ${TOKEN}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Readme not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));