import { applicationGenerator } from '@nx/angular/generators';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from './angular-module-generator';
import {
  findDependenciesFromCode,
  findPeerDependencies,
} from './find-dependencies';

describe('find-dependencies', () => {
  beforeEach(() => {
    jest.mock('prettier', () => undefined);
  });

  it('should find code dependencies', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(tree, {
      name: 'my-app',
    });
    await angularModuleGenerator(tree, {
      name: 'my-module',
      project: 'my-app',
    });
    await angularComponentGenerator(tree, {
      name: 'my-component',
      project: 'my-app',
    });
    expect(findDependenciesFromCode(tree, '/apps/my-app/src')).toEqual([
      '@angular/common',
      '@angular/core',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'jest-preset-angular',
    ]);
  });

  it('should find peer dependencies', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write(
      `node_modules/@angular/common/package.json`,
      JSON.stringify({
        peerDependencies: {
          '@angular/core': '1.2.3',
          'other-peer': '1.2.3',
        },
      })
    );
    await applicationGenerator(tree, {
      name: 'my-app',
    });
    await angularModuleGenerator(tree, {
      name: 'my-module',
      project: 'my-app',
    });
    await angularComponentGenerator(tree, {
      name: 'my-component',
      project: 'my-app',
    });
    const codeDependencies = findDependenciesFromCode(tree, '/apps/my-app/src');
    expect(findPeerDependencies(tree, codeDependencies)).toEqual([
      '@angular/common',
      '@angular/core',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'jest-preset-angular',
      'other-peer',
    ]);
  });
});
