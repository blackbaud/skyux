# 4.0.0 (2020-05-12)

### New features

- Added test fixtures for the alert and label components to use in consumer unit tests. [#81](https://github.com/blackbaud/skyux-indicators/pull/81)
- Added support for `@angular/core@^9`. [#58](https://github.com/blackbaud/skyux-indicators/pull/58)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#58](https://github.com/blackbaud/skyux-indicators/pull/58)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#58](https://github.com/blackbaud/skyux-indicators/pull/58)

# 4.0.0-rc.5 (2020-04-30)

### New features

- Added test fixtures for the alert and label components to use in consumer unit tests. [#81](https://github.com/blackbaud/skyux-indicators/pull/81)

# 4.0.0-rc.4 (2020-04-23)

- Added bug fixes and features from the `master` branch. [#79](https://github.com/blackbaud/skyux-indicators/pull/79)

# 3.2.1 (2020-04-23)

- Fixed the label component to add space between the label icon and text. [#77](https://github.com/blackbaud/skyux-indicators/pull/77)

# 4.0.0-rc.3 (2020-04-03)

### New features

- Added bug fixes and features from the `master` branch. [#73](https://github.com/blackbaud/skyux-indicators/pull/73)

# 3.2.0 (2020-04-02)

- Updated the icon component to support icons from the SKY UX icon font. [#74](https://github.com/blackbaud/skyux-indicators/pull/74)

# 4.0.0-rc.2 (2020-02-20)

### Bug fixes

- Removed internal components and directives from the exports API. [#64](https://github.com/blackbaud/skyux-indicators/pull/64)

# 4.0.0-rc.1 (2020-02-20)

### Bug fixes

- Added missing components and directives to the exports API. [#63](https://github.com/blackbaud/skyux-indicators/pull/63)

# 4.0.0-rc.0 (2020-02-19)

### New features

- Added support for `@angular/core@^9`. [#58](https://github.com/blackbaud/skyux-indicators/pull/58)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#58](https://github.com/blackbaud/skyux-indicators/pull/58)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#58](https://github.com/blackbaud/skyux-indicators/pull/58)

# 3.1.3 (2020-02-12)

- Fixed an Angular compiler template checking error on the tokens component's HTML template. [#55](https://github.com/blackbaud/skyux-indicators/pull/55)
- Fixed a SCSS syntax error on the icon component style sheet. [#56](https://github.com/blackbaud/skyux-indicators/pull/56)

# 3.1.2 (2019-12-30)

- Fixed the wait and token components to prevent errors when using the keyboard. [#50](https://github.com/blackbaud/skyux-indicators/pull/50)

# 3.1.1 (2019-11-21)

- Fixed the wait component's DOM adapter services to use the new `Renderer2` utility instead of the deprecated `Renderer` utility. [#46](https://github.com/blackbaud/skyux-indicators/pull/46)

# 3.1.0 (2019-07-26)

- Added methods to `SkyWaitService` to launch a wait component until an observable is completed. [#39](https://github.com/blackbaud/skyux-indicators/pull/39) (Thanks [@Blackbaud-ColbyWhite](https://github.com/Blackbaud-ColbyWhite)!)
- Added support for `@skyux-sdk/builder@3.7.1`. [#37](https://github.com/blackbaud/skyux-indicators/pull/37)
- Removed a peer dependency on `@skyux/theme`. [#35](https://github.com/blackbaud/skyux-indicators/pull/35)

# 3.0.3 (2019-01-16)

- Fixed the chevron component to properly align its icon in Firefox. [#31](https://github.com/blackbaud/skyux-indicators/pull/31)

# 3.0.2 (2019-01-15)

- Fixed the chevron component to properly center its icon within the button element. [#30](https://github.com/blackbaud/skyux-indicators/pull/30)

# 3.0.1 (2019-01-15)

- Fixed the chevron component to properly position its elements when a container is resized. [#26](https://github.com/blackbaud/skyux-indicators/pull/26)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.6 (2018-12-13)

- Fixed the wait component to prevent tab navigation during blocking waits. [#4](https://github.com/blackbaud/skyux-indicators/pull/4)

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#13](https://github.com/blackbaud/skyux-indicators/pull/19)


# 3.0.0-rc.4 (2018-11-12)

- Fixed the text highlight component to no longer execute on attribute changes. [#15](https://github.com/blackbaud/skyux-indicators/pull/15)

# 3.0.0-rc.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#14](https://github.com/blackbaud/skyux-indicators/pull/14)

# 3.0.0-rc.2 (2018-10-17)

- Added support for `@skyux/i18n@3.2.0`. [#11](https://github.com/blackbaud/skyux-indicators/pull/11)

# 3.0.0-rc.1 (2018-10-05)

- Added the alert and key info components. [#10](https://github.com/blackbaud/skyux-indicators/pull/10)
- Added ARIA labels to the wait component. [#8](https://github.com/blackbaud/skyux-indicators/pull/8)
- Bugfix to address unescaped characters in the text highlight regular expression. [#6](https://github.com/blackbaud/skyux-indicators/pull/6)

# 3.0.0-rc.0 (2018-09-25)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-09-19)

- Initial release.
