var { Client } = require('pg');
var { config } = require('./config');


var ensureDatabase = async () => {
  var targetDb = config.dbName;
  var adminClient = new Client({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await adminClient.connect();
    console.log(`[DB Init] Connected to PostgreSQL server at ${config.dbHost}:${config.dbPort}`);
    var result = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (result.rowCount > 0) {
      console.log(`[DB Init] Database "${targetDb}" already exists. Skipping creation.`);
    } else {

      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(targetDb)) {
        throw new Error(
          `[DB Init] Unsafe database name detected: "${targetDb}". ` +
          'Only alphanumeric characters and underscores are allowed.'
        );
      }
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`[DB Init] Database "${targetDb}" did not exist � created successfully.`);
    }
  } catch (err) {
    // Distinguish between connection errors and other failures for clarity
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      console.error(
        `[DB Init] ERROR: Could not connect to PostgreSQL at ${config.dbHost}:${config.dbPort}. ` +
        'Is the server running? Check DB_HOST and DB_PORT in your .env file.'
      );
    } else {
      console.error('[DB Init] ERROR during database initialization:', err.message);
    }
    throw err;
  } finally {
    await adminClient.end();
  }
};

module.exports = { ensureDatabase };
