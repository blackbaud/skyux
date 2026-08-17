const config = require('../../../eslint-libs.config');

module.exports = [
  ...config,
  {
    // The AG Grid locale files are copied verbatim from AG Grid Community (see
    // src/lib/modules/shared/README.md). Spellchecking vendored translations
    // buries real warnings under thousands of unknown-word hits, and the words
    // can't be corrected here without diverging from upstream.
    files: ['**/modules/shared/ag-grid-locale-*.ts'],
    rules: {
      '@cspell/spellchecker': 'off',
    },
  },
];
