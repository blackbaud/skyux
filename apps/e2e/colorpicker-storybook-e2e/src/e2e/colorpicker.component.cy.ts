import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('colorpicker-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=colorpickercomponent-colorpicker--colorpicker`
        )
      );
      it('should render the component', () => {
        cy.get('app-colorpicker')
          .should('exist')
          .should('be.visible')
          .screenshot(`colorpickercomponent-colorpicker--colorpicker-${theme}`)
          .percySnapshot(
            `colorpickercomponent-colorpicker--colorpicker-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
