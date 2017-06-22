# 2.0.0-beta.5 (2017-06-22)

- Updated SKY UX to `2.0.0-rc.0`.
- Updated SKY UX Builder to `1.0.0-rc.2`.
- Adjusted components to support Angular `4.x`. ([#101](https://github.com/blackbaud/stache2/issues/101))

# 2.0.0-beta.4 (2017-06-16)

- Updated version of plugin to accept all patch releases.

# 2.0.0-beta.3 (2017-06-15)

- Fixed JSON Data, Route Metadata, and Config Service providers.
- Consolidated all plugins into a single plugin. ([blackbaud/skyux-builder-plugin-stache](https://github.com/blackbaud/skyux-builder-plugin-stache))
- Fixed StacheAffixTopDirective width bug. ([#221](https://github.com/blackbaud/stache2/issues/221))
- Removed `StacheConfigService` and `SkyAppConfig` from **app-extras.module.ts**.

# 2.0.0-beta.2 (2017-06-08)

- 100% function code coverage
- Implemented new components and directives: `StacheTutorialComponent`, `StacheAffixComponent`, `StacheGoogleAnalyticsDirective`.
- Implemented service to convert JSON files into usable JavaScript objects, `StacheJsonDataService`.
- Route names can be changed using the `<stache>` attributes `pageTitle` or `navTitle`.
- New SKY UX Builder plugins were created for various reasons (check each plugin's README for more information): 
  - [`@blackbaud/skyux-builder-plugin-auth-email-whitelist`](https://github.com/blackbaud/skyux-builder-plugin-auth-email-whitelist)
  - [`@blackbaud/skyux-builder-plugin-stache-json-data`](https://github.com/blackbaud/skyux-builder-plugin-stache-json-data)
  - [`@blackbaud/skyux-builder-plugin-stache-template-reference-variable`](https://github.com/blackbaud/skyux-builder-plugin-stache-template-reference-variable)
  - [`@blackbaud/skyux-builder-plugin-stache-route-metadata/collector`](https://github.com/blackbaud/skyux-builder-plugin-stache-route-metadata)
  - [`@blackbaud/skyux-builder-plugin-stache-route-metadata/generator`](https://github.com/blackbaud/skyux-builder-plugin-stache-route-metadata)
- Fixed line-heights for list items and navigation. [#158](https://github.com/blackbaud/stache2/issues/158)
- Fixed StacheActionButtonsComponent styles when displaying less than 4 Action Buttons. [#171](https://github.com/blackbaud/stache2/issues/171)



# 2.0.0-beta.1 (2017-05-31)

- Updated dependencies and included the Auth Email Whitelist plugin.
- Updated README.
- Fixed async tests. [#159](https://github.com/blackbaud/stache2/issues/159)

# 2.0.0-beta.0 (2017-05-12)

- Initial release to NPM.
