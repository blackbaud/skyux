import type { StorybookConfig } from '@storybook/angular';
import type { DocsOptions } from '@storybook/types';

const frameworkName: '@storybook/angular' = '@storybook/angular';
export const framework = {
  name: frameworkName,
  options: {},
};
export const docs: DocsOptions = {
  autodocs: false,
  docsMode: false,
  defaultName: 'Documentation',
};
export const rootMain: StorybookConfig = {
  stories: [],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    // '@storybook/addon-backgrounds',
    // '@storybook/addon-docs',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    'storybook-addon-angular-router',
  ],
  docs: docs,
  framework: framework,
  features: {
    buildStoriesJson: true,
  },
  // Workaround for https://github.com/storybookjs/storybook/issues/23883
  previewHead: (head: string) => `
    ${head}
    <script>
      window.beforeEach = window.beforeEach || (() => {});
      window.afterEach = window.afterEach || (() => {});
    </script>
  `,
};
