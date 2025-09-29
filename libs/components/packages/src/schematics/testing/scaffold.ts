import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Schema } from '@schematics/angular/ng-new/schema';

import { getAngularMajorVersion } from '../utility/get-angular-major-version';

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
  return await runner.runExternalSchematic('@schematics/angular', 'ng-new', {
    directory: '/',
    name: appOptions.projectName,
    routing: true,
    strict: true,
    style: 'scss',
    version: getAngularMajorVersion(),
    ...appOptions.options,
  });
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
    },
    workspaceTree,
  );

  return workspaceTree;
}
