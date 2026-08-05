import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('remove-timepicker-retain-invalid-values.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  function setupTree(files: Record<string, string>): Tree {
    const tree = Tree.empty();
    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            architect: {},
          },
          lib: {
            projectType: 'library',
            root: 'projects/lib',
            sourceRoot: 'projects/lib/src',
            architect: {},
          },
        },
      }),
    );
    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }
    return tree;
  }

  async function runSchematic(tree: Tree): Promise<void> {
    await runner.runSchematic(
      'remove-timepicker-retain-invalid-values',
      {},
      tree,
    );
  }

  it('should remove a static attribute', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-timepicker #timepicker>
  <input skyTimepickerRetainInvalidValues type="text" [skyTimepickerInput]="timepicker" />
</sky-timepicker>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-timepicker #timepicker>
  <input type="text" [skyTimepickerInput]="timepicker" />
</sky-timepicker>`);
  });

  it('should remove a bound attribute', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-timepicker #timepicker>
  <input type="text" [skyTimepickerInput]="timepicker" [skyTimepickerRetainInvalidValues]="retain" />
</sky-timepicker>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-timepicker #timepicker>
  <input type="text" [skyTimepickerInput]="timepicker" />
</sky-timepicker>`);
  });

  it('should remove an attribute with a value on its own line', async () => {
    const tree = setupTree({
      '/projects/lib/src/lib/test.component.html': `<sky-timepicker #timepicker>
  <input
    skyTimepickerRetainInvalidValues="true"
    type="text"
    [skyTimepickerInput]="timepicker"
  />
</sky-timepicker>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/projects/lib/src/lib/test.component.html'))
      .toBe(`<sky-timepicker #timepicker>
  <input
    type="text"
    [skyTimepickerInput]="timepicker"
  />
</sky-timepicker>`);
  });

  it('should remove the attribute from inline templates', async () => {
    const tree = setupTree({
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`<sky-timepicker #tp><input skyTimepickerRetainInvalidValues [skyTimepickerInput]="tp" /></sky-timepicker>\`,
})
export class TestComponent {}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.ts'))
      .toBe(`import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`<sky-timepicker #tp><input [skyTimepickerInput]="tp" /></sky-timepicker>\`,
})
export class TestComponent {}`);
  });

  it('should not change files without the attribute', async () => {
    const templateWithoutAttribute = `<sky-timepicker #timepicker>
  <input type="text" [skyTimepickerInput]="timepicker" />
</sky-timepicker>`;
    const componentWithoutInlineTemplate = `import { Component } from '@angular/core';

// skyTimepickerRetainInvalidValues
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent {}`;

    const tree = setupTree({
      '/src/app/test.component.html': templateWithoutAttribute,
      '/src/app/test.component.ts': componentWithoutInlineTemplate,
      '/src/styles.css': 'body { color: red; }',
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(
      templateWithoutAttribute,
    );
    expect(tree.readText('/src/app/test.component.ts')).toBe(
      componentWithoutInlineTemplate,
    );
  });
});
