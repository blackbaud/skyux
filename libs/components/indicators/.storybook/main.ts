import { StorybookConfig } from '@storybook/core-common';

import * as rootMainImport from '../../../../.storybook/main';

const rootMain = rootMainImport as StorybookConfig;

module.exports = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
