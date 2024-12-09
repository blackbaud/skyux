import { Tree } from '@angular-devkit/schematics';

import { switchToSetGridOption } from './switch-to-set-grid-option';

describe('switch-to-set-grid-option', () => {
  it('should update setQuickFilter to use setGridOption', () => {
    const tree = Tree.empty();
    tree.create('test.component.ts', `agGrid.api.setQuickFilter('test');`);
    switchToSetGridOption(tree, 'test.component.ts');
    expect(tree.readText('test.component.ts')).toEqual(
      `agGrid.api.setGridOption('quickFilterText', 'test');`,
    );
  });
});
