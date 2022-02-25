module.exports = function (config) {
  const applyLibraryKarmaConfig = require('../karma.conf');
  applyLibraryKarmaConfig(config);

  config.coverageReporter.dir = require('path').join(
    __dirname,
    '../../../../coverage/libs/components/forms/testing'
  );

  // TODO: remove these threshold overrides to meet 100% coverage!
  config.coverageReporter.check = {
    global: { statements: 99, branches: 95, functions: 99, lines: 99 },
  };
};
