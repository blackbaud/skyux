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

  function setupTest(): { tree: Tree } {
    const tree = Tree.empty();
    tree.create(
      '/tabset1.component.html',
      `<sky-tabset>
  <sky-tab tabIndex="0">Tab 1 content</sky-tab>
  <sky-tab tabIndex="abc">Tab 2 content</sky-tab>
</sky-tabset>`,
    );

    tree.create(
      '/tabset2.component.html',
      `<sky-tabset>
  <sky-tab [tabIndex]="0">Tab 1 content</sky-tab>
  <sky-tab [tabIndex]="abc">Tab 2 content</sky-tab>
</sky-tabset>`,
    );

    tree.create(
      '/no-tabset.component.html',
      `<sky-alert>I have no tab.</sky-alert>`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    return { tree };
  }

  it('should work', async () => {
    const { tree } = setupTest();
    await runner.runSchematic('rename-tabset-tabindex', {}, tree);

    expect(tree.readText('/tabset1.component.html')).toBe(`<sky-tabset>
  <sky-tab tabIndexValue="0">Tab 1 content</sky-tab>
  <sky-tab tabIndexValue="abc">Tab 2 content</sky-tab>
</sky-tabset>`);

    expect(tree.readText('/tabset2.component.html')).toBe(`<sky-tabset>
  <sky-tab [tabIndexValue]="0">Tab 1 content</sky-tab>
  <sky-tab [tabIndexValue]="abc">Tab 2 content</sky-tab>
</sky-tabset>`);

    expect(tree.readText('/no-tabset.component.html')).toBe(
      `<sky-alert>I have no tab.</sky-alert>`,
    );
  });
});
