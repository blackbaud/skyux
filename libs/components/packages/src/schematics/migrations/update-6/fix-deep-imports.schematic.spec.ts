import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Fix SCSS tilde imports', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'fix-deep-imports';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestApp(runner, {
      defaultProjectName,
    });
  });

  function runSchematic(): Promise<UnitTestTree> {
    return runner.runSchematicAsync(schematicName, {}, tree).toPromise();
  }

  it('should fix deep imports for @skyux packages', async () => {
    tree.create(
      'src/app/foo.component.ts',
      `
import { FooType } from '@foo/bar/baz';
import { FooModule } from './foo/bar/baz';
import { SkyColorpickerModule } from '@skyux/colorpicker/src/lib/modules/colorpicker/colorpicker.module';
`
    );
    const updatedTree = await runSchematic();
    expect(updatedTree.readContent('src/app/foo.component.ts')).toEqual(`
import { FooType } from '@foo/bar/baz';
import { FooModule } from './foo/bar/baz';
import { SkyColorpickerModule } from '@skyux/colorpicker';
`);
  });
});
