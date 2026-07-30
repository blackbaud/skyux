import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { updateWorkspace } from '@schematics/angular/utility';

import { getSourceRoot } from '../../../utility/workspace';

const PACKAGES_POLYFILL = '@skyux/packages/polyfills';
const LOCAL_POLYFILL_FILENAME = 'dragula-polyfill.js';
const LOCAL_POLYFILL_CONTENT = `'use strict';

// Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
// which in turn is used by some third-party libraries.
// https://github.com/bevacqua/dragula/issues/602
window.global = window;
`;

/**
 * Removes the \`@skyux/packages/polyfills\` entry from every project's build
 * configuration. When Dragula is still installed (directly or transitively),
 * the entry is replaced with a local copy of the polyfill so those consumers
 * keep working without depending on \`@skyux/packages/polyfills\`.
 */
export default function migrateDragulaPolyfill(): Rule {
  return (tree, context) => {
    const packages = readLockFilePackages(tree, context);

    if (!packages) {
      return;
    }

    const dragulaInstalled = isDragulaInstalled(packages);

    return updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        const build = project.targets.get('build');
        const polyfills = build?.options?.['polyfills'];

        if (!Array.isArray(polyfills)) {
          continue;
        }

        const index = polyfills.indexOf(PACKAGES_POLYFILL);

        if (index === -1) {
          continue;
        }

        if (dragulaInstalled) {
          const localPolyfillPath = `${getSourceRoot(project)}/${LOCAL_POLYFILL_FILENAME}`;

          tree.create(localPolyfillPath, LOCAL_POLYFILL_CONTENT);
          polyfills.splice(index, 1, localPolyfillPath);
        } else {
          polyfills.splice(index, 1);
        }
      }
    });
  };
}

/**
 * Reads the \`packages\` map from \`package-lock.json\`. Returns \`undefined\` (and
 * logs a warning) when the lockfile is missing or predates lockfile version 2,
 * because Dragula usage cannot be reliably determined in those cases.
 */
function readLockFilePackages(
  tree: Tree,
  context: SchematicContext,
): Record<string, unknown> | undefined {
  const buffer = tree.read('package-lock.json');

  if (!buffer) {
    context.logger.warn(
      'A "package-lock.json" file was not found. Skipping migration of ' +
        `"${PACKAGES_POLYFILL}" because Dragula usage could not be determined.`,
    );

    return undefined;
  }

  const lockFile = JSON.parse(buffer.toString()) as {
    packages?: Record<string, unknown>;
  };

  if (!lockFile.packages) {
    context.logger.warn(
      'The "package-lock.json" file uses an unsupported lockfile version. ' +
        `Skipping migration of "${PACKAGES_POLYFILL}" because Dragula usage ` +
        'could not be determined.',
    );

    return undefined;
  }

  return lockFile.packages;
}

/**
 * Determines whether Dragula is installed anywhere in the dependency tree by
 * checking every package path recorded in the lockfile.
 */
function isDragulaInstalled(packages: Record<string, unknown>): boolean {
  return Object.keys(packages).some(
    (packagePath) =>
      packagePath === 'node_modules/dragula' ||
      packagePath.endsWith('/node_modules/dragula'),
  );
}
