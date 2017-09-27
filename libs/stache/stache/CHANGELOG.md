# 2.0.0 (2017-09-27)

- Added support for SKY UX Builder `^1.0.0` and SKY UX `^2.0.0`. [#324](https://github.com/blackbaud/stache2/pull/324)
- Added Swagger UI component. [#306](https://github.com/blackbaud/stache2/pull/306)
- Added `alt` attribute support for image component. [#310](https://github.com/blackbaud/stache2/pull/310)
- Fixed omnibar covering page anchors. [#317](https://github.com/blackbaud/stache2/pull/317)
- Fixed incorrect styles for table of contents component. [#314](https://github.com/blackbaud/stache2/pull/314)

# 2.0.0-rc.3 (2017-08-31)

- Added support for SKY UX Builder `1.0.0-rc.17` and SKY UX `2.0.0-rc.12`. [#299](https://github.com/blackbaud/stache2/pull/299)
- Added `<stache-blockquote>` component. [#297](https://github.com/blackbaud/stache2/pull/297)
- Fixed a bug causing Stache 2 sites without the `name` property set in `skyuxconfig` to show as `unknown` in analytics. [#298](https://github.com/blackbaud/stache2/pull/298)

# 2.0.0-rc.2 (2017-08-11)

- Added support for `<stache-code-block>`'s in `<stache-include>` blocks to contain `{` and `}`. [#13](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/13)
- Updated `navOrder` to allow nav order to be set on only one item. [#288](https://github.com/blackbaud/stache2/pull/288)
- Limited support for `navOrder` values to [Counting Numbers](https://www.mathsisfun.com/definitions/counting-number.html). [#288](https://github.com/blackbaud/stache2/pull/288)
- Added support for SKY UX Builder `1.0.0-rc.15`. [#289](https://github.com/blackbaud/stache2/pull/288)
- Added support for SKY UX `2.0.0-rc.10`.[#287](https://github.com/blackbaud/stache2/pull/287)

# 2.0.0-rc.1 (2017-07-26)

- Moved SKY UX to peer dependency. [#283](https://github.com/blackbaud/stache2/pull/283)

# 2.0.0-rc.0 (2017-07-26)

- Converted `StachePageAnchorComponent` to an anchor tag, to allow users to open the link in a new window. [#277](https://github.com/blackbaud/stache2/pull/277)
- Added search form to `StacheActionButtonsComponent`. [#270](https://github.com/blackbaud/stache2/pull/270)
- Removed custom bundling commands, relying on SKY UX Builder's new `skyux build-public-library` command. (#234)[https://github.com/blackbaud/stache2/pull/234]
- Added support for external URLs in `StacheActionButtonsComponent`. [#262](https://github.com/blackbaud/stache2/pull/262)
- Added ability to include property bindings in `StacheTableOfContentsComponent`. [#261](https://github.com/blackbaud/stache2/pull/261)
- Added support for SKY UX `2.0.0-rc.9`. [#278](https://github.com/blackbaud/stache2/pull/278)
- Added support for SKY UX Builder `1.0.0-rc.12`.
- Updated version of Node.JS due to security implications. [#264](https://github.com/blackbaud/stache2/pull/264)
- Fixed `StacheAffixComponent` sizing issues on smaller screens. [#279](https://github.com/blackbaud/stache2/pull/279)
- General cleanup and refactoring of existing code. [#276](https://github.com/blackbaud/stache2/pull/276) [#269](https://github.com/blackbaud/stache2/pull/269) [#267](https://github.com/blackbaud/stache2/pull/267) [#259](https://github.com/blackbaud/stache2/pull/259) [#260](https://github.com/blackbaud/stache2/pull/260)

# 2.0.0-beta.9 (2017-07-06)

- Added `navOrder` to `<stache>` tag, to allow ordering of sidebar routes. [#242](https://github.com/blackbaud/stache2/pull/242)
- Added more language options for `StacheCodeBlockComponent`. [#245](https://github.com/blackbaud/stache2/pull/245)
- Added support for SKY UX `2.0.0-rc.4`.
- Added support for SKY UX Builder `1.0.0-rc.6`.
- Fixed bug with `StacheAffixComponent`. [#250](https://github.com/blackbaud/stache2/pull/250)

# 2.0.0-beta.8 (2017-06-30)

- Added support for SKY UX `2.0.0-rc.2`.
- Added support for SKY UX Builder `1.0.0-rc.4`.

# 2.0.0-beta.7 (2017-06-22)

- Updated SKY UX to `2.0.0-rc.1`.

# 2.0.0-beta.6 (2017-06-22)

- Moved `@blackbaud/skyux` to package dependencies.

# 2.0.0-beta.5 (2017-06-22)

- Updated SKY UX to `2.0.0-rc.0`.
- Updated SKY UX Builder to `1.0.0-rc.2`.
- Adjusted components to support Angular `4.x`. [#101](https://github.com/blackbaud/stache2/issues/101)

# 2.0.0-beta.4 (2017-06-16)

- Updated version of plugin to accept all patch releases.

# 2.0.0-beta.3 (2017-06-15)

- Fixed JSON Data, Route Metadata, and Config Service providers.
- Consolidated all plugins into a single plugin. [blackbaud/skyux-builder-plugin-stache](https://github.com/blackbaud/skyux-builder-plugin-stache)
- Fixed StacheAffixTopDirective width bug. [#221](https://github.com/blackbaud/stache2/issues/221)
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
