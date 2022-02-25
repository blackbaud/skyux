import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

/**
 * Creates a new Angular CLI application.
 */
export async function createTestApp(
  runner: SchematicTestRunner,
  appOptions: {
    defaultProjectName: string;
  }
): Promise<UnitTestTree> {
  return await runner
    .runExternalSchematicAsync('@schematics/angular', 'ng-new', {
      directory: '/',
      legacyBrowsers: true,
      name: appOptions.defaultProjectName,
      routing: true,
      strict: true,
      style: 'scss',
      version: '12',
    })
    .toPromise();
}

/**
 * Create a test workspace with a library as the default project.
 */
export async function createTestLibrary(
  runner: SchematicTestRunner,
  libOptions: {
    name: string;
  }
): Promise<UnitTestTree> {
  const workspaceTree = await runner
    .runExternalSchematicAsync('@schematics/angular', 'ng-new', {
      directory: '/',
      name: `${libOptions.name}-workspace`,
      createApplication: false,
      strict: true,
      version: '12',
    })
    .toPromise();

  await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'library',
      {
        name: libOptions.name,
      },
      workspaceTree
    )
    .toPromise();

  return workspaceTree;
}
