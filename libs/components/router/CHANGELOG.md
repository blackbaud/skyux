# 5.0.2 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#46](https://github.com/blackbaud/skyux-router/pull/46)

# 5.0.1 (2021-10-05)

- Marked `skyAppLinkExternal` as deprecated in favor of `skyHref`. [#42](https://github.com/blackbaud/skyux-router/pull/42)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#31](https://github.com/blackbaud/skyux-router/pull/31)

# 5.0.0-beta.3 (2021-09-28)

- Added bug fixes and features from the `master` branch. [#39](https://github.com/blackbaud/skyux-router/pull/39)

# 4.3.0 (2021-09-28)

- Updated the `skyHref` directive to support using array inputs for route parameters. [#37](https://github.com/blackbaud/skyux-router/pull/37)

# 5.0.0-beta.2 (2021-09-14)

- Fixed the `skyHref` directive to handle scenarios where `SkyAppConfig` is not provided. [#36](https://github.com/blackbaud/skyux-router/pull/36)

# 5.0.0-beta.1 (2021-09-13)

- Migrated to Angular CLI. [#34](https://github.com/blackbaud/skyux-router/pull/34)

# 5.0.0-beta.0 (2021-07-06)

- Initial beta release. [#31](https://github.com/blackbaud/skyux-router/pull/31)
- Added support for `@angular/core@^12`. [#31](https://github.com/blackbaud/skyux-router/pull/31)

# 4.2.2 (2021-06-09)

- Added the `sky-href` class for the link style, added handling for the null config and resolver, and switched to using the `hidden` attribute when hiding `skyHref` links. [#29](https://github.com/blackbaud/skyux-router/pull/29)

# 4.2.1 (2021-06-03)

- Fixed `SkyAppLinkExternalDirective` to properly include query parameters on link URLs. [#27](https://github.com/blackbaud/skyux-router/pull/27)

# 4.2.0 (2021-05-28)

- Added the `skyHref` directive for providing access control checks to hide or disable links. [#25](https://github.com/blackbaud/skyux-router/pull/25)

# 4.1.0 (2021-03-15)

- Fixed `SkyAppLinkDirective` and `SkyAppLinkExternalDirective` to properly extend Angular's `RouterLinkWithHref`. [#23](https://github.com/blackbaud/skyux-router/pull/23)
- Added support for `@skyux/config@4.3.0`. [#23](https://github.com/blackbaud/skyux-router/pull/23)

# 4.0.1 (2020-08-07)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#22](https://github.com/blackbaud/skyux-router/pull/22)

# 4.0.0 (2020-05-12)

### New features

- Added support for `@angular/core@^9`. [#10](https://github.com/blackbaud/skyux-router/pull/10)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#10](https://github.com/blackbaud/skyux-router/pull/10)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#10](https://github.com/blackbaud/skyux-router/pull/10)

# 4.0.0-rc.0 (2020-02-19)

### New features

- Added support for `@angular/core@^9`. [#10](https://github.com/blackbaud/skyux-router/pull/10)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#10](https://github.com/blackbaud/skyux-router/pull/10)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#10](https://github.com/blackbaud/skyux-router/pull/10)

# 3.1.1 (2019-04-09)

- Fixed `SkyAppLinkModule` to provide `SkyAppWindowRef`. [#74](https://github.com/blackbaud/skyux-router/pull/8)

# 3.1.0 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#6](https://github.com/blackbaud/skyux-router/pull/6)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.4 (2018-09-19)

- Changed name of link module to `SkyAppLinkModule`.

# 3.0.0-alpha.3 (2018-08-21)

- Updated peer dependencies.

# 3.0.0-alpha.2 (2018-08-21)

- Updated dependencies.

# 3.0.0-alpha.1 (2018-08-18)

- Bugfix to remove Builder config from dependency.

# 3.0.0-alpha.0 (2018-08-16)

- Initial release.
