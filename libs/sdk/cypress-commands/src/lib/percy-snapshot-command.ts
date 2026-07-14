// Type-only: brings in `@percy/cypress`'s global `Chainable.percySnapshot`
// augmentation for type-checking, without importing the module itself (that
// import has side effects — it registers a `window:before:load` hook — which
// we don't want to force onto apps that don't already opt into Percy).
import type {} from '@percy/cypress';

// Percy's readiness gate (`waitForReady()` in `@percy/cypress`) confirms the
// DOM/fonts/images have loaded, but it doesn't guarantee that a just-applied
// class change (e.g. a theme toggle) has been style-recalculated and painted
// yet. Waiting for two consecutive animation frames guarantees at least one
// full paint cycle has completed, so any pending class-driven style changes
// are reflected before Percy captures the DOM. Overwriting the command here
// (rather than adding waits to individual specs) makes every `percySnapshot`
// call across all `*-storybook-e2e` apps settle automatically.
//
// A couple of e2e apps (e.g. `ag-grid-storybook-e2e`, `datetime-storybook-e2e`)
// import this package without importing `@percy/cypress`, so `percySnapshot`
// is never registered there. `Cypress.Commands.overwrite()` throws
// synchronously if the target command doesn't exist, so guard it to keep
// this a no-op for those apps.
try {
  Cypress.Commands.overwrite('percySnapshot', (originalFn, name, options) => {
    return cy
      .window({ log: false })
      .then((win) => {
        return new Cypress.Promise<void>((resolve) => {
          win.requestAnimationFrame(() => {
            win.requestAnimationFrame(() => resolve());
          });
        });
      })
      .then(() => originalFn(name, options));
  });
} catch {
  // `percySnapshot` isn't registered in this app (no `@percy/cypress` import) — nothing to wrap.
}
