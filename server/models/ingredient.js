const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  imgUrl: String,
  price: Number
});

module.exports = mongoose.model('Ingredient', ingredientSchema);