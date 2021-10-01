# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#129](https://github.com/blackbaud/skyux-list-builder/pull/129)

# 5.0.0-beta.2 (2021-09-14)

- Updated the peer dependencies. [#136](https://github.com/blackbaud/skyux-list-builder/pull/136)

# 5.0.0-beta.1 (2021-09-13)

- Migrated to Angular CLI. [#134](https://github.com/blackbaud/skyux-list-builder/pull/134)

# 5.0.0-beta.0 (2021-07-12)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#129](https://github.com/blackbaud/skyux-list-builder/pull/129)
- Added support for `@angular/core@^12`. [#129](https://github.com/blackbaud/skyux-list-builder/pull/129)

# 4.0.4 (2021-01-26)

- Fixed the filter summary component to not error when an unapplied filter exists upon creation. [#126](https://github.com/blackbaud/skyux-list-builder/pull/126)

# 4.0.3 (2020-12-18)

- Fixed the filter summary component to only show filters which are being applied. [#123](https://github.com/blackbaud/skyux-list-builder/pull/123)

# 4.0.2 (2020-08-21)

- Fixed the `selectedIds` property on the list component to handle observable values. [#109](https://github.com/blackbaud/skyux-list-builder/pull/109)

# 4.0.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#103](https://github.com/blackbaud/skyux-list-builder/pull/103)

# 4.0.0 (2020-05-14)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#87](https://github.com/blackbaud/skyux-list-builder/pull/87)

# 3.8.1 (2020-05-06)

- Fixed the list component to return to the first page after applying a filter or sorting a list. [#89](https://github.com/blackbaud/skyux-list-builder/pull/89)
- Fixed the list toolbar item component to honor item indexing. [#88](https://github.com/blackbaud/skyux-list-builder/pull/88)

# 4.0.0-rc.2 (2020-04-17)

### Bug fixes

- Added `SkyListSecondaryActionsComponent` and `SkyListToolbarComponent` to the exports API.

# 4.0.0-rc.1 (2020-04-17)

### Bug fixes

- Added `SkyListViewComponent` and `SkyListComponent` to the exports API.

# 4.0.0-rc.0 (2020-04-17)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#87](https://github.com/blackbaud/skyux-list-builder/pull/87)

# 3.8.0 (2020-04-15)

- Upgraded the package development dependencies. [#85](https://github.com/blackbaud/skyux-list-builder/pull/85)

# 3.7.1 (2020-03-11)

- Fixed the list toolbar component to not display an empty toolbar when search is disabled. [#76](https://github.com/blackbaud/skyux-list-builder/pull/76)

# 3.7.0 (2020-03-05)

- Added the `inMemorySearchEnabled` and `searchApplied` properties to the list toolbar component to enable consuming SKY UX components to run searches remotely. [#82](https://github.com/blackbaud/skyux-list-builder/pull/82)

# 3.6.4 (2020-02-07)

- Fixed the package's primary entrypoint to include the list state types and removed an invalid import in the multiselect toolbar component. [#79](https://github.com/blackbaud/skyux-list-builder/pull/79)

# 3.6.3 (2020-02-06)

- Fixed `ListStateDispatcher` to prevent redundant updates to `ListItemModel` and improve performance for the list view grid component. [#77](https://github.com/blackbaud/skyux-list-builder/pull/77)

# 3.6.2 (2019-12-06)

- Fixed the list component to properly retain selections after removing filters. [#72](https://github.com/blackbaud/skyux-list-builder/pull/72)

# 3.6.1 (2019-11-07)

- Fixed the list component to properly return data when calling `refreshDisplayedItems()`. [#69](https://github.com/blackbaud/skyux-list-builder/pull/69)

# 3.6.0 (2019-10-30)

- Added the list view switcher component to provide toolbar buttons to switch between list views. [#32](https://github.com/blackbaud/skyux-list-builder/pull/32)

# 3.5.2 (2019-09-11)

- Fixed the list component to properly display results when searching pages other than the first page. [#61](https://github.com/blackbaud/skyux-list-builder/pull/61)
- Fixed the list builder component to load properly when `selectedIds` are undefined. [#63](https://github.com/blackbaud/skyux-list-builder/pull/63)

# 3.5.1 (2019-08-02)

- Fixed the list component to properly notify consumers when filters are removed. [#60](https://github.com/blackbaud/skyux-list-builder/pull/60)

# 3.5.0 (2019-07-19)

- Updated the list component to programmatically select rows when the `selectedIds` input property is used in conjunction with the list view grids component. [#57](https://github.com/blackbaud/skyux-list-builder/pull/57)

# 3.4.0 (2019-07-01)

- Added `sky-list-toolbar-search-actions` to the list toolbar's child components. [#52](https://github.com/blackbaud/skyux-list-builder/pull/52) (Thanks [@blackbaud-vimal-kumar](https://github.com/blackbaud-vimal-kumar)!)

# 3.3.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#43](https://github.com/blackbaud/skyux-list-builder/pull/43)

# 3.2.4 (2019-05-28)

- Fixed the list toolbar component to properly display items when they are dynamically shown or hidden. [#45](https://github.com/blackbaud/skyux-list-builder/pull/45)

# 3.2.3 (2019-04-16)

- Fixed visual styles for the list toolbar view actions component. [#41](https://github.com/blackbaud/skyux-list-builder/pull/41)

# 3.2.2 (2019-04-12)

- Fixed missing model exports. [#39](https://github.com/blackbaud/skyux-list-builder/pull/39)

# 3.2.1 (2019-03-20)

- Fixed `SkyListToolbarModule` to properly import `SkyListBuilderResourcesModule`. [#37](https://github.com/blackbaud/skyux-list-builder/pull/37/)

# 3.2.0 (2019-03-19)

- Added support for the multiselect toolbar. [#18](https://github.com/blackbaud/skyux-list-builder/pull/18/)

# 3.1.0 (2019-03-19)

- Added support for `microedge-rxstate@>=2.0.2`. [#33](https://github.com/blackbaud/skyux-list-builder/pull/33)
- Fixed `ListPagingComponent` to properly import the `scan` RxJS operator. [#33](https://github.com/blackbaud/skyux-list-builder/pull/33)

# 3.0.1 (2019-03-07)

- Fixed the list paging component to update after the list items change. [#25](https://github.com/blackbaud/skyux-list-builder/pull/25)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.4 (2018-11-20)

 - Added support for `@skyux/list-builder-common@3.0.0-rc.1`. [#9](https://github.com/blackbaud/skyux-list-builder/pull/9)
 - Updated peer dependencies to support Angular versions greater than `4.3.6`. [#10](https://github.com/blackbaud/skyux-list-builder/pull/10)

# 3.0.0-rc.3 (2018-11-12)

- Fixed the `isObservable` utility function to work with RxJS 6. [#8](https://github.com/blackbaud/skyux-list-builder/pull/8)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#7](https://github.com/blackbaud/skyux-list-builder/pull/7)

# 3.0.0-rc.1 (2018-10-30)

- Added support for `@skyux/i18n@3.2.0`. [#5](https://github.com/blackbaud/skyux-list-builder/pull/5)

# 3.0.0-rc.0 (2018-10-24)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-10)

- Initial alpha release.
