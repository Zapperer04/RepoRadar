/**
 * Database Initialization
 * Creates all tables if they don't exist
 */

const fs = require('fs');
const path = require('path');
const db = require('./index');

async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and filter empty statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        process.stdout.write(`  Executing: ${trimmed.substring(0, 50).replace(/\n/g, ' ')}... `);
        await db.query(trimmed);
        console.log('OK');
      }
    }
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
};
