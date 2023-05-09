import type { StorybookConfig } from '@storybook/angular';

import { rootMain } from '../../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,
  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
export default config;
