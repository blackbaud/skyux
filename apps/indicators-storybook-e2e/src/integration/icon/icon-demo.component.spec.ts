describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-icon--icon')
  );
  it('should render the component', () => {
    cy.get('app-icon-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
