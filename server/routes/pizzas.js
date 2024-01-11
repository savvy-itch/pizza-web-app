const express = require('express');
const { getAllPizzas, createPizza } = require('../controllers/pizzas');
const router = express.Router();

router.route('/').get(getAllPizzas).post(createPizza);

module.exports = router;