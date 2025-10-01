import fs from 'fs-extra';
import path from 'node:path';

export function captureIconNamesToFile(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): void {
  on('task', {
    skyCaptureIconNamesToFile(data: {
      test: string;
      file: string;
      iconNames: string[];
    }) {
      if (data.iconNames.length > 0) {
        const outputPath = config.screenshotsFolder || config.downloadsFolder;
        const baseName =
          'sky-icon-names-' + path.basename(data.file).replaceAll('.', '-');
        const matchingFiles = fs
          .readdirSync(outputPath || '.')
          .filter((f) => f.startsWith(baseName) && f.endsWith('.json'));
        const suffix =
          matchingFiles.length > 0 ? `-${matchingFiles.length + 1}` : '';
        const outputFile = path.join(outputPath, `${baseName}${suffix}.json`);
        fs.writeJsonSync(outputFile, data, { spaces: 2 });
        console.log(`Captured icon names to ${outputFile}`);
      }
      return null;
    },
  });
}
