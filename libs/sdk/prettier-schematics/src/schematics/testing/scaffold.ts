import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/cli';

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
    version: VERSION.major,
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
      version: VERSION.major,
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
