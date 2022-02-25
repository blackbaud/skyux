**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#56](https://github.com/blackbaud/skyux-validation/pull/56)

# 5.0.0 (2021-09-29)

### New features

- Added support for Angular 12. [#50](https://github.com/blackbaud/skyux-validation/pull/50)

# 5.0.0-beta.2 (2021-9-21)

- Fixed the public exports API to be consistent with the other SKY UX component libraries. [#53](https://github.com/blackbaud/skyux-validation/pull/53)

# 5.0.0-beta.1 (2021-09-10)

- Migrated to Angular CLI. [#50](https://github.com/blackbaud/skyux-validation/pull/50)

# 5.0.0-beta.0 (2021-06-24)

- Initial beta release.

# 4.0.1 (2020-08-07)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#34](https://github.com/blackbaud/skyux-validation/pull/34)

# 4.0.0 (2020-05-11)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#23](https://github.com/blackbaud/skyux-validation/pull/23)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#23](https://github.com/blackbaud/skyux-validation/pull/23)

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#23](https://github.com/blackbaud/skyux-validation/pull/23)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#23](https://github.com/blackbaud/skyux-validation/pull/23)

# 3.2.1 (2019-09-27)

- Fixed the `SkyValidators.email` and `SkyValidators.url` validators to allow null string values. [#17](https://github.com/blackbaud/skyux-validation/pull/17) Thanks [@Blackbaud-MatthewMiles](https://github.com/Blackbaud-MatthewMiles)!

# 3.2.0 (2019-06-28)

- Added support for `@skyux-sdk/builder@3.7.0`. [#13](https://github.com/blackbaud/skyux-validation/pull/13)
- Added the `FormControl` validators `SkyValidators.email` and `SkyValidators.url`. [#12](https://github.com/blackbaud/skyux-validation/pull/12) Thanks [@Blackbaud-MatthewMiles](https://github.com/Blackbaud-MatthewMiles)!

# 3.1.0 (2019-02-22)

- Added the ability to statically verify email addresses and URLs. [#9](https://github.com/blackbaud/skyux-validation/pull/9)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.0 (2018-10-15)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-10)

- Initial alpha release.
