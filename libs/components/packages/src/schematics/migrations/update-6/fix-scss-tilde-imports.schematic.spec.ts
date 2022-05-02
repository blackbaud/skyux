import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Fix SCSS tilde imports', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'fix-scss-tilde-imports';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  const testImportStatements = [
    "@use '~@skyux/theme/scss/variables';",
    "@import '~@skyux/theme/scss/variables';", // ours, public API
    "@import '~@skyux/theme/scss/mixins';", // ours, public API
    "@import '~@skyux/theme/scss/_compat/variables';", // ours, non-public API
    "@import '~@skyux/theme/scss/themes/modern/_compat/mixins';", // ours, non-public API
    "@import '~@angular/material';", // angular
    "@import '~@foo/bar/~/baz.scss';", // third-party, extension
    "@import '@skyux/theme/scss/variables';", // no tilde, should be ignored
    "@import 'node_modules/@skyux/theme/scss/_compat/mixins';", // already valid root-relative
    "@import './mixins';", // document-relative
    "@import '~@gooddata/react-components/styles/css/main.css';", // includes extension
  ];

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestApp(runner, {
      defaultProjectName,
    });
  });

  function runSchematic(): Promise<UnitTestTree> {
    return runner.runSchematicAsync(schematicName, {}, tree).toPromise();
  }

  it('should fix tilde imports for SCSS files', async () => {
    tree.overwrite('src/styles.scss', testImportStatements.join('\n'));

    await runSchematic();

    expect(tree.readContent('src/styles.scss'))
      .toBe(`@use 'node_modules/@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/_compat/variables';
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import 'node_modules/@angular/material';
@import 'node_modules/@foo/bar/~/baz';
@import '@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/_compat/mixins';
@import './mixins';
@import 'node_modules/@gooddata/react-components/styles/css/main';`);
  });

  it('should fix tilde imports for CSS files', async () => {
    tree.create('src/global.css', testImportStatements.join('\n'));

    await runSchematic();

    expect(tree.readContent('src/global.css'))
      .toBe(`@use 'node_modules/@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/mixins';
@import 'node_modules/@skyux/theme/scss/_compat/variables';
@import 'node_modules/@skyux/theme/scss/themes/modern/_compat/mixins';
@import 'node_modules/@angular/material';
@import 'node_modules/@foo/bar/~/baz';
@import '@skyux/theme/scss/variables';
@import 'node_modules/@skyux/theme/scss/_compat/mixins';
@import './mixins';
@import 'node_modules/@gooddata/react-components/styles/css/main';`);
  });

  it('should ignore files in node_modules', async () => {
    tree.create('node_modules/foo/global.css', testImportStatements.join('\n'));

    await runSchematic();

    expect(tree.readContent('node_modules/foo/global.css')).toBe(
      testImportStatements.join('\n')
    );
  });
});
