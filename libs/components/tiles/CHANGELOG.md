**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.3 (2022-02-04)

- Removed an outdated reference to entry components. [#90](https://github.com/blackbaud/skyux-tiles/pull/92)

# 5.0.2 (2022-01-27)

- Fixed the tile controls to have proper accessibility attributes. [#89](https://github.com/blackbaud/skyux-tiles/pull/89)

# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#87](https://github.com/blackbaud/skyux-tiles/pull/87)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#81](https://github.com/blackbaud/skyux-tiles/pull/81)

### Breaking changes

- Removed `BrowserAnimationsModule` from the `imports` section of `SkyTilesModule` to support lazy-loading. Consumers of `SkyTilesModule` must now import `BrowserAnimationsModule` into their application's root module. [#78](https://github.com/blackbaud/skyux-tiles/pull/78)

# 5.0.0-beta.2 (2021-09-14)

- Added support for "partial" Ivy compilation mode. [#83](https://github.com/blackbaud/skyux-tiles/pull/83)
- Updated the peer dependencies. [#83](https://github.com/blackbaud/skyux-tiles/pull/83)

# 5.0.0-beta.1 (2021-08-27)

- Migrated to Angular CLI. [#81](https://github.com/blackbaud/skyux-tiles/pull/81)

# 5.0.0-beta.0 (2021-07-14)

- Initial `5.0.0-beta` release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#79](https://github.com/blackbaud/skyux-tiles/pull/79)

# 5.0.0-alpha.0 (2021-05-24)

- Added support for `@angular/core@^12`. [#78](https://github.com/blackbaud/skyux-tiles/pull/78)
- Removed `BrowserAnimationsModule` from the `imports` section of `SkyTilesModule` to support lazy-loading. Consumers of `SkyTilesModule` must now import `BrowserAnimationsModule` into their application's root module. [#78](https://github.com/blackbaud/skyux-tiles/pull/78)

# 4.1.0 (2021-03-25)

- Added modern theme styles to the tile component. [#75](https://github.com/blackbaud/skyux-tiles/pull/75)

# 4.0.2 (2020-08-07)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#68](https://github.com/blackbaud/skyux-tiles/pull/68)

# 4.0.1 (2020-06-11)

- Fixed the tile dashboard component to update tiles using `OnPush` change detection when it receives messages from the message stream. [#59](https://github.com/blackbaud/skyux-tiles/pull/59)

# 4.0.0 (2020-05-15)

### New features

- Added support for `@angular/core@^9`. [#49](https://github.com/blackbaud/skyux-tiles/pull/49)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#49](https://github.com/blackbaud/skyux-tiles/pull/49)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers may install `rxjs-compat@^6` to support older versions of `rxjs`. [#49](https://github.com/blackbaud/skyux-tiles/pull/49)

# 4.0.0-rc.2 (2020-02-22)

- Updated Angular and SKY UX package peer dependencies. [#51](https://github.com/blackbaud/skyux-tiles/pull/51)

# 4.0.0-rc.1 (2020-02-22)

- Removed the deep imports to `ng2-dragula` to support the Angular Ivy compiler. [#50](https://github.com/blackbaud/skyux-tiles/pull/50)

# 4.0.0-rc.0 (2020-02-21)

### New features

- Added support for `@angular/core@^9`. [#49](https://github.com/blackbaud/skyux-tiles/pull/49)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#49](https://github.com/blackbaud/skyux-tiles/pull/49)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers may install `rxjs-compat@^6` to support older versions of `rxjs`. [#49](https://github.com/blackbaud/skyux-tiles/pull/49)

# 3.3.0 (2020-01-21)

- Added support for the SKY UX default theme to the tile dashboard. This ensures the tile dashboard will display the correct background color and padding for the default theme's white page background. [#45](https://github.com/blackbaud/skyux-tiles/pull/45)

# 3.2.0 (2019-11-25)

- Added a tile dashboard message stream to allow other components to remotely control its functions. [#42](https://github.com/blackbaud/skyux-tiles/pull/42)

# 3.1.2 (2019-07-17)

- Fixed the tile dashboard service to no longer cause undefined errors in a flyout component. [#38](https://github.com/blackbaud/skyux-tiles/pull/38) (Thanks @Blackbaud-KrisMahon)
- Fixed the tile dashboard service to better handle errors when loading user configuration settings. [#38](https://github.com/blackbaud/skyux-tiles/pull/38) (Thanks @Blackbaud-KrisMahon)

# 3.1.1 (2019-07-15)

- Fixed `SkyTileModule` to import the missing `BrowserAnimationsModule`. [#32](https://github.com/blackbaud/skyux-tiles/pull/32)

# 3.1.0 (2019-05-17)

- Added the ability to trigger responsive styles based on a parent component. [#29](https://github.com/blackbaud/skyux-tiles/pull/29)

# 3.0.1 (2019-01-18)

- Fixed the tile header component to align the title on the baseline in Microsoft Edge and IE 11. [#25](https://github.com/blackbaud/skyux-tiles/pull/25)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.6 (2018-12-06)

- Fixed the tile component's help button to display by default when the consumer provides `helpClick` listener. [#18](https://github.com/blackbaud/skyux-tiles/pull/18)

# 3.0.0-rc.5 (2018-12-04)

- Added UI config service hooks to the tile dashboard service. [#11](https://github.com/blackbaud/skyux-tiles/pull/11)

# 3.0.0-rc.4 (2018-12-03)

- Added an optional help button to the tile component's header. [#14](https://github.com/blackbaud/skyux-tiles/pull/14)

# 3.0.0-rc.3 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#12](https://github.com/blackbaud/skyux-tiles/pull/12)

# 3.0.0-rc.2 (2018-10-25)

- Updated the drag handle to have a more reliable click target. [#9](https://github.com/blackbaud/skyux-tiles/pull/9)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#8](https://github.com/blackbaud/skyux-tiles/pull/8)

# 3.0.0-rc.0 (2018-10-02)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-01)

- Initial alpha release.
