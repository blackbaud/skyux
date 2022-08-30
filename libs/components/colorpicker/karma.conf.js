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
      dir: join(__dirname, '../../../coverage/libs/components/colorpicker'),
      // TODO: remove these threshold overrides to meet 100% coverage!
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 98,
          lines: 100,
        },
      },
    },
  });
};
