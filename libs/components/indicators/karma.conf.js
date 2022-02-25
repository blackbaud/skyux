// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, '../../../coverage/libs/components/indicators'),
      // TODO: remove these threshold overrides to meet 100% coverage!
      check: {
        global: { statements: 99, branches: 98, functions: 99, lines: 99 },
      },
    },
  });
};
