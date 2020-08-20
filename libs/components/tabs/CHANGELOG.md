# 4.3.2 (2020-08-20)

- Fixed the tabset component to use query params instead of matrix params when using `permalinkId` (matrix params cannot be used on the root route of an application). [#128](https://github.com/blackbaud/skyux-tabs/pull/128)

# 4.3.1 (2020-08-13)

- Fixed the tabset component to preserve URL query params when using `permalinkId`. [#126](https://github.com/blackbaud/skyux-tabs/pull/126)

# 4.3.0 (2020-08-04)

- Added modern theme styles for active, focused, and hover states to the tabset component. [#122](https://github.com/blackbaud/skyux-tabs/pull/122)

# 4.2.1 (2020-07-31)

- Fixed the tabset component to properly handle two-way binding with the `active` input. [#121](https://github.com/blackbaud/skyux-tabs/pull/121)

# 4.2.0 (2020-07-20)

- Added a test fixture for the tabset component to use in consumer unit tests. [#113](https://github.com/blackbaud/skyux-tabs/pull/113)
- Added the `maintainSectionContent` input property to the sectioned form component. [#112](https://github.com/blackbaud/skyux-tabs/pull/112) (Thanks [@michael-tims](https://github.com/michael-tims)!)
- Added the `maintainTabContent` input property to the vertical tabset component. [#112](https://github.com/blackbaud/skyux-tabs/pull/112) (Thanks [@michael-tims](https://github.com/michael-tims)!)
- Fixed an issue where removing a tabset from the page did not remove the permalink in the URL. [#109](https://github.com/blackbaud/skyux-tabs/pull/109)

# 4.1.1 (2020-06-25)

- Fixed the exports API to include `SectionedFormService`. [#97](https://github.com/blackbaud/skyux-tabs/pull/97)

# 4.1.0 (2020-06-16)

- Added the `ariaLabel` and `ariaLabelledBy` input properties to the tabset component. [#90](https://github.com/blackbaud/skyux-tabs/pull/90)
- Fixed the `aria-controls` and `role` HTML properties on the tabset component to follow proper accessibility guidelines. [#90](https://github.com/blackbaud/skyux-tabs/pull/90)

# 4.0.1 (2020-06-11)

- Fixed the exports API to include `SkySectionedFormComponent`. [#92](https://github.com/blackbaud/skyux-tabs/pull/92)
- Fixed the tabset component to allow setting the `tabStyle` to `'wizard'`. [#92](https://github.com/blackbaud/skyux-tabs/pull/92)

# 4.0.0 (2020-05-21)

### New features

- Added support for `@angular/core@^9`. [#56](https://github.com/blackbaud/skyux-tabs/pull/56)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#56](https://github.com/blackbaud/skyux-tabs/pull/56)

### Breaking changes

- Removed the `tabStyle` input from the tabset component, which was used to switch between `'wizard'` or `'tabs'` tab styles. To use a wizard-styled component, use the progress indicator component. [#84](https://github.com/blackbaud/skyux-tabs/pull/84)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#56](https://github.com/blackbaud/skyux-tabs/pull/56)

# 4.0.0-rc.2 (2020-05-18)

### Breaking changes

- Removed the `tabStyle` input from the tabset component, which was used to switch between `'wizard'` or `'tabs'` tab styles. To use a wizard-styled component, use the progress indicator component. [#84](https://github.com/blackbaud/skyux-tabs/pull/84)

# 3.3.0 (2020-05-11)

- Added modern theme styles to the tabset component. [#81](https://github.com/blackbaud/skyux-tabs/pull/81)

# 3.2.8 (2020-05-07)

- Fixed deep imports for `SkyMediaQueryService`. [#77](https://github.com/blackbaud/skyux-tabs/pull/77)

# 4.0.0-rc.1 (2020-04-30)

- Added bug fixes and features from the `master` branch. [#75](https://github.com/blackbaud/skyux-tabs/pull/75)

# 3.2.7 (2020-04-23)

- Fixed the tab and tabset components to set the active tab on initialization. [#73](https://github.com/blackbaud/skyux-tabs/pull/73)

# 3.2.6 (2020-04-07)

- Fixed the tabset component to set the active tab when `activeIndex` is set to a `string` value. [#62](https://github.com/blackbaud/skyux-tabs/pull/62)

# 3.2.5 (2020-03-30)

- Fixed the tabset component to avoid triggering navigation changes when using the `permalinkId` property. [#59](https://github.com/blackbaud/skyux-tabs/pull/59)

# 4.0.0-rc.0 (2020-02-22)

### New features

- Added support for `@angular/core@^9`. [#56](https://github.com/blackbaud/skyux-tabs/pull/56)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#56](https://github.com/blackbaud/skyux-tabs/pull/56)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#56](https://github.com/blackbaud/skyux-tabs/pull/56)

# 3.2.4 (2020-01-27)

- Fixed the vertical tabset component to eliminate extra padding when placed inside a modal. [#53](https://github.com/blackbaud/skyux-tabs/pull/53)

# 3.2.3 (2019-12-20)

- Fixed the vertical tab component to work with structural directives such as `ngFor` and `ngIf`. [#48](https://github.com/blackbaud/skyux-tabs/pull/48)

# 3.2.2 (2019-11-21)

- Fixed the tabset component to navigate to the previous active tab when users select the browser's "back" button. [#44](https://github.com/blackbaud/skyux-tabs/pull/44)
- Fixed the tabset component to prevent tabs from collapsing when a tabset is within another tabset. [#44](https://github.com/blackbaud/skyux-tabs/pull/44)
- Fixed the tabset component to clear the URL router fragment when users select a tab. [#44](https://github.com/blackbaud/skyux-tabs/pull/44)

# 3.2.1 (2019-10-25)

- Fixed the tabset component to fall back to the active index if `permalinkValue` is undefined. [#37](https://github.com/blackbaud/skyux-tabs/pull/37)

# 3.2.0 (2019-08-28)

- Added query parameters to the URL to reflect active tab states in the tabset component. [#31](https://github.com/blackbaud/skyux-tabs/pull/31)

# 3.1.0 (2019-05-17)

- Added the ability to trigger responsive styles based on a parent component. [#25](https://github.com/blackbaud/skyux-tabs/pull/25)

# 3.0.3 (2019-04-29)

- Fixed the vertical tabset component to correctly translate resource strings. [#24](https://github.com/blackbaud/skyux-tabs/pull/24)

# 3.0.2 (2019-04-24)

- Fixed the tabset component to prevent throwing `ViewDestroyedError`s in modals. [#21](https://github.com/blackbaud/skyux-tabs/pull/21)

# 3.0.1 (2019-04-04)

- Fixed efficiency issues in the tabset component. [#16](https://github.com/blackbaud/skyux-tabs/pull/16)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.4 (2018-12-19)

- Fixed the vertical tabset group component to not accept clicks and have proper visual styles when disabled. [#7](https://github.com/blackbaud/skyux-tabs/pull/7)

# 3.0.0-rc.3 (2018-11-28)

- Fixed the sectioned form component to keep tabs stationary when users scroll through content and to keep content stationary when users scroll through tabs. [#4](https://github.com/blackbaud/skyux-tabs/pull/4)

# 3.0.0-rc.2 (2018-11-09)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#3](https://github.com/blackbaud/skyux-tabs/pull/3)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#2](https://github.com/blackbaud/skyux-tabs/pull/2)

# 3.0.0-rc.0 (2018-10-12)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-10)

- Initial alpha release.
