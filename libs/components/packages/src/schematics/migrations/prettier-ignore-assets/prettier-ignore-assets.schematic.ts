import { Rule } from '@angular-devkit/schematics';

export default function addAssetsToPrettierIgnore(): Rule {
  return (tree) => {
    const assetsPath = 'src/assets';
    const prettierIgnorePath = '/.prettierignore';
    const prettierIgnore = tree.read(prettierIgnorePath);
    const assetsRegEx = new RegExp('^[\\\\/]?src[\\\\/]assets$', 'm');

    console.log(prettierIgnore.toString());
    console.log(assetsRegEx.exec(prettierIgnore.toString()));
    if (prettierIgnore && !assetsRegEx.exec(prettierIgnore.toString())) {
      tree.overwrite(prettierIgnorePath, `${assetsPath}\n` + prettierIgnore);
    }
  };
}
