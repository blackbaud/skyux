import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Help inline module updates', () => {
  let tree: UnitTestTree;
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  beforeEach(async () => {
    tree = await createTestApp(runner, { projectName: 'my-app' });
  });

  it('should update single indicator import to SkyHelpInlineModule', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyHelpInlineModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
    await runner.runSchematic('help-inline-import-path', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyHelpInlineModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
  });

  it('should update multiple indicator import to remove SkyHelpInlineModule and add new import to new library', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyHelpInlineModule, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyHelpInlineModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
    await runner.runSchematic('help-inline-import-path', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyChevronModule,  SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyHelpInlineModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
  });

  it('should return if no SkyHelpInlineModule import is included with indicators imports', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
    await runner.runSchematic('help-inline-import-path', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
  });

  it('should not update imports within restricted files', async () => {
    tree.create(
      '/__skyux/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyHelpInlineModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
    await runner.runSchematic('help-inline-import-path', {}, tree);
    const content = tree.readContent(
      '/__skyux/projects/my-app/src/app/test.module.ts',
    );
    expect(content).toEqual(`import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyHelpInlineModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`);
  });

  it('should handle empty files', async () => {
    tree.create('/projects/my-app/src/app/test.module.ts', ``);
    await runner.runSchematic('help-inline-import-path', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(``);
  });
});
