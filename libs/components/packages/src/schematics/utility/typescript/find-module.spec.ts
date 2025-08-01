import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import {
  angularComponentGenerator,
  angularModuleGenerator,
} from '../../testing/angular-module-generator';
import { createTestApp } from '../../testing/scaffold';

import { findDeclaringModule, isStandaloneComponent } from './find-module';

describe('find-module', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should find module', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'test',
      project: 'test',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'other',
      project: 'test',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test',
      module: 'test',
      standalone: false,
    });
    expect(tree.readText('src/app/test/test.module.ts')).toMatchSnapshot();
    const module = findDeclaringModule(
      tree,
      'src',
      'src/app/test/test.component.ts',
    );
    expect(module?.filepath).toBe('./src/app/test/test.module.ts');
    expect(module?.module.className).toBe('TestModule');
  });

  it('should find standalone component', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'test',
      project: 'test',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test',
      module: 'test',
    });
    expect(tree.readText('src/app/test/test.module.ts')).toMatchSnapshot();
    const module = findDeclaringModule(
      tree,
      'src',
      'src/app/test/test.component.ts',
    );
    expect(module?.filepath).toBe('./src/app/test/test.component.ts');
    expect(module?.module.className).toBe('TestComponent');
    expect(module?.module.metadata).toBeTruthy();
    expect(isStandaloneComponent(module?.module.metadata as any)).toBe(true);
  });

  it('should find module, skip non-declaring reference', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test',
    });
    await angularModuleGenerator(runner, tree, {
      name: 'test/bogus',
      flat: true,
      project: 'test',
    });
    const recorder = tree.beginUpdate('src/app/test/bogus.module.ts');
    recorder.insertLeft(
      0,
      `import { TestComponent } from './test.component';\n`,
    );
    await angularModuleGenerator(runner, tree, {
      name: 'test',
      project: 'test',
    });
    await angularComponentGenerator(runner, tree, {
      name: 'test',
      project: 'test',
      module: 'test',
      standalone: false,
    });
    const module = findDeclaringModule(
      tree,
      'src',
      'src/app/test/test.component.ts',
    );
    expect(module?.filepath).toBe('./src/app/test/test.module.ts');
    expect(module?.module.className).toBe('TestModule');
  });
});
