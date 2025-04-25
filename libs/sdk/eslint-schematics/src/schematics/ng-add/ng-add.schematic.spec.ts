import { stripIndents } from '@angular-devkit/core/src/utils/literals.js';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../testing/scaffold.js';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add', () => {
  async function setup(options: {
    angularEslintInstalled: boolean;
    eslintVersion?: string;
    projectType?: 'library' | 'application';
  }): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const tree =
      options.projectType === 'library'
        ? await createTestLibrary(runner, {
            projectName: 'foo',
            setupEslint: options.angularEslintInstalled,
          })
        : await createTestApp(runner, {
            projectName: 'foo',
            setupEslint: options.angularEslintInstalled,
          });

    if (options.eslintVersion) {
      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.devDependencies['eslint'] = options.eslintVersion;
      tree.overwrite('/package.json', JSON.stringify(packageJson));
    }

    return {
      runSchematic: () => runner.runSchematic('ng-add', {}, tree),
      tree,
    };
  }

  it('should modify existing eslint config for an application', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    expect(stripIndents`${tree.readText('/eslint.config.js')}`).toEqual(
      stripIndents`// @ts-check
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

    await runSchematic();

    expect(tree.readText('/eslint.config.js')).toEqual(`// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const skyux = require("skyux-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
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
      ...skyux.configs.templateRecommended,
    ],
    rules: {},
  }
);
`);
  });

  it('should modify library eslint config', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
      projectType: 'library',
    });

    expect(tree.readText('/eslint.config.js')).toEqual(
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
    rules: {},
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

    const libEslintContents = `// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "lib",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "lib",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
);
`;

    const showcaseEslintContents = `// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
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
    rules: {},
  }
);
`;

    expect(tree.readText('/projects/foo/eslint.config.js')).toEqual(
      libEslintContents,
    );

    expect(tree.readText('/projects/foo-showcase/eslint.config.js')).toEqual(
      showcaseEslintContents,
    );

    await runSchematic();

    expect(tree.readText('/eslint.config.js')).toEqual(`// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const skyux = require("skyux-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {},
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      ...skyux.configs.templateRecommended,
    ],
    rules: {},
  }
);
`);

    expect(tree.readText('/projects/foo/eslint.config.js')).toEqual(
      libEslintContents,
    );

    expect(tree.readText('/projects/foo-showcase/eslint.config.js')).toEqual(
      showcaseEslintContents,
    );
  });

  it('should throw if angular-eslint not installed', async () => {
    const { runSchematic } = await setup({
      angularEslintInstalled: false,
    });

    await expect(() => runSchematic()).rejects.toThrow(
      "The package 'angular-eslint' is not installed. " +
        `Run 'ng add angular-eslint@19' and try this command again.\n` +
        'See: https://github.com/angular-eslint/angular-eslint#quick-start',
    );
  });

  it('should throw if eslint 8 installed', async () => {
    const { runSchematic } = await setup({
      angularEslintInstalled: true,
      eslintVersion: '8.1.0',
    });

    await expect(() => runSchematic()).rejects.toThrow(
      "The 'skyux-eslint' package requires eslint version 9.",
    );
  });

  it('should throw if .eslintrc.json file exists', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    tree.delete('/eslint.config.js');
    tree.create('.eslintrc.json', '{}');

    await expect(() => runSchematic()).rejects.toThrow(
      "The 'skyux-eslint' package does not support ESLint's legacy config. " +
        'Migrate to ESLint\'s "flat" config and try the command again.',
    );
  });

  it('should throw if eslint.config.js not found', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    tree.delete('/eslint.config.js');

    await expect(() => runSchematic()).rejects.toThrow(
      'A compatible ESLint config file could not be found.',
    );
  });

  it('should abort if config already added', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    const expectedContents = `// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const skyux = require("skyux-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
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
      ...skyux.configs.templateRecommended,
    ],
    rules: {},
  }
);
`;

    await runSchematic();

    expect(tree.readText('/eslint.config.js')).toEqual(expectedContents);

    // Run the schematic again, to confirm change wasn't made twice.
    await runSchematic();

    expect(tree.readText('/eslint.config.js')).toEqual(expectedContents);
  });
});
