import { JG_THEME } from './themes';

Cypress.Commands.overwrite('skyChooseTheme', (chooseTheme, theme) => {
  if (theme !== JG_THEME) {
    chooseTheme(theme);
    return;
  }

  chooseTheme('modern-v2-light');
  cy.get('select.sky-theme-selector').eq(3).select('JustGiving');
  cy.get<HTMLLinkElement>('link[href*="skyux-brand-jg"]').should(($link) => {
    expect($link[0].sheet).not.to.equal(null);
  });
  cy.window().then((win) => {
    const family = win.getComputedStyle(win.document.body).fontFamily;
    return Promise.all([
      win.document.fonts.load(`1em ${family}`),
      win.document.fonts.load(`italic 1em ${family}`),
    ]);
  });
  cy.get('body').should('have.class', 'sky-theme-brand-jg');
});
