import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { HostTree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { getDecoratorMetadata } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';

import {
  addSymbolToClassMetadata,
  getInlineTemplates,
  getTemplateUrls,
  isSymbolInClassMetadataFieldArray,
} from './ng-ast';

function getTsSource(path: string, content: string): ts.SourceFile {
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}

function applyChanges(
  path: string,
  content: string,
  changes: Change[],
): string {
  const tree = new HostTree();
  tree.create(path, content);
  const exportRecorder = tree.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  tree.commitUpdate(exportRecorder);

  return tree.readText(path);
}

describe('ng-ast', () => {
  describe('getInlineTemplates', () => {
    it('should get inline templates', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>'
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getInlineTemplates(sourceFile)).toEqual([{ start: 90, end: 106 }]);
      expect(sourceText.slice(90, 106)).toBe('<div>Hello</div>');
    });

    it('should not get inline templates if it is not a string', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: false,
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getInlineTemplates(sourceFile)).toEqual([]);
    });

    it('should not get inline templates if it is not an Angular component', () => {
      const sourceText = stripIndents`
      import { NgModule } from '@angular/core';

      @NgModule({})
      export class TestModule {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getInlineTemplates(sourceFile)).toEqual([]);
    });
  });

  describe('getTemplateUrls', () => {
    it('should get template URLs', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        templateUrl: './test.component.html'
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getTemplateUrls(sourceFile)).toEqual(['./test.component.html']);
    });

    it('should not get template URL if it is not a string', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        templateUrl: false,
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getTemplateUrls(sourceFile)).toEqual([]);
    });

    it('should not get template URL if it is not an Angular component', () => {
      const sourceText = stripIndents`
      import { NgModule } from '@angular/core';

      @NgModule({})
      export class TestModule {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      expect(getTemplateUrls(sourceFile)).toEqual([]);
    });
  });

  it('should getTestingModuleMetadata', () => {
    const sourceText = stripIndents`
      import { TestBed } from '@angular/core/testing';

      describe('My Test', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [CommonModule],
          });
        });
      });

      describe('My Other Test', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            declarations: [OtherComponent],
          });
        });
      });
    `;
    const sourceFile = ts.createSourceFile(
      'test.ts',
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const { getTestingModuleMetadata } = require('./ng-ast');
    const metadata = getTestingModuleMetadata(sourceFile);
    expect(metadata.length).toBe(2);
    expect(metadata[0].getText()).toContain('declarations: [AppComponent]');
    expect(metadata[0].properties[1].getText()).toEqual(
      'imports: [CommonModule]',
    );
    expect(metadata[1].getText()).toContain('declarations: [OtherComponent]');
  });

  describe('addSymbolToClassMetadata', () => {
    let modulePath: string;
    let moduleContent: string;

    beforeEach(() => {
      modulePath = '/src/app/app.module.ts';
      moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';
      import { AppComponent } from './app.component';

      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
    });

    it('should add metadata', () => {
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toMatch(/imports: \[[^\]]+,\n(\s*) {2}HelloWorld\n\1\]/);
    });

    it('should add metadata (comma)', () => {
      const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        imports: [
          BrowserModule,
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toMatch(/imports: \[[^\]]+,\n(\s*) {2}HelloWorld,\n\1\]/);
    });

    it('should add metadata (missing)', () => {
      const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toMatch(/imports: \[\n(\s*) {2}HelloWorld\n\1\]/);
    });

    it('should add metadata (empty)', () => {
      const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        imports: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toMatch(/imports: \[\n(\s*) {2}HelloWorld\n\1\],\n/);
    });

    it('should add metadata (match spacing)', () => {
      const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({ declarations: [AppComponent] })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toContain(
        '({ declarations: [AppComponent], imports: [HelloWorld] })',
      );
    });

    it('should add metadata (no previous properties)', () => {
      const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({})
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
        './hello-world',
      );
      expect(changes).not.toBeNull();

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toMatch(/\{\n {2}imports: \[\n {4}HelloWorld\n {2}\]\n}/);
    });

    it('should not add metadata if the value is not an array expression', () => {
      const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: null,
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).toEqual([]);
    });

    it('should not add metadata if the value is already present', () => {
      const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: [HelloWorld],
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'HelloWorld',
      );
      expect(changes).toEqual([]);
    });

    it('should skip adding @angular/common services if CommonModule is already present', () => {
      const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';
      import { CommonModule } from '@angular/common';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        imports: [CommonModule],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'NgIf',
        '@angular/common',
      );
      expect(changes).toEqual([]);
    });

    it('should add CommonModule', () => {
      const moduleContent = `
      import { BrowserModule } from '@angular/platform-browser';
      import { NgModule } from '@angular/core';

      @NgModule({
        declarations: [
          AppComponent
        ],
        providers: [],
        imports: [],
        bootstrap: [AppComponent]
      })
      export class AppModule { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'NgModule',
        modulePath,
        'imports',
        'CommonModule',
        '@angular/common',
      );
      expect(changes).not.toBeNull();
      expect(changes).not.toEqual([]);

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toContain('CommonModule');
      expect(output).toMatchSnapshot();
    });

    it('should add AsyncPipe', () => {
      const moduleContent = `
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>',
      })
      export class AppTest { }
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'Component',
        modulePath,
        'imports',
        'AsyncPipe',
        '@angular/common',
      );
      expect(changes).not.toBeNull();
      expect(changes).not.toEqual([]);

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toContain('AsyncPipe');
      expect(output).toMatchSnapshot();
    });

    it('should add metadata to TestBed.configureTestingModule', () => {
      const moduleContent = stripIndents`
      import { TestBed } from '@angular/core/testing';

      describe('My Test', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [CommonModule],
          });
        });
      });

      describe('My Other Test', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            declarations: [OtherComponent],
          });
        });
      });
    `;
      const source = getTsSource(modulePath, moduleContent);
      const changes = addSymbolToClassMetadata(
        source,
        'TestBed.configureTestingModule',
        modulePath,
        'imports',
        'HelloWorld',
        './hello-world',
      );
      expect(changes).not.toBeNull();
      expect(changes).not.toEqual([]);

      const output = applyChanges(modulePath, moduleContent, changes || []);
      expect(output).toContain('imports: [CommonModule, HelloWorld]');
      expect(output).toMatchSnapshot();
    });
  });

  describe('isSymbolInClassMetadataFieldArray', () => {
    it('should find import', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';
      import { AsyncPipe } from '@angular/common';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>',
        imports: [AsyncPipe],
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      const metadata = getDecoratorMetadata(
        sourceFile,
        'Component',
        '@angular/core',
      );
      expect(metadata.length).toBe(1);
      expect(
        isSymbolInClassMetadataFieldArray(
          metadata[0] as any,
          'imports',
          'AsyncPipe',
        ),
      ).toBeTruthy();
    });

    it('should not find import when there are no imports', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>',
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      const metadata = getDecoratorMetadata(
        sourceFile,
        'Component',
        '@angular/core',
      );
      expect(metadata.length).toBe(1);
      expect(
        isSymbolInClassMetadataFieldArray(
          metadata[0] as any,
          'imports',
          'AsyncPipe',
        ),
      ).toBeFalsy();
    });

    it('should not find import when imports is not an array expression', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>',
        imports: null,
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      const metadata = getDecoratorMetadata(
        sourceFile,
        'Component',
        '@angular/core',
      );
      expect(metadata.length).toBe(1);
      expect(
        isSymbolInClassMetadataFieldArray(
          metadata[0] as any,
          'imports',
          'AsyncPipe',
        ),
      ).toBeFalsy();
    });

    it('should not find import in empty list', () => {
      const sourceText = stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-test',
        template: '<div>Hello</div>',
        imports: [],
      })
      export class TestComponent {}
    `;
      const sourceFile = ts.createSourceFile(
        'test.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );
      const metadata = getDecoratorMetadata(
        sourceFile,
        'Component',
        '@angular/core',
      );
      expect(metadata.length).toBe(1);
      expect(
        isSymbolInClassMetadataFieldArray(
          metadata[0] as any,
          'imports',
          'AsyncPipe',
        ),
      ).toBeFalsy();
    });
  });
});
