# 1.1.1 (2019-06-25)

- Fixed an issue where the copy button text did not return to the original state after users selected it. [#15](https://github.com/blackbaud/skyux-lib-clipboard/pull/15)
- Updated development dependencies to support `@skyux-sdk/builder@3.7.0`, which addresses problems with the UMD library bundle. [#17](https://github.com/blackbaud/skyux-lib-clipboard/pull/17)

# 1.1.0 (2019-05-10)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#13](https://github.com/blackbaud/skyux-lib-clipboard/pull/13)

# 1.0.0 (2019-03-04)

- Initial major release.

# 1.0.0-rc.3 (2019-01-31)

- Added `aria-label` attribute to copy to clipboard component's button element. [#9](https://github.com/blackbaud/skyux-lib-clipboard/pull/9)

# 1.0.0-rc.2 (2019-01-30)

- Adopted `SkyLibResources`. [#6](https://github.com/blackbaud/skyux-lib-clipboard/pull/6)
  - Updated versions of SKY UX and SKY UX Builder.
  - Adopted `SkyLibResouces` pipe for localized text.
  - Adopted SKY UX SDK plugin.
  - Added fixture for testing copy to clipboard component.
  - Added `SkyClipboardResources` module.
  - Removed local `WindowRef` module in favor of one provided by SKY UX.

# 1.0.0-rc.1 (2018-12-10)

- Initial release for copy to clipboard component. [#4](https://github.com/blackbaud/skyux-lib-clipboard/pull/4)
