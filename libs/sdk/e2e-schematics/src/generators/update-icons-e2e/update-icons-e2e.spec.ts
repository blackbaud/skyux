import { configurationGenerator } from '@nx/cypress';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '@nx/node';

import { updateIconsE2eGenerator } from './update-icons-e2e';

describe('update-icons-e2e generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await applicationGenerator(tree, {
      name: 'test',
      directory: 'apps/test',
      formatter: 'none',
      framework: 'none',
      tags: 'icons-e2e',
      unitTestRunner: 'none',
    });
    await configurationGenerator(tree, {
      project: 'test',
    });
    tree.write(
      `dist/cypress/apps/e2e/test/screenshots/sky-icon-names-example.json`,
      JSON.stringify({
        test: 'example test 1',
        file: 'example-test-1.cy.ts',
        iconNames: ['icon1', 'icon2', 'icon3', 'icon4'],
      }),
    );
    tree.write(
      `dist/cypress/apps/e2e/test/screenshots/sky-icon-names-example-2.json`,
      JSON.stringify({
        test: 'example test 2',
        file: 'example-test-2.cy.ts',
        iconNames: ['icon1', 'icon5'],
      }),
    );
    tree.write(
      `dist/cypress/apps/e2e/test/screenshots/sky-icon-names-example-3.json`,
      JSON.stringify({
        test: 'example test 3',
        file: 'example-test-2.cy.ts',
        iconNames: ['icon2', 'icon3', 'icon4'],
      }),
    );

    await applicationGenerator(tree, {
      name: 'icon-e2e',
      directory: 'apps/icon-e2e',
      formatter: 'none',
      framework: 'none',
      tags: 'icons-e2e',
      unitTestRunner: 'none',
    });
    await configurationGenerator(tree, {
      project: 'icon-e2e',
    });
    tree.write(
      `dist/cypress/apps/e2e/icon-e2e/screenshots/sky-icon-names-icon.json`,
      JSON.stringify({
        test: 'icon',
        file: 'icon.cy.ts',
        iconNames: ['icon1', 'icon2', 'icon3', 'icon4'],
      }),
    );

    await applicationGenerator(tree, {
      name: 'project-without-e2e',
      directory: 'apps/project-without-e2e',
      formatter: 'none',
      framework: 'none',
      tags: 'icons-e2e',
      unitTestRunner: 'none',
    });

    await applicationGenerator(tree, {
      name: 'project-without-inventory',
      directory: 'apps/project-without-inventory',
      formatter: 'none',
      framework: 'none',
      tags: 'icons-e2e',
      unitTestRunner: 'none',
    });
    await configurationGenerator(tree, {
      project: 'project-without-inventory',
    });
  });

  it('should run successfully', () => {
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    updateIconsE2eGenerator(tree);

    const config = readProjectConfiguration(tree, 'test');
    expect(config.metadata?.['icons-e2e']).toEqual({
      icons: ['icon1', 'icon2', 'icon3', 'icon4', 'icon5'],
    });
    expect(config.tags).toEqual([
      'icons-e2e',
      'icon:icon1',
      'icon:icon2',
      'icon:icon3',
      'icon:icon4',
      'icon:icon5',
    ]);
    expect(config.targets?.['e2e'].configurations?.['icons-e2e']).toEqual({
      spec: '**/example-test-1.cy.ts,**/example-test-2.cy.ts',
    });

    expect(consoleWarnMock).toHaveBeenCalledWith(
      'Project project-without-e2e does not have a Cypress e2e target. Skipping...',
    );
    expect(consoleWarnMock).toHaveBeenCalledWith(
      'Unable to find icon inventory files in dist/cypress/apps/e2e/project-without-inventory/screenshots. Run one of the following commands to generate them:',
    );

    const iconProject = readProjectConfiguration(tree, 'icon-e2e');
    expect(iconProject.metadata?.['icons-e2e']).toEqual({
      icons: ['icon1', 'icon2', 'icon3', 'icon4'],
    });
    expect(iconProject.tags).toEqual(['icons-e2e']);

    consoleWarnMock.mockRestore();
  });
});
