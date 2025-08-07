import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Remove angular eslint prefer standalone component', () => {
  let tree: UnitTestTree;
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  beforeEach(async () => {
    tree = await createTestApp(runner, { projectName: 'my-app' });
  });

  it('should remove the prefer-standalone-component as the only rule in an ESLint disable comment', async () => {
    const filePath = '/projects/my-app/src/app/full-line.component.ts';
    const content = stripIndents`
        import { Component } from '@angular/core';

        // eslint-disable-next-line @angular-eslint/prefer-standalone-component
        @Component({
          selector: 'app-full-line',
          template: 'Test.',
        })
        class FullLineComponent {}
        `;
    tree.create(filePath, content);
    await runner.runSchematic(
      'remove-angular-eslint-prefer-standalone-component',
      {},
      tree,
    );

    const newContent = tree.readText(filePath);
    expect(newContent).toEqual(
      stripIndents`
        import { Component } from '@angular/core';


        @Component({
          selector: 'app-full-line',
          template: 'Test.',
        })
        class FullLineComponent {}
        `,
    );
  });

  it('should remove the prefer-standalone-component rule as the first of multiple ESLint disable comments', async () => {
    const filePath = '/projects/my-app/src/app/full-line.component.ts';
    const content = stripIndents`
        import { Component } from '@angular/core';

        // eslint-disable-next-line @angular-eslint/prefer-standalone-component, @angular-eslint/prefer-on-push-component-change-detection
        @Component({
          selector: 'app-full-line',
          template: 'Test.',
        })
        class FullLineComponent {}
        `;
    tree.create(filePath, content);
    await runner.runSchematic(
      'remove-angular-eslint-prefer-standalone-component',
      {},
      tree,
    );

    const newContent = tree.readText(filePath);
    expect(newContent).toEqual(
      stripIndents`
        import { Component } from '@angular/core';

        // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
        @Component({
          selector: 'app-full-line',
          template: 'Test.',
        })
        class FullLineComponent {}
        `,
    );
  });
});
