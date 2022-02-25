module.exports = function (config) {
  const applyLibraryKarmaConfig = require('../karma.conf');
  applyLibraryKarmaConfig(config);

  config.coverageReporter.dir = require('path').join(
    __dirname,
    '../../../../coverage/libs/components/lists/testing'
  );

  // TODO: remove these threshold overrides to meet 100% coverage!
  config.coverageReporter.check = {
    global: { statements: 99, branches: 87, functions: 99, lines: 99 },
  };
};
