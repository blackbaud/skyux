import { Rule } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { convertPageSummaryToPageHeader } from '../../rules/convert-page-summary-to-page-header/convert-page-summary-to-page-header.js';

import { Schema } from './schema.js';

/**
 * Converts `<sky-page-summary>` components to `<sky-page-header>` components.
 */
export default function convertPageSummaryToPageHeaderSchematic(
  options: Schema,
): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);

    return convertPageSummaryToPageHeader(project.root);
  };
}
