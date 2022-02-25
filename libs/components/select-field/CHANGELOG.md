**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.1 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#107](https://github.com/blackbaud/skyux-select-field/pull/107)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#100](https://github.com/blackbaud/skyux-select-field/pull/100)

# 5.0.0-beta.2 (2021-09-16)

- Updated peer dependencies. [#104](https://github.com/blackbaud/skyux-select-field/pull/104)

# 5.0.0-beta.1 (2021-09-02)

- Migrated to Angular CLI. [#101](https://github.com/blackbaud/skyux-select-field/pull/101)

# 5.0.0-beta.0 (2021-07-14)

- Initial beta release.
- Added support for `@angular/core@^12`. [#100](https://github.com/blackbaud/skyux-select-field/pull/100)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#100](https://github.com/blackbaud/skyux-select-field/pull/100)

# 4.0.2 (2021-04-22)

- Fixed the label for the button that closes the select field modal. [#97](https://github.com/blackbaud/skyux-select-field/pull/97)

# 4.0.1 (2020-07-31)

- Added the missing `SkySelectFieldPickerContext` type to the exports API. [#79](https://github.com/blackbaud/skyux-select-field/pull/79)

# 4.0.0 (2020-05-21)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#61](https://github.com/blackbaud/skyux-select-field/pull/61)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#61](https://github.com/blackbaud/skyux-select-field/pull/61)

# 4.0.0-rc.1 (2020-04-30)

- Updated development dependencies.

# 4.0.0-rc.0 (2020-04-20)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#61](https://github.com/blackbaud/skyux-select-field/pull/61)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#61](https://github.com/blackbaud/skyux-select-field/pull/61)

# 3.5.1 (2020-03-26)

- Fixed the `package.json` file to list the correct `@skyux/list-builder` version as a peer dependency. [#59](https://github.com/blackbaud/skyux-select-field/pull/59)

# 3.5.0 (2020-03-13)

- Added the `inMemorySearchEnabled` and `searchApplied` properties to the select field component to facilitate running searches remotely. [#56](https://github.com/blackbaud/skyux-select-field/pull/56)

# 3.4.3 (2020-02-18)

- Fixed the select field component to allow it to programmatically deselect items. [#54](https://github.com/blackbaud/skyux-select-field/pull/54)

# 3.4.2 (2019-10-10)

- Fixed the select field component to mark the control as invalid when using multiselect mode. [#51](https://github.com/blackbaud/skyux-select-field/pull/51) (Thanks [@Blackbaud-MatthewMiles](https://github.com/Blackbaud-MatthewMiles)!)

# 3.4.1 (2019-09-27)

- Fixed the select field component to mark the control as touched when the picker is saved. [#49](https://github.com/blackbaud/skyux-select-field/pull/49)

# 3.4.0 (2019-09-20)

- Added the `customPicker` option to the select field component. [#47](https://github.com/blackbaud/skyux-select-field/pull/47)

# 3.3.2 (2019-08-19)

- Fixed the select field picker component to no longer mark the form control as `touched` when the value is updated programmatically. [#39](https://github.com/blackbaud/skyux-select-field/pull/39)

# 3.3.1 (2019-08-05)

- Fixed the select field picker component to compile with older typescript versions. [#34](https://github.com/blackbaud/skyux-select-field/pull/34)

# 3.3.0 (2019-08-02)

- Added media queries to hide the "New" button text on small screens. [#32](https://github.com/blackbaud/skyux-select-field/pull/32)

# 3.2.0 (2019-07-26)

- Added an optional "New" button next to the select field picker's search bar. [#30](https://github.com/blackbaud/skyux-select-field/pull/30) (Thanks [@blackbaud-vimal-kumar](https://github.com/blackbaud-vimal-kumar)!)

# 3.1.1 (2019-06-14)

- Fixed the select field component to not lose focus after clearing a selection. [#26](https://github.com/blackbaud/skyux-select-field/pull/26) (Thanks @blackbaud-conorwright)

# 3.1.0 (2019-02-19)

- Added a `blur` event to the select field component. [#11](https://github.com/blackbaud/skyux-select-field/pull/11)
- Fixed the select field component to prevent text overflow when a label is longer than its textbox. [#12](https://github.com/blackbaud/skyux-select-field/pull/12)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.3 (2018-12-03)

- Fixed the select field component to use appropriate CSS styles when a control value is invalid. [#3](https://github.com/blackbaud/skyux-select-field/pull/3)

# 3.0.0-rc.2 (2018-11-20)

- Added support for @skyux/list-builder-common@3.0.0-rc.1. [#4](https://github.com/blackbaud/skyux-select-field/pull/4)

# 3.0.0-rc.1 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#2](https://github.com/blackbaud/skyux-select-field/pull/2)

# 3.0.0-rc.0 (2018-10-26)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-24)

- Initial alpha release.
