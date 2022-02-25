const applySharedKarmaConfig = require('./karma.shared.conf');

module.exports = function (config) {
  applySharedKarmaConfig(config);

  config.set({
    coverageReporter: {
      ...config.coverageReporter,
      dir: require('path').join(process.cwd(), './coverage/__test-affected'),
      check: {
        // TODO: remove these threshold overrides to meet 100% coverage!
        global: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  });
};
