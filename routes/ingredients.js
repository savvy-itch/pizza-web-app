const express = require('express');
const { createIngredient, getAllIngredients } = require('../controllers/ingredients');
const router = express.Router();

router.route('/').get(getAllIngredients).post(createIngredient);

module.exports = router;