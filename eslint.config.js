const prettier = require('eslint-config-prettier');
const baseConfig = require('./eslint-base.config');
const overrides = require('./eslint-overrides.config');

module.exports = [...baseConfig, ...overrides, prettier];
