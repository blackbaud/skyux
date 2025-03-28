import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import commentJson from 'comment-json';
import path from 'path';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');
const eslintConfigPath = '.eslintrc.json';

describe('ng-add.schematic', () => {
  const defaultProjectName = 'my-lib';

  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });

    tree.create(eslintConfigPath, '{}');
  });

  function runSchematic(tree: UnitTestTree): Promise<UnitTestTree> {
    return runner.runSchematic(
      'ng-add',
      {
        project: defaultProjectName,
      },
      tree,
    );
  }

  function validateJsonFile(
    tree: UnitTestTree,
    path: string,
    expectedContents: unknown,
  ) {
    const contents = commentJson.parse(tree.readContent(path));
    expect(contents).toEqual(expectedContents);
  }

  it('should run the NodePackageInstallTask', async () => {
    await runSchematic(tree);

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true,
    );
  });

  it('should throw an error if ESLint is not configured.', async () => {
    tree.delete(eslintConfigPath);

    await expect(() => runSchematic(tree)).rejects.toThrowError(
      `No ESLint configuration file found in workspace. ESLint must be installed and configured before installing Prettier. See https://github.com/angular-eslint/angular-eslint#readme for instructions.`,
    );
  });

  it('should install the expected packages', async () => {
    const updatedTree = await runSchematic(tree);

    validateJsonFile(
      updatedTree,
      'package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          prettier: '3.2.5',
          'eslint-config-prettier': '9.1.0',
        }),
      }),
    );
  });

  it('should add "skyux:format" to package.json\'s "scripts" array', async () => {
    // Clear the existing `scripts` property to test whether it gets added by the schematic.
    tree.overwrite('package.json', '{}');

    const updatedTree = await runSchematic(tree);

    validateJsonFile(
      updatedTree,
      'package.json',
      expect.objectContaining({
        scripts: {
          'skyux:format': 'npx prettier --write .',
        },
      }),
    );
  });

  it('should write Prettier config', async () => {
    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, '.prettierrc.json', {
      singleQuote: true,
    });
  });

  it('should not write Prettier config if already exists', async () => {
    tree.create('.prettierrc', '{"original": true}');
    tree.create('.prettierrc.json', '{"original": true}');

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, '.prettierrc', {
      original: true,
    });
    validateJsonFile(updatedTree, '.prettierrc.json', {
      original: true,
    });
  });

  it('should write Prettier ignore', async () => {
    const updatedTree = await runSchematic(tree);

    const prettierIgnore = updatedTree.readContent('.prettierignore');

    expect(prettierIgnore).toEqual(`# Ignore artifacts:
__skyux
coverage
dist
node_modules
package-lock.json

# Ignore assets
/src/assets/
/projects/*/src/assets/

# Ignore standard SPA library path
/src/app/lib/

# Ignore Angular cache
/.angular/cache

# Don't format the following since the order of its import statements is deliberate.
test.ts`);
  });

  it('should configure ESLint if an .eslintrc.json file exists', async () => {
    tree.overwrite(
      eslintConfigPath,
      commentJson.stringify({
        overrides: [
          {
            files: '*.ts',
            extends: ['foo'],
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, eslintConfigPath, {
      extends: ['prettier'],
      overrides: [
        {
          files: '*.ts',
          extends: ['foo', 'prettier'],
        },
      ],
    });
  });

  it('should configure ESLint if an .eslintrc.json file exists only in a project', async () => {
    tree.delete(eslintConfigPath);

    const projectEslintConfigPath = `projects/my-lib/${eslintConfigPath}`;

    tree.create(
      projectEslintConfigPath,
      commentJson.stringify({
        overrides: [
          {
            files: '*.ts',
            extends: ['foo'],
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, projectEslintConfigPath, {
      extends: ['prettier'],
      overrides: [
        {
          files: '*.ts',
          extends: ['foo', 'prettier'],
        },
      ],
    });
  });

  it('should convert an ESLint config `extends` string to an array', async () => {
    tree.overwrite(
      eslintConfigPath,
      commentJson.stringify({
        extends: 'foo',
      }),
    );

    const projectEslintConfigPath = `projects/my-lib/${eslintConfigPath}`;

    tree.create(
      projectEslintConfigPath,
      commentJson.stringify({
        extends: '../../.eslintrc.json',
        overrides: [
          {
            files: '*.ts',
            extends: 'bar',
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, projectEslintConfigPath, {
      extends: ['../../.eslintrc.json', 'prettier'],
      overrides: [
        {
          files: '*.ts',
          extends: ['bar', 'prettier'],
        },
      ],
    });

    validateJsonFile(updatedTree, eslintConfigPath, {
      extends: ['foo', 'prettier'],
    });
  });

  it('should not add an `extends` property to a file override if it does not already exist', async () => {
    tree.overwrite(
      eslintConfigPath,
      commentJson.stringify({
        extends: 'foo',
        overrides: [
          {
            files: '*.ts',
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, eslintConfigPath, {
      extends: ['foo', 'prettier'],
      overrides: [
        {
          files: '*.ts',
        },
      ],
    });
  });

  it('should not add "prettier" to `extends` if it already exists', async () => {
    tree.overwrite(
      eslintConfigPath,
      commentJson.stringify({
        extends: ['foo', 'prettier'],
        overrides: [
          {
            files: '*.ts',
            extends: ['bar', 'prettier'],
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, eslintConfigPath, {
      extends: ['foo', 'prettier'],
      overrides: [
        {
          files: '*.ts',
          extends: ['bar', 'prettier'],
        },
      ],
    });
  });

  it('should move "prettier" to the end of the `extends` array', async () => {
    tree.overwrite(
      eslintConfigPath,
      commentJson.stringify({
        extends: ['prettier', 'foo'],
        overrides: [
          {
            files: '*.ts',
            extends: ['prettier', 'bar'],
          },
        ],
      }),
    );

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, eslintConfigPath, {
      extends: ['foo', 'prettier'],
      overrides: [
        {
          files: '*.ts',
          extends: ['bar', 'prettier'],
        },
      ],
    });
  });

  it('should not configure VSCode if .vscode folder does not exist', async () => {
    // Empty the .vscode folder.
    tree.getDir('.vscode').visit((file) => tree.delete(file));

    const updatedTree = await runSchematic(tree);

    expect(updatedTree.exists('.vscode/extensions.json')).toEqual(false);
  });

  it('should configure VSCode', async () => {
    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, '.vscode/extensions.json', {
      recommendations: ['angular.ng-template', 'esbenp.prettier-vscode'],
    });

    validateJsonFile(updatedTree, '.vscode/settings.json', {
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
      'prettier.requireConfig': true,
    });
  });

  it('should handle missing extensions file', async () => {
    tree.delete('.vscode/extensions.json');

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, '.vscode/extensions.json', {
      recommendations: ['esbenp.prettier-vscode'],
    });

    validateJsonFile(updatedTree, '.vscode/settings.json', {
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.formatOnSave': true,
      'prettier.requireConfig': true,
    });
  });

  it('should ignore existing VSCode config', async () => {
    tree.overwrite(
      '.vscode/extensions.json',
      commentJson.stringify({
        recommendations: ['esbenp.prettier-vscode', 'foobar'],
      }),
    );
    tree.create('.vscode/settings.json', '{}');

    const updatedTree = await runSchematic(tree);

    validateJsonFile(updatedTree, '.vscode/extensions.json', {
      recommendations: ['esbenp.prettier-vscode', 'foobar'],
    });
  });

  it('should work with ESLint flat config files', async () => {
    tree.delete(eslintConfigPath);

    tree.create(
      'eslint.config.js',
      `// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
`,
    );

    const updatedTree = await runSchematic(tree);

    expect(updatedTree.readText('eslint.config.js')).toEqual(`// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier/flat");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
  ,prettier
);
`);
  });
});
