import type { StorybookConfig } from '@storybook/angular';

import { rootMain } from '../../../..//.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../src/assets'],
};

export default config;
