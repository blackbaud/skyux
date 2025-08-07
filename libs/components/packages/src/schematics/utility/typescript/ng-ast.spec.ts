import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { HostTree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change, InsertChange } from '@schematics/angular/utility/change';

import { addSymbolToClassMetadata, getInlineTemplates } from './ng-ast';

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
  });
});
