const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(process.env.DB_CONNECTION_URL)

const connectionString = process.env.DB_CONNECTION_URL;

if (!connectionString) {
  throw new Error('DB_CONNECTION_URL');
}

const config = {
  connectionString: connectionString,
};

module.exports = new Pool(config);