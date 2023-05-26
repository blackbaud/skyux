import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('inline-form-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inlineformcomponent-inlineform--inline-form`
        )
      );
      it('should render the component', () => {
        cy.get('app-inline-form')
          .should('exist')
          .should('be.visible')
          .screenshot(`inlineformcomponent-inlineform--inline-form-${theme}`)
          .percySnapshot(
            `inlineformcomponent-inlineform--inline-form-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
