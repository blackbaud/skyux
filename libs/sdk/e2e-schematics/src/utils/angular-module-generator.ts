import { Tree } from '@nx/devkit';
import { Schema as ComponentSchema } from '@schematics/angular/component/schema';
import { Schema as ModuleSchema } from '@schematics/angular/module/schema';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

export async function angularModuleGenerator(tree: Tree, schema: ModuleSchema) {
  return wrapAngularDevkitSchematic('@schematics/angular', 'module')(
    tree,
    schema,
  );
}

export async function angularComponentGenerator(
  tree: Tree,
  schema: ComponentSchema,
) {
  return wrapAngularDevkitSchematic('@schematics/angular', 'component')(tree, {
    style: 'scss',
    ...schema,
  });
}
