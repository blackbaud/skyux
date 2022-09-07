import { applicationGenerator } from '@nrwl/angular/generators';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { RoutingScope } from '@schematics/angular/module/schema';

import { angularModuleGenerator } from './angular-module-generator';

describe('angularModuleGenerator', () => {
  it('should generate an angular module', async () => {
    const tree = createTreeWithEmptyV1Workspace();
    await applicationGenerator(tree, {
      name: 'my-app',
    });
    await angularModuleGenerator(tree, {
      name: 'my-module',
      project: 'my-app',
    });
    expect(
      tree.read('/apps/my-app/src/app/my-module/my-module.module.ts', 'utf-8')
    ).toBeTruthy();
  });

  it('should generate an angular module with routing', async () => {
    const tree = createTreeWithEmptyV1Workspace();
    await applicationGenerator(tree, {
      name: 'my-app',
    });
    await angularModuleGenerator(tree, {
      name: 'my-module',
      project: 'my-app',
      routing: true,
      routingScope: RoutingScope.Root,
    });
    await angularModuleGenerator(tree, {
      name: 'my-sub-module',
      project: 'my-app',
      module: 'my-module',
      route: 'my-sub-module',
      routing: true,
      routingScope: RoutingScope.Child,
    });
    expect(
      tree.read('/apps/my-app/src/app/my-module/my-module.module.ts', 'utf-8')
    ).toMatchSnapshot();
    expect(
      tree.read(
        '/apps/my-app/src/app/my-sub-module/my-sub-module.module.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });
});
