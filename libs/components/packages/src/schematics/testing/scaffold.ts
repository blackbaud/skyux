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
    projectName: string;
  }
): Promise<UnitTestTree> {
  return await runner
    .runExternalSchematicAsync('@schematics/angular', 'ng-new', {
      directory: '/',
      name: appOptions.projectName,
      routing: true,
      strict: true,
      style: 'scss',
      version: '14',
    })
    .toPromise();
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
  const workspaceTree = await runner
    .runExternalSchematicAsync('@schematics/angular', 'ng-new', {
      directory: '/',
      name: `${libOptions.projectName}-workspace`,
      createApplication: false,
      strict: true,
      version: '14',
    })
    .toPromise();

  await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'library',
      {
        name: libOptions.projectName,
      },
      workspaceTree
    )
    .toPromise();

  // Create a "showcase" application for library projects.
  await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name: `${libOptions.projectName}-showcase`,
      },
      workspaceTree
    )
    .toPromise();

  return workspaceTree;
}
