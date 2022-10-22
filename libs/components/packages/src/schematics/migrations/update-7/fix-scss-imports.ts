import { Rule, chain } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import { getWorkspace } from '../../utility/workspace';

/**
 * Replaces any @blackbaud/skyux-design-tokens imports with their @skyux/theme equivalents.
 */
function replaceDesignTokensImports(contents: string): string {
  const matches = contents.matchAll(
    /@import\s+['"]?node_modules\/@blackbaud\/skyux-design-tokens\/scss\/_?(mixins|variables)(?:\.scss)?['"]?;?\s+/g
  );

  for (const match of matches) {
    const importPath = match[0];
    const importType = match[1]; // mixins or variables

    const replacementTemplate = new RegExp(
      `@import\\s+['"]?node_modules\\/@skyux\\/theme\\/scss\\/_?${importType}(?:\\.scss)?['"]?;?`
    );

    // If the equivalent default import is already found, just remove the design tokens import.
    if (replacementTemplate.test(contents)) {
      contents = contents.replace(importPath, '');
      continue;
    }

    contents = contents.replace(
      importPath,
      `@import 'node_modules/@skyux/theme/scss/${importType}';\n`
    );
  }

  return contents;
}

/**
 * If a mixins import exists, add the variables import as well.
 * In prior versions of SKY UX, the variables were exported from the mixins file, but
 * this creates a circular reference.
 */
function addVariablesScssImports(contents: string): string {
  const matches = contents.matchAll(
    /@import\s+['"]?node_modules\/@skyux\/theme\/scss\/(_compat\/|themes\/modern\/_compat\/)?_?mixins(?:\.scss)?['"]?;?/g
  );

  for (const match of matches) {
    const mixinsImport = match[0];
    const variablesImport = mixinsImport.replace('mixins', 'variables');
    if (!contents.includes(variablesImport)) {
      contents = contents.replace(
        mixinsImport,
        `${mixinsImport}\n${variablesImport}`
      );
    }
  }

  return contents;
}

/**
 * Fixes SKY UX SCSS imports.
 */
function fixScssImports(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    for (const [, projectDefinition] of workspace.projects.entries()) {
      tree.getDir(projectDefinition.root).visit((filePath) => {
        if (filePath.endsWith('.scss')) {
          const contents = readRequiredFile(tree, filePath);

          let updatedContents = contents;
          updatedContents = replaceDesignTokensImports(updatedContents);
          updatedContents = addVariablesScssImports(updatedContents);

          if (updatedContents !== contents) {
            tree.overwrite(filePath, updatedContents);
          }
        }
      });
    }
  };
}

/**
 * Removes the local version of '@blackbaud/skyux-design-tokens' from package.json;
 */
function removeDesignTokensPackage(): Rule {
  return (tree) => {
    const packageJson = JSON.parse(readRequiredFile(tree, 'package.json'));

    if (packageJson.dependencies) {
      delete packageJson.dependencies['@blackbaud/skyux-design-tokens'];
    }

    if (packageJson.devDependencies) {
      delete packageJson.devDependencies['@blackbaud/skyux-design-tokens'];
    }

    tree.overwrite('package.json', JSON.stringify(packageJson));
  };
}

export default function (): Rule {
  return chain([fixScssImports(), removeDesignTokensPackage()]);
}
