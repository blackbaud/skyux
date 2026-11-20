import { Rule } from '@angular-devkit/schematics';

import { convertStacheBlockquoteToBlockquote } from '../../rules/convert-stache-blockquote-to-blockquote/convert-stache-blockquote-to-blockquote';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts Stache's blockquote to SKY UX's `SkyBlockquote`.
 */
export default function convertStacheBlockquoteToBlockquoteSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertStacheBlockquoteToBlockquote(project.root);
  };
}
