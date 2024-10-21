/**
 * Transpile the skyux-eslint project so it can be consumed by a JavaScript
 * eslint.config.js file.
 */
require('ts-node').register({
  project: 'libs/sdk/skyux-eslint/tsconfig.json',
  swc: true,
});

const skyuxEslint = require('../../libs/sdk/skyux-eslint/src/index.ts');

module.exports = skyuxEslint.default;
