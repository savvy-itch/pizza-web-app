require('dotenv').config();

const connectDB = require('./db/connect');
const Ingredient = require('./models/ingredient');

const jsonIngredients = require('./ingredients.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Ingredient.deleteMany();
    await Ingredient.create(jsonIngredients);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();