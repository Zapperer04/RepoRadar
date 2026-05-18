/**
 * User Model
 * Handles all user database operations
 */

const bcrypt = require('bcryptjs');
const db = require('../db');

class User {
  /**
   * Create a new user
   */
  static async create(email, username, password, fullName = '') {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Insert user
      const result = await db.getOne(
        `INSERT INTO users (email, username, password_hash, full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, username, full_name, created_at`,
        [email, username, passwordHash, fullName]
      );
      
      return result;
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new Error('Email or username already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    return db.getOne(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const uid = parseInt(id);
    if (isNaN(uid)) return null;
    return db.getOne(
      'SELECT id, email, username, full_name, avatar_url, bio, created_at, last_login FROM users WHERE id = $1',
      [uid]
    );
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, { fullName, avatarUrl, bio }) {
    return db.getOne(
      `UPDATE users 
       SET full_name = $1, avatar_url = $2, bio = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, username, full_name, avatar_url, bio`,
      [fullName, avatarUrl, bio, userId]
    );
  }

  /**
   * Update username and email
   */
  static async updateAuthMe(userId, { username, email }) {
    return db.getOne(
      `UPDATE users 
       SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, username, full_name, avatar_url, bio, created_at`,
      [username, email, userId]
    );
  }

  /**
   * Update user password
   */
  static async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, userId]
    );
  }

  /**
   * Delete user account
   */
  static async deleteUser(userId) {
    return db.query('DELETE FROM users WHERE id = $1', [userId]);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(userId) {
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  /**
   * Get user stats (for profile dashboard)
   */
  static async getStats(userId) {
    try {
      // Use integer for ID
      const uid = parseInt(userId);
      if (isNaN(uid)) throw new Error('Invalid User ID');

      const [saved, history, collections] = await Promise.all([
        db.getOne('SELECT COUNT(*) as count FROM saved_repositories WHERE user_id = $1', [uid]).catch(() => ({ count: 0 })),
        db.getOne('SELECT COUNT(*) as count FROM search_history WHERE user_id = $1', [uid]).catch(() => ({ count: 0 })),
        db.getOne('SELECT COUNT(*) as count FROM collections WHERE user_id = $1', [uid]).catch(() => ({ count: 0 })),
      ]);

      return {
        favoritesCount: Number(saved?.count || 0),
        searchHistoryCount: Number(history?.count || 0),
        collectionsCount: Number(collections?.count || 0),
      };
    } catch (error) {
      console.error('[STATS_ERROR]', error.message);
      return { favoritesCount: 0, searchHistoryCount: 0, collectionsCount: 0 };
    }
  }
}

module.exports = User;
