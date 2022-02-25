**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.1.4 (2021-02-22)

- Fixed the library's peer dependencies to include `@skyux/popovers`. [#307](https://github.com/blackbaud/skyux-datetime/pull/307)

# 5.1.3 (2021-02-14)

- Fixed the `SkyDateRangeCalculator` to be publicly exported. [#305](https://github.com/blackbaud/skyux-datetime/pull/305)

# 5.1.2 (2021-12-08)

- Added support for Prettier code formatting. [#304](https://github.com/blackbaud/skyux-datetime/pull/304)

# 5.1.1 (2021-12-08)

- Fixed the datepicker component to allow the removal of custom dates when the `customDates` argument is `undefined`. [#301](https://github.com/blackbaud/skyux-datetime/pull/301)

# 5.1.0 (2021-12-06)

- Added the `calendarDateRangeChange` event to the datepicker component to allow consumers to listen for changes to the calendar and push back `customDates` that show key dates or disabled dates in the datepicker's calendar. [#297](https://github.com/blackbaud/skyux-datetime/pull/297)

# 5.0.3 (2021-12-02)

- Moved `SkyDateRangeService` to be provided in `SkyDateRangePickerModule` so the same instance of the service is shared between the datepicker component and the consuming module. [#296](https://github.com/blackbaud/skyux-datetime/pull/296)

# 5.0.2 (2021-11-19)

- Updated the builder to support StackBlitz. [#294](https://github.com/blackbaud/skyux-datetime/pull/294)

# 5.0.1 (2021-11-02)

- Fixed the date range picker component to properly display resource strings. [#291](https://github.com/blackbaud/skyux-datetime/pull/291)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#278](https://github.com/blackbaud/skyux-datetime/pull/278)

# 5.0.0-beta.5 (2021-09-23)

- Fixed the datepicker directive and fuzzy datepicker directive to allow for undefined component references when strict mode is enabled. [#284](https://github.com/blackbaud/skyux-datetime/pull/284)

# 5.0.0-beta.4 (2021-09-10)

- Updated peer dependencies. [#282](https://github.com/blackbaud/skyux-datetime/pull/282)

# 5.0.0-beta.3 (2021-09-10)

- Updated peer dependencies. [#280](https://github.com/blackbaud/skyux-datetime/pull/280)
- Enabled Ivy's "partial" compilation mode. [#280](https://github.com/blackbaud/skyux-datetime/pull/280)

# 5.0.0-beta.2 (2021-09-01)

- Migrated to Angular CLI. [#278](https://github.com/blackbaud/skyux-datetime/pull/278)

# 5.0.0-beta.1 (2021-08-18)

- Added bug fixes and features from the `master` branch. [#277](https://github.com/blackbaud/skyux-datetime/pull/277)

# 4.12.2 (2021-08-18)

- Fixed performance issues with the datepicker and timepicker components. [#275](https://github.com/blackbaud/skyux-datetime/pull/275)

# 4.12.1 (2021-07-30)

- Fixed the fuzzy datepicker component to properly format dates based on the given date format. [#270](https://github.com/blackbaud/skyux-datetime/pull/270)

# 5.0.0-beta.0 (2021-07-08)

- Initial beta release.
- Added support for `@angular/core@^12`. [#269](https://github.com/blackbaud/skyux-datetime/pull/269)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#269](https://github.com/blackbaud/skyux-datetime/pull/269)
- Fixed `SkyDateRangeService`, `SkyFuzzyDateService`, and `SkyDatepickerConfigService` to work within lazy-loaded feature modules. [#263](https://github.com/blackbaud/skyux-datetime/pull/263)

# 4.12.0 (2021-06-15)

- Added an optional `pickerClass` input for the datepicker component. [#264](https://github.com/blackbaud/skyux-datetime/pull/264)

# 4.11.1 (2021-05-21)

- Fixed the date range picker to disable the inner form controls when consumers use reactive form controls during initialization and when they use the `disabled` input. [#261](https://github.com/blackbaud/skyux-datetime/pull/261)

# 4.11.0 (2021-04-23)

- Added the `startDateRequired` and `endDateRequired` inputs to the date range picker component. [#257](https://github.com/blackbaud/skyux-datetime/pull/257)
- Fixed the timepicker component to use primary button styles. [#259](https://github.com/blackbaud/skyux-datetime/pull/259)

# 4.10.2 (2021-03-19)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#251](https://github.com/blackbaud/skyux-datetime/pull/251)

# 4.10.1 (2021-03-15)

- Fixed the timepicker component so that it initializes the control value during the lifecycle hook. [#253](https://github.com/blackbaud/skyux-datetime/pull/253)

# 4.10.0 (2021-03-15)

- Added a default placeholder to the datepicker component that shows the current date format. [#252](https://github.com/blackbaud/skyux-datetime/pull/252)

# 4.9.0 (2021-02-16)

- Added the ability to trigger responsive styles based on a parent component. [#248](https://github.com/blackbaud/skyux-datetime/pull/248)

# 4.8.0 (2021-01-19)

- Added modern theme styles to the date range picker component. [#246](https://github.com/blackbaud/skyux-datetime/pull/246)

# 4.7.0 (2020-10-22)

- Added resource files for `en_AU`, `en_GB`, and `en_NZ`. [#240](https://github.com/blackbaud/skyux-datetime/pull/240) (Thanks [@Blackbaud-ScottZetrouer](https://github.com/Blackbaud-ScottZetrouer)!)

# 4.6.0 (2020-10-16)

- Updated the datepicker component's calendar button sizes for the modern theme. [#235](https://github.com/blackbaud/skyux-datetime/pull/235)

# 4.5.2 (2020-09-28)

- Fixed the datepicker component to handle ISO date strings that contain milliseconds. [#229](https://github.com/blackbaud/skyux-datetime/pull/229)

# 4.5.1 (2020-09-03)

- Fixed the timepicker component to handle non-keyboard events that pass through the keydown handler. [#219](https://github.com/blackbaud/skyux-datetime/pull/219)

# 4.5.0 (2020-08-27)

- Added modern theme styles to the timepicker component. [#215](https://github.com/blackbaud/skyux-datetime/pull/215)

# 4.4.0 (2020-08-21)

- Added modern theme styles to the datepicker component. [#211](https://github.com/blackbaud/skyux-datetime/pull/211)

# 4.3.0 (2020-08-20)

- Added a test fixture for the timepicker component to use in consumer unit tests (import from `@skyux/datetime/testing`). [#196](https://github.com/blackbaud/skyux-datetime/pull/196)

# 4.2.1 (2020-08-12)

- Fixed the date range component to allow the component to be disabled when initialized. [#207](https://github.com/blackbaud/skyux-datetime/pull/207) (Thanks [@d4nleonard](https://github.com/d4nleonard)!)

# 4.2.0 (2020-08-12)

- Added the `SkyDatepickerConfigService` to the public exports. [#205](https://github.com/blackbaud/skyux-datetime/pull/205)

# 4.1.3 (2020-07-17)

- Fixed the datepicker component to assign a date value after the component has rendered. [#193](https://github.com/blackbaud/skyux-datetime/pull/193) (Thanks [@Blackbaud-ScottFreeman](https://github.com/Blackbaud-ScottFreeman)!)

# 4.1.2 (2020-07-16)

- Fixed the date pipe to allow all data types. [#186](https://github.com/blackbaud/skyux-datetime/pull/186) (Thanks [@Blackbaud-NickGlyder](https://github.com/Blackbaud-NickGlyder)!)

# 4.1.1 (2020-07-07)

- Fixed an issue where the fuzzy date pipe returned incorrect data when the day value was 31. [#181](https://github.com/blackbaud/skyux-datetime/pull/181) (Thanks [@Blackbaud-CoreyArcher](https://github.com/Blackbaud-CoreyArcher)!)

# 4.1.0 (2020-06-16)

- Added input box support to the datepicker component. [#166](https://github.com/blackbaud/skyux-datetime/pull/166)

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

- Added the `strict` property to the datepicker input directive to indicate whether the format of the date value must match the format from the `dateFormat` value. [#114](https://github.com/blackbaud/skyux-datetime/pull/114)

# 3.7.1 (2020-02-04)

- Fixed the fuzzy date service's `getMomentFromFuzzyDate` function to properly support fuzzy dates when `month` is `0`. [#112](https://github.com/blackbaud/skyux-datetime/pull/112) (Thanks [@Blackbaud-JeffreyAaron](https://github.com/Blackbaud-JeffreyAaron)!)

# 3.7.0 (2019-01-27)

- Added the fuzzy date pipe. [#102](https://github.com/blackbaud/skyux-datetime/pull/102)

# 3.6.4 (2019-11-22)

- Fixed the datepicker input directive to validate on blur and to properly handle required validation. [#96](https://github.com/blackbaud/skyux-datetime/pull/96)

# 3.6.3 (2019-10-21)

- Fixed the `disabled` property on the datepicker and timepicker inputs for reactive forms. [#91](https://github.com/blackbaud/skyux-datetime/pull/91)

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
