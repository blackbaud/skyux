import { Rule } from '@angular-devkit/schematics';

import { convertProgressIndicatorWizardToTabWizard } from '../../rules/convert-progress-indicator-wizard-to-tab-wizard/convert-progress-indicator-wizard-to-tab-wizard';

import { Schema } from './schema';

/**
 * Converts `<sky-progress-indicator>` components using
 * `displayMode="horizontal"` to `<sky-tabset>` components
 * with `<sky-tab>` elements.
 */
export default function convertProgressIndicatorWizardToTabWizardSchematic(
  options: Partial<Schema>,
): Rule {
  return convertProgressIndicatorWizardToTabWizard({
    projectPath: options.projectPath ?? '',
    bestEffortMode: !!options.bestEffortMode,
    insertTodos: !!options.insertTodos,
  });
}
