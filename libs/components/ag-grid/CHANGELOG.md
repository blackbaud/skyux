# 4.10.0  (2021-09-08)

- Added a validator option for cells. [#134](https://github.com/blackbaud/skyux-ag-grid/pull/134)

# 4.9.0 (2021-08-19)

- Added styles to support `agSelectCellEditor` in both default and modern themes. [#127](https://github.com/blackbaud/skyux-ag-grid/pull/127)
- Added visual regression coverage for `agSelectCellEditor` styles. [#129](https://github.com/blackbaud/skyux-ag-grid/pull/129)

# 4.8.3 (2021-07-13)

- Fixed the AG Grid wrapper to allow for the use of features added in AG Grid 24. [#123](https://github.com/blackbaud/skyux-ag-grid/pull/123)

# 4.8.2 (2021-07-09)

- Updated styles for AG Grid version 24+ in modern theme. [#121](https://github.com/blackbaud/skyux-ag-grid/pull/121)

# 4.8.1 (2021-06-23)

- For dark mode, fixed the line height style of multiline cells in read-only mode. [#118](https://github.com/blackbaud/skyux-ag-grid/pull/118)

# 4.8.0 (2021-06-16)

- Added support for the AG Grid options [`stopEditingWhenCellsLoseFocus`](https://www.ag-grid.com/angular-grid/grid-properties/#reference-editing) (AG Grid 25.2.0+) and `stopEditingWhenGridLosesFocus` with `SkyCellType.Date` columns. [#113](https://github.com/blackbaud/skyux-ag-grid/pull/113)

# 4.7.0 (2021-06-02)

- Added support for AG Grid version 25. [#111](https://github.com/blackbaud/skyux-ag-grid/pull/111)

# 4.6.1 (2021-04-15)

- Fixed column sorting when `sortOptions` is undefined. [#108](https://github.com/blackbaud/skyux-ag-grid/pull/108)

# 4.6.0 (2021-04-06)

- Fixed the line height style of multiline cells in read-only mode. [#105](https://github.com/blackbaud/skyux-ag-grid/pull/105)

# 4.5.2 (2021-02-19)

- Fixed the row delete directive to render on rows which use the `enableCellTextSelection` option in version 23 of AG Grid. [#101](https://github.com/blackbaud/skyux-ag-grid/pull/101)

# 4.5.1 (2021-02-11)

- Fixed the AG Grid wrapper to properly handle keyboard navigation while a master/detail grid is being used. [#98](https://github.com/blackbaud/skyux-ag-grid/pull/98)

# 4.5.0 (2021-01-26)

- Added the currency cell type. [#94](https://github.com/blackbaud/skyux-ag-grid/pull/94) (Thanks @[brianbianchi](https://github.com/brianbianchi)!)

# 4.4.0 (2020-12-16)
- Added the row delete directive to support showing inline deletes on grid rows. [#85](https://github.com/blackbaud/skyux-ag-grid/pull/85)

# 4.3.0 (2020-12-02)
- Added modern theme styling for data entry grid. [#83](https://github.com/blackbaud/skyux-ag-grid/pull/83)
- Updated the peer dependencies to support the latest versions of `ag-grid-angular` and `ag-grid-community`. [#90](https://github.com/blackbaud/skyux-ag-grid/pull/90)

# 4.2.0 (2020-08-21)

- Fixed the AG Grid wrapper component to stop scrolling to the top of the grid when it receives focus. [#72](https://github.com/blackbaud/skyux-ag-grid/pull/72)
- Updated the `skyAgGridDataManagerAdapter` directive to work with the new data manager API. [#73](https://github.com/blackbaud/skyux-ag-grid/pull/73)

# 4.1.1 (2020-07-29)

- Added a peer dependency on `@skyux/data-manager`. [#64](https://github.com/blackbaud/skyux-ag-grid/pull/64)

# 4.1.0 (2020-07-29)

- Added the `skyAgGridDataManagerAdapter` directive to handle interactions between the data entry grid component and the data manager component. [#59](https://github.com/blackbaud/skyux-ag-grid/pull/59)
- Added an example using the data entry grid component with the data manager component. [#61](https://github.com/blackbaud/skyux-ag-grid/pull/61)

# 4.0.2 (2020-06-22)

- Fixed the peer dependency versions of `ag-grid-angular` and `ag-grid-community` packages to `^23.2.0` to support `@angular/core@^9.1.9`. [#46](https://github.com/blackbaud/skyux-ag-grid/pull/46)

# 4.0.1 (2020-06-11)

- Removed the barrel export files to fix builds. [#43](https://github.com/blackbaud/skyux-ag-grid/pull/43)

# 4.0.0 (2020-06-09)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#38](https://github.com/blackbaud/skyux-ag-grid/pull/38)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#38](https://github.com/blackbaud/skyux-ag-grid/pull/38)

# 3.0.0-rc.9 (2020/06/08)

- Updated keyboard navigation to allow tabbing between cells when editing data. [#39](https://github.com/blackbaud/skyux-ag-grid/pull/39)

# 3.0.0-rc.8 (2020/05/28)

- Created the SKY UX AG Grid wrapper component to provide keyboard navigation and sticky column headers. [#35](https://github.com/blackbaud/skyux-ag-grid/pull/35)
- Fixed the row selector cell component to optionally initialize with row data. [#35](https://github.com/blackbaud/skyux-ag-grid/pull/35)

# 3.0.0-rc.7 (2020/03/23)

- Fixed rows to keep their selected state when scrolling out of view. [#29](https://github.com/blackbaud/skyux-ag-grid/pull/29)

# 3.0.0-rc.6 (2020/03/18)

- Fixed the keyboard navigation so that users can press Enter to save a cell and switch focus to the next cell in the column. [#20](https://github.com/blackbaud/skyux-ag-grid/pull/20)
- Fixed the date cell type to support valid date strings, improved demos with dynamic row height, and infinite scroll. [#22](https://github.com/blackbaud/skyux-ag-grid/pull/22)

# 3.0.0-rc.5 (2019/11/04)

- Added the cell editor text component to support editing text cells. [#17](https://github.com/blackbaud/skyux-ag-grid/pull/17)
- Fixed the cell border highlighting so it appears when cells are focused but not being edited. [#17](https://github.com/blackbaud/skyux-ag-grid/pull/17)
- Fixed the row height to account for the row border. [#17](https://github.com/blackbaud/skyux-ag-grid/pull/17)

# 3.0.0-rc.4 (2019/10/21)

- Added `getEditableGridOptions()` to the AG Grid service, added a demo using a modal, and fixed the number editor width. [#15](https://github.com/blackbaud/skyux-ag-grid/pull/15)

# 3.0.0-rc.3 (2019/10/16)

- Removed duplicate type declarations, exported types, and added a default SKY UX autocomplete sort comparator. [#13](https://github.com/blackbaud/skyux-ag-grid/pull/13)

# 3.0.0-rc.2 (2019/10/11)

- Fixed border, font, and hover styling issues. [#11](https://github.com/blackbaud/skyux-ag-grid/pull/11)
- Added an autocomplete `valueFormatter` function. [#11](https://github.com/blackbaud/skyux-ag-grid/pull/11)
- Added a namespace and types for passing SKY UX component properties to cell editors. [#11](https://github.com/blackbaud/skyux-ag-grid/pull/11)

# 3.0.0-rc.1 (2019/10/08)

- Added a custom build step to export `ag-grid-styles.scss` and fixed minor styling issues. [#9](https://github.com/blackbaud/skyux-ag-grid/pull/9)

# 3.0.0-rc.0 (2019/10/04)

- Added the AG Grid service and a stylesheet to create grids with default SKY UX styling and `gridOptions`. [#2](https://github.com/blackbaud/skyux-ag-grid/pull/2)
- Added the cell editor number component to support editing numeric cells. [#2](https://github.com/blackbaud/skyux-ag-grid/pull/2)
- Added the cell editor datepicker component to support editing date cells. [#2](https://github.com/blackbaud/skyux-ag-grid/pull/2)
- Added the cell renderer row selector component to support selecting multiple rows. [#2](https://github.com/blackbaud/skyux-ag-grid/pull/2)
- Added the cell editor autocomplete component to support autocomplete options when editing cells. [#7](https://github.com/blackbaud/skyux-ag-grid/pull/7)
