describe('flyout-storybook', () => {
  beforeEach(() => cy.visit('/iframe.html?id=components-flyout--flyout&args='));
  it('should render the component', () => {
    cy.get('app-flyout-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('flyout');
  });
});
