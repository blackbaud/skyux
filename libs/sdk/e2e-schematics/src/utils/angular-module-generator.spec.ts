import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { RoutingScope } from '@schematics/angular/module/schema';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from './angular-module-generator';
import { createTestApplication } from './testing';

describe('angularModuleGenerator', () => {
  it('should generate an angular module', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await createTestApplication(tree, { name: 'my-app' });
    await angularModuleGenerator(tree, {
      name: 'my-module',
      project: 'my-app',
    });
    expect(
      tree.read('/apps/my-app/src/app/my-module/my-module.module.ts', 'utf-8'),
    ).toBeTruthy();
  });

  it('should generate an angular module with routing', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await createTestApplication(tree, { name: 'my-app' });
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
      tree.read('/apps/my-app/src/app/my-module/my-module.module.ts', 'utf-8'),
    ).toMatchSnapshot();
    expect(
      tree.read(
        '/apps/my-app/src/app/my-sub-module/my-sub-module.module.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
  });

  it('should generate an angular component', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await createTestApplication(tree, { name: 'my-app' });
    await angularComponentGenerator(tree, {
      name: 'my-component',
      project: 'my-app',
      skipImport: true,
    });
    expect(
      tree.read(
        '/apps/my-app/src/app/my-component/my-component.component.ts',
        'utf-8',
      ),
    ).toBeTruthy();
  });
});
