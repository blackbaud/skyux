import { SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestLibrary } from '../../testing/scaffold';

import RemoveTestRequire from './remove-test-require';

const testTsPieces: Record<string, string> = {
  imports: `
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
`,
  fix: `
// Fix for crossvent "global is not defined" error. The crossvent library
// is used by Dragula, which in turn is used by multiple SKY UX components.
// See: https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;
`,
  requirePolyfill: `
declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};
`,
  getTestBed: `
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);
`,
  context: `
// Then we find all the tests.
const context = require.context('./', true, /\\.spec\\.ts$/);
// And load the modules.
context.keys().map(context);
`,
  testingContext: `
// Find any tests included in the "testing" entry point.
try {
  const testingContext = require.context('../testing/', true, /\\.spec\\.ts$/);
  testingContext.keys().map(testingContext);
} catch (err) {}
`,
};

describe('RemoveTestRequire', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../migration-collection.json')
  );

  it('should create an instance', async () => {
    const tree = await createTestLibrary(runner, { projectName: 'test' });
    expect(tree.exists('projects/test/src/test.ts')).toBe(false);
    tree.create(
      'projects/test/src/test.ts',
      testTsPieces.imports +
        testTsPieces.fix +
        testTsPieces.requirePolyfill +
        testTsPieces.getTestBed +
        testTsPieces.context +
        testTsPieces.testingContext
    );
    await RemoveTestRequire()(tree, {} as SchematicContext);
    expect(tree.readText('projects/test/src/test.ts')).toContain(
      testTsPieces.imports
    );
    expect(tree.readText('projects/test/src/test.ts')).not.toContain(
      'declare const require'
    );
    expect(tree.readText('projects/test/src/test.ts')).not.toContain(
      'const context = require.context'
    );
    expect(tree.readText('projects/test/src/test.ts')).not.toContain(
      'const testingContext = require.context'
    );
  });

  it('should work without testing context', async () => {
    const tree = await createTestLibrary(runner, { projectName: 'test' });
    expect(tree.exists('projects/test/src/test.ts')).toBe(false);
    tree.create(
      'projects/test/src/test.ts',
      testTsPieces.imports +
        testTsPieces.fix +
        testTsPieces.requirePolyfill +
        testTsPieces.getTestBed +
        testTsPieces.context
    );
    await RemoveTestRequire()(tree, {} as SchematicContext);
    expect(tree.readText('projects/test/src/test.ts')).toContain(
      testTsPieces.imports
    );
    expect(tree.readText('projects/test/src/test.ts')).not.toContain(
      'declare const require'
    );
    expect(tree.readText('projects/test/src/test.ts')).not.toContain(
      'const context = require.context'
    );
  });

  it('should work with no changes', async () => {
    const tree = await createTestLibrary(runner, { projectName: 'test' });
    expect(tree.exists('projects/test/src/test.ts')).toBe(false);
    tree.create(
      'projects/test/src/test.ts',
      testTsPieces.imports + testTsPieces.fix + testTsPieces.getTestBed
    );
    await RemoveTestRequire()(tree, {} as SchematicContext);
    expect(tree.readText('projects/test/src/test.ts')).toContain(
      testTsPieces.imports
    );
  });
});
