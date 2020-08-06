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
