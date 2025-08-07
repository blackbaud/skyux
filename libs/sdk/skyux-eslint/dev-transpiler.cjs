const path = require('node:path');

/**
 * Transpile the 'skyux-eslint' project so it can be consumed by an
 * eslint.config.js file.
 */
require('ts-node').register({
  transpileOnly: true,
  project: path.join(__dirname, './tsconfig.json'),
  swc: true,
});

const baseTsConfig = require('../../../tsconfig.base.json');

// Register paths from the base tsconfig.
require('tsconfig-paths').register({
  baseUrl: './',
  paths: baseTsConfig.compilerOptions.paths,
});

const skyuxEslint = require('./src/index.ts');

module.exports = skyuxEslint.default;
