import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('rename-tabset-tabindex.schematic', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json'),
  );

  const angularJson = {
    version: 1,
    projects: {
      test: {
        projectType: 'application',
        root: '',
        architect: {},
      },
    },
  };

  async function setupTest(): Promise<{ tree: Tree }> {
    const tree = Tree.empty();
    tree.create(
      '/tabset1.component.html',
      `<sky-tabset>
  <sky-tab [active]="true" tabIndex="0">Tab 1 content</sky-tab>
  <sky-tab
    tabHeading="Tab 2"
    tabIndex="abc">Tab 2 content tabIndex</sky-tab>
</sky-tabset><br /><p><div />`,
    );

    tree.create(
      '/tabset2.component.html',
      `<sky-tabset>
  <sky-tab [tabIndex]="0">Tab 1 content</sky-tab>
  <sky-tab [tabIndex]="abc"
/>
</sky-tabset>`,
    );

    tree.create(
      '/tabset3.component.ts',
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-tab tabIndex="5"></sky-tab>'
})
export class Tabset3Component {}
`,
    );

    tree.create(
      '/no-tabset.component.html',
      `<sky-alert>I have no tab.</sky-alert>`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('rename-tabset-tabindex', {}, tree);

    return { tree };
  }

  it('should handle bad HTML', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/tabset1.component.html')).toBe(`<sky-tabset>
  <sky-tab [active]="true" tabIndexValue="0">Tab 1 content</sky-tab>
  <sky-tab
    tabHeading="Tab 2"
    tabIndexValue="abc">Tab 2 content tabIndex</sky-tab>
</sky-tabset><br /><p><div />`);
  });

  it('should handle self-closed sky-tab elements', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/tabset2.component.html')).toBe(`<sky-tabset>
  <sky-tab [tabIndexValue]="0">Tab 1 content</sky-tab>
  <sky-tab [tabIndexValue]="abc"
/>
</sky-tabset>`);
  });

  it('should handle HTML in component files', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/tabset3.component.ts')).toBe(
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-tab tabIndexValue="5"></sky-tab>'
})
export class Tabset3Component {}
`,
    );
  });

  it('should handle HTML with no sky-tab elements', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/no-tabset.component.html')).toBe(
      `<sky-alert>I have no tab.</sky-alert>`,
    );
  });
});
