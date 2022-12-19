import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Rename mutation observer service', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner
          .runSchematicAsync('rename-mutation-observer-service', {}, tree)
          .toPromise(),
      tree,
    };
  }

  it('should rename MutationObserverService to SkyMutationObserverService', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/app/app.component.ts',
      `
import { SkyMutationObserverService } from '@skyux/core';
import { MutationObserverService } from '@skyux/core';
import { FooService, MutationObserverService } from '@skyux/core';
import { MutationObserverService, SkyFoobarService, FooService } from '@skyux/core';
import {
  FooService,
  MutationObserverService,
  BarService
} from '@skyux/core';
import { MutationObserverService } from '@skyux/core';

#mutationObserverSvc: MutationObserverService;
#mutationObserverSvc2: MutationObserverService;

constructor(
  mutationObserverSvc1: SkyMutationObserverService,
  mutationObserverSvc2: MutationObserverService,
  public mutationObserverSvc3: MutationObserverService
) {
  this.#mutationObserverSvc2 = mutationObserverSvc2;
}
`
    );

    await runSchematic();

    expect(tree.readContent('src/app/app.component.ts')).toEqual(`
import { SkyMutationObserverService } from '@skyux/core';
import { SkyMutationObserverService } from '@skyux/core';
import { FooService, SkyMutationObserverService } from '@skyux/core';
import { SkyMutationObserverService, SkyFoobarService, FooService } from '@skyux/core';
import {
  FooService,
  SkyMutationObserverService,
  BarService
} from '@skyux/core';
import { SkyMutationObserverService } from '@skyux/core';

#mutationObserverSvc: SkyMutationObserverService;
#mutationObserverSvc2: SkyMutationObserverService;

constructor(
  mutationObserverSvc1: SkyMutationObserverService,
  mutationObserverSvc2: SkyMutationObserverService,
  public mutationObserverSvc3: SkyMutationObserverService
) {
  this.#mutationObserverSvc2 = mutationObserverSvc2;
}
`);
  });
});
