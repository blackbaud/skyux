import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import utils from '@percy/sdk-utils';

import { defineConfig } from 'cypress';
import fs from 'fs';

const sdkPkg = JSON.parse(
  fs.readFileSync('../../node_modules/@percy/sdk-utils/package.json').toString()
);
const cypressPkg = JSON.parse(
  fs.readFileSync('../../node_modules/cypress/package.json').toString()
);

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    video: false,
    setupNodeEvents: (on, config) => {
      // Use a large window size so screenshots fit within the viewport. If the browser isn't resized, Cypress scrolls
      // and stitches screenshots together.
      on('before:browser:launch', (browser, launchOptions) => {
        const width = 1920;
        const height = 1600;

        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push(`--window-size=${width},${height}`);
          launchOptions.args.push('--force-device-scale-factor=2');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-setuid-sandbox');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          launchOptions.preferences.width = width;
          launchOptions.preferences.height = height;
          launchOptions.preferences.deviceScaleFactor = 2;
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
          launchOptions.args.push(`--window-size=${width},${height}`);
        }

        return launchOptions;
      });

      // Hook into Cypress's screenshot and hand that image off to Percy.
      on(
        'after:screenshot',
        async (
          details: Cypress.ScreenshotDetails
        ): Promise<Cypress.AfterScreenshotReturnObject> => {
          const url = (
            details.blackout.find((item) => item.startsWith('url:')) || ''
          ).substring(4);
          if (process.env.PERCY_SERVER_ADDRESS && url) {
            const imageDataBase64 = fs
              .readFileSync(details.path)
              .toString('base64');
            const { width, height } = details.dimensions;
            // This HTML wrapper for the image works like `npx percy upload`, but having our own copy allows control
            // over the snapshot names. Inlining the image source is easier than managing multiple resources.
            const domSnapshot = `<!doctype html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <title>${details.name}</title>
                <style>
                  *, *::before, *::after { margin: 0; padding: 0; font-size: 0; }
                  html, body { width: 100%; }
                  img { max-width: 100%; }
                </style>
              </head>
              <body>
                <img
                  id="root"
                  alt="${details.name}"
                  src="data:image/png;base64,${imageDataBase64}"
                  width="${width / 2}"
                  style="aspect-ratio: ${width}/${height};"
                />
              </body>
            </html>`;
            await utils.postSnapshot({
              name: details.name,
              url,
              domSnapshot,
              clientInfo: `${sdkPkg.name}/${sdkPkg.version}`,
              environmentInfo: `cypress/${cypressPkg.version}`,
              scope: '#storybook-root',
            });
          }
          return {
            path: details.path,
            size: details.size,
            dimensions: details.dimensions,
          };
        }
      );
    },
  },
});
