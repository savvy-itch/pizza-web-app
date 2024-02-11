import '@testing-library/jest-dom';
// const util = require('util');
import {TextEncoder, TextDecoder} from 'node:util';
// const mongoose = require('mongoose');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// beforeAll(async () => {
//   await mongoose.connect(process.env['MONGO_URI']);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
// });