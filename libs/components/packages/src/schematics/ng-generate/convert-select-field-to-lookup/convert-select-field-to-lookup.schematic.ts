import { Rule } from '@angular-devkit/schematics';

import * as process from 'node:process';

import { convertSelectFieldToLookup } from '../../rules/convert-select-field-to-lookup/convert-select-field-to-lookup';

import { Schema } from './schema';

/**
 * Converts `<sky-select-field>` to `<sky-lookup>`.
 */
export default function convertSelectFieldToLookupSchematic(
  options: Partial<Schema>,
): Rule {
  const settings: Schema = {
    projectPath: options.projectPath ?? process.cwd(),
    bestEffortMode: options.bestEffortMode ?? false,
    insertTodos: options.insertTodos ?? false,
  };
  return convertSelectFieldToLookup(settings.projectPath, settings);
}
