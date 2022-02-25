import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';


import path from 'path';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-lib';

  let tree: UnitTestTree;

  let latestVersionCalls: { [_: string]: string };

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });

    latestVersionCalls = {};

    jest.mock('latest-version', () => (packageName, args) => {
if (args.version === '0.0.0-PLACEHOLDER') {
      args.version = '^5.0.0';
    }

    latestVersionCalls[packageName] = args.version;

      // Test when layout is already on the latest version.
      if (packageName === '@skyux/layout') {
        return args.version.replace(/^(\^|~)/, '');
      }

      return 'LATEST';
    });
  });

  function runSchematic(
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  it('should get latest versions of SKY UX packages', async () => {
    // Add custom packages for the test.
    let packageJson = JSON.parse(tree.readContent('package.json'));
    packageJson.dependencies['@skyux/core'] = '^5.0.1';
    packageJson.dependencies['@skyux/layout'] = '5.0.0'; // Test if package already on latest version.
    packageJson.dependencies['@skyux/i18n'] = '4.2.1'; // <-- Version should be switched to what's in `packageGroup`.
    tree.overwrite('package.json', JSON.stringify(packageJson));

    const updatedTree = await runSchematic();

    packageJson = JSON.parse(updatedTree.readContent('package.json'));

    expect(packageJson.dependencies).toEqual({
      '@angular/animations': '~12.2.0',
      '@angular/common': '~12.2.0',
      '@angular/compiler': '~12.2.0',
      '@angular/core': '~12.2.0',
      '@angular/forms': '~12.2.0',
      '@angular/platform-browser': '~12.2.0',
      '@angular/platform-browser-dynamic': '~12.2.0',
      '@angular/router': '~12.2.0',
      '@skyux/layout': '5.0.0',
      '@skyux/core': 'LATEST',
      '@skyux/i18n': 'LATEST',
      rxjs: '~6.6.0',
      tslib: '^2.3.0',
      'zone.js': '~0.11.4',
    });

    expect(packageJson.devDependencies).toEqual({
      '@angular-devkit/build-angular': '~12.2.16',
      '@angular/cli': '~12',
      '@angular/compiler-cli': '~12.2.0',
      '@types/jasmine': '~3.8.0',
      '@types/node': '^12.11.1',
      'jasmine-core': '~3.8.0',
      karma: '~6.3.0',
      'karma-chrome-launcher': '~3.1.0',
      'karma-coverage': '~2.0.3',
      'karma-jasmine': '~4.0.0',
      'karma-jasmine-html-reporter': '~1.7.0',
      'ng-packagr': '^12.1.1',
      typescript: '~4.3.5',
    });

    expect(latestVersionCalls).toEqual(
      expect.objectContaining({
        '@skyux/core': '^5.0.0',
        '@skyux/i18n': '^5.0.0',
      })
    );
  });
});
