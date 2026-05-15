const db = require('../db');

exports.getCollections = async (req, res) => {
  try {
    console.log(`[AUTH] User ${req.userId} fetching collections`);
    const collections = await db.getAll(
      `SELECT c.*, COUNT(cr.id) as item_count
       FROM collections c
       LEFT JOIN collection_repositories cr ON c.id = cr.collection_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, data: collections });
  } catch (error) {
    console.error(`[ERROR] getCollections for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(`[AUTH] User ${req.userId} creating collection: ${name}`);
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

    const collection = await db.getOne(
      `INSERT INTO collections (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.userId, name, description || '']
    );

    res.status(201).json({ success: true, data: { ...collection, item_count: 0 } });
  } catch (error) {
    console.error(`[ERROR] createCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to create collection' });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[AUTH] User ${req.userId} fetching collection details for id: ${id}`);
    const collection = await db.getOne(
      'SELECT * FROM collections WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' });

    const repos = await db.getAll(
      `SELECT sr.* 
       FROM saved_repositories sr
       JOIN collection_repositories cr ON sr.id = cr.saved_repo_id
       WHERE cr.collection_id = $1
       ORDER BY cr.added_at DESC`,
      [id]
    );

    res.json({ success: true, data: { ...collection, repos } });
  } catch (error) {
    console.error(`[ERROR] getCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch collection details' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(`[AUTH] User ${req.userId} updating collection id: ${id}`);

    const collection = await db.getOne(
      `UPDATE collections 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name, description, id, req.userId]
    );

    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' });

    res.json({ success: true, data: collection });
  } catch (error) {
    console.error(`[ERROR] updateCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to update collection' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[AUTH] User ${req.userId} deleting collection id: ${id}`);
    const result = await db.query(
      'DELETE FROM collections WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Collection not found' });

    res.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    console.error(`[ERROR] deleteCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to delete collection' });
  }
};

exports.addRepoToCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { repo, savedRepoId } = req.body;
    console.log(`[AUTH] User ${req.userId} adding repo to collection id: ${id}`);

    // Verify collection ownership
    const collection = await db.getOne('SELECT id FROM collections WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' });

    let finalSavedRepoId = savedRepoId;

    // If repo object provided, ensure it's saved first
    if (repo && !finalSavedRepoId) {
      const existing = await db.getOne('SELECT id FROM saved_repositories WHERE user_id = $1 AND full_name = $2', [req.userId, repo.fullName]);
      if (existing) {
        finalSavedRepoId = existing.id;
      } else {
        const saved = await db.getOne(
          `INSERT INTO saved_repositories 
           (user_id, repo_id, name, owner, full_name, description, domain, language, stars, forks, github_url, hidden_gem_score)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id`,
          [req.userId, repo.id || '', repo.name, repo.owner, repo.fullName, repo.description || '', repo.domain || '', repo.language || '', repo.stars || 0, repo.forks || 0, repo.githubUrl || '', repo.hiddenGemScore || 0]
        );
        finalSavedRepoId = saved.id;
      }
    }

    if (!finalSavedRepoId) return res.status(400).json({ success: false, error: 'Saved repository ID or repo object required' });

    // Check for duplicates in collection
    const duplicate = await db.getOne('SELECT id FROM collection_repositories WHERE collection_id = $1 AND saved_repo_id = $2', [id, finalSavedRepoId]);
    if (duplicate) return res.status(409).json({ success: false, error: 'Repository already in collection' });

    await db.query(
      'INSERT INTO collection_repositories (collection_id, saved_repo_id) VALUES ($1, $2)',
      [id, finalSavedRepoId]
    );

    res.status(201).json({ success: true, message: 'Added to collection' });
  } catch (error) {
    console.error(`[ERROR] addRepoToCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to add repository to collection' });
  }
};

exports.removeRepoFromCollection = async (req, res) => {
  try {
    const { id, savedRepoId } = req.params;
    console.log(`[AUTH] User ${req.userId} removing repo ${savedRepoId} from collection id: ${id}`);

    // Verify collection ownership
    const collection = await db.getOne('SELECT id FROM collections WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' });

    const result = await db.query(
      'DELETE FROM collection_repositories WHERE collection_id = $1 AND saved_repo_id = $2',
      [id, savedRepoId]
    );

    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Repository not found in collection' });

    res.json({ success: true, message: 'Removed from collection' });
  } catch (error) {
    console.error(`[ERROR] removeRepoFromCollection for user ${req.userId}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to remove repository from collection' });
  }
};
