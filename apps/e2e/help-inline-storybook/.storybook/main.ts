import type { StorybookConfig } from '@storybook/types';

import { rootMain } from '../../../..//.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: ['../src/app/**/*.stories.@(js|ts)'],
};

export default config;
