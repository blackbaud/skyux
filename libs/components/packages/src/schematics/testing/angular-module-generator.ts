import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Schema as ComponentSchema } from '@schematics/angular/component/schema';
import { Schema as ModuleSchema } from '@schematics/angular/module/schema';

export async function angularModuleGenerator(
  runner: SchematicTestRunner,
  tree: UnitTestTree,
  schema: ModuleSchema,
): Promise<UnitTestTree> {
  return await runner.runExternalSchematic(
    '@schematics/angular',
    'module',
    schema,
    tree,
  );
}

export async function angularComponentGenerator(
  runner: SchematicTestRunner,
  tree: UnitTestTree,
  schema: ComponentSchema,
): Promise<UnitTestTree> {
  return await runner.runExternalSchematic(
    '@schematics/angular',
    'component',
    {
      style: 'scss',
      type: 'component',
      ...schema,
    },
    tree,
  );
}
