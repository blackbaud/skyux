import { Rule } from '@angular-devkit/schematics';

import { convertProgressIndicatorWizardToTabWizard } from '../../rules/convert-progress-indicator-wizard-to-tab-wizard/convert-progress-indicator-wizard-to-tab-wizard';
import {
  getDefaultProjectName,
  getRequiredProject,
} from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Converts `<sky-progress-indicator>` components using
 * `displayMode="horizontal"` to `<sky-tabset>` components
 * with `<sky-tab>` elements.
 */
export default function convertProgressIndicatorWizardToTabWizardSchematic(
  options: Partial<Schema>,
): Rule {
  return async (tree) => {
    const projectName = options.project || (await getDefaultProjectName(tree));
    if (!projectName) {
      throw new Error(
        'Project name is required. Provide a valid project name using the `--project` option.',
      );
    }
    const projectConf = await getRequiredProject(tree, projectName);
    const projectPath = options.projectPath || projectConf.project.root;
    const settings: Schema = {
      project: projectName,
      projectPath: projectPath,
      bestEffortMode: !!options.bestEffortMode,
      insertTodos: !!options.insertTodos,
    };
    return convertProgressIndicatorWizardToTabWizard(settings);
  };
}
