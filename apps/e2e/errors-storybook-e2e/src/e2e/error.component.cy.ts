import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('errors-storybook - error', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        'broken',
        'construction',
        'not-found',
        'security',
        'text-only',
        'custom-action',
        'custom-image',
        'custom-title-and-description-appended',
        'custom-title-and-description-replaced',
        'element',
      ].forEach((style) => {
        it(`should render the component (${style})`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=errorcomponent-error--error-${style}`,
          );
          cy.skyReady('app-error').screenshot(
            `errorcomponent-error--error--${style}-${theme}`,
          );
          cy.get('app-error').percySnapshot(
            `errorcomponent-error--error--${style}-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    });
  });
});
