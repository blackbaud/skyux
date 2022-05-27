describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid--edit-stop-when-loses-focus&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-edit-stop-when-loses-focus-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('edit-stop-when-loses-focus');
  });
});
