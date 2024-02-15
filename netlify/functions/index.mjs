import express from 'express';
import serverless from 'serverless-http';
import pizzasRouter from '../../routes/pizzas.js';
import ingredientRouter from '../../routes/ingredients.js';
import emailRouter from '../../routes/sendEmail.js';

const app = express();

app.use('/api/pizzas', pizzasRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/form', emailRouter);

export const handler = serverless(app);