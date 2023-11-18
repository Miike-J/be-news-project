const { Pool } = require('pg');
const connectionString = process.env.POSTGRESQL_ADDON_URI || process.env.PGDATABASE;

if (!connectionString) {
  throw new Error('POSTGRESQL_ADDON_URI or PGDATABASE not set');
}

const config = {
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
};

module.exports = new Pool(config);