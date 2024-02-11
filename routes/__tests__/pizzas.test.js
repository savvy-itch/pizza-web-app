/**
 * @jest-environment node
*/

const request = require('supertest');
const express = require('express');
const globalSetup = require('../../test/globalSetup');
const globalTeardown = require('../../test/globalTeardown');
const app = express();
const pizzasRouter = require('../pizzas');

app.use('/api/pizzas', pizzasRouter);

beforeAll(async () => globalSetup());

describe('pizzas route works', () => {
  test('returns correct status and content type', async () => {
    const response = await request(app).get('/api/pizzas');
  
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch(/json/);
  });

  test('default query returns all pizzas', async () => {
    const response = await request(app).get('/api/pizzas');

    expect(response.body.pizzas.length).toBe(response.body.totalAmount);
  });

  test('query w/ price filter returns pizzas within the range', async () => {
    const priceFilter = 13;
    const response = await request(app).get(`/api/pizzas/?numericFilters=price.m>=${priceFilter}`);

    for (const item of response.body.pizzas) {
      expect(item.price.m).toBeGreaterThan(priceFilter);
    }
  });

  test('only returns pizzas w/ discount', async () => {
    const response = await request(app).get('/api/pizzas/?numericFilters=discount>0');

    for (const item of response.body.pizzas) {
      expect(item.discount).toBeGreaterThan(0);
    }
  });

  test('only returns pizzas with selected components', async () => {
    const selectedIngredient = 'Cheese';
    const response = await request(app).get(`/api/pizzas/?ingredients=${selectedIngredient}`);
    
    for (const item of response.body.pizzas) {
      expect(item.ingredients.some(ingredient => ingredient.name === selectedIngredient)).toBeTrue();
    }
  });

  test('query w/ no matches returns empty array', async () => {
    const response = await request(app).get('/api/pizzas/?numericFilters=price.m>=1000');

    expect(response.body.pizzas.length).toBe(0);
  })
});

afterAll(async () => globalTeardown());