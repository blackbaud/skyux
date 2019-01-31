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
