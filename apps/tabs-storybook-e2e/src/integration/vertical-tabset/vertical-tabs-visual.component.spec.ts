describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-tabs-vertical-tabset--vertical-tabset&args='
    )
  );
  it('should render the component', () => {
    cy.get('app-vertical-tabs-visual').should('exist');
  });
});
