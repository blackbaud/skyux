describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=skydatamanagerfiltersmodalvisualcomponent--primary'
    )
  );
  it('should render the component', () => {
    cy.get('app-demo-filter-modal-form').should('exist');
  });
});
