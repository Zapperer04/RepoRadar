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
    return db.getOne(
      'SELECT id, email, username, full_name, avatar_url, bio, created_at, last_login FROM users WHERE id = $1',
      [id]
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
    const [favorites, history, collections] = await Promise.all([
      db.getOne('SELECT COUNT(*) as count FROM favorites WHERE user_id = $1', [userId]),
      db.getOne('SELECT COUNT(*) as count FROM search_history WHERE user_id = $1', [userId]),
      db.getOne('SELECT COUNT(*) as count FROM collections WHERE user_id = $1', [userId]),
    ]);

    return {
      favoritesCount: parseInt(favorites.count),
      searchHistoryCount: parseInt(history.count),
      collectionsCount: parseInt(collections.count),
    };
  }
}

module.exports = User;
