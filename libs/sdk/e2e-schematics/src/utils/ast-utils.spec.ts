import { componentGenerator } from '@nx/angular/generators';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';
import { createTree } from 'nx/src/generators/testing-utils/create-tree';

import { angularModuleGenerator } from './angular-module-generator';
import {
  applyTransformers,
  applyTransformersToPath,
  findComponentClass,
  findNgModuleClass,
  getInsertExportTransformer,
  getInsertIdentifierToArrayTransformer,
  getInsertImportTransformer,
  getInsertStringPropertyTransformer,
  getNamedImport,
  getRenameVariablesTransformer,
  getSourceAsString,
  getStringLiteral,
  getStringLiteralsSetterTransformer,
  getTransformerToAddExportToNgModule,
  readSourceFile,
  writeSourceFile,
} from './ast-utils';
import { createTestApplication } from './testing';

describe('ast-utils', () => {
  it('should handle trying to read from an unknown file', () => {
    const tree = createTree();
    const returnedFile = readSourceFile(tree, 'fake/path');
    expect(returnedFile.fileName).toBe('fake/path');
    expect(returnedFile.getFullText()).toBe('');
  });

  it('should rename a variable', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(fileName, `const test: string = "value";\nconsole.log(test);\n`);
    const sourceFile = readSourceFile(tree, fileName);
    const transformer = getRenameVariablesTransformer({ test: 'update' });
    const [result] = applyTransformers([sourceFile], [transformer]);
    const resultCode = getSourceAsString(result);
    expect(resultCode).toEqual(
      `const update: string = "value";\nconsole.log(update);\n`,
    );
    writeSourceFile(tree, fileName, result);
    expect(tree.read(fileName, 'utf-8')).toEqual(resultCode);
  });

  it('should getStringLiteral', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`,
    );
    const sourceFile = readSourceFile(tree, fileName);
    const value = getStringLiteral(sourceFile, 'test');
    expect(value).toEqual('value');
    const prop = getStringLiteral(sourceFile, 'property');
    expect(prop).toEqual('prop');
  });

  it('should getStringLiteral, throw error', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`,
    );
    const sourceFile = readSourceFile(tree, fileName);
    try {
      getStringLiteral(sourceFile, 'bogus');
      fail();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should setStringLiterals', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`,
    );
    const transformer = getStringLiteralsSetterTransformer({
      test: 'new value',
      property: 'updated',
    });
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toEqual(
      `const test: string = "new value";\nconst obj = { property: "updated" };\n`,
    );
  });

  it('should insertStringPropertyBefore', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(fileName, `const test = { test: "value", property: "prop" };\n`);
    const transformerTest = getInsertStringPropertyTransformer(
      'test',
      'id',
      'updated',
    );
    const transformerBogus = getInsertStringPropertyTransformer(
      'bogus',
      'added',
      'miss',
    );
    applyTransformersToPath(tree, fileName, [
      transformerTest,
      transformerBogus,
    ]);
    expect(tree.read(fileName, 'utf-8')).toEqual(
      `const test = { id: "updated", test: "value", property: "prop" };\n`,
    );
  });

  it('should getInsertExportTransformer', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      [
        `export * from './lib/first.module'`,
        `export * from './lib/second.module'`,
        `export * from './lib/fourth.module'`,
      ].join('\n'),
    );
    const transformer = getInsertExportTransformer(
      './lib/third.module',
      './lib/second.module',
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();
  });

  it('should getInsertIdentifierToArrayTransformer', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `
    export default {
      id: 'x-component',
      component: XComponent,
      decorators: [
        moduleMetadata({
          imports: [],
        }),
      ],
    }
    `,
    );
    const transformer = getInsertIdentifierToArrayTransformer(
      'imports',
      'XModule',
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();
  });

  it('should getNamedImport', () => {
    const importStatement = ts.createSourceFile(
      `script.ts`,
      `import { XComponent } from './lib/x-component';`,
      ts.ScriptTarget.Latest,
    ).statements[0] as ts.ImportDeclaration;
    expect(getNamedImport(importStatement, 'XComponent')).toBeTruthy();
    const aliasImportStatement = ts.createSourceFile(
      `script.ts`,
      `import { XComponent as XCom } from './lib/x-component';`,
      ts.ScriptTarget.Latest,
    ).statements[0] as ts.ImportDeclaration;
    expect(
      getNamedImport(aliasImportStatement, 'XComponent')?.name.text,
    ).toEqual('XCom');
    const noNameImportStatement = ts.createSourceFile(
      `script.ts`,
      `import * from './lib/x-component';`,
      ts.ScriptTarget.Latest,
    ).statements[0] as ts.ImportDeclaration;
    expect(() => getNamedImport(noNameImportStatement, 'XComponent')).toThrow(
      `The import from ./lib/x-component does not have named imports.`,
    );
    const nonImportStatement = ts.createSourceFile(
      `script.ts`,
      `var foo = 'bar';`,
      ts.ScriptTarget.Latest,
    ).statements[0] as ts.ImportDeclaration;
    expect(() => getNamedImport(nonImportStatement, 'XComponent')).toThrow(
      `Could not find an import.`,
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
      ts.ScriptTarget.Latest,
    );
    expect(() => findNgModuleClass(source)).toThrow(
      `Could not find @angular/core import.`,
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
      ts.ScriptTarget.Latest,
    );
    expect(() => findNgModuleClass(source)).toThrow(
      `Could not find NgModule import.`,
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
      ts.ScriptTarget.Latest,
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
      ts.ScriptTarget.Latest,
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
    tree.write('.gitignore', '#');
    await createTestApplication(tree, { name: 'test' });
    await componentGenerator(tree, {
      name: 'test',
      path: 'apps/test/src/app/test/test',
      type: 'component',
    });
    const componentClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.component.ts'),
    );
    expect(componentClass).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(componentClass!.classDeclaration.name?.text).toEqual(
      'TestComponent',
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(componentClass!.properties).toHaveProperty('templateUrl');
  });

  it('should findComponentClass, not component', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    await createTestApplication(tree, { name: 'test' });
    await angularModuleGenerator(tree, { name: 'test', project: 'test' });
    await wrapAngularDevkitSchematic('@schematics/angular', 'pipe')(tree, {
      name: 'test/test',
      project: 'test',
    });
    const pipeClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.pipe.ts'),
    );
    expect(pipeClass).toBeFalsy();
    const specClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.pipe.spec.ts'),
    );
    expect(specClass).toBeFalsy();
  });

  it('should findComponentClass, component options not object', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    await createTestApplication(tree, { name: 'test' });
    await componentGenerator(tree, {
      name: 'test',
      path: 'apps/test/src/app/test/test',
      type: 'component',
    });
    tree.write(
      'apps/test/src/app/test/test.component.ts',
      `
      import { Component } from '@angular/core';
      @Component(false)
      export class TestComponent {}
    `,
    );
    expect(() =>
      findComponentClass(
        readSourceFile(tree, 'apps/test/src/app/test/test.component.ts'),
      ),
    ).toThrow(
      `The Component options for TestComponent are not an object literal`,
    );
  });

  it('should findComponentClass, no decorated class', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    await createTestApplication(tree, { name: 'test' });
    await componentGenerator(tree, {
      name: 'test',
      path: 'apps/test/src/app/test/test',
      type: 'component',
    });
    tree.write(
      'apps/test/src/app/test/test.component.ts',
      `
      import { Component } from '@angular/core';
      export class TestComponent {}
    `,
    );
    const componentClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.component.ts'),
    );
    expect(componentClass).toBeFalsy();
  });

  it('should findComponentClass, no Component import', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    await createTestApplication(tree, { name: 'test' });
    await componentGenerator(tree, {
      name: 'test',
      path: 'apps/test/src/app/test/test',
      type: 'component',
    });
    tree.write(
      'apps/test/src/app/test/test.component.ts',
      `
      import { Injectable } from '@angular/core';
      export class TestComponent {}
    `,
    );
    const componentClass = findComponentClass(
      readSourceFile(tree, 'apps/test/src/app/test/test.component.ts'),
    );
    expect(componentClass).toBeFalsy();
  });

  it('should getInsertImportTransformer', () => {
    const tree = createTree();
    const fileName1 = 'script1.ts';
    const fileName2 = 'script2.ts';
    const fileName3 = 'script3.ts';
    tree.write(fileName1, `import { XModule } from './lib/x.module';`);
    tree.write(fileName2, `import { YModule } from './lib/y.module';`);
    tree.write(fileName3, `const variable = 'value';`);
    const transformer = getInsertImportTransformer('XModule', './lib/x.module');
    applyTransformersToPath(tree, fileName1, [transformer]);
    applyTransformersToPath(tree, fileName2, [transformer]);
    applyTransformersToPath(tree, fileName3, [transformer]);
    expect(tree.read(fileName1, 'utf-8')).toMatchSnapshot();
    expect(tree.read(fileName2, 'utf-8')).toMatchSnapshot();
    expect(tree.read(fileName3, 'utf-8')).toMatchSnapshot();
  });

  it('should getTransformerToAddExportToNgModule', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `
      import { NgModule } from '@angular/core';
      @NgModule({})
      export class TestModule {}
    `,
    );
    const transformer = getTransformerToAddExportToNgModule('TestComponent');
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();
  });

  it('should getTransformerToAddExportToNgModule, update', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `
      import { NgModule } from '@angular/core';
      @NgModule({
        exports: [ExistingComponent],
      })
      export class TestModule {}
    `,
    );
    const transformer = getTransformerToAddExportToNgModule('TestComponent');
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();
  });

  it('should getTransformerToAddExportToNgModule, no change', () => {
    const tree = createTree();
    const fileName = 'script.ts';

    // Already set.
    tree.write(
      fileName,
      `
      import { NgModule } from '@angular/core';
      @NgModule({
        exports: [TestComponent],
      })
      export class TestModule {}
    `,
    );
    const transformer = getTransformerToAddExportToNgModule('TestComponent');
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();

    // Unexpected value.
    tree.write(
      fileName,
      `
      import { NgModule } from '@angular/core';
      @NgModule({
        exports: false,
      })
      export class TestModule {}
    `,
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();

    // Class not decorated.
    tree.write(
      fileName,
      `
      import { NgModule } from '@angular/core';
      export class TestModule {}
    `,
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();

    // No module import.
    tree.write(
      fileName,
      `
      export class TestModule {}
    `,
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();

    // No module decorator.
    tree.write(
      fileName,
      `
      import { Component } from '@angular/core';
      export class TestModule {}
    `,
    );
    applyTransformersToPath(tree, fileName, [transformer]);
    expect(tree.read(fileName, 'utf-8')).toMatchSnapshot();
  });
});
