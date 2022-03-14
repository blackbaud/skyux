const getBaseKarmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();

  config.set({
    ...baseConfig,
    client: {
      ...baseConfig.client,
      captureConsole: false,
    },
    reporters: ['dots'],
    autoWatch: false,
    browsers: ['ChromeHeadless_flags'], // Fallback browser in case env variables not set.
    customLaunchers: {
      ChromeHeadless_flags: {
        base: 'ChromeHeadless',
        flags: ['--disable-extensions', '--disable-gpu', '--no-sandbox'],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
  });

  // Tell karma to wait for bundle to be completed before launching browsers.
  // See: https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-986661937
  config.plugins.unshift(require('./plugins/karma.waitwebpack'));
  config.frameworks.unshift('waitwebpack');
};
