import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Angular waitForAsync updates', () => {
  let tree: UnitTestTree;
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  beforeEach(async () => {
    tree = await createTestApp(runner, { projectName: 'my-app' });
  });

  it('should update single async imports and calls to waitForAsync', async () => {
    tree.create(
      '/projects/my-app/src/app/test.component.spec.ts',
      `import { async } from '@angular/core/testing';
      import { ComponentFixture, TestBed } from '@example/testing';
      import { AppComponent } from './app.component';

      it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      }));`,
    );
    tree.create(
      '/projects/my-app/src/app/no-imports.component.spec.ts',
      'const test = async();',
    );
    tree.create('/projects/my-app/src/app/void.component.spec.ts', '');
    await runner.runSchematic('ng-wait-for-async-test', {}, tree);
    const content = tree.readContent(
      '/projects/my-app/src/app/test.component.spec.ts',
    );
    expect(content).toContain(
      `import { waitForAsync } from '@angular/core/testing';`,
    );
    expect(content).toContain(
      `it('should create the app', waitForAsync(() => {`,
    );
  });

  it('should update async imports within other imports', async () => {
    tree.create(
      '/projects/my-app/src/app/test.component.spec.ts',
      `import { async, ComponentFixture, TestBed } from '@angular/core/testing';
      import { AppComponent } from './app.component';

      it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      }));`,
    );
    await runner.runSchematic('ng-wait-for-async-test', {}, tree);
    const content = tree.readContent(
      '/projects/my-app/src/app/test.component.spec.ts',
    );
    expect(content).toContain(
      `import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';`,
    );
    expect(content).toContain(
      `it('should create the app', waitForAsync(() => {`,
    );
  });

  it('should update async imports when waitForAsync is already imported', async () => {
    tree.create(
      '/projects/my-app/src/app/test.component.spec.ts',
      `import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
      import { AppComponent } from './app.component';

      it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      }));`,
    );
    await runner.runSchematic('ng-wait-for-async-test', {}, tree);
    const content = tree.readContent(
      '/projects/my-app/src/app/test.component.spec.ts',
    );
    expect(content).toContain(
      `import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';`,
    );
    expect(content).toContain(
      `it('should create the app', waitForAsync(() => {`,
    );
  });
});
