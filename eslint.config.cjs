const prettier = require('eslint-config-prettier');
const baseConfig = require('./eslint-base.config.cjs');
const overrides = require('./eslint-overrides.config.cjs');

module.exports = [...baseConfig, ...overrides, prettier];
