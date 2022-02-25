**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.5 (2022-02-15)

- Fixed the `SkyConfirmService` to work within lazy-loaded modules. [#187](https://github.com/blackbaud/skyux-modals/pull/187)

# 5.0.4 (2022-02-04)

- Removed an outdated reference to entry components. [#185](https://github.com/blackbaud/skyux-modals/pull/185)

# 5.0.3 (2021-12-21)

- Fix Stackblitz demo. [#182](https://github.com/blackbaud/skyux-modals/pull/182)

# 5.0.2 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#180](https://github.com/blackbaud/skyux-modals/pull/180)

# 5.0.1 (2021-10-14)

- Added support for wrapping modals in a CSS class. [#177](https://github.com/blackbaud/skyux-modals/pull/177)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#163](https://github.com/blackbaud/skyux-modals/pull/163)
- Added support for "lazy loaded" feature modules. [#160](https://github.com/blackbaud/skyux-modals/pull/160)

# 5.0.0-beta.6 (2021-09-16)

- Merge master and update peer dependencies. [#174](https://github.com/blackbaud/skyux-modals/pull/174)

# 4.6.0 (2021-09-15)

- Updated the modal component to place docked elements at the bottom of the modal content. [#168](https://github.com/blackbaud/skyux-modals/pull/168)

# 5.0.0-beta.5 (2021-09-10)

- Updated the peer dependencies. [#172](https://github.com/blackbaud/skyux-modals/pull/172)

# 5.0.0-beta.4 (2021-09-09)

- Added support for "partial" Ivy compilation mode. [#169](https://github.com/blackbaud/skyux-modals/pull/169)

# 5.0.0-beta.3 (2021-09-01)

- Fixed the `SkyModalModule` to work with consuming libraries that are compiled with the legacy View Engine. [#166](https://github.com/blackbaud/skyux-modals/pull/166)

# 5.0.0-beta.2 (2021-08-26)

- Migrated to Angular CLI. [#163](https://github.com/blackbaud/skyux-modals/pull/163)

# 5.0.0-beta.1 (2021-07-26)

- Fixed the `SkyModalService` to work within lazy-loaded modules. [#160](https://github.com/blackbaud/skyux-modals/pull/160)

# 4.5.5 (2021-07-13)

- Fixed the modal component so that it does not include disabled elements with `tabIndex` attributes among the focusable elements when a modal loads. [#158](https://github.com/blackbaud/skyux-modals/pull/158)

# 5.0.0-beta.0 (2021-07-06)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#155](https://github.com/blackbaud/skyux-modals/pull/155)

# 4.5.4 (2021-06-14)

- Fixed a bug where `SkyThemeService` was erroneously provided by `SkyConfirmModule` and `SkyModalModule`. [#153](https://github.com/blackbaud/skyux-modals/pull/153)

# 4.5.3 (2021-05-04)

- Deprecated `SkyConfirmType.YesCancel` and `SkyConfirmType.YesNoCancel`. Use the `SkyConfirmType.Custom` type to follow the guidance that labels should clearly indicate the actions that occur when users select buttons. [#147](https://github.com/blackbaud/skyux-modals/pull/147)

# 4.5.2 (2021-03-22)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#143](https://github.com/blackbaud/skyux-modals/pull/143)

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
