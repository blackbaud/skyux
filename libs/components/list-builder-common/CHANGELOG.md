**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

___
# 5.0.2 (2022-02-08)

- Fixed the generated documentation to not include helper functions. [#30](https://github.com/blackbaud/skyux-list-builder-common/pull/30)

# 5.0.1 (2021-11-18)

- Added support for prettier code formatting and updated the builder to support StackBlitz. [#28](https://github.com/blackbaud/skyux-list-builder-common/pull/28)

# 5.0.0 (2021-09-29)

### New features

- Added support for Angular 12. [#23](https://github.com/blackbaud/skyux-list-builder-common/pull/23)

# 5.0.0-beta.1 (2021-09-10)

- Migrated to Angular CLI. [#24](https://github.com/blackbaud/skyux-list-builder-common/pull/24)

# 5.0.0-beta.0 (2021-07-09)

- Initial beta release.
- Added support for `@angular/core@^12`. [#23](https://github.com/blackbaud/skyux-list-builder-common/pull/23)

# 4.0.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#21](https://github.com/blackbaud/skyux-list-builder-common/pull/21)

# 4.0.0 (2020-05-11)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#11](https://github.com/blackbaud/skyux-list-builder-common/pull/11)
- Migrated all of the types from the deprecated library `microedge-rxstate`. [#12](https://github.com/blackbaud/skyux-list-builder-common/pull/12)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#11](https://github.com/blackbaud/skyux-list-builder-common/pull/11)

# 4.0.0-rc.1 (2020-04-16)

### New features

- Migrated all of the types from the deprecated library `microedge-rxstate`. [#12](https://github.com/blackbaud/skyux-list-builder-common/pull/12)

# 4.0.0-rc.0 (2020-04-06)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#11](https://github.com/blackbaud/skyux-list-builder-common/pull/11)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#11](https://github.com/blackbaud/skyux-list-builder-common/pull/11)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.1 (2018-11-19)

- Added `checked` property to `ListItemModel` to support multiselect grids. Added `isObservable` and `compare` methods to `helpers.ts`. [#5](https://github.com/blackbaud/skyux-list-builder-common/pull/5)

# 3.0.0-rc.0 (2018-11-15)

- Initial release candidate.
- Fixed `getData` helper to handle undefined selectors. [#2](https://github.com/blackbaud/skyux-list-builder-common/pull/2)

# 3.0.0-alpha.0 (2018-11-15)

- Initial release.
