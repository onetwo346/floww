const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Read database schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Create database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    try {
        // Execute schema
        await pool.query(schema);
        console.log('Database schema created successfully');

        // Close connection
        await pool.end();
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();
