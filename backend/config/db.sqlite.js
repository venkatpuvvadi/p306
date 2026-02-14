const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database/media_portal.sqlite');
const schemaPath = path.resolve(__dirname, '../database/schema.sqlite.sql');

// Ensure database file exists
const db = new sqlite3.Database(dbPath);

// Initialize Schema
const schemaFn = () => {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) console.error("Schema initialization failed:", err);
        else console.log("SQLite Database initialized.");
    });
};

schemaFn();

const pool = {
    execute: (sql, params) => {
        return new Promise((resolve, reject) => {
            // MySQL uses ? for safe parameters, SQLite does too.
            // Check if it is a SELECT or other query
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

            if (isSelect) {
                db.all(sql, params || [], (err, rows) => {
                    if (err) return reject(err);
                    resolve([rows, []]); // Match MySQL2 return signature [rows, fields]
                });
            } else {
                db.run(sql, params || [], function (err) {
                    if (err) return reject(err);
                    // 'this' contains lastID and changes
                    resolve([{ insertId: this.lastID, affectedRows: this.changes }, []]);
                });
            }
        });
    },
    // Mock other pool methods if needed
    end: () => {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = pool;
