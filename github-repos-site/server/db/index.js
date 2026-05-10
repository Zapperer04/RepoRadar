/**
 * Database Connection Pool
 * Connects to PostgreSQL and provides query interface
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'goat_repo_finder',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Log connection info
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

/**
 * Query the database
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`✓ Query executed (${duration}ms)`);
    return res;
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

/**
 * Get a single row
 */
async function getOne(text, params) {
  const res = await query(text, params);
  return res.rows[0];
}

/**
 * Get multiple rows
 */
async function getAll(text, params) {
  const res = await query(text, params);
  return res.rows;
}

module.exports = {
  query,
  getOne,
  getAll,
  pool,
};
