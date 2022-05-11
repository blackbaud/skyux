import { Rule } from '@angular-devkit/schematics';

export default function addNewItemsToPrettierIgnore(): Rule {
  return (tree) => {
    const pathsToIgnore = [
      '/src/assets',
      '/projects/*/src/assets',
      '/src/app/lib',
    ];
    const prettierIgnorePath = '/.prettierignore';
    const prettierIgnore = tree.read(prettierIgnorePath);

    let replacementString = prettierIgnore.toString();

    for (const path of pathsToIgnore) {
      if (
        prettierIgnore &&
        !new RegExp(`^` + path.replace('*', '\\*') + `$`, 'm').exec(
          replacementString.toString()
        )
      ) {
        replacementString = `${path}\n` + replacementString;
      }
    }

    if (replacementString !== prettierIgnore.toString()) {
      tree.overwrite(prettierIgnorePath, replacementString);
    }
  };
}
