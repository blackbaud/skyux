import { Rule } from '@angular-devkit/schematics';

import { convertPageSummaryToPageHeader } from '../../rules/convert-page-summary-to-page-header/convert-page-summary-to-page-header';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
 */
export default function convertPageSummaryToPageHeaderSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertPageSummaryToPageHeader(project.root);
  };
}
