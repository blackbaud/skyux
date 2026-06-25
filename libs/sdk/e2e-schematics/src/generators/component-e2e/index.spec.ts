import { logger, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import componentE2eGenerator from './index';

describe('component-e2e', () => {
  function setupTest() {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '');
    return { tree };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should scaffold a storybook and e2e project pair', async () => {
    const { tree } = setupTest();
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });

    for (const projectName of ['test-storybook', 'test-storybook-e2e']) {
      const config = readProjectConfiguration(tree, projectName);
      expect(config.projectType).toEqual('application');
    }

    const storybookRoot = 'apps/e2e/test-storybook';
    const e2eRoot = 'apps/e2e/test-storybook-e2e';

    // Storybook project uses the modern standalone structure (no NgModule).
    expect(
      tree.exists(`${storybookRoot}/src/app/app.component.ts`),
    ).toBeTruthy();
    expect(tree.exists(`${storybookRoot}/src/app/app.module.ts`)).toBeFalsy();
    expect(tree.exists(`${storybookRoot}/.storybook/main.ts`)).toBeTruthy();

    // The build target uses the esbuild-based application builder.
    const storybookConfig = readProjectConfiguration(tree, 'test-storybook');
    expect(storybookConfig.targets?.['build']?.executor).toEqual(
      '@angular/build:application',
    );

    // Name substitution flows through to the index.html title.
    expect(tree.read(`${storybookRoot}/src/index.html`, 'utf-8')).toContain(
      '<title>TestStorybook</title>',
    );

    // The e2e project wires Percy and points at the storybook dev server.
    expect(tree.exists(`${e2eRoot}/src/e2e/.gitkeep`)).toBeTruthy();
    expect(tree.exists(`${e2eRoot}/src/support/commands.ts`)).toBeTruthy();
    expect(tree.read(`${e2eRoot}/src/support/e2e.ts`, 'utf-8')).toContain(
      'percy',
    );
    const e2eConfig = readProjectConfiguration(tree, 'test-storybook-e2e');
    expect(e2eConfig.targets?.['e2e']?.options?.['devServerTarget']).toEqual(
      'test-storybook:storybook',
    );
    expect(e2eConfig.implicitDependencies).toEqual(['test-storybook']);
  });

  it('should use the SKY shared eslint configs', async () => {
    const { tree } = setupTest();
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });

    expect(
      tree.read('apps/e2e/test-storybook/eslint.config.js', 'utf-8'),
    ).toEqual(
      `const config = require('../../../eslint-storybook.config');\n\nmodule.exports = config;\n`,
    );
    expect(
      tree.read('apps/e2e/test-storybook-e2e/eslint.config.js', 'utf-8'),
    ).toEqual(
      `const config = require('../../../eslint-e2e.config');\n\nmodule.exports = config;\n`,
    );
  });

  it('should add an eslint-disable comment to the storybook manager', async () => {
    const { tree } = setupTest();
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });

    expect(
      tree.read('apps/e2e/test-storybook/.storybook/manager.ts', 'utf-8'),
    ).toEqual(
      `// eslint-disable-next-line @nx/enforce-module-boundaries\nexport * from '../../../../.storybook/manager';\n`,
    );
  });

  it('should error without a name', async () => {
    const { tree } = setupTest();
    await expect(
      componentE2eGenerator(tree, { name: '', skipFormat: true }),
    ).rejects.toThrow('Please provide the component library name');
  });

  it('should always tag the project with component-e2e', async () => {
    const { tree } = setupTest();
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.tags).toEqual(['component-e2e']);
  });

  it('should parse tags and ignore empty entries', async () => {
    const { tree } = setupTest();
    await componentE2eGenerator(tree, {
      name: 'test',
      tags: 'one, , two',
      skipFormat: true,
    });
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.tags).toEqual(['one', 'two', 'component-e2e']);
  });

  it('should warn and skip when the pair already exists', async () => {
    const { tree } = setupTest();
    const loggerSpy = jest.spyOn(logger, 'warn').mockImplementation();
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    const original = tree.read('apps/e2e/test-storybook/project.json', 'utf-8');

    // Second call uses ansi color logging (logger.warn).
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    expect(loggerSpy).toHaveBeenCalledWith(
      'The project "test-storybook" already exists.',
    );

    // Third call disables ansi color logging (console.warn).
    await componentE2eGenerator(tree, {
      name: 'test',
      ansiColor: false,
      skipFormat: true,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      'The project "test-storybook" already exists.',
    );

    // The existing project is left untouched.
    expect(tree.read('apps/e2e/test-storybook/project.json', 'utf-8')).toEqual(
      original,
    );
  });
});
