import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('icons-size.schematic', () => {
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
      '/icon1.component.html',
      `<sky-icon icon="plus-circle"></sky-icon>`,
    );

    tree.create('/icon2.component.html', `<sky-icon icon="plus-circle"/>`);

    tree.create(
      '/icon3.component.ts',
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-icon icon="plus-circle"/>'
})
export class Icon3Component {}`,
    );

    tree.create(
      '/icon4.component.html',
      `<sky-icon size="sm" icon="plus-circle"></sky-icon>`,
    );

    tree.create(
      '/icon5.component.html',
      `<sky-icon variant="line" size="sm" icon="plus-circle"></sky-icon>`,
    );

    tree.create(
      '/icon6.component.html',
      `<sky-icon iconName="eye"></sky-icon>`,
    );

    tree.create(
      '/no-icon.component.html',
      `<sky-alert>I have no icon.</sky-alert>`,
    );

    tree.create(
      '/not-a-template.txt',
      `<sky-icon icon="plus-circle"></sky-icon>`,
    );

    tree.create(
      '/icon-size-already-set.html',
      `
<!-- should change -->
<sky-icon
  icon="foo"
/>
<!-- should not change -->
<sky-icon
  iconName="bar"
  iconSize="m"
/>
`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icons-size', {}, tree);

    return { tree };
  }

  it('should handle icon missing the size', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon1.component.html')).toBe(
      `<sky-icon size="md" icon="plus-circle"></sky-icon>`,
    );
  });

  it('should handle self-closed sky-icon elements', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon2.component.html')).toBe(
      `<sky-icon size="md" icon="plus-circle"/>`,
    );
  });

  it('should handle HTML in component files', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon3.component.ts')).toBe(
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-icon size="md" icon="plus-circle"/>'
})
export class Icon3Component {}`,
    );
  });

  it('should handle icon which already sets the size and is the first property', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon4.component.html')).toBe(
      `<sky-icon size="sm" icon="plus-circle"></sky-icon>`,
    );
  });

  it('should handle icon which already sets the size and is not the first property', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon5.component.html')).toBe(
      `<sky-icon variant="line" size="sm" icon="plus-circle"></sky-icon>`,
    );
  });

  it('should not set "size" if "iconSize" already set', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon-size-already-set.html')).toBe(
      `
<!-- should change -->
<sky-icon size="md"
  icon="foo"
/>
<!-- should not change -->
<sky-icon
  iconName="bar"
  iconSize="m"
/>
`,
    );
  });

  it('should handle iconName missing the size', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon6.component.html')).toBe(
      `<sky-icon size="md" iconName="eye"></sky-icon>`,
    );
  });

  it('should handle HTML with no sky-icon elements', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/no-icon.component.html')).toBe(
      `<sky-alert>I have no icon.</sky-alert>`,
    );
  });

  it('should ignore files that do not contain Angular templates', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/not-a-template.txt')).toBe(
      `<sky-icon icon="plus-circle"></sky-icon>`,
    );
  });
});
