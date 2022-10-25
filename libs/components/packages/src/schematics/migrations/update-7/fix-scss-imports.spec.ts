import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Fix SKY UX SCSS imports', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner.runSchematicAsync('fix-scss-imports', {}, tree).toPromise(),
      tree,
    };
  }

  it('should replace design tokens mixins imports with @skyux/theme equivalents', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@blackbaud/skyux-design-tokens/scss/mixins';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/variables';
`);
  });

  it('should replace design tokens variables imports', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@blackbaud/skyux-design-tokens/scss/variables';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/variables';
`);
  });

  it('should remove design tokens imports if default imports already found', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@blackbaud/skyux-design-tokens/scss/mixins';
@import 'node_modules/@skyux/theme/scss/mixins';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/variables';
`);
  });

  it('should remove design tokens imports if default variables imports already found', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@blackbaud/skyux-design-tokens/scss/mixins';
@import 'node_modules/@blackbaud/skyux-design-tokens/scss/variables';
@import 'node_modules/@skyux/theme/scss/mixins';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/mixins';
`);
  });

  it('should add default variables import if mixins import exists', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import 'node_modules/@skyux/theme/scss/_compat/mixins';
@import 'node_modules/@skyux/theme/scss/mixins';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/variables';
@import 'node_modules/@skyux/theme/scss/_compat/mixins';
@import 'node_modules/@skyux/theme/scss/_compat/variables';
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/variables';
`);
  });

  it('should not add variables import if it already exists', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/variables';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/variables';
`);
  });

  it('should handle import style variations', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import node_modules/@blackbaud/skyux-design-tokens/scss/mixins
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import "node_modules/@skyux/theme/scss/_compat/_mixins";
@import "node_modules/@skyux/theme/scss/_mixins.scss";
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/variables';
@import "node_modules/@skyux/theme/scss/_compat/_mixins";
@import "node_modules/@skyux/theme/scss/_compat/_variables";
@import "node_modules/@skyux/theme/scss/_mixins.scss";
@import "node_modules/@skyux/theme/scss/_variables.scss";
`);
  });

  it('should handle relative and tilde imports', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'src/styles.scss',
      `
@import './node_modules/@blackbaud/skyux-design-tokens/scss/mixins';
@import '../../../../../node_modules/@skyux/theme/scss/mixins';
@import '~@skyux/theme/scss/mixins';
@import '@skyux/theme/scss/_compat/mixins';
`
    );

    await runSchematic();

    expect(tree.readContent('src/styles.scss')).toEqual(`
@import '../../../../../node_modules/@skyux/theme/scss/mixins';
@import '../../../../../node_modules/@skyux/theme/scss/variables';
@import '~@skyux/theme/scss/mixins';
@import '~@skyux/theme/scss/variables';
@import '@skyux/theme/scss/_compat/mixins';
@import '@skyux/theme/scss/_compat/variables';
`);
  });

  it('should remove @blackbaud/skyux-design-tokens from package.json dependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'package.json',
      JSON.stringify({
        dependencies: {
          '@blackbaud/skyux-design-tokens': '0.0.1',
        },
      })
    );

    await runSchematic();

    expect(tree.readJson('package.json')).toEqual({
      dependencies: {},
    });
  });

  it('should remove @blackbaud/skyux-design-tokens from package.json devDependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@blackbaud/skyux-design-tokens': '0.0.1',
        },
      })
    );

    await runSchematic();

    expect(tree.readJson('package.json')).toEqual({
      devDependencies: {},
    });
  });
});
