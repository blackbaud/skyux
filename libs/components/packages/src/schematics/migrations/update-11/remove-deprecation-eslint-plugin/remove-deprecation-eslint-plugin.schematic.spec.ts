import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

describe('remove-deprecation-eslint-plugin.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    eslintConfig?: any;
    standalone: false;
  }) {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));
    tree.create('/.eslintrc.json', JSON.stringify(options?.eslintConfig ?? {}));

    return {
      runSchematic: () =>
        runner.runSchematic('remove-deprecation-eslint-plugin', {}, tree),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should remove eslint-plugin-deprecation version if @skyux-sdk/eslint-config installed as a dependency', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        dependencies: {
          'eslint-plugin-deprecation': '*',
        },
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {},
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
  });

  it('should remove eslint-plugin-deprecation version if @skyux-sdk/eslint-config installed as a dev-dependency', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
          'eslint-plugin-deprecation': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
  });

  it('should abort if @skyux-sdk/eslint-config not installed', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          'eslint-plugin-deprecation': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: { 'eslint-plugin-deprecation': '*' },
    });
  });

  it('should eslint config references to the new rule', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
          'eslint-plugin-deprecation': '*',
        },
      },
      eslintConfig: {
        plugins: ['deprecation', 'prettier'],
        overrides: [
          {
            files: ['*.ts'],
            plugins: ['deprecation', 'prettier'],
            rules: {
              'deprecation/deprecation': 'off',
            },
          },
          {
            files: ['*.html'],
            plugins: ['deprecation', 'prettier'],
            rules: {
              'deprecation/deprecation': 'off',
            },
          },
        ],
        rules: {
          'deprecation/deprecation': 'off',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
    expect(JSON.parse(tree.readText('.eslintrc.json'))).toEqual({
      plugins: ['prettier'],
      overrides: [
        {
          files: ['*.ts'],
          plugins: ['prettier'],
          rules: {
            '@typescript-eslint/no-deprecated': 'off',
          },
        },
        {
          files: ['*.html'],
          plugins: ['prettier'],
          rules: {
            '@typescript-eslint/no-deprecated': 'off',
          },
        },
      ],
      rules: {
        '@typescript-eslint/no-deprecated': 'off',
      },
    });
  });

  it('should remove eslint-plugin-deprecation version if @skyux-sdk/eslint-config installed as a dev-dependency', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
          'eslint-plugin-deprecation': '*',
        },
      },
    });
    tree.create(
      '/projects/my-lib/src/app/test.component.ts',
      `import { Component } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {

public testFun(): void {
      // eslint-disable deprecation/deprecation, @typescript-eslint/no-explicit-any
      disabledThing();
}
}`,
    );
    tree.create(
      '/projects/my-lib/src/app/test2.component.ts',
      `import { Component } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class Test2Component {

public testFun(): void {
      disabledThing();
}
}`,
    );
    tree.create('/projects/my-lib/src/app/empty.ts', '');

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
    expect(tree.readText('/projects/my-lib/src/app/test.component.ts'))
      .toEqual(`import { Component } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {

public testFun(): void {
      // eslint-disable @typescript-eslint/no-deprecated, @typescript-eslint/no-explicit-any
      disabledThing();
}
}`);
    expect(tree.readText('/projects/my-lib/src/app/test2.component.ts'))
      .toEqual(`import { Component } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class Test2Component {

public testFun(): void {
      disabledThing();
}
}`);
    expect(tree.readText('/projects/my-lib/src/app/empty.ts')).toEqual('');
  });
});
