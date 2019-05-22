# 3.0.0 (2019-05-22)

- Initial major release.

# 3.0.0-beta.2 (2019-05-22)

- Added support for template-driven forms. [#4](https://github.com/blackbaud/skyux-autonumeric/pull/4)

# 3.0.0-beta.1 (2019-05-22)

- Fixed `skyAutonumeric` directive to work with reactive forms. [#3](https://github.com/blackbaud/skyux-autonumeric/pull/3)

### Breaking changes
- Removed `skyAutonumericOptions` and `skyAutonumericPreset` inputs on the `skyAutonumeric` directive. AutoNumeric options can now be set directly using the `skyAutonumeric` attribute (e.g., `[skyAutonumeric]="options"`).
- Replaced `SkyAutonumericConfig` with `SkyAutonumericOptionsProvider`. See README.md for details.

# 3.0.0-beta.0 (2019-05-21)

- Initial beta release.
