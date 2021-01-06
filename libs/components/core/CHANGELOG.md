# 4.3.2 (2021-01-06)

- Fixed the overlay component to avoid throwing errors when overlays are quickly created and destroyed. [#209](https://github.com/blackbaud/skyux-core/pull/209)

# 4.3.1 (2020-10-19)

- Adjusted some implementation details to add support for Angular 10. [#204](https://github.com/blackbaud/skyux-core/pull/204)

# 4.3.0 (2020-08-31)

- Added support to the affixer for the `verticalAlignment` setting when the affixed element's placement is set to `above` or `below`. [#199](https://github.com/blackbaud/skyux-core/pull/199)

# 4.2.1 (2020-08-27)

- Fixed the numeric service to reference `NumericOptions` instead of `any`. [#197](https://github.com/blackbaud/skyux-core/pull/197)

# 4.2.0 (2020-08-13)

- Added the `skyId` directive for assigning a unique ID to an element. [#190](https://github.com/blackbaud/skyux-core/pull/190)

# 4.1.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#189](https://github.com/blackbaud/skyux-core/pull/189)

# 4.1.0 (2020-05-14)

- Added the `locale` propertly to the `SkyNumericPipe` to support different locales [#167](https://github.com/blackbaud/skyux-core/pull/167)

# 4.0.0 (2020-05-11)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#122](https://github.com/blackbaud/skyux-core/pull/122)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#122](https://github.com/blackbaud/skyux-core/pull/122)
- Removed `SkyWindowRefService` and `SkyFormat`. Use `SkyAppWindowRef` and `SkyAppFormat` instead. [#122](https://github.com/blackbaud/skyux-core/pull/122)

# 4.0.0-rc.5 (2020-05-01)

- Added bug fixes and features from the `master` branch. [#163](https://github.com/blackbaud/skyux-core/pull/163)

# 3.14.3 (2020-05-01)

- Fixed `SkyNumericPipe` to properly format decimals for numbers over 1000. [#161](https://github.com/blackbaud/skyux-core/pull/161)

# 4.0.0-rc.4 (2020-04-09)

### New features

- Added bug fixes and features from the `master` branch. [#158](https://github.com/blackbaud/skyux-core/pull/158)

# 3.14.2 (2020-04-09)

- Fixed the overlay service to remove overlay component DOM nodes during unit tests. [#156](https://github.com/blackbaud/skyux-core/pull/156)

# 3.14.1 (2020-04-06)

- Fixed the overlay component to appear above modal components. [#153](https://github.com/blackbaud/skyux-core/pull/153)

# 4.0.0-rc.3 (2020-03-31)

### New features

- Added bug fixes and features from the `master` branch. [#150](https://github.com/blackbaud/skyux-core/pull/150)

# 3.14.0 (2020-03-30)

- Added the `enablePointerEvents` option to `SkyOverlayConfig` to enable click events to pass through the overlay's backdrop. [#148](https://github.com/blackbaud/skyux-core/pull/148)
- Added the `backdropClick` event to `SkyOverlayInstance` to allow overlay instances to listen for backdrop click events. [#148](https://github.com/blackbaud/skyux-core/pull/148)
- Added the `isTargetAboveElement()` method to `SkyCoreAdapterService` to allow SKY UX components to detect if an event target element is contained within another element. [#148](https://github.com/blackbaud/skyux-core/pull/148)
- Fixed the `closed` event on `SkyOverlayInstance` to fire when the instance is closed by `SkyOverlayService` or the instance itself. [#148](https://github.com/blackbaud/skyux-core/pull/148)

# 3.13.0 (2020-03-26)

- Added the `SkyAffixConfig.autoFitContext` configuration to allow the `Affixer`'s auto-fit functionality to respond to contexts such as the viewport and the base element's overflow parent. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Added the `SkyAffixConfig.autoFitOverflowOffset` to allow the `Affixer`'s auto-fit functionality to detect dynamic boundaries. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Added the `offsetChange` and `overflowScroll` events to the `Affixer`. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Added a `close` method to the overlay service to replace the deprecated `close` method on the overlay instance. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Fixed the overlay service to destroy the host component when all overlays are closed. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Fixed the overlay service to prevent the creation of multiple overlay host components. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Fixed the overlay service to prevent the overwriting of `body` styles when restricting body scrolling. [#143](https://github.com/blackbaud/skyux-core/pull/143)
- Fixed the overlay component to make the `Router` service optional so that existing consumer unit tests don't require `RouterTestingModule` in their `TestBed`. [#143](https://github.com/blackbaud/skyux-core/pull/143)

# 3.12.1 (2020-03-04)

- Added the properties from the `SkyViewkeeperOptions` interface to `SkyViewkeeperHostOptions`. This fixes an issue where the Angular AoT compiler does not recognize interface properties that are not explicitly defined on the implementing class. [#139](https://github.com/blackbaud/skyux-core/pull/139)

# 4.0.0-rc.2 (2020-03-03)

### New features

- Added bug fixes and features from the `master` branch. [#132](https://github.com/blackbaud/skyux-core/pull/132)

# 3.12.0 (2020-03-03)

- Added the affix service and directive that enables SKY UX components to affix an element to another element. [#135](https://github.com/blackbaud/skyux-core/pull/135)
- Added the missing `SkyViewkeeperHostOptions` to the exports API. [#137](https://github.com/blackbaud/skyux-core/pull/137)
- Added the `@Injectable()` decorator to the `SkyViewkeeperHostOptions` class to satisfy build requirements. [#137](https://github.com/blackbaud/skyux-core/pull/137)

# 3.11.1 (2020-02-27)

- Fixed internal circular references in the dock component. [#133](https://github.com/blackbaud/skyux-core/pull/133)

# 3.11.0 (2020-02-26)

- Added the viewkeeper directive that enables SKY UX components to keep elements in view while users scroll. [#128](https://github.com/blackbaud/skyux-core/pull/128)
- Added the dock service that enables SKY UX components to stack elements at the bottom of the window. [#125](https://github.com/blackbaud/skyux-core/pull/125)

# 4.0.0-rc.1 (2020-02-20)

### Bug fixes

- Added missing components and directives to the exports API. [#127](https://github.com/blackbaud/skyux-core/pull/127)

# 4.0.0-rc.0 (2020-02-15)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#122](https://github.com/blackbaud/skyux-core/pull/122)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#122](https://github.com/blackbaud/skyux-core/pull/122)
- Removed `SkyWindowRefService` and `SkyFormat`. Use `SkyAppWindowRef` and `SkyAppFormat` instead. [#122](https://github.com/blackbaud/skyux-core/pull/122)

# 3.10.1 (2020-02-07)

- Fixed the `getFocusableChildren()` method on `SkyCoreAdapterService` to include elements with the `tabIndex` attribute. [#118](https://github.com/blackbaud/skyux-core/pull/118)

# 3.10.0 (2019-11-26)

- Added `SkyAppTitleService` to implement basic logic for setting the window's title. SKY UX Builder replaces this service with an alternate implementation when the omnibar is present so that additional information such as the name of the selected service and the number of unread notifications can be added to the title. [#113](https://github.com/blackbaud/skyux-core/pull/113)

# 3.9.0 (2019-11-22)

- Added deprecation messages to the `SkyFormat` and `SkyWindowRefService` utilities. We will remove `SkyFormat` and `SkyWindowRefService` in the next major version release. We recommend replacing them with `SkyAppFormat` and `SkyAppWindowRef`. [#110](https://github.com/blackbaud/skyux-core/pull/110)

# 3.8.0 (2019-10-10)

- Updated the `getFocusableChildren()` method on `SkyCoreAdapterService` to make filtering optional for tab index and visibility. [#104](https://github.com/blackbaud/skyux-core/pull/104)

# 3.7.0 (2019-09-11)

- Added the `getFocusableChildren()` method to return an array of all focusable children for a provided `element`. [#99](https://github.com/blackbaud/skyux-core/pull/99)
- Added the `SkyPercentPipe` to allow for easy conversion of numbers to their percent form. [#95](https://github.com/blackbaud/skyux-core/pull/95)
- Fixed the numeric service to properly round numbers with high signficant digits. [#98](https://github.com/blackbaud/skyux-core/pull/98) (Thanks [@Blackbaud-ThomasOrtiz](https://github.com/Blackbaud-ThomasOrtiz)!)

# 3.6.1 (2019-07-23)

- Fixed `SkyMediaQueryService` to complete its observables when the consuming component is destroyed. [#86](https://github.com/blackbaud/skyux-core/pull/86)

# 3.6.0 (2019-06-12)

- Added `SkyCoreAdapterService` to provide helper functions for applying focus and setting CSS classes for responsive containers. [#81](https://github.com/blackbaud/skyux-core/pull/81)

# 3.5.3 (2019-05-06)

- Fixed `SkyNumericPipe` to include proper locale data when used with Angular version 5 and higher. [#74](https://github.com/blackbaud/skyux-core/pull/74)

# 3.5.2 (2019-03-20)

- Fixed `SkyNumericModule` to properly import `SkyI18nModule` and to provide `SkyNumericPipe`. [#72](https://github.com/blackbaud/skyux-core/pull/72)
- Fixed `SkyNumericService` to support `@angular/core@^5.0.0`. [#71](https://github.com/blackbaud/skyux-core/pull/71)

# 3.5.1 (2018-12-19)

- Fixed `SkyDynamicComponentService` to fully destroy components which are dynamically removed. [#55](https://github.com/blackbaud/skyux-core/pull/55)

# 3.5.0 (2018-12-11)

- Updated `SkyDynamicComponentService` to remove components from the page dynamically. [#45](https://github.com/blackbaud/skyux-core/pull/45)

# 3.4.0 (2018-11-29)

- Added `SkyDynamicComponentService` to provide the ability to inject entry components onto the page dynamically. [#44](https://github.com/blackbaud/skyux-core/pull/44)

# 3.3.0 (2018-11-15)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#43](https://github.com/blackbaud/skyux-core/pull/43)

# 3.2.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#42](https://github.com/blackbaud/skyux-core/pull/42)

# 3.2.2 (2018-10-30)

- Fixed circular dependency structure when importing from `@skyux/i18n`. [#38](https://github.com/blackbaud/skyux-core/pull/38)

# 3.2.1 (2018-10-29)

- Fixed numeric module to use correct locale resources provider. [#35](https://github.com/blackbaud/skyux-core/pull/35)

# 3.2.0 (2018-10-29)

- Added `SkyUIConfigService`. [#37](https://github.com/blackbaud/skyux-core/pull/37)
- Added option for minimum fraction digits to numeric service and pipe. [#34](https://github.com/blackbaud/skyux-core/pull/34)

# 3.1.0 (2018-09-19)

- Added `MockSkyMediaQueryService` for unit tests. [#33](https://github.com/blackbaud/skyux-core/pull/33)

# 3.0.2 (2018-09-17)

- Fixed locale resource imports to not produce 404s when the consuming app's execution context did not include SKY UX Builder. [#31](https://github.com/blackbaud/skyux-core/pull/31)

# 3.0.1 (2018-09-10)

- Fixed `NumericOptions` to provide `truncate` and `truncateAfter` as optional. [#27](https://github.com/blackbaud/skyux-core/pull/27)

# 3.0.0 (2018-09-10)

- Initial major release.

# 3.0.0-alpha.6 (2018-08-28)

- Added log and mutation to package export. [#16](https://github.com/blackbaud/skyux-core/pull/16)

# 3.0.0-alpha.5 (2018-08-18)

- Bugfix to remove Builder config from dependency.

# 3.0.0-alpha.4 (2018-08-16)

- Removed testing utilities; moved to `@skyux-sdk/testing`. [#13](https://github.com/blackbaud/skyux-core/pull/13)

# 3.0.0-alpha.3 (2018-08-16)

- Exported Jasmine matchers and a11y utilities. [#11](https://github.com/blackbaud/skyux-core/pull/11)

# 3.0.0-alpha.2 (2018-08-16)

- Exported testing components and services. [#9](https://github.com/blackbaud/skyux-core/pull/9)

# 3.0.0-alpha.1 (2018-08-15)

- Added localization resource files. [#3](https://github.com/blackbaud/skyux-core/pull/3)

# 3.0.0-alpha.0 (2018-08-14)

- Initial release.
