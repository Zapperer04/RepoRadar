/**
 * User Profile Routes
 * Get and update user profile
 */

const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await User.getStats(req.userId);

    res.json({
      user: {
        ...user,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, avatarUrl, bio } = req.body;

    const user = await User.updateProfile(req.userId, {
      fullName: fullName || '',
      avatarUrl: avatarUrl || '',
      bio: bio || '',
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * GET /api/user/stats
 * Get user statistics
 */
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await User.getStats(req.userId);
    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
