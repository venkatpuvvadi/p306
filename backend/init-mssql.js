const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: 'master', // Connect to master first
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const targetDbName = process.env.DB_NAME || 'p306';

const runInit = async () => {
    try {
        // 1. Connect to master
        console.log(`Connecting to ${dbConfig.server} as ${dbConfig.user}...`);
        const pool = await new sql.ConnectionPool(dbConfig).connect();

        // 2. Create Database if not exists
        console.log(`Checking if database '${targetDbName}' exists...`);
        const result = await pool.request().query(`SELECT name FROM master.dbo.sysdatabases WHERE name = '${targetDbName}'`);

        if (result.recordset.length === 0) {
            console.log(`Database '${targetDbName}' does not exist. Creating...`);
            await pool.request().query(`CREATE DATABASE [${targetDbName}]`);
            console.log(`Database '${targetDbName}' created.`);
        } else {
            console.log(`Database '${targetDbName}' already exists.`);
        }

        await pool.close();

        // 3. Reconnect to the new database
        console.log(`Connecting to '${targetDbName}'...`);
        const appDbConfig = { ...dbConfig, database: targetDbName };
        const appPool = await new sql.ConnectionPool(appDbConfig).connect();

        // 4. Run Schema Script
        console.log("Initializing Schema...");
        const schemaPath = path.resolve(__dirname, 'database/schema.mssql.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by 'GO' (case insensitive, on its own line)
        const batches = schema.split(/^\s*GO\s*$/im);

        for (const batch of batches) {
            const sql = batch.trim();
            if (sql) {
                try {
                    console.log("Executing batch...");
                    await appPool.request().query(sql);
                } catch (batchErr) {
                    console.error("Error executing batch:", batchErr.message);
                    console.error("SQL:", sql);
                    // Decide if we should throw or continue. For now, let's continue but verify at end.
                }
            }
        }

        console.log("Schema script execution completed.");

        // 5. Verification
        console.log("Verifying tables...");
        const tableCheck = await appPool.request().query(`SELECT name FROM sys.tables`);
        console.log("Tables found:", tableCheck.recordset.map(r => r.name));

        await appPool.close();
        process.exit(0);
    } catch (err) {
        console.error("Initialization Failed:", err);
        process.exit(1);
    }
};

runInit();
