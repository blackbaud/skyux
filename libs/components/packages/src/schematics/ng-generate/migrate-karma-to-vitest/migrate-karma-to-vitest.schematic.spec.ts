import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('Generate > Migrate karma to vitest', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, '../../../../collection.json'),
  );

  function setupTree(
    files: Record<string, string>,
    devDependencies: Record<string, string> = {
      '@skyux-sdk/testing': '^15.0.0',
    },
  ): Tree {
    const tree = Tree.empty();

    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {},
          },
        },
      }),
    );

    tree.create(
      '/package.json',
      JSON.stringify({ name: 'test', devDependencies }),
    );

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return tree;
  }

  async function runSchematic(tree: Tree): Promise<string[]> {
    const warnings: string[] = [];

    const subscription = runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnings.push(entry.message);
      }
    });

    try {
      await runner.runSchematic('migrate-karma-to-vitest', {}, tree);
    } finally {
      subscription.unsubscribe();
    }

    return warnings;
  }

  function getDevDependencies(tree: Tree): Record<string, string> {
    return JSON.parse(tree.readText('/package.json')).devDependencies;
  }

  it('should skip the migration if the deprecated package is not installed', async () => {
    const tree = setupTree(
      {
        '/src/app/test.spec.ts': `import { expect } from '@skyux-sdk/testing';\n`,
      },
      {},
    );

    const warnings = await runSchematic(tree);

    expect(warnings).toEqual([
      "Dependency '@skyux-sdk/testing' not installed. Skipping migration.",
    ]);
    expect(tree.readText('/src/app/test.spec.ts')).toBe(
      `import { expect } from '@skyux-sdk/testing';\n`,
    );
  });

  it('should skip the migration if the supported package is already installed', async () => {
    const tree = setupTree(
      {
        '/src/app/test.spec.ts': `import { expect } from '@skyux-sdk/testing';\n`,
      },
      {
        '@skyux-sdk/testing': '^15.0.0',
        '@skyux-sdk/vitest': '^15.0.0',
      },
    );

    const warnings = await runSchematic(tree);

    expect(warnings).toEqual([
      "Dependency '@skyux-sdk/vitest' already installed. Skipping migration.",
    ]);
    expect(getDevDependencies(tree)).toEqual({
      '@skyux-sdk/testing': '^15.0.0',
      '@skyux-sdk/vitest': '^15.0.0',
    });
  });

  it('should swap the deprecated package with the supported package', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { expect } from '@skyux-sdk/testing';
import { SkyA11yAnalyzerConfig } from '@skyux-sdk/testing';

describe('test', () => {
  const config: SkyA11yAnalyzerConfig = {};
  expect(config).toBeDefined();
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts'))
      .toBe(`import { SkyToBeAccessibleOptions } from '@skyux-sdk/vitest';

describe('test', () => {
  const config: SkyToBeAccessibleOptions = {};
  expect(config).toBeDefined();
});
`);
  });

  it('should combine multiple imports of the supported package', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyToBeVisibleOptions } from '@skyux-sdk/vitest';
import { expectAsync, SkyA11yAnalyzerConfig } from '@skyux-sdk/testing';

describe('test', () => {
  const options: SkyToBeVisibleOptions = {};
  const config: SkyA11yAnalyzerConfig = {};
  expectAsync(options).toBeResolved();
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts'))
      .toBe(`import { SkyToBeVisibleOptions, SkyToBeAccessibleOptions } from '@skyux-sdk/vitest';

describe('test', () => {
  const options: SkyToBeVisibleOptions = {};
  const config: SkyToBeAccessibleOptions = {};
  expectAsync(options).toBeResolved();
});
`);
  });

  it('should retain imports that are not matchers', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyAppTestModule, expect } from '@skyux-sdk/testing';

describe('test', () => {
  SkyAppTestModule;
  expect(true).toBeTruthy();
});
`,
    });

    const warnings = await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts'))
      .toBe(`import { SkyAppTestModule } from '@skyux-sdk/testing';

describe('test', () => {
  SkyAppTestModule;
  expect(true).toBeTruthy();
});
`);

    expect(warnings).toEqual([
      "Dependency '@skyux-sdk/testing' is still imported by the workspace and was not uninstalled.",
    ]);

    expect(getDevDependencies(tree)).toEqual({
      '@skyux-sdk/testing': '^15.0.0',
      '@skyux-sdk/vitest': '^0.0.0-PLACEHOLDER',
    });
  });

  it('should ignore files that do not reference the deprecated package', async () => {
    const tree = setupTree({
      '/src/app/app.component.ts': `import { Component } from '@angular/core';\n`,
      '/src/app/typings.d.ts': `import { expect } from '@skyux-sdk/testing';\n`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/app.component.ts')).toBe(
      `import { Component } from '@angular/core';\n`,
    );
    expect(tree.readText('/src/app/typings.d.ts')).toBe(
      `import { expect } from '@skyux-sdk/testing';\n`,
    );
  });

  it('should swap the package.json dependencies', async () => {
    const tree = setupTree(
      {
        '/src/app/test.spec.ts': `import { expect } from '@skyux-sdk/testing';\n`,
      },
      {
        '@skyux-sdk/testing': '^15.0.0',
        typescript: '^5.0.0',
      },
    );

    await runSchematic(tree);

    expect(getDevDependencies(tree)).toEqual({
      '@skyux-sdk/vitest': '^0.0.0-PLACEHOLDER',
      typescript: '^5.0.0',
    });
  });

  it('should install the supported package and run its ng-add schematic', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { expect } from '@skyux-sdk/testing';\n`,
    });

    await runSchematic(tree);

    expect(runner.tasks.map((task) => task.name)).toEqual([
      'node-package',
      'run-schematic',
    ]);

    expect(runner.tasks[1].options).toEqual(
      expect.objectContaining({
        collection: '@skyux-sdk/vitest',
        name: 'ng-add',
      }),
    );
  });
});
