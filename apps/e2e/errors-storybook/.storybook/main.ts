import type { StorybookConfig } from 'storybook/internal/types';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { rootMain } from '../../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: ['../src/app/**/*.stories.@(js|ts)'],
  staticDirs: ['../src/assets'],
};

export default config;
