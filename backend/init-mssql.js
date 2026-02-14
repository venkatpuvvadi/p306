const { initSchema } = require('./config/db.mssql');

console.log("Initializing MSSQL Schema...");
initSchema()
    .then(() => {
        console.log("Schema initialization complete.");
        process.exit(0);
    })
    .catch(err => {
        console.error("Schema initialization failed:", err);
        process.exit(1);
    });
