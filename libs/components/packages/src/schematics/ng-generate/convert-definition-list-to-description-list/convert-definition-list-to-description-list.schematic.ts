import { Rule } from '@angular-devkit/schematics';
import { readWorkspace } from '@schematics/angular/utility';

import { convertDefinitionListToDescriptionList } from '../../rules/convert-definition-list-to-description-list/convert-definition-list-to-description-list';

import { Schema } from './schema';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
 */
export default function convertDefinitionListToDescriptionListSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const projectRoot = await readWorkspace(tree).then(
      ({ projects }) => projects.get(`${options.project}`)?.root ?? '',
    );

    return convertDefinitionListToDescriptionList(projectRoot);
  };
}
