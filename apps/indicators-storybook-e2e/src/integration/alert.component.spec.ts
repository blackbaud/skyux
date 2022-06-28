['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`indicators-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=alertcomponent-alert--alert`
      )
    );
    it(`should render the component in ${theme}`, () => {
      cy.get('app-alert')
        .should('exist')
        .should('be.visible')
        .screenshot()
        .percySnapshot();
      for (const x of ['info', 'success', 'warning', 'danger']) {
        cy.get(
          `[ng-reflect-alert-type="${x}"][ng-reflect-closeable="true"] > .sky-alert > .sky-alert-close`
        )
          .should('be.visible')
          .click();
        cy.get(
          `[ng-reflect-alert-type="${x}"][ng-reflect-closeable="true"] > .sky-alert`
        ).should('not.be.visible');
      }
    });
  });
});
