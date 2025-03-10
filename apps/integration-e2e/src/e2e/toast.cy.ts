describe('ToastComponent', () => {
  it('should have a valid title on the close button', () => {
    cy.visit('/#/integrations/toast');
    cy.skyReady('app-toast');
    cy.get('app-toast button.sky-btn.sky-btn-primary')
      .should('be.visible')
      .should('contain.text', 'Open Toasts')
      .click();
    cy.get('sky-toaster').should('exist');
    cy.get('sky-toaster sky-toast').should('exist');
    cy.get('sky-toaster sky-toast:first-child button.sky-toast-btn-close')
      .should('be.visible')
      .should('have.attr', 'title')
      .should('not.equal', 'skyux_toast_close_button_title');
  });
});
