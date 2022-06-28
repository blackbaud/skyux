describe('indicators-storybook', () => {
  beforeEach(() => cy.visit('/iframe.html?id=alertcomponent-alert--alert'));
  it('should render the component', () => {
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
