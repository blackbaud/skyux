**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.2 (2021-12-21)

- Fix Stackblitz demo. [#105](https://github.com/blackbaud/skyux-phone-field/pull/105)

# 5.0.1 (2021-11-19)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#103](https://github.com/blackbaud/skyux-phone-field/pull/103)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#91](https://github.com/blackbaud/skyux-phone-field/pull/91)

# 5.0.0-beta.1 (2021-09-16)

- Adopt Angular CLI. [#100](https://github.com/blackbaud/skyux-phone-field/pull/100)

# 4.6.2 (2021-08-04)

- Fixed the phone field component to only switch to supported countries via dial code when using the `supportedCountryISOs` input. [#97](https://github.com/blackbaud/skyux-phone-field/pull/97)

# 5.0.0-beta.0 (2021-07-16)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#96](https://github.com/blackbaud/skyux-phone-field/pull/96)

# 4.6.1 (2021-06-03)

- Fixed the phone field component to display the correct "close" icon when searching for a country in modern theme. [#92](https://github.com/blackbaud/skyux-phone-field/pull/92)

# 5.0.0-alpha.0 (2021-05-24)

- Added support for `@angular/core@^12`. [#91](https://github.com/blackbaud/skyux-phone-field/pull/91)
- Removed `BrowserAnimationsModule` from the `imports` section of `SkyPhoneFieldModule` to support lazy-loading. Consumers of `SkyPhoneFieldModule` must now import `BrowserAnimationsModule` into their application's root module. [#91](https://github.com/blackbaud/skyux-phone-field/pull/91)

# 4.6.0 (2021-05-03)

- Added methods to the phone field testing fixture. [#88](https://github.com/blackbaud/skyux-phone-field/pull/88)

# 4.5.1 (2021-01-20)

- Fixed the phone field input directive to automatically set the input's type to `tel`. [#83](https://github.com/blackbaud/skyux-phone-field/pull/83) (Thanks [@dougdomeny](https://github.com/dougdomeny)!)

# 4.5.0 (2020-11-11)

- Added a phone field testing fixture. [#77](https://github.com/blackbaud/skyux-phone-field/pull/77)

# 4.4.1 (2020-10-26)

- Fixed the phone field component to not indicate that the field is invalid while the user is still interacting with the component for the first time. [#74](https://github.com/blackbaud/skyux-phone-field/pull/74)

# 4.4.0 (2020-10-05)

- Added support to the phone field component for specifying whether to allow phone number extensions. [#71](https://github.com/blackbaud/skyux-phone-field/pull/71)

# 4.3.0 (2020-10-05)

- Added input box support to the phone field component. [#69](https://github.com/blackbaud/skyux-phone-field/pull/69)

# 4.2.0 (2020-09-25)

- Added the ability to limit the countries available for selection in the phone field component. [#68](https://github.com/blackbaud/skyux-phone-field/pull/68)
- Added the ability to specify the returned phone number format from the phone field component. [#66](https://github.com/blackbaud/skyux-phone-field/pull/66)

# 4.1.1 (2020-08-21)

- Added support for `google-libphonenumber@3.2.12`. [#62](https://github.com/blackbaud/skyux-phone-field/pull/62)

# 4.1.0 (2020-08-10)

- Added the ability to programmatically set the phone field component's country value. [#51](https://github.com/blackbaud/skyux-phone-field/pull/51)

# 4.0.2 (2020-08-07)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#58](https://github.com/blackbaud/skyux-phone-field/pull/58)

# 4.0.1 (2020-06-11)

- Updated the default `aria-label` property for the phone field component to improve the experience when using assistive technology [#42](https://github.com/blackbaud/skyux-phone-field/pull/42)

# 4.0.0 (2020-05-21)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#37](https://github.com/blackbaud/skyux-phone-field/pull/37)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#37](https://github.com/blackbaud/skyux-phone-field/pull/37)

# 4.0.0-rc.0 (2020-04-20)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#37](https://github.com/blackbaud/skyux-phone-field/pull/37)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#37](https://github.com/blackbaud/skyux-phone-field/pull/37)

# 3.1.2 (2020-02-06)

- Fixed the phone field component so that focus is not automatically applied to the phone field input when it is added back to a page after previously being hidden. [#32](https://github.com/blackbaud/skyux-phone-field/pull/32)

# 3.1.1 (2019-10-07)

- Fixed the phone field component to prevent `ngSubmit` events when users select the country selector button. [#26](https://github.com/blackbaud/skyux-phone-field/pull/26)

# 3.1.0 (2019-07-24)

- Added the ability for the phone field component to automatically switch countries based on a given dial code. [#16](https://github.com/blackbaud/skyux-phone-field/pull/16)

# 3.0.2 (2019-07-09)

- Fixed the phone field component to properly localize text. [#19](https://github.com/blackbaud/skyux-phone-field/pull/19)

# 3.0.1 (2019-06-12)

- Fixed the phone field component to import animations from the correct location. [#14](https://github.com/blackbaud/skyux-phone-field/pull/14)

# 3.0.0 (2019-06-12)

- Major version release.

# 3.0.0-rc.1 (2019-05-15)

- Fixed dependencies to correctly bundle when distributed to consuming applications. [#7](https://github.com/blackbaud/skyux-phone-field/pull/7)

# 3.0.0-rc.0 (2019-04-19)

- Initial release candidate.
