['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=datamanagervisualcomponent-datamanagervisual--data-manager`
      )
    );
    it('should render the component', () => {
      cy.get('app-data-manager-visual')
        .should('exist')
        .should('be.visible')
        .then(() => {
          cy.get('sky-radio[aria-label="Grid View"]')
            .should('be.visible')
            .click();
          return cy.get('sky-data-view').should('be.visible');
        })
        .then(() => {
          cy.get('app-data-manager-visual')
            .should('exist')
            .should('be.visible')
            .invoke('height')
            .should('be.greaterThan', 0)
            .screenshot(
              `datamanagervisualcomponent-datamanagervisual--data-manager-${theme}`
            )
            .percySnapshot(
              `datamanagervisualcomponent-datamanagervisual--data-manager-${theme}`
            );
        });
    });
  });
});
