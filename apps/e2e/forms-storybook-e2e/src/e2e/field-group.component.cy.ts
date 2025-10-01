import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('field-group', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=field-groupcomponent--field-group`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-field-group').screenshot(`field-group-${theme}`);
        cy.percySnapshot(`field-group-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
