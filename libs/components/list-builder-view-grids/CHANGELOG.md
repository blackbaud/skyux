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
