import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Schema } from '@schematics/angular/ng-new/schema';

function getAngularVersion(): string {
  // Use require for compatibility with Jest/CommonJS
  const { version } = require('@angular/cli/package.json');
  return version;
}

const ANGULAR_VERSION = getAngularVersion();

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
    version: ANGULAR_VERSION,
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
      version: ANGULAR_VERSION,
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
