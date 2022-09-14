import { cypressProjectGenerator } from '@nrwl/cypress';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { updateJson } from '../../utils';

import configurePercy from './index';

describe('configure-percy', () => {
  it('should import percy', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    await cypressProjectGenerator(tree, {
      name: `cypress`,
      baseUrl: 'https://example.com',
    });
    expect(tree.exists('apps/cypress/src/support/index.ts')).toBeTruthy();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tree.read('apps/cypress/src/support/index.ts')!.toString()
    ).not.toContain('percy');
    await configurePercy(tree, { name: 'cypress' });
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tree.read('apps/cypress/src/support/index.ts')!.toString()
    ).toContain('percy');
  });

  it('should not make changes without cypress.json', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    await cypressProjectGenerator(tree, {
      name: `cypress`,
      baseUrl: 'https://example.com',
    });
    tree.delete(`apps/cypress/cypress.json`);
    const beforeLength = tree.listChanges().length;
    await configurePercy(tree, { name: 'cypress' });
    expect(tree.listChanges().length).toEqual(beforeLength);
  });

  it('should handle missing supportFile config', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    await cypressProjectGenerator(tree, {
      name: `cypress`,
      baseUrl: 'https://example.com',
    });
    updateJson<{ supportFile?: string }>(
      tree,
      `apps/cypress/cypress.json`,
      (config) => {
        delete config.supportFile;
        return config;
      }
    );
    await configurePercy(tree, { name: 'cypress' });
    const config = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tree.read(`apps/cypress/cypress.json`)!.toString()
    );
    expect(config.video).toBeFalsy();
  });

  it('should handle missing supportFile', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    await cypressProjectGenerator(tree, {
      name: `cypress`,
      baseUrl: 'https://example.com',
    });
    tree.delete(`apps/cypress/src/support/index.ts`);
    await configurePercy(tree, { name: 'cypress' });
    expect(tree.exists(`apps/cypress/src/support/index.ts`)).toBeTruthy();
  });
});
