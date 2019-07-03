# 3.3.0 (2019-07-03)

- Added support for `@skyux-sdk/builder@3.7.1`. [#63](https://github.com/blackbaud/skyux-datetime/pull/63)
- Fixed `SkyDatePipe` to work as an `Injectable`. [#66](https://github.com/blackbaud/skyux-datetime/pull/66)

# 3.2.6 (2019-06-07)

- Fixed `SkyDatePipeModule` to properly provide `SkyDatePipe` and to import the `SkyDateTimeResourcesModule`. [#58](https://github.com/blackbaud/skyux-datetime/pull/58)

# 3.2.5 (2019-05-28)

- Fixed the datepicker and timepicker components to use the correct active button visual styles. [#52](https://github.com/blackbaud/skyux-datetime/pull/52)

# 3.2.4 (2019-05-17)

- Fixed the date range picker component to not resize based on the selected calculator. [#46](https://github.com/blackbaud/skyux-datetime/pull/46)
- Fixed the datepicker input directive to allow it to be conditionally placed inside modals. [#50](https://github.com/blackbaud/skyux-datetime/pull/50)

# 3.2.3 (2019-05-03)

- Fixed the date range picker component to properly represent Angular form control statuses (`dirty`, `pristine`, etc.). [#44](https://github.com/blackbaud/skyux-datetime/pull/44)
- Fixed the date range picker component to properly use default calculators when the `calculatorIds` value is set to falsy. [#43](https://github.com/blackbaud/skyux-datetime/pull/43)
- Fixed the datepicker calendar component to default to Sunday as the starting day. [#41](https://github.com/blackbaud/skyux-datetime/pull/41)

# 3.2.2 (2019-04-30)

- Fixed `SkyDatePipe` to include proper locale data when used with Angular version 5 and higher. [#36](https://github.com/blackbaud/skyux-datetime/pull/36)

# 3.2.1 (2019-04-25)

- Fixed the date range picker component to run validation after users select dates with the datepicker. [#34](https://github.com/blackbaud/skyux-datetime/pull/34)

# 3.2.0 (2019-04-12)

- Added the date range picker component. [#30](https://github.com/blackbaud/skyux-datetime/pull/30)
- Removed the requirement for the datepicker input directive to include a reference to the wrapping datepicker component. [#29](https://github.com/blackbaud/skyux-datetime/pull/29)
- Fixed the datepicker input directive to properly set the `dirty`, `touched`, and `invalid` states on the control value accessor. [#29](https://github.com/blackbaud/skyux-datetime/pull/29)

# 3.1.0 (2019-03-04)

- Added `SkyDatePipe` to allow `SkyAppLocaleProvider` to provide the preferred locale of Angular's underlying `DatePipe`. [#20](https://github.com/blackbaud/skyux-datetime/pull/20)

# 3.0.1 (2019-02-20)

- Fixed the timepicker index barrel to include `SkyTimepickerTimeOutput` so that it can be imported from the package root. [#17](https://github.com/blackbaud/skyux-datetime/pull/17).

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.4 (2018-12-21)

- Fixed the datepicker and timepicker components to properly transform provided values on the initial load in reactive forms. [#7](https://github.com/blackbaud/skyux-datetime/issues/7).

# 3.0.0-rc.3 (2018-11-20)

- Fixed the datepicker and timepicker components to allow the disabled state in reactive forms. [#4](https://github.com/blackbaud/skyux-datetime/pull/4)

# 3.0.0-rc.2 (2018-11-09)

- Added support for `@skyux/i18n@3.3.0` to address some internationalization issues. [#5](https://github.com/blackbaud/skyux-datetime/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#2](https://github.com/blackbaud/skyux-datetime/pull/2)

# 3.0.0-rc.0 (2018-10-11)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-05)

- Initial alpha release.
