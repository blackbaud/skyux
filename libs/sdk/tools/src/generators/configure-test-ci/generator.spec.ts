import {
  E2eTestRunner,
  UnitTestRunner,
  applicationGenerator,
} from '@nx/angular/generators';
import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/eslint';

import { configureTestCiGenerator } from './generator';

describe('configure-test-ci generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '');
    await applicationGenerator(tree, {
      name: 'test',
      skipFormat: true,
      directory: 'test',
      skipPackageJson: true,
      linter: Linter.None,
      e2eTestRunner: E2eTestRunner.None,
      unitTestRunner: UnitTestRunner.Jest,
    });
  });

  it('should update karma project', async () => {
    const projectConfig = readProjectConfiguration(tree, 'test');
    if (projectConfig.targets?.['test']) {
      projectConfig.targets['test'].executor =
        '@angular-devkit/build-angular:karma';
      updateProjectConfiguration(tree, 'test', projectConfig);
    }
    await configureTestCiGenerator(tree, { skipFormat: true });
    // Run twice to ensure that the generator is idempotent.
    await configureTestCiGenerator(tree, { skipFormat: true });
    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['test']).toBeDefined();
    expect(config.targets?.['test']).toMatchInlineSnapshot(`
      Object {
        "configurations": Object {
          "ci": Object {
            "browsers": "ChromeHeadlessNoSandbox",
            "codeCoverage": true,
            "progress": false,
            "sourceMap": true,
            "watch": false,
          },
        },
        "executor": "@angular-devkit/build-angular:karma",
        "options": Object {
          "jestConfig": "test/jest.config.ts",
        },
        "outputs": Array [
          "{workspaceRoot}/coverage/{projectRoot}",
        ],
      }
    `);
  });

  it('should update jest project', async () => {
    await configureTestCiGenerator(tree, { skipFormat: true });
    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['test']).toBeDefined();
    expect(config.targets?.['test']).toMatchInlineSnapshot(`
      Object {
        "configurations": Object {
          "ci": Object {
            "ci": true,
            "codeCoverage": true,
            "runInBand": true,
          },
        },
        "executor": "@nx/jest:jest",
        "options": Object {
          "jestConfig": "test/jest.config.ts",
        },
        "outputs": Array [
          "{workspaceRoot}/coverage/{projectRoot}",
        ],
      }
    `);
  });

  it('should ignore other project', async () => {
    const projectConfig = readProjectConfiguration(tree, 'test');
    if (projectConfig.targets?.['test']) {
      delete projectConfig.targets['test'].configurations;
      projectConfig.targets['test'].executor = 'nx:run-commands';
      projectConfig.targets['test'].options = {
        command: "echo 'Hello world.'",
      };
      updateProjectConfiguration(tree, 'test', projectConfig);
    }
    await configureTestCiGenerator(tree, { skipFormat: true });
    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['test']).toBeDefined();
    expect(config.targets?.['test']).toMatchInlineSnapshot(`
      Object {
        "executor": "nx:run-commands",
        "options": Object {
          "command": "echo 'Hello world.'",
        },
        "outputs": Array [
          "{workspaceRoot}/coverage/{projectRoot}",
        ],
      }
    `);
  });
});
