# 4.0.1 (2020-07-15)

- Fixed the sidebar layout component to properly set the height of the sidebar when it is longer than the primary content. [#84](https://github.com/blackbaud/skyux-lib-stache/pull/84)

# 4.0.0 (2020-05-22)

### New features

- Added support for `@angular/core@^9`. [#68](https://github.com/blackbaud/skyux-lib-stache/pull/68)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#68](https://github.com/blackbaud/skyux-lib-stache/pull/68)

### Bug fixes

- Fixed the `InputConverter` to work when used with the Angular Ivy Compiler. [#70](https://github.com/blackbaud/skyux-lib-stache/pull/70)

# 4.0.0-rc.2 (2020-04-18)

- Added bug fixes and features from the `master` branch. [#75](https://github.com/blackbaud/skyux-lib-stache/pull/75)

# 3.3.0 (2020-03-13)

- Decreased the margin in the tutorial component. [#71](https://github.com/blackbaud/skyux-lib-stache/pull/71)

# 4.0.0-rc.1 (2020-02-24)

### Bug fixes

- Fixed the `InputConverter` to work when used with the Angular Ivy Compiler. [#70](https://github.com/blackbaud/skyux-lib-stache/pull/70)

# 4.0.0-rc.0 (2020-02-21)

### New features

- Added support for `@angular/core@^9`. [#68](https://github.com/blackbaud/skyux-lib-stache/pull/68)
- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#68](https://github.com/blackbaud/skyux-lib-stache/pull/68)

# 3.3.0 (2019-12-10)

- Decreased the margin used in the tutorial component. [#71](https://github.com/blackbaud/skyux-lib-stache/pull/71)

# 3.2.3 (2019-12-10)

- Fixed the sidebar to allow headers to link to external URLs. [#64](https://github.com/blackbaud/skyux-lib-stache/pull/64)

# 3.2.2 (2019-12-04)

- Fixed the action buttons component to support asynchronous route assignments. [#62](https://github.com/blackbaud/skyux-lib-stache/pull/62)

# 3.2.1 (2019-11-25)

- Reverted font changes. [#60](https://github.com/blackbaud/skyux-lib-stache/pull/60)

# 3.2.0 (2019-11-22)

- Updated the text font-family and color to match SKY UX style conventions. [#8](https://github.com/blackbaud/skyux-lib-stache/pull/8)
- Fixed the sidebar component to reassign "active" and "current" states when the `routerLinks` input changes. [#58](https://github.com/blackbaud/skyux-lib-stache/pull/58)

# 3.1.0 (2019-05-23)

- Exported the `StacheFooterModule` from `@blackbaud/skyux-lib-stache`. [#10](https://github.com/blackbaud/skyux-lib-stache/pull/10)

# 3.0.0 (2019-05-20)

- Initial major release.

# 3.0.0-beta.3 (2019-05-16)

- Added `StacheModule`. [#7](https://github.com/blackbaud/skyux-lib-stache/pull/7)

# 3.0.0-beta.2 (2019-05-14)

- Removed `stache-code` component in favor of `sky-code`, found in `@blackbaud/skyux-lib-code-block`. [#6](https://github.com/blackbaud/skyux-lib-stache/pull/6)

# 3.0.0-beta.1 (2019-05-14)

- Fixed wrapper module to add missing provider `STACHE_JSON_DATA_PROVIDERS`.
- Upgraded package dependencies.

# 3.0.0-beta.0 (2019-05-09)

- Initial migration to SKY UX 3 and Builder 3. [#1](https://github.com/blackbaud/skyux-lib-stache/pull/1)

# 2.18.0 (2019-04-22)
- Updated `stache-sidebar` to listen for updates to custom routes, which allows users to generate sidebar routes with dynamic data.

# 2.17.0 (2019-04-09)
- Added `stache-internal` component and directive, which allows content to be hidden from view if a user is not logged in with a BBID.
  - Lindsey Rix will be writing up documentation for this after she is able to test use cases for this feature.

# 2.16.0 (2019-04-05)
- Added CSS selector to prevent Stache from overwriting SKY UX styles. [#579](https://github.com/blackbaud/stache2/pull/579)
- Fixed issue where sidebar header didn't align properly when text wrapped. [#580](https://github.com/blackbaud/stache2/pull/580)
- Fixed issues with table of contents component. [#568](https://github.com/blackbaud/stache2/pull/568)
  - Fixed issue where sidebar didn't track user progress down the page when page height was updated dynamically. (e.g. `sky-repeater` component)
  - Fixed use cases around page anchor generation and tracking.

# 2.15.3 (2019-02-07)
- Fixed bug in `sky-code` component to correctly wrap long strings. [#569](https://github.com/blackbaud/stache2/pull/569)
- Updated `StacheJsonDataService` to allow for nested object access. [#570](https://github.com/blackbaud/stache2/pull/570)
  - Created `StacheJsonDataService` method `getNestedData` to fetch nested data by array.
  - Updated `StacheJsonDataService` method `getByName` to search nested data by string.
- Fixed bug in `stache-page-anchor` component to correctly position anchor icon when HTML is formatted on single line. [#573](https://github.com/blackbaud/stache2/pull/573)
- Updated dependencies for `skyux-lib-code-block` and `skyux-lib-clipboard` libraries. [#576](https://github.com/blackbaud/stache2/pull/576)

# 2.15.2 (2019-01-14)
- Updated version of SKY UX to 2.39.0.
- Updated the `stache-page-anchor` icon color to match the new SKY UX color scheme. [#566](https://github.com/blackbaud/stache2/pull/566)

# 2.15.1 (2019-01-07)
- Updated Sky code block to version `1.0.0-rc.2` to support the new `hideHeader` feature.

# 2.15.0 (2018-12-17)
- Separated out the Code Block and Clipboard modules [#563](https://github.com/blackbaud/stache2/pull/563)
  - Updated the `stache-copy-to-clipboard` component to use the new `sky-copy-to-clipboard` component.
  - Added the `skyux-lib-code-block` to the Stache module exports.
  - Added the `@deprecated` flag to the `sky-code-block` and `stache-clipboard` modules.
  - Updated the versions of SKY UX and the skyux-builder-plugin-stache.

# 2.14.1 (2018-12-10)
- Updated `stache-action-buttons` component to fix style bug where an action button appeared squished when displayed without other action buttons. [#561](https://github.com/blackbaud/stache2/pull/561)

# 2.14.0 (2018-11-29)
- Added `stache-hide-from-search` component to allow users to exclude content from Stache search results. [#557](https://github.com/blackbaud/stache2/pull/557)
- Fixed alignment issue with sidebar and table of contents. [#556](https://github.com/blackbaud/stache2/pull/556)
- Updated dependencies to use SKY UX components directly. [#553](https://github.com/blackbaud/stache2/pull/553)
  - Updated version of SKY UX Builder.
  - Updated Travis build options to enhance test utility.
- Updated the `stache-action-buttons` component to improve accessibility and allow action buttons without icons. [#548](https://github.com/blackbaud/stache2/pull/548)
- Updated `sky-code-block` component to improve accessibility by increasing the color contrast. [#551](https://github.com/blackbaud/stache2/pull/551)

# 2.13.0 (2018-10-23)
- Updated [skyux-builder-plugin-stache](https://github.com/blackbaud/skyux-builder-plugin-stache/blob/master/CHANGELOG.md#151-2018-08-02) dependency to `~1.7.0`.
  - Added the `skyux stache-update` command to update your projects SKY UX, SKY UX Builder, and Stache dependencies. The command also deletes the `node_modules` folder and runs `npm install`.
- Style changes to the `stache-table-of-contents` component. [#512](https://github.com/blackbaud/stache2/pull/512)
  - Updated TOC to place it to the right of the content on full-size views, and above the content on mobile views.
  - Updated TOC to affix to the top screen and follow users down the page as they scroll on full-size views.
  - Updated TOC to provide a visual indication of the current location on the page on full-size views.

# 2.12.0 (2018-09-20)
- Updated prismjs to version `1.15.0` to support all of the latest languages. [#532](https://github.com/blackbaud/stache2/pull/532) [#537](https://github.com/blackbaud/stache2/pull/537)
- Updated `code-block` component to allow for users to hide the `copy-to-clipboard` button. [#536](https://github.com/blackbaud/stache2/pull/536)
- Added `showInNav` property to `stache-wrapper`to allow users to hide pages from the sidebar. [#531](https://github.com/blackbaud/stache2/pull/531)
  - Updated to version [1.6.0](https://github.com/blackbaud/skyux-builder-plugin-stache/blob/70d6c2a1ce2b4d97a1b058abd3d13698f9a88375/CHANGELOG.md) of `skyux-builder-plugin-stache` to support this update.
- Fixed an issue where Stache header styles were overwriting Skyux style classes. [#535](https://github.com/blackbaud/stache2/pull/535)

# 2.11.4 (2018-09-10)
- Updated the SKYUX dependencies to the latest to avoid certifiacation issues when serving. [#529](https://github.com/blackbaud/stache2/pull/529)
- Added a `caption` input to the `stache-image` component, allowing users to add a caption to their images. [#528](https://github.com/blackbaud/stache2/pull/528)
- Thanks [@Blackbaud-ThomasOrtiz](https://github.com/Blackbaud-ThomasOrtiz)!

# 2.11.3 (2018-08-14)
- Fixed a bug with the `stacheNavLink` directive that prevented the use of external urls. [#521](https://github.com/blackbaud/stache2/pull/521)
- Updated the dependencies to `"@blackbaud/skyux": "2.19.0"` and ` "@blackbaud/skyux-builder": "1.19.2"`. [#521](https://github.com/blackbaud/stache2/pull/521)

# 2.11.2 (2018-08-07)
- Updated the [skyux-builder-plugin-stache](https://github.com/blackbaud/skyux-builder-plugin-stache/blob/master/CHANGELOG.md#151-2018-08-02) to `1.5.1`.

# 2.11.1 (2018-08-03)
- Updated version number for `skyux-builder-plugin-stache` to `1.5.0`, allowing users to have nested directories in the global Stache application data.

# 2.11.0 (2018-08-02)
- Added a header to the `sky-code-block` component that holds the copy-to-clipboard button and shows which language is being displayed. [#515](https://github.com/blackbaud/stache2/pull/515)

# 2.10.0 (2018-07-20)
- Created a `stache-copy-to-clipboard` component. [#506](https://github.com/blackbaud/stache2/pull/506)
- Added the `stache-copy-to-clipboard` to the `sky-code-block`.
- Added accessibility changes to the back to top button. [#505](https://github.com/blackbaud/stache2/pull/505)
- Fixed a bug causing the back to top button to move under the footer. [#504](https://github.com/blackbaud/stache2/pull/504)

# 2.9.2 (2018-07-02)
- Style adjustments [#498](https://github.com/blackbaud/stache2/pull/498)
  - Added padding to the `stache-hero` at mobile sizes.
  - Adjusted padding to be even at mobile sizes on the container layout.

# 2.9.1 (2018-07-02)
- Fixed a style bug that was adding extra margin to the `stache-hero` component. [#496](https://github.com/blackbaud/stache2/pull/496)

# 2.9.0 (2018-06-28)
- Style fixes. [#489](https://github.com/blackbaud/stache2/pull/489)
  - The sidebar now properly positions itself under the omnibar, dev bar, and elements above the stache-layout.
  - The sidebar now adjusts its height to not overlap the footer.
  - The page layouts are now a max-width of 1600px.
- Created the `stache-footer` component.
  - Added to the footer component to the layout's.
- Fixed a bug with the affix not functioning properly in IE.
- Fixed a bug with the affix not calculating the heights properly when applied to a nested element with a relative parent.

# 2.8.1 (2018-6-20)

- Style bugfixes. [#487](https://github.com/blackbaud/stache2/pull/487)
  - Style bugfix with sidebar button overlapping scroll bar.
  - Style bugfix with the container layout being off center.
  - Style change tutorial pattern width.
  - Style bugfix tutorial number z-index lowered.
  - Style enhancement the `sidebar-wrapper` now adds a class to the `stache-container` component to always add padding for the sidebar.

# 2.8.0 (2018-6-19)

- Refactored and restyled the sidebar layout. [#475](https://github.com/blackbaud/stache2/pull/475)
  - Created a `stache-sidebar-wrapper` component.
  - Refactored the styles for the `stache-container` component.
  - Removed use of the `sky-container` class.
  - Made better use of the page real estate.
  - Visually separated the nav from the page content as desired.
  - Fixed a bug with jumping sidebar when switching between pages that contained a vertical scroll bar vrs no scroll bar.
  - Fixed an issue with the sidebar not affixing in Internet Explorer.
  - Fixed a bug where the `isCurrent` styles were not being applied to the current route.
  - Collapsible sidebar made accessing the sidebar nav easier on mobile devices.
  - Meet accessibility testing standards for keyboard and screen reader navigation.
  - Updated the `nav-component` to make use of aria labels and attributes.
- Fixed a bug where the sidebar header was not displaying properly when route's were passed into the sidebar manually. [#474](https://github.com/blackbaud/stache2/pull/474)
- Added an optional input to the `stache-page-anchor` component allowing users to specify an id for their anchors. [#484](https://github.com/blackbaud/stache2/pull/484) - Thanks [@Blackbaud-LoriWeiss](https://github.com/Blackbaud-LoriWeiss)!

# 2.7.2 (2018-5-15)

- Updated StacheRouterLink to include browser context menu options on right-click and shift/ctrl/cmd+click functionality for opening new tabs/windows. Users should now use StacheRouterLink instead of Angular RouterLink. [#458](https://github.com/blackbaud/stache2/pull/458)

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

- Fixed a bug that caused `sky-code-block` to render without new lines in IE11. [#433](https://github.com/blackbaud/stache2/pull/433)
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

- Added support for `<sky-code-block>`'s in `<stache-include>` blocks to contain `{` and `}`. [#13](https://github.com/blackbaud/skyux-builder-plugin-stache/pull/13)
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
