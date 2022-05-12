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

# Ignore assets
/src/assets/
/projects/*/src/assets/

# Ignore standard SPA library path
/src/app/lib/

# Ignore Angular cache
/.angular/cache

# Don't format the following since the order of its import statements is deliberate.
test.ts`
    );
  };
}
