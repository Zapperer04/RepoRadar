const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const TOKEN = process.env.GITHUB_TOKEN;
const githubHeaders = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

// --- DEBUGGING: Check if Key Exists ---
const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
  console.error("❌ WARNING: GROQ_API_KEY is missing from .env file! AI explain features will be disabled.");
} else {
  console.log("✅ Groq API Key loaded");
}

const groq = new Groq({
    apiKey: groqKey || "dummy_key"
});

// 1. Search Proxy
app.get('/api/search', async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const response = await axios.get(`https://api.github.com/search/repositories?${query}`, {
      headers: githubHeaders
    });
    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.response?.status, error.response?.data || error.message);
    const message = error.response?.data?.message || 'Search failed';
    res.status(error.response?.status || 500).json({ error: message });
  }
});

// 2. Readme Proxy
app.get('/api/readme/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: githubHeaders
    });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Readme not found' });
  }
});

// 3. AI Explanation Route (SAFE LIMIT VERSION)
app.post('/api/explain', async (req, res) => {
  console.log("🤖 Received AI request...");

  try {
    const { content } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Server is missing GROQ_API_KEY");
    }

    // --- OPTIMIZATION TO SAVE TOKENS ---
    // 1. Remove image links and badges (they waste tokens)
    const cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '');
    
    // 2. Limit to 20,000 characters (Safe for Free Tier)
    const truncatedContent = cleanContent.substring(0, 20000);

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
    console.log("✅ Summary generated successfully!");
    res.json({ summary });

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);
    // If it STILL fails, send a polite error to the frontend
    res.status(500).json({ error: "Readme was too long for the free AI tier." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));