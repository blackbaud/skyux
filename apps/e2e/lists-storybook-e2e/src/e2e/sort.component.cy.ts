import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook - sort', () => {
  const sortVariations = [
    {
      id: 'sort-no-btn-text',
      hasText: false,
    },
    {
      id: 'sort-with-btn-text',
      hasText: true,
    },
  ];
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=sortcomponent-sort--sort`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-sort').screenshot(`sortcomponent-sort--sort-${theme}`);
        cy.get('app-sort').percySnapshot(`sortcomponent-sort--sort-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });

      sortVariations.forEach((sort) => {
        const textDescriptor = sort.hasText ? 'with' : 'without';
        it(`should open the sort ${textDescriptor} button text`, () => {
          cy.skyReady('app-sort')
            .get(`#${sort.id} .sky-dropdown-button`)
            .should('exist')
            .should('be.visible')
            .click();
          cy.get('.sky-dropdown-menu')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `sortcomponent-sort--open-sort-${textDescriptor}-text-${theme}`,
            );
          cy.get('.sky-dropdown-menu').percySnapshot(
            `sortcomponent-sort--open-sort-${textDescriptor}-text-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    });
  });
});
