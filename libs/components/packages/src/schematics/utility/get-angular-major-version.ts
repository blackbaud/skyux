import fs from 'node:fs';
import { createRequire } from 'node:module';

/**
 * Get the currently installed version of Angular.
 * Use `require` to satisfy Jest when importing from @angular/cli ESM module.
 */
export function getAngularMajorVersion(): string {
  const require = createRequire(__filename);

  try {
    const angularCliPackagePath = require.resolve('@angular/cli/package.json');
    const angularCliPackage = JSON.parse(
      fs.readFileSync(angularCliPackagePath, 'utf8'),
    );

    return angularCliPackage.version.split('.')[0];
  } catch {
    throw new Error(
      'Unable to determine Angular CLI version. Please ensure @angular/cli is installed.',
    );
  }
}
