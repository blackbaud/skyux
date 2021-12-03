# 5.2.2 (2021-12-03)

- Fixed the viewkeeper direct to ignore the viewport margin when attaching to a scrollable host. [#277](https://github.com/blackbaud/skyux-core/pull/277)

# 5.2.1 (2021-12-02)

- Added support for Prettier code formatting. [#276](https://github.com/blackbaud/skyux-core/pull/276)

# 5.2.0 (2021-12-2)

- Added the ability to watch for scroll events from a scrollable host. [#273](https://github.com/blackbaud/skyux-core/pull/273)

# 5.1.3 (2021-11-19)

- Updated the builder to support StackBlitz. [#274](https://github.com/blackbaud/skyux-core/pull/274)

# 5.1.2 (2021-11-19)

- Fixed the numeric pipe to properly update when the locale provided by the `SkyAppLocaleProvider` is updated. [#267](https://github.com/blackbaud/skyux-core/pull/267)

# 5.1.1 (2021-10-29)

- Fixed the scrollable host service to properly handle a race condition where elements are removed from the DOM prior to the mutation observer subscription firing. [#266](https://github.com/blackbaud/skyux-core/pull/266)

# 5.1.0 (2021-10-27)

- Added the `SkyScrollableHostService` to be able to get and watch for an element's scrollable host. [#264](https://github.com/blackbaud/skyux-core/pull/264)
- Updated the viewkeeper directive to watch for scrollable hosts when positioning elements. [#264](https://github.com/blackbaud/skyux-core/pull/264)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#248](https://github.com/blackbaud/skyux-core/pull/248)
- Deprecated the `SkyCoreAdapterModule`, `SkyDynamicComponentModule`, `SkyLogModule`, and `SkyMediaQueryModule` modules. [#223](https://github.com/blackbaud/skyux-core/pull/223)
- Deprecated the `SkyLogService`. [#223](https://github.com/blackbaud/skyux-core/pull/223)

# 5.0.0-beta.12 (2021-09-29)

- Added all features and bug fixes from the `master` branch. [#260](https://github.com/blackbaud/skyux-core/pull/260)

# 4.8.1 (2021-09-29)

- Fixed the dock component to properly position elements when docked to the bottom of the screen and the `body` element does not fill the entire height of the viewport. [#258](https://github.com/blackbaud/skyux-core/pull/258)

# 5.0.0-beta.11 (2021-09-13)

- Added all features and bug fixes from the `master` branch. [#255](https://github.com/blackbaud/skyux-core/pull/255)

# 4.8.0 (2021-09-10)

- Updated the `SkyNumericPipe` to format currency values using the ["accounting" currency sign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters). [#251](https://github.com/blackbaud/skyux-core/pull/251) (Thanks [@Blackbaud-TomMaszk](https://github.com/Blackbaud-TomMaszk)!)

# 5.0.0-beta.10 (2021-09-09)

- Migrated to Angular CLI. [#248](https://github.com/blackbaud/skyux-core/pull/248)

# 4.7.0 (2021-09-08)

- Added the ability to place an element at the bottom of another element or before another element when using the dock service and the dynamic component service. [#250](https://github.com/blackbaud/skyux-core/pull/250)

# 5.0.0-beta.9 (2021-07-29)

- Merged bug fixes from the 4.x branch into the 5.x branch.

# 4.6.3 (2021-07-28)

- Fixed `SkyNumericService`'s `formatNumber` method to allow number formatting to be undefined. [#245](https://github.com/blackbaud/skyux-core/pull/245)

# 5.0.0-beta.8 (2021-07-26)

- Fixed the `SkyDynamicComponentService` to work within lazy-loaded modules. [#244](https://github.com/blackbaud/skyux-core/pull/244)

# 5.0.0-beta.7 (2021-07-15)

- Added all features and bug fixes from the `master` branch. [#242](https://github.com/blackbaud/skyux-core/pull/242)

# 5.0.0-beta.6 (2021-07-15)

- Removed the `ng update` schematic and package group. To update all SKY UX component packages, run `ng update @skyux/packages` instead. [#241](https://github.com/blackbaud/skyux-core/pull/241)

# 4.6.2 (2021-07-13)

- Fixed a bug in `SkyNumericService` that truncated rounded numbers incorrectly in certain boundary conditions, e.g. `999999` as `1,000K` instead of `1M`. [#239](https://github.com/blackbaud/skyux-core/pull/239)

# 4.6.1 (2021-07-09)

- Fixed the `getFocusableChildren` method with the `SkyCoreAdapterService` to not include elements which have a `tabIndex` but are disabled as focusable children. [#237](https://github.com/blackbaud/skyux-core/pull/237)

# 5.0.0-beta.5 (2021-07-08)

- Updated the package group to be used by Angular CLI's `ng update` command. [#236](https://github.com/blackbaud/skyux-core/pull/236)

# 5.0.0-beta.4 (2021-06-29)

- Fixed the peer dependencies to only reference beta versions for SKY UX packages. [#235](https://github.com/blackbaud/skyux-core/pull/235)

# 5.0.0-beta.3 (2021-06-22)

- Added a "no operation" schematic to test Angular CLI's `ng update` command. [#233](https://github.com/blackbaud/skyux-core/pull/233)

# 5.0.0-beta.2 (2021-06-22)

- Added a package group to be used by Angular CLI's `ng update` command. [#232](https://github.com/blackbaud/skyux-core/pull/232)

# 5.0.0-beta.1 (2021-06-22)

- Fixed the `SkyNumericService` to work within lazy-loaded feature modules. [#230](https://github.com/blackbaud/skyux-core/pull/230)

# 5.0.0-beta.0 (2021-06-15)

- Initial beta release.
- Updated `5.0.0-next` branch with features from the `master` branch. [#229](https://github.com/blackbaud/skyux-core/pull/229)

# 4.6.0 (2021-06-14)

- Added an optional `wrapperClass` for the overlay component. [#226](https://github.com/blackbaud/skyux-core/pull/226)

# 5.0.0-alpha.0 (2021-06-11)

### New features

- Added support for `@angular/core@^12`. [#223](https://github.com/blackbaud/skyux-core/pull/223)
- Updated the following singleton services to use [Angular's preferred method to become tree-shakeable](https://angular.io/guide/singleton-services#using-providedin): `SkyCoreAdapterService`, `SkyAffixService`, `SkyDockService`, `SkyDynamicComponentService`, `SkyAppFormat`, `SkyLogService`, `SkyMediaQueryService`, `MutationObserverService`, `SkyNumericService`, `SkyOverlayAdapterService`, `SkyOverlayService`, `SkyAppTitleService`, `SkyUIConfigService`, `SkyViewkeeperService`, and `SkyAppWindowRef`. [#223](https://github.com/blackbaud/skyux-core/pull/223)
- Deprecated the `SkyCoreAdapterModule`, `SkyDynamicComponentModule`, `SkyLogModule`, and `SkyMediaQueryModule` modules. [#223](https://github.com/blackbaud/skyux-core/pull/223)
- Deprecated the `SkyLogService`. [#223](https://github.com/blackbaud/skyux-core/pull/223)

## Bug fixes

- Added `@angular/router` as a peer dependency. [#223](https://github.com/blackbaud/skyux-core/pull/223)

# 4.5.1 (2021-05-24)

- Fixed the overlay component to run change detection after creating the content component. [#220](https://github.com/blackbaud/skyux-core/pull/220)

# 4.5.0 (2021-04-06)

- Added modern theme styles to the viewkeeper directive. [#215](https://github.com/blackbaud/skyux-core/pull/215)

# 4.4.0 (2021-03-04)

- Added the `getWidth`, `syncMaxHeight`, and `resetHeight` methods to the `SkyCoreAdapterService`. [#213](https://github.com/blackbaud/skyux-core/pull/213)

# 4.3.3 (2021-02-05)

- Fixed the overlay component to avoid additional errors when overlays are quickly created and destroyed. [#211](https://github.com/blackbaud/skyux-core/pull/211)

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
