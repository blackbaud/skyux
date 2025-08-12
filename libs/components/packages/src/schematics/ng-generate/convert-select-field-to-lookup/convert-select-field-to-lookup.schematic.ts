import { Rule } from '@angular-devkit/schematics';
import { readWorkspace } from '@schematics/angular/utility';

import { convertSelectFieldToLookup } from '../../rules/convert-select-field-to-lookup/convert-select-field-to-lookup';

import { Schema } from './schema';

/**
 * Converts `<sky-select-field>` to `<sky-lookup>`.
 */
export default function convertSelectFieldToLookupSchematic(
  options: Partial<Schema>,
): Rule {
  return async (tree) => {
    const projectPath = await readWorkspace(tree).then(
      ({ projects }) => projects.get(`${options.project}`)?.root ?? '',
    );
    const settings: Schema = {
      project: `${options.project}`,
      projectPath: projectPath,
      bestEffortMode: !!options.bestEffortMode,
      insertTodos: !!options.insertTodos,
    };
    return convertSelectFieldToLookup(settings);
  };
}
