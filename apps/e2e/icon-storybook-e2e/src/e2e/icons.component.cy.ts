describe('icons', () => {
  const theme = 'modern-v2-light';

  ['line', 'solid'].forEach((variant) => {
    describe(variant, () => {
      ['s', 'm', 'l', 'xl', 'xxl'].forEach((size) => {
        it(`should render ${variant} ${size} icons`, () => {
          cy.viewport(1024, 4000);
          cy.visit(
            `/iframe.html?args=size:${size};variant:${variant}&globals=theme:${theme}&id=iconscomponent--icons`,
          );
          cy.get('#ready').should('exist');
          cy.get('app-icons')
            .should('exist')
            .should('be.visible')
            .screenshot(`icons-${variant}-${size}`);
          cy.percySnapshot(`icons-${variant}-${size}`, { widths: [1024] });
        });
      });
    });
  });
});
