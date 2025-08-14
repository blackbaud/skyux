import { Rule } from '@angular-devkit/schematics';

import { convertDefinitionListToDescriptionList } from '../../rules/convert-definition-list-to-description-list/convert-definition-list-to-description-list';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
 */
export default function convertDefinitionListToDescriptionListSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertDefinitionListToDescriptionList(project.root);
  };
}
