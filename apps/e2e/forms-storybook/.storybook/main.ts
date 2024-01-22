import type { StorybookConfig } from '@storybook/angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootMain } from '../../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,
  stories: [
    ...rootMain.stories,
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
};
export default config;
