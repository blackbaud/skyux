describe('icon containers', () => {
  (['modern-v2-light', 'modern-v2-dark'] as const).forEach((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should render the component', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=icon-containerscomponent--icon-containers`,
        );
        cy.skyReady('app-icon-containers').end();
        cy.get('app-icon-containers').skyVisualTest(
          `icon-containers-${theme}`,
          { overwrite: true },
        );
      });
    });
  });
});
