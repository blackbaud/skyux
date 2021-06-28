# 4.16.0 (2021-06-28)

- Added a callback to `addClick` to notify the component when a new item is added to the data source. [#195](https://github.com/blackbaud/skyux-lookup/pull/195)

# 4.15.0 (2021-06-15)

- Updated the lookup component to include a search button in the input field that opens the show more picker. [#183](https://github.com/blackbaud/skyux-lookup/pull/183)
- Updated the keyboard interactions for the lookup component's dropdown menu. [#176](https://github.com/blackbaud/skyux-lookup/pull/176)
- Fixed the lookup component to focus on the input field after the show more picker closes. [#193](https://github.com/blackbaud/skyux-lookup/pull/193)

# 4.14.1 (2021-06-04)

- Fixed the search component to display the correct "collapse" icon when expanded on a small screen. [#191](https://github.com/blackbaud/skyux-lookup/pull/191)

# 4.14.0 (2021-05-26)

- Updated the lookup component to collapse tokens if users select more than 5 items when the lookup menu includes the 'Show all/matches' button. [#186](https://github.com/blackbaud/skyux-lookup/pull/186)

# 4.13.1 (2021-05-19)

- Fixed the peer dependencies to list `@skyux/lists` as a dependency instead of `@skyux/list`. [#182](https://github.com/blackbaud/skyux-lookup/pull/182)

# 4.13.0 (2021-05-18)

- Added the ability to open a picker to show and select more results from the lookup component. [#179](https://github.com/blackbaud/skyux-lookup/pull/179)

# 4.12.1 (2021-05-14)

- Reverted the changes to the lookup component introduced in `4.12.1` to address a circular dependency with `@skyux/data-manager`. [#177](https://github.com/blackbaud/skyux-lookup/pull/177)

# 4.12.0 (2021-05-13)

**This version is incompatible with `@skyux/data-manager` and results in a compilation error. Upgrade to `4.12.1`.**
- Added the ability to open a picker to show and select more results from the lookup component. [#163](https://github.com/blackbaud/skyux-lookup/pull/163)

# 4.11.1 (2021-04-30)

- Fixed the lookup component to respond to changes in reactive form control values. [#169](https://github.com/blackbaud/skyux-lookup/pull/169)

# 4.11.0 (2021-04-27)

- Updated the search component to use the modern theme. [#166](https://github.com/blackbaud/skyux-lookup/pull/166)

# 4.10.0 (2021-03-17)

- Added the option of including an add button for the lookup component results dropdown. [#158](https://github.com/blackbaud/skyux-lookup/pull/158)

# 4.9.0 (2021-03-08)

- Added a single select mode to the lookup component. [#155](https://github.com/blackbaud/skyux-lookup/pull/155)

# 4.8.3 (2021-02-09)

- Fixed the autocomplete component to no longer show the dropdown when tab or arrow keys are pressed on the form input. [#156](https://github.com/blackbaud/skyux-lookup/pull/156)

# 4.8.2 (2020-12-11)

- Fixed the country field component to handle both uppercase and lowercase values for the `supportedCountryISOs` input. [#154](https://github.com/blackbaud/skyux-lookup/pull/154)

# 4.8.1 (2020-11-10)

- Fixed the country field test fixture to avoid exposing the DOM structure of the underlying component. [#148](https://github.com/blackbaud/skyux-lookup/pull/148)

# 4.8.0 (2020-11-05)

- Added a country field testing fixture. [#145](https://github.com/blackbaud/skyux-lookup/pull/145)

# 4.7.0 (2020-10-26)

- Added input box support to the lookup component. [#142](https://github.com/blackbaud/skyux-lookup/pull/142)

# 4.6.0 (2020-10-05)

- Added modern theme styles to the search component. [#134](https://github.com/blackbaud/skyux-lookup/pull/134)

# 4.5.0 (2020-09-18)

- Added input box support to the country field component. [#130](https://github.com/blackbaud/skyux-lookup/pull/130)

# 4.4.0 (2020-09-11)

- Added the `hideSelectedCountryFlag` input property to the country field component to hide the flag icon from the selected country input box. [#127](https://github.com/blackbaud/skyux-lookup/pull/127)
- Added the `includePhoneInfo` input property to the country field component to include phone information in the returned country and the country results dropdown. [#127](https://github.com/blackbaud/skyux-lookup/pull/127)
- Fixed the country field component to treat two country objects with the same `iso2` properties as equal. [#126](https://github.com/blackbaud/skyux-lookup/pull/126)


# 4.3.0 (2020-08-21)

- Added `autocompleteAttribute` to the autocomplete directive, lookup component, and country field component to set `autocomplete` attribute on form inputs. [#122](https://github.com/blackbaud/skyux-lookup/pull/122)
- Fixed autocomplete and lookup components to no longer throw an error when users click on a browser's autofill menu. [#122](https://github.com/blackbaud/skyux-lookup/pull/122)

# 4.2.1 (2020-08-03)

- Fixed the lookup component to properly initialize the input element in consumer unit tests. [#116](https://github.com/blackbaud/skyux-lookup/pull/116)

# 4.2.0 (2020-07-08)

- Added the ability to disable the autocomplete component. [#101](https://github.com/blackbaud/skyux-lookup/pull/101)
- Fixed the lookup component to properly style its disabled state. [#101](https://github.com/blackbaud/skyux-lookup/pull/101)


# 4.1.0 (2020-05-26)

- Added the `supportedCountryISOs` input property to the country field component to limit the countries returned. [#89](https://github.com/blackbaud/skyux-lookup/pull/89)
- Fixed the autocomplete directive to prevent the browser's autofill from appearing. [#94](https://github.com/blackbaud/skyux-lookup/pull/94)

# 3.6.0 (2020-05-21)

- Added the `supportedCountryISOs` input property to the country field component to limit the countries returned. [#89](https://github.com/blackbaud/skyux-lookup/pull/89)
- Fixed the autocomplete directive to prevent the browser's autofill from appearing. [#94](https://github.com/blackbaud/skyux-lookup/pull/94)

# 4.0.0 (2020-05-13)

### New features

- Added a test fixture for the search component to use in consumer unit tests. [#86](https://github.com/blackbaud/skyux-lookup/pull/86)
- Added support for `@angular/core@^9`. [#54](https://github.com/blackbaud/skyux-lookup/pull/54)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#54](https://github.com/blackbaud/skyux-lookup/pull/54)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#54](https://github.com/blackbaud/skyux-lookup/pull/54)

# 4.0.0-rc.4 (2020-05-11)

### Bug fixes

- Removed the `@types/intl-tel-input` package dependency because it caused compiler errors. [#88](https://github.com/blackbaud/skyux-lookup/pull/88)
- Fixed the country selector to properly display country flags. [#88](https://github.com/blackbaud/skyux-lookup/pull/88)

# 4.0.0-rc.3 (2020-04-30)

### New features

- Added a test fixture for the search component to be used in consumer unit tests. [#86](https://github.com/blackbaud/skyux-lookup/pull/86)

# 4.0.0-rc.2 (2020-04-23)

- Added bug fixes and features from the `master` branch. [#85](https://github.com/blackbaud/skyux-lookup/pull/85)

# 3.5.0 (2020-04-23)

- Added the ability to set the country field component's form value via an `iso2` country code. [#82](https://github.com/blackbaud/skyux-lookup/pull/82)

# 4.0.0-rc.1 (2020-04-16)

- Added bug fixes and features from the `master` branch. [#79](https://github.com/blackbaud/skyux-lookup/pull/79)

# 3.4.1 (2020-04-09)

- Fixed the **package.json** `peerDependencies` to require a minimum of `^@skyux/core@3.4.2`. [#76](https://github.com/blackbaud/skyux-lookup/pull/76) (Thanks [@jeffbdye](https://github.com/jeffbdye)!)

# 3.4.0 (2020-04-08)

- Updated the autocomplete and lookup components to implement the affix and overlay services. [#74](https://github.com/blackbaud/skyux-lookup/pull/74)

# 3.3.4 (2020-03-23)

- Fixed the country field component to properly handle the first value change on a reactive form when the initial value is undefined. [#71](https://github.com/blackbaud/skyux-lookup/pull/71)

# 3.3.3 (2020-03-18)

- Fixed the `package.json` file to list `intl-tel-input` as a dependency and not a peer dependency.

# 3.3.2 (2020-03-16)

- Fixed the autocomplete component to highlight results after removing search text and after only one character is supplied. [#65](https://github.com/blackbaud/skyux-lookup/pull/65)
- Fixed the country field component to always fire the `selectedCountryChange` event when a country is selected. [#63](https://github.com/blackbaud/skyux-lookup/pull/63)
- Fixed the lookup component to validate required values on template-driven forms. [#64](https://github.com/blackbaud/skyux-lookup/pull/64)
- Fixed the search component to remain inside its container. [#61](https://github.com/blackbaud/skyux-lookup/pull/61)

# 3.3.1 (2020-03-11)

- Fixed the country field component to eliminate extra space below the component. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)
- Fixed the country field component to recognize when it is placed within the phone field component. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)
- Fixed the country field component to properly remove the flag from the input element when the form's value is cleared. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)

# 3.3.0 (2020-03-10)

- Added the country field component. [#55](https://github.com/blackbaud/skyux-lookup/pull/55)

# 4.0.0-rc.0 (2020-02-21)

### New features

- Added support for `@angular/core@^9`. [#54](https://github.com/blackbaud/skyux-lookup/pull/54)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#54](https://github.com/blackbaud/skyux-lookup/pull/54)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#54](https://github.com/blackbaud/skyux-lookup/pull/54)

# 3.2.1 (2020-02-13)

- Fixed the autocomplete component to use the `Renderer2` service instead of the deprecated `Renderer` service. [#50](https://github.com/blackbaud/skyux-lookup/pull/50)

# 3.2.0 (2019-11-21)

- Added a "No results found" message to the autocomplete component for empty search responses. [#47](https://github.com/blackbaud/skyux-lookup/pull/47) (Thanks [@blackbaud-GavinNicol](https://github.com/blackbaud-GavinNicol)!)

# 3.1.2 (2019-11-11)

- Fixed the lookup component to properly represent the Angular form status `touched`. [#44](https://github.com/blackbaud/skyux-lookup/pull/44)

# 3.1.1 (2019-06-26)

- Fixed the search component to handle searches with no applied value. [#34](https://github.com/blackbaud/skyux-lookup/pull/34)

# 3.1.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#21](https://github.com/blackbaud/skyux-lookup/pull/21)
- Fixed the search component to trim whitespace when search text is entered. [#31](https://github.com/blackbaud/skyux-lookup/pull/31) (Thanks @Blackbaud-JackMcElhinney)

# 3.0.3 (2019-05-28)

- Fixed the search component to use the correct visual styles when focused. [#27](https://github.com/blackbaud/skyux-lookup/pull/27)

# 3.0.2 (2019-05-17)

- Fixed the autocomplete component to emit a `selectionChange` event when the input is cleared. [#22](https://github.com/blackbaud/skyux-lookup/issues/22)
- Fixed the autocomplete component to properly represent Angular form control statuses (dirty, pristine, etc.). [#20](https://github.com/blackbaud/skyux-lookup/issues/20)

# 3.0.1 (2019-02-11)

- Removed a reference to the deprecated `AnimationTransitionEvent` in favor of `AnimationEvent`. This allows the library to compile against later versions of Angular that have removed the deprecated type. [#13](https://github.com/blackbaud/skyux-lookup/pull/13)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#9](https://github.com/blackbaud/skyux-lookup/pull/9)

# 3.0.0-rc.4 (2018-11-14)

- Added the `debounceTime` input to the autocomplete component. [#8](https://github.com/blackbaud/skyux-lookup/pull/8)

# 3.0.0-rc.3 (2018-11-12)

- Fixed the autocomplete component to properly position the dropdown when inside a vertical tab form. [#2](https://github.com/blackbaud/skyux-lookup/pull/2)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-lookup/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-lookup/pull/3)

# 3.0.0-rc.0 (2018-10-09)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
