# 1.0.0-rc.3 (2019-01-30)

- Fixed a typo in the button description. Thanks [Di Huynh](https://github.com/Blackbaud-DiHuynh)! [#4](https://github.com/blackbaud/skyux-lib-code-block/pull/4)

- Adopt SkyLibResources [#5](https://github.com/blackbaud/skyux-lib-clipboard/pull/5)
  - Updated Versions of SKY UX and SKY UX Builder.
  - Moved the `skyux-builder-plugin-code-block` to a peerDependency instead of direct dependency.
  - Adopted the SkyLibResouces pipe for localized text.
  - Adopted the SKY UX SDK plugin.
  - Added the SkyCodeBlockResources module.
  - Removed the local WindowRef module in favor of the one provided from SKY UX.

# 1.0.0-rc.2 (2019-01-07)

- Added the `hideHeader` option to the code block. [#2](https://github.com/blackbaud/skyux-lib-code-block/pull/2)
- Updated the component to hide the header when the clipboard button is hidden and no languageType is declared. [#2](https://github.com/blackbaud/skyux-lib-code-block/pull/2)

# 1.0.0-rc.1 (2018-12-11)

- Initial Release Candidate.
