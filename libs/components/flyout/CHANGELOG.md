# 5.0.3 (2022-01-04)

- Fixed the resize handle on the flyout component to use the enter and space keys to activate and release the control. [#133](https://github.com/blackbaud/skyux-flyout/pull/133)

# 5.0.2 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#130](https://github.com/blackbaud/skyux-flyout/pull/130)

# 5.0.1 (2021-11-16)

- Fixed the flyout component to properly display resource strings for lazy-loaded modules. [#128](https://github.com/blackbaud/skyux-flyout/pull/128)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#114](https://github.com/blackbaud/skyux-flyout/pull/114)

# 5.0.0-beta.4 (2021-09-23)

- Fixed `SkyFlyoutInstance` to be declared properly. [#125](https://github.com/blackbaud/skyux-flyout/pull/125)

# 5.0.0-beta.3 (2021-09-22)

- Updated peer dependencies. [#124](https://github.com/blackbaud/skyux-flyout/pull/124)

# 5.0.0-beta.2 (2021-09-10)

- Updated peer dependencies. [#122](https://github.com/blackbaud/skyux-flyout/pull/122)

# 5.0.0-beta.1 (2021-08-26)

- Migrated to Angular CLI. [#119](https://github.com/blackbaud/skyux-flyout/pull/119)

# 5.0.0-beta.0 (2021-07-08)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#269](https://github.com/blackbaud/skyux-flyout/pull/269)
- Fixed `SkyFlyoutService` to work within lazy-loaded feature modules. [#115](https://github.com/blackbaud/skyux-flyout/pull/115)

# 4.2.0 (2021-06-10)

- Added `skyHref` support to the flyout component. [#116](https://github.com/blackbaud/skyux-flyout/pull/116)

# 5.0.0-alpha.0 (2021-05-21)

- Added support for `@angular/core@^12`. [#114](https://github.com/blackbaud/skyux-flyout/pull/114)
- Removed `BrowserAnimationsModule` from the `imports` section of `SkyFlyoutModule` to support lazy-loading. Consumers of `SkyFlyoutModule` must now import `BrowserAnimationsModule` into their application's root module. [#114](https://github.com/blackbaud/skyux-flyout/pull/114)

# 4.1.1 (2021-03-22)

- Replaced theme conditionals in templates with the new `skyThemeIf` directive. [#110](https://github.com/blackbaud/skyux-flyout/pull/110)

# 4.1.0 (2020-11-06)

- Added modern theme styles to the flyout component. [#105](https://github.com/blackbaud/skyux-flyout/pull/105)

# 4.0.2 (2020-10-21)

- Fixed the flyout component to not close if another flyout is triggered when clicking outside the flyout. [#103](https://github.com/blackbaud/skyux-flyout/pull/103)

# 4.0.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#92](https://github.com/blackbaud/skyux-flyout/pull/92)

# 4.0.0 (2020-05-21)

### New features

- Added support for `@angular/core@^9`. [#73](https://github.com/blackbaud/skyux-flyout/pull/73)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#73](https://github.com/blackbaud/skyux-flyout/pull/73)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#73](https://github.com/blackbaud/skyux-flyout/pull/73)

# 3.3.0 (2020-04-27)

- Added `NavigationExtras.state` support to the flyout component's permalink button. [#78](https://github.com/blackbaud/skyux-flyout/pull/78) (Thanks [@Alex-Vaky](https://github.com/Alex-Vaky)!)

# 4.0.0-rc.0 (2020-04-17)

### New features

- Added support for `@angular/core@^9`. [#73](https://github.com/blackbaud/skyux-flyout/pull/73)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#73](https://github.com/blackbaud/skyux-flyout/pull/73)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#73](https://github.com/blackbaud/skyux-flyout/pull/73)

# 3.2.4 (2020-04-03)

- Fixed the flyout component to allow clicks to propagate to the document. [#70](https://github.com/blackbaud/skyux-flyout/pull/70)

# 3.2.3 (2019-11-19)

- Fixed the flyout component to have proper spacing between buttons within its header. [#64](https://github.com/blackbaud/skyux-flyout/pull/64)

# 3.2.2 (2019-07-01)

- Fixed the flyout component to support child components that use `ChangeDetectionStrategy.Default`. [#60](https://github.com/blackbaud/skyux-flyout/pull/60)

# 3.2.1 (2019-06-26)

- Fixed the flyout component to not error when used with Angular 7. [#56](https://github.com/blackbaud/skyux-flyout/pull/56)

# 3.2.0 (2019-06-14)

- Added the ability to use the UI Config Service to save flyout component widths. [#53](https://github.com/blackbaud/skyux-flyout/pull/53)
- Fixed the flyout component to remain open while resizing when the mouse is outside of the flyout. [#52](https://github.com/blackbaud/skyux-flyout/pull/52)

# 3.1.1 (2019-06-10)

- Fixed the flyout component to handle click events that originate within its contents. [#44](https://github.com/blackbaud/skyux-flyout/pull/44)
- Fixed the flyout component to style the resize handle and iterator buttons correctly in Internet Explorer. [#45](https://github.com/blackbaud/skyux-flyout/pull/45)
- Fixed the flyout component to limit its maximum width to 20 pixels less than the window's width. [#46](https://github.com/blackbaud/skyux-flyout/pull/46)
- Fixed the flyout component to set the default width to half of the window's width unless consumers specify a different default. [#47](https://github.com/blackbaud/skyux-flyout/pull/47)
- Fixed the flyout component to handle a default width that is less than the minimum width. [#49](https://github.com/blackbaud/skyux-flyout/pull/49)
- Fixed the flyout component to only use fullscreen visual styles when the minimum width can't fit inside the window. [#50](https://github.com/blackbaud/skyux-flyout/pull/50)

# 3.1.0 (2019-05-17)

- Added the ability for the flyout component to trigger its child components' responsive styles. [#31](https://github.com/blackbaud/skyux-flyout/pull/31)

# 3.0.3 (2019-04-25)

- Fixed the flyout component to remain open when users click internal components. [#30](https://github.com/blackbaud/skyux-flyout/pull/30)

# 3.0.2 (2019-04-15)

- Added missing RxJS imports that caused compilation errors in some consuming applications. [#27](https://github.com/blackbaud/skyux-flyout/pull/27) (Thanks @Blackbaud-KevinHutson)

# 3.0.1 (2019-03-20)

- Fixed the flyout component to close when navigation occurs. [#22](https://github.com/blackbaud/skyux-flyout/pull/22)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2019-01-10)

- Updated the flyout component to improve performance. [#16](https://github.com/blackbaud/skyux-flyout/pull/16)
- Fixed styles on the flyout component's resize handle in Firefox. [#15](https://github.com/blackbaud/skyux-flyout/pull/15)

# 3.0.0-rc.4 (2018-12-20)

- Added iterator buttons to the flyout component. [#10](https://github.com/blackbaud/skyux-flyout/pull/10) (Thanks @Theaggarwal)
- Updated the flyout service to utilize `SkyDynamicComponentService`. [#9](https://github.com/blackbaud/skyux-flyout/pull/9)

# 3.0.0-rc.3 (2018-11-20)

- Fixed the flyout component to not close when an overlay above it is clicked. [#3](https://github.com/blackbaud/skyux-flyout/pull/3)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#6](https://github.com/blackbaud/skyux-flyout/pull/6)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#4](https://github.com/blackbaud/skyux-flyout/pull/4)

# 3.0.0-rc.0 (2018-10-08)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
