import { Rule } from '@angular-devkit/schematics';
import { removeDependency } from '@schematics/angular/utility/dependency';

export default function uninstallPrettierSchematics(): Rule {
  return removeDependency('@skyux-sdk/prettier-schematics');
}
