# 4.8.0 (2021-07-06)

- Added the `loading` input to the infinite scroll component to allow for setting the loading state explicitly. The default behavior watches for DOM updates which can cause an excessive number of `scrollEnd` events and lead to poor performance. [#238](https://github.com/blackbaud/skyux-lists/pull/238)

# 4.7.2 (2021-05-07)

- Fixed the filter summary component to properly wrap filters. [#233](https://github.com/blackbaud/skyux-lists/pull/233)

# 4.7.1 (2021-04-06)

- Fixed the repeater item component to allow for items without a title in modern theme. [#223](https://github.com/blackbaud/skyux-lists/pull/223)

# 4.7.0 (2021-04-02)

- Updated the filter and sort buttons to use modern theme icons. [#222](https://github.com/blackbaud/skyux-lists/pull/222)

# 4.6.1 (2021-03-31)

- Fixed the repeater component to allow reordering with nested repeaters. [#224](https://github.com/blackbaud/skyux-lists/pull/224)

# 4.6.0 (2021-03-08)

- Added a filter test fixture. [#220](https://github.com/blackbaud/skyux-lists/pull/220)
- Added an infinite scroll test fixture. [#219](https://github.com/blackbaud/skyux-lists/pull/219)

# 4.5.1 (2021-02-08)

- Fixed the paging component to have consistent button borders for modern theme. [#217](https://github.com/blackbaud/skyux-lists/pull/217)

# 4.5.0 (2020-12-04)

- Added a sort test fixture. [#214](https://github.com/blackbaud/skyux-lists/pull/214)

# 4.4.0 (2020-08-28)

- Added a paging test fixture. [#209](https://github.com/blackbaud/skyux-lists/pull/209)
- Fixed the repeater component to let users toggle reorderability on and off. [#208](https://github.com/blackbaud/skyux-lists/pull/208)

# 4.3.0 (2020-08-28)

- Added modern theme styles to the repeater component. [#194](https://github.com/blackbaud/skyux-lists/pull/194)

# 4.2.0 (2020-07-07)

- Added modern theme styles to the paging component. [#177](https://github.com/blackbaud/skyux-lists/pull/177)

# ~~4.1.0 (2020-07-02)~~

- This version is broken. Upgrade to 4.2.0.

# 4.0.0 (2020-05-14)

### New features

- Added support for `@angular/core@^9`. [#124](https://github.com/blackbaud/skyux-lists/pull/124)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#124](https://github.com/blackbaud/skyux-lists/pull/124)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#124](https://github.com/blackbaud/skyux-lists/pull/124)

# 3.8.6 (2020-04-21)

- Fixed the repeater component to accept normal keyboard interactions within an inline form. [#151](https://github.com/blackbaud/skyux-lists/pull/151)
- Fixed the paging and repeater components to pass accessibility tests. [#155](https://github.com/blackbaud/skyux-lists/pull/155)

# 4.0.0-rc.2 (2020-04-16)

- Added all bug fixes and features from the `master` branch. [#156](https://github.com/blackbaud/skyux-lists/pull/156)

# 4.0.0-rc.1 (2020-03-04)

- Added all bug fixes and features from the `master` branch. [#129](https://github.com/blackbaud/skyux-lists/pull/129) [#131](https://github.com/blackbaud/skyux-lists/pull/131) [#137](https://github.com/blackbaud/skyux-lists/pull/137) [#141](https://github.com/blackbaud/skyux-lists/pull/141)

# 3.8.5 (2020-02-28)

- Fixed the repeater component to output the correct `orderChange` value when users drag the first reorderable repeater item. [#138](https://github.com/blackbaud/skyux-lists/pull/138)

# 3.8.4 (2020-02-28)

- Fixed the repeater component to output the correct `orderChange` value when users drag reorderable repeater items. [#134](https://github.com/blackbaud/skyux-lists/pull/134)

# 3.8.3 (2020-02-26)

- Fixed the repeater component to prevent form submission when users click the “Top” button on reorderable repeaters. [#128](https://github.com/blackbaud/skyux-lists/pull/128)

# 3.8.2 (2020-02-24)

- Fixed the repeater component to load faster when using reorderable repeater items. [#121](https://github.com/blackbaud/skyux-lists/pull/121)
- Fixed the repeater item component to properly update the `isSelected` property when the value changes using the `enter` or `space` keys. [#123](https://github.com/blackbaud/skyux-lists/pull/123) (Thanks, [@michael-tims](https://github.com/michael-tims)!)

# 4.0.0-rc.0 (2020-02-22)

### New features

- Added support for `@angular/core@^9`. [#124](https://github.com/blackbaud/skyux-lists/pull/124)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#124](https://github.com/blackbaud/skyux-lists/pull/124)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#124](https://github.com/blackbaud/skyux-lists/pull/124)

# 3.8.1 (2020-02-12)

- Fixed the repeater component to load faster when using a large number of repeater items. [#113](https://github.com/blackbaud/skyux-lists/pull/113)

# 3.8.0 (2020-02-11)

- Added support for the inline delete component to the repeater item component. [#111](https://github.com/blackbaud/skyux-lists/pull/111)

# 3.7.3 (2020-01-27)

- Fixed the repeater component to highlight the active item when when async lists load. [#107](https://github.com/blackbaud/skyux-lists/pull/107)

# 3.7.2 (2019-12-18)

- Fixed the repeater item component to prevent throwing errors when using the keyboard. [#104](https://github.com/blackbaud/skyux-lists/pull/104)
- Fixed the repeater item component to properly align header items. [#101](https://github.com/blackbaud/skyux-lists/pull/101)

# 3.7.1 (2019-11-27)

- Fixed the repeater item component to not steal focus from focusable child elements when they are activated. [#96](https://github.com/blackbaud/skyux-lists/pull/96)

# 3.7.0 (2019-11-15)

- Added the `tag` input to the repeater item component and the `orderChange` output to the repeater component to allow tracking of user updates to the repeater item order. [#91](https://github.com/blackbaud/skyux-lists/pull/91)
- Fixed the repeater component to properly handle reorderable repeaters without items. [#90](https://github.com/blackbaud/skyux-lists/pull/90) (Thanks, [@blackbaud-GavinNicol](https://github.com/blackbaud-GavinNicol)!)

# 3.6.1 (2019-11-06)

- Fixed the repeater item component to hide the expand/collapse chevron when items do not include content. [#84](https://github.com/blackbaud/skyux-lists/pull/84) (Thanks, [@blackbaud-GavinNicol](https://github.com/blackbaud-GavinNicol)!)

# 3.6.0 (2019-10-30)

- Added keyboard navigation controls to the repeater component. [#67](https://github.com/blackbaud/skyux-lists/pull/67)
- Fixed the repeater item component to make dynamically added items reorderable. [#80](https://github.com/blackbaud/skyux-lists/pull/80)

# 3.5.1 (2019-10-04)

- Fixed the repeater component to properly handle interactions with items that users can't reorder. [#74](https://github.com/blackbaud/skyux-lists/pull/74)

# 3.5.0 (2019-10-03)

- Added the ability to reorder repeater item components. [#62](https://github.com/blackbaud/skyux-lists/pull/62)
- Fixed the repeater item component to properly update the `isSelected` property when the value changes. [#71](https://github.com/blackbaud/skyux-lists/pull/71) (Thanks, [@blackbaud-GavinNicol](https://github.com/blackbaud-GavinNicol)!)

# 3.4.1 (2019-08-07)

- Fixed the repeater item component to properly align selection checkboxes and context menus. [#55](https://github.com/blackbaud/skyux-lists/pull/55)
- Fixed the repeater item component to hide the collapse chevron when items cannot collapse. [#56](https://github.com/blackbaud/skyux-lists/pull/56)

# 3.4.0 (2019-07-26)

- Added `activeIndex` to the repeater component properties to indicate which repeater item shows an active state. [#51](https://github.com/blackbaud/skyux-lists/pull/51)

# 3.3.1 (2019-06-26)

- Fixed the filter summary component to have correct spacing between filter summary items. [#42](https://github.com/blackbaud/skyux-lists/pull/42)

# 3.3.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#35](https://github.com/blackbaud/skyux-lists/pull/35)

# 3.2.2 (2019-05-06)

- Fixed repeater item component to allow custom inline form buttons. [#37](https://github.com/blackbaud/skyux-lists/pull/37)

# 3.2.1 (2019-04-18)

- Fixed repeater item component to have correct padding when no repeater item header is present. [#32](https://github.com/blackbaud/skyux-lists/pull/32)

# 3.2.0 (2019-04-15)

- Added inline form to repeater component. [#27](https://github.com/blackbaud/skyux-lists/pull/27)

# 3.1.0 (2019-03-07)

- Added `collapse` and `expand` events to repeater item component. [#25](https://github.com/blackbaud/skyux-lists/pull/25)

# 3.0.1 (2019-01-17)

- Fixed infinite scroll component to function properly after being re-enabled. [#13](https://github.com/blackbaud/skyux-lists/pull/13)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2018-12-19)

- Fixed repeater component to properly handle overflow content. [#9](https://github.com/blackbaud/skyux-lists/pull/9)
- Fixed repeater item component to vertically align context menus and checkboxes correctly. [#10](https://github.com/blackbaud/skyux-lists/pull/10)

# 3.0.0-rc.4 (2018-12-04)

- Added `isSelected` input to repeater item component. [#8](https://github.com/blackbaud/skyux-lists/pull/8)

# 3.0.0-rc.3 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#4](https://github.com/blackbaud/skyux-lists/pull/4)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#3](https://github.com/blackbaud/skyux-lists/pull/3)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#2](https://github.com/blackbaud/skyux-lists/pull/2)

# 3.0.0-rc.0 (2018-10-10)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-05)

- Initial alpha release.
