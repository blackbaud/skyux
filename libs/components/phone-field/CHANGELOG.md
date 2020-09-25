# 4.2.0 (2020-09-25)

- Added the ability to limit the countries available for selection in the phone field component. [#68](https://github.com/blackbaud/skyux-phone-field/pull/68)
- Added the ability to specify the returned phone number format from the phone field component. [#66](https://github.com/blackbaud/skyux-phone-field/pull/66)

# 4.1.1 (2020-08-21)

- Added support for `google-libphonenumber@3.2.12`. [#62](https://github.com/blackbaud/skyux-phone-field/pull/62)

# 4.1.0 (2020-08-10)

- Added the ability to programatically set the phone field component's country value. [#51](https://github.com/blackbaud/skyux-phone-field/pull/51)

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
