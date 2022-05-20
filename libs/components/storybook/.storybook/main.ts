import { StorybookConfig } from '@storybook/core-common';

import * as rootMainImport from '../../../../.storybook/main';

const rootMain = rootMainImport as StorybookConfig;

module.exports = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../../*/src/lib/**/*.stories.mdx',
    '../../*/src/lib/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../../apps/*-showcase/src/app/**/*.stories.mdx',
    '../../../../apps/*-showcase/src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
