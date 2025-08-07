import { Rule } from '@angular-devkit/schematics';

import { removeEslintDisableComment } from '../../../rules/remove-eslint-disable-comment/remove-eslint-disable-comment';

export default function removeAngularEslintPreferStandaloneComponent(): Rule {
  return removeEslintDisableComment({
    ruleNames: ['@angular-eslint/prefer-standalone-component'],
  });
}
