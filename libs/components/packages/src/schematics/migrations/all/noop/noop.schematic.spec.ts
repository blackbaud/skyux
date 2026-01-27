import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('noop schematic', () => {
  it('should work', async () => {
    const runner = new SchematicTestRunner(
      'migrations',
      path.join(__dirname, '../../../../../migrations.json'),
    );

    const tree = await createTestApp(runner, {
      projectName: 'foobar',
    });

    await expect(runner.runSchematic('noop', {}, tree)).resolves.toBeInstanceOf(
      UnitTestTree,
    );
  });
});
