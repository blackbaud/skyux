describe('popovers-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-popovers-dropdown--dropdown&args=')
  );
  it('should render the component', () => {
    cy.get('app-dropdown-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('dropdown');
  });
});
