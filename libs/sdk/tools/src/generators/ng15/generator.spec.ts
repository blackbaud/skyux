import { UnitTestRunner, libraryGenerator } from '@nrwl/angular/generators';
import { dependencies as generatorDependencies } from '@nrwl/angular/package.json';
import {
  Tree,
  readJson,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';

describe('ng15 generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write('.gitignore', 'node_modules');
  });

  it('should run successfully', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    await generator(appTree);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(config.targets?.test.executor).toEqual(
      '@angular-devkit/build-angular:karma'
    );
    expect(config.targets?.test.options.polyfills).toEqual([
      'zone.js',
      'zone.js/testing',
    ]);
  });

  it('should add polyfills', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    if (originalConfig.targets?.test.options.polyfills) {
      delete originalConfig.targets.test.options.polyfills;
    }
    updateProjectConfiguration(appTree, 'test', originalConfig);
    await generator(appTree);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(config.targets?.test.options.polyfills).toEqual([
      'zone.js',
      'zone.js/testing',
    ]);
  });

  it('should update polyfills', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    if (originalConfig.targets?.test.options.polyfills) {
      originalConfig.targets.test.options.main = `${originalConfig.root}/src/test.ts`;
      originalConfig.targets.test.options.polyfills = `${originalConfig.root}/src/polyfills.ts`;
    }
    updateProjectConfiguration(appTree, 'test', originalConfig);
    appTree.write(
      `${originalConfig.root}/src/test.ts`,
      [
        `import 'zone.js/dist/zone-testing';`,
        `(window as any).global = window;`,
      ].join(`\n`)
    );
    await generator(appTree);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(config.targets?.test.options.polyfills).toEqual([
      `${originalConfig.root}/src/polyfills.ts`,
      'zone.js',
      'zone.js/testing',
    ]);
  });

  it('should set stylesheet import path', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    expect(originalConfig.targets?.build.executor).toEqual(
      '@nrwl/angular:package'
    );
    if (originalConfig.targets?.test?.options) {
      originalConfig.targets.test.options.polyfills = `zone.js`;
    }
    const ngPackagePath = `${originalConfig.root}/ng-package.json`;
    expect(appTree.exists(ngPackagePath)).toBeTruthy();
    await generator(appTree);
    const ngPackage = readJson(appTree, ngPackagePath);
    expect(ngPackage).toBeDefined();
    expect(ngPackage.inlineStyleLanguage).toEqual('scss');
    expect(ngPackage.lib.styleIncludePaths).toEqual(['..']);
  });

  it('should update peer dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json) => {
      json.dependencies = {
        '@proj/one': '1.0.0',
      };
      json.devDependencies = {
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
      `${originalConfig.root}/package.json`
    );
    expect(projectPackageJson).toBeDefined();
    const angularVersion =
      `${generatorDependencies['@angular-devkit/schematics']}`.replace(
        '~',
        '^'
      );
    expect(projectPackageJson.peerDependencies).toEqual({
      '@proj/two': '^2.0.0',
      '@angular/common': `${angularVersion}`,
      '@angular/core': `${angularVersion}`,
    });
  });

  it('should throw error on unmet dependencies', async () => {
    await libraryGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.Karma,
      buildable: true,
      publishable: true,
      importPath: '@proj/test',
    });
    const originalConfig = readProjectConfiguration(appTree, 'test');
    expect(originalConfig).toBeDefined();
    updateJson(appTree, 'package.json', (json) => {
      json.dependencies = {
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
        `The version of @proj/one in test (^1.0.0) is not compatible with the version 2.0.0 from the root package.json.`
      )
    );
  });
});
