# 4.5.1 (2020-10-01)

- Fixed the modal content component to fill the height of its container.

# 4.5.0 (2020-08-05)

- Added a test fixture for the modal component to use in consumer unit tests. [#116](https://github.com/blackbaud/skyux-modals/pull/116)
  ```
  import { SkyModalFixture } from '@skyux/modals/testing';

  const modal = new SkyModalFixture(fixture, 'my-test-id');
  ```

# 4.4.0 (2020-07-28)

- Updated the modal component to make `SkyThemeService` an optional dependency. [#120](https://github.com/blackbaud/skyux-modals/pull/120)

# 4.3.1 (2020-07-16)

- Fixed an issue where the modal component could cause an infinite loop when used with the modern theme. [#113](https://github.com/blackbaud/skyux-modals/pull/113)

# 4.3.0 (2020-07-07)

- Added modern theme styles to the confirm and modal components. [#103](https://github.com/blackbaud/skyux-modals/pull/103)

# ~~4.2.0 (2020-07-02)~~

This version is broken. Upgrade to 4.3.0.

# 4.1.0 (2020-06-15)

- Updated the modal header component to use HTML heading elements. [#95](https://github.com/blackbaud/skyux-modals/pull/95)
- Updated code documentation. [#98](https://github.com/blackbaud/skyux-modals/pull/98)

# 4.0.0 (2020-05-12)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#77](https://github.com/blackbaud/skyux-modals/pull/77)

### Breaking changes

- Converted the `SkyModalInstance` event emitters (`closed`, `beforeClosed`, and `helpOpened`) to observables. Deliberate calls to these events' `emit` methods will no longer work. [#57](https://github.com/blackbaud/skyux-modals/pull/57)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#77](https://github.com/blackbaud/skyux-modals/pull/77)

# 4.0.0-rc.5 (2020-05-06)

### Breaking changes

- Converted the `SkyModalInstance` event emitters (`closed`, `beforeClosed`, and `helpOpened`) to observables. Deliberate calls to these events' `emit` methods will no longer work. [#57](https://github.com/blackbaud/skyux-modals/pull/57)

# 4.0.0-rc.4 (2020-04-28)

### Bug fixes

- Added `SkyModalHostService` to the public exports API. [#90](https://github.com/blackbaud/skyux-modals/pull/90)

# 4.0.0-rc.3 (2020-04-21)

- Added bug fixes and features from the `master` branch. [#89](https://github.com/blackbaud/skyux-modals/pull/89)

# 3.2.0 (2020-04-03)

- Added the `args` property to the `beforeClose` event to let consumers access the provided `SkyModalCloseArgs` data. [#84](https://github.com/blackbaud/skyux-modals/pull/84)
- Fixed the modal component to allow clicks to propagate to the document. [#83](https://github.com/blackbaud/skyux-modals/pull/83)

# 4.0.0-rc.2 (2020-02-20)

### Bug fixes

- Added missing types to the exports API. [#78](https://github.com/blackbaud/skyux-modals/pull/78)

# 4.0.0-rc.1 (2020-02-20)

### Bug fixes

- Added the missing `SkyModalCloseArgs` type to the package exports.

# 4.0.0-rc.0 (2020-02-19)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#77](https://github.com/blackbaud/skyux-modals/pull/77)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#77](https://github.com/blackbaud/skyux-modals/pull/77)

# 3.1.2 (2019-12-12)

- Fixed the modal component to correctly stack child elements inside the modal. [#73](https://github.com/blackbaud/skyux-modals/pull/73)

# 3.1.1 (2019-11-22)

- Fixed the modal component to support Angular versions greater than 8. [#71](https://github.com/blackbaud/skyux-modals/pull/71)

# 3.1.0 (2019-08-30)

- Added the `preserveWhiteSpace` property to `SkyConfirmConfig` to let consumers preserve whitespace and new lines inside the confirm component. [#65](https://github.com/blackbaud/skyux-modals/pull/65) (Thanks [@Blackbaud-ShaydeNofziger](https://github.com/Blackbaud-ShaydeNofziger)!)
- Fixed the modal component to display text correctly in IE11 when modal content is wider than the modal body. [#64](https://github.com/blackbaud/skyux-modals/pull/64)

# 3.0.7 (2019-08-01)

- Fixed the modal component to only close when the escape key is released. [#62](https://github.com/blackbaud/skyux-modals/pull/62) (Thanks [@Blackbaud-JackMcElhinney](https://github.com/Blackbaud-JackMcElhinney)!)
- Fixed the modal header buttons to wrap properly when the heading wraps to a new line. [#61](https://github.com/blackbaud/skyux-modals/pull/61) (Thanks [@Blackbaud-JackMcElhinney](https://github.com/Blackbaud-JackMcElhinney)!)

# 3.0.6 (2019-07-05)

- Updated development dependencies to support `@skyux-sdk/builder@3.7.1`. [#51](https://github.com/blackbaud/skyux-modals/pull/51)

# 3.0.5 (2019-06-26)

- Fixed the modal component to properly align the expand and collapse chevron in tile headers. [#49](https://github.com/blackbaud/skyux-modals/pull/49)

# 3.0.4 (2019-06-07)

- Fixed the modal component to correct accessibility tab controls. [#46](https://github.com/blackbaud/skyux-modals/pull/46) (Thanks [@Blackbaud-JackMcElhinney](https://github.com/Blackbaud-JackMcElhinney)!)

# 3.0.3 (2019-04-26)

- Fixed modal component to handle click events that originate within its contents. [#40](https://github.com/blackbaud/skyux-modals/pull/40)

# 3.0.2 (2019-04-23)

- Fixed modal component to prevent clicks from propagating. [#35](https://github.com/blackbaud/skyux-modals/pull/35)

# 3.0.1 (2019-01-18)

- Fixed modal component animation to support required changes in Angular 7. [#23](https://github.com/blackbaud/skyux-modals/pull/23)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.8 (2018-12-20)

- Updated `@skyux/core` peer dependency to ensure proper modal host component removal [#20](https://github.com/blackbaud/skyux-modals/pull/20)

# 3.0.0-rc.7 (2018-12-13)

- Added ability to prevent modals from closing. [#7](https://github.com/blackbaud/skyux-modals/pull/7)
- Fixed section forms in modals to set minimum height of 460px. [#18](https://github.com/blackbaud/skyux-modals/pull/18)
- Fixed modal service to prevent errors during initialization. [#13](https://github.com/blackbaud/skyux-modals/pull/13)

# 3.0.0-rc.6 (2018-11-30)

- Fixed modal focus to ignore hidden elements. [#12](https://github.com/blackbaud/skyux-modals/pull/12)

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#14](https://github.com/blackbaud/skyux-modals/pull/14)

# 3.0.0-rc.4 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#10](https://github.com/blackbaud/skyux-modals/pull/10)

# 3.0.0-rc.3 (2018-11-01)

- Update animations import for forwards compatibility. [#9](https://github.com/blackbaud/skyux-modals/pull/9)

# 3.0.0-rc.2 (2018-10-30)

- Fixed modal backdrop opacity to match SKY UX v.1. [#4](https://github.com/blackbaud/skyux-modals/pull/4)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#6](https://github.com/blackbaud/skyux-modals/pull/6)

# 3.0.0-rc.0 (2018-10-03)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-02)

- Initial alpha release.
