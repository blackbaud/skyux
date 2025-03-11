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
      `<sky-icon icon="plus-circle" size="sm"></sky-icon>`,
    );

    tree.create(
      '/icon5.component.html',
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

  it('should handle icon which already sets the size', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon4.component.html')).toBe(
      `<sky-icon icon="plus-circle" size="sm"></sky-icon>`,
    );
  });

  it('should handle iconName missing the size', async () => {
    const { tree } = await setupTest();

    expect(tree.readText('/icon5.component.html')).toBe(
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
