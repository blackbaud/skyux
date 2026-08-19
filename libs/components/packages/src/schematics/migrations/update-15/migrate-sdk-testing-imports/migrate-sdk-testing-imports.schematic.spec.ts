import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('migrate-sdk-testing-imports.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  function setupTree(files: Record<string, string>): Tree {
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
      JSON.stringify({
        name: 'test',
        devDependencies: {
          '@skyux-sdk/testing': '^15.0.0',
          typescript: '^5.0.0',
        },
      }),
    );

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return tree;
  }

  async function runSchematic(tree: Tree): Promise<void> {
    await runner.runSchematic('migrate-sdk-testing-imports', {}, tree);
  }

  function getDevDependencies(tree: Tree): Record<string, string> {
    return JSON.parse(tree.readText('/package.json')).devDependencies;
  }

  it('should move all imports and remove the empty import statement', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyAppTestUtility, SkyBy } from '@skyux-sdk/testing';

describe('test', () => {
  SkyAppTestUtility.getText(SkyBy.dataSkyId('a'));
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toMatchSnapshot();
  });

  it('should retain imports that have not moved', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyAppTestModule, SkyBy } from '@skyux-sdk/testing';

describe('test', () => {
  SkyAppTestModule;
  SkyBy.dataSkyId('a');
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toMatchSnapshot();
  });

  it('should combine multiple supported import statements', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyMediaQueryTestingController } from '@skyux/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

describe('test', () => {
  SkyMediaQueryTestingController;
  provideSkyMediaQueryTesting();
  SkyAppTestUtility.getText(null);
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toMatchSnapshot();
  });

  it('should merge into an existing supported import statement', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { provideSkyMediaQueryTesting } from '@skyux/core/testing';
import { SkyBy } from '@skyux-sdk/testing';

describe('test', () => {
  provideSkyMediaQueryTesting();
  SkyBy.dataSkyId('a');
});
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toMatchSnapshot();
  });

  it('should migrate a type-only import', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import type { SkyAppTestUtilityDomEventOptions } from '@skyux-sdk/testing';

const options: SkyAppTestUtilityDomEventOptions = { bubbles: true };
`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toMatchSnapshot();
  });

  it('should ignore files without moved imports', async () => {
    const source = `import { SkyAppTestModule } from '@skyux-sdk/testing';
import { SkyBy } from './sky-by';

describe('test', () => {
  SkyAppTestModule;
  SkyBy.dataSkyId('a');
});
`;

    const tree = setupTree({
      '/src/app/test.spec.ts': source,
      '/src/app/test.component.ts': `export class TestComponent {}\n`,
      '/src/app/test.component.html': '<div></div>',
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.spec.ts')).toBe(source);
  });

  it('should remove the deprecated dependency when it is no longer used', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyBy } from '@skyux-sdk/testing';

describe('test', () => {
  SkyBy.dataSkyId('a');
});
`,
    });

    await runSchematic(tree);

    expect(getDevDependencies(tree)).toEqual({ typescript: '^5.0.0' });
  });

  it('should retain the deprecated dependency when it is still used', async () => {
    const tree = setupTree({
      '/src/app/test.spec.ts': `import { SkyAppTestModule, SkyBy } from '@skyux-sdk/testing';

describe('test', () => {
  SkyAppTestModule;
  SkyBy.dataSkyId('a');
});
`,
    });

    await runSchematic(tree);

    expect(getDevDependencies(tree)).toEqual({
      '@skyux-sdk/testing': '^15.0.0',
      typescript: '^5.0.0',
    });
  });
});
