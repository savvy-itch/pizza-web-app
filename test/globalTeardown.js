const { MongoMemoryServer } =  require('mongodb-memory-server');
const config = require('../config');

module.exports = async function globalTeardown() {
  if (config.Memory) {
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
  }
};