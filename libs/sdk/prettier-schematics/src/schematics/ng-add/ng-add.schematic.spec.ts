import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import commentJson from 'comment-json';
import path from 'path';

import { createTestApp, createTestLibrary } from '../testing/scaffold';

import { SkyPrettierAddOptions } from './schema';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');
const eslintConfigPath = '.eslintrc.json';

describe('ng-add.schematic', () => {
  const defaultProjectName = 'my-lib';

  async function setup(options?: {
    setupAngularEslint?: boolean;
    projectType: 'application' | 'library';
  }): Promise<{
    runner: SchematicTestRunner;
    runSchematic: (options?: SkyPrettierAddOptions) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const tree =
      options?.projectType === 'application'
        ? await createTestApp(runner, {
            setupEslint: !!options.setupAngularEslint,
            projectName: defaultProjectName,
          })
        : await createTestLibrary(runner, {
            setupEslint: !!options?.setupAngularEslint,
            projectName: defaultProjectName,
          });

    if (!options?.setupAngularEslint) {
      tree.create(eslintConfigPath, '{}');
    }

    return {
      runner,
      runSchematic: (options?: SkyPrettierAddOptions) =>
        runner.runSchematic('ng-add', options, tree),
      tree,
    };
  }

  function validateJsonFile(
    tree: UnitTestTree,
    path: string,
    expectedContents: unknown,
  ): void {
    const contents = commentJson.parse(tree.readContent(path));
    expect(contents).toEqual(expectedContents);
  }

  it('should run the NodePackageInstallTask', async () => {
    const { runSchematic, runner } = await setup();

    await runSchematic();

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true,
    );
  });

  it('should throw an error if ESLint is not configured.', async () => {
    const { runSchematic, tree } = await setup();

    tree.delete(eslintConfigPath);

    await expect(() => runSchematic()).rejects.toThrow(
      `No ESLint configuration file found in workspace. ESLint must be installed and configured before installing Prettier. See https://github.com/angular-eslint/angular-eslint#readme for instructions.`,
    );
  });

  it('should install the expected packages', async () => {
    const { runSchematic } = await setup();
    const updatedTree = await runSchematic();

    validateJsonFile(
      updatedTree,
      'package.json',
      expect.objectContaining({
        devDependencies: expect.objectContaining({
          prettier: '^3.5.3',
          'eslint-config-prettier': '^10.1.2',
        }),
      }),
    );
  });

  it('should add "skyux:format" to package.json\'s "scripts" array', async () => {
    const { runSchematic, tree } = await setup();

    // Clear the existing `scripts` property to test whether it gets added by the schematic.
    tree.overwrite('package.json', '{}');

    const updatedTree = await runSchematic();

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
    const { runSchematic } = await setup();

    const updatedTree = await runSchematic();

    validateJsonFile(updatedTree, '.prettierrc.json', {
      singleQuote: true,
    });
  });

  it('should not write Prettier config if already exists', async () => {
    const { runSchematic, tree } = await setup();

    tree.create('.prettierrc', '{"original": true}');
    tree.create('.prettierrc.json', '{"original": true}');

    const updatedTree = await runSchematic();

    validateJsonFile(updatedTree, '.prettierrc', {
      original: true,
    });
    validateJsonFile(updatedTree, '.prettierrc.json', {
      original: true,
    });
  });

  it('should write Prettier ignore', async () => {
    const { runSchematic } = await setup();

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

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

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

    // Empty the .vscode folder.
    tree.getDir('.vscode').visit((file) => tree.delete(file));

    const updatedTree = await runSchematic();

    expect(updatedTree.exists('.vscode/extensions.json')).toEqual(false);
  });

  it('should configure VSCode', async () => {
    const { runSchematic } = await setup();

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

    tree.delete('.vscode/extensions.json');

    const updatedTree = await runSchematic();

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
    const { runSchematic, tree } = await setup();

    tree.overwrite(
      '.vscode/extensions.json',
      commentJson.stringify({
        recommendations: ['esbenp.prettier-vscode', 'foobar'],
      }),
    );
    tree.create('.vscode/settings.json', '{}');

    const updatedTree = await runSchematic();

    validateJsonFile(updatedTree, '.vscode/extensions.json', {
      recommendations: ['esbenp.prettier-vscode', 'foobar'],
    });
  });

  it('should work with ESLint flat config files (app)', async () => {
    const { runSchematic } = await setup({
      setupAngularEslint: true,
      projectType: 'application',
    });

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('eslint.config.js')).toMatchSnapshot();
  });

  it('should work with ESLint flat config files (library)', async () => {
    const { runSchematic } = await setup({
      setupAngularEslint: true,
      projectType: 'library',
    });

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('/eslint.config.js')).toMatchSnapshot();
  });

  it('should setup prettier import sorting', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: true,
      projectType: 'application',
    });

    await runSchematic({ importSorting: true });

    const expectedConfig = {
      singleQuote: true,
      importOrder: ['^@(.*)$', '^\\w(.*)$', '^(../)(.*)$', '^(./)(.*)$'],
      importOrderSeparation: true,
      importOrderSortSpecifiers: true,
      importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
      plugins: ['@trivago/prettier-plugin-sort-imports'],
    };

    expect(JSON.parse(tree.readText('/.prettierrc.json'))).toEqual(
      expectedConfig,
    );

    // Run it again to make sure it's idempotent.
    await runSchematic({ importSorting: true });

    expect(JSON.parse(tree.readText('/.prettierrc.json'))).toEqual(
      expectedConfig,
    );
  });

  it('should handle ESM config files', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: true,
      projectType: 'application',
    });

    tree.delete('/eslint.config.js');
    tree.create(
      '/eslint.config.mjs',
      `// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
`,
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('eslint.config.mjs')).toMatchSnapshot();
  });

  it('should be idempotent', async () => {
    const { runSchematic } = await setup({
      setupAngularEslint: true,
      projectType: 'application',
    });

    const expectedConfig = `// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
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
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]  ,prettier
);
`;

    let updatedTree = await runSchematic();

    expect(updatedTree.readText('/eslint.config.js')).toEqual(expectedConfig);

    // Run the schematic again, to confirm change wasn't made twice.
    updatedTree = await runSchematic();

    expect(updatedTree.readText('/eslint.config.js')).toEqual(expectedConfig);
  });

  it('should handle flat config without export statement', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    // Create a flat config file with closing parenthesis but no module.exports
    tree.create(
      '/eslint.config.js',
      `const eslint = require("@eslint/js");

defineConfig([
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended],
  }
])
`,
    );

    const updatedTree = await runSchematic();

    // Should not modify the file since there's no export statement
    expect(updatedTree.readText('/eslint.config.js')).toEqual(
      tree.readText('/eslint.config.js'),
    );
  });

  it('should handle flat config without closing parenthesis', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    tree.create(
      '/eslint.config.js',
      `const eslint = require("@eslint/js");

module.exports = {
  extends: [eslint.configs.recommended],
};
`,
    );

    const updatedTree = await runSchematic();

    // Should not modify the file since there's no array pattern with closing parenthesis
    expect(updatedTree.readText('/eslint.config.js')).toEqual(
      tree.readText('/eslint.config.js'),
    );
  });

  it('should add comma when needed in flat config', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    tree.create(
      '/eslint.config.js',
      `const eslint = require("@eslint/js");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended]
  }
]);
`,
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('/eslint.config.js')).toContain(',prettier');
  });

  it('should not add comma when already present in flat config', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    tree.create(
      '/eslint.config.js',
      `const eslint = require("@eslint/js");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended],
  }
]);
`,
    );

    const updatedTree = await runSchematic();

    const content = updatedTree.readText('/eslint.config.js');
    // Should not have double comma
    expect(content).not.toContain(',,prettier');
    expect(content).toContain('prettier');
  });

  it('should be idempotent for flat config with trailing whitespace', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    tree.create(
      '/eslint.config.js',
      `const eslint = require("@eslint/js");
const prettier = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended]
  }
]  ,prettier
);
`,
    );

    const originalContent = tree.readText('/eslint.config.js');
    const updatedTree = await runSchematic();

    // Should not modify since prettier import already exists
    expect(updatedTree.readText('/eslint.config.js')).toEqual(originalContent);
  });

  it('should be idempotent for ESM flat config', async () => {
    const { runSchematic, tree } = await setup({
      setupAngularEslint: false,
      projectType: 'application',
    });

    tree.create(
      '/eslint.config.mjs',
      `import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended],
  }
],prettier
);
`,
    );

    const originalContent = tree.readText('/eslint.config.mjs');
    const updatedTree = await runSchematic();

    // Should not modify since prettier import already exists
    expect(updatedTree.readText('/eslint.config.mjs')).toEqual(originalContent);
  });
});
