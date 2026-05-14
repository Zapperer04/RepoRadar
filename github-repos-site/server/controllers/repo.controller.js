const GithubService = require('../services/github.service');
const AiService = require('../services/ai.service');

class RepoController {
  static async getReadme(req, res) {
    const { owner, repo } = req.params;
    console.log(`[CONTROLLER] Target: ${owner}/${repo}`);
    try {
      const result = await GithubService.getReadme(owner, repo);
      return res.json(result);
    } catch (error) {
      console.error(`[CONTROLLER] ERROR: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async searchRepos(req, res) {
    try {
      let { q, page, per_page, sort, order } = req.query;
      if (!q || !q.trim()) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      if (q.startsWith('q=')) q = q.substring(2);

      const params = new URLSearchParams();
      params.set('q', q);
      if (page) params.set('page', page);
      if (per_page) params.set('per_page', per_page);
      if (sort) params.set('sort', sort);
      if (order) params.set('order', order);

      const data = await GithubService.searchRepos(params.toString());
      res.json(data);
    } catch (error) {
      console.error(`[CONTROLLER] Search Error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  static async explainRepo(req, res) {
    try {
      const { content } = req.body;
      const summary = await AiService.explainContent(content);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: 'AI Offline' });
    }
  }
}

module.exports = RepoController;
