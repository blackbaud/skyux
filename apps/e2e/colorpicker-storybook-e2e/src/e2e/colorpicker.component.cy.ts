import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('colorpicker-storybook', () => {
  const colorpickerVariations = [
    {
      id: 'colorpicker-12-presets-fa-icon',
      description: 'colorpicker with 12 presets and a FA icon',
    },
    {
      id: 'colorpicker-6-presets-sky-icon',
      description: 'colorpicker with 6 presets and a SKY UX icon',
    },
    {
      id: 'colorpicker-default-presets-no-clear-btn',
      description:
        'colorpicker with default presets, no icon, and no clear button',
    },
  ];

  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(960, 1100)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=colorpickercomponent-colorpicker--colorpicker`,
          ),
      );
      it('should render the components', () => {
        cy.skyReady('app-colorpicker', ['#ready']);
        cy.get('#colorpicker-error .sky-colorpicker-button')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('.sky-btn-colorpicker-apply')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('app-colorpicker')
          .should('exist')
          .should('be.visible')
          .screenshot(`colorpickercomponent-colorpicker--colorpicker-${theme}`);
        cy.get('app-colorpicker').percySnapshot(
          `colorpickercomponent-colorpicker--colorpicker-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      colorpickerVariations.forEach((colorpicker) => {
        it(`should open the ${colorpicker.description}`, () => {
          cy.skyReady('app-colorpicker', ['#ready']);
          cy.get('app-colorpicker').should('exist').should('be.visible');

          cy.get(`#${colorpicker.id} .sky-colorpicker-button`)
            .should('exist')
            .should('be.visible')
            .click();

          cy.get('.sky-colorpicker-container')
            .should('exist')
            .should('be.visible')
            .then(($el) => {
              cy.wrap($el.position().top)
                .should('be.gte', 0)
                .should('be.lessThan', 1000);
              cy.wrap($el.position().left).should('be.gte', 15);
            });

          cy.window().screenshot(
            `colorpickercomponent-colorpicker--${colorpicker.id}-menu-${theme}`,
            {
              disableTimersAndAnimations: true,
            },
          );
          cy.window().percySnapshot(
            `colorpickercomponent-colorpicker--${colorpicker.id}-menu-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    });
  });
});
