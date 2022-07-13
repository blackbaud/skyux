import { Tree } from '@nrwl/devkit';
import { Schema as ModuleSchema } from '@schematics/angular/module/schema';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

export async function angularModuleGenerator(tree: Tree, schema: ModuleSchema) {
  return wrapAngularDevkitSchematic('@schematics/angular', 'module')(
    tree,
    schema
  );
}
