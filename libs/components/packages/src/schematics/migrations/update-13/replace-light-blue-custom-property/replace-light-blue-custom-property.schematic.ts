import { Rule } from '@angular-devkit/schematics';

import { replaceCustomProperty } from '../../../rules/replace-custom-property/replace-custom-property.js';

export default function (): Rule {
  return replaceCustomProperty(
    '--sky-category-color-light-blue',
    '--sky-category-color-green',
  );
}
