describe('icons', () => {
  const theme = 'modern-v2-light';

  ['s', 'm', 'l', 'xl', 'xxl'].forEach((size) => {
    it(`should render ${size} icons`, () => {
      cy.viewport(1024, 4000);
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=iconscomponent--icons-${size}`,
      );
      cy.get('#ready').should('exist');
      cy.get('app-icons')
        .should('exist')
        .should('be.visible')
        .screenshot(`icons-${size}`);
      cy.percySnapshot(`icons-${size}`, { widths: [1024] });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
