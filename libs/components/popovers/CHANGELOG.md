# 3.5.2 (2020-04-10)

- Fixed the dropdown component to prevent propagation of the escape key when the dropdown menu is open. [#75](https://github.com/blackbaud/skyux-popovers/pull/75)
- Fixed the dropdown component to properly handle the `click` event handler on dropdown menu items. [#75](https://github.com/blackbaud/skyux-popovers/pull/75)
- Fixed the dropdown component to find a valid placement on initialization. [#76](https://github.com/blackbaud/skyux-popovers/pull/76)
- Removed the deprecation message from the popover component's `skyPopoverTrigger` property. [#74](https://github.com/blackbaud/skyux-popovers/pull/74)

# 3.5.1 (2020-04-08)

- Added a deprecation message to the `SkyPopoverTrigger` type. [#63](https://github.com/blackbaud/skyux-popovers/pull/63)
- Fixed the dropdown component to properly set all ARIA attributes. [#67](https://github.com/blackbaud/skyux-popovers/pull/67)
- Fixed `SkyPopoverContext` to stop throwing build warnings. [#63](https://github.com/blackbaud/skyux-popovers/pull/63)

# 3.5.0 (2020-04-02)

- Updated the dropdown and popover components to implement the affix and overlay services. [#61](https://github.com/blackbaud/skyux-popovers/pull/61)

# 3.4.0 (2019-10-09)

- Added the `allowFullscreen` input property to the popover component. The dropdown component uses the `allowFullscreen` input property to prevent dropdown menu items from displaying in full screen. [#36](https://github.com/blackbaud/skyux-popovers/pull/36)

# 3.3.0 (2019-08-19)

- Added the `buttonIsFocused` and `menuIsFocused` properties to the dropdown component. [#30](https://github.com/blackbaud/skyux-popovers/pull/30)

# 3.2.0 (2019-08-14)

- Added support for anchor elements in the dropdown menu component. [#28](https://github.com/blackbaud/skyux-popovers/pull/28)

# 3.1.1 (2019-06-21)

- Updated development dependencies to support `@skyux-sdk/builder@3.7.0`, which addresses problems with the UMD library bundle. [#17](https://github.com/blackbaud/skyux-popovers/pull/17)

# 3.1.0 (2019-06-20)

- Updated development dependencies to support `@skyux-sdk/builder@3.6.7`. [#17](https://github.com/blackbaud/skyux-popovers/pull/17)

# 3.0.0 (2019-01-14)

- Major version release.

# 3.0.0-rc.4 (2018-12-03)

- Updated a dependency to properly style the hover state for a selected tab that is not disabled. [blackbaud/skyux-theme#41](https://github.com/blackbaud/skyux-theme/pull/41)

# 3.0.0-rc.3 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#6](https://github.com/blackbaud/skyux-popovers/pull/6)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-popovers/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-popovers/pull/3)

# 3.0.0-rc.0 (2018-10-05)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-04)

- Initial alpha release.
