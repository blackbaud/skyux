import { Tree } from '@angular-devkit/schematics';

import { moveClassToLibrary } from './move-class-to-library';

describe('Move class to library', () => {
  let tree: Tree;
  const path = '/projects/my-app/src/app/test.module.ts';

  beforeEach(() => {
    tree = Tree.empty();
  });

  it('should update single indicator import to SkyIconModule', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyIconModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`;

    tree.create(path, content);

    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconModule'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyIconModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
  });

  it('should update multiple indicator import to remove SkyIconModule and add new import to new library', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`;
    tree.create(path, content);
    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconStackItem', 'SkyIconType'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';
import { SkyChevronModule,   SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`,
    );
  });

  it('should update multiple indicator import to remove multiple icon types and add new import to new library when no other indicators types exist', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyIconType, SkyIconStackItem } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`;
    tree.create(path, content);
    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconStackItem', 'SkyIconType'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';

import { BrowserModule } from '@angular/platform-browser';
`,
    );
  });

  it('should update multiple indicator import statements to remove SkyIconModule and add new import to new library', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`;
    tree.create(path, content);
    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconStackItem', 'SkyIconType'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';
import {   SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`,
    );
  });

  it('should update multiple indicator import statements to remove multiple icon types and add new import to new library when no other indicators types exist', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyIconType, SkyIconStackItem } from '@skyux/indicators';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`;
    tree.create(path, content);
    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconStackItem', 'SkyIconType'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';

import { SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`,
    );
  });

  it('should update when some imports have already switched', () => {
    const content = `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyIconStackItem } from '@skyux/indicators';
import { SkyIconType } from '@skyux/icon';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`;
    tree.create(path, content);
    moveClassToLibrary(tree, path, {
      classNames: ['SkyIconStackItem', 'SkyIconType'],
      previousLibrary: '@skyux/indicators',
      newLibrary: '@skyux/icon',
    });
    const updatedContent = tree.readText(path);
    expect(updatedContent).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyIconStackItem } from '@skyux/icon';
import { SkyChevronModule,  } from '@skyux/indicators';
import { SkyIconType } from '@skyux/icon';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
`,
    );
  });
});
