describe('icon containers', () => {
  (['modern-v2-light', 'modern-v2-dark'] as const).forEach((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should render the component', () => {
        cy.viewport(1024, 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=icon-containerscomponent--icon-containers`,
        );
        cy.skyReady('app-icon-containers')
          .end()
          .get('app-icon-containers')
          .should('be.visible')
          .screenshot(`icon-containers-${theme}`);
        cy.percySnapshot(`icon-containers-${theme}`, { widths: [1024] });
      });
    });
  });
});
