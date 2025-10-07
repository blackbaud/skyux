const PAGE_COUNT = 4 as const;
const PAGES = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1);

describe('icons', () => {
  const theme = 'modern-v2-light';

  ['line', 'solid'].forEach((variant) => {
    describe(variant, () => {
      PAGES.forEach((page) => {
        it(`should render ${variant} icons, page ${page}`, () => {
          cy.viewport(1024, 4000);
          cy.visit(
            `/iframe.html?args=page:${page};pages:${PAGE_COUNT};variant:${variant}&globals=theme:${theme}&id=icons-by-rowcomponent--icons-by-row`,
          );
          cy.get('#ready').should('exist');
          cy.get('app-icons-by-row')
            .should('exist')
            .should('be.visible')
            .screenshot(`icons-${variant}-page-${page}`);
          cy.percySnapshot(`icons-${variant}-page-${page}`, { widths: [1024] });
        });
      });
    });
  });
});
