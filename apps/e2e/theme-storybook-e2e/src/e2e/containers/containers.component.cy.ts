import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('containers', () => {
  (['modern-v2-light', 'modern-v2-dark'] as const).forEach((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should render the component', () => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=containerscomponent--containers`,
        );
        cy.skyReady('app-containers')
          .end()
          .get('app-containers')
          .screenshot(`containerscomponent-containers--containers-${theme}`);
        cy.percySnapshot(
          `containerscomponent-containers--containers-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
