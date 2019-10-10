# 3.8.0 (2019-10-10)

- Updated the `getFocusableChildren()` method on `SkyCoreAdapterService` to make filtering optional for tab index and visibility. [#104](https://github.com/blackbaud/skyux-core/pull/104)

# 3.7.0 (2019-09-11)

- Added the `getFocusableChildren()` method to return an array of all focusable children for a provided `element`. [#99](https://github.com/blackbaud/skyux-core/pull/99)
- Added the `SkyPercentPipe` to allow for easy conversion of numbers to their percent form. [#95](https://github.com/blackbaud/skyux-core/pull/95)
- Fixed the numeric service to properly round numbers with high signficant digits. [#98](https://github.com/blackbaud/skyux-core/pull/98) (Thanks [@Blackbaud-ThomasOrtiz](https://github.com/Blackbaud-ThomasOrtiz)!)

# 3.6.1 (2019-07-23)

- Fixed `SkyMediaQueryService` to complete its observables when the consuming component is destroyed. [#86](https://github.com/blackbaud/skyux-core/pull/86)

# 3.6.0 (2019-06-12)

- Added `SkyCoreAdapterService` to provide helper functions for applying focus and setting CSS classes for responsive containers. [#81](https://github.com/blackbaud/skyux-core/pull/81)

# 3.5.3 (2019-05-06)

- Fixed `SkyNumericPipe` to include proper locale data when used with Angular version 5 and higher. [#74](https://github.com/blackbaud/skyux-core/pull/74)

# 3.5.2 (2019-03-20)

- Fixed `SkyNumericModule` to properly import `SkyI18nModule` and to provide `SkyNumericPipe`. [#72](https://github.com/blackbaud/skyux-core/pull/72)
- Fixed `SkyNumericService` to support `@angular/core@^5.0.0`. [#71](https://github.com/blackbaud/skyux-core/pull/71)

# 3.5.1 (2018-12-19)

- Fixed `SkyDynamicComponentService` to fully destroy components which are dynamically removed. [#55](https://github.com/blackbaud/skyux-core/pull/55)

# 3.5.0 (2018-12-11)

- Updated `SkyDynamicComponentService` to remove components from the page dynamically. [#45](https://github.com/blackbaud/skyux-core/pull/45)

# 3.4.0 (2018-11-29)

- Added `SkyDynamicComponentService` to provide the ability to inject entry components onto the page dynamically. [#44](https://github.com/blackbaud/skyux-core/pull/44)

# 3.3.0 (2018-11-15)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#43](https://github.com/blackbaud/skyux-core/pull/43)

# 3.2.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#42](https://github.com/blackbaud/skyux-core/pull/42)

# 3.2.2 (2018-10-30)

- Fixed circular dependency structure when importing from `@skyux/i18n`. [#38](https://github.com/blackbaud/skyux-core/pull/38)

# 3.2.1 (2018-10-29)

- Fixed numeric module to use correct locale resources provider. [#35](https://github.com/blackbaud/skyux-core/pull/35)

# 3.2.0 (2018-10-29)

- Added `SkyUIConfigService`. [#37](https://github.com/blackbaud/skyux-core/pull/37)
- Added option for minimum fraction digits to numeric service and pipe. [#34](https://github.com/blackbaud/skyux-core/pull/34)

# 3.1.0 (2018-09-19)

- Added `MockSkyMediaQueryService` for unit tests. [#33](https://github.com/blackbaud/skyux-core/pull/33)

# 3.0.2 (2018-09-17)

- Fixed locale resource imports to not produce 404s when the consuming app's execution context did not include SKY UX Builder. [#31](https://github.com/blackbaud/skyux-core/pull/31)

# 3.0.1 (2018-09-10)

- Fixed `NumericOptions` to provide `truncate` and `truncateAfter` as optional. [#27](https://github.com/blackbaud/skyux-core/pull/27)

# 3.0.0 (2018-09-10)

- Initial major release.

# 3.0.0-alpha.6 (2018-08-28)

- Added log and mutation to package export. [#16](https://github.com/blackbaud/skyux-core/pull/16)

# 3.0.0-alpha.5 (2018-08-18)

- Bugfix to remove Builder config from dependency.

# 3.0.0-alpha.4 (2018-08-16)

- Removed testing utilities; moved to `@skyux-sdk/testing`. [#13](https://github.com/blackbaud/skyux-core/pull/13)

# 3.0.0-alpha.3 (2018-08-16)

- Exported Jasmine matchers and a11y utilities. [#11](https://github.com/blackbaud/skyux-core/pull/11)

# 3.0.0-alpha.2 (2018-08-16)

- Exported testing components and services. [#9](https://github.com/blackbaud/skyux-core/pull/9)

# 3.0.0-alpha.1 (2018-08-15)

- Added localization resource files. [#3](https://github.com/blackbaud/skyux-core/pull/3)

# 3.0.0-alpha.0 (2018-08-14)

- Initial release.
