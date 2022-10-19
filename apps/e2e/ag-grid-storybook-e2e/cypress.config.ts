import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { isPercyEnabled } from '@percy/sdk-utils';

import { spawn } from 'child_process';
import { defineConfig } from 'cypress';
import * as fs from 'fs';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import * as os from 'os';
import * as path from 'path';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    video: false,
    setupNodeEvents: (on, config) => {
      // Use a large window size so screenshots fit within the viewport.
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

      const snapshotDotYml = config.screenshotsFolder + '/percy-snapshots.yml';
      on('before:run', async () => {
        if (!config.screenshotsFolder) {
          return;
        }
        fs.mkdirSync(config.screenshotsFolder, { recursive: true });
        fs.writeFileSync(snapshotDotYml, `snapshots:${os.EOL}`);
      });
      on('after:screenshot', (details: Cypress.ScreenshotDetails) => {
        if (!config.screenshotsFolder) {
          return;
        }
        const htmlFile = details.path.replace('.png', '.html');
        const relativePath = path.relative(config.screenshotsFolder, htmlFile);
        const imageUrl = path.basename(details.path);
        const html = `
        <!doctype html>
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
              alt="${details.name}"
              src="${imageUrl}"
              width="${details.dimensions.width}px"
              style="aspect-ratio: ${details.dimensions.width}/${details.dimensions.height};"
            />
          </body>
        </html>`;
        fs.writeFileSync(htmlFile, html);
        fs.appendFileSync(
          snapshotDotYml,
          `  - name: ${details.name}${os.EOL}    url: ${relativePath}${os.EOL}`
        );
      });
      on('after:run', async () => {
        if (isPercyEnabled()) {
          if (!config.screenshotsFolder) {
            console.warn(`Screenshots folder not set.`);
            return;
          }
          const localhost = createServer((req, res) => {
            const filePath = path.join(`${config.screenshotsFolder}`, req.url);
            fs.readFile(filePath, (err, data) => {
              if (err) {
                res.statusCode = 404;
                res.end(`File ${filePath} not found!`);
                return;
              }
              res.end(data);
            });
          });
          try {
            localhost
              .listen()
              .on('error', (err) => {
                console.error(`[http error] ${err}`);
              })
              .on('listening', () => {
                const port = (localhost.address() as AddressInfo).port;
                console.log(
                  `Loading Percy snapshots from http://localhost:${port}`
                );
                const percy = spawn(
                  'npx',
                  [
                    'percy',
                    'snapshot',
                    '--base-url',
                    `http://localhost:${port}/`,
                    snapshotDotYml,
                  ],
                  {
                    stdio: 'inherit',
                    shell: true,
                  }
                );
                percy.on('close', () => localhost.close());
                percy.on('disconnect', () => localhost.close());
                percy.on('exit', () => localhost.close());
              });
            await new Promise((resolve) => localhost.on('close', resolve));
          } catch (err) {
            console.error(err);
          }
        }
      });
    },
  },
});
