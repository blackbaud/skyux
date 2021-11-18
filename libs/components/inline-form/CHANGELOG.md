# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#58](https://github.com/blackbaud/skyux-inline-form/pull/58)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#50](https://github.com/blackbaud/skyux-inline-form/pull/50)

# 5.0.0-beta.2 (2021-09-14)

- Updated peer dependencies. [#55](https://github.com/blackbaud/skyux-inline-form/pull/55)

# 5.0.0-beta.1 (2021-09-10)

- Migrated to Angular CLI. [#53](https://github.com/blackbaud/skyux-inline-form/pull/53)

# 5.0.0-beta.0 (2021-07-07)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#50](https://github.com/blackbaud/skyux-inline-form/pull/50)

# 5.0.0-alpha.0 (2021-05-21)

- Removed `BrowserAnimationsModule` from the `imports` section of `SkyInlineFormModule` to support lazy-loading. Consumers of `SkyInlineFormModule` must now import `BrowserAnimationsModule` into their application's root module. [#47](https://github.com/blackbaud/skyux-inline-form/pull/47)

# 4.1.1 (2021-03-18)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#42](https://github.com/blackbaud/skyux-inline-form/pull/42)

# 4.1.0 (2020-08-27)

- Added modern theme styles to the inline form component. [#36](https://github.com/blackbaud/skyux-inline-form/pull/36)

# 4.0.1 (2020-08-10)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#29](https://github.com/blackbaud/skyux-inline-form/pull/29)

# 4.0.0 (2020-05-12)

### New features

- Added support for `@angular/core@^9`. [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)

# 4.0.0-rc.0 (2020-02-21)

### New features

- Added support for `@angular/core@^9`. [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#18](https://github.com/blackbaud/skyux-inline-form/pull/18)

# 3.1.0 (2019-12-20)

- Added the `disabled` property to `SkyInlineFormButtonConfig` to indicate whether to disable the button. [#15](https://github.com/blackbaud/skyux-inline-form/pull/15)

# 3.0.1 (2019-12-13)

- Fixed the inline form component to recognize changes to the `config` input. [#10](https://github.com/blackbaud/skyux-inline-form/pull/10) (Thanks [@blackbaud-jeremymorgan](https://github.com/blackbaud-jeremymorgan)!)

# 3.0.0 (2019-04-15)

- Major version release.

# 3.0.0-rc.0 (2019-04-10)

- Initial release candidate.
