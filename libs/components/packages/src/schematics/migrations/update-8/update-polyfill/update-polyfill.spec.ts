import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../../testing/scaffold';
import { readJson } from '../../../testing/tree';

describe('update-polyfill.schematic', () => {
  const runner = new SchematicTestRunner(
    '@skyux/packages',
    require.resolve('../../migration-collection.json')
  );

  async function setupTest(options: {
    buildPolyfillsContents: string;
    testPolyfillsContents: string;
  }) {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    // Simulate the file structure of an Angular 14 project.
    tree.create(`src/polyfills.ts`, options.buildPolyfillsContents);
    tree.create(`src/test.ts`, options.testPolyfillsContents);

    // Simulate the workspace configuration of an Angular 14 project.
    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['test-app'].architect;
    architect.build.options.polyfills = 'src/polyfills.ts';
    architect.test.options.polyfills = 'src/polyfills.ts';
    architect.test.options.main = 'src/test.ts';
    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    return {
      runSchematic: () => runner.runSchematic('update-polyfill', {}, tree),
      tree,
    };
  }

  it('should modify polyfills.ts and test.ts', async () => {
    const { runSchematic, tree } = await setupTest({
      buildPolyfillsContents: stripIndents`
      /***************************************************************************************************
       * Zone JS is required by default for Angular itself.
       */
      import 'zone.js';  // Included with Angular CLI.


      /***************************************************************************************************
       * APPLICATION IMPORTS
       */

      /***************************************************************************************************
       * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
       */

      // Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
      // which in turn is used by multiple SKY UX components.
      // https://github.com/bevacqua/dragula/issues/602
      (window as any).global = window;

      /*
       * END SKY UX POLYFILLS
       **************************************************************************************************/
      `,
      testPolyfillsContents: stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files

    import 'zone.js/testing';
    import { getTestBed } from '@angular/core/testing';
    import {
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting
    } from '@angular/platform-browser-dynamic/testing';

    // Fix for crossvent "global is not defined" error. The crossvent library
    // is used by Dragula, which in turn is used by multiple SKY UX components.
    // See: https://github.com/bevacqua/dragula/issues/602
    (window as any).global = window;

    declare const require: {
      context(path: string, deep?: boolean, filter?: RegExp): {
        keys(): string[];
        <T>(id: string): T;
      };
    };

    // First, initialize the Angular testing environment.
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: true }},
    );

    // Then we find all the tests.
    const context = require.context('./', true, /\.spec\.ts$/);
    // And load the modules.
    context.keys().map(context);
    `,
    });

    await runSchematic();

    expect(tree.readText(`src/polyfills.ts`)).toMatchSnapshot('polyfills.ts');
    expect(tree.readText(`src/test.ts`)).toMatchSnapshot('test.ts');

    // Check the workspace config.
    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['test-app'].architect;

    expect(architect.build.options.polyfills).toEqual([
      'src/polyfills.ts',
      '@skyux/packages/polyfills',
    ]);

    expect(architect.test.options.polyfills).toEqual([
      'src/polyfills.ts',
      '@skyux/packages/polyfills',
    ]);
  });

  it('should only add polyfills configuration if our polyfill is found in polyfills.ts/test.ts', async () => {
    const { runSchematic, tree } = await setupTest({
      buildPolyfillsContents: `import 'zone.js';`,
      testPolyfillsContents: stripIndents`
    import 'zone.js/testing';
    import { getTestBed } from '@angular/core/testing';
    import {
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting
    } from '@angular/platform-browser-dynamic/testing';

    // First, initialize the Angular testing environment.
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      { teardown: { destroyAfterEach: true }},
    );
    `,
    });

    await runSchematic();

    expect(tree.readText(`src/polyfills.ts`)).toMatchSnapshot('polyfills.ts');
    expect(tree.readText(`src/test.ts`)).toMatchSnapshot('test.ts');

    // Check the workspace config.
    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['test-app'].architect;

    expect(architect.build.options.polyfills).toEqual('src/polyfills.ts');
    expect(architect.test.options.polyfills).toEqual('src/polyfills.ts');
  });
});
