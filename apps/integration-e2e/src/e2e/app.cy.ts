import { getGreeting } from '../support/app.po';

describe('integration', () => {
  beforeEach(() => cy.visit('/'));

  it('should display h2 Integrations', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Integrations');
  });
});
