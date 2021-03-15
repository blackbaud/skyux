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
