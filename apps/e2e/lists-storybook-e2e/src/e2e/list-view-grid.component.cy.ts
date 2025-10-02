import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=listviewgridcomponent-listviewgrid--list-view-grid`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-list-view-grid')
          .end()
          .get('body')
          .screenshot(
            `listviewgridcomponent-listviewgrid--listviewgrid-${theme}`,
          );
        cy.get('body').percySnapshot(
          `listviewgridcomponent-listviewgrid--listviewgrid-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should open the column picker', () => {
        cy.skyReady('app-list-view-grid');
        cy.get('sky-list-column-selector-button button').click();

        cy.get('.sky-modal')
          .should('exist')
          .get('app-list-view-grid')
          .screenshot(
            `listviewgridcomponent-listviewgrid--columnpicker-${theme}`,
          );
        cy.get('app-list-view-grid').percySnapshot(
          `listviewgridcomponent-listviewgrid--columnpicker-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
