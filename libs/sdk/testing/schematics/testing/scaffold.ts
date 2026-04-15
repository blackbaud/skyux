import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Schema } from '@schematics/angular/ng-new/schema';
import fs from 'node:fs';
import { createRequire } from 'node:module';

/**
 * Creates a new Angular CLI application.
 */
export async function createTestApp(
  runner: SchematicTestRunner,
  appOptions: {
    projectName: string;
    options?: Partial<Schema>;
  },
): Promise<UnitTestTree> {
  const tree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: appOptions.projectName,
      routing: true,
      strict: true,
      style: 'scss',
      version: getAngularMajorVersion(),
      zoneless: false,
      ...appOptions.options,
    },
  );

  return tree;
}

/**
 * Create a test workspace with a library as the default project.
 */
export async function createTestLibrary(
  runner: SchematicTestRunner,
  libOptions: {
    projectName: string;
    options?: Partial<Schema>;
  },
): Promise<UnitTestTree> {
  const workspaceTree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: `${libOptions.projectName}-workspace`,
      createApplication: false,
      strict: true,
      version: getAngularMajorVersion(),
      zoneless: false,
      ...libOptions.options,
    },
  );

  await runner.runExternalSchematic(
    '@schematics/angular',
    'library',
    {
      name: libOptions.projectName,
    },
    workspaceTree,
  );

  // Create a "showcase" application for library projects.
  await runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      name: `${libOptions.projectName}-showcase`,
      zoneless: false,
    },
    workspaceTree,
  );

  return workspaceTree;
}

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
