describe('containers', () => {
  (['modern-v2-light', 'modern-v2-dark'] as const).forEach((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should render the component', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=containerscomponent--containers`,
        );
        cy.skyReady('app-containers').end();
        cy.get('app-containers').skyVisualTest(`containers-${theme}`, {
          overwrite: true,
        });
      });
    });
  });
});
