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
    setupEslint?: boolean;
    projectName: string;
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
      version: VERSION.major,
    },
  );

  if (appOptions.setupEslint) {
    await runner.runExternalSchematic('angular-eslint', 'ng-add', {}, tree);
  }

  return tree;
}

/**
 * Create a test workspace with a library as the default project.
 */
export async function createTestLibrary(
  runner: SchematicTestRunner,
  libOptions: {
    setupEslint?: boolean;
    projectName: string;
  },
): Promise<UnitTestTree> {
  const tree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: `${libOptions.projectName}-workspace`,
      createApplication: false,
      strict: true,
      version: VERSION.major,
    },
  );

  if (libOptions.setupEslint) {
    await runner.runExternalSchematic('angular-eslint', 'ng-add', {}, tree);
  }

  await runner.runExternalSchematic(
    '@schematics/angular',
    'library',
    {
      name: libOptions.projectName,
    },
    tree,
  );

  // Create a "showcase" application for library projects.
  await runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      name: `${libOptions.projectName}-showcase`,
    },
    tree,
  );

  if (libOptions.setupEslint) {
    await runner.runExternalSchematic(
      'angular-eslint',
      'add-eslint-to-project',
      {
        project: libOptions.projectName,
      },
      tree,
    );

    await runner.runExternalSchematic(
      'angular-eslint',
      'add-eslint-to-project',
      {
        project: `${libOptions.projectName}-showcase`,
      },
      tree,
    );
  }

  return tree;
}
