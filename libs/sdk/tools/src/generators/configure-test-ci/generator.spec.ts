import { applicationGenerator } from '@nx/angular/generators';
import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { configureTestCiGenerator } from './generator';

describe('configure-test-ci generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '');
    await applicationGenerator(tree, { name: 'test', skipFormat: true });
  });

  it('should update karma project', async () => {
    const projectConfig = readProjectConfiguration(tree, 'test');
    if (projectConfig.targets?.['test']) {
      projectConfig.targets['test'].executor =
        '@angular-devkit/build-angular:karma';
      updateProjectConfiguration(tree, 'test', projectConfig);
    }
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
          "ci-firefox": Object {
            "browsers": "FirefoxHeadless",
            "codeCoverage": false,
            "progress": false,
            "sourceMap": false,
            "watch": false,
          },
        },
        "executor": "@angular-devkit/build-angular:karma",
        "options": Object {
          "jestConfig": "test/jest.config.ts",
          "passWithNoTests": true,
        },
        "outputs": Array [
          "{workspaceRoot}/coverage/{projectRoot}",
        ],
      }
    `);
  });

  it('should ignore non-karma project', async () => {
    await configureTestCiGenerator(tree, { skipFormat: true });
    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['test']).toBeDefined();
    expect(config.targets?.['test']).toMatchInlineSnapshot(`
      Object {
        "configurations": Object {
          "ci": Object {
            "ci": true,
            "codeCoverage": true,
          },
        },
        "executor": "@nx/jest:jest",
        "options": Object {
          "jestConfig": "test/jest.config.ts",
          "passWithNoTests": true,
        },
        "outputs": Array [
          "{workspaceRoot}/coverage/{projectRoot}",
        ],
      }
    `);
  });
});
