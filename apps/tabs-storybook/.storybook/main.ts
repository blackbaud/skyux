import { StorybookConfig } from '@storybook/core-common';

import * as rootMainImport from '../../../.storybook/main';

const rootMain = rootMainImport as StorybookConfig;

module.exports = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
