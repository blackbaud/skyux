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

  const angularJsonBuffer = tree.read('angular.json');

  if (angularJsonBuffer) {
    const angularJson = JSON.parse(angularJsonBuffer.toString());
    const projectName = appOptions.projectName;

    // Set `test` builder to '@angular-devkit/build-angular:karma' for backward compatibility.
    if (angularJson.projects?.[projectName]?.architect?.test) {
      angularJson.projects[projectName].architect.test.builder =
        '@angular-devkit/build-angular:karma';

      angularJson.projects[projectName].architect.test.options ??= {};
      angularJson.projects[projectName].architect.test.options.polyfills = [
        'zone.js',
        'zone.js/testing',
      ];

      angularJson.projects[projectName].architect.test.options.styles = [
        'src/styles.scss',
      ];

      tree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));
    }
  }

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
