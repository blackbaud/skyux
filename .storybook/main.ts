import * as fs from 'node:fs';
import * as path from 'node:path';
import { DocsOptions, Preset, StorybookConfig } from 'storybook/internal/types';

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
  addons: ['@storybook/addon-a11y'],
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
  previewBody: (body, _options) => {
    const iconsSprite = path.join(
      __dirname,
      '../dist/skyux-icons/assets/svg/skyux-icons.svg',
    );
    if (fs.existsSync(iconsSprite)) {
      const svg = fs.readFileSync(iconsSprite, 'utf8');
      return `${svg}\n${body}`;
    }
    return body;
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
};
