import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

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
    defaultProjectName: string;
  },
): Promise<UnitTestTree> {
  return await runner.runExternalSchematic('@schematics/angular', 'ng-new', {
    directory: '/',

    name: appOptions.defaultProjectName,
    routing: true,
    strict: true,
    style: 'scss',
    version: ANGULAR_VERSION,
  });
}

/**
 * Create a test workspace with a library as the default project.
 */
export async function createTestLibrary(
  runner: SchematicTestRunner,
  libOptions: {
    name: string;
  },
): Promise<UnitTestTree> {
  const workspaceTree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: `${libOptions.name}-workspace`,
      createApplication: false,
      strict: true,
      version: ANGULAR_VERSION,
    },
  );

  await runner.runExternalSchematic(
    '@schematics/angular',
    'library',
    {
      name: libOptions.name,
    },
    workspaceTree,
  );

  return workspaceTree;
}
