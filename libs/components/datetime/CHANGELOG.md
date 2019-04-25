# 3.2.1 (2019-04-25)

- Fixed date range picker component to run validation after users select dates with date picker. [#34](https://github.com/blackbaud/skyux-datetime/pull/34)

# 3.2.0 (2019-04-12)

- Added date-range picker component. [#30](https://github.com/blackbaud/skyux-datetime/pull/30)
- Removed requirement for datepicker input directive to include reference to wrapping datepicker component. [#29](https://github.com/blackbaud/skyux-datetime/pull/29)
- Fixed datepicker input directive to properly set `dirty`, `touched`, and `invalid` states on control value accessor. [#29](https://github.com/blackbaud/skyux-datetime/pull/29)

# 3.1.0 (2019-03-04)

- Added `SkyDatePipe` to allow `SkyAppLocaleProvider` to provide preferred locale of Angular's underlying `DatePipe`. [#20](https://github.com/blackbaud/skyux-datetime/pull/20)

# 3.0.1 (2019-02-20)

- Fixed timepicker index barrel to include `SkyTimepickerTimeOutput` so it can be imported from package root. [#17](https://github.com/blackbaud/skyux-datetime/pull/17).

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.4 (2018-12-21)

- Fixed datepicker and timepicker components to properly transform provided values on initial load in reactive forms. [#7](https://github.com/blackbaud/skyux-datetime/issues/7).

# 3.0.0-rc.3 (2018-11-20)

- Fixed datepicker and timepicker components to allow disabled state in reactive forms. [#4](https://github.com/blackbaud/skyux-datetime/pull/4)

# 3.0.0-rc.2 (2018-11-09)

- Added support for `@skyux/i18n@3.3.0` to address some internationalization issues. [#5](https://github.com/blackbaud/skyux-datetime/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#2](https://github.com/blackbaud/skyux-datetime/pull/2)

# 3.0.0-rc.0 (2018-10-11)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-05)

- Initial alpha release.
