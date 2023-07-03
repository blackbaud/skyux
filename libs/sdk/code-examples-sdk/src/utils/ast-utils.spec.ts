import {
  applicationGenerator,
  componentGenerator,
} from '@nx/angular/generators';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';
import { createTree } from 'nx/src/generators/testing-utils/create-tree';

import { angularModuleGenerator } from './angular-module-generator';
import {
  findComponentClass,
  findNgModuleClass,
  getNamedImport,
  readSourceFile,
} from './ast-utils';

describe('ast-utils', () => {
  it('should handle trying to read from an unknown file', () => {
    const tree = createTree();
    const returnedFile = readSourceFile(tree, 'fake/path');
    expect(returnedFile.fileName).toBe('fake/path');
    expect(returnedFile.getFullText()).toBe('');
  });

  it('should getNamedImport', () => {
    const importStatement = ts.createSourceFile(
      `script.ts`,
      `import { XComponent } from './lib/x-component';`,
      ts.ScriptTarget.Latest
    ).statements[0] as ts.ImportDeclaration;
    expect(getNamedImport(importStatement, 'XComponent')).toBeTruthy();
    const aliasImportStatement = ts.createSourceFile(
      `script.ts`,
      `import { XComponent as XCom } from './lib/x-component';`,
      ts.ScriptTarget.Latest
    ).statements[0] as ts.ImportDeclaration;
    expect(
      getNamedImport(aliasImportStatement, 'XComponent')?.name.text
    ).toEqual('XCom');
    const noNameImportStatement = ts.createSourceFile(
      `script.ts`,
      `import * from './lib/x-component';`,
      ts.ScriptTarget.Latest
    ).statements[0] as ts.ImportDeclaration;
    expect(() =>
      getNamedImport(noNameImportStatement, 'XComponent')
    ).toThrowError(
      `The import from ./lib/x-component does not have named imports.`
    );
    const nonImportStatement = ts.createSourceFile(
      `script.ts`,
      `var foo = 'bar';`,
      ts.ScriptTarget.Latest
    ).statements[0] as ts.ImportDeclaration;
    expect(() => getNamedImport(nonImportStatement, 'XComponent')).toThrowError(
      `Could not find an import.`
    );
  });

  it('should findNgModuleClass, no @angular/core', () => {
    const source = ts.createSourceFile(
      `script.ts`,
      `
    @NgModule({
      declarations: [XComponent],
    })
    export class XModule {}
    `,
      ts.ScriptTarget.Latest
    );
    expect(() => findNgModuleClass(source)).toThrowError(
      `Could not find @angular/core import.`
    );
  });

  it('should findNgModuleClass, no NgModule import', () => {
    const source = ts.createSourceFile(
      `script.ts`,
      `
    import { Component } from '@angular/core';
    @NgModule({
      declarations: [XComponent],
    })
    export class XModule {}
    `,
      ts.ScriptTarget.Latest
    );
    expect(() => findNgModuleClass(source)).toThrowError(
      `Could not find NgModule import.`
    );
  });

  it('should findNgModuleClass, no properties', () => {
    const source = ts.createSourceFile(
      `script.ts`,
      `
    import { NgModule } from '@angular/core';
    @NgModule()
    export class XModule {}
    `,
      ts.ScriptTarget.Latest
    );
    const ngModuleClass = findNgModuleClass(source);
    expect(ngModuleClass).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(Object.keys(ngModuleClass!.properties).length).toEqual(0);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(ngModuleClass!.classDeclaration.name?.text).toEqual('XModule');
  });

  it('should findNgModuleClass', () => {
    const source = ts.createSourceFile(
      `script.ts`,
      `
    import { NgModule } from '@angular/core';
    @NgModule({
      declarations: [XComponent],
    })
    export class XModule {}
    `,
      ts.ScriptTarget.Latest
    );
    const ngModuleClass = findNgModuleClass(source);
    expect(ngModuleClass).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(ngModuleClass!.properties).toHaveProperty('declarations');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(ngModuleClass!.classDeclaration.name?.text).toEqual('XModule');
  });

  it('should findComponentClass', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(tree, { name: 'test' });
    await componentGenerator(tree, { name: 'test', project: 'test' });
    const componentClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.component.ts')
    );
    expect(componentClass).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(componentClass!.classDeclaration.name?.text).toEqual(
      'TestComponent'
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(componentClass!.properties).toHaveProperty('templateUrl');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(componentClass!.properties).toHaveProperty('styleUrls');
  });

  it('should findComponentClass, not component', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(tree, { name: 'test' });
    await angularModuleGenerator(tree, { name: 'test', project: 'test' });
    await wrapAngularDevkitSchematic('@schematics/angular', 'pipe')(tree, {
      name: 'test/test',
      project: 'test',
      module: 'test',
    });
    const pipeClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.pipe.ts')
    );
    expect(pipeClass).toBeFalsy();
    const specClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.pipe.spec.ts')
    );
    expect(specClass).toBeFalsy();
  });

  it('should findComponentClass, component options not object', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(tree, { name: 'test' });
    await componentGenerator(tree, { name: 'test', project: 'test' });
    tree.write(
      'apps/test/src/app/test/test.component.ts',
      `
      import { Component } from '@angular/core';
      @Component(false)
      export class TestComponent {}
    `
    );
    expect(() =>
      findComponentClass(
        readSourceFile(tree, 'apps/test/src/app/test/test.component.ts')
      )
    ).toThrowError(
      `The Component options for TestComponent are not an object literal`
    );
  });

  it('should findComponentClass, no decorated class', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await applicationGenerator(tree, { name: 'test' });
    await componentGenerator(tree, { name: 'test', project: 'test' });
    tree.write(
      'apps/test/src/app/test/test.component.ts',
      `
      import { Component } from '@angular/core';
      export class TestComponent {}
    `
    );
    const componentClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.component.ts')
    );
    expect(componentClass).toBeFalsy();
  });
});
