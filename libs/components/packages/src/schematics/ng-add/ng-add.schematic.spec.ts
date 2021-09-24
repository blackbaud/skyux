import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import mock from 'mock-require';
import path from 'path';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-lib';

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });

    mock('latest-version', (packageName, args) => {
      if (packageName === '@skyux/already-latest') {
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

  it('should get latest versions of packages', async () => {
    // Add custom packages for the test.
    let packageJson = JSON.parse(tree.readContent('package.json'));
    packageJson.dependencies['@skyux/core'] = '^5.0.1';
    packageJson.dependencies['@skyux/already-latest'] = '5.4.1';
    packageJson.dependencies['@skyux/invalid'] = 'invalid'; // Invalid versions should be skipped.
    tree.overwrite('package.json', JSON.stringify(packageJson));

    const updatedTree = await runSchematic();

    packageJson = JSON.parse(updatedTree.readContent('package.json'));

    expect(packageJson.dependencies).toEqual({
      '@angular/animations': 'LATEST',
      '@angular/common': 'LATEST',
      '@angular/compiler': 'LATEST',
      '@angular/core': 'LATEST',
      '@angular/forms': 'LATEST',
      '@angular/platform-browser': 'LATEST',
      '@angular/platform-browser-dynamic': 'LATEST',
      '@angular/router': 'LATEST',
      '@skyux/already-latest': '5.4.1',
      '@skyux/invalid': 'invalid',
      '@skyux/core': 'LATEST',
      rxjs: '~6.6.0',
      tslib: 'LATEST',
      'zone.js': '~0.11.4',
    });

    expect(packageJson.devDependencies).toEqual({
      '@angular-devkit/build-angular': 'LATEST',
      '@angular/cli': 'LATEST',
      '@angular/compiler-cli': 'LATEST',
      '@types/jasmine': '~3.8.0',
      '@types/node': '^12.11.1',
      'jasmine-core': '~3.8.0',
      karma: '~6.3.0',
      'karma-chrome-launcher': '~3.1.0',
      'karma-coverage': '~2.0.3',
      'karma-jasmine': '~4.0.0',
      'karma-jasmine-html-reporter': '~1.7.0',
      'ng-packagr': 'LATEST',
      typescript: '~4.3.5',
    });
  });
});
