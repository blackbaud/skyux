import fs from 'node:fs';
import path from 'node:path';

/**
 * Get the currently installed version of SKY UX.
 */
export function getSkyuxVersion(): string {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../package.json'), {
      encoding: 'utf-8',
    }),
  );

  return packageJson.version;
}
