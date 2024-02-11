const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide pizza title'],
    maxlength: [30, 'Title cannot be more than 30 characters'],
    unique: [true, 'Pizza with title {VALUE} already exists']
  },
  price: {
    s: Number,
    m: Number,
    l: Number,
  },
  imgUrl: {
    type: String,
    required: [true, 'Please provide image url'],
  },
  ingredients: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Ingredient',
      required: [true, 'Please specify ingredients']
    },
  ],
  discount: Number,
})

module.exports = mongoose.model('Pizza', pizzaSchema);

// {
//   "id": 1,
//   "title": "Eatalian pizza",
//   "ingredients": "Dough, Mozzarella, Cheddar, Blue, Parmesan",
//   "imgUrl": "../images/menu-pizza1.webp",
//   "price":
//     {
//       "s":"10.25",
//       "m":"12.30",
//       "l":"14.75"
//     },
//   "discount": 0
// }