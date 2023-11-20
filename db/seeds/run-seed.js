const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  console.log('>>>>>>>>>>>>>>>>>>>>RUNNING<<<<<<<<<<<<<<<<<<')
  return seed(devData)
    .then(() => db.end())
    .catch((err) => {
      console.error('Error running seed:', err);
      // Handle the error appropriately, e.g., exit the process or log it
      process.exit(1);
    });
};

runSeed();