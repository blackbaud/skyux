import { Rule } from '@angular-devkit/schematics';

import { convertPageSummaryToPageHeader } from '../../rules/convert-page-summary-to-page-header/convert-page-summary-to-page-header';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-page-summary>` components to `<sky-page-header>` components.
 */
export default function convertPageSummaryToPageHeaderSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const { project } = await getRequiredProject(tree, options.project);

    return convertPageSummaryToPageHeader(project.root);
  };
}
