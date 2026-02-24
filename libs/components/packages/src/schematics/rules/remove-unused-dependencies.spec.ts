import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../testing/scaffold';
import { JsonFile } from '../utility/json-file';

import { removeUnusedDependencies } from './remove-unused-dependencies';

const collectionPath = require.resolve('../../../collection.json');

describe('removeUnusedDependencies rule', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);
  const packageName = '@skyux/test-package';

  async function setup(): Promise<UnitTestTree> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    // Add the test package to package.json
    const packageJson = new JsonFile(tree, '/package.json');
    packageJson.modify(['dependencies', packageName], '1.0.0');

    return tree;
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should remove package if not used in TypeScript files', async () => {
    const tree = await setup();

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should keep package if used with standard import syntax', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `import { SomeComponent } from '${packageName}';`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should keep package if used with namespace import', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `import * as TestPackage from '${packageName}';`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should keep package if used with default import', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `import TestPackage from '${packageName}';`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should keep package if used with subpath import', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `import { SomeComponent } from '${packageName}/subpath';`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should keep package if used with dynamic import', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `const module = await import('${packageName}');`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should keep package if used with require', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `const testPackage = require('${packageName}');`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should remove package if only mentioned in comments', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `// This used to import from '${packageName}'\nexport class TestComponent {}`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should remove package if only mentioned in string literals', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.ts',
      `const packageName = '${packageName}';\nexport class TestComponent {}`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should ignore non-TypeScript files', async () => {
    const tree = await setup();

    tree.create(
      '/src/app/test.scss',
      `// Some SCSS file mentioning ${packageName}`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should check multiple TypeScript files', async () => {
    const tree = await setup();

    tree.create('/src/app/test1.ts', 'export class Test1 {}');
    tree.create('/src/app/test2.ts', 'export class Test2 {}');
    tree.create(
      '/src/app/test3.ts',
      `import { Component } from '${packageName}';\nexport class Test3 {}`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should handle package names with special characters', async () => {
    const tree = await setup();
    const specialPackageName = '@scope/package-name.utils';

    const packageJson = new JsonFile(tree, '/package.json');
    packageJson.modify(['dependencies', specialPackageName], '1.0.0');

    tree.create(
      '/src/app/test.ts',
      `import { Utils } from '${specialPackageName}';`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(specialPackageName), tree),
    );

    const updatedPackageJson = new JsonFile(updatedTree, '/package.json');
    expect(updatedPackageJson.get(['dependencies', specialPackageName])).toBe(
      '1.0.0',
    );
  });

  it('should remove package if not used in any workspace project', async () => {
    const tree = await setup();

    // Create files in the project that don't use the package
    tree.create('/src/app/test.ts', 'export class Test {}');

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should remove from devDependencies if present', async () => {
    const tree = await setup();

    const packageJson = new JsonFile(tree, '/package.json');
    packageJson.remove(['dependencies', packageName]);
    packageJson.modify(['devDependencies', packageName], '1.0.0');

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const updatedPackageJson = new JsonFile(updatedTree, '/package.json');
    expect(
      updatedPackageJson.get(['devDependencies', packageName]),
    ).toBeUndefined();
  });

  it('should handle files with syntax errors gracefully', async () => {
    const tree = await setup();

    // Create a TypeScript file with invalid syntax but valid import
    tree.create(
      '/src/app/invalid.ts',
      `import { Something } from '${packageName}';
      // Even with syntax errors below, the import above should be detected
      const x = ;`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    // TypeScript AST is lenient and will still parse imports even with syntax errors
    // So the package should be kept
    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });

  it('should remove package when only other packages are imported', async () => {
    const tree = await setup();

    // Create a file with imports from other packages but not the target package
    tree.create(
      '/src/app/test.ts',
      `import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export class TestComponent {}`,
    );

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBeUndefined();
  });

  it('should skip files that cannot be parsed and continue checking others', async () => {
    const tree = await setup();

    // Create a file that uses the package
    tree.create(
      '/src/app/valid.ts',
      `import { Component } from '${packageName}';`,
    );

    // Create a file with content that might cause parsing issues
    // (e.g., binary data or severely malformed TypeScript)
    tree.create('/src/app/binary.ts', '\u0000\u0001\u0002\u0003\u0004');

    const updatedTree = await firstValueFrom(
      runner.callRule(removeUnusedDependencies(packageName), tree),
    );

    // Even though one file couldn't be parsed, the valid file should be detected
    const packageJson = new JsonFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', packageName])).toBe('1.0.0');
  });
});
