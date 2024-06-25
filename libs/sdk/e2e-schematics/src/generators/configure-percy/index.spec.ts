import { configurationGenerator } from '@nx/cypress';
import { NxJsonConfiguration, readNxJson, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { createTestApplication } from '../../utils/testing';

import configurePercy from './index';

describe('configure-percy', () => {
  async function setupTest() {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const nxJson: NxJsonConfiguration = readNxJson(tree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(tree, nxJson);

    tree.write('.gitignore', '');

    await createTestApplication(tree, { name: 'cypress' });
    return { tree };
  }

  it('should import percy', async () => {
    const { tree } = await setupTest();
    await configurationGenerator(tree, {
      project: 'cypress',
      baseUrl: 'https://example.com',
    });
    expect(tree.exists('apps/cypress/src/support/e2e.ts')).toBeTruthy();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tree.read('apps/cypress/src/support/e2e.ts')!.toString(),
    ).not.toContain('percy');
    await configurePercy(tree, { name: 'cypress' });
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tree.read('apps/cypress/src/support/e2e.ts')!.toString(),
    ).toContain('percy');
  });

  it('should generate cypress.config.ts', async () => {
    const { tree } = await setupTest();
    await configurationGenerator(tree, {
      project: `cypress`,
      baseUrl: 'https://example.com',
    });
    await configurePercy(tree, { name: 'cypress' });
    expect(tree.exists('apps/cypress/cypress.config.ts')).toBeTruthy();
    expect(
      tree.read('apps/cypress/cypress.config.ts', 'utf-8'),
    ).toMatchSnapshot();
  });

  it('should handle missing supportFile', async () => {
    const { tree } = await setupTest();
    await configurationGenerator(tree, {
      project: `cypress`,
      baseUrl: 'https://example.com',
    });
    tree.delete(`apps/cypress/src/support/e2e.ts`);
    await configurePercy(tree, { name: 'cypress' });
    expect(tree.exists(`apps/cypress/src/support/e2e.ts`)).toBeTruthy();
  });
});
