import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Icon library location updates', () => {
  let tree: UnitTestTree;
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  beforeEach(async () => {
    tree = await createTestApp(runner, { projectName: 'my-app' });
  });

  it('should update single indicator import to SkyIconModule', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
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
export class AppModule {}`,
    );
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
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

  it('should update multiple indicator import to remove SkyIconModule and add new import to new library', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { NgModule } from '@angular/core';
import { SkyChevronModule, SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyIconModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyChevronModule,  SkyKeyInfoModule } from '@skyux/indicators';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [SkyChevronModule, SkyIconModule, SkyKeyInfoModule, BrowserAnimationsModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    );
  });

  it('should update multiple indicator import to remove multiple icon types and add new import to new library', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { Component } from '@angular/core';
import { SkyChevronModule, SkyIconType, SkyIconStackItem, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {}`,
    );
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { Component } from '@angular/core';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';
import { SkyChevronModule,   SkyKeyInfoModule } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {}`,
    );
  });

  it('should update multiple indicator import to remove multiple icon types and add new import to new library when no other indicators types exist', async () => {
    tree.create(
      '/projects/my-app/src/app/test.module.ts',
      `import { Component } from '@angular/core';
import { SkyIconType, SkyIconStackItem } from '@skyux/indicators';
import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {}`,
    );
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(
      `import { Component } from '@angular/core';
import { SkyIconStackItem, SkyIconType } from '@skyux/icon';

import { SkyThemeService } from '@skyux/theme';


@Component({
  selector: 'test-cmp',
  templateUrl: './test.component.html'
})
export class TestComponent {}`,
    );
  });

  it('should return if no icons import is included with indicators imports', async () => {
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
    await runner.runSchematic('icons-migration', {}, tree);
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
export class AppModule {}`,
    );
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent(
      '/__skyux/projects/my-app/src/app/test.module.ts',
    );
    expect(content).toEqual(`import { NgModule } from '@angular/core';
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
export class AppModule {}`);
  });

  it('should handle empty files', async () => {
    tree.create('/projects/my-app/src/app/test.module.ts', ``);
    await runner.runSchematic('icons-migration', {}, tree);
    const content = tree.readContent('/projects/my-app/src/app/test.module.ts');
    expect(content).toEqual(``);
  });

  it('should add @skyux/icon if @skyux/indicators is installed in dependencies', async () => {
    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@skyux/indicators": "10.26.0"}}',
    );

    await runner.runSchematic('icons-migration', {}, tree);

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/icon': '10.26.0',
        '@skyux/indicators': '10.26.0',
      },
    });
  });

  it('should add @skyux/icon if @skyux/indicators is installed in devDependencies', async () => {
    tree.overwrite(
      '/package.json',
      '{"devDependencies": {"@skyux/indicators": "10.26.0"}}',
    );

    await runner.runSchematic('icons-migration', {}, tree);

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/icon': '10.26.0',
      },
      devDependencies: {
        '@skyux/indicators': '10.26.0',
      },
    });
  });

  it('should not add @skyux/icon if @skyux/indicators is not installed', async () => {
    tree.overwrite('/package.json', '{"dependencies": {}}');

    await runner.runSchematic('icons-migration', {}, tree);

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {},
    });
  });

  it('should update "testing" imports', async () => {
    tree.create(
      '/projects/my-app/src/app/foo.spec.ts',
      `import { SkyIconHarness, SkyIconHarnessFilters } from '@skyux/indicators/testing';`,
    );

    await runner.runSchematic('icons-migration', {}, tree);

    const content = tree.readContent('/projects/my-app/src/app/foo.spec.ts');

    expect(content).toEqual(
      `import { SkyIconHarness, SkyIconHarnessFilters } from '@skyux/icon/testing';\n`,
    );
  });
});
