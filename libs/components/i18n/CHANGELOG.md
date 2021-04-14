# 4.1.0 (2021-04-14)

- Added the `SkyI18nCurrencyFormatService`. [#95](https://github.com/blackbaud/skyux-i18n/pull/95) [#98](https://github.com/blackbaud/skyux-i18n/pull/98) (Thanks [@ThomasOrtiz](https://github.com/ThomasOrtiz)!)
- Fixed the `SkyAppResourcesTestService` to work with applications that include the word "public" in their name. [#99](https://github.com/blackbaud/skyux-i18n/pull/99)

# 4.0.4 (2021-04-07)

- Removed an incorrect provider for `SkyAppAssetsService` from `SkyI18nModule` that caused the correct asset service provider to be overridden in certain configurations. [#96](https://github.com/blackbaud/skyux-i18n/pull/96)

# 4.0.3 (2020-10-20)

- Fixed the `skyAppResources` and `skyLibResources` pipes to complete their observables when destroyed. [#93](https://github.com/blackbaud/skyux-i18n/pull/93)

# 4.0.2 (2020-09-17)

- Fixed the `SkyAppResourcesTestService` to include the public `getStringForLocale` method. [#91](https://github.com/blackbaud/skyux-i18n/pull/91) Thanks [@Blackbaud-JasonBodnar](https://github.com/Blackbaud-JasonBodnar)!

# 4.0.1 (2020-07-14)

- Added support for `@skyux-sdk/builder@4.2.0`. [#84](https://github.com/blackbaud/skyux-i18n/pull/84)

# 4.0.0 (2020-05-11)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#51](https://github.com/blackbaud/skyux-i18n/pull/51)

### Breaking changes
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#51](https://github.com/blackbaud/skyux-i18n/pull/51)
- Removed `SkyAppHostLocaleProvider`. This class is provided automatically by `@skyux-sdk/builder@>=3`. [#51](https://github.com/blackbaud/skyux-i18n/pull/51)
- Removed `SkyLibResourcesTestService` because it is no longer needed. Instead of providing the test service in the `TestBed`, import the resources module used in production. [#75](https://github.com/blackbaud/skyux-i18n/pull/75)

# 4.0.0-rc.5 (2020-04-20)

### Breaking changes

- Removed `SkyLibResourcesTestService` because it is no longer needed. Instead of providing the test service in the `TestBed`, import the resources module used in production. [#75](https://github.com/blackbaud/skyux-i18n/pull/75)

# 4.0.0-rc.4 (2020-04-20)

- Added bug fixes and features from the `master` branch. [#72](https://github.com/blackbaud/skyux-i18n/pull/72)

# 3.11.0 (2020-04-20)

- Added a `getStringForLocale()` method to `SkyAppResourcesService` for retrieving a resource string for the specified locale. [#67](https://github.com/blackbaud/skyux-i18n/pull/67) Thanks [@Blackbaud-JasonBodnar](https://github.com/Blackbaud-JasonBodnar)!

# 4.0.0-rc.3 (2020-04-01)

- Upgraded the development and peer dependencies. [#65](https://github.com/blackbaud/skyux-i18n/pull/65)

# 4.0.0-rc.2 (2020-03-26)

- Added bug fixes and features from the master branch. [#64](https://github.com/blackbaud/skyux-i18n/pull/64)

# 3.10.0 (2020-03-16)

- Updated `SkyAppResourcesService` and `skyAppResources` pipe to leave tokens intact when no corresponding parameter is specified. [#62](https://github.com/blackbaud/skyux-i18n/pull/62)

# 4.0.0-rc.1 (2020-02-15)

- Added the `SkyIntlNumberFormatStyle` type to the primary entry point. [#58](https://github.com/blackbaud/skyux-i18n/pull/58)

# 4.0.0-rc.0 (2020-02-15)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#51](https://github.com/blackbaud/skyux-i18n/pull/51)

### Breaking changes
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#51](https://github.com/blackbaud/skyux-i18n/pull/51)
- Removed `SkyAppHostLocaleProvider`. This class is provided automatically by `@skyux-sdk/builder@>=3`. [#51](https://github.com/blackbaud/skyux-i18n/pull/51)

# 3.9.3 (2020-02-10)

- Fixed a circular reference to `@skyux/core`.

# 3.9.2 (2020-02-07)

- Fixed the primary entry point to export `SkyIntlNumberFormatStyle`. [#54](https://github.com/blackbaud/skyux-i18n/pull/54)

# 3.9.1 (2020-02-07)

- Fixed several deep imports into other SKY UX packages to address build warnings when using Angular Ivy. [#52](https://github.com/blackbaud/skyux-i18n/pull/52)

# 3.9.0 (2019-09-09)

- Added `SkyAppResourceNameProvider` to provide the ability to alter the resource key before passing it to `SkyLibResourcesService`. [#46](https://github.com/blackbaud/skyux-i18n/pull/46) Thanks [@Blackbaud-MatthewBell](https://github.com/Blackbaud-MatthewBell)!

# 3.8.0 (2019-08-28)

- Updated dependencies. [#43](https://github.com/blackbaud/skyux-i18n/pull/43)
- Created `SkyAppResourceNameProvider` to provide the ability to alter the resource key before passing it to `SkyAppLocaleProvider`. [#41](https://github.com/blackbaud/skyux-i18n/pull/41) Thanks [@Blackbaud-MatthewBell](https://github.com/Blackbaud-MatthewBell)!

# 3.7.1 (2019-06-24)

- Fixed bug where `HttpModule` was still being imported into `SkyI18nModule`. [#37](https://github.com/blackbaud/skyux-i18n/pull/37)

# 3.7.0 (2019-06-24)

- Removed a peer dependency on the deprecated `@angular/http` library. [#35](https://github.com/blackbaud/skyux-i18n/pull/35)

# 3.6.1 (2019-04-29)

- Fixed `SkyAppHostLocaleProvider` to remove circular a reference to `@skyux/core`. [#33](https://github.com/blackbaud/skyux-i18n/pull/33)

# 3.6.0 (2019-04-26)

- Added utility classes to format dates and numbers by locale. [#31](https://github.com/blackbaud/skyux-i18n/pull/31)

# 3.5.2 (2019-03-28)

- Fixed `SkyAppResourcesService` and `SkyLibResourcesService` to remove a circular reference to `@skyux/core`. [#25](https://github.com/blackbaud/skyux-i18n/pull/25)

# 3.5.1 (2019-03-19)

- Fixed `SkyI18nModule` to remove a circular reference to `@skyux/core`. [#23](https://github.com/blackbaud/skyux-i18n/pull/23)

# 3.5.0 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#20](https://github.com/blackbaud/skyux-i18n/pull/20)

# 3.4.0 (2018-11-12)

- Added support for webpack 4. [#18](https://github.com/blackbaud/skyux-i18n/pull/18)
- Added a deprecation warning to `SkyLibResourcesTestService`. [#19](https://github.com/blackbaud/skyux-i18n/pull/19)

# 3.3.0 (2018-11-08)

- Added an internal utility to derive resource strings for a given locale. [#17](https://github.com/blackbaud/skyux-i18n/pull/17)
- Added a more descriptive message to the library resources test service. [#15](https://github.com/blackbaud/skyux-i18n/pull/15)

# 3.2.1 (2018-11-01)

- Fixed classes to properly import the `Observable.of` operator. [#16](https://github.com/blackbaud/skyux-i18n/pull/16)

# 3.2.0 (2018-10-17)

- Added `SkyLibResourcesTestService` to be used in unit tests. [#14](https://github.com/blackbaud/skyux-i18n/pull/14)

# 3.1.1 (2018-10-17)

- Fixed imports to ignore the local version of `SkyAppHostLocaleProvider`. [#13](https://github.com/blackbaud/skyux-i18n/pull/13)

# 3.1.0 (2018-10-17)

- Added a resources pipe and service to be used by libraries. [#12](https://github.com/blackbaud/skyux-i18n/pull/12)

# 3.0.1 (2018-09-24)

- Fixed `SkyI18nModule` to properly import `HttpModule`. [#11](https://github.com/blackbaud/skyux-i18n/pull/11)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.9 (2018-09-18)

- Updated the directory structure.

# 3.0.0-alpha.8 (2018-09-18)

- Added library support for `SkyAppResourcesTestService`. [#10](https://github.com/blackbaud/skyux-i18n/pull/10)

# 3.0.0-alpha.7 (2018-09-17)

- Reverted directory structure changes.
- Isolated the "testing" module from the production module.

# 3.0.0-alpha.6 (2018-09-17)

- Added `HttpModule` to the list of providers.
- Updated the directory structure.

# 3.0.0-alpha.5 (2018-09-11)

- Added support for `@skyux/core@3.0.1`.

# 3.0.0-alpha.4 (2018-08-21)

- Updated dependencies.

# 3.0.0-alpha.3 (2018-08-18)

- Bugfix to remove Builder config from dependency.

# 3.0.0-alpha.2 (2018-08-17)

- Added `@skyux/builder-utils` to peer dependencies. [#6](https://github.com/blackbaud/skyux-i18n/pull/6)
- Reverted changes to require context. [#6](https://github.com/blackbaud/skyux-i18n/pull/6)

# 3.0.0-alpha.1 (2018-08-17)

- Fixed require context. [#4](https://github.com/blackbaud/skyux-i18n/pull/4)

# 3.0.0-alpha.0 (2018-08-16)

- Initial release.
