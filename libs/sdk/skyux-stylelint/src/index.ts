import noDeprecatedSkyScssVariables from './rules/no-deprecated-sky-scss-variables.js';
import noInvalidSkyCustomProperties from './rules/no-invalid-sky-custom-properties.js';
import noNgDeep from './rules/no-ng-deep.js';
import noSkySelectors from './rules/no-sky-selectors.js';
import noSkyThemeImports from './rules/no-sky-theme-imports.js';
import noStaticColorValues from './rules/no-static-color-values.js';

export default [
  noDeprecatedSkyScssVariables,
  noInvalidSkyCustomProperties,
  noNgDeep,
  noSkySelectors,
  noSkyThemeImports,
  noStaticColorValues,
];
