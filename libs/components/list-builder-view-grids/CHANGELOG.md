**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#104](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/104)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#99](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/99)

# 5.0.0-beta.1 (2021-09-15)

- Migrated to Angular CLI. [#99](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/99)
- Added support for "partial" Ivy compilation mode. [#99](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/99)

# 5.0.0-beta.0 (2021-07-15)

- Initial beta release.
- Added support for `@angular/core@^12`. [#97](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/97)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#97](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/97)

# 4.0.2 (2020-08-19)

- Fixed the list view grid component to render grid column components which utilize an inline template. [#89](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/89)

# 4.0.1 (2020-08-06)

- Added `SkyListViewGridComponent` to the exports API. [#86](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/86)
- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#86](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/86)

# 4.0.0 (2020-05-15)

### New features

- Added a test fixture for the list view grid component to use in consumer unit tests. [#68](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/68)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#65](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/65)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#65](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/65)

# 3.7.0 (2020-05-15)

- Added the ability to delete rows in the list view grid component. [#75](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/75)

# 4.0.0-rc.2 (2020-05-07)

- Added bug fixes and features from the `master` branch. [#73](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/73)

# 3.6.4 (2020-05-06)

- Fixed the column selector action to display in the correct position inside a list toolbar. [#67](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/67)

# 3.6.3 (2020-05-04)

- Removed `moment` as a dependency. [#69](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/69)

# 4.0.0-rc.1 (2020-04-30)

### New features

- Added a test fixture for the list view grid component to use in consumer unit tests. [#68](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/68)

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#65](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/65)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#65](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/65)

# 3.6.2 (2020-02-07)

- Added support for `@skyux/list-builder@3.6.3` to prevent redundant updates to `ListItemModel` and improve performance for the list view grid component. [#77](https://github.com/blackbaud/skyux-list-builder/pull/77)

# 3.6.1 (2019-12-30)

- Fixed the list view grid component to allow selecting rows on init by using the list component's `selectedIds` property. [#57](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/57)

# 3.6.0 (2019-12-06)

- Removed the `multiselectRowId` input property from the list view grid component. [#55](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/55)

# 3.5.0 (2019-09-27)

- Added support for `@skyux-sdk/builder@3.8.0`. [#49](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/49)

# 3.4.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#37](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/37)

# 3.3.0 (2019-05-17)

- Added UI Config Service hooks to the list view grid component. [#38](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/38)

# 3.2.0 (2019-03-22)

- Added support for `@skyux/list-builder@^3.2.1` to add the multiselect toolbar to the list view grid component. [#21](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/21)

# 3.1.0 (2019-03-19)

- Added support for `microedge-rxstate@>=2.0.2`. [#32](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/32)
- Fixed the list view grid component to properly import the `scan` RxJS operator. [#32](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/32)

# 3.0.2 (2019-03-07)

- Fixed the list view grid component to not trigger excessive data fetches. [#20](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/20)
- Updated the `list-builder` peer dependency to prevent the list view grid component from throwing `ExpressionChangedAfterItHasBeenCheckedError` when removing the last item from a page. [#31](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/31)
- Reverted change to the list view grid component from `3.0.1`. [#30](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/30)

# 3.0.1 (2019-02-22)

- Fixed the list view grid component to not throw `ExpressionChangedAfterItHasBeenCheckedError` when removing the last item from a page. [#22](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/22)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.5 (2018-01-08)

- Added the `rowHighlightedId` input to the list view grid component. [#14](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/14)

# 3.0.0-rc.4 (2018-11-30)

- Fixed `SkyListViewGridModule` exports to include required submodules and `SkyGridModule`. [#9](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/9)

# 3.0.0-rc.3 (2018-11-20)

- Added support for `@skyux/list-builder-common@3.0.0-rc.1`. [#10](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/10)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#8](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/8)

# 3.0.0-rc.1 (2018-10-30)

- Added missing exports. [#5](https://github.com/blackbaud/skyux-list-builder-view-grids/pull/5)

# 3.0.0-rc.0 (2018-10-29)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-24)

- Initial alpha release.
