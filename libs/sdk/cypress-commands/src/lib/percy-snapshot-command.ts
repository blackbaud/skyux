import '@percy/cypress';
import { pruneIconSprite } from '@skyux-sdk/e2e-schematics';

// Percy types `domTransformation` as code to evaluate, but @percy/dom calls it
// directly when it is a function, which keeps the transformation bundled.
const domTransformation = pruneIconSprite as unknown as string;

/**
 * Sends Percy a copy of the DOM without the icon sprite symbols that the page
 * doesn't use. The full sprite would otherwise make up nearly all of each DOM
 * snapshot. Options passed to `percySnapshot()` take precedence.
 */
Cypress.Commands.overwrite('percySnapshot', (percySnapshot, name, options) =>
  percySnapshot(name, { domTransformation, ...options }),
);
