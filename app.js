require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const pizzasRouter = require('./routes/pizzas');
const ingredientRouter = require('./routes/ingredients');
const emailRouter = require('./routes/sendEmail');

const compression = require("compression");
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1* 60 * 1000,
  max: 20
})

const errorMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const connectDB = require('./db/connect');

const port = process.env.PORT || 3000;

app.use(compression());
app.use(helmet());
app.use(limiter);

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
    if (!mongoose.connection.readyState) {
      // Only connect to the database if not already connected
      await connectDB(process.env.MONGO_URI);
    }

    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();