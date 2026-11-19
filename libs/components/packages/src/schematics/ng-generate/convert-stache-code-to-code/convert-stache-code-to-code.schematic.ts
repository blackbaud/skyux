import { Rule } from '@angular-devkit/schematics';

import { convertStacheCodeToCode } from '../../rules/convert-stache-code-to-code/convert-stache-code-to-code';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts Stache's `SkyCodeModule` to SKY UX's `SkyCode`.
 */
export default function convertStacheCodeToCodeSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertStacheCodeToCode(project.root);
  };
}
