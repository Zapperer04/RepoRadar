/**
 * Collections Routes
 * Create, manage, and organize custom repository collections
 */

const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/collections
 * Get user's collections
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const collections = await db.getAll(
      `SELECT c.*, COUNT(ci.id) as item_count
       FROM collections c
       LEFT JOIN collection_items ci ON c.id = ci.collection_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [req.userId]
    );

    res.json({ collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

/**
 * POST /api/collections
 * Create new collection
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    if (name.length > 255) {
      return res.status(400).json({ error: 'Collection name too long' });
    }

    const collection = await db.getOne(
      `INSERT INTO collections (user_id, name, description, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, name, description || '', isPublic || false]
    );

    res.status(201).json({
      message: 'Collection created',
      collection: { ...collection, item_count: 0 },
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

/**
 * GET /api/collections/:collectionId
 * Get collection details with items
 */
router.get('/:collectionId', verifyToken, async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collection = await db.getOne(
      'SELECT * FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, req.userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const items = await db.getAll(
      `SELECT * FROM collection_items 
       WHERE collection_id = $1 
       ORDER BY added_at DESC`,
      [collectionId]
    );

    res.json({
      collection: { ...collection, items },
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

/**
 * PUT /api/collections/:collectionId
 * Update collection
 */
router.put('/:collectionId', verifyToken, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description, isPublic } = req.body;

    const updated = await db.getOne(
      `UPDATE collections 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           is_public = COALESCE($3, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, description, isPublic, collectionId, req.userId]
    );

    if (!updated) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      message: 'Collection updated',
      collection: updated,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

/**
 * DELETE /api/collections/:collectionId
 * Delete collection
 */
router.delete('/:collectionId', verifyToken, async (req, res) => {
  try {
    const { collectionId } = req.params;

    const result = await db.query(
      'DELETE FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

/**
 * POST /api/collections/:collectionId/items
 * Add repository to collection
 */
router.post('/:collectionId/items', verifyToken, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { repoId, repoName, repoUrl, repoOwner, repoDescription, repoStars, repoLanguage } = req.body;

    if (!repoId || !repoName) {
      return res.status(400).json({ error: 'repoId and repoName are required' });
    }

    // Verify collection belongs to user
    const collection = await db.getOne(
      'SELECT id FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, req.userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if already in collection
    const existing = await db.getOne(
      'SELECT id FROM collection_items WHERE collection_id = $1 AND repo_id = $2',
      [collectionId, repoId]
    );

    if (existing) {
      return res.status(409).json({ error: 'Repository already in collection' });
    }

    // Add item
    const item = await db.getOne(
      `INSERT INTO collection_items (collection_id, repo_id, repo_name, repo_url, repo_owner, repo_description, repo_stars, repo_language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [collectionId, repoId, repoName, repoUrl, repoOwner, repoDescription, repoStars, repoLanguage]
    );

    res.status(201).json({
      message: 'Item added to collection',
      item,
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

/**
 * DELETE /api/collections/:collectionId/items/:itemId
 * Remove item from collection
 */
router.delete('/:collectionId/items/:itemId', verifyToken, async (req, res) => {
  try {
    const { collectionId, itemId } = req.params;

    // Verify collection belongs to user
    const collection = await db.getOne(
      'SELECT id FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, req.userId]
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const result = await db.query(
      'DELETE FROM collection_items WHERE id = $1 AND collection_id = $2',
      [itemId, collectionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found in collection' });
    }

    res.json({ message: 'Item removed from collection' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
