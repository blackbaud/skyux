import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('datetime-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=datepickercomponent-datepicker--datepicker`
        )
      );
      it('should render the component', () => {
        cy.get('app-datepicker')
          .should('exist')
          .should('be.visible')
          .screenshot(`datepickercomponent-datepicker--datepicker-${theme}`)
          .percySnapshot(
            `datepickercomponent-datepicker--datepicker-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
