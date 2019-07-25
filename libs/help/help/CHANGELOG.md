# 3.1.1 (2019-07-25)

- Fixed a bug where `HelpInitializationService` was not being provided by `BBHelpModule`. [#52](https://github.com/blackbaud/skyux-lib-help/pull/52)

# 3.1.0 (2019-06-21)
- Updated peer dependency to point to the official `2.0.0` release of `@blackbaud/help-client`. [#50](https://github.com/blackbaud/skyux-lib-help/pull/50)

# 3.0.0 (2019-06-21)
- Official 3.0.0 release.
- Added environmentId property to the HelpWidgetConfig model.

# 3.0.0-beta.0 (2019-06-14)
- Updated the library to support BB Help Widget V2. [#46](https://github.com/blackbaud/skyux-lib-help/pull/46)
  - Removed the Help Client as a direct dependency, now listed as a Peer Dependency to support custom versioning.

# 2.0.0 (2019-02-25)
- Updated the library for SKY UX 3 compatibility. [#44](https://github.com/blackbaud/skyux-lib-help/pull/44) - Thanks [Scott Freeman](https://github.com/Blackbaud-ScottFreeman)!

# 1.3.1 (2018-09-19)

- Fixed a bug with the Help Config interface to represent the current Help Widget config options. [#40](https://github.com/blackbaud/skyux-lib-help/pull/40)

# 1.3.0 (2018-05-09)

- Added the `bbHelpOpenOnClick` directive, allowing users to add an onClick event to elements to trigger the Help Widget. [#32](https://github.com/blackbaud/skyux-lib-help/pull/32)

# 1.2.0 (2018-04-23)

- Added an async `ready` check method to determine when the widget and client are both loaded and ready. [#30](https://github.com/blackbaud/skyux-lib-help/pull/30)
- Added methods to the widget service for interacting with the help widget. [#29](https://github.com/blackbaud/skyux-lib-help/pull/29)
  - `openWidget` async method for calling the `open` method on the widget with an optional helpKey.
  - `closeWidget` async method for calling the `close`method on the widget.
  - `disableWidget` async method for disabling the widget on specified pages.
  - `enableWidget` async method for enabling the widget once disabled.
- Added a directive `bbHelpDisableWidget` to disable the widget on pages. [#29](https://github.com/blackbaud/skyux-lib-help/pull/29)
- Added a component `bb-help` to act as a container for using the disable directive on pages. [#29](https://github.com/blackbaud/skyux-lib-help/pull/29)

# 1.1.0 (2017-10-10)

- Added a new method to interact with the `toggleOpen` method from the client. [#20](https://github.com/blackbaud/skyux-lib-help/pull/20)

# 1.0.1 (2017-10-06)
- `bb-help-key` added a new attribute, pageDefaultKey, for assigning a default help key to a page. [Pull #14](https://github.com/blackbaud/skyux-lib-help/pull/14)
- `bb-help-key` now watches for changes to the `helpKey` and `pageDefaultkey` and updates the `currentHelpKey` accordingly. [pull #18](https://github.com/blackbaud/skyux-lib-help/pull/18)

# 1.0.0 (2017-09-13)
- Initial Release

[Pull #5](https://github.com/blackbaud/skyux-lib-help/pull/5)
- `bb-help-key` component released.
- `HelpWidgetService` released.
- `HelpInitializationService` released.
- Shifting the dependency for `HelpClient` to this library from `skyux-builder`.

