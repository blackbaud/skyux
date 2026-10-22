import type { SnapshotOptions } from '@percy/core';
import '@percy/cypress';

import { pruneIconSprite } from './prune-icon-sprite';

// Percy types `domTransformation` as code to evaluate, but @percy/dom calls it
// directly when it is a function, which keeps the transformation bundled.
const domTransformation = pruneIconSprite as unknown as string;

/**
 * Sends Percy a copy of the DOM without the icon sprite symbols that the page
 * doesn't use. The full sprite would otherwise make up nearly all of each DOM
 * snapshot. Options passed to `percySnapshot()` take precedence.
 */
Cypress.Commands.overwrite(
  'percySnapshot',
  (
    percySnapshot,
    nameOrOptions?: string | SnapshotOptions,
    options?: SnapshotOptions,
  ) => {
    // Percy also accepts the options as the only argument.
    if (typeof nameOrOptions === 'object') {
      return percySnapshot(undefined, { domTransformation, ...nameOrOptions });
    }

    return percySnapshot(nameOrOptions, { domTransformation, ...options });
  },
);
