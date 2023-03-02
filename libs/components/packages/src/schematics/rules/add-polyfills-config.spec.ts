import { SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../testing/scaffold';

import { addPolyfillsConfig } from './add-polyfills-config';

describe('addPolyfillsConfig', () => {
  const runner = new SchematicTestRunner(
    '@skyux/packages',
    require.resolve('../../../collection.json')
  );

  it('should add polyfills to workspace config', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    expect(tree.readText('angular.json')).not.toContain(
      '@skyux/packages/polyfills'
    );
    await addPolyfillsConfig()(tree, {} as SchematicContext);
    const updated = tree.readText('angular.json');
    expect(updated).toContain('@skyux/packages/polyfills');
    await addPolyfillsConfig()(tree, {} as SchematicContext);
    expect(tree.readText('angular.json')).toEqual(updated);
    const workspace = JSON.parse(updated);
    expect(
      workspace.projects['test-app'].architect.build.options.polyfills
    ).toEqual(['zone.js', '@skyux/packages/polyfills']);
    expect(
      workspace.projects['test-app'].architect.test.options.polyfills
    ).toEqual(['zone.js', 'zone.js/testing', '@skyux/packages/polyfills']);
  });

  it('should add polyfills when previous value is string', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const workspace: any = tree.readJson('angular.json');
    workspace.projects['test-app'].architect.build.options.polyfills =
      'zone.js';
    tree.overwrite('angular.json', JSON.stringify(workspace));
    await addPolyfillsConfig()(tree, {} as SchematicContext);
    const updatedWorkspace: any = tree.readJson('angular.json');
    expect(
      updatedWorkspace.projects['test-app'].architect.build.options.polyfills
    ).toEqual(['zone.js', '@skyux/packages/polyfills']);
  });

  it('should add polyfills when previous value is missing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const workspace: any = tree.readJson('angular.json');
    delete workspace.projects['test-app'].architect.build.options.polyfills;
    tree.overwrite('angular.json', JSON.stringify(workspace));
    await addPolyfillsConfig()(tree, {} as SchematicContext);
    const updatedWorkspaceAfterMissingPolyfills: any =
      tree.readJson('angular.json');
    expect(
      updatedWorkspaceAfterMissingPolyfills.projects['test-app'].architect.build
        .options.polyfills
    ).toEqual(['@skyux/packages/polyfills']);
    delete workspace.projects['test-app'].architect.build.options;
    tree.overwrite('angular.json', JSON.stringify(workspace));
    await addPolyfillsConfig()(tree, {} as SchematicContext);
    const updatedWorkspaceAfterMissingOptions: any =
      tree.readJson('angular.json');
    expect(
      updatedWorkspaceAfterMissingOptions.projects['test-app'].architect.build
        .options.polyfills
    ).toEqual(['@skyux/packages/polyfills']);
  });
});
