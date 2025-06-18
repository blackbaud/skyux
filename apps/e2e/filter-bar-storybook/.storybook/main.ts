import type { StorybookConfig } from '@storybook/types';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootMain } from '../../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: ['../src/app/**/*.stories.@(js|ts)'],
};

export default config;
