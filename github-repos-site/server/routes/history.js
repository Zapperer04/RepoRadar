/**
 * Search History Routes
 * Track and retrieve user's search history
 */

const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/history
 * Get user's search history
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    
    const history = await db.getAll(
      `SELECT * FROM search_history 
       WHERE user_id = $1 
       ORDER BY searched_at DESC 
       LIMIT $2`,
      [req.userId, limit]
    );

    res.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * POST /api/history
 * Add search to history
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { query, resultsCount } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const record = await db.getOne(
      `INSERT INTO search_history (user_id, query, results_count)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.userId, query, resultsCount || 0]
    );

    res.status(201).json({
      message: 'Search recorded',
      record,
    });
  } catch (error) {
    console.error('Error recording search:', error);
    res.status(500).json({ error: 'Failed to record search' });
  }
});

/**
 * DELETE /api/history/:id
 * Delete a search history entry
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM search_history WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'History entry not found' });
    }

    res.json({ message: 'Deleted from history' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

/**
 * DELETE /api/history
 * Clear all search history
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM search_history WHERE user_id = $1',
      [req.userId]
    );

    res.json({ message: 'Search history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

/**
 * GET /api/history/stats
 * Get search statistics
 */
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await db.getOne(
      `SELECT 
        COUNT(*) as total_searches,
        COUNT(DISTINCT query) as unique_queries,
        MAX(searched_at) as last_search,
        AVG(results_count) as avg_results
       FROM search_history 
       WHERE user_id = $1`,
      [req.userId]
    );

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
