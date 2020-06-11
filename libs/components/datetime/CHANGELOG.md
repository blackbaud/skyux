# 4.0.1 (2020-06-11)

- Fixed the datepicker and timepicker components to properly render in Chrome 83. [#163](https://github.com/blackbaud/skyux-datetime/pull/163)
- Updated the default `aria-label` property for the datepicker and timepicker components to improve the experience when using assistive technology. [#162](https://github.com/blackbaud/skyux-datetime/pull/162)

# 4.0.0 (2020-05-15)

### New features

- Added a test fixture for the datepicker component to use in consumer unit tests. [#155](https://github.com/blackbaud/skyux-datetime/pull/155)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#150](https://github.com/blackbaud/skyux-datetime/pull/150)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#150](https://github.com/blackbaud/skyux-datetime/pull/150)

# 4.0.0-rc.2 (2020-05-06)

### New features

- Added a test fixture for the datepicker component to use in consumer unit tests. [#155](https://github.com/blackbaud/skyux-datetime/pull/155)

# 3.11.0 (2020-05-05)

- Added `moment` as a dependency. [#153](https://github.com/blackbaud/skyux-datetime/pull/153)

# 4.0.0-rc-1 (2020-05-01)

- Removed a deep import from `moment/min/locales.min`. [#152](https://github.com/blackbaud/skyux-datetime/pull/152)
- Upgraded the package dependencies. [#152](https://github.com/blackbaud/skyux-datetime/pull/152)

# 4.0.0-rc.0 (2020-04-30)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#150](https://github.com/blackbaud/skyux-datetime/pull/150)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#150](https://github.com/blackbaud/skyux-datetime/pull/150)

# 3.10.0 (2020-04-30)

- Updated the datepicker, date range picker, timepicker, and fuzzy datepicker components to implement the affix and overlay services. [#140](https://github.com/blackbaud/skyux-datetime/pull/140)
- Updated the datepicker, date range picker, and fuzzy datepicker components to respect locale overrides on the `SkyAppLocaleProvider`. [#144](https://github.com/blackbaud/skyux-datetime/pull/144)

# 3.9.0 (2020-03-24)

- Fixed the datepicker component to prevent an error when invalid numeric dates are entered. [#127](https://github.com/blackbaud/skyux-datetime/pull/127)
- Fixed the fuzzy datepicker component to prevent it from clearing invalid dates from the field when the datepicker loses focus. [#122](https://github.com/blackbaud/skyux-datetime/pull/122)
- Fixed the date pipe to format ISO8061 date strings consistently across different browsers. [#128](https://github.com/blackbaud/skyux-datetime/issues/128)
- Updated the fuzzy date pipe to use a browser locale's short date format as the default format. [#125](https://github.com/blackbaud/skyux-datetime/pull/125)

# 3.8.0 (2020-02-20)

- Added the `strict` property to the datepicker input directive to indicate whether the format of the date value must match the format from the `dateFormat` value.  [#114](https://github.com/blackbaud/skyux-datetime/pull/114)

# 3.7.1 (2020-02-04)

- Fixed the fuzzy date service's `getMomentFromFuzzyDate` function to properly support fuzzy dates when `month` is `0`. [#112](https://github.com/blackbaud/skyux-datetime/pull/112) (Thanks [@Blackbaud-JeffreyAaron](https://github.com/Blackbaud-JeffreyAaron)!)

# 3.7.0 (2019-01-27)

- Added the fuzzy date pipe. [#102](https://github.com/blackbaud/skyux-datetime/pull/102)

# 3.6.4 (2019-11-22)

- Fixed the datepicker input directive to validate on blur and to properly handle required validation. [#96](https://github.com/blackbaud/skyux-datetime/pull/96)

# 3.6.3 (2019-10-21)

- Fixed the `disabled` property on the datepicker and timepicker inputs for reactive forms.  [#91](https://github.com/blackbaud/skyux-datetime/pull/91)

# 3.6.2 (2019-10-01)

- Fixed the datepicker input directive to no longer convert invalid input values into Date objects. [#76](https://github.com/blackbaud/skyux-datetime/pull/76)

# 3.6.1 (2019-09-24)

- Fixed `moment` imports to support backwards compatibility with SKY UX 2 single-page applications. [#85](https://github.com/blackbaud/skyux-datetime/pull/85)

# 3.6.0 (2019-09-18)

- Added the fuzzy datepicker directive. [#79](https://github.com/blackbaud/skyux-datetime/pull/79)

# 3.5.0 (2019-08-23)

- Added the public internal properties `buttonIsFocused`, `calendarIsFocused`, and `calendarIsVisible` to `SkyDatepickerComponent` to indicate the focus and visibility states of datepicker elements. Added the public internal property `inputIsFocused` to `SkyDatepickerInputDirective` to indicate the focus state of the datepicker input. [#77](https://github.com/blackbaud/skyux-datetime/pull/77)

# 3.4.0 (2019-07-26)

- Added the public method `detectInputValueChange()` to `SkyDatepickerInputDirective`, which manually updates the model value based on the text value of the input field. [#72](https://github.com/blackbaud/skyux-datetime/pull/72)

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
