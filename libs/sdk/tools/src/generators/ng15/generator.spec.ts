import { UnitTestRunner, libraryGenerator } from '@nrwl/angular/generators';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
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
});
