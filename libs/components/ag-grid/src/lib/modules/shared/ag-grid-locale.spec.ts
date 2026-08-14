import { AG_GRID_LOCALE_ES } from './ag-grid-locale-es-ES';
import { AG_GRID_LOCALE_FR } from './ag-grid-locale-fr-FR';

describe('AG Grid locale text', () => {
  const translations: [string, Record<string, string>][] = [
    ['es-ES', AG_GRID_LOCALE_ES],
    ['fr-FR', AG_GRID_LOCALE_FR],
  ];

  // Every translation is copied from the same upstream AG Grid release, so
  // they share a key set. A key present in one but missing from another means
  // a translation was dropped, and that string would silently render in AG
  // Grid's built-in English instead.
  it('should define the same keys in every translation', () => {
    const [[firstLocale, firstTranslation], ...rest] = translations;
    const firstKeys = Object.keys(firstTranslation).sort();

    for (const [locale, translation] of rest) {
      expect(Object.keys(translation).sort())
        .withContext(`${locale} compared to ${firstLocale}`)
        .toEqual(firstKeys);
    }
  });

  for (const [locale, translation] of translations) {
    it(`should not leave any ${locale} value blank`, () => {
      const blank = Object.entries(translation)
        .filter(([, value]) => value.trim() === '')
        .map(([key]) => key);

      expect(blank).toEqual([]);
    });
  }
});
