const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// const mongoServer = MongoMemoryServer.create();
const createMongoServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  return mongoServer;
};

exports.dbConnect = async () => {
  const mongoServer = await createMongoServer();
  const uri = mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
  await mongoose.connect(uri, mongooseOpts);
};

exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}