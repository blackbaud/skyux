const getBrowserStackLaunchers = require('./utils/browsers');

const applySharedKarmaConfig = require('./karma.shared.conf');

module.exports = function (config) {
  applySharedKarmaConfig(config);

  // Don't run coverage for BrowserStack tests.
  delete config.coverageReporter;

  if (process.env.BROWSER_STACK_ACCESS_KEY) {
    const tunnelIdentifier = `browserstack_tunnel_${new Date().getTime()}`;
    const customLaunchers = getBrowserStackLaunchers();

    config.set({
      customLaunchers,
      browsers: Object.keys(customLaunchers),

      browserStack: {
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        username: process.env.BROWSER_STACK_USERNAME,
        name: 'test-affected',
        project: 'ci',
        enableLoggingForApi: true,
        startTunnel: true,
        forceLocal: true,
        timeout: 1800,
        tunnelIdentifier,
        video: false,
      },

      // Try Websocket for a faster transmission first. Fallback to polling if necessary.
      transports: ['websocket', 'polling'],

      browserDisconnectTolerance: 2,
    });

    config.plugins.push(require('karma-browserstack-launcher'));

    // Create a custom plugin to log the BrowserStack session.
    config.reporters.push('blackbaud-browserstack');
    config.plugins.push({
      'reporter:blackbaud-browserstack': [
        'type',
        function (/* BrowserStack:sessionMapping */ sessions) {
          this.onBrowserComplete = (browser) =>
            console.log(`

  ****************************************************************************************************
   Visit the following URL to view your BrowserStack results:
   https://app.blackbaud.com/browserstack/sessions/${sessions[browser.id]}
  ****************************************************************************************************

  `);
        },
      ],
    });
  } else {
    console.warn(
      `

********************************************************************************
 [!] A BrowserStack access key was not defined in the environment.
     --> Tests will still be run in ChromeHeadless but this could be a problem.
********************************************************************************

`
    );
  }
};
