import {
  NxJsonConfiguration,
  ProjectConfiguration,
  readJson,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { createTestApplication, createTestLibrary } from '../../utils/testing';
import { updateJson } from '../../utils/update-json';

import componentE2eGenerator from './index';

describe('component-e2e', () => {
  function setupTest() {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const nxJson: NxJsonConfiguration = readNxJson(tree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(tree, nxJson);

    tree.write('.gitignore', '');

    return { tree };
  }

  it('should create e2e infrastructure for a component', async () => {
    const { tree } = setupTest();
    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    updateJson(tree, 'nx.json', (nxJson: NxJsonConfiguration) => {
      nxJson.targetDefaults = nxJson.targetDefaults || {};
      nxJson.targetDefaults['build-storybook'] =
        nxJson.targetDefaults['build-storybook'] || {};
      nxJson.targetDefaults['build-storybook'].inputs =
        nxJson.targetDefaults['build-storybook'].inputs || [];
      nxJson.targetDefaults['build-storybook'].inputs.push(
        '!{projectRoot}/.storybook/**/*',
      );
      nxJson.namedInputs = nxJson.namedInputs || {};
      nxJson.namedInputs['production'] = nxJson.namedInputs['production'] || [];
      nxJson.namedInputs['production'].push(
        '!{projectRoot}/.storybook/**/*',
        '!{projectRoot}/**/*.stories.@(js|ts)',
      );
      return nxJson;
    });
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    const config: Record<string, ProjectConfiguration> = {};
    for (const projectName of ['test-storybook', 'test-storybook-e2e']) {
      config[projectName] = readProjectConfiguration(tree, projectName);
      expect(config[projectName].projectType).toEqual('application');
    }
    expect(
      tree.exists(`${config['test-storybook'].root}/.storybook/main.ts`),
    ).toBeTruthy();
    expect(
      tree.read(
        `${config['test-storybook'].sourceRoot}/app/app.module.ts`,
        'utf8',
      ),
    ).toMatchSnapshot();
    expect(
      tree.isFile(
        `${config['test-storybook'].sourceRoot}/app/app.component.spec.ts`,
      ),
    ).toBeFalsy();
    expect(
      tree.isFile(
        `${config['test-storybook'].sourceRoot}/app/nx-welcome.component.ts`,
      ),
    ).toBeFalsy();
    expect(
      tree.exists(`${config['test-storybook-e2e'].sourceRoot}/support/e2e.ts`),
    ).toBeTruthy();
    expect(
      tree.read(
        `${config['test-storybook-e2e'].sourceRoot}/support/e2e.ts`,
        'utf-8',
      ),
    ).toContain('percy');
  });

  it('should use the SKY shared eslint configs', async () => {
    const { tree } = setupTest();
    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });

    const storybookRoot = readProjectConfiguration(tree, 'test-storybook').root;
    const e2eRoot = readProjectConfiguration(tree, 'test-storybook-e2e').root;

    expect(tree.exists(`${storybookRoot}/eslint.config.cjs`)).toBeFalsy();
    expect(tree.read(`${storybookRoot}/eslint.config.js`, 'utf-8')).toEqual(
      `const config = require('../../../eslint-storybook.config');\n\nmodule.exports = config;\n`,
    );

    expect(tree.exists(`${e2eRoot}/eslint.config.cjs`)).toBeFalsy();
    expect(tree.read(`${e2eRoot}/eslint.config.js`, 'utf-8')).toEqual(
      `const config = require('../../../eslint-e2e.config');\n\nmodule.exports = config;\n`,
    );
  });

  it('should add an eslint-disable comment to the storybook manager', async () => {
    const { tree } = setupTest();
    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });

    const storybookRoot = readProjectConfiguration(tree, 'test-storybook').root;
    expect(
      tree.read(`${storybookRoot}/.storybook/manager.ts`, 'utf-8'),
    ).toEqual(
      `// eslint-disable-next-line @nx/enforce-module-boundaries\nexport * from '../../../../.storybook/manager';\n`,
    );
  });

  it('should error without a name', async () => {
    const { tree } = setupTest();
    try {
      await componentE2eGenerator(tree, { name: '', skipFormat: true });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Please provide the component library name',
      );
    }
  });

  it('should handle tagging', async () => {
    const { tree } = setupTest();
    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    await componentE2eGenerator(tree, {
      name: 'test',
      tags: 'one, two',
      skipFormat: true,
    });
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.tags).toContain('one');
  });

  it('should allow being called twice', async () => {
    const spy = jest.spyOn(console, 'warn');
    const { tree } = setupTest();
    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    await componentE2eGenerator(tree, { name: 'test', skipFormat: true });
    await componentE2eGenerator(tree, {
      name: 'test',
      ansiColor: false,
      skipFormat: true,
    });
    expect(spy).toHaveBeenCalledWith(
      `The project "test-storybook" already exists.`,
    );
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.projectType).toEqual('application');
  });

  it('should move the projects to a subdirectory', async () => {
    const { tree } = setupTest();

    await createTestLibrary(tree, { name: 'storybook' });
    await createTestLibrary(tree, { name: 'test-component' });
    await createTestApplication(tree, {
      name: 'test-component-storybook',
      e2eTestRunner: true,
      unitTestRunner: true,
    });
    await componentE2eGenerator(tree, {
      name: 'test-component',
      skipFormat: true,
    });
    const config = readProjectConfiguration(tree, 'test-component-storybook');
    expect(config.root).toEqual('apps/e2e/test-component-storybook');
  });

  it('should maintain storybook version', async () => {
    const { tree } = setupTest();
    const sbVersion = '^7.0.8';
    tree.write(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@storybook/addon-a11y': sbVersion,
          '@storybook/addon-actions': sbVersion,
          '@storybook/addon-controls': sbVersion,
          '@storybook/addon-toolbars': sbVersion,
          '@storybook/addon-viewport': sbVersion,
          '@storybook/angular': sbVersion,
          '@storybook/core-server': sbVersion,
        },
      }),
    );
    await createTestLibrary(tree, { name: 'storybook' });
    await componentE2eGenerator(tree, {
      name: 'test-component',
      skipFormat: true,
    });
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@storybook/angular']).toEqual(
      sbVersion,
    );
  });
});
