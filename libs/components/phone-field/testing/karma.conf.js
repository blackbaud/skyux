module.exports = function (config) {
  const applyLibraryKarmaConfig = require('../karma.conf');
  applyLibraryKarmaConfig(config);

  config.coverageReporter.dir = require('path').join(
    __dirname,
    '../../../../coverage/libs/components/phone-field/testing'
  );

  // TODO: remove these threshold overrides to meet 100% coverage!
  config.coverageReporter.check = {
    global: { statements: 89, branches: 74, functions: 84, lines: 89 },
  };
};
