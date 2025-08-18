import { Rule } from '@angular-devkit/schematics';
import { readWorkspace } from '@schematics/angular/utility';

import { convertPageSummaryToPageHeader } from '../../rules/convert-page-summary-to-page-header/convert-page-summary-to-page-header';

import { Schema } from './schema';

/**
 * Converts `<sky-definition-list>` to `<sky-description-list>`.
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
