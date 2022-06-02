describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid-complex-cells--complex-cells&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-edit-complex-cells-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('edit-complex-cells', {
        // language=CSS
        percyCSS: `
          ag-grid-angular {
            height: 800px !important;
          }
        `,
      });
  });
});
