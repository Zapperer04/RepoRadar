/**
 * Database Connection Pool
 * Connects to PostgreSQL and provides query interface
 */

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const poolConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'goat_repo_finder',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

if (process.env.DATABASE_URL) {
  const redacted = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
  console.log('[DB] Connecting via URL:', redacted);
} else {
  console.log('[DB] Connecting via params:', { ...poolConfig, password: '****' });
}

const pool = new Pool(poolConfig);


pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

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

async function getOne(text, params) {
  const res = await query(text, params);
  return res.rows[0];
}

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
