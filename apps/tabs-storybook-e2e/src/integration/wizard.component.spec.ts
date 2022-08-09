['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`tabs-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=wizardcomponent-wizard--wizard`
      )
    );
    it('should render the component', () => {
      cy.viewport(1280, 720)
        .get('app-wizard')
        .should('exist')
        .should('be.visible')
        .get('.open-wizard-btn')
        .should('exist')
        .should('be.visible')
        .click()
        .get('.sky-modal')
        .should('exist')
        .should('be.visible')
        .screenshot(`wizardcomponent-wizard--wizard-${theme}`)
        .percySnapshot(`wizardcomponent-wizard--wizard-${theme}`, {
          widths: [1280],
        })
        .viewport(375, 812)
        .get('sky-dropdown')
        .should('exist')
        .percySnapshot(`wizardcomponent-wizard--wizard-${theme}`, {
          widths: [375],
        });
    });
  });
});
