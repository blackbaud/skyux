import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ag-grid-native-multiselect', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      const compactOptions = theme.startsWith('modern')
        ? [false, true]
        : [false];
      compactOptions.forEach((compact) => {
        it(`should render native multiselect checkbox states in ${theme}${compact ? '-compact' : ''} theme`, () => {
          cy.viewport(1024, 2000).visit(
            // eslint-disable-next-line @cspell/spellchecker
            `/iframe.html?globals=theme:${theme}&id=ag-grid-native-multiselectcomponent--ag-grid-native-multiselect${compact ? '-compact' : ''}`,
          );

          cy.skyReady('app-ag-grid-multiselect', ['#ready']);

          cy.get('#storybook-root').skyVisualTest(
            // eslint-disable-next-line @cspell/spellchecker
            `aggridnativemultiselectcomponent-aggridnativemultiselect--${theme}${compact ? '-compact' : ''}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
              capture: 'fullPage',
            },
          );
        });
      });
    });
  });
});
