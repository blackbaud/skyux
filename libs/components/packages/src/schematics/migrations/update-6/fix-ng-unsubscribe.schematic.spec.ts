import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Fix ngUnsubscribe generics', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'fix-ng-unsubscribe';

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

  it('should set ngUnsubscribe Subject<any> to Subject<void>', async () => {
    tree.create(
      'src/app/foo.component.ts',
      `
private _ngUnsubscribe: Subject<any> = new Subject();
private ngUnsubscribe = new Subject<any>();
public ngUnsubscribe: Subject<any>;
`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('src/app/foo.component.ts')).toEqual(`
private _ngUnsubscribe: Subject<void> = new Subject();
private ngUnsubscribe = new Subject<void>();
public ngUnsubscribe: Subject<void>;
`);
  });
});
