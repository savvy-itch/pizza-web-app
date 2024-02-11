const { MongoMemoryServer } =  require('mongodb-memory-server');
const mongoose = require('mongoose');
const config = require('../config');
const jsonIngredients = require('../ingredients.json');
const Ingredient = require('../models/ingredient');
const Pizza = require('../models/pizza');

let mongoServer;
const pizzas = [
  {
    "title": "Cheese Lovers",
    "ingredients": [
      "6598f6b425f82811512c6ff9"
    ],
    "imgUrl": "../images/menu-pizza1.webp",
    "price": {
      "s": 10.25,
      "m": 12.30,
      "l": 14.75
    },
    "discount": 0
  },
  {
    "title": "Bacon Delight",
    "ingredients": [
      "6598f6b425f82811512c6ffa"
    ],
    "imgUrl": "../images/menu-pizza2.webp",
    "price": {
      "s": 12.25,
      "m": 14.00,
      "l": 15.82
    },
    "discount": 10
  }
];

module.exports = async function globalSetup() {
  if (config.Memory) {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      (global).__MONGOINSTANCE = mongoServer;
      process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
    }
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${config.Database}`);
    await Ingredient.deleteMany();
    await Ingredient.create(jsonIngredients);
    await Pizza.deleteMany();
    await Pizza.create(pizzas);
  } catch (error) {
    console.log(error);
  }
};