import { stripIndent } from '@angular-devkit/core/src/utils/literals';
import utils from '@percy/sdk-utils';

import { readFileSync } from 'fs';

import { sendCypressScreenshotsToPercy } from './send-cypress-screenshots-to-percy';

jest.mock('@percy/sdk-utils', () => ({
  postSnapshot: jest.fn(),
}));
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('SendCypressScreenshotsToPercy', () => {
  let config: Cypress.PluginConfigOptions;

  beforeEach(() => {
    jest.resetModules();
    utils.postSnapshot.mockReset();
    (readFileSync as jest.Mock)
      .mockReset()
      .mockReturnValue('{ "version": "1.0.0" }');
    config = {
      env: {
        PERCY_SERVER_ADDRESS: 'http://localhost:1337',
      },
    } as unknown as Cypress.PluginConfigOptions;
  });

  it('should set up events for screenshots', () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith(
      'before:browser:launch',
      expect.any(Function),
    );
    expect(on).toHaveBeenCalledWith('after:screenshot', expect.any(Function));
  });

  it('should not set up events without percy server address', () => {
    const on = jest.fn();
    process.env['PERCY_SERVER_ADDRESS'] = '';
    config.env['PERCY_SERVER_ADDRESS'] = undefined;
    sendCypressScreenshotsToPercy(on, config);
    expect(readFileSync).not.toHaveBeenCalled();
  });

  it('should set up electron', () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(on).toHaveBeenCalledWith(
      'before:browser:launch',
      expect.any(Function),
    );
    const launchOptions = {
      preferences: {},
      args: [],
    };
    on.mock.calls[0][1]({ name: 'electron', isHeadless: true }, launchOptions);
    expect(launchOptions).toEqual({
      preferences: {
        width: 1920,
        height: 1600,
        deviceScaleFactor: 2,
      },
      args: [],
    });
  });

  it('should set up chrome', () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(on).toHaveBeenCalledWith(
      'before:browser:launch',
      expect.any(Function),
    );
    const launchOptions = {
      preferences: {},
      args: [],
    };
    on.mock.calls[0][1]({ name: 'chrome', isHeadless: true }, launchOptions);
    expect(launchOptions).toEqual({
      preferences: {},
      args: ['--window-size=1920,1600', '--force-device-scale-factor=2'],
    });
  });

  it('should set up firefox', () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(on).toHaveBeenCalledWith(
      'before:browser:launch',
      expect.any(Function),
    );
    const launchOptions = {
      preferences: {},
      args: [],
    };
    on.mock.calls[0][1]({ name: 'firefox', isHeadless: true }, launchOptions);
    expect(launchOptions).toEqual({
      preferences: {},
      args: ['--window-size=1920,1600'],
    });
  });

  it('should send a screenshot to percy', async () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(on).toHaveBeenCalledWith('after:screenshot', expect.any(Function));
    const details = {
      blackout: ['url:/example'],
      path: 'path/to/screenshot.png',
      dimensions: {
        width: 100,
        height: 100,
      },
    };
    const afterScreenshot = on.mock.calls[1][1];
    (readFileSync as jest.Mock).mockReturnValue('image data');
    await afterScreenshot(details);
    expect(utils.postSnapshot).toHaveBeenCalledWith({
      clientInfo: 'undefined/1.0.0',
      domSnapshot: stripIndent`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>undefined</title>
            <style>
              *, *::before, *::after { margin: 0; padding: 0; font-size: 0; }
              html, body { width: 100%; }
              img { max-width: 100%; }
            </style>
          </head>
          <body>
            <img
              id="root"
              alt="undefined"
              src="data:image/png;base64,image data"
              width="50"
              style="aspect-ratio: 100/100; opacity: 0.999;"
            />
          </body>
        </html>`,
      environmentInfo: 'cypress/undefined',
      name: undefined,
      scope: '#root',
      url: '/example',
    });
  });

  it('should not send a screenshot to percy without a url', async () => {
    const on = jest.fn();
    sendCypressScreenshotsToPercy(on, config);
    expect(on).toHaveBeenCalledWith('after:screenshot', expect.any(Function));
    const details = {
      blackout: [],
      path: 'path/to/screenshot.png',
      dimensions: {
        width: 100,
        height: 100,
      },
    };
    const afterScreenshot = on.mock.calls[1][1];
    await afterScreenshot(details);
    expect(utils.postSnapshot).not.toHaveBeenCalled();
  });
});
