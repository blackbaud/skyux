import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { firstValueFrom } from 'rxjs';

import { createTestLibrary } from '../testing/scaffold';

import { addCommonJsConfig } from './add-commonjs-config';

describe('add-commonjs-config', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../collection.json'),
  );

  it('should not update library config', async () => {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });
    await firstValueFrom(runner.callRule(addCommonJsConfig('my-lib'), tree));
    const workspace = await getWorkspace(tree);
    expect(
      workspace.projects.get('my-lib')?.targets.get('build')?.options?.[
        'allowedCommonJsDependencies'
      ],
    ).toBeUndefined();
  });

  it('should update app config', async () => {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });
    await firstValueFrom(
      runner.callRule(addCommonJsConfig('my-lib-showcase'), tree),
    );
    const workspace = await getWorkspace(tree);
    expect(
      workspace.projects.get('my-lib-showcase')?.targets.get('build')
        ?.options?.['allowedCommonJsDependencies'],
    ).toEqual([
      '@skyux/icons',
      'autonumeric',
      'dom-autoscroller',
      'dragula',
      'fontfaceobserver',
      'intl-tel-input',
      'moment',
    ]);
  });
});
