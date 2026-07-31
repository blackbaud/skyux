import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  ProjectDefinition,
  updateWorkspace,
} from '@schematics/angular/utility';

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
 * options and build configurations. When Dragula is still installed (directly
 * or transitively) — or when its usage cannot be determined — the entry is
 * replaced with a local copy of the polyfill so those consumers keep working
 * without depending on \`@skyux/packages/polyfills\`.
 */
export default function migrateDragulaPolyfill(): Rule {
  return (tree, context) => {
    const dragulaNeeded = isDragulaNeeded(tree, context);

    return updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        migrateProjectPolyfills(tree, project, dragulaNeeded);
      }
    });
  };
}

/**
 * Migrates the \`@skyux/packages/polyfills\` entry out of a single project's build
 * options and every build configuration.
 */
function migrateProjectPolyfills(
  tree: Tree,
  project: ProjectDefinition,
  dragulaNeeded: boolean,
): void {
  const build = project.targets.get('build');
  const localPolyfillPath = `${getSourceRoot(project)}/${LOCAL_POLYFILL_FILENAME}`;

  // Polyfills can be set on the build options and overridden per configuration.
  const optionSets = [
    build?.options,
    ...Object.values(build?.configurations ?? {}),
  ];

  for (const options of optionSets) {
    const polyfills = options?.['polyfills'];

    if (!Array.isArray(polyfills)) {
      continue;
    }

    const index = polyfills.indexOf(PACKAGES_POLYFILL);

    if (index === -1) {
      continue;
    }

    if (dragulaNeeded) {
      if (!tree.exists(localPolyfillPath)) {
        tree.create(localPolyfillPath, LOCAL_POLYFILL_CONTENT);
      }

      polyfills.splice(index, 1, localPolyfillPath);
    } else {
      polyfills.splice(index, 1);
    }
  }
}

/**
 * Determines whether the local polyfill shim should be retained. Returns \`true\`
 * when Dragula is installed, and — conservatively — also when its usage cannot
 * be determined (missing, malformed, or unsupported \`package-lock.json\`), so a
 * broken \`@skyux/packages/polyfills\` reference is never left behind.
 */
function isDragulaNeeded(tree: Tree, context: SchematicContext): boolean {
  const buffer = tree.read('package-lock.json');

  if (!buffer) {
    context.logger.warn(
      'A "package-lock.json" file was not found; retaining a local copy of ' +
        `"${PACKAGES_POLYFILL}" because Dragula usage could not be determined.`,
    );

    return true;
  }

  let lockFile: { packages?: Record<string, unknown> };

  try {
    lockFile = JSON.parse(buffer.toString()) as {
      packages?: Record<string, unknown>;
    };
  } catch {
    context.logger.warn(
      'The "package-lock.json" file could not be parsed; retaining a local ' +
        `copy of "${PACKAGES_POLYFILL}" because Dragula usage could not be ` +
        'determined.',
    );

    return true;
  }

  if (!lockFile.packages) {
    context.logger.warn(
      'The "package-lock.json" file uses an unsupported lockfile version; ' +
        `retaining a local copy of "${PACKAGES_POLYFILL}" because Dragula ` +
        'usage could not be determined.',
    );

    return true;
  }

  return isDragulaInstalled(lockFile.packages);
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
