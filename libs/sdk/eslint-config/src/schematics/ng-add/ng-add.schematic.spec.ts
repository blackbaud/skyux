import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../shared/testing/scaffold';
import { EsLintConfig } from '../shared/types/eslint-config';
import { PackageJson } from '../shared/types/package-json';
import { readJsonFile } from '../shared/utility/tree';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');
const ESLINT_CONFIG_PATH = './.eslintrc.json';

jest.useRealTimers();
jest.setTimeout(30000);

describe('ng-add.schematic', () => {
  jest.mock('../shared/utility/get-latest-version', () => ({
    getLatestVersion: jest.fn((_, version) =>
      Promise.resolve(`LATEST_${version}`)
    ),
  }));

  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-app';

  async function setupTest(options: {
    esLintConfig: EsLintConfig;
    packageJson?: PackageJson;
  }) {
    const tree = await createTestApp(runner, {
      defaultProjectName,
    });

    tree.create(ESLINT_CONFIG_PATH, JSON.stringify(options.esLintConfig));

    let packageJson = options.packageJson;
    if (!options.packageJson) {
      packageJson = JSON.parse(tree.readText('package.json')) as PackageJson;
      packageJson.devDependencies ||= {};
      packageJson.devDependencies['@angular-eslint/schematics'] = '*';
    }

    tree.overwrite('package.json', JSON.stringify(packageJson));

    const runSchematic = (options: { project?: string } = {}) => {
      return runner.runSchematic('ng-add', options, tree);
    };

    return {
      runSchematic,
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should install dependencies', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
    });

    await runSchematic();

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true
    );

    const packageJson = readJsonFile(tree, 'package.json');

    expect(packageJson).toEqual(
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          'eslint-plugin-deprecation': 'LATEST_^1.4.1',
        }),
      })
    );
  });

  it('should configure ESLint config', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {
        overrides: [
          {
            files: ['*.ts'],
          },
        ],
      },
    });

    await runSchematic();

    expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual(
      expect.objectContaining({
        overrides: [
          {
            extends: ['@skyux-sdk/eslint-config/recommended'],
            files: ['*.ts'],
          },
        ],
      })
    );
  });

  it('should skip configuration if "overrides" undefined', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
    });

    await runSchematic();

    expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual({});
  });

  it('should keep prettier at the end of the "extends" array', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {
        overrides: [
          {
            extends: ['foobar/recommended', 'prettier'],
            files: ['*.ts'],
          },
        ],
      },
    });

    await runSchematic();

    expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual({
      overrides: [
        {
          extends: ['@skyux-sdk/eslint-config/recommended', 'prettier'],
          files: ['*.ts'],
        },
      ],
    });
  });

  it("should abort if '@angular-eslint/schematics' is not installed", async () => {
    const { runSchematic } = await setupTest({
      esLintConfig: {},
      packageJson: {
        devDependencies: {}, // <-- empty
      },
    });

    await expect(() => runSchematic()).rejects.toThrowError(
      "The package '@angular-eslint/schematics' is not installed. " +
        "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
        'See: https://github.com/angular-eslint/angular-eslint#quick-start'
    );
  });

  it('should harden the version of the @skyux-sdk/eslint-config package', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
      packageJson: {
        devDependencies: {
          '@angular-eslint/schematics': '*',
        }, // <-- empty
      },
    });

    await runSchematic();

    const packageJson = readJsonFile(tree, '/package.json') as PackageJson;
    expect(packageJson.devDependencies?.['@skyux-sdk/eslint-config']).toEqual(
      '0.0.0-PLACEHOLDER'
    );
  });
});
