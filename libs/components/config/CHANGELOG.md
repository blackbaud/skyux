# 5.0.0-beta.4 (2021-09-23)

- Moved the `blackbaudEmployee` property to a new `authSettings` configuration. [#85](https://github.com/blackbaud/skyux-config/pull/85)

# 5.0.0-beta.3 (2021-09-22)

- Added the `blackbaudEmployee` property to the `auth` configuration. [#84](https://github.com/blackbaud/skyux-config/pull/84)

# 5.0.0-beta.2 (2021-09-10)

- Migrated to Angular CLI. [#82](https://github.com/blackbaud/skyux-config/pull/82)

# 5.0.0-beta.1 (2021-06-29)

- Updated `skyuxconfig.json` schema to be more specific and match documentation. [#78](https://github.com/blackbaud/skyux-config/pull/78)

# 5.0.0-beta.0 (2021-06-15)

### New features

- Initial beta release.
- Added support for `@angular/core@^12`. [#77](https://github.com/blackbaud/skyux-config/pull/77)
- Deprecated `SkyAppConfigHost`, `SkyAppConfigParams`, `SkyAppConfigModule`, and `SkyAppRuntimeConfigParamsProvider`. [#77](https://github.com/blackbaud/skyux-config/pull/77)

### Breaking changes

- Removed `SkyAppParamsConfig`. Use `SkyAppConfig.skyux.params` instead. [#77](https://github.com/blackbaud/skyux-config/pull/77)

# 4.4.0 (2021-03-15)

- Added the `SkyAppConfigParams` injectable to replace (the now deprecated) `SkyAppParamsConfig`. This was done to address a naming convention inconsistency. [#74](https://github.com/blackbaud/skyux-config/pull/74)

# 4.3.0 (2021-03-08)

- Added the `SkyAppConfigModule` module to provide `host` and `params` values to the `SkyAppConfigHost` and `SkyAppParamsConfig` providers. [#73](https://github.com/blackbaud/skyux-config/pull/73)

# 4.2.0 (2020-11-20)

- Added the `SkyAppRuntimeConfigParamsProvider` to allow consuming applications to access `SkyAppRuntimeConfigParams` in their components and services. [#72](https://github.com/blackbaud/skyux-config/pull/72)

# 4.1.0 (2020-10-30)

- Added the optional `dependenciesForTranspilation` property to the schema. [#70](https://github.com/blackbaud/skyux-config/pull/70)

# 4.0.4 (2020-09-25)

- Fixed the JSDoc comment for the `SkyAppRuntimeConfigParams.get()` method. [#69](https://github.com/blackbaud/skyux-config/pull/69)

# 4.0.3 (2020-08-10)

- Fixed the release to include `skyuxconfig-schema.json`. [#68](https://github.com/blackbaud/skyux-config/pull/68)

# 4.0.2 (2020-08-05)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#66](https://github.com/blackbaud/skyux-config/pull/66)

# 4.0.1 (2020-07-08)

- Moved `theming` to the `app` section in `skyuxconfig-schema.json` to match the corresponding TypeScript declarations. [#58](https://github.com/blackbaud/skyux-config/pull/58)

# 4.0.0 (2020-05-11)

### New features

- Added the optional `librarySettings` property to the schema. [#37](https://github.com/blackbaud/skyux-config/pull/37)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#37](https://github.com/blackbaud/skyux-config/pull/37)
- Added the optional `enableIvy` property to the schema to enable Angular's Ivy compiler. [#43](https://github.com/blackbaud/skyux-config/pull/43)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#37](https://github.com/blackbaud/skyux-config/pull/37)
- Changed the `params` property on the schema to only accept type `object`. The value provided is converted into the `SkyConfigParams` TypeScript type during build time. [#18](https://github.com/blackbaud/skyux-config/pull/18)
- Removed the `omnibar.experimental` property on the schema. To enable the omnibar after this release, provide an empty object `"omnibar": {}`. [#18](https://github.com/blackbaud/skyux-config/pull/18)

# 4.0.0-rc.3 (2020-04-23)

- Added bug fixes and features from the `master` branch. [#49](https://github.com/blackbaud/skyux-config/pull/49)

# 3.9.0 (2020-04-22)

- Added the `theming` property to `SkyuxConfigApp`. [#46](https://github.com/blackbaud/skyux-config/pull/46)

# 4.0.0-rc.2 (2020-04-01)

- Upgraded development dependencies. [#44](https://github.com/blackbaud/skyux-config/pull/44)

# 4.0.0-rc.1 (2020-02-20)

### New features

- Added the optional `enableIvy` property to the schema to enable Angular's Ivy compiler. [#43](https://github.com/blackbaud/skyux-config/pull/43)

### Breaking changes

- Changed the `params` property on the schema to only accept type `object`. The value provided is converted into the `SkyConfigParams` TypeScript type during build time. [#18](https://github.com/blackbaud/skyux-config/pull/18)
- Removed the `omnibar.experimental` property on the schema. To enable the omnibar after this release, provide an empty object `"omnibar": {}`. [#18](https://github.com/blackbaud/skyux-config/pull/18)

# 3.8.1 (2020-02-20)

- Fixed the `help` property in the schema to only accept values of type `object`. [#41](https://github.com/blackbaud/skyux-config/pull/41)
- Fixed a typo in the schema for the `bbCheckout` property. [#40](https://github.com/blackbaud/skyux-config/pull/40)

# 3.8.0 (2020-02-18)

- Added the `bbCheckout` and `frameOptions` properties. [#34](https://github.com/blackbaud/skyux-config/pull/34)

# 4.0.0-rc.0 (2020-02-15)

### New features

- Added the optional `librarySettings` property to the schema. [#37](https://github.com/blackbaud/skyux-config/pull/37)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#37](https://github.com/blackbaud/skyux-config/pull/37)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#37](https://github.com/blackbaud/skyux-config/pull/37)

# 3.7.0 (2019-11-19)

- Replaced all imports from `@angular/http` with `@angular/common/http`. [#30](https://github.com/blackbaud/skyux-config/pull/30)

# 3.6.0 (2019-09-27)

- Added optional `base` property to `SkyuxConfigApp`. [#26](https://github.com/blackbaud/skyux-config/pull/26)

# 3.5.1 (2019-07-01)

- Added support for `@skyux-sdk/builder@3.7.0` which addressed some security vulnerabilities. [#20](https://github.com/blackbaud/skyux-config/pull/20)

# 3.5.0 (2019-03-05)

- Added `moduleAliases` property to schema. [#16](https://github.com/blackbaud/skyux-config/pull/16)

# 3.4.0 (2019-01-31)

- Added optional `name` property to `RuntimeConfigApp`. [#15](https://github.com/blackbaud/skyux-config/pull/15)

# 3.3.0 (2019-01-25)

- Added `pipelineSettings` property to schema. [#13](https://github.com/blackbaud/skyux-config/pull/13)

# 3.2.0 (2018-11-15)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#11](https://github.com/blackbaud/skyux-config/pull/11)

# 3.1.0 (2018-10-17)

- Added `styles` property to schema. [#8](https://github.com/blackbaud/skyux-config/pull/8)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.1 (2018-09-07)

- Added configuration schema for better IDE support. [#4](https://github.com/blackbaud/skyux-config/pull/4)

# 3.0.0-alpha.0 (2018-08-21)

- Initial release.
