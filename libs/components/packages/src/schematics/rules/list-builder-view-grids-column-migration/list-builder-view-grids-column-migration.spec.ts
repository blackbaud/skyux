import { SchematicContext } from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

import { listBuilderViewGridColumnMigration } from './list-builder-view-grids-column-migration';

describe('List Builder View Grids Column Migration', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  async function setup(): Promise<{
    tree: UnitTestTree;
    context: { addTask: jest.Mock };
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const context = {
      addTask: jest.fn(),
    };

    return { tree, context };
  }

  it('should add legacy class to "sky-list-view-grid > sky-grid-column" elements in HTML file', async () => {
    const { tree, context } = await setup();
    const scheduleSpy = jest.spyOn(context, 'addTask');

    const htmlContent = `
<sky-list-view-grid>
  <sky-grid-column field="name" title="Name"></sky-grid-column>
  <sky-grid-column field="age" title="Age" class="custom-class"/>
  <sky-grid-column field="location" title="Location" class="legacy another-class"></sky-grid-column>
</sky-list-view-grid>
    `;
    tree.create('/src/app/test.component.html', htmlContent);

    const expectedContent = `
<sky-list-view-grid>
  <sky-grid-column field="name" title="Name" class="legacy"></sky-grid-column>
  <sky-grid-column field="age" title="Age" class="custom-class legacy"/>
  <sky-grid-column field="location" title="Location" class="legacy another-class"></sky-grid-column>
</sky-list-view-grid>
    `;

    void listBuilderViewGridColumnMigration('/')(
      tree,
      context as unknown as SchematicContext,
    );

    const updatedContent = tree.readText('/src/app/test.component.html');
    expect(updatedContent).toBe(expectedContent);
    expect(scheduleSpy).toHaveBeenCalledWith(
      new RunSchematicTask('@angular/core', 'cleanup-unused-imports'),
    );
  });

  it('should add legacy class to "sky-list-view-grid > sky-grid-column" elements in inline template', async () => {
    const { tree, context } = await setup();
    const scheduleSpy = jest.spyOn(context, 'addTask');

    const tsContent = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`
<sky-list-view-grid>
  <sky-grid-column field="name" title="Name" />
  <sky-grid-column field="age" title="Age" class="custom-class"></sky-grid-column>
  <sky-grid-column field="location" title="Location" class="legacy another-class"></sky-grid-column>
</sky-list-view-grid>
  \`
})
export class TestComponent {}
    `;
    tree.create('/src/app/test.component.ts', tsContent);

    const expectedContent = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`
<sky-list-view-grid>
  <sky-grid-column field="name" title="Name"  class="legacy"/>
  <sky-grid-column field="age" title="Age" class="custom-class legacy"></sky-grid-column>
  <sky-grid-column field="location" title="Location" class="legacy another-class"></sky-grid-column>
</sky-list-view-grid>
  \`
})
export class TestComponent {}
    `;

    void listBuilderViewGridColumnMigration('/')(
      tree,
      context as unknown as SchematicContext,
    );

    const updatedContent = tree.readText('/src/app/test.component.ts');
    expect(updatedContent).toBe(expectedContent);
    expect(scheduleSpy).toHaveBeenCalledWith(
      new RunSchematicTask('@angular/core', 'cleanup-unused-imports'),
    );
  });
});
