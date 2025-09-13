import { Rule } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { convertDefinitionListToDescriptionList } from '../../rules/convert-definition-list-to-description-list/convert-definition-list-to-description-list.js';

import { Schema } from './schema.js';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
 */
export default function convertDefinitionListToDescriptionListSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);

    return convertDefinitionListToDescriptionList(project.root);
  };
}
