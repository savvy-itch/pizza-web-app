/**
 * @jest-environment node
*/

const ingredients = require('../ingredients');
const request = require('supertest');
const express = require('express');
const globalSetup = require('../../test/globalSetup');
const globalTeardown = require('../../test/globalTeardown');
const app = express();

app.use('/api/ingredients', ingredients);

beforeAll(async () => globalSetup());

test('ingredients route works', async () => {
  const response = await request(app).get('/api/ingredients');

  expect(response.status).toBe(200);
  expect(response.header['content-type']).toMatch(/json/);
  expect(response.body.nbHits).toBeGreaterThan(0);
  expect(response.body.nbHits).toBe(response.body.ingredients.length);
});

afterAll(async () => globalTeardown());