# 3.4.0 (2019-12-18)

- Added the `inlineHelpPopover` property to the grid column component. [#83](https://github.com/blackbaud/skyux-grids/pull/83) (Thanks, [@Blackbaud-DustinLunsford](https://github.com/Blackbaud-DustinLunsford)!)

# 3.3.0 (2019-12-11)

- Added the `source` property to `SkyGridSelectedRowsModelChange`, which defines the source of the change. [#80](https://github.com/blackbaud/skyux-grids/pull/80)
- Fixed the grid component to allow selecting rows on init by using the `selectedRowIds` property. [#78](https://github.com/blackbaud/skyux-grids/pull/78)

# 3.2.1 (2019-09-27)

- Fixed the grid component to restrict how users reorder the columns beside locked columns. You can no longer reorder the columns on the left side of a locked column, and you can no longer move columns from the right side of a locked column to the left side.
 [#72](https://github.com/blackbaud/skyux-grids/pull/72)
- Fixed the grid component to prevent users from reordering locked columns with the sort indicator. [#71](https://github.com/blackbaud/skyux-grids/pull/71)
- Fixed the grid component to prevent scrolling when users reorder columns on mobile devices. [#70](https://github.com/blackbaud/skyux-grids/pull/70)

# 3.2.0 (2019-07-19)

- Added the `selectedRowIds` input property to programmatically select rows on the grid component. [#39](https://github.com/blackbaud/skyux-grids/pull/39)

# 3.1.7 (2019-06-14)

- Fixed the grid component to gracefully ignore columns that no longer exist when the UI Config Service returns them. [#61](https://github.com/blackbaud/skyux-grids/pull/61)

# 3.1.6 (2019-05-28)

- Fixed the grid column component to properly support resizing on touch devices. [#57](https://github.com/blackbaud/skyux-grids/pull/57)

# 3.1.5 (2019-05-09)

- Fixed the grid component to no longer resize the table width when `selectedColumnIds` changes. [#54](https://github.com/blackbaud/skyux-grids/pull/54)

# 3.1.4 (2019-04-18)

- Fixed the grid module to properly provide `SkyAppWindowRef`. [#52](https://github.com/blackbaud/skyux-grids/pull/52)

# 3.1.3 (2019-03-07)

- Fixed the grid component to no longer emit extra `selectedColumnIdsChange` events. [#36](https://github.com/blackbaud/skyux-grids/pull/36)

# 3.1.2 (2019-02-28)

- Fixed the grid component to load properly when using RxJS version 6 or above. [#47](https://github.com/blackbaud/skyux-grids/pull/47)

# 3.1.1 (2019-02-22)

- Fixed the grid component to no longer truncate text when a table cell is stretched wider than its original width. [#38](https://github.com/blackbaud/skyux-grids/pull/38)

# 3.1.0 (2019-01-16)

- Added UI Config Service hooks to the grid component. [#31](https://github.com/blackbaud/skyux-grids/pull/31)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.6 (2019-01-04)

- Added the `rowHighlightedId` input to the grid component. [#28](https://github.com/blackbaud/skyux-grids/pull/28)

# 3.0.0-rc.5 (2018-12-21)

- Fixed the grid component to only listen to `mousemove` and `mouseup` events while resizing columns. [#25](https://github.com/blackbaud/skyux-grids/pull/25)

# 3.0.0-rc.4 (2018-12-13)

- Fixed the grid component to properly import polyfills. [#23](https://github.com/blackbaud/skyux-grids/pull/23)

# 3.0.0-rc.3 (2018-12-12)

- Added the multiselect feature to display a column of checkboxes on the grid component. [#6](https://github.com/blackbaud/skyux-grids/pull/6)

# 3.0.0-rc.2 (2018-11-20)

 - Added support for `@skyux/list-builder-common@3.0.0-rc.1`. [#14](https://github.com/blackbaud/skyux-grids/pull/14)
 - Fixed the grid component's column resize drag handle to not inadvertently trigger a column sort. [#17](https://github.com/blackbaud/skyux-grids/pull/17)
 - Fixed grid cells to properly handle text overflow when column widths are fixed. [#13](https://github.com/blackbaud/skyux-grids/pull/13)

# 3.0.0-rc.1 (2018-11-12)

- Added async column descriptions. [#6](https://github.com/blackbaud/skyux-grids/pull/6)
- Fixed column resizing to recalculate the table width when columns are hidden or shown. [#8](https://github.com/blackbaud/skyux-grids/pull/8)

# 3.0.0-rc.0 (2018-10-23)

- Initial release candidate.

# 3.0.0-alpha.1 (2018-10-22)

- Fixed column headers to no longer shift in size when sorting. [#4](https://github.com/blackbaud/skyux-grids/pull/4)

# 3.0.0-alpha.0 (2018-10-10)

- Initial alpha release.
