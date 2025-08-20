import { externalSchematic } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../shared/testing/scaffold';
import { EsLintConfig } from '../shared/types/eslint-config';
import { PackageJson } from '../shared/types/package-json';
import { readJsonFile } from '../shared/utility/tree';

import { NgAddSchema } from './schema';

jest.mock('@angular-devkit/schematics', () => {
  const original = jest.requireActual('@angular-devkit/schematics');
  return {
    ...original,
    externalSchematic: jest.fn(),
  };
});

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');
const ESLINT_CONFIG_PATH = './.eslintrc.json';

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-app';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  async function setupTest(options: {
    esLintConfig: EsLintConfig;
    packageJson?: PackageJson;
  }): Promise<{
    runSchematic: (options?: NgAddSchema) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
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

    const runSchematic = (
      schematicOptions: NgAddSchema = {},
    ): Promise<UnitTestTree> => {
      return runner.runSchematic('ng-add', schematicOptions, tree);
    };

    return {
      runSchematic,
      tree,
    };
  }

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

    await runSchematic({ useRecommendedPackage: false });

    expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual(
      expect.objectContaining({
        overrides: [
          {
            extends: ['@skyux-sdk/eslint-config/recommended'],
            files: ['*.ts'],
          },
        ],
      }),
    );
  });

  it('should enable strict null checks', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {
        overrides: [
          {
            files: ['*.ts'],
          },
        ],
      },
    });

    await runSchematic({ useRecommendedPackage: false });

    expect(readJsonFile(tree, 'tsconfig.json')).toEqual(
      expect.objectContaining({
        compilerOptions: expect.objectContaining({
          strictNullChecks: true,
        }),
      }),
    );
  });

  it('should skip configuration if "overrides" undefined', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
    });

    await runSchematic({ useRecommendedPackage: false });

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

    await runSchematic({ useRecommendedPackage: false });

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

    await expect(() =>
      runSchematic({ useRecommendedPackage: false }),
    ).rejects.toThrowError(
      "The package 'angular-eslint' is not installed. " +
        "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
        'See: https://github.com/angular-eslint/angular-eslint#quick-start',
    );
  });

  it("should not abort if 'angular-eslint' is installed", async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
      packageJson: {
        devDependencies: {
          'angular-eslint': '*',
        },
      },
    });

    await runSchematic({ useRecommendedPackage: false });
    expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual({});
  });

  it('should harden the version of the @skyux-sdk/eslint-config package', async () => {
    const { runSchematic, tree } = await setupTest({
      esLintConfig: {},
      packageJson: {
        devDependencies: {
          '@angular-eslint/schematics': '*',
        },
      },
    });

    await runSchematic({ useRecommendedPackage: false });

    const packageJson = readJsonFile(tree, '/package.json') as PackageJson;
    expect(packageJson.devDependencies?.['@skyux-sdk/eslint-config']).toEqual(
      '0.0.0-PLACEHOLDER',
    );
  });

  describe('useRecommendedPackage option', () => {
    it('should call externalSchematic when useRecommendedPackage is true', async () => {
      const mockExternalSchematic = externalSchematic as jest.MockedFunction<
        typeof externalSchematic
      >;
      mockExternalSchematic.mockReturnValue(() => Promise.resolve());

      const { runSchematic } = await setupTest({
        esLintConfig: {},
        packageJson: {
          devDependencies: {
            '@angular-eslint/schematics': '*',
          },
        },
      });

      await runSchematic({ useRecommendedPackage: true });

      expect(mockExternalSchematic).toHaveBeenCalledWith(
        'eslint-config-skyux',
        'ng-add',
        {},
      );
    });

    it('should not call externalSchematic when useRecommendedPackage is false', async () => {
      const mockExternalSchematic = externalSchematic as jest.MockedFunction<
        typeof externalSchematic
      >;

      const { runSchematic, tree } = await setupTest({
        esLintConfig: {
          overrides: [
            {
              files: ['*.ts'],
            },
          ],
        },
        packageJson: {
          devDependencies: {
            '@angular-eslint/schematics': '*',
          },
        },
      });

      await runSchematic({ useRecommendedPackage: false });

      expect(mockExternalSchematic).not.toHaveBeenCalled();

      expect(readJsonFile(tree, ESLINT_CONFIG_PATH)).toEqual(
        expect.objectContaining({
          overrides: [
            {
              extends: ['@skyux-sdk/eslint-config/recommended'],
              files: ['*.ts'],
            },
          ],
        }),
      );
    });
  });
});
