import { Rule } from '@angular-devkit/schematics';

export default function addAssetsToPrettierIgnore(): Rule {
  return (tree) => {
    const spaAssetsPath = 'src/assets';
    const libraryAssetsPath = 'projects/*/src/assets';
    const prettierIgnorePath = '/.prettierignore';
    const prettierIgnore = tree.read(prettierIgnorePath);
    const spaAssetsRegEx = new RegExp('^[\\\\/]?src[\\\\/]assets$', 'm');
    const libraryAssetsRegEx = new RegExp(
      '^[\\\\/]?projects[\\\\/]\\*[\\\\/]src[\\\\/]assets$',
      'm'
    );

    let replacementString = prettierIgnore.toString();

    if (prettierIgnore && !libraryAssetsRegEx.exec(prettierIgnore.toString())) {
      replacementString = `${libraryAssetsPath}\n` + replacementString;
    }

    if (prettierIgnore && !spaAssetsRegEx.exec(prettierIgnore.toString())) {
      replacementString = `${spaAssetsPath}\n` + replacementString;
    }

    if (replacementString !== prettierIgnore.toString()) {
      tree.overwrite(prettierIgnorePath, replacementString);
    }
  };
}
