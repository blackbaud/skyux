# 4.0.5 (2020-08-19)

- Fixed the grid component to render grid column components which utilize an inline template. [#154](https://github.com/blackbaud/skyux-grids/pull/154)

# 4.0.4 (2020-08-18)

- Fixed the grid component to support moving columns by dragging the header text. [#150](https://github.com/blackbaud/skyux-grids/pull/150)
- Fixed the grid component to suport dynamically changing the available columns after the `selectedColumnIds` input is set. [#151](https://github.com/blackbaud/skyux-grids/pull/151)

# 4.0.3 (2020-08-11)

- Fixed the grid component to prevent columns from hiding header text at small column widths. [#147](https://github.com/blackbaud/skyux-grids/pull/147)

# 4.0.2 (2020-08-03)

- Fixed the grid component to emit the `selectedColumnIdsChange` event the first time columns are reordered. [#142](https://github.com/blackbaud/skyux-grids/pull/142)

# 4.0.1 (2020-05-20)

- Fixed the grid component to support columns with no headers. [#125](https://github.com/blackbaud/skyux-grids/pull/125)
- Fixed the grid component to prevent rows from vertically collapsing when there is no content. [#124](https://github.com/blackbaud/skyux-grids/pull/124)

# 3.8.1 (2020-05-20)

- Fixed the grid component to support columns with no headers. [#125](https://github.com/blackbaud/skyux-grids/pull/125)
- Fixed the grid component to prevent rows from vertically collapsing when there is no content. [#124](https://github.com/blackbaud/skyux-grids/pull/124)

# 4.0.0 (2020-05-15)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#109](https://github.com/blackbaud/skyux-grids/pull/109)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#109](https://github.com/blackbaud/skyux-grids/pull/109)

# 3.8.0 (2020-05-11)

- Added the ability to align the contents and header of a grid column. [#114](https://github.com/blackbaud/skyux-grids/pull/114)

# 4.0.0-rc.3 (2020-05-06)

- Added bug fixes and features from the `master` branch. [#118](https://github.com/blackbaud/skyux-grids/pull/118)

# 3.7.0 (2020-05-01)

- Updated the visual styles of the column resize indicator. [#116](https://github.com/blackbaud/skyux-grids/pull/116)
- Removed the dependency `moment`. [#116](https://github.com/blackbaud/skyux-grids/pull/116)

# 4.0.0-rc.2 (2020-04-15)

- Added `SkyGridColumnComponent` and `SkyGridComponent` to exports API (for internal use only).

# 4.0.0-rc.1 (2020-04-15)

- Added `SkyGridColumnModel` to the exports API.

# 4.0.0-rc.0 (2020-04-10)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#109](https://github.com/blackbaud/skyux-grids/pull/109)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#109](https://github.com/blackbaud/skyux-grids/pull/109)

# 3.6.0 (2020-03-23)

- Added the ability to delete rows in the grid component. [#98](https://github.com/blackbaud/skyux-grids/pull/98)

# 3.5.3 (2020-03-11)

- Fixed the grid component to properly display the top scroll bar when the grid's columns or data changes. [#105](https://github.com/blackbaud/skyux-grids/pull/105)

# 3.5.2 (2020-02-13)

- Fixed the grid component to handle scroll events when the top scroll bar fails to render. [#100](https://github.com/blackbaud/skyux-grids/pull/100)
- Fixed the grid component to properly display the top scroll bar as needed when windows are resized. [#101](https://github.com/blackbaud/skyux-grids/pull/101)

# 3.5.1 (2020-02-10)

- Fixed the grid component to properly watch for undefined columns when getting a column's visual styles. [#96](https://github.com/blackbaud/skyux-grids/pull/96)

# 3.5.0 (2020-02-03)

- Added a horizontal scroll bar to the top of the grid component. [#87](https://github.com/blackbaud/skyux-grids/pull/87)

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
