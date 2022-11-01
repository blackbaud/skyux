import type { StorybookConfig } from '@storybook/core-common';

export const rootMain: StorybookConfig = {
  features: {
    buildStoriesJson: true,
  },
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
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs
  //   // Return the altered config
  //   return config;
  // },
  core: {
    builder: 'webpack5',
  },
};
