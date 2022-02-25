**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

___
# 5.0.3 (2022-02-23)

- Fixed public exports to include all items that are publicly referenced by other public items. [#58](https://github.com/blackbaud/skyux-data-manager/pull/58)

# 5.0.2 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#56](https://github.com/blackbaud/skyux-data-manager/pull/56)

# 5.0.1 (2021-11-01)

- Updated the description for the `columnIds` input. [#54](https://github.com/blackbaud/skyux-data-manager/pull/54)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#35](https://github.com/blackbaud/skyux-data-manager/pull/35)

# 5.0.0-beta.7 (2021-09-29)

- Added bug fixes and features from the `master` branch. [#51](https://github.com/blackbaud/skyux-data-manager/pull/51)

# 4.2.3 (2021-09-29)

- Updated implementation examples for only showing selected items. [#49](https://github.com/blackbaud/skyux-data-manager/pull/49)

# 5.0.0-beta.6 (2021-09-16)

- Added bug fixes and features from the `master` branch. [#48](https://github.com/blackbaud/skyux-data-manager/pull/48)

# 4.2.2 (2021-09-16)

- Fixed the column selector button to be responsive on smaller screens. [#46](https://github.com/blackbaud/skyux-data-manager/pull/46)

# 5.0.0-beta.5 (2021-09-15)

- Updated peer dependencies. [#45](https://github.com/blackbaud/skyux-data-manager/pull/45)

# 5.0.0-beta.4 (2021-09-13)

- Updated peer dependencies. [#43](https://github.com/blackbaud/skyux-data-manager/pull/43)

# 5.0.0-beta.3 (2021-09-02)

- Migrated to Angular CLI. [#41](https://github.com/blackbaud/skyux-data-manager/pull/41)

# 4.2.1 (2021-07-16)

- Fixed the column selector to have proper spacing between the column's title and description. [#38](https://github.com/blackbaud/skyux-data-manager/pull/38)

# 5.0.0-beta.2 (2021-07-14)

- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#37](https://github.com/blackbaud/skyux-data-manager/pull/37)

# 5.0.0-beta.1 (2021-06-25)

- Added support for `@angular/core@^12`. [#35](https://github.com/blackbaud/skyux-data-manager/pull/35)

# 5.0.0-beta.0 (2021-06-24)

- Initial `5.0.0-beta` release.

# 4.2.0 (2021-05-28)

- Updated the data view state to track `columnIds` and added the ability to initially hide columns on views which include column options. [#33](https://github.com/blackbaud/skyux-data-manager/pull/33)

# 4.1.1 (2021-05-12)

- Fixed the column picker to disregard letter casing when searching for columns. [#30](https://github.com/blackbaud/skyux-data-manager/pull/30)

# 4.1.0 (2021-04-16)

- Updated the demo code to use `<sky-data-manager-toolbar-primary-item>` for the primary button. [#28](https://github.com/blackbaud/skyux-data-manager/pull/28)

# 4.0.2 (2021-01-28)

- Fixed the data manager toolbar component to only execute searches when users press "Enter" or select the search button. [#25](https://github.com/blackbaud/skyux-data-manager/pull/25)

# 4.0.1 (2021-01-19)

- Updated the `SkyDataManagerColumnPickerSortStrategy` export to be referenceable. [#22](https://github.com/blackbaud/skyux-data-manager/pull/22)

# 4.0.0 (2020-10-09)

- Added an option to disable column picker sorting to render column options in the order provided. [#12](https://github.com/blackbaud/skyux-data-manager/pull/12)
- Updated the data manager component to scroll to the top of the data view when the active view changes. [#15](https://github.com/blackbaud/skyux-data-manager/pull/15)
- Updated the data manager service to log a warning if `initDataManager` or `initDataView` are called after a data manager or view is initialized. [#14](https://github.com/blackbaud/skyux-data-manager/pull/14)
- Added a `getDataStateUpdates` option to only receive updates when provided properties change or when a provided comparator indicates changes. [#16](https://github.com/blackbaud/skyux-data-manager/pull/16)
- Added the `sky-data-manager-toolbar-primary-item>` component to allow rendering toolbar items before the standard toolbar actions. [#17](https://github.com/blackbaud/skyux-data-manager/pull/17)

# 4.0.0-rc.2 (2020-08-20)

- Updated the toolbar to pin it to the top of the page when the data manager is visible. [#10](https://github.com/blackbaud/skyux-data-manager/pull/10)
- Fixed sticky settings to only load the data state once. [#10](https://github.com/blackbaud/skyux-data-manager/pull/10)
- Updated `<sky-data-manager-toolbar-left-item>` and `<sky-data-manager-toolbar-left-right>` to use one element per item to render in the toolbar. [#10](https://github.com/blackbaud/skyux-data-manager/pull/10)

# 4.0.0-rc.1 (2020-08-03)

- Added code examples and improved documentation. [#3](https://github.com/blackbaud/skyux-data-manager/pull/3)

# 4.0.0-rc.0 (2020-07-24)

- Initial release candidate.
