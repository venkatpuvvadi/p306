const mysql = require('mysql2/promise');

async function probe() {
    const configs = [
        { host: 'localhost', user: 'root', password: '' },
        { host: 'localhost', user: 'root', password: 'password' },
        { host: 'localhost', user: 'root', password: 'root' },
        { host: '127.0.0.1', user: 'root', password: '' }
    ];

    for (const config of configs) {
        try {
            console.log(`Trying ${config.host} user=${config.user} pass=${config.password}...`);
            const conn = await mysql.createConnection(config);
            console.log('SUCCESS:', JSON.stringify(config));
            await conn.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
    console.log('ALL FAILED');
    process.exit(1);
}

probe();
