**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

___
# 5.0.3 (2022-02-24)

- Fixed the progress indicator status marker to use a color which conforms to accessibility color contrast standards. [#86](https://github.com/blackbaud/skyux-progress-indicator/pull/86)

# 5.0.2 (2022-01-04)

- Fixed an issue with overlays not being dismissed when using a progress indicator. [#80](https://github.com/blackbaud/skyux-progress-indicator/pull/80)

# 5.0.1 (2021-11-18)

- Added support for prettier code formatting and updated the builder to support StackBlitz. [#78](https://github.com/blackbaud/skyux-progress-indicator/pull/78)

# 5.0.0 (2021-09-30)

### New features

- Added support for Angular 12. [#68](https://github.com/blackbaud/skyux-progress-indicator/pull/68)
- Deprecated the `SkyProgressIndicatorDisplayMode` enum in favor of a string union type to support specifying string literals in Angular templates. [#69](https://github.com/blackbaud/skyux-progress-indicator/pull/69)

# 5.0.0-beta.3 (2021-09-22)

- Updated the peer dependencies. [#74](https://github.com/blackbaud/skyux-progress-indicator/pull/74)

# 5.0.0-beta.2 (2021-09-03)

- Migrated to Angular CLI. [#71](https://github.com/blackbaud/skyux-progress-indicator/pull/71)

# 5.0.0-beta.1 (2021-07-29)

- Deprecated the `SkyProgressIndicatorDisplayMode` enum in favor of a string union type to support specifying string literals in Angular templates. [#69](https://github.com/blackbaud/skyux-progress-indicator/pull/69)

# 5.0.0-beta.0 (2021-07-14)

- Initial beta release.
- Added support for `@angular/core@^12`. [#68](https://github.com/blackbaud/skyux-progress-indicator/pull/68)
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#68](https://github.com/blackbaud/skyux-progress-indicator/pull/68)

# 4.1.0 (2021-04-21)

- Added modern theme styles to the progress indicator component. [#66](https://github.com/blackbaud/skyux-progress-indicator/pull/66)

# 4.0.1 (2020-08-05)

- Fixed the progress indicator component to prevent errors when the progress indicator and its external navigation buttons are hidden at the same time. [#40](https://github.com/blackbaud/skyux-progress-indicator/pull/46)

# 4.0.0 (2020-05-20)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#39](https://github.com/blackbaud/skyux-progress-indicator/pull/39)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#39](https://github.com/blackbaud/skyux-progress-indicator/pull/39)

# 4.0.0-rc.0 (2020-04-20)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#39](https://github.com/blackbaud/skyux-progress-indicator/pull/39)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#39](https://github.com/blackbaud/skyux-progress-indicator/pull/39)

# 3.3.0 (2020-03-30)

- Added support for asynchronous calls before step advancement occurs in the progress indicator component. [#36](https://github.com/blackbaud/skyux-progress-indicator/pull/36)

# 3.2.0 (2019-11-04)

- Added support for `@skyux-sdk/builder@3.11.0`. [#31](https://github.com/blackbaud/skyux-progress-indicator/pull/31)
- Fixed the spacing between buttons for the progress indicator component's horizontal mode. [#31](https://github.com/blackbaud/skyux-progress-indicator/pull/31)

# 3.1.1 (2019-09-11)

- Fixed the progress indicator component to properly handle dynamically created steps. [#26](https://github.com/blackbaud/skyux-progress-indicator/pull/26)

# 3.1.0 (2019-05-17)

- Updated the progress indicator message stream to accept `SkyProgressIndicatorMessage` types. [#19](https://github.com/blackbaud/skyux-progress-indicator/pull/19)
- Updated the progress indicator component. [#17](https://github.com/blackbaud/skyux-progress-indicator/pull/17)
  - Added a finish button.
  - Added the ability to go to a specific step.
  - Fixed the disabled state for buttons to no longer be required.
  - Fixed the component to properly reset the state of steps when navigating backward.

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.1 (2018-12-11)

- Fixed the progress indicator component's `progressChanges` emitter to only fire after all Angular lifecycle hooks have completed. [#3](https://github.com/blackbaud/skyux-progress-indicator/pull/3)

# 3.0.0-rc.0 (2018-11-12)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-11-07)

- Initial alpha release.
