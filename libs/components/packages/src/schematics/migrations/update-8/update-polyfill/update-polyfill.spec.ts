import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../../testing/scaffold';
import { getWorkspace } from '../../../utility/workspace';

describe('updatePolyfill', () => {
  const runner = new SchematicTestRunner(
    '@skyux/packages',
    require.resolve('../../migration-collection.json')
  );

  it('should modify polyfills.ts', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const { workspace } = await getWorkspace(tree);
    const projectDefinition = workspace.projects.get('test-app');
    const projectRoot = projectDefinition?.root;

    expect(projectRoot).toBeDefined();

    tree.create(
      `${projectRoot}/src/polyfills.ts`,
      stripIndents`
      import 'zone.js';

      // This is a comment.
      (window as any).global = window;
    `
    );

    await runner.runSchematic('update-polyfill', {}, tree);

    const polyfills = tree.readText(`${projectRoot}/src/polyfills.ts`);
    expect(polyfills).not.toContain('(window as any).global = window;');
    expect(polyfills).not.toContain('This is a comment.');
    expect(polyfills).toContain("import 'zone.js';");
  });

  it('should capture with start/end comments', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const { workspace } = await getWorkspace(tree);
    const projectDefinition = workspace.projects.get('test-app');
    const projectRoot = projectDefinition?.root;

    expect(projectRoot).toBeDefined();

    tree.create(
      `${projectRoot}/src/polyfills.ts`,
      stripIndents`
      import 'zone.js';

      /***************************************************************************************************
       * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
       */

      // Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
      // which in turn is used by multiple SKY UX components.
      // https://github.com/bevacqua/dragula/issues/602
      (window as any).global = window;

      /*
       * END SKY UX POLYFILLS
       **************************************************************************************************/
     `
    );

    await runner.runSchematic('update-polyfill', {}, tree);

    const polyfills = tree.readText(`${projectRoot}/src/polyfills.ts`);
    expect(polyfills).toMatchSnapshot();
  });
});
