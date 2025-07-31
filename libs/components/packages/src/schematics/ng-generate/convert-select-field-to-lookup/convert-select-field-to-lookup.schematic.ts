import { Rule } from '@angular-devkit/schematics';

import { convertSelectFieldToLookup } from '../../rules/convert-select-field-to-lookup/convert-select-field-to-lookup';
import {
  getDefaultProjectName,
  getRequiredProject,
} from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-select-field>` to `<sky-lookup>`.
 */
export default function convertSelectFieldToLookupSchematic(
  options: Partial<Schema>,
): Rule {
  return async (tree) => {
    const projectName = options.project || (await getDefaultProjectName(tree));
    if (!projectName) {
      throw new Error(
        'Project name is required. Provide a valid project name using the `--project` option.',
      );
    }
    const projectConf = await getRequiredProject(tree, projectName);
    const projectPath = options.projectPath || projectConf.project.root;
    const settings: Schema = {
      project: projectName,
      projectPath: projectPath,
      bestEffortMode: !!options.bestEffortMode,
      insertTodos: !!options.insertTodos,
    };
    return convertSelectFieldToLookup(settings);
  };
}
