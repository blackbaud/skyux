import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { joinPathFragments, offsetFromRoot } from '@nx/devkit';

export function skyE2ePreset(
  directory: string,
  options: Partial<Cypress.PluginConfigOptions> = {},
): Partial<Cypress.PluginConfigOptions> {
  const offset = offsetFromRoot(directory);

  return {
    ...nxE2EPreset(directory),
    downloadsFolder: joinPathFragments(
      offset,
      'dist',
      'cypress',
      directory,
      'downloads',
    ),
    video: false,
    defaultCommandTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    ...options,
    setupNodeEvents: async (on, config): Promise<void> => {
      if (options.setupNodeEvents) {
        await options.setupNodeEvents(on, config);
      }

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--window-size=1280,1280');
          launchOptions.args.push('--force-device-scale-factor=2');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          // fullPage screenshot size is 1400x1200
          launchOptions.preferences['width'] = 1280;
          launchOptions.preferences['height'] = 1280;
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
          launchOptions.args.push('--width=1280');
          // Includes the toolbar.
          launchOptions.args.push('--height=1350');
        }

        return launchOptions;
      });
    },
  };
}
