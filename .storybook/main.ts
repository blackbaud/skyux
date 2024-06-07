import { DocsOptions, Preset, StorybookConfig } from '@storybook/types';

export const framework: Preset = {
  name: '@storybook/angular',
  options: {},
};
export const docs: DocsOptions = {
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
  ],
  docs: docs,
  framework: framework,
  features: {},
  // Workaround for https://github.com/storybookjs/storybook/issues/23883
  previewHead: (head, _options) =>
    Promise.resolve(`
      ${head}
      <script>
        window.beforeEach = window.beforeEach || (() => {});
        window.afterEach = window.afterEach || (() => {});
      </script>
    `),
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
};
