# 4.7.1 (2021-06-18)

- Fixed the toolbar component to show the proper border color in modern theme. [#223](https://github.com/blackbaud/skyux-layout/pull/223)

# 4.7.0 (2021-06-10)

- Added `skyHref` support to the action button component. [#221](https://github.com/blackbaud/skyux-layout/pull/221)
- Fixed the back to top directive to hide the back to top button if the `buttonHidden` option is enabled after the button renders. [#219](https://github.com/blackbaud/skyux-layout/pull/219)

# 4.6.2 (2021-04-28)

- Fixed the description list component to properly provide the `MutationObserverService`. [#215](https://github.com/blackbaud/skyux-layout/pull/215)

# 4.6.1 (2021-04-28)

- Updated `SkyActionButtonPermalink` to make its `route.extras` property optional. [#211](https://github.com/blackbaud/skyux-layout/pull/211)

# 4.6.0 (2021-04-09)

- Fixed the description list component to prevent showing both actual and default values. [#209](https://github.com/blackbaud/skyux-layout/pull/209)

# 4.5.3 (2021-04-01)

- Fixed the action button container component to properly implement the `SkyThemeService`. [#205](https://github.com/blackbaud/skyux-layout/pull/205)

# 4.5.2 (2021-03-31)

- Fixed the action button container component to properly resize all action buttons containing asynchronous content. [#203](https://github.com/blackbaud/skyux-layout/pull/203)
- Fixed the action button container component to use the proper responsive layout in Firefox. [#203](https://github.com/blackbaud/skyux-layout/pull/203)

# 4.5.1 (2021-03-26)

- Fixed the action button container component to be center aligned by default. [#201](https://github.com/blackbaud/skyux-layout/pull/201)
- Fixed the action button container component to have `20px` margins in modern theme. [#200](https://github.com/blackbaud/skyux-layout/pull/200)
- Fixed the action button component to prevent null injector errors for `SkyThemeService` and `SkyCoreAdapterService `. [#200](https://github.com/blackbaud/skyux-layout/pull/200)
- Fixed the action button container component to properly resize all action buttons after dynamically adding or removing action buttons. [#200](https://github.com/blackbaud/skyux-layout/pull/200)
- Fixed the action button container component to use the proper responsive layout on the initial page load. [#200](https://github.com/blackbaud/skyux-layout/pull/200)

# 4.5.0 (2021-03-17)

- Added modern theme styles to the action button component. [#195](https://github.com/blackbaud/skyux-layout/pull/195)

# 4.4.3 (2021-02-22)

- Fixed the fluid grid component to disable the outer left and right margins in modern theme when `disableMargin` is set to `true`. [#193](https://github.com/blackbaud/skyux-layout/pull/193)

# 4.4.2 (2021-02-12)

- Fixed the toolbar component to have proper visual styles when built for production. [#190](https://github.com/blackbaud/skyux-layout/pull/190)

# 4.4.1 (2021-02-10)

- Fixed the toolbar component to have a background when inside a viewkeeper. [#188](https://github.com/blackbaud/skyux-layout/pull/188)

# 4.4.0 (2021-01-28)

- Added the description list component. [#179](https://github.com/blackbaud/skyux-layout/pull/179)

# 4.3.2 (2021-01-26)

- Fixed the toolbar component to utilize the correct modern theme styles. [#181](https://github.com/blackbaud/skyux-layout/pull/181)

# 4.3.1 (2020-11-16)

- Fixed the text expand component to wrap unbroken text to the next line when it overflows the text expand modal's container. [#174](https://github.com/blackbaud/skyux-layout/pull/174)

# 4.3.0 (2020-09-17)

- Added a message stream to interact with the back to top directive programatically and an option to hide the back to top button. [#158](https://github.com/blackbaud/skyux-layout/pull/158)

# 4.2.3 (2020-08-21)

- Fixed the fluid grid component to have `10px` gutters when `gutterSize` is set to `SkyFluidGridGutterSize.Small`. [#144](https://github.com/blackbaud/skyux-layout/pull/144)

# 4.2.2 (2020-07-31)

- Fixed a bug where the fluid grid component's `gutterSize` attribute was not respected in the modern theme. [#141](https://github.com/blackbaud/skyux-layout/pull/141)

# 4.2.1 (2020-07-13)

- Fixed an issue where the action button's text did not wrap in Internet Explorer. [#119](https://github.com/blackbaud/skyux-layout/pull/119) (Thanks [@Blackbaud-ScottFreeman](https://github.com/Blackbaud-ScottFreeman)!)

# 4.2.0 (2020-07-01)

- Added modern theme styles to the fluid grid component. [#117](https://github.com/blackbaud/skyux-layout/pull/117)

# 4.1.1 (2020-06-18)

- Fixed the text expand component to prevent an error when using the `maxLength` property in a compiled application. [#112](https://github.com/blackbaud/skyux-layout/pull/112)

# 4.1.0 (2020-06-04)

- Added modern theme styles to the toolbar component. [#109](https://github.com/blackbaud/skyux-layout/pull/109)

# 4.0.0 (2020-05-14)

### New features

- Added test fixtures for the action button, card, and page summary components to use in consumer unit tests. [#102](https://github.com/blackbaud/skyux-layout/pull/102)
- Added support for `@angular/core@^9`. [#78](https://github.com/blackbaud/skyux-layout/pull/78)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#78](https://github.com/blackbaud/skyux-layout/pull/78)

### Breaking changes

- Removed the deprecated dock module. Use the one in `@skyux/core` instead. [#88](https://github.com/blackbaud/skyux-layout/pull/88)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#78](https://github.com/blackbaud/skyux-layout/pull/78)

# 4.0.0-rc.4 (2020-04-30)

### New features

- Added test fixtures for the action button, card, and page summary components to use in consumer unit tests. [#102](https://github.com/blackbaud/skyux-layout/pull/102)

# 4.0.0-rc.3 (2020-04-16)

- Added bug fixes and features from the `master` branch. [#98](https://github.com/blackbaud/skyux-layout/pull/98)

# 3.9.0 (2020-03-13)

- Added the format component which displays rich content within a tokenized string. [#89](https://github.com/blackbaud/skyux-layout/pull/89)

# 4.0.0-rc.2 (2020-03-05)

### New features

- Added all bug fixes and features from `master` branch. [#86](https://github.com/blackbaud/skyux-layout/pull/86)

### Breaking changes

- Removed the deprecated dock module. Use the one in `@skyux/core` instead. [#88](https://github.com/blackbaud/skyux-layout/pull/88)

# 3.8.0 (2020-02-28)

- Added the back to top component. [#84](https://github.com/blackbaud/skyux-layout/pull/84)

# 4.0.0-rc.1 (2020-02-20)

### Bug fixes

- Added missing types to the exports API. [#81](https://github.com/blackbaud/skyux-layout/pull/81)

# 4.0.0-rc.0 (2020-02-19)

### New features

- Added support for `@angular/core@^9`. [#78](https://github.com/blackbaud/skyux-layout/pull/78)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#78](https://github.com/blackbaud/skyux-layout/pull/78)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#78](https://github.com/blackbaud/skyux-layout/pull/78)

# 3.7.0 (2020-02-12)

- Added the dock service which appends components to the bottom of the page. [#67](https://github.com/blackbaud/skyux-layout/pull/67)
- Fixed an Angular compiler template checking error on the text expand repeater component's HTML template. [#75](https://github.com/blackbaud/skyux-layout/pull/75)

# 3.6.2 (2020-02-10)

- Fixed the inline delete component to watch for focus events after they fully display. [#73](https://github.com/blackbaud/skyux-layout/pull/73)

# 3.6.1 (2020-02-07)

- Fixed the inline delete component to allow focus to be placed on the parent element. [#71](https://github.com/blackbaud/skyux-layout/pull/71)

# 3.6.0 (2020-02-03)

- Added the ability to disable margins and set the column gutter sizes for the fluid grid component. [#61](https://github.com/blackbaud/skyux-layout/pull/61)
- Fixed the action button component's focus outline to no longer extend outside its container. [#64](https://github.com/blackbaud/skyux-layout/pull/64)

# 3.5.0 (2020-01-27)

- Added the inline delete component. [#56](https://github.com/blackbaud/skyux-layout/pull/56)
- Updated the card component so that it can display the inline delete component.[#56](https://github.com/blackbaud/skyux-layout/pull/56)

# 3.4.0 (2020-01-17)

- Added `sky-page` component to transition pages to a white background. [#57](https://github.com/blackbaud/skyux-layout/pull/57)

# 3.3.1 (2019-11-21)

- Fixed the text expand and text expand repeater components' DOM adapter services to use the new `Renderer2` utility instead of the deprecated `Renderer` utility. [#53](https://github.com/blackbaud/skyux-layout/pull/53)

# 3.3.0 (2019-10-16)

- Added the ability to provide custom item templates for the text expand repeater component. [#48](https://github.com/blackbaud/skyux-layout/pull/48) (Thanks [@Blackbaud-CoreyArcher](https://github.com/Blackbaud-CoreyArcher)!)

# 3.2.2 (2019-07-19)

- Fixed the toolbar section component to properly display items which do not overflow onto the next line. [#42](https://github.com/blackbaud/skyux-layout/pull/42)

# 3.2.1 (2019-05-29)

- Fixed the text expand component to correct the spacing before the "See more" and "See less" buttons. [#38](https://github.com/blackbaud/skyux-layout/pull/38)
- Fixed the text expand repeater component to not place focus on the whitespace around the "See more" and "See less" buttons. [#38](https://github.com/blackbaud/skyux-layout/pull/38)

# 3.2.0 (2019-05-17)

- Added the ability to trigger responsive styles based on a parent component. [#32](https://github.com/blackbaud/skyux-layout/pull/32)

# 3.1.1 (2019-04-18)

- Fixed toolbar component styles to prevent a collapsed search bar. [#30](https://github.com/blackbaud/skyux-layout/pull/30)

# 3.1.0 (2019-04-09)

- Added the ability to place items on the right side of the toolbar component. [#18](https://github.com/blackbaud/skyux-layout/pull/18)
- Fixed toolbar item components to wrap when they overflow their toolbar component. [#26](https://github.com/blackbaud/skyux-layout/pull/26)

# 3.0.1 (2019-03-20)

- Fixed the page summary component so that content always fills the parent container. [#22](https://github.com/blackbaud/skyux-layout/pull/22)
- Fixed action button components to wrap when they overflow their action button container component. [#23](https://github.com/blackbaud/skyux-layout/pull/23)
- Fixed visual styles for the action button container component. [#23](https://github.com/blackbaud/skyux-layout/pull/23)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2019-01-09)

- Fixed the card component to prevent infinite loops when users select or deselect cards. [#12](https://github.com/blackbaud/skyux-layout/pull/12)

# 3.0.0-rc.4 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#10](https://github.com/blackbaud/skyux-layout/pull/10)

# 3.0.0-rc.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#8](https://github.com/blackbaud/skyux-layout/pull/8)

# 3.0.0-rc.2 (2018-11-01)

- Fixed the page summary component to no longer throw an error when toggling the key info component. [#4](https://github.com/blackbaud/skyux-layout/pull/4)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-layout/pull/3)

# 3.0.0-rc.0 (2018-10-16)

- Initial release candidate.

# 3.0.0-alpha.1 (2018-10-11)

- Added the card, definition list, fluid grid, page summary, text expand, and text expand repeater components. [#2](https://github.com/blackbaud/skyux-layout/pull/2)

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
