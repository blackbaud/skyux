import { Options, StorybookConfig } from '@storybook/core-common';

import * as rootMainImport from '../../../.storybook/main';

const rootMain = rootMainImport as StorybookConfig;

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },

  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons],
  webpackFinal: async (
    config,
    options: { configType: 'DEVELOPMENT' | 'PRODUCTION' | undefined }
  ) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, options as Options);
    }

    // add your own webpack tweaks if needed

    return config;
  },
};
