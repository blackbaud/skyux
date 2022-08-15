['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`modals-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=confirmcomponent--primary`
      )
    );
    it('should render the OK component', () => {
      cy.get('app-confirm')
        .should('exist')
        .should('be.visible')
        .get('.open-ok-confirm-btn')
        .should('exist')
        .should('be.visible')
        .click()
        .get('.sky-modal')
        .should('exist')
        .should('be.visible')
        .screenshot(`confirmcomponent--primary-ok-${theme}`)
        .percySnapshot(`confirmcomponent--primary-ok-${theme}`);
    });

    it('should render the Custom component', () => {
      cy.get('app-confirm')
        .should('exist')
        .should('be.visible')
        .get('.open-custom-confirm-btn')
        .should('exist')
        .should('be.visible')
        .click()
        .get('.sky-modal')
        .should('exist')
        .should('be.visible')
        .screenshot(`confirmcomponent--primary-custom-${theme}`)
        .percySnapshot(`confirmcomponent--primary-custom-${theme}`);
    });
  });
});
