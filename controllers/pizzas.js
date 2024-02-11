const Pizza = require("../models/pizza");
const Ingredient = require('../models/ingredient');
const { StatusCodes } = require('http-status-codes');

const getAllPizzas = async (req, res) => {
  const { sort, ingredients, numericFilters } = req.query;
  const queryObject = {};

  if (ingredients) {
    const ingredientNames = ingredients.split(',');
    const ingredientIds = await Ingredient.find({ name: { $in: ingredientNames } }, '_id');
    queryObject.ingredients = { $all: ingredientIds };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ['price.m', 'discount'];
    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        // create range for price filter, e.g. ({ 'price.m': { '$gte': 11, '$lte': 12 } })
        if (field === 'price.m' && queryObject[field]) {
          queryObject[field][operator] = Number(value);
        } else {
          queryObject[field] = { [operator]: Number(value) };
        }
      }
    });
  }

  let result = Pizza.find(queryObject).populate({path: 'ingredients', select: '_id name'});

  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('title');
  }

  const totalAmount = await Pizza.countDocuments(queryObject);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 11;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const pizzas = await result;
  res.status(200).json({ pizzas, page, amount: pizzas.length, totalAmount, skip });
}

// FOR ADMINS ONLY!
const createPizza = async (req, res) => {
  const pizza = await Pizza.create(req.body);
  res.status(StatusCodes.CREATED).json({ pizza });
}

module.exports = {
  getAllPizzas,
  createPizza
}