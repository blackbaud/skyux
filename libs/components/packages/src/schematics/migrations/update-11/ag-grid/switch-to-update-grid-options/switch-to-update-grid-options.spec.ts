import { Tree } from '@angular-devkit/schematics';

import { switchToUpdateGridOptions } from './switch-to-update-grid-options';

describe('switch-to-update-grid-options', () => {
  it('should update setQuickFilter to use gridOptions', async () => {
    const tree = Tree.empty();
    tree.create('test.component.ts', `agGrid.api.setQuickFilter('test');`);
    switchToUpdateGridOptions(tree, 'test.component.ts');
    expect(tree.readText('test.component.ts')).toEqual(
      `agGrid.api.updateGridOptions({ quickFilterText: 'test' });`,
    );
  });
});
