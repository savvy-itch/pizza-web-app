require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');

const pizzasRouter = require('./routes/pizzas');
const ingredientRouter = require('./routes/ingredients');
const emailRouter = require('./routes/sendEmail');

const errorMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const connectDB = require('./db/connect');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// CHECK IF CORS SHOULD BE REMOVED BEFORE DEPLOYMENT
app.use(cors());

app.use('/api/pizzas', pizzasRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/form', emailRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();