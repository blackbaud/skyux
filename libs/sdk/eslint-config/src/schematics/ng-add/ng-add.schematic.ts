import { Rule, chain } from '@angular-devkit/schematics';

import { installDependencies } from '../shared/rules/install-dependencies';
import { modifyEsLintConfig } from '../shared/rules/modify-eslint-config';

export default function ngAdd(): Rule {
  return () => {
    return chain([installDependencies(), modifyEsLintConfig()]);
  };
}
