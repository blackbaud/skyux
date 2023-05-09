import type { StorybookConfig } from '@storybook/angular';

const frameworkName: '@storybook/angular' = '@storybook/angular';
export const framework = {
  name: frameworkName,
  options: {},
};
export const docs = {
  autodocs: true,
};
export const rootMain: StorybookConfig = {
  stories: [],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    // '@storybook/addon-backgrounds',
    // '@storybook/addon-docs',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    'storybook-addon-angular-router',
  ],
  framework: framework,
  features: {
    buildStoriesJson: true,
  },
};
