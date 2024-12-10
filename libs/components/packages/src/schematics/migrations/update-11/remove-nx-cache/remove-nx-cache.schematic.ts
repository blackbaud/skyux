import { Rule } from '@angular-devkit/schematics';

import { removeNxCache } from '../../../rules/remove-nx-cache/remove-nx-cache';

export default function (): Rule {
  return () => {
    return removeNxCache({
      rootDir: '.',
    });
  };
}
