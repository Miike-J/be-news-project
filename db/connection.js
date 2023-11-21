const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let connectionString;

// Check if in a testing environment
if (process.env.NODE_ENV === 'test') {
  console.log('In testing environment');
  // Specify the path to the folder containing test data files
  const testDataFolderPath = path.resolve(__dirname, 'test-data-folder');
  const indexFilePath = path.join(testDataFolderPath, 'index.js');

  try {
    // Require the index file dynamically
    const indexData = require(indexFilePath);

    // Process each exported data file
    for (const key in indexData) {
      if (Object.hasOwnProperty.call(indexData, key)) {
        const data = indexData[key];
        console.log(`Test data from ${key}:`, data);

        // Extract the connection string if available
        if (data.connection && data.connection.connectionString) {
          connectionString = data.connection.connectionString;
          console.log('Connection string set for testing:', connectionString);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading index file ${indexFilePath}:`, error.message);
    // Handle the error as needed
  }
}

// If not in a testing environment, check for Clever Cloud environment
if (process.env.NODE_ENV === 'production') {
  console.log('In production environment');
  connectionString = process.env.POSTGRESQL_ADDON_URI;
  console.log('Connection string set for Clever Cloud:', connectionString);
}

console.log(connectionString, process.env.NODE_ENV)

if (!connectionString) {
  console.error('Database connection string not set', process.env.NODE_ENV, "beans");
  throw new Error('Database connection string not set');
}

const config = {
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
};

module.exports = new Pool(config);
