import { Rule } from '@angular-devkit/schematics';

import { JsonFile } from '../../utility/json-file';
import { readRequiredFile } from '../../utility/tree';

export default function disableStrictModeRules(): Rule {
  return async (tree, context) => {
    const tsConfig = new JsonFile(tree, 'tsconfig.json');

    if (
      tsConfig.get(['compilerOptions', 'strict']) === true &&
      tsConfig.get(['compilerOptions', 'strictNullChecks']) !== false
    ) {
      const contents = readRequiredFile(tree, 'tsconfig.json').replace(
        /"compilerOptions": +{/,
        `"compilerOptions": {
    // TypeScript 4.4 introduces breaking changes for the rule "strictNullChecks".
    // See: https://github.com/microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#any-and-unknown-are-considered-possibly-falsy-in--expressions
    // TODO: Remove "strictNullChecks" and address any build errors.
    "strictNullChecks": false,`
      );

      tree.overwrite('tsconfig.json', contents);

      context.logger.warn(
        '\nStrict mode is enabled for your project. ' +
          'The latest version of TypeScript introduces new implementations for strict mode which may result in build errors that you will need to resolve manually. ' +
          "We've disabled the affected rules in your tsconfig.json file, but you can enable them later if you wish. " +
          '\nFor more information, see: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html.\n'
      );
    }
  };
}
