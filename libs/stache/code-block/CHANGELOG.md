# 4.0.0 (2020-05-22)

### New features

- Added support for `@angular/core@^9`. [#25](https://github.com/blackbaud/skyux-lib-code-block/pull/25)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#25](https://github.com/blackbaud/skyux-lib-code-block/pull/25)

### Bug fixes

- Fixed the `prismjs` imports to reference the ES6 modules. [#33](https://github.com/blackbaud/skyux-lib-code-block/pull/33)
- Removed the deep imports to `prismjs` to satisfy the warnings from the Angular Ivy Compiler. [#26](https://github.com/blackbaud/skyux-lib-code-block/pull/26)


# 2.0.0-rc.4 (2020-05-07)

- Upgraded the development dependencies. [#36](https://github.com/blackbaud/skyux-lib-code-block/pull/36)

# 2.0.0-rc.3 (2020-04-28)

### Bug fixes

- Fixed the `prismjs` imports to reference the ES6 modules. [#33](https://github.com/blackbaud/skyux-lib-code-block/pull/33)

# 2.0.0-rc.2 (2020-04-17)

- Added bug fixes and features from the `master` branch. [#31](https://github.com/blackbaud/skyux-lib-code-block/pull/31)

# 1.4.0 (2019-03-27)

- Added the `fileName` input for `sky-code-block` component and upgraded `prismjs` to `1.19.0`. [#29](https://github.com/blackbaud/skyux-lib-code-block/pull/29)

# 2.0.0-rc.1 (2020-02-24)

### Bug fixes

- Removed the deep imports to `prismjs` to satisfy the warnings from the Angular Ivy Compiler. [#26](https://github.com/blackbaud/skyux-lib-code-block/pull/26)

# 2.0.0-rc.0 (2020-02-22)

### New features

- Added support for `@angular/core@^9`. [#25](https://github.com/blackbaud/skyux-lib-code-block/pull/25)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#25](https://github.com/blackbaud/skyux-lib-code-block/pull/25)

# 1.4.0 (2019-08-13)

- Added `fileName` input for `sky-code-block` component and upgraded `prismjs` to `1.19.0`. [#29](https://github.com/blackbaud/skyux-lib-code-block/pull/29)

# 1.3.1 (2019-08-13)

- Adjusted CSS styles for `sky-code` component, reverted to previous color scheme. [#22](https://github.com/blackbaud/skyux-lib-code-block/pull/22)

# 1.3.0 (2019-06-25)

- Adjusted CSS styles for `sky-code` component. [#17](https://github.com/blackbaud/skyux-lib-code-block/pull/17)
- Updated development dependencies to support `@skyux-sdk/builder@3.7.0`, which addresses problems with the UMD library bundle. [#18](https://github.com/blackbaud/skyux-lib-code-block/pull/18)

# 1.2.0 (2019-05-14)

- Added `sky-code` component. [#15](https://github.com/blackbaud/skyux-lib-code-block/pull/15)

# 1.1.0 (2019-05-10)

- Added support for `prismjs@1.16.0`. [#13](https://github.com/blackbaud/skyux-lib-code-block/pull/13)
- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#13](https://github.com/blackbaud/skyux-lib-code-block/pull/13)

# 1.0.0 (2019-03-05)

- Initial major release.

# 1.0.0-rc.3 (2019-01-30)

- Fixed typo in button description. Thanks [Di Huynh](https://github.com/Blackbaud-DiHuynh)! [#4](https://github.com/blackbaud/skyux-lib-code-block/pull/4)

- Adopted `SkyLibResources`. [#5](https://github.com/blackbaud/skyux-lib-code-block/pull/5)
  - Updated versions of SKY UX and SKY UX Builder.
  - Changed `skyux-builder-plugin-code-block` to peer dependency instead of direct dependency.
  - Adopted `SkyLibResouces` pipe for localized text.
  - Adopted SKY UX SDK plugin.
  - Added `SkyCodeBlockResources` module.
  - Removed local `WindowRef` module in favor of one provided by SKY UX.

# 1.0.0-rc.2 (2019-01-07)

- Added `hideHeader` option to code block. [#2](https://github.com/blackbaud/skyux-lib-code-block/pull/2)
- Updated code block to hide header when clipboard button is hidden and no `languageType` is declared. [#2](https://github.com/blackbaud/skyux-lib-code-block/pull/2)

# 1.0.0-rc.1 (2018-12-11)

- Initial Release Candidate.
