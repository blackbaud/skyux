import { Tree, generateFiles, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import generator from './generator';

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
    await generator(tree, {
      component: 'ag-grid',
      path: 'data-entry-grid/basic',
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
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(
      'The project build dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic already exists. Please delete it before running this schematic.'
    );
  });

  it('should fail if the module is missing', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.delete(
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.module.ts'
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Expected exactly one module file/);
  });

  it('should fail if the module is invalid', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    const filePath =
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.module.ts';
    tree.write(
      filePath,
      tree.read(filePath)?.toString().replace('exports: [', 'providers: [') ||
        ''
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Cannot read properties of/);
  });

  it('should fail if there is no exported component', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    const filePath =
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.module.ts';
    tree.write(
      filePath,
      tree.read(filePath)?.toString().replace('exports: [', 'exports: [X') || ''
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Could not find import for example component/);
  });

  it('should fail if the component is missing', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.delete(
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.component.ts'
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Could not find Component decorator/);
  });

  it('should fail if the component is invalid', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.write(
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.component.ts',
      'const duck ='
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Could not find Component decorator/);
  });

  it('should fail if the component does not have a selector', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    const filePath =
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/basic/data-entry-grid-docs-demo.component.ts';
    tree.write(
      filePath,
      tree
        .read(filePath)
        ?.toString()
        .replace(/selector: '[^']+',/, '') || ''
    );
    await expect(() =>
      generator(tree, {
        component: 'ag-grid',
        path: 'data-entry-grid/basic',
      })
    ).rejects.toThrowError(/^Cannot read properties/);
  });

  it('should include test support', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/lookup/lookup/async`,
      'apps/code-examples/src/app/code-examples/lookup/lookup/async',
      {}
    );
    await generator(tree, {
      component: 'lookup',
      path: 'lookup/async',
    });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/lookup/lookup/async/tsconfig.spec.json'
      )
    ).toBeTruthy();
  });
});
