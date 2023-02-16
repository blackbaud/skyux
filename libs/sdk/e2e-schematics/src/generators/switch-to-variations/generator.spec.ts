import { applicationGenerator } from '@nrwl/angular/generators';
import {
  NxJsonConfiguration,
  Tree,
  generateFiles,
  joinPathFragments,
  readNxJson,
  updateNxJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { SwitchToVariationsGeneratorSchema } from './schema';

describe('switch-to-variations generator', () => {
  let appTree: Tree;
  const options: SwitchToVariationsGeneratorSchema = { project: 'test-e2e' };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    const nxJson: NxJsonConfiguration = readNxJson(appTree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(appTree, nxJson);
    appTree.write('.gitignore', '# test');
    await applicationGenerator(appTree, {
      name: 'test',
    });
  });

  it('should run successfully', async () => {
    const start = appTree.read(
      'apps/test-e2e/src/integration/app.spec.ts',
      'utf-8'
    );
    const changes = appTree.listChanges();
    await generator(appTree, options);
    expect(
      appTree.read('apps/test-e2e/src/integration/app.spec.ts', 'utf-8')
    ).toEqual(start);
    expect(appTree.listChanges()).toEqual(changes);
  });

  it('should throw errors', async () => {
    try {
      await generator(appTree, {
        ...options,
        project: 'bogus',
      });
      fail('should have thrown');
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown an Error');
      }
      expect(e.message).toContain('Project bogus not found');
    }
    try {
      await generator(appTree, {
        ...options,
        project: 'test',
      });
      fail('should have thrown');
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown an Error');
      }
      expect(e.message).toContain('Project test is not an e2e project');
    }
  });

  it('should update test', async () => {
    generateFiles(
      appTree,
      joinPathFragments(__dirname, 'files/fixtures'),
      'apps/test-e2e/src/integration',
      {}
    );
    await generator(appTree, options);
    expect(
      appTree.read('apps/test-e2e/src/integration/example1.spec.ts', 'utf-8')
    ).toMatchSnapshot();
  });
});
