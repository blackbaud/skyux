import { version as ANGULAR_VERSION } from '@angular/core/package.json';
import { libraryGenerator } from '@nrwl/angular/generators';
import {
  Tree,
  readJson,
  readProjectConfiguration,
  stripIndents,
  updateJson,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';

describe('update dependencies generator', () => {
  let appTree: Tree;

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
    appTree.write('.prettierignore', 'jest.preset.js');
  });

  it('should run successfully', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      projectNameAndRootFormat: 'as-provided',
    });
    await generator(appTree);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });

  it('should update peer dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      projectNameAndRootFormat: 'as-provided',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json) => {
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
    updateJson(appTree, `${originalConfig.root}/package.json`, (json) => {
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
    await generator(appTree);
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

  it('should throw error on unmet dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
      directory: 'test',
      projectNameAndRootFormat: 'as-provided',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '2.0.0',
      };
      return json;
    });
    updateJson(appTree, `${originalConfig.root}/package.json`, (json) => {
      json.dependencies = {
        ...json.dependencies,
        '@proj/one': '^1.0.0',
      };
      return json;
    });
    await expect(() => generator(appTree)).rejects.toThrow(
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
      projectNameAndRootFormat: 'as-provided',
    });
    await libraryGenerator(appTree, {
      name: 'other',
      buildable: true,
      publishable: true,
      importPath: '@proj/other',
      directory: 'lib/other',
      projectNameAndRootFormat: 'as-provided',
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
      import { other } from '@proj/other';

      test();
      other();
      `,
    );
    await generator(appTree);
    expect(readProjectConfiguration(appTree, 'test')).toMatchSnapshot();
    expect(readProjectConfiguration(appTree, 'test-testing')).toMatchSnapshot();
  });
});
