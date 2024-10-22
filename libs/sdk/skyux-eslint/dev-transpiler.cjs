/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path');

/**
 * Transpile the 'skyux-eslint' project so it can be consumed by an
 * eslint.config.js file.
 */
require('ts-node').register({
  project: path.join(__dirname, './tsconfig.json'),
  swc: true,
});

const skyuxEslint = require('./src/index.ts');

module.exports = skyuxEslint.default;
