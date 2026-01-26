import { Rule } from '@angular-devkit/schematics';

import { convertGridToDataGrid } from '../../rules/convert-grid-to-data-grid/convert-grid-to-data-grid';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
 */
export default function convertGridToDataGridSchematic(options: Schema): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertGridToDataGrid(project.root);
  };
}
