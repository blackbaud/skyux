# 4.2.1 (2020-10-07)

- Removed the unnecessary `@types/axe-core` package from dependencies. [#44](https://github.com/blackbaud/skyux-sdk-testing/pull/44)

# 4.2.0 (2020-10-1)

- Added support for `expectAsync` for the following Jasmine matchers: `toBeAccessible`, `toEqualResourceString`, and `toContainResourceString`. The older, synchronous versions have been deprecated. [#37](https://github.com/blackbaud/skyux-sdk-testing/pull/37) To convert existing synchronous matchers to the new synchronous versions do the following:
```
// Instead of...
import { expect } from '@skyux-sdk/testing';
expect(element).toBeAccessible(done, args);

// Do...
import { expectAsync } from '@skyux-sdk/testing';
await expectAsync(element).toBeAccessible(args);
```

# 4.1.0 (2020-08-12)

- Updated the accessibility rules to ignore invalid autocomplete values to support disabling autocomplete on Google Chrome. [#40](https://github.com/blackbaud/skyux-sdk-testing/pull/40)

# 4.0.0 (2020-05-26)

### New features

- Added public methods `getText`, `isVisible`, `setInputValue`, `getBackgroundImageUrl`, and `getDebugElementByTestId` to `SkyAppTestUtility`. [#24](https://github.com/blackbaud/skyux-sdk-testing/pull/24)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)

### Breaking changes

- Added support for `axe-core@3.5.3` which includes a few breaking changes (see the [`axe-core` changelog](https://github.com/dequelabs/axe-core/releases/tag/v3.0.0) for details). [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)

# 4.0.0-rc.3 (2020-05-07)

- Added bug fixes and features from the `master` branch. [#27](https://github.com/blackbaud/skyux-sdk-testing/pull/27)

# 3.3.0 (2020-04-30)

- Added the `SkyMatchers` interface to enable IDE code completion for the `expect()` function. [#25](https://github.com/blackbaud/skyux-sdk-testing/pull/25) (Thanks [@Blackbaud-KrisMahon](https://github.com/Blackbaud-KrisMahon)!)

# 4.0.0-rc.2 (2020-04-29)

### New features

- Added public methods `getText`, `isVisible`, `setInputValue`, `getBackgroundImageUrl`, and `getDebugElementByTestId` to `SkyAppTestUtility`. [#24](https://github.com/blackbaud/skyux-sdk-testing/pull/24)

# 4.0.0-rc.1 (2020-04-08)

### Bug fixes

- Added the missing package `@types/axe-core` to dependencies. [#22](https://github.com/blackbaud/skyux-sdk-testing/pull/22)

# 4.0.0-rc.0 (2020-04-06)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)

### Breaking changes

- Added support for `axe-core@3.5.3` which includes a few breaking changes (see the [`axe-core` changelog](https://github.com/dequelabs/axe-core/releases/tag/v3.0.0) for details). [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#21](https://github.com/blackbaud/skyux-sdk-testing/pull/21)

# 3.2.0 (2020-03-05)

- Added the `toHaveResourceText` and `toEqualResourceText` matchers to to compare text strings to resources strings. [#18](https://github.com/blackbaud/skyux-sdk-testing/pull/18) (Thanks [@Blackbaud-JasonBodnar](https://github.com/Blackbaud-JasonBodnar)!)

# 3.1.0 (2018-12-11)

- Added support for [`CustomEvent` properties](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) when executing the `SkyAppTestUtility.fireDomEvent` method. [#8](https://github.com/blackbaud/skyux-sdk-testing/pull/8)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.3 (2018-09-19)

- Modified the directory structure.

# 3.0.0-alpha.2 (2018-09-11)

- Updated dependencies.

# 3.0.0-alpha.1 (2018-08-18)

- Bugfix to remove the Builder config from dependency.

# 3.0.0-alpha.0 (2018-08-16)

- Initial release.
