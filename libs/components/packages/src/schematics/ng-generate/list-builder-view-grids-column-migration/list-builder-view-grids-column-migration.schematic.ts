import { Rule } from '@angular-devkit/schematics';

import { listBuilderViewGridColumnMigration } from '../../rules/list-builder-view-grids-column-migration/list-builder-view-grids-column-migration';

export default function listBuilderViewGridColumnMigrationSchematic(options: {
  projectPath?: string;
}): Rule {
  return listBuilderViewGridColumnMigration(options.projectPath ?? '/');
}
