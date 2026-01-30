// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const { constants } = require('karma');

module.exports = () => {
  return {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    middleware: ['fake-url'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      {
        'middleware:fake-url': [
          'factory',
          function () {
            // Middleware that avoids triggering 404s during tests that need to reference
            // image paths. Assumes that the image path will start with `/$`.
            // Credit: https://github.com/angular/components/blob/59002e1649123922df3532f4be78c485a73c5bc1/test/karma.conf.js
            return function (request, response, next) {
              if (request.url.indexOf('/$') === 0) {
                response.writeHead(200);
                return response.end();
              }

              next();
            };
          },
        ],
      },
    ],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--headless=new', '--window-size=1920,1080'],
      },
    },
    restartOnFileChange: true,
    client: {
      jasmine: {
        random: false,
      },
    },
    coverageReporter: {
      dir: join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'json-summary' },
        { type: 'text-summary' },
        { type: 'lcov', subdir: 'lcov-report' },
      ],
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: constants.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
  };
};
