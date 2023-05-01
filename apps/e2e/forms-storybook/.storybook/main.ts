import type { StorybookConfig } from '@storybook/core-common';

import { rootMain } from '../../../..//.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};

module.exports = config;
