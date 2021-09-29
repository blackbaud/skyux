# 5.0.0-beta.3 (2021-09-08)

- Updated peer dependencies. [#58](https://github.com/blackbaud/skyux-autonumeric/pull/58)

# 5.0.0-beta.2 (2021-09-03)

- Enabled Ivy's `partial` compilation mode. [#56](https://github.com/blackbaud/skyux-autonumeric/pull/56)

# 5.0.0-beta.1 (2021-08-27)

- Migrated to Angular CLI. [#54](https://github.com/blackbaud/skyux-autonumeric/pull/54)

# 5.0.0-beta.0 (2021-07-08)

- Initial beta release.
- Added support for `@angular/core@^12`. [#53](https://github.com/blackbaud/skyux-autonumeric/pull/53)
- Fixed `SkyAutonumericOptionsProvider` to work within lazy-loaded feature modules. [#52](https://github.com/blackbaud/skyux-autonumeric/pull/52)

# 4.0.4 (2021-06-02)

- Fixed the `skyAutonumeric` directive to use the options provider when no local options are given to the directive. [#50](https://github.com/blackbaud/skyux-autonumeric/pull/50)

# 4.0.3 (2021-04-01)

- Fixed the `skyAutonumeric` directive to work properly within an AG Grid cell editor. [#47](https://github.com/blackbaud/skyux-autonumeric/pull/47) (Thanks [@ThomasOrtiz](https://github.com/ThomasOrtiz)!)

# 4.0.2 (2020-08-25)

- Fixed the `skyAutonumeric` directive to not set the `dirty` status when the model is set with a falsy value. [#39](https://github.com/blackbaud/skyux-autonumeric/pull/39)

# 4.0.1 (2020-08-05)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#33](https://github.com/blackbaud/skyux-autonumeric/pull/33)

# 4.0.0 (2020-05-12)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#20](https://github.com/blackbaud/skyux-autonumeric/pull/20)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#20](https://github.com/blackbaud/skyux-autonumeric/pull/20)

# 4.0.0-rc.1 (2020-04-24)

- Added bug fixes and features from the `master` branch. [#24](https://github.com/blackbaud/skyux-autonumeric/pull/24)

# 3.0.5 (2020-04-23)

- Fixed the `skyAutonumeric` directive to validate on input changes. [#22](https://github.com/blackbaud/skyux-autonumeric/pull/22)

# 4.0.0-rc.0 (2020-04-20)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#20](https://github.com/blackbaud/skyux-autonumeric/pull/20)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#20](https://github.com/blackbaud/skyux-autonumeric/pull/20)

# 3.0.4 (2020-04-07)

- Fixed the `skyAutonumeric` directive to no longer treat empty values as zero when using a currency symbol. [#18](https://github.com/blackbaud/skyux-autonumeric/pull/18)

# 3.0.3 (2020-01-31)

- Fixed the `skyAutonumeric` directive to properly set the invalid state when the input is required. [#15](https://github.com/blackbaud/skyux-autonumeric/pull/15)
- Fixed the `skyAutonumeric` directive to no longer treat empty values as zero. [#15](https://github.com/blackbaud/skyux-autonumeric/pull/15)
- Fixed the `skyAutonumeric` directive to show an invalid state when values are provided that are not of type `number`. [#15](https://github.com/blackbaud/skyux-autonumeric/pull/15)

# 3.0.2 (2020-01-31)

- Fixed the `skyAutonumeric` directive to properly set the disabled state when using reactive forms. [#9](https://github.com/blackbaud/skyux-autonumeric/pull/9)

# 3.0.1 (2019-08-01)

- Fixed the `skyAutonumeric` directive to properly format a zero (0) value. [#5](https://github.com/blackbaud/skyux-autonumeric/pull/5) (Thanks [@Blackbaud-StewartStephens](https://github.com/Blackbaud-StewartStephens)!)

# 3.0.0 (2019-05-22)

- Initial major release.

# 3.0.0-beta.2 (2019-05-22)

- Added support for template-driven forms. [#4](https://github.com/blackbaud/skyux-autonumeric/pull/4)

# 3.0.0-beta.1 (2019-05-22)

- Fixed the `skyAutonumeric` directive to work with reactive forms. [#3](https://github.com/blackbaud/skyux-autonumeric/pull/3)

### Breaking changes
- Removed the `skyAutonumericOptions` and `skyAutonumericPreset` inputs on the `skyAutonumeric` directive. `AutoNumeric` options can now be set directly using the `skyAutonumeric` attribute (e.g., `[skyAutonumeric]="options"`).
- Replaced the `SkyAutonumericConfig` with `SkyAutonumericOptionsProvider`. See README.md for details.

# 3.0.0-beta.0 (2019-05-21)

- Initial beta release.
