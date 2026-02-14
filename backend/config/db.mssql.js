const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // For AWS RDS (usually required)
        trustServerCertificate: true // Change to false for production with valid certs
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL Database...');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// Helper to handle named parameters
const execute = async (query, params = []) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Convert ? placeholders to @p0, @p1, etc.
        let paramIndex = 0;
        const convertedQuery = query.replace(/\?/g, () => {
            const paramName = `p${paramIndex}`;
            request.input(paramName, params[paramIndex]);
            paramIndex++;
            return `@${paramName}`;
        });

        // Handle RETURNING id for INSERTs (SQLite/MySQL pattern) by appending SCOPE_IDENTITY()
        // But for generic usage, we might just run the query. 
        // If it's an INSERT, we often want the ID. 
        // Existing code expects: [ { insertId: ..., affectedRows: ... }, fields ]

        let finalQuery = convertedQuery;
        const isInsert = query.trim().toUpperCase().startsWith('INSERT');

        if (isInsert) {
            finalQuery += '; SELECT SCOPE_IDENTITY() AS insertId;';
        }

        const result = await request.query(finalQuery);

        if (isInsert) {
            // Mocking MySQL2 return format for INSERT
            const insertId = result.recordset && result.recordset[0] ? result.recordset[0].insertId : 0;
            return [{ insertId: insertId, affectedRows: result.rowsAffected[0] }, []];
        }

        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        if (isSelect) {
            // Mocking MySQL2 return format for SELECT: [rows, fields]
            return [result.recordset, []];
        }

        // For UPDATE/DELETE
        return [{ affectedRows: result.rowsAffected[0] }, []];

    } catch (err) {
        throw err;
    }
};

// Initialize Schema (Optional - usually done via script, but keeping for consistency)
const initSchema = async () => {
    try {
        const pool = await poolPromise;
        const schemaPath = path.resolve(__dirname, '../database/schema.mssql.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by 'GO' if necessary, but for our simple schema it might work as one block or split by statement
        // T-SQL scripts often use GO. Our schema doesn't use GO, but has multiple chunks.
        // MSSQL driver executes one batch.
        await pool.request().query(schema);
        console.log("MSSQL Schema initialized.");
    } catch (err) {
        // Ignore if headers already sent or harmless errors, but log
        console.log("Schema init error (tables might already exist):", err.message);
    }
};

// Auto-run schema init if connected
// setTimeout(initSchema, 3000); 

module.exports = {
    execute,
    initSchema // Exporting if we want to run manually
};
