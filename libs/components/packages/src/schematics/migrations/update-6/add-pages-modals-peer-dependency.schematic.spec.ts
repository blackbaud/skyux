import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'path';

import addPagesModalsPeerDependency from './add-pages-modals-peer-dependency.schematic';

describe('add-pages-peer-dependency.schematic', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  let runner: SchematicTestRunner;
  let tree: Tree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('migrations', collectionPath);
    tree = Tree.empty();
  });

  it('should add @skyux/modals', async () => {
    tree.create(
      'package.json',
      JSON.stringify({ dependencies: {}, devDependencies: {} })
    );
    const rule = addPagesModalsPeerDependency();
    await runner.callRule(rule, tree, {}).toPromise();
    expect(runner.tasks.length).toBeGreaterThan(0);
  });

  it('should add @skyux/modals to empty project', async () => {
    tree.create('package.json', JSON.stringify({}));
    const rule = addPagesModalsPeerDependency();
    await runner.callRule(rule, tree, {}).toPromise();
    expect(runner.tasks.length).toBeGreaterThan(0);
  });

  it('should not add @skyux/modals twice', async () => {
    tree.create(
      'package.json',
      JSON.stringify({
        dependencies: {
          '@skyux/modals': '^0.0.0-PACKAGES_PLACEHOLDER',
        },
        devDependencies: {},
      })
    );
    const rule = addPagesModalsPeerDependency();
    await runner.callRule(rule, tree, {}).toPromise();
    expect(runner.tasks.length).toBe(0);
  });

  it('should not add @skyux/modals twice, dev dependency', async () => {
    tree.create(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@skyux/modals': '^0.0.0-PACKAGES_PLACEHOLDER',
        },
      })
    );
    const rule = addPagesModalsPeerDependency();
    await runner.callRule(rule, tree, {}).toPromise();
    expect(runner.tasks.length).toBe(0);
  });
});
