import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Fix imports from rxjs/internal-compatibility', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'fix-rxjs-internal-compatibility-imports';

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

  it("should replace 'rxjs/internal-compatibility' imports with 'rxjs'", async () => {
    tree.create(
      'src/app/foo.component.ts',
      `
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-foo'
})
export class FooComponent {
  constructor() {
    const promise = new Promise();
    const obs$ = fromPromise(promise);
  }
}
`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('src/app/foo.component.ts')).toEqual(`
import { from } from 'rxjs';

@Component({
  selector: 'app-foo'
})
export class FooComponent {
  constructor() {
    const promise = new Promise();
    const obs$ = from(promise);
  }
}
`);
  });

  it("should not create 'from' import if it already exists", async () => {
    tree.create(
      'src/app/foo.component.ts',
      `
import { from } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
@Component({
  selector: 'app-foo'
})
export class FooComponent {
  constructor() {
    const promise = new Promise();
    const obs$ = fromPromise(promise);
  }
}
`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('src/app/foo.component.ts')).toEqual(`
import { from } from 'rxjs';

@Component({
  selector: 'app-foo'
})
export class FooComponent {
  constructor() {
    const promise = new Promise();
    const obs$ = from(promise);
  }
}
`);
  });
});
