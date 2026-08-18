// Export the a11y analyzer to avoid a breaking change. Remove in a future major version.
// eslint-disable-next-line @nx/enforce-module-boundaries
export {
  _SkyA11yAnalyzer as SkyA11yAnalyzer,
  _SkyAppTestUtility as SkyAppTestUtility,
  type _SkyAppTestUtilityDomEventOptions as SkyAppTestUtilityDomEventOptions,
} from '@skyux-sdk/testing/private';
export type { SkyA11yAnalyzerConfig } from './lib/matchers/a11y-analyzer-config';
export {
  SkyAsyncMatchers,
  SkyMatchers,
  expect,
  expectAsync,
} from './lib/matchers/matchers';
export { SkyToBeVisibleOptions } from './lib/matchers/to-be-visible-options';
export { SkyBy } from './lib/query-predicates/sky-by';
