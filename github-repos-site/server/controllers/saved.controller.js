const db = require('../db');

function buildResponse(data, isFallback = false, errorMessage = null) {
  return {
    success: true,
    source: isFallback ? 'fallback' : 'github',
    count: Array.isArray(data) ? data.length : undefined,
    errorMessage: isFallback ? (errorMessage || 'GitHub API unavailable, using local fallback data') : null,
    data
  };
}

exports.getSavedRepos = async (req, res) => {
  try {
    console.log(`[AUTH] User ${req.userId} fetching saved repos`);
    const repos = await db.getAll(
      'SELECT * FROM saved_repositories WHERE user_id = $1 ORDER BY saved_at DESC',
      [req.userId]
    );
    res.json({ success: true, data: repos });
  } catch (error) {
    console.error(`[ERROR] getSavedRepos for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch saved repositories' });
  }
};

exports.saveRepo = async (req, res) => {
  try {
    const repo = req.body;
    console.log(`[AUTH] User ${req.userId} saving repo: ${repo.fullName}`);
    if (!repo.fullName || !repo.owner || !repo.name) {
      return res.status(400).json({ success: false, error: 'Incomplete repository data' });
    }

    // Check for duplicates
    const existing = await db.getOne(
      'SELECT id FROM saved_repositories WHERE user_id = $1 AND full_name = $2',
      [req.userId, repo.fullName]
    );

    if (existing) {
      console.warn(`[AUTH] User ${req.userId} attempted duplicate save of ${repo.fullName}`);
      return res.status(409).json({ success: false, error: 'Repository already saved' });
    }

    const saved = await db.getOne(
      `INSERT INTO saved_repositories 
       (user_id, repo_id, name, owner, full_name, description, domain, language, stars, forks, github_url, hidden_gem_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        req.userId, 
        repo.id || '', 
        repo.name, 
        repo.owner, 
        repo.fullName, 
        repo.description || '', 
        repo.domain || '', 
        repo.language || '', 
        repo.stars || 0, 
        repo.forks || 0, 
        repo.githubUrl || '', 
        repo.hiddenGemScore || 0
      ]
    );

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error(`[ERROR] saveRepo for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to save repository' });
  }
};

exports.unsaveRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    console.log(`[AUTH] User ${req.userId} unsaving repo: ${repoId}`);
    
    // We try to delete by id (saved_repositories primary key) 
    // or we could support full_name if repoId is a string like "owner/repo"
    let result;
    if (isNaN(repoId)) {
      result = await db.query(
        'DELETE FROM saved_repositories WHERE user_id = $1 AND full_name = $2',
        [req.userId, repoId]
      );
    } else {
      result = await db.query(
        'DELETE FROM saved_repositories WHERE user_id = $1 AND id = $2',
        [req.userId, parseInt(repoId)]
      );
    }

    if (result.rowCount === 0) {
      console.warn(`[AUTH] User ${req.userId} failed to unsave repo: ${repoId} (Not Found)`);
      return res.status(404).json({ success: false, error: 'Saved repository not found' });
    }

    res.json({ success: true, message: 'Removed from saved' });
  } catch (error) {
    console.error(`[ERROR] unsaveRepo for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to remove saved repository' });
  }
};

exports.checkSaved = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const fullName = `${owner}/${repoName}`;
    console.log(`[AUTH] User ${req.userId} checking saved status for: ${fullName}`);

    const saved = await db.getOne(
      'SELECT id FROM saved_repositories WHERE user_id = $1 AND full_name = $2',
      [req.userId, fullName]
    );

    res.json({ success: true, isSaved: !!saved });
  } catch (error) {
    console.error(`[ERROR] checkSaved for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to check saved status' });
  }
};
