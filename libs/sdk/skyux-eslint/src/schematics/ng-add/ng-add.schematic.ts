import { Rule } from '@angular-devkit/schematics';

import { Schema } from './schema';

export default function ngAdd(options: Schema): Rule {
  return async () => {
    console.log('options:', options);
  };
}
