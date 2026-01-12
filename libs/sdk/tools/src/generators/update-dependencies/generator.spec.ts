import { version as ANGULAR_VERSION } from '@angular/core/package.json';
import { libraryGenerator } from '@nx/angular/generators';
import {
  Tree,
  readJson,
  readProjectConfiguration,
  stripIndents,
  updateJson,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import generator from './generator';

describe('update dependencies generator', () => {
  let appTree: Tree;
  const options = {
    skipFormat: true,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    writeJson(appTree, 'package.json', {
      dependencies: {
        '@angular/common': ANGULAR_VERSION,
        '@angular/core': ANGULAR_VERSION,
      },
    });
    appTree.write('.gitignore', 'node_modules');
    writeJson(appTree, '.prettierrc', {
      singleQuote: true,
      importOrder: ['^@(.*)$', '^\\w(.*)$', '^(../)(.*)$', '^(./)(.*)$'],
      importOrderSeparation: true,
      importOrderSortSpecifiers: true,
      importOrderParserPlugins: ['typescript', 'decorators-legacy'],
    });
    appTree.write('.prettierignore', `.prettierrc\njest.preset.js\n`);
  });

  it('should run successfully', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    updateJson(appTree, 'package.json', (json: any) => {
      json.dependencies['example-package'] = '^1.0.0';
      return json;
    });
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(
      readJson(appTree, `package.json`).dependencies['example-package'],
    ).toEqual('1.0.0');
  });

  it('should update peer dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json: any) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '1.0.0',
      };
      json.devDependencies = {
        ...json.devDependencies,
        '@proj/two': '2.0.0',
      };
      return json;
    });
    updateJson(appTree, `${originalConfig.root}/package.json`, (json: any) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '^1.0.0',
      };
      json.peerDependencies = {
        ...json.peerDependencies,
        '@proj/two': '^1.0.0',
      };
      return json;
    });
    await generator(appTree, options);
    const projectPackageJson = readJson(
      appTree,
      `${originalConfig.root}/package.json`,
    );
    expect(projectPackageJson).toBeDefined();
    expect(projectPackageJson.peerDependencies).toEqual({
      '@angular/common': `^${ANGULAR_VERSION}`,
      '@angular/core': `^${ANGULAR_VERSION}`,
      '@proj/two': '^2.0.0',
    });
  });

  it('should update ng-update package group', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'libs/components/test',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });
    await libraryGenerator(appTree, {
      name: 'packages',
      buildable: true,
      publishable: true,
      importPath: '@proj/packages',
      directory: 'libs/components/packages',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });

    appTree.write(
      'package.json',
      JSON.stringify({
        dependencies: {
          '@proj/one': '1.1.0',
        },
        devDependencies: {
          '@proj/two': '2.2.0',
        },
      }),
    );
    appTree.write(
      'libs/components/packages/package.json',
      JSON.stringify({
        'ng-update': {
          packageGroup: {
            '@proj/one': '1.0.0',
            '@proj/two': '^2.0.0',
          },
        },
      }),
    );
    await generator(appTree, options);
    const projectPackageJson = readJson(
      appTree,
      `libs/components/packages/package.json`,
    );
    expect(projectPackageJson).toEqual({
      'ng-update': {
        packageGroup: {
          '@skyux/packages': '0.0.0-PLACEHOLDER',
          '@proj/one': '1.1.0',
          '@proj/test': '0.0.0-PLACEHOLDER',
          '@proj/two': '^2.2.0',
        },
      },
    });
  });

  it('should ignore specific packages', async () => {
    await libraryGenerator(appTree, {
      name: 'eslint-config',
      buildable: true,
      publishable: true,
      importPath: '@skyux-sdk/eslint-config',
      directory: 'libs/components/eslint-config',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });
    await libraryGenerator(appTree, {
      name: 'prettier-schematics',
      buildable: true,
      publishable: true,
      importPath: '@skyux-sdk/prettier-schematics',
      directory: 'libs/components/prettier-schematics',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });
    await libraryGenerator(appTree, {
      name: 'allowed-package',
      buildable: true,
      publishable: true,
      importPath: '@proj/allowed-package',
      directory: 'libs/components/allowed-package',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });
    await libraryGenerator(appTree, {
      name: 'packages',
      buildable: true,
      publishable: true,
      importPath: '@skyux/packages',
      directory: 'libs/components/packages',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
      tags: 'npm',
    });

    appTree.write(
      'package.json',
      JSON.stringify({
        dependencies: {
          '@proj/one': '1.1.0',
        },
      }),
    );
    appTree.write(
      'libs/components/packages/package.json',
      JSON.stringify({
        'ng-update': {
          packageGroup: {
            '@proj/one': '1.0.0',
          },
        },
      }),
    );

    await generator(appTree, options);
    const projectPackageJson = readJson(
      appTree,
      `libs/components/packages/package.json`,
    );

    expect(projectPackageJson).toEqual({
      'ng-update': {
        packageGroup: {
          '@skyux/packages': '0.0.0-PLACEHOLDER',
          '@proj/allowed-package': '0.0.0-PLACEHOLDER',
          '@proj/one': '1.1.0',
          // @skyux-sdk/eslint-config and @skyux-sdk/prettier-schematics should be filtered out
        },
      },
    });
  });

  it('should throw error on unmet dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json: any) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '2.0.0',
      };
      return json;
    });
    updateJson(appTree, `${originalConfig.root}/package.json`, (json: any) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '^1.0.0',
      };
      return json;
    });
    await expect(() => generator(appTree, options)).rejects.toThrow(
      new Error(
        `The version of @proj/one in test (^1.0.0) is not compatible with the version 2.0.0 from the root package.json.`,
      ),
    );
  });

  it('should capture testing dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'lib/test',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    await libraryGenerator(appTree, {
      name: 'aaa',
      buildable: true,
      publishable: true,
      importPath: '@proj/aaa',
      directory: 'lib/aaa',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    await libraryGenerator(appTree, {
      name: 'aaa-testing',
      buildable: true,
      publishable: false,
      importPath: '@proj/aaa/testing',
      directory: 'lib/aaa-testing',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    await libraryGenerator(appTree, {
      name: 'bbb',
      buildable: true,
      publishable: true,
      importPath: '@proj/bbb',
      directory: 'lib/bbb',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    await libraryGenerator(appTree, {
      name: 'bbb-testing',
      buildable: true,
      publishable: false,
      importPath: '@proj/bbb/testing',
      directory: 'lib/bbb-testing',
      skipFormat: true,
      skipPackageJson: true,
      skipTests: true,
    });
    const testProject = readProjectConfiguration(appTree, 'test');
    writeJson(appTree, `${testProject.root}/testing/project.json`, {
      name: 'test-testing',
      projectType: 'library',
      sourceRoot: `${testProject.root}/testing/src`,
      targets: {
        test: {
          commands: ['echo test'],
        },
      },
    });
    appTree.write(`${testProject.root}/testing/src/empty.ts`, '');
    appTree.write(
      `${testProject.root}/testing/src/test.ts`,
      stripIndents`
      import { thirdParty } from '@third-party/core';
      import { test } from '@proj/test';
      import { otherB } from '@proj/bbb/testing';
      import { otherA } from '@proj/aaa/testing';

      test();
      otherA();
      otherB();
      thirdParty();
      `,
    );
    await generator(appTree, options);
    expect(readProjectConfiguration(appTree, 'test')).toMatchSnapshot();
    expect(readProjectConfiguration(appTree, 'test-testing')).toMatchSnapshot();
  }, 3e6);
});
