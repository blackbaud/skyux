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
