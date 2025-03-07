import { logging } from '@angular-devkit/core';
import { SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

import { workspaceCheck } from './workspace-check';

const collectionPath = require.resolve('../../../../collection.json');

describe('Workspace check', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  it('should warn when SSR is enabled', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-project',
    });

    // Set ssr=true in the build config.
    const angularJson = JSON.parse(tree.readText('angular.json'));
    angularJson.projects['test-project'].architect['build'].options['ssr'] =
      true;
    tree.overwrite('angular.json', JSON.stringify(angularJson));

    const context: Pick<SchematicContext, 'logger'> = {
      logger: new logging.NullLogger(),
    };
    const warn = jest.spyOn(context.logger, 'warn');
    await workspaceCheck()(tree, context as SchematicContext);
    expect(warn).toHaveBeenCalledWith(
      'Project test-project is using server-side rendering (SSR), which is not fully supported by the current version of SKY UX.',
    );
  });

  it('should not warn when SSR is not enabled', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-project',
    });
    const workspace: any = tree.readJson('angular.json');
    delete workspace.projects['test-project'].architect.build.configurations;
    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));
    const context: Pick<SchematicContext, 'logger'> = {
      logger: new logging.NullLogger(),
    };
    const warn = jest.spyOn(context.logger, 'warn');
    await workspaceCheck()(tree, context as SchematicContext);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should not warn when there is no build step', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-project',
    });
    const workspace: any = tree.readJson('angular.json');
    delete workspace.projects['test-project'].architect.build;
    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));
    const context: Pick<SchematicContext, 'logger'> = {
      logger: new logging.NullLogger(),
    };
    const warn = jest.spyOn(context.logger, 'warn');
    await workspaceCheck()(tree, context as SchematicContext);
    expect(warn).not.toHaveBeenCalled();
  });
});
