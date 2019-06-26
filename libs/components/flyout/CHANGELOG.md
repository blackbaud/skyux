# 3.2.1 (2019-06-26)

- Fixed the flyout component to not error when used with Angular 7. [#56](https://github.com/blackbaud/skyux-flyout/pull/56)

# 3.2.0 (2019-06-14)

- Added the ability to use the UI Config Service to save flyout component widths. [#53](https://github.com/blackbaud/skyux-flyout/pull/53)
- Fixed the flyout component to remain open while resizing when the mouse is outside of the flyout. [#52](https://github.com/blackbaud/skyux-flyout/pull/52)

# 3.1.1 (2019-06-10)

- Fixed the flyout component to handle click events that originate within its contents. [#44](https://github.com/blackbaud/skyux-flyout/pull/44)
- Fixed the flyout component to style the resize handle and iterator buttons correctly in Internet Explorer. [#45](https://github.com/blackbaud/skyux-flyout/pull/45)
- Fixed the flyout component to limit its maximum width to 20 pixels less than the window's width. [#46](https://github.com/blackbaud/skyux-flyout/pull/46)
- Fixed the flyout component to set the default width to half of the window's width unless consumers specify a different default. [#47](https://github.com/blackbaud/skyux-flyout/pull/47)
- Fixed the flyout component to handle a default width that is less than the minimum width. [#49](https://github.com/blackbaud/skyux-flyout/pull/49)
- Fixed the flyout component to only use fullscreen visual styles when the minimum width can't fit inside the window. [#50](https://github.com/blackbaud/skyux-flyout/pull/50)

# 3.1.0 (2019-05-17)

- Added the ability for the flyout component to trigger its child components' responsive styles. [#31](https://github.com/blackbaud/skyux-flyout/pull/31)

# 3.0.3 (2019-04-25)

- Fixed the flyout component to remain open when users click internal components. [#30](https://github.com/blackbaud/skyux-flyout/pull/30)

# 3.0.2 (2019-04-15)

- Added missing RxJS imports that caused compilation errors in some consuming applications. [#27](https://github.com/blackbaud/skyux-flyout/pull/27)  (Thanks @Blackbaud-KevinHutson)

# 3.0.1 (2019-03-20)

- Fixed the flyout component to close when navigation occurs. [#22](https://github.com/blackbaud/skyux-flyout/pull/22)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2019-01-10)

- Updated the flyout component to improve performance. [#16](https://github.com/blackbaud/skyux-flyout/pull/16)
- Fixed styles on the flyout component's resize handle in Firefox. [#15](https://github.com/blackbaud/skyux-flyout/pull/15)

# 3.0.0-rc.4 (2018-12-20)

- Added iterator buttons to the flyout component. [#10](https://github.com/blackbaud/skyux-flyout/pull/10) (Thanks @Theaggarwal)
- Updated the flyout service to utilize `SkyDynamicComponentService`. [#9](https://github.com/blackbaud/skyux-flyout/pull/9)

# 3.0.0-rc.3 (2018-11-20)

- Fixed the flyout component to not close when an overlay above it is clicked. [#3](https://github.com/blackbaud/skyux-flyout/pull/3)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#6](https://github.com/blackbaud/skyux-flyout/pull/6)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#4](https://github.com/blackbaud/skyux-flyout/pull/4)

# 3.0.0-rc.0 (2018-10-08)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
