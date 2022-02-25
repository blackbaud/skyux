module.exports = function (config) {
  const applyLibraryKarmaConfig = require('../karma.conf');
  applyLibraryKarmaConfig(config);

  config.coverageReporter.dir = require('path').join(
    __dirname,
    '../../../../coverage/libs/components/popovers/testing'
  );

  // TODO: remove these threshold overrides to meet 100% coverage!
  config.coverageReporter.check = {
    global: { statements: 87, branches: 69, functions: 99, lines: 87 },
  };
};
