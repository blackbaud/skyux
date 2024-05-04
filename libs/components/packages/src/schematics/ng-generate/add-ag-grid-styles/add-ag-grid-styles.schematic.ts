import { Rule } from '@angular-devkit/schematics';

import { addAgGridStylesConfig } from '../../rules/add-ag-grid-styles-config';

import { Schema } from './schema';

export default function (options: Schema): Rule {
  return (_tree, _context) => {
    return addAgGridStylesConfig(options.project as string);
  };
}
