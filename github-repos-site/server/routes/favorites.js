/**
 * Favorites Routes
 * Add, remove, get favorites for logged-in user
 */

const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/favorites
 * Get user's favorite repositories
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const favorites = await db.getAll(
      `SELECT * FROM favorites 
       WHERE user_id = $1 
       ORDER BY added_at DESC`,
      [req.userId]
    );

    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

/**
 * POST /api/favorites
 * Add repository to favorites
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { repoId, repoName, repoUrl, repoOwner, repoDescription, repoStars, repoLanguage } = req.body;

    if (!repoId || !repoName) {
      return res.status(400).json({ error: 'repoId and repoName are required' });
    }

    // Check if already favorited
    const existing = await db.getOne(
      'SELECT id FROM favorites WHERE user_id = $1 AND repo_id = $2',
      [req.userId, repoId]
    );

    if (existing) {
      return res.status(409).json({ error: 'Repository already in favorites' });
    }

    // Add favorite
    const favorite = await db.getOne(
      `INSERT INTO favorites (user_id, repo_id, repo_name, repo_url, repo_owner, repo_description, repo_stars, repo_language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.userId, repoId, repoName, repoUrl, repoOwner, repoDescription, repoStars, repoLanguage]
    );

    res.status(201).json({
      message: 'Added to favorites',
      favorite,
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

/**
 * DELETE /api/favorites/:repoId
 * Remove repository from favorites
 */
router.delete('/:repoId', verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;

    const result = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND repo_id = $2',
      [req.userId, repoId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

/**
 * GET /api/favorites/:repoId
 * Check if repository is in favorites
 */
router.get('/:repoId', verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;

    const favorite = await db.getOne(
      'SELECT id FROM favorites WHERE user_id = $1 AND repo_id = $2',
      [req.userId, repoId]
    );

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

module.exports = router;
