import { Tree, generateFiles, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { codeExampleSpa } from './generator';

describe('code-example-spa generator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.mock('prettier', () => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    tree = createTreeWithEmptyWorkspace();
    tree.write('node_modules/@skyux/icons/package.json', '{}');
  });

  it('should run successfully', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    await codeExampleSpa(tree, {
      component: 'ag-grid',
      path: 'data-entry-grid/basic',
      ltsBranch: 'x.x.x',
    });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic/angular.json'
      )
    ).toBeTruthy();
  });

  it('should fail if the spa exists', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.write(
      'dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic/angular.json',
      '{}'
    );
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(
      'The project build dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic already exists. Please delete it before running this schematic.'
    );
  });

  it('should fail if the component is missing', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.delete(
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.ts'
    );
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(/^Missing demo\.component\.ts file/);
  });

  it('should fail if the component is invalid', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    const filePath =
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.ts';

    // Standalone.
    tree.write(
      filePath,
      tree
        .read(filePath)
        ?.toString()
        .replace(/standalone: true,/, '') || ''
    );
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(/^Component should be standalone/);

    // Class name.
    tree.write(
      filePath,
      tree
        .read(filePath)
        ?.toString()
        .replace('DemoComponent', 'SpecialDemoComponent') || ''
    );
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(/^Class name should be DemoComponent/);

    // No class.
    tree.write(filePath, 'const good = false;');
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(/^Could not find component class/);
  });

  it('should fail if the component does not have a selector', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    const filePath =
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/demo.component.ts';
    tree.write(
      filePath,
      tree
        .read(filePath)
        ?.toString()
        .replace(/selector: '[^']+',/, '') || ''
    );
    await expect(() =>
      codeExampleSpa(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
        ltsBranch: 'x.x.x',
      })
    ).rejects.toThrowError(/^Selector should be "app-demo"/);
  });

  it('should include test support', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/lookup/lookup/async`,
      'apps/code-examples/src/app/code-examples/lookup/lookup/async',
      {}
    );
    await codeExampleSpa(tree, {
      component: 'lookup',
      path: 'lookup/async',
      ltsBranch: 'x.x.x',
    });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/lookup/lookup/async/tsconfig.spec.json'
      )
    ).toBeTruthy();
  });
});
