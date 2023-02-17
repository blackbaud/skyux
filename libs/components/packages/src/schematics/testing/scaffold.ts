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
    projectName: string;
  }
): Promise<UnitTestTree> {
  return await runner.runExternalSchematic('@schematics/angular', 'ng-new', {
    directory: '/',
    name: appOptions.projectName,
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
    projectName: string;
  }
): Promise<UnitTestTree> {
  const workspaceTree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: `${libOptions.projectName}-workspace`,
      createApplication: false,
      strict: true,
      version: VERSION.major,
    }
  );

  await runner.runExternalSchematic(
    '@schematics/angular',
    'library',
    {
      name: libOptions.projectName,
    },
    workspaceTree
  );

  // Create a "showcase" application for library projects.
  await runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      name: `${libOptions.projectName}-showcase`,
    },
    workspaceTree
  );

  return workspaceTree;
}
