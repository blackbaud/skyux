import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { RoutingScope } from '@schematics/angular/module/schema';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from './angular-module-generator';
import { createTestApp } from './scaffold';

describe('angularModuleGenerator', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../collection.json'),
  );

  it('should generate an angular module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'my-module',
      project: 'my-app',
    });
    expect(
      tree.readText('/src/app/my-module/my-module.module.ts'),
    ).toBeTruthy();
  });

  it('should generate an angular module with routing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'my-module',
      project: 'my-app',
      routing: true,
      routingScope: RoutingScope.Root,
    });
    await angularModuleGenerator(runner, tree, {
      name: 'my-sub-module',
      project: 'my-app',
      module: 'my-module',
      route: 'my-sub-module',
      routing: true,
      routingScope: RoutingScope.Child,
    });
    expect(
      tree.readText('/src/app/my-module/my-module.module.ts'),
    ).toMatchSnapshot();
    expect(
      tree.readText('/src/app/my-sub-module/my-sub-module.module.ts'),
    ).toMatchSnapshot();
  });

  it('should generate an angular component', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'my-component',
      project: 'my-app',
      skipImport: true,
    });
    expect(
      tree.readText('/src/app/my-component/my-component.component.ts'),
    ).toBeTruthy();
  });
});
