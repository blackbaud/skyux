# 2.7.1 (2018-5-11)

- Fixed an issue with the anchor icon on stache-page-anchor's not displaying. [#462](https://github.com/blackbaud/stache2/pull/462)

# 2.7.0 (2018-5-9)

- StacheRouterLink bugfixes [#452](https://github.com/blackbaud/stache2/pull/452)
  - Fixed issues that stopped the page from navigating to a fragment on another page, if the current page also contained a fragment with the same name.
  - Fixed issue where navigation would not occure if path was `.` and it contained a fragment.
- Fixed spacing under stache-edit-button. [#454](https://github.com/blackbaud/stache2/pull/454)
- Updated functionality that set browser Page Title. [#448](https://github.com/blackbaud/stache2/pull/448)
  - Included navTitle and tutorialHeader as options for browser page title when pageTitle stache attribute is absent.
  - Fixed issue where page title would display as ` - AppName` when no title was provided.
- Fixed an issue where multiple scrollbars would appear with sidebar. [#456](https://github.com/blackbaud/stache2/pull/456)
- Fixed an issue where if the route.path was an array, it would never match the currentPath. [#456](https://github.com/blackbaud/stache2/pull/456)

# 2.6.0 (2018-4-13)

- Refactored Table of Contents and Page Anchor components. [#441](https://github.com/blackbaud/stache2/pull/441) - Thanks [@Blackbaud-StacyCarlos](https://github.com/Blackbaud-StacyCarlos)!
  - Fixed a bug where the TOC would not load links until the user scrolled.
  - Refactored the page anchors to allow nested anchors from child components to still load in the TOC.
- Fixed a bug that caused tutorial card headers to have too much space above the title when the Omnibar was present. [#440](https://github.com/blackbaud/stache2/pull/440)

# 2.5.2 (2018-4-11)

- Fixed a bug that caused the sidebar to jitter when it required a scroll bar while the main content did not. [#438](https://github.com/blackbaud/stache2/pull/438)

# 2.5.1 (2018-4-2)

- Fixed a bug that caused `stache-code-block` to render without new lines in IE11. [#433](https://github.com/blackbaud/stache2/pull/433)
- Fixed a bug that caused the window to scroll too far down on `stache-page-anchors` when omnibar was present without `affix-top` being called first. [#431](https://github.com/blackbaud/stache2/pull/431)

# 2.5.0 (2018-3-28)

- Routing and navigation updates: [#426](https://github.com/blackbaud/stache2/pull/426)
  - Updated nav component to support the use of route params in the url.
  - Refactored components to use the router service when determining active URL.
  - Refactored `scrollToElement` to use `element.scrollIntoView`.
  - Fixed a bug with breadcrumbs displaying the route params when present in the url.
  - Fixed a bug with in-page navigation and fragment routing when route params were present in the url.

# 2.4.0 (2018-1-25)

- Added link directive. [#382](https://github.com/blackbaud/stache2/pull/382)
- Added edit button component. [#379](https://github.com/blackbaud/stache2/pull/379)

# 2.3.0 (2017-12-4)

- Fixed a bug with the Affix overlapping when used with the omnibar. [#374](https://github.com/blackbaud/stache2/pull/374)
- Removed Smooth Scroll. [#378](https://github.com/blackbaud/stache2/pull/378)
- Added Search as an explicit dependency. [#381](https://github.com/blackbaud/stache2/pull/381)
- Fixed various bugs with the sidebar, including text overlapping issues, jumping issue with long sidebars. [#334](https://github.com/blackbaud/stache2/pull/334)

# 2.2.0 (2017-11-29)

- Removed Search Provider. [#361](https://github.com/blackbaud/stache2/pull/361)
- Added Markdown component. [#353](https://github.com/blackbaud/stache2/pull/353)

# 2.1.0 (2017-11-3)

- Added Search Provider for site search. [#320](https://github.com/blackbaud/stache2/pull/320)
- Added HTTP Service. [#342](https://github.com/blackbaud/stache2/pull/342)

# 2.0.1 (2017-09-29)

- Removed Swagger UI component due to build-time issues. [#328](https://github.com/blackbaud/stache2/pull/328)
- Fixed style bug with tutorial header component. [#329](https://github.com/blackbaud/stache2/pull/329)

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
