import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

describe('vscode-eslint-setting.schematic', () => {
  function setupTest(configPath?: string, vscodeSettingsContent?: string) {
    const collectionPath = require.resolve('../../migration-collection.json');
    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = new UnitTestTree(Tree.empty());

    if (configPath) {
      tree.create(configPath, 'TESTING');
    }

    if (vscodeSettingsContent) {
      tree.create('.vscode/settings.json', vscodeSettingsContent);
    }

    return { runner, tree };
  }

  const possibleLegacyConfigFiles = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
  ];

  possibleLegacyConfigFiles.forEach((possibleLegacyConfigFile) => {
    it(`should run successfully (config: ${possibleLegacyConfigFile}, existingSettings: false)`, async () => {
      const { runner, tree } = setupTest(possibleLegacyConfigFile);

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.readJson('.vscode/settings.json')).toEqual({
        'eslint.useFlatConfig': false,
      });
    });

    it(`should run successfully (config: ${possibleLegacyConfigFile}, existingSettings: true)`, async () => {
      const { runner, tree } = setupTest(
        possibleLegacyConfigFile,
        '{ "cSpell.enabled": true }',
      );

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.readJson('.vscode/settings.json')).toEqual({
        'eslint.useFlatConfig': false,
        'cSpell.enabled': true,
      });
    });

    it(`should run successfully (config: ${possibleLegacyConfigFile}, existingSettings: true w/ plugin setting)`, async () => {
      const { runner, tree } = setupTest(
        possibleLegacyConfigFile,
        '{ "cSpell.enabled": true, "eslint.useFlatConfig": false }',
      );

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.readJson('.vscode/settings.json')).toEqual({
        'eslint.useFlatConfig': false,
        'cSpell.enabled': true,
      });
    });
  });

  it(`should run successfully (config: package.json with config, existingSettings: false)`, async () => {
    const { runner, tree } = setupTest();

    const packageJsonContents = {
      eslintConfig: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'eslint.useFlatConfig': false,
    });
  });

  it(`should run successfully (config: package.json with config, existingSettings: true)`, async () => {
    const { runner, tree } = setupTest(undefined, '{ "cSpell.enabled": true }');

    const packageJsonContents = {
      eslintConfig: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'eslint.useFlatConfig': false,
      'cSpell.enabled': true,
    });
  });

  it(`should run successfully (config: package.json with config, existingSettings: true w/ plugin setting)`, async () => {
    const { runner, tree } = setupTest(
      undefined,
      '{ "cSpell.enabled": true, "eslint.useFlatConfig": false }',
    );

    const packageJsonContents = {
      eslintConfig: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'eslint.useFlatConfig': false,
      'cSpell.enabled': true,
    });
  });

  it(`should run successfully (config: package.json with no config, existingSettings: false)`, async () => {
    const { runner, tree } = setupTest();

    const packageJsonContents = {
      dependencies: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.exists('.vscode/settings.json')).toBeFalsy();
  });

  it(`should run successfully (config: package.json with no config, existingSettings: true)`, async () => {
    const { runner, tree } = setupTest(undefined, '{ "cSpell.enabled": true }');

    const packageJsonContents = {
      dependencies: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'cSpell.enabled': true,
    });
  });

  it(`should run successfully (config: package.json with no config, existingSettings: true w/ plugin setting)`, async () => {
    const { runner, tree } = setupTest(
      undefined,
      '{ "cSpell.enabled": true, "eslint.useFlatConfig": false }',
    );

    const packageJsonContents = {
      dependencies: {},
    };
    tree.create('/package.json', JSON.stringify(packageJsonContents));

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'eslint.useFlatConfig': false,
      'cSpell.enabled': true,
    });
  });

  it(`should run successfully (config: none, existingSettings: false)`, async () => {
    const { runner, tree } = setupTest();

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.exists('.vscode/settings.json')).toBeFalsy();
  });

  it(`should run successfully (config: none, existingSettings: true)`, async () => {
    const { runner, tree } = setupTest(undefined, '{ "cSpell.enabled": true }');

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'cSpell.enabled': true,
    });
  });

  it(`should run successfully (config: none, existingSettings: true w/ plugin setting)`, async () => {
    const { runner, tree } = setupTest(
      undefined,
      '{ "cSpell.enabled": true, "eslint.useFlatConfig": false }',
    );

    await runner.runSchematic('vscode-eslint-setting', undefined, tree);
    expect(tree.readJson('.vscode/settings.json')).toEqual({
      'eslint.useFlatConfig': false,
      'cSpell.enabled': true,
    });
  });

  const possibleFlatConfigFiles = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mts',
    'eslint.config.cts',
  ];

  possibleFlatConfigFiles.forEach((possibleFlatConfigFile) => {
    it(`should run successfully (config: ${possibleFlatConfigFile}, existingSettings: false)`, async () => {
      const { runner, tree } = setupTest(possibleFlatConfigFile);

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.exists('.vscode/settings.json')).toBeFalsy();
    });

    it(`should run successfully (config: ${possibleFlatConfigFile}, existingSettings: true)`, async () => {
      const { runner, tree } = setupTest(
        possibleFlatConfigFile,
        '{ "cSpell.enabled": true }',
      );

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.readJson('.vscode/settings.json')).toEqual({
        'cSpell.enabled': true,
      });
    });

    it(`should run successfully (config: ${possibleFlatConfigFile}, existingSettings: true w/ plugin setting)`, async () => {
      const { runner, tree } = setupTest(
        possibleFlatConfigFile,
        '{ "cSpell.enabled": true, "eslint.useFlatConfig": true }',
      );

      await runner.runSchematic('vscode-eslint-setting', undefined, tree);
      expect(tree.readJson('.vscode/settings.json')).toEqual({
        'eslint.useFlatConfig': true,
        'cSpell.enabled': true,
      });
    });
  });
});
