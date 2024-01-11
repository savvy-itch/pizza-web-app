require('dotenv').config();

const connectDB = require('./db/connect');
const Pizza = require('./models/pizza');

const jsonPizzas = require('./menu.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Pizza.deleteMany();
    await Pizza.create(jsonPizzas);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();