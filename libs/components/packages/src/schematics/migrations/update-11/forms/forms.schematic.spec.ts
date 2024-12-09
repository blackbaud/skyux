import { SchematicContext, Tree } from '@angular-devkit/schematics';

import { default as formsSchematic } from './forms.schematic';

describe('forms.schematic', () => {
  it('should update the import path', async () => {
    const tree = Tree.empty();

    tree.create(
      'file.ts',
      `import { FileValidateFunction } from '@skyux/forms/lib/modules/file-attachment/file-validate-function';

      class TestComponent {}`,
    );

    await formsSchematic()(tree, {} as SchematicContext);

    expect(tree.readText('file.ts')).toEqual(
      `import { FileValidateFunction } from '@skyux/forms';

      class TestComponent {}`,
    );
  });
});
