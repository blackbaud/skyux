import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { take } from 'rxjs/operators';

import { createTestApp } from '../../../testing/scaffold';
import { getWorkspace } from '../../../utility/workspace';

import { updatePolyfillSchematic } from './update-polyfill.schematic';

describe('updatePolyfill', () => {
  const runner = new SchematicTestRunner(
    '@skyux/packages',
    require.resolve('../../../../collection.json')
  );

  it('should create an instance', async () => {
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
    await runner
      .callRule(updatePolyfillSchematic(), tree)
      .pipe(take(1))
      .toPromise();
    const polyfills = tree.readText(`${projectRoot}/src/polyfills.ts`);
    expect(polyfills).not.toContain('(window as any).global = window;');
    expect(polyfills).not.toContain('This is a comment.');
    expect(polyfills).toContain("import 'zone.js';");
  });
});
