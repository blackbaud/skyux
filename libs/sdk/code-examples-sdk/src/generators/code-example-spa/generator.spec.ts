import { Tree, generateFiles, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import generator from './generator';

describe('code-example-spa generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
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
        'dist/libs/sdk/code-examples-sdk/ag-grid/data-entry-grid/basic/angular.json'
      )
    ).toBeTruthy();
  });
});
