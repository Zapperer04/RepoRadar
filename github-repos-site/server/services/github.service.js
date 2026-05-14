const axios = require('axios');

class GithubService {
  static getHeaders() {
    const TOKEN = process.env.GITHUB_TOKEN;
    return {
      'User-Agent': 'Goat-Repo-Finder-Audit',
      ...(TOKEN ? { 'Authorization': `token ${TOKEN}` } : {})
    };
  }

  static async getReadme(owner, repo) {
    let result = null;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    try {
      console.log(`[SERVICE] Attempting GitHub API: ${apiUrl}`);
      const apiRes = await axios.get(apiUrl, { headers: this.getHeaders(), timeout: 8000 });
      result = { content: apiRes.data.content, encoding: apiRes.data.encoding };
    } catch (e) {
      console.warn(`[SERVICE] API Layer Fail: ${e.response?.status} - ${e.message}`);
    }

    if (!result) {
      const branches = ['main', 'master'];
      for (const branch of branches) {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
          console.log(`[SERVICE] Attempting raw URL: ${rawUrl}`);
          const rawRes = await axios.get(rawUrl, { timeout: 6000 });
          result = { content: Buffer.from(rawRes.data.toString()).toString('base64'), encoding: 'base64' };
          break;
        } catch (e) {
          continue;
        }
      }
    }

    if (result) return result;
    throw new Error('No documentation found');
  }

  static async searchRepos(queryString) {
    const githubUrl = `https://api.github.com/search/repositories?${queryString}`;
    console.log(`[SERVICE] Search URL: ${githubUrl}`);
    const response = await axios.get(githubUrl, {
      headers: this.getHeaders(),
      timeout: 10000
    });
    return response.data;
  }
}

module.exports = GithubService;
