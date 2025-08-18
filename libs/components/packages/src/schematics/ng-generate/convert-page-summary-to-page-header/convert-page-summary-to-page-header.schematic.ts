import { Rule } from '@angular-devkit/schematics';
import { readWorkspace } from '@schematics/angular/utility';

import { convertPageSummaryToPageHeader } from '../../rules/convert-page-summary-to-page-header/convert-page-summary-to-page-header';

import { Schema } from './schema';

/**
 * Converts `<sky-page-summary>` components to `<sky-page-header>` components.
 */
export default function convertPageSummaryToPageHeaderSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const projectRoot = await readWorkspace(tree).then(
      ({ projects }) => projects.get(`${options.project}`)?.root ?? '',
    );

    return convertPageSummaryToPageHeader(projectRoot);
  };
}
