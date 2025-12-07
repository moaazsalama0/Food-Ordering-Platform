// backend/testDB.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test connection
    const timeResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', timeResult.rows[0].now);
    
    // List all tables
    console.log('\n📋 Available tables:');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
    // Check dish table columns
    console.log('\n📊 Columns in "dish" table:');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'dish'
      ORDER BY ordinal_position
    `);
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Try to query dish table
    console.log('\n🍕 Sample data from dish table:');
    const dishResult = await pool.query('SELECT * FROM dish LIMIT 3');
    console.log('Dishes found:', dishResult.rows);
    
    // Check category table
    console.log('\n📂 Categories:');
    const categoryResult = await pool.query('SELECT * FROM category');
    console.log('Categories found:', categoryResult.rows);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();