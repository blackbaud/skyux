import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { joinPathFragments, offsetFromRoot } from '@nx/devkit';

export function skyE2ePreset(
  directory: string
): Partial<Cypress.PluginConfigOptions> {
  const offset = offsetFromRoot(directory);
  return {
    ...nxE2EPreset(directory),
    downloadsFolder: joinPathFragments(
      offset,
      'dist',
      'cypress',
      directory,
      'downloads'
    ),
    video: false,
    defaultCommandTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  };
}
