# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#168](https://github.com/blackbaud/skyux-popovers/pull/168)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#163](https://github.com/blackbaud/skyux-popovers/pull/163)

# 5.0.0-beta.2 (2021-09-13)

- Migrated to Angular CLI. [#163](https://github.com/blackbaud/skyux-popovers/pull/163)

# 4.7.0 (2021-08-25)

- Added reference checking on close to support AG Grid popovers. [#161](https://github.com/blackbaud/skyux-popovers/pull/161)

# 5.0.0-beta.1 (2021-08-09)

- Added bug fixes and features from the `master` branch. [#160](https://github.com/blackbaud/skyux-popovers/pull/160)

# 4.6.0 (2021-08-06)

- Added the error type for popovers. [#158](https://github.com/blackbaud/skyux-popovers/pull/158)

# 4.5.3 (2021-07-09)

- Fixed the dropdown menu component to close after users select items that are nested in multiple layers, such as `*ngFor` and `*ngIf` directives. [#156](https://github.com/blackbaud/skyux-popovers/pull/156)

# 5.0.0-beta.0 (2021-07-06)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#154](https://github.com/blackbaud/skyux-popovers/pull/154)

# 5.0.0-alpha.0 (2021-05-20)

- Removed `BrowserAnimationsModule` from the `imports` section of `SkyPopoverModule` to support lazy-loading. Consumers of `SkyPopoverModule` must now import `BrowserAnimationsModule` into their application's root module. [#152](https://github.com/blackbaud/skyux-indicators/pull/152)

# 4.5.2 (2021-05-10)

- Fixed the dropdown component to focus on the first menu item after users select the dropdown button. [#148](https://github.com/blackbaud/skyux-popovers/pull/148)

# 4.5.1 (2021-04-15)

- Fixed the service injection so that `SkyThemeService` is not required. [#144](https://github.com/blackbaud/skyux-popovers/pull/144)

# 4.5.0 (2021-04-15)

- Added support for SKY UX icons on dropdown component. [#141](https://github.com/blackbaud/skyux-popovers/pull/141)

# 4.4.1 (2021-03-19)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#138](https://github.com/blackbaud/skyux-popovers/pull/138)
- Fixed the dropdown component to prevent an error when items are added before the menu is fully open. [#137](https://github.com/blackbaud/skyux-popovers/issues/137)

# 4.4.0 (2020-12-18)

- Added modern theme styles to the popover component. [#131](https://github.com/blackbaud/skyux-popovers/pull/131)
- Fixed the popover component to handle messages to open a popover when it is already open. [#134](https://github.com/blackbaud/skyux-popovers/pull/134)

# 4.3.1 (2020-11-11)

- Fixed the context menu button padding in the modern theme. [#129](https://github.com/blackbaud/skyux-popovers/pull/129)

# 4.3.0 (2020-11-06)

- Added a popover test fixture. [#125](https://github.com/blackbaud/skyux-popovers/pull/125)

# 4.2.1 (2020-08-28)

- Fixed the popover component to set default values for vertical and horizontal alignments. [#117](https://github.com/blackbaud/skyux-popovers/pull/117)

# 4.2.0 (2020-07-31)

- Added modern theme styles to the dropdown component. [#110](https://github.com/blackbaud/skyux-popovers/pull/110)

# 4.1.1 (2020-07-24)

- Fixed the dropdown fixture to register click events on dropdown items. [#107](https://github.com/blackbaud/skyux-popovers/pull/107)

# 4.1.0 (2020-07-21)

- Added a test fixture for the dropdown component to use in consumer unit tests. [#99](https://github.com/blackbaud/skyux-popovers/pull/99)

  ```
  import { SkyDropdownFixture } from '@skyux/popovers/testing';

  const dropdown = new SkyDropdownFixture(fixture, 'my-test-id');
  ```

# 4.0.1 (2020-07-21)

- Added missing `SkyDropdownHorizontalAlignment` to the exports API. [#102](https://github.com/blackbaud/skyux-popovers/pull/102)

# 4.0.0 (2020-05-13)

### New features

- Added support for `@angular/core@^9`. [#53](https://github.com/blackbaud/skyux-popovers/pull/53)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#53](https://github.com/blackbaud/skyux-popovers/pull/53)

### Breaking changes

- Removed the `alignment` input from the dropdown component. Use the `horizontalAlignment` input instead. [#86](https://github.com/blackbaud/skyux-popovers/pull/86)
- Removed the `allowFullscreen` input from the popover component since fullscreen popovers are not an approved SKY UX design pattern. Use the SKY UX modal component instead. [#86](https://github.com/blackbaud/skyux-popovers/pull/86)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#53](https://github.com/blackbaud/skyux-popovers/pull/53)

# 3.6.0 (2020-05-08)

- Added modern theme styles to the tab dropdown button. [#84](https://github.com/blackbaud/skyux-popovers/pull/84)

# 3.5.3 (2020-04-29)

- Fixed the dropdown button styles to left-align overflowing text within a tab dropdown. [#82](https://github.com/blackbaud/skyux-popovers/pull/82)

# 4.0.0-rc.3 (2020-04-28)

- Upgraded development dependencies. [#81](https://github.com/blackbaud/skyux-popovers/pull/81)

# 4.0.0-rc.2 (2020-04-10)

### New features

- Added bug fixes and features from the `master` branch. [#78](https://github.com/blackbaud/skyux-popovers/pull/78)

# 3.5.2 (2020-04-10)

- Fixed the dropdown component to prevent propagation of the escape key when the dropdown menu is open. [#75](https://github.com/blackbaud/skyux-popovers/pull/75)
- Fixed the dropdown component to properly handle the `click` event handler on dropdown menu items. [#75](https://github.com/blackbaud/skyux-popovers/pull/75)
- Fixed the dropdown component to find a valid placement on initialization. [#76](https://github.com/blackbaud/skyux-popovers/pull/76)
- Removed the deprecation message from the popover component's `skyPopoverTrigger` property. [#74](https://github.com/blackbaud/skyux-popovers/pull/74)

# 4.0.0-rc.1 (2020-04-08)

### New features

- Added bug fixes and features from the `master` branch. [#69](https://github.com/blackbaud/skyux-popovers/pull/69)

# 3.5.1 (2020-04-08)

- Added a deprecation message to the `SkyPopoverTrigger` type. [#63](https://github.com/blackbaud/skyux-popovers/pull/63)
- Fixed the dropdown component to properly set all ARIA attributes. [#67](https://github.com/blackbaud/skyux-popovers/pull/67)
- Fixed `SkyPopoverContext` to stop throwing build warnings. [#63](https://github.com/blackbaud/skyux-popovers/pull/63)

# 3.5.0 (2020-04-02)

- Updated the dropdown and popover components to implement the affix and overlay services. [#61](https://github.com/blackbaud/skyux-popovers/pull/61)

# 4.0.0-rc.0 (2020-02-19)

### New features

- Added support for `@angular/core@^9`. [#53](https://github.com/blackbaud/skyux-popovers/pull/53)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#53](https://github.com/blackbaud/skyux-popovers/pull/53)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#53](https://github.com/blackbaud/skyux-popovers/pull/53)

# 3.4.0 (2019-10-09)

- Added the `allowFullscreen` input property to the popover component. The dropdown component uses the `allowFullscreen` input property to prevent dropdown menu items from displaying in full screen. [#36](https://github.com/blackbaud/skyux-popovers/pull/36)

# 3.3.0 (2019-08-19)

- Added the `buttonIsFocused` and `menuIsFocused` properties to the dropdown component. [#30](https://github.com/blackbaud/skyux-popovers/pull/30)

# 3.2.0 (2019-08-14)

- Added support for anchor elements in the dropdown menu component. [#28](https://github.com/blackbaud/skyux-popovers/pull/28)

# 3.1.1 (2019-06-21)

- Updated development dependencies to support `@skyux-sdk/builder@3.7.0`, which addresses problems with the UMD library bundle. [#17](https://github.com/blackbaud/skyux-popovers/pull/17)

# 3.1.0 (2019-06-20)

- Updated development dependencies to support `@skyux-sdk/builder@3.6.7`. [#17](https://github.com/blackbaud/skyux-popovers/pull/17)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.4 (2018-12-03)

- Updated a dependency to properly style the hover state for a selected tab that is not disabled. [blackbaud/skyux-theme#41](https://github.com/blackbaud/skyux-theme/pull/41)

# 3.0.0-rc.3 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#6](https://github.com/blackbaud/skyux-popovers/pull/6)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-popovers/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-popovers/pull/3)

# 3.0.0-rc.0 (2018-10-05)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-04)

- Initial alpha release.
