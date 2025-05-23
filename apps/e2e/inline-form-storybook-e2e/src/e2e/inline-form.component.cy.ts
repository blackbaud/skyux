import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('inline-form-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      it(`should render the closed inline form component`, () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inlineformcomponent-inlineform--inline-form-custom-buttons`,
        );

        cy.skyReady('app-inline-form').screenshot(
          `inlineformcomponent-inlineform--inline-form-closed-${theme}`,
        );
        cy.get('app-inline-form').percySnapshot(
          `inlineformcomponent-inlineform--inline-form-closed-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
      [
        'custom',
        'done-cancel',
        'done-delete-cancel',
        'save-cancel',
        'save-delete-cancel',
      ].forEach((buttonCombo) => {
        describe(`with ${buttonCombo} buttons`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=inlineformcomponent-inlineform--inline-form-${buttonCombo}-buttons`,
            ),
          );
          it(`should render the open inline form component`, () => {
            cy.skyReady('app-inline-form');

            cy.get('button')
              .last()
              .should('exist')
              .should('be.visible')
              .click();

            cy.get('app-inline-form').screenshot(
              `inlineformcomponent-inlineform--inline-form-${buttonCombo}-buttons-${theme}`,
            );
            cy.get('app-inline-form').percySnapshot(
              `inlineformcomponent-inlineform--inline-form-${buttonCombo}-buttons-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });
    });
  });
});
