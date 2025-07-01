import { type GeneratorCallback, type Tree } from '@nx/devkit';
import {
  Schema as ComponentSchema,
  Style,
} from '@schematics/angular/component/schema';
import {
  Schema as ModuleSchema,
  TypeSeparator,
} from '@schematics/angular/module/schema';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

export async function angularModuleGenerator(
  tree: Tree,
  schema: ModuleSchema,
): Promise<GeneratorCallback> {
  return await wrapAngularDevkitSchematic('@schematics/angular', 'module')(
    tree,
    {
      typeSeparator: TypeSeparator.TypeSeparator,
      ...schema,
    } satisfies ModuleSchema,
  );
}

export async function angularComponentGenerator(
  tree: Tree,
  schema: ComponentSchema,
): Promise<GeneratorCallback> {
  return await wrapAngularDevkitSchematic('@schematics/angular', 'component')(
    tree,
    {
      style: Style.Scss,
      type: 'component',
      ...schema,
    } satisfies ComponentSchema,
  );
}
