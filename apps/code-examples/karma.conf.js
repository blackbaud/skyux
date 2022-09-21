// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, '../../coverage/apps/code-examples'),
      // TODO: remove these threshold overrides to meet 100% coverage!
      check: {
        global: {
          statements: 80,
          branches: 81,
          functions: 72,
          lines: 77,
        },
      },
    },
  });

  console.log(config);
};
