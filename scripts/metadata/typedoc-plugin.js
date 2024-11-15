const path = require('node:path');

require('ts-node').register({
  project: path.join(__dirname, '../tsconfig.json'),
  swc: true,
});

const plugin = require('./typedoc-plugin.ts');

module.exports = {
  load: plugin.load,
};
