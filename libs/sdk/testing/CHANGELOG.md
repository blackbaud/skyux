# 5.0.1 (2021-11-19)

- Updated the builder to support StackBlitz. [#59](https://github.com/blackbaud/skyux-sdk-testing/pull/59)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#48](https://github.com/blackbaud/skyux-sdk-testing/pull/48)

# 5.0.0-beta.2 (2021-09-13)

- Migrated to Angular CLI. [#54](https://github.com/blackbaud/skyux-sdk-testing/pull/54)

# 5.0.0-beta.1 (2021-07-28)

- Removed the peer dependency `@skyux/config` since it was not being used, and replaced it with `@skyux/i18n`. [#53](https://github.com/blackbaud/skyux-sdk-testing/pull/53)

# 4.3.0 (2021-07-06)

- Added options to the `toBeVisible` matcher to check an element's existence, CSS `visibility` property, and bounding-box dimensions. [#50](https://github.com/blackbaud/skyux-sdk-testing/pull/50) (Thanks [@Sean-Blackbaud](https://github.com/Sean-Blackbaud)!)

# 5.0.0-beta.0 (2021-06-23)

- Initial beta release.
- Added support for `@angular/core@^12`. [#48](https://github.com/blackbaud/skyux-sdk-testing/pull/48)

# 4.2.3 (2020-12-10)

- Fixed the `toHaveResourceText` matcher to properly handle the `args` array before checking the value. [#47](https://github.com/blackbaud/skyux-sdk-testing/pull/47) (Thanks [@Blackbaud-JasonBodnar](https://github.com/Blackbaud-JasonBodnar)!)

# 4.2.2 (2020-10-07)

- Fixed the exports API to include `SkyMatchers` and `SkyAsyncMatchers`. [#45](https://github.com/blackbaud/skyux-sdk-testing/pull/45)

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
