const Ingredient = require("../models/ingredient");

const getAllIngredients = async (req, res) => {
  const ingredients = await Ingredient.find({});
  res.status(200).json({ ingredients, nbHits: ingredients.length });
}

const createIngredient = async (req, res) => {
  res.send('Create Ingredient');
}

module.exports = {
  getAllIngredients,
  createIngredient
}