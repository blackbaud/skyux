**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

---

# 5.0.2 (2022-02-07)

- Fixed the summary action bar expand button to have proper accessibility attributes. [#75](https://github.com/blackbaud/skyux-action-bars/pull/75)

# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#71](https://github.com/blackbaud/skyux-action-bars/pull/71)

# 5.0.0 (2021-10-01)

### New features

- Added support for Angular 12. [#54](https://github.com/blackbaud/skyux-action-bars/pull/54)

### Breaking changes

- Removed `BrowserAnimationsModule` from the `imports` section of `SkySummaryActionBarModule` to support lazy-loading. Consumers of `SkySummaryActionBarModule` must now import `BrowserAnimationsModule` into their application's root module. [#54](https://github.com/blackbaud/skyux-action-bars/pull/54)

# 5.0.0-beta.4 (2021-09-13)

- Updated peer dependencies. [#67](https://github.com/blackbaud/skyux-action-bars/pull/67)

# 5.0.0-beta.3 (2021-09-08)

- Updated peer dependencies. [#65](https://github.com/blackbaud/skyux-action-bars/pull/65)

# 5.0.0-beta.2 (2021-09-02)

- Migrated to Angular CLI. [#63](https://github.com/blackbaud/skyux-action-bars/pull/63)

# 5.0.0-beta.1 (2021-08-06)

- Added bug fixes and features from the master branch. [#62](https://github.com/blackbaud/skyux-action-bars/pull/62)

# 4.2.2 (2021-08-05)

- Fixed the secondary action dropdown menu to collapse when clicking an action. [#60](https://github.com/blackbaud/skyux-action-bars/pull/60)

# 5.0.0-beta.0 (2021-07-09)

- Initial beta release.
- Added support for `5.0.0-beta.*` versions of SKY UX component libraries. [#59](https://github.com/blackbaud/skyux-action-bars/pull/59)

# 4.2.1 (2021-06-11)

- Fixed the module name in the installation documentation. [#57](https://github.com/blackbaud/skyux-action-bars/pull/57)

# 5.0.0-alpha.0 (2021-05-21)

- Added support for `@angular/core@^12`. [#54](https://github.com/blackbaud/skyux-action-bars/pull/54)
- Removed `BrowserAnimationsModule` from the `imports` section of `SkySummaryActionBarModule` to support lazy-loading. Consumers of `SkySummaryActionBarModule` must now import `BrowserAnimationsModule` into their application's root module. [#54](https://github.com/blackbaud/skyux-action-bars/pull/54)

# 4.2.0 (2021-04-19)

- Added modern theme styles to the summary action bar component. [#49](https://github.com/blackbaud/skyux-action-bars/pull/49)

# 4.1.0 (2020-12-04)

- Added a summary action bar test fixture. [#47](https://github.com/blackbaud/skyux-action-bars/pull/47)

# 4.0.1 (2020-06-11)

- Fixed the bundle to work properly with Angular Ivy Compiler. [#33](https://github.com/blackbaud/skyux-action-bars/pull/33)

# 4.0.0 (2020-05-21)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#29](https://github.com/blackbaud/skyux-action-bars/pull/29)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#29](https://github.com/blackbaud/skyux-action-bars/pull/29)

# 4.0.0-rc.0 (2020-04-18)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#29](https://github.com/blackbaud/skyux-action-bars/pull/29)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#29](https://github.com/blackbaud/skyux-action-bars/pull/29)

# 3.1.3 (2019-11-19)

- Fixed the summary action bar component to properly style modal footers when multiple modals are open. [#25](https://github.com/blackbaud/skyux-action-bars/pull/25)

# 3.1.2 (2019-10-07)

- Fixed the summary action bar component to remove an accidental peer dependency on `@skyux/split-view`. [#22](https://github.com/blackbaud/skyux-action-bars/pull/22)

# 3.1.1 (2019-09-11)

- Fixed the summary action bar component to properly update the page's bottom padding when the action bar expands and collapses. [#18](https://github.com/blackbaud/skyux-action-bars/pull/18)

# 3.1.0 (2019-08-14)

- Added the ability to declare the summary action bar component inside the split view component. [#16](https://github.com/blackbaud/skyux-action-bars/pull/16)
- Added support for `@skyux-sdk/builder@3.8.1`. [#15](https://github.com/blackbaud/skyux-action-bars/pull/15)

# 3.0.1 (2019-03-19)

- Fixed the spacing between actions and summary info in the summary action bar component. [#9](https://github.com/blackbaud/skyux-action-bars/pull/9)
- Fixed the spacing between action buttons in the summary action bar component. [#10](https://github.com/blackbaud/skyux-action-bars/pull/10)

# 3.0.0 (2019-02-05)

- Major version release.

# 3.0.0-rc.1 (2019-01-25)

- Fixed the summary action bar component to apply the proper visual styles when placed inside a tabset. [#3](https://github.com/blackbaud/skyux-action-bars/pull/3)

# 3.0.0-rc.0 (2019-01-10)

- Initial release candidate.
