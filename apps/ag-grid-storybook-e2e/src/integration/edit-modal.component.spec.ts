describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid--edit-in-modal&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-ag-grid-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('edit-modal');
  });
});
