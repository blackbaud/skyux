import { Tree, generateFiles, logger, workspaceRoot } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { buildCodeExamples } from './generator';

describe('build generator', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.mock('prettier', () => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    await buildCodeExamples(tree, {
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

  it('should run without path parameter', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    await buildCodeExamples(tree, {
      component: 'ag-grid',
      ltsBranch: 'x.x.x',
    });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic/angular.json'
      )
    ).toBeTruthy();
  });

  it('should run without any parameters', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.write('apps/code-examples/src/app/code-examples/.gitignore', 'test');
    await buildCodeExamples(tree, { ltsBranch: 'x.x.x' });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic/angular.json'
      )
    ).toBeTruthy();
  });

  it('should not traverse a path with other files', async () => {
    generateFiles(
      tree,
      `${workspaceRoot}/apps/code-examples/src/app/code-examples/ag-grid`,
      'apps/code-examples/src/app/code-examples/ag-grid',
      {}
    );
    tree.write(
      'apps/code-examples/src/app/code-examples/ag-grid/data-entry-grid/script.sh',
      'test'
    );
    await buildCodeExamples(tree, {
      component: 'ag-grid',
      ltsBranch: 'x.x.x',
    });
    expect(
      tree.isFile(
        'dist/libs/sdk/code-examples-sdk/for-github/ag-grid/data-entry-grid/basic/angular.json'
      )
    ).toBeFalsy();
  });

  it('should log a warning when there are no examples', async () => {
    const loggerSpy = jest.spyOn(logger, 'warn');
    await buildCodeExamples(tree, {
      component: 'ag-grid',
      ltsBranch: 'x.x.x',
    });
    expect(loggerSpy).toHaveBeenCalledWith('No examples found for ag-grid');
  });
});
