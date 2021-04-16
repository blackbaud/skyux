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
