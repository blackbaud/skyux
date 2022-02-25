import { Rule } from '@angular-devkit/schematics';

import { writeTextFile } from '../../utility/tree';

export function writePrettierIgnore(): Rule {
  return (tree, context) => {
    const filePath = '.prettierignore';

    context.logger.info(
      `Creating ${filePath} file with commonly-ignored paths...`
    );

    writeTextFile(
      tree,
      filePath,
      `# Ignore artifacts:
__skyux
coverage
dist
node_modules
package-lock.json

# Don't format the following since the order of its import statements is deliberate.
test.ts`
    );
  };
}
