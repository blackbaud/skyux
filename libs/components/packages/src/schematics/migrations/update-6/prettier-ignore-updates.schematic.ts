import { Rule } from '@angular-devkit/schematics';

import { regexEscape } from '../../utility/regex';

export default function addNewItemsToPrettierIgnore(): Rule {
  return (tree) => {
    const ignorePaths = [
      '/src/assets/',
      '/projects/*/src/assets/',
      '/src/app/lib/',
    ];
    const prettierIgnorePath = '/.prettierignore';
    const prettierIgnore = tree.read(prettierIgnorePath)?.toString();

    if (prettierIgnore) {
      let replacementString = prettierIgnore;

      for (const ignorePath of ignorePaths) {
        if (
          prettierIgnore &&
          !new RegExp(`^` + regexEscape(ignorePath) + `$`, 'm').exec(
            replacementString
          )
        ) {
          replacementString = `${ignorePath}\n` + replacementString;
        }
      }

      if (replacementString !== prettierIgnore) {
        tree.overwrite(prettierIgnorePath, replacementString);
      }
    }
  };
}
