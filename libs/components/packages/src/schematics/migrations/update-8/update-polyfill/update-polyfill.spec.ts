import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';
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

  it('should modify polyfills.ts and test.ts with Windows line endings', async () => {
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
      `.replace(/\n/g, `\r\n`),
      testPolyfillsContents:
        stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files

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
    `.replace(/\n/g, `\r\n`),
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

  it('should update library projects', async () => {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    const angularJson = readJson(tree, 'angular.json');
    const libArchitect = angularJson.projects['my-lib'].architect;
    const appArchitect = angularJson.projects['my-lib-showcase'].architect;

    // Simulate an Angular 14 project.
    delete libArchitect.test.options.polyfills;
    libArchitect.test.options.main = 'projects/my-lib/src/test.ts';
    appArchitect.build.options.polyfills =
      'projects/my-lib-showcase/src/polyfills.ts';
    appArchitect.test.options.main = 'projects/my-lib-showcase/src/test.ts';
    appArchitect.test.options.polyfills =
      'projects/my-lib-showcase/src/polyfills.ts';
    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    tree.create(
      'projects/my-lib/src/test.ts',
      stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files
      import 'zone.js';
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

      // Find any tests included in the "testing" entry point.
      try {
        const testingContext = require.context('../testing/', true, /\.spec\.ts$/);
        testingContext.keys().map(testingContext);
      } catch (err) {}`
    );

    tree.create(
      'projects/my-lib-showcase/src/polyfills.ts',
      stripIndents`/**
    * This file includes polyfills needed by Angular and is loaded before the app.
    * You can add your own extra polyfills to this file.
    *
    * This file is divided into 2 sections:
    *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
    *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
    *      file.
    *
    * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
    * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
    * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
    *
    * Learn more in https://angular.io/guide/browser-support
    */

   /***************************************************************************************************
    * BROWSER POLYFILLS
    */

   /**
    * By default, zone.js will patch all possible macroTask and DomEvents
    * user can disable parts of macroTask/DomEvents patch by setting following flags
    * because those flags need to be set before \`zone.js\` being loaded, and webpack
    * will put import in the top of bundle, so user need to create a separate file
    * in this directory (for example: zone-flags.ts), and put the following flags
    * into that file, and then add the following code before importing zone.js.
    * import './zone-flags';
    *
    * The flags allowed in zone-flags.ts are listed here.
    *
    * The following flags will work for all browsers.
    *
    * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
    * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
    *
    *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
    *  with the following flag, it will bypass \`zone.js\` patch for IE/Edge
    *
    *  (window as any).__Zone_enable_cross_context_check = true;
    *
    */

   /***************************************************************************************************
    * Zone JS is required by default for Angular itself.
    */
   import 'zone.js';  // Included with Angular CLI.


   /***************************************************************************************************
    * APPLICATION IMPORTS
    */

   // Fix for crossvent "global is not defined" error. The crossvent library is used by Dragula,
   // which in turn is used by multiple SKY UX components.
   // https://github.com/bevacqua/dragula/issues/602
   (window as any).global = window;
   `
    );

    tree.create(
      'projects/my-lib-showcase/src/test.ts',
      stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files

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
    `
    );

    const updatedTree = await runner.runSchematic('update-polyfill', {}, tree);

    expect(updatedTree.readText('projects/my-lib/src/test.ts')).toMatchSnapshot(
      'projects/my-lib/src/test.ts'
    );

    expect(
      updatedTree.readText('projects/my-lib-showcase/src/polyfills.ts')
    ).toMatchSnapshot('projects/my-lib-showcase/src/polyfills.ts');

    expect(
      updatedTree.readText('projects/my-lib-showcase/src/test.ts')
    ).toMatchSnapshot('projects/my-lib-showcase/src/test.ts');

    expect(updatedTree.readText('angular.json')).toMatchSnapshot(
      'angular.json'
    );
  });

  it('should update library projects with Windows line endings', async () => {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    const angularJson = readJson(tree, 'angular.json');
    const libArchitect = angularJson.projects['my-lib'].architect;
    const appArchitect = angularJson.projects['my-lib-showcase'].architect;

    // Simulate an Angular 14 project.
    delete libArchitect.test.options.polyfills;
    libArchitect.test.options.main = 'projects/my-lib/src/test.ts';
    appArchitect.build.options.polyfills =
      'projects/my-lib-showcase/src/polyfills.ts';
    appArchitect.test.options.main = 'projects/my-lib-showcase/src/test.ts';
    appArchitect.test.options.polyfills =
      'projects/my-lib-showcase/src/polyfills.ts';
    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    tree.create(
      'projects/my-lib/src/test.ts',
      stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files
      import 'zone.js';
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

      // Find any tests included in the "testing" entry point.
      try {
        const testingContext = require.context('../testing/', true, /\.spec\.ts$/);
        testingContext.keys().map(testingContext);
      } catch (err) {}`.replace(/\n/g, `\r\n`)
    );

    tree.create(
      'projects/my-lib-showcase/src/polyfills.ts',
      stripIndents`/**
    * This file includes polyfills needed by Angular and is loaded before the app.
    * You can add your own extra polyfills to this file.
    *
    * This file is divided into 2 sections:
    *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
    *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
    *      file.
    *
    * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
    * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
    * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
    *
    * Learn more in https://angular.io/guide/browser-support
    */

   /***************************************************************************************************
    * BROWSER POLYFILLS
    */

   /**
    * By default, zone.js will patch all possible macroTask and DomEvents
    * user can disable parts of macroTask/DomEvents patch by setting following flags
    * because those flags need to be set before \`zone.js\` being loaded, and webpack
    * will put import in the top of bundle, so user need to create a separate file
    * in this directory (for example: zone-flags.ts), and put the following flags
    * into that file, and then add the following code before importing zone.js.
    * import './zone-flags';
    *
    * The flags allowed in zone-flags.ts are listed here.
    *
    * The following flags will work for all browsers.
    *
    * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
    * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
    *
    *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
    *  with the following flag, it will bypass \`zone.js\` patch for IE/Edge
    *
    *  (window as any).__Zone_enable_cross_context_check = true;
    *
    */

   /***************************************************************************************************
    * Zone JS is required by default for Angular itself.
    */
   import 'zone.js';  // Included with Angular CLI.


   /***************************************************************************************************
    * APPLICATION IMPORTS
    */

   // Fix for crossvent "global is not defined" error. The crossvent library is used by Dragula,
   // which in turn is used by multiple SKY UX components.
   // https://github.com/bevacqua/dragula/issues/602
   (window as any).global = window;
   `.replace(/\n/g, `\r\n`)
    );

    tree.create(
      'projects/my-lib-showcase/src/test.ts',
      stripIndents`// This file is required by karma.conf.js and loads recursively all the .spec and framework files

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
    `.replace(/\n/g, `\r\n`)
    );

    const updatedTree = await runner.runSchematic('update-polyfill', {}, tree);

    expect(updatedTree.readText('projects/my-lib/src/test.ts')).toMatchSnapshot(
      'projects/my-lib/src/test.ts'
    );

    expect(
      updatedTree.readText('projects/my-lib-showcase/src/polyfills.ts')
    ).toMatchSnapshot('projects/my-lib-showcase/src/polyfills.ts');

    expect(
      updatedTree.readText('projects/my-lib-showcase/src/test.ts')
    ).toMatchSnapshot('projects/my-lib-showcase/src/test.ts');

    expect(updatedTree.readText('angular.json')).toMatchSnapshot(
      'angular.json'
    );
  });
});
