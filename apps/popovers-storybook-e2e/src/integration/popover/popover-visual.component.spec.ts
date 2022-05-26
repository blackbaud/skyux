describe('popovers-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-popovers-popover--popover&args=')
  );
  it('should render the component', () => {
    cy.get('app-popover-visual')
      .should('exist')
      .screenshot()
      .percySnapshot('popover');
  });
});
