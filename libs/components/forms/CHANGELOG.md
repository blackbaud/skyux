# 4.16.4 (2021-04-16)

- Updated the radio group component to mark it as touched after its radio buttons lose focus. [#257](https://github.com/blackbaud/skyux-forms/pull/257)

# 4.16.3 (2021-04-14)

- Fixed the selection box component to have a responsive layout at smaller screen sizes. [#255](https://github.com/blackbaud/skyux-forms/pull/255)

# 4.16.2 (2021-04-12)

- Fixed the input box to work properly when a theme is not specified. [#220](https://github.com/blackbaud/skyux-theme/pull/220)

# 4.16.1 (2021-03-31)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#240](https://github.com/blackbaud/skyux-forms/pull/240)

# 4.16.0 (2021-03-25)

- Added the selection box component. [#232](https://github.com/blackbaud/skyux-forms/pull/232)

# 4.15.2 (2021-03-12)

- Fixed the file item component so that file titles do not extend outside of the component. [#239](https://github.com/blackbaud/skyux-forms/pull/239)

# 4.15.1 (2021-02-16)

- Fixed the single file attachment component to utilize the correct modern theme styles. [#237](https://github.com/blackbaud/skyux-forms/pull/237)

# 4.15.0 (2021-01-15)
- Added a test fixture for the radio button component to use in consumer unit tests. [#182](https://github.com/blackbaud/skyux-forms/pull/182)

# 4.14.0 (2020-12-02)

- Added modern theme styles to the single file attachment component. [#225](https://github.com/blackbaud/skyux-forms/pull/225)
- Fixed the input box component to properly handle the focused state within other components. [#227](https://github.com/blackbaud/skyux-forms/pull/227)

# 4.13.4 (2020-10-29)

- Fixed the single file attachment component to use ARIA labels consistently.  [#223](https://github.com/blackbaud/skyux-forms/pull/223)

# 4.13.3 (2020-10-23)

- Fixed the vertical position of the input box label in the modern theme. [#218](https://github.com/blackbaud/skyux-forms/pull/218)

# 4.13.2 (2020-10-01)

- Fixed a bug where an input box inset button would wrap if the input box was too narrow. [#211](https://github.com/blackbaud/skyux-forms/pull/211)

# 4.13.1 (2020-09-29)

- Fixed an error when programmatically setting focus to a form control inside an input box. [#208](https://github.com/blackbaud/skyux-forms/pull/208)

# 4.13.0 (2020-09-25)

- Made `SkyThemeService` an optional depependency of the input box component. [#203](https://github.com/blackbaud/skyux-forms/pull/203)
- Added inset button support to the input box component. [#204](https://github.com/blackbaud/skyux-forms/pull/204)

# 4.12.0 (2020-09-22)

- Added character count component support to the input box component. [#201](https://github.com/blackbaud/skyux-forms/pull/201)

# 4.11.0 (2020-09-15)

- Updated the input box component to support additional SKY UX components. [#195](https://github.com/blackbaud/skyux-forms/pull/195)

# 4.10.0 (2020-09-04)

- Added support for setting custom `aria-label` properties on the file attachment component. [#187](https://github.com/blackbaud/skyux-forms/pull/187)

# 4.9.1 (2020-09-03)

- Fixed radio button and checkbox colors in the modern theme. [#181](https://github.com/blackbaud/skyux-forms/pull/181)

# 4.9.0 (2020-08-27)

- Added support for using the input box component without specifying a label. [#178](https://github.com/blackbaud/skyux-forms/pull/178)

# 4.8.0 (2020-08-24)

- Added modern theme styles to radio buttons and checkboxes. [#173](https://github.com/blackbaud/skyux-forms/pull/173)

# 4.7.1 (2020-08-20)

- Fixed an issue where the input box component displayed as invalid when the field was untouched. [#171](https://github.com/blackbaud/skyux-forms/pull/171)

# 4.7.0 (2020-08-06)

- Added the `skyAutofill` directive. [#157](https://github.com/blackbaud/skyux-forms/pull/157)

# 4.6.0 (2020-07-21)

- Added `select` element support to the input box component. [#152](https://github.com/blackbaud/skyux-forms/pull/152)

# 4.5.0 (2020-06-25)

- Removed the bottom margin from the input box component in the modern theme. To stack input box components, specify the appropriate `sky-margin` CSS class on the `sky-input-box` element. [#137](https://github.com/blackbaud/skyux-forms/pull/137)
- Added styles for the input box component's active, focused, and hover states. [#139](https://github.com/blackbaud/skyux-forms/pull/139)

# 4.4.0 (2020-06-12)

- Added the `disabled` property to the input box component. [#130](https://github.com/blackbaud/skyux-forms/pull/130)

# 4.3.0 (2020-06-11)

- Adjusted the input box component's proportions for the modern theme. [#127](https://github.com/blackbaud/skyux-forms/pull/127)

# 4.2.0 (2020-06-08)

- Added an event listener for when the link text box is blurred within the file drop component. [#122](https://github.com/blackbaud/skyux-forms/pull/122)
- Updated the input box component to support the intended DOM structure of input group buttons. [#125](https://github.com/blackbaud/skyux-forms/pull/125)

# 4.1.0 (2020-06-01)

- Added the input box component to support the modern theme form field design. [#121](https://github.com/blackbaud/skyux-forms/pull/121)

# 4.0.0 (2020-05-13)

### New features

- Added a test fixture for the checkbox component to use in consumer unit tests. [#115](https://github.com/blackbaud/skyux-forms/pull/115)
- Added support for `@angular/core@^9`. [#102](https://github.com/blackbaud/skyux-forms/pull/102)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#102](https://github.com/blackbaud/skyux-forms/pull/102)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#102](https://github.com/blackbaud/skyux-forms/pull/102)

# 4.0.0-rc.1 (2020-05-07)

- Upgraded the development dependencies. [#115](https://github.com/blackbaud/skyux-forms/pull/115)
- Added bug fixes and features from the `master` branch. [#115](https://github.com/blackbaud/skyux-forms/pull/115)

# 4.0.0-rc.0 (2020-02-19)

### New features

- Added support for `@angular/core@^9`. [#102](https://github.com/blackbaud/skyux-forms/pull/102)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#102](https://github.com/blackbaud/skyux-forms/pull/102)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#102](https://github.com/blackbaud/skyux-forms/pull/102)

# 3.6.3 (2020-02-12)

- Fixed an Angular compiler template checking error on the file attachment component's HTML template. [#100](https://github.com/blackbaud/skyux-forms/pull/100)

# 3.6.2 (2020-01-23)

- Fixed the character count directive to not affect the underlying control value. [#95](https://github.com/blackbaud/skyux-forms/pull/95)
- Updated the single file attachment component to use resource strings. [#93](https://github.com/blackbaud/skyux-forms/pull/93)

# 3.6.1 (2020-01-09)

- Fixed the file drop component to enable users to drag and drop multiple files. [#92](https://github.com/blackbaud/skyux-forms/pull/92)

# 3.6.0 (2019-11-22)

- Added the `disabled` property to the radio group component. [#82](https://github.com/blackbaud/skyux-forms/pull/82)
- Fixed the checkbox component so that it can be added dynamically with an `ngIf`. [#85](https://github.com/blackbaud/skyux-forms/pull/85)

# 3.5.0 (2019-11-20)

- Added the `disabled` property to the single file attachment component. [#81](https://github.com/blackbaud/skyux-forms/pull/81)
- Added the `required` property to the single file attachment component. [#78](https://github.com/blackbaud/skyux-forms/pull/78)
- Added the `required` property to the radio group component. [#79](https://github.com/blackbaud/skyux-forms/pull/79)
- Added the `required` property to the checkbox component. [#77](https://github.com/blackbaud/skyux-forms/pull/77)

# 3.4.2 (2019-10-22)

- Fixed the "Choose file" and "Replace file" labels for the single file attachment component. [#72](https://github.com/blackbaud/skyux-forms/pull/72)

# 3.4.1 (2019-10-03)

- Fixed the radio group component to reset the model value when radio components are added dynamically. [#67](https://github.com/blackbaud/skyux-forms/pull/67)
- Fixed the styling for the character count indicator component. [#69](https://github.com/blackbaud/skyux-forms/pull/69)

# 3.4.0 (2019-09-24)

- Added the single file attachment component. [#60](https://github.com/blackbaud/skyux-forms/pull/60)
- Added the character count component. [#61](https://github.com/blackbaud/skyux-forms/pull/61)
- Added a CONTRIBUTING.md file. [#64](https://github.com/blackbaud/skyux-forms/pull/64)
- Fixed the file item component's trash icon. [#62](https://github.com/blackbaud/skyux-forms/pull/62)

# 3.3.0 (2019-07-25)

- Added the toggle switch component. [#54](https://github.com/blackbaud/skyux-forms/pull/54) (Thanks @[Blackbaud-JackMcElhinney](https://github.com/Blackbaud-JackMcElhinney)!)

# 3.2.1 (2019-07-05)

- Fixed the radio group component to update the state when the model value changes. [#52](https://github.com/blackbaud/skyux-forms/pull/52)

# 3.2.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#35](https://github.com/blackbaud/skyux-forms/pull/35)

# 3.1.3 (2019-05-28)

- Fixed the checkbox component to have proper Angular form control states when it is initialized. [#41](https://github.com/blackbaud/skyux-forms/pull/41)
- Fixed the checkbox and radio button components to not have extra spacing when a label is not specified. [#42](https://github.com/blackbaud/skyux-forms/pull/42)

# 3.1.2 (2019-05-03)

- Fixed the radio group component to properly update ngModel when the initial value is undefined. [#37](https://github.com/blackbaud/skyux-forms/pull/37)

# 3.1.1 (2019-03-27)

- Fixed the radio group component to support boolean values. [#31](https://github.com/blackbaud/skyux-forms/pull/31)

# 3.1.0 (2019-03-19)

- Added the `ariaLabel` property to the radio group component. [#26](https://github.com/blackbaud/skyux-forms/pull/26)
- Fixed the radio group component to properly watch for changes to its radio components. [#26](https://github.com/blackbaud/skyux-forms/pull/26)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2019-01-10)

- Fixed the checkbox component to only add `aria-label` to HTML tags when the `label` property is supplied. [#14](https://github.com/blackbaud/skyux-forms/pull/14)

# 3.0.0-rc.4 (2018-12-06)

- Fixed the checkbox component to emit its change event properly for all change detection strategies. [#11](https://github.com/blackbaud/skyux-forms/pull/11)

# 3.0.0-rc.3 (2018-11-15)

- Fixed the checkbox component to respect the disabled state within reactive forms. [#7](https://github.com/blackbaud/skyux-forms/pull/7)
- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#9](https://github.com/blackbaud/skyux-forms/pull/9)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#6](https://github.com/blackbaud/skyux-forms/pull/6)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#5](https://github.com/blackbaud/skyux-forms/pull/5)

# 3.0.0-rc.0 (2018-10-02)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-02)

- Initial alpha release.
