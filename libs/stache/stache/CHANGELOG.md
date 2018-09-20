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
- Added a header to the `stache-code-block` component that holds the copy-to-clipboard button and shows which language is being displayed. [#515](https://github.com/blackbaud/stache2/pull/515)

# 2.10.0 (2018-07-20)
- Created a `stache-copy-to-clipboard` component. [#506](https://github.com/blackbaud/stache2/pull/506)
- Added the `stache-copy-to-clipboard` to the `stache-code-block`.
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
