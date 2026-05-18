/**
 * Authentication Routes
 * Signup, Login, Logout
 */

const express = require('express');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Create user
    const user = await User.create(email, username, password, fullName);
    
    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'Email or username already exists') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Signup failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (frontend removes token from storage)
 */
router.post('/logout', (req, res) => {
  // Token is stored on client side, so logout just requires removing it
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

/**
 * PUT /api/auth/me
 * Update username/email
 */
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ success: false, error: 'Username and email are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, error: 'Username must be at least 3 characters' });
    }

    // Check for duplicate username or email
    const userByEmail = await User.findByEmail(email);
    if (userByEmail && userByEmail.id !== req.userId) {
      return res.status(409).json({ success: false, error: 'Email already in use' });
    }

    // Since we don't have a direct findByUsername, we can query standard db client
    const db = require('../db');
    const userByUsername = await db.getOne('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.userId]);
    if (userByUsername) {
      return res.status(409).json({ success: false, error: 'Username already in use' });
    }

    const updatedUser = await User.updateAuthMe(req.userId, { username, email });
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        fullName: updatedUser.full_name,
        avatarUrl: updatedUser.avatar_url,
        bio: updatedUser.bio,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/auth/password
 * Change password
 */
router.put('/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    // Find the user to verify current password
    const db = require('../db');
    const user = await db.getOne('SELECT password_hash FROM users WHERE id = $1', [req.userId]);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isValid = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    await User.updatePassword(req.userId, newPassword);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, error: 'Failed to update password' });
  }
});

/**
 * DELETE /api/auth/me
 * Delete current user account and cascade delete all their data
 */
router.delete('/me', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required to confirm account deletion' });
    }

    const db = require('../db');
    const user = await db.getOne('SELECT password_hash FROM users WHERE id = $1', [req.userId]);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Account deletion aborted.' });
    }

    await User.deleteUser(req.userId);
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, error: 'Failed to delete account' });
  }
});

/**
 * POST /api/auth/verify
 * Verify if token is still valid
 */
router.post('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, userId: req.userId });
});

module.exports = router;
