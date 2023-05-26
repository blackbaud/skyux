import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('phone-field-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=phonefieldcomponent-phonefield--phone-field`
        )
      );
      it('should render the component', () => {
        cy.get('app-phone-field')
          .should('exist')
          .should('be.visible')
          .screenshot(`phonefieldcomponent-phonefield--phone-field-${theme}`)
          .percySnapshot(
            `phonefieldcomponent-phonefield--phone-field-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
