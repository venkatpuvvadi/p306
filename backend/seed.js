const db = require('./config/db');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        // db is already the pool/connection from config/db.js which handles SQLite/MySQL switch

        console.log('Connected to Database...');

        const schema = fs.readFileSync(path.join(__dirname, 'database/schema.sqlite.sql'), 'utf8');

        // Remove 'USE media_portal_db;' if it causes permission issues on RDS 
        // or ensure the DB exists. The schema has CREATE DATABASE IF NOT EXISTS.

        // Let's first ensure we can create/use the DB.
        // On RDS, usually you get a DB name in the connection string or you have to create it.
        // The schema tries to create it.

        await db.execute(schema);
        console.log('Database seeded successfully.');

        // await connection.end(); // Removed as per instruction
    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

seed();
