import { Rule } from '@angular-devkit/schematics';

export default function addAngularCacheToPrettierIgnore(): Rule {
  return (tree) => {
    const cachePath = '/.angular/cache';
    const prettierIgnorePath = '/.prettierignore';
    const prettierIgnore = tree.read(prettierIgnorePath);

    if (prettierIgnore && !prettierIgnore.includes(cachePath)) {
      tree.overwrite(prettierIgnorePath, `${cachePath}\n` + prettierIgnore);
    }
  };
}
