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
