# Changelog

## [7.14.0](https://github.com/blackbaud/skyux/compare/7.13.0...7.14.0) (2023-03-29)


### Features

* **components/pages:** deprecate the needs attention message field ([#1188](https://github.com/blackbaud/skyux/issues/1188)) ([c96b1bc](https://github.com/blackbaud/skyux/commit/c96b1bcc9c49e46e25a06d10abd679edfe16bf5c))


### Deprecations

* **components/forms:** deprecate radioType and checkboxType ([#1191](https://github.com/blackbaud/skyux/issues/1191)) ([a5128dc](https://github.com/blackbaud/skyux/commit/a5128dc63a17cf8e2ea6acd8754077ee9fc70c45))

## [8.0.0-alpha.13](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.12...8.0.0-alpha.13) (2023-03-27)


### Features

* **components/indicators:** help inline visual test ([#1160](https://github.com/blackbaud/skyux/issues/1160)) ([#1165](https://github.com/blackbaud/skyux/issues/1165)) ([201b9c3](https://github.com/blackbaud/skyux/commit/201b9c37230f4e4ec8c9ef272125750a7fdb779f))
* **components/indicators:** icon visual test ([#1168](https://github.com/blackbaud/skyux/issues/1168)) ([#1170](https://github.com/blackbaud/skyux/issues/1170)) ([e4a70c3](https://github.com/blackbaud/skyux/commit/e4a70c3422c5bcb4f9ad43999b758acfa5a4806d))
* **components/pages:** update action hub to match current design ([#1169](https://github.com/blackbaud/skyux/issues/1169)) ([4357639](https://github.com/blackbaud/skyux/commit/4357639be5203bacaf02a6c87868a24a3dfe40d1))


### Bug Fixes

* **components/forms:** set search background transparent when not focused ([#1156](https://github.com/blackbaud/skyux/issues/1156)) ([5c7f9e1](https://github.com/blackbaud/skyux/commit/5c7f9e14b329e7745f9aab0ca754739318bdc742))
* **components/indicators:** fix SkyWaitHarnessFilters docs reference to SkyWaitHarness which incorrectly referenced SkyAlertHarness ([#1171](https://github.com/blackbaud/skyux/issues/1171)) ([#1172](https://github.com/blackbaud/skyux/issues/1172)) ([d414630](https://github.com/blackbaud/skyux/commit/d414630bffd177400f08f98e2c305bba7da1fdca))

## [7.13.0](https://github.com/blackbaud/skyux/compare/7.12.0...7.13.0) (2023-03-24)


### Features

* **components/indicators:** help inline visual test ([#1160](https://github.com/blackbaud/skyux/issues/1160)) ([915e696](https://github.com/blackbaud/skyux/commit/915e69652ec906c494cac5da2a47da7baaada709))
* **components/indicators:** icon visual test ([#1168](https://github.com/blackbaud/skyux/issues/1168)) ([00c8215](https://github.com/blackbaud/skyux/commit/00c8215c21ca11109c7abb200e088b4fec9044f6))


### Bug Fixes

* **components/indicators:** fix `SkyWaitHarnessFilters` docs reference to `SkyWaitHarness` which incorrectly referenced `SkyAlertHarness` ([#1171](https://github.com/blackbaud/skyux/issues/1171)) ([0dadf18](https://github.com/blackbaud/skyux/commit/0dadf182e8a7771f34411da0f3f026727cfa98fe))
* **components/lookup:** use `position: absolute` for autocomplete dropdown ([#1176](https://github.com/blackbaud/skyux/issues/1176)) ([2540096](https://github.com/blackbaud/skyux/commit/2540096fe165a292ccab7f71fd426eb7e60fa601))

## [8.0.0-alpha.12](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.11...8.0.0-alpha.12) (2023-03-17)


### ⚠ BREAKING CHANGES

* **components/popovers:** The dropdown component's `buttonType` input has been converted from a `string` input type to a `SkyDropdownButtonType` `string` union. It no longer supports specifying an icon to be displayed as the button content. This might cause problems if you are setting the `buttonType` input to a type of `string` in your consuming component's class.

### Features

* **components/popovers:** remove string as valid input on dropdown buttonType ([#1155](https://github.com/blackbaud/skyux/issues/1155)) ([da88367](https://github.com/blackbaud/skyux/commit/da88367d4da01cc16fc71fa1e91da5d5eaae5670))
* **components/text-editor:** add support for `dompurify@3.0.1` ([#1153](https://github.com/blackbaud/skyux/issues/1153)) ([5d2c481](https://github.com/blackbaud/skyux/commit/5d2c48123b9070f7d7d08775771a73389b21e633))
* **sdk/prettier-schematics:** add prettier dependencies to `ng update` ([#1157](https://github.com/blackbaud/skyux/issues/1157)) ([e005b33](https://github.com/blackbaud/skyux/commit/e005b33dc19bc1ea9d5d29c8907e7b6a45b554aa))


### Bug Fixes

* **components/ag-grid:** relax height style rules ([#1158](https://github.com/blackbaud/skyux/issues/1158)) ([#1162](https://github.com/blackbaud/skyux/issues/1162)) ([f4b10af](https://github.com/blackbaud/skyux/commit/f4b10af7f0847b31f9db9bb7f33de06478d4f9be))
* **components/packages:** update polyfills files for library projects ([#1159](https://github.com/blackbaud/skyux/issues/1159)) ([9e4b7fc](https://github.com/blackbaud/skyux/commit/9e4b7fcb1ef6a9f03510f41f7e74c869538f49f2))

## [7.12.0](https://github.com/blackbaud/skyux/compare/7.11.1...7.12.0) (2023-03-17)


### Features

* **components/theme:** add selected input and item colors ([#1146](https://github.com/blackbaud/skyux/issues/1146)) ([533a1f8](https://github.com/blackbaud/skyux/commit/533a1f80da76d19732831ce59c168e63cfed3e5b))


### Bug Fixes

* **components/ag-grid:** relax height style rules ([#1158](https://github.com/blackbaud/skyux/issues/1158)) ([1d8de99](https://github.com/blackbaud/skyux/commit/1d8de9991a04bc98c3c0bf770d18e5b885621312))
* **components/text-editor:** only paste text once, only reinitialize editor if already rendered ([#1143](https://github.com/blackbaud/skyux/issues/1143)) ([2482c30](https://github.com/blackbaud/skyux/commit/2482c302cd955c63176e1740eba7d0c8dd951669))

## [8.0.0-alpha.11](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.10...8.0.0-alpha.11) (2023-03-16)


### Features

* **components/layout:** remove margin from action button container ([#1152](https://github.com/blackbaud/skyux/issues/1152)) ([e0396d1](https://github.com/blackbaud/skyux/commit/e0396d1f4cfa5669cfb81a30e0d39ff913365d70))


### Bug Fixes

* **components/core:** apply default options for numeric service ([#1151](https://github.com/blackbaud/skyux/issues/1151)) ([7990727](https://github.com/blackbaud/skyux/commit/7990727234d71da42fe504fdb887d2caca877c13))
* **components/packages:** remove polyfills from `src/test.ts` ([#1149](https://github.com/blackbaud/skyux/issues/1149)) ([1381258](https://github.com/blackbaud/skyux/commit/1381258e65401640721860acb52e4b53ca7fa19d))

## [8.0.0-alpha.10](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.9...8.0.0-alpha.10) (2023-03-15)


### Features

* **components/forms:** remove bottom margin from selection box grid ([#1141](https://github.com/blackbaud/skyux/issues/1141)) ([75e91cc](https://github.com/blackbaud/skyux/commit/75e91cc89f8241bb5ddf8e13abf7e5bbaa395a55))


### Bug Fixes

* **components/ag-grid:** avoid unneeded api calls for row selection ([#1135](https://github.com/blackbaud/skyux/issues/1135)) ([#1137](https://github.com/blackbaud/skyux/issues/1137)) ([3840d49](https://github.com/blackbaud/skyux/commit/3840d49a48eee6f866619a10673213518e1851ff))
* **components/indicators:** fix disabled token color, remove new color ([#1142](https://github.com/blackbaud/skyux/issues/1142)) ([a9c0a95](https://github.com/blackbaud/skyux/commit/a9c0a95157a943e6f644558fb7775e10604f3f2f))
* **components/layout:** remove extra toolbar space in modern ([#1148](https://github.com/blackbaud/skyux/issues/1148)) ([c4d7734](https://github.com/blackbaud/skyux/commit/c4d77348264855bb82f81d04ad00f8f12a49774d))
* **components/text-editor:** only paste text once, only reinitialize editor if already rendered ([#1143](https://github.com/blackbaud/skyux/issues/1143)) ([#1144](https://github.com/blackbaud/skyux/issues/1144)) ([04556f6](https://github.com/blackbaud/skyux/commit/04556f6f2e74e8a0a061828c6982d96cb494d843))


### Reverts

* remove requirement for `esModuleInterop` ([#1107](https://github.com/blackbaud/skyux/issues/1107)) ([#1147](https://github.com/blackbaud/skyux/issues/1147)) ([6c012b9](https://github.com/blackbaud/skyux/commit/6c012b987b6c9cb948635e35a347601c18ab533a))

## [7.11.1](https://github.com/blackbaud/skyux/compare/7.11.0...7.11.1) (2023-03-14)


### Bug Fixes

* **components/ag-grid:** avoid unneeded api calls for row selection ([#1135](https://github.com/blackbaud/skyux/issues/1135)) ([6c8f9df](https://github.com/blackbaud/skyux/commit/6c8f9df1d6566de16b7962f3014d89c8d85c3df7))

## [8.0.0-alpha.9](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.8...8.0.0-alpha.9) (2023-03-14)


### Features

* **components/forms:** update selected state background colors ([#1126](https://github.com/blackbaud/skyux/issues/1126)) ([8c820dd](https://github.com/blackbaud/skyux/commit/8c820dd58905ce533743b4eb790c891897d00a55))


### Bug Fixes

* **components/indicators:** adopt `@skyux/icons@5.3.1` ([#1133](https://github.com/blackbaud/skyux/issues/1133)) ([5937000](https://github.com/blackbaud/skyux/commit/5937000d1b2fcd2ad15030062b2345ce90918ea6))

## [7.11.0](https://github.com/blackbaud/skyux/compare/7.10.1...7.11.0) (2023-03-10)


### Features

* **components/indicators:** help inline test harness ([#1124](https://github.com/blackbaud/skyux/issues/1124)) ([d418a79](https://github.com/blackbaud/skyux/commit/d418a79205600373105d65048fe032fc2462d9c9))


### Bug Fixes

* **components/ag-grid:** switch row delete overlay to only clip in stacking context ([#1123](https://github.com/blackbaud/skyux/issues/1123)) ([33b22e7](https://github.com/blackbaud/skyux/commit/33b22e7fbc2c0f931e485eaf89539ab53d42086c))

## [8.0.0-alpha.8](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.7...8.0.0-alpha.8) (2023-03-10)


### ⚠ BREAKING CHANGES

* **components/layout:** Components that expect text expand repeater to have a top margin will need to be updated to compensate for the removed margin.

### Features

* **components/indicators:** help inline test harness ([#1124](https://github.com/blackbaud/skyux/issues/1124)) ([#1127](https://github.com/blackbaud/skyux/issues/1127)) ([f0e575c](https://github.com/blackbaud/skyux/commit/f0e575c2e189153419fcd143227c1b04cc9a595c))
* **components/layout:** remove top margin from text expand repeater ([#1110](https://github.com/blackbaud/skyux/issues/1110)) ([abc27bc](https://github.com/blackbaud/skyux/commit/abc27bccd3b63a5ee9c2c7930089857142a3079d))
* **components/packages:** add schematic to set `resolveJsonModule` to `true` ([#1125](https://github.com/blackbaud/skyux/issues/1125)) ([e4b00eb](https://github.com/blackbaud/skyux/commit/e4b00eb08677f9e626ce62b50bd52974b56c1725))


### Bug Fixes

* add `@types/dragula` to dependencies of packages that use ng2-dragula ([#1121](https://github.com/blackbaud/skyux/issues/1121)) ([c94669b](https://github.com/blackbaud/skyux/commit/c94669b619221fd9eaaa818a171e86becaf8579e))
* **components/ag-grid:** remove hover states for read-only data grid([#1104](https://github.com/blackbaud/skyux/issues/1104)) ([#1113](https://github.com/blackbaud/skyux/issues/1113)) ([e9c3712](https://github.com/blackbaud/skyux/commit/e9c371230479dfaf7b0f40788a2f292d0ac90e93))
* **components/ag-grid:** switch row delete overlay to only clip in stacking context ([#1123](https://github.com/blackbaud/skyux/issues/1123)) ([#1129](https://github.com/blackbaud/skyux/issues/1129)) ([2a43fd8](https://github.com/blackbaud/skyux/commit/2a43fd86c6a49f8a984ce83f54943848831ed1d3))
* **components/phone-field:** phone field inputs now animate in modern theme ([#1101](https://github.com/blackbaud/skyux/issues/1101)) ([#1115](https://github.com/blackbaud/skyux/issues/1115)) ([0e65c97](https://github.com/blackbaud/skyux/commit/0e65c97bb6e5fd40e406506177d14ce60032a4e6))
* **components/phone-field:** placeholder text displays in all themes when searching for a country ([#1098](https://github.com/blackbaud/skyux/issues/1098)) ([#1108](https://github.com/blackbaud/skyux/issues/1108)) ([541c7a7](https://github.com/blackbaud/skyux/commit/541c7a7603dc7e31d053f5b6023cddc1824a83d1))
* remove requirement for `esModuleInterop` ([#1107](https://github.com/blackbaud/skyux/issues/1107)) ([7906fd9](https://github.com/blackbaud/skyux/commit/7906fd969af407d3f92228c65d410c35498e994d))

## [7.10.1](https://github.com/blackbaud/skyux/compare/7.10.0...7.10.1) (2023-03-09)


### Bug Fixes

* **components/ag-grid:** remove hover states for read-only data grid ([#1104](https://github.com/blackbaud/skyux/issues/1104)) ([03e41c0](https://github.com/blackbaud/skyux/commit/03e41c0930ec9245025487f68573cb388eea3c1a))
* **components/phone-field:** phone field inputs now animate in modern theme ([#1101](https://github.com/blackbaud/skyux/issues/1101)) ([46b32b9](https://github.com/blackbaud/skyux/commit/46b32b9c046fcb50a3e26b4fe3b5f285ea65903f))
* **components/phone-field:** placeholder text displays in all themes when searching for a country ([#1098](https://github.com/blackbaud/skyux/issues/1098)) ([78b53aa](https://github.com/blackbaud/skyux/commit/78b53aab4a6104b2bcd4a2c8152f1687f7fd4847))

## [8.0.0-alpha.7](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.6...8.0.0-alpha.7) (2023-03-08)


### ⚠ BREAKING CHANGES

* **components/packages:** A project name must be provided when a workspace has more than one project.
* **components/datetime:** The timepicker component's `timeFormat` input has been converted from a `string` input type to a `SkyTimepickerTimeFormatType` `string` union. This might cause problems if you are setting the `timeFormat` input to a type of `string` in your consuming comopnent's class.
* **components/lists:** The repeater component's `expandMode` input was set to allow values of type of `string` but it really only supported a handful of known `string` values represented by the `SkyRepeaterExpandModeType` `string` union. This ability to specify a `string` value has been removed. This might cause problems if you are setting the `expandMode` input to a type of `string` in your consuming component's class.
* **components/tabs:** The tabset nav button component's `buttonType` input was set to allow values of type of `string` but it really only supported a handful of known `string` values represented by the `SkyTabsetNavButtonType` `string` union. This ability to specify a `string` value has been removed. This might cause problems if you are setting the `buttonType` input to a type of `string` in your consuming component's class.

### Features

* **components/datetime:** update `timeFormat` type from string to string union ([#1077](https://github.com/blackbaud/skyux/issues/1077)) ([a4ac3c4](https://github.com/blackbaud/skyux/commit/a4ac3c45d1affa4ac4c76981856266f610927761))
* **components/lists:** update the `SkyRepeaterComponent` `expandMode` input to no longer support `string` values ([#1076](https://github.com/blackbaud/skyux/issues/1076)) ([b4219c4](https://github.com/blackbaud/skyux/commit/b4219c4bf6c8b5ce35f0178e916d924739bdfa1f))
* **components/packages:** make `--project` a required parameter for `ng add` schematics ([#1073](https://github.com/blackbaud/skyux/issues/1073)) ([c24d41f](https://github.com/blackbaud/skyux/commit/c24d41fca28ab6322b33c9e9c3b41c56e72bfefa))
* **components/tabs:** add `messageStream` and `tabsVisibleChanged` to sectioned form and deprecate public methods ([#1075](https://github.com/blackbaud/skyux/issues/1075)) ([fc57440](https://github.com/blackbaud/skyux/commit/fc5744035a1d3ec6159477bc7d9276cc509f4197))
* **components/tabs:** update the `SkyTabsetNavButtonComponent` `buttonType` input to no longer support `string` values ([#1074](https://github.com/blackbaud/skyux/issues/1074)) ([865acd0](https://github.com/blackbaud/skyux/commit/865acd0041633695645a2ec6d5de978be28d37ec))
* update ng2-dragula to 4.0.0 ([#1084](https://github.com/blackbaud/skyux/issues/1084)) ([a89c8a6](https://github.com/blackbaud/skyux/commit/a89c8a6a250601e5e74fa15e4f96bbddbda920a1))


### Bug Fixes

* **components/modals:** modal headers now use h2 elements to better follow accessibility standards ([#969](https://github.com/blackbaud/skyux/issues/969)) ([4365d1a](https://github.com/blackbaud/skyux/commit/4365d1a16fcd3ba4377ed08c983052b6756ba3a7))

## [8.0.0-alpha.6](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.5...8.0.0-alpha.6) (2023-03-03)


### Features

* **components/indicators:** icon test harness ([#994](https://github.com/blackbaud/skyux/issues/994)) ([#1069](https://github.com/blackbaud/skyux/issues/1069)) ([a5bc29b](https://github.com/blackbaud/skyux/commit/a5bc29ba6de1e3847b5ed70fdd05aa96c0f8b95d))


### Bug Fixes

* **components/ag-grid:** set header to use default text color ([#1062](https://github.com/blackbaud/skyux/issues/1062)) ([#1067](https://github.com/blackbaud/skyux/issues/1067)) ([7e5980f](https://github.com/blackbaud/skyux/commit/7e5980f89065754e8223fe4989f1fcaa90e9311a))
* **components/modals:** remove z-index rule from modal content ([#1061](https://github.com/blackbaud/skyux/issues/1061)) ([#1064](https://github.com/blackbaud/skyux/issues/1064)) ([25fc521](https://github.com/blackbaud/skyux/commit/25fc521957cb1a7d79e90034df20f89f85564035))
* **components/packages:** add content to polyfills.ts ([#1065](https://github.com/blackbaud/skyux/issues/1065)) ([a340051](https://github.com/blackbaud/skyux/commit/a340051e3afcd5dbb4da65eb83c57b47b1cc8bd6))

## [7.10.0](https://github.com/blackbaud/skyux/compare/7.9.1...7.10.0) (2023-03-03)


### Features

* **components/indicators:** icon test harness ([#994](https://github.com/blackbaud/skyux/issues/994)) ([244eb23](https://github.com/blackbaud/skyux/commit/244eb23b284060bd61e94ac71b6295e134b356a4))


### Bug Fixes

* **components/ag-grid:** set header to use default text color ([#1062](https://github.com/blackbaud/skyux/issues/1062)) ([8aa8f7e](https://github.com/blackbaud/skyux/commit/8aa8f7ed5032371a76f1117910876ae8bbe46ca8))
* **components/modals:** remove z-index rule from modal content ([#1061](https://github.com/blackbaud/skyux/issues/1061)) ([b8380fe](https://github.com/blackbaud/skyux/commit/b8380fe92bbea016c8dee7d104614a62b3baded4))

## [8.0.0-alpha.5](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.4...8.0.0-alpha.5) (2023-03-03)


### Bug Fixes

* **components/core:** only log warnings once per browser session ([#1059](https://github.com/blackbaud/skyux/issues/1059)) ([4dc1eac](https://github.com/blackbaud/skyux/commit/4dc1eac7457592f74f84c0b10c4a5e9eef3e3245))
* **components/packages:** use named export for 'update-polyfill' schematic ([#1057](https://github.com/blackbaud/skyux/issues/1057)) ([bc554d6](https://github.com/blackbaud/skyux/commit/bc554d6208329509857f290e198402e6de46fd2a))

## [8.0.0-alpha.4](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.3...8.0.0-alpha.4) (2023-03-03)


### Bug Fixes

* **components/packages:** fix `update-polyfill` schematic factory path ([#1054](https://github.com/blackbaud/skyux/issues/1054)) ([02faab3](https://github.com/blackbaud/skyux/commit/02faab3fe75532f72ca94ce1282cf38f54d2049d))

## [8.0.0-alpha.3](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.2...8.0.0-alpha.3) (2023-03-03)


### Features

* **components/core:** update dock component to fit within viewport ([#1022](https://github.com/blackbaud/skyux/issues/1022)) ([0e04a62](https://github.com/blackbaud/skyux/commit/0e04a62a5dea375dc1e1846c317bf84445fa44ba))


### Bug Fixes

* **components/packages:** add package.json to exports ([#1052](https://github.com/blackbaud/skyux/issues/1052)) ([0c40b65](https://github.com/blackbaud/skyux/commit/0c40b655cc3b21acd7d8329b0ae709f44d1c39af))

## [8.0.0-alpha.2](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.1...8.0.0-alpha.2) (2023-03-02)


### ⚠ BREAKING CHANGES

* **components/packages:** migrate to `@skyux/packages/polyfills` in project configuration ([#1033](https://github.com/blackbaud/skyux/issues/1033))
* **components/config:** In previous major versions, query string config parameter values were not decoded when retrieving them via `SkyAppRuntimeConfigParams`. Any code that decoded these values after retrieving them should be removed.
* **components/theme:** remove unused z-index SCSS vars ([#1029](https://github.com/blackbaud/skyux/issues/1029))

### Features

* **components/config:** decode query string config params ([#1028](https://github.com/blackbaud/skyux/issues/1028)) ([e893554](https://github.com/blackbaud/skyux/commit/e89355465446a3f70761f30dd97835f6658e19ac))
* **components/core:** create stacking context service ([#1004](https://github.com/blackbaud/skyux/issues/1004)) ([#1026](https://github.com/blackbaud/skyux/issues/1026)) ([4fcac3d](https://github.com/blackbaud/skyux/commit/4fcac3d41f13903f4cac12aa3adf81c473fbba7e))
* **components/core:** only log warnings once per application instance ([#1043](https://github.com/blackbaud/skyux/issues/1043)) ([b120d90](https://github.com/blackbaud/skyux/commit/b120d90ec7236fbf46769e6588a44ed258a93d40))
* **components/packages:** migrate to `@skyux/packages/polyfills` in project configuration ([#1033](https://github.com/blackbaud/skyux/issues/1033)) ([5c200e4](https://github.com/blackbaud/skyux/commit/5c200e45a64eb4c1071b9634835339712b578e16))
* **components/theme:** remove unused z-index SCSS vars ([#1029](https://github.com/blackbaud/skyux/issues/1029)) ([e4e282d](https://github.com/blackbaud/skyux/commit/e4e282df306624ebb09d042c781b8e7a7dfffd59))
* **components/theme:** update SKY UX icons version ([#1001](https://github.com/blackbaud/skyux/issues/1001)) ([#1019](https://github.com/blackbaud/skyux/issues/1019)) ([d40c72b](https://github.com/blackbaud/skyux/commit/d40c72b1e95875038683a8f9216f0a1b98e00e23))


### Bug Fixes

* **components/ag-grid:** row delete overlay did not show in modal ([#981](https://github.com/blackbaud/skyux/issues/981)) ([#1031](https://github.com/blackbaud/skyux/issues/1031)) ([9a83aad](https://github.com/blackbaud/skyux/commit/9a83aadd885396b7eed8a0e33d5c4675bc1afc1e))
* **components/ag-grid:** support domlayout normal option for layout ([#1011](https://github.com/blackbaud/skyux/issues/1011)) ([#1030](https://github.com/blackbaud/skyux/issues/1030)) ([a98c3e1](https://github.com/blackbaud/skyux/commit/a98c3e1eda1266f7afbbe57f99377be44ae8180e))
* **components/datetime:** apply stacking context ([#1035](https://github.com/blackbaud/skyux/issues/1035)) ([#1040](https://github.com/blackbaud/skyux/issues/1040)) ([7e9d6b9](https://github.com/blackbaud/skyux/commit/7e9d6b931c5e08c4a3fd17b63a3abdbbbba6234a))
* **components/forms:** only apply indeterminate styling to checkboxes ([#1016](https://github.com/blackbaud/skyux/issues/1016)) ([#1027](https://github.com/blackbaud/skyux/issues/1027)) ([95884e9](https://github.com/blackbaud/skyux/commit/95884e969d56222082d22330ad614aaade6ade76))
* **components/lookup:** apply stacking context ([#1036](https://github.com/blackbaud/skyux/issues/1036)) ([#1042](https://github.com/blackbaud/skyux/issues/1042)) ([21eca39](https://github.com/blackbaud/skyux/commit/21eca396f5a029c0003f75be91f38f4d613aacb9))
* **components/packages:** remove v7 update schematics ([#1025](https://github.com/blackbaud/skyux/issues/1025)) ([890fa75](https://github.com/blackbaud/skyux/commit/890fa75268f2604de00598551a7fb37c855e5b6c))
* **components/popovers:** apply stacking context ([#1037](https://github.com/blackbaud/skyux/issues/1037)) ([#1041](https://github.com/blackbaud/skyux/issues/1041)) ([8591a33](https://github.com/blackbaud/skyux/commit/8591a3334c422bf37241a79492570f51fbf7660a))

## [7.9.1](https://github.com/blackbaud/skyux/compare/7.9.0...7.9.1) (2023-03-01)


### Bug Fixes

* **components/datetime:** apply stacking context ([#1035](https://github.com/blackbaud/skyux/issues/1035)) ([f1dc230](https://github.com/blackbaud/skyux/commit/f1dc230dd94ae881caa3f0bc5846335f45272495))
* **components/lookup:** apply stacking context ([#1036](https://github.com/blackbaud/skyux/issues/1036)) ([4afeafb](https://github.com/blackbaud/skyux/commit/4afeafb0105d6eb289e71e24ed4f187509ebf13a))
* **components/popovers:** apply stacking context ([#1037](https://github.com/blackbaud/skyux/issues/1037)) ([746874f](https://github.com/blackbaud/skyux/commit/746874f9b0d9fd39a6e52b815a24f0cf6b54c677))

## [7.9.0](https://github.com/blackbaud/skyux/compare/7.8.1...7.9.0) (2023-02-28)


### Features

* **components/core:** create stacking context service ([#1004](https://github.com/blackbaud/skyux/issues/1004)) ([6500101](https://github.com/blackbaud/skyux/commit/6500101c41403e52f29c5fffaac63bdfdf376b3a))
* **components/core:** update dock component to fit within viewport ([#1022](https://github.com/blackbaud/skyux/issues/1022)) ([c4198f7](https://github.com/blackbaud/skyux/commit/c4198f7ca5b55d3ecf7540c1c2fcc0f33ddff5a2))

### Bug Fixes

* **components/ag-grid:** row delete overlay did not show in modal ([#981](https://github.com/blackbaud/skyux/issues/981)) ([992403b](https://github.com/blackbaud/skyux/commit/992403b7a5dcd93ef1a09b404625da85d6b8b73e))
* **components/ag-grid:** support domlayout normal option for layout ([#1011](https://github.com/blackbaud/skyux/issues/1011)) ([4b905ff](https://github.com/blackbaud/skyux/commit/4b905ff6303d1797ccd4077085b1cc1432e6acea))

## [8.0.0-alpha.1](https://github.com/blackbaud/skyux/compare/8.0.0-alpha.0...8.0.0-alpha.1) (2023-02-27)


### Bug Fixes

* **components/ag-grid:** adjust a11y test for ag-grid ([#1012](https://github.com/blackbaud/skyux/issues/1012)) ([#1013](https://github.com/blackbaud/skyux/issues/1013)) ([7a97686](https://github.com/blackbaud/skyux/commit/7a97686e81a4c554482ad80b3a4750cc4660a562))
* **components/ag-grid:** support right-align header in AG Grid 28 ([#998](https://github.com/blackbaud/skyux/issues/998)) ([#1008](https://github.com/blackbaud/skyux/issues/1008)) ([1de3f99](https://github.com/blackbaud/skyux/commit/1de3f9982cb76be64f7b7aaec1b53f162bebf24e))
* **components/core:** add clip-path option for overlay ([#980](https://github.com/blackbaud/skyux/issues/980)) ([#1010](https://github.com/blackbaud/skyux/issues/1010)) ([d2df897](https://github.com/blackbaud/skyux/commit/d2df89777a337ff160a17301bd70744b204254a4))
* **components/packages:** include `ng add` template files in public exports ([#1015](https://github.com/blackbaud/skyux/issues/1015)) ([b087324](https://github.com/blackbaud/skyux/commit/b087324015e58463f56bc9a94482bf11d287a5ec))
* **components/text-editor:** content is only pasted once into the text editor ([#997](https://github.com/blackbaud/skyux/issues/997)) ([dd99d3c](https://github.com/blackbaud/skyux/commit/dd99d3cfbc08d2707210f264071ee1e2b13e3788))

## [7.8.1](https://github.com/blackbaud/skyux/compare/7.8.0...7.8.1) (2023-02-27)


### Bug Fixes

* **components/ag-grid:** adjust a11y test for ag-grid ([#1012](https://github.com/blackbaud/skyux/issues/1012)) ([0c7ba9e](https://github.com/blackbaud/skyux/commit/0c7ba9ed3b26703eb7e4bf95c1f878be2e3968ed))
* **components/ag-grid:** support right-align header in AG Grid 28 ([#998](https://github.com/blackbaud/skyux/issues/998)) ([99c6cab](https://github.com/blackbaud/skyux/commit/99c6cab96186622d72e562bd65c8988c40a74728))
* **components/core:** add clip-path option for overlay ([#980](https://github.com/blackbaud/skyux/issues/980)) ([1707f8d](https://github.com/blackbaud/skyux/commit/1707f8d4f4a5c9c82c81d86770511f58b6170430))
* **components/forms:** only apply indeterminate styling to checkboxes ([#1016](https://github.com/blackbaud/skyux/issues/1016)) ([a0d2215](https://github.com/blackbaud/skyux/commit/a0d221547ce92529ebcb34a9ede6c7beb8933c08))
* **components/text-editor:** content is only pasted once into the text editor ([#997](https://github.com/blackbaud/skyux/issues/997)) ([#1006](https://github.com/blackbaud/skyux/issues/1006)) ([902584b](https://github.com/blackbaud/skyux/commit/902584b13d79e2c807752004adbf48aa94959b31))

## [7.8.0](https://github.com/blackbaud/skyux/compare/7.7.0...7.8.0) (2023-02-17)


### Features

* **components/theme:** update SKY UX icons version ([#1001](https://github.com/blackbaud/skyux/issues/1001)) ([8b4227c](https://github.com/blackbaud/skyux/commit/8b4227c7dbd406f5d82d45e8bfbf1d7ba11140ea))

## [8.0.0-alpha.0](https://github.com/blackbaud/skyux/compare/7.6.1...8.0.0-alpha.0) (2023-02-17)


### ⚠ BREAKING CHANGES

* support Angular 15 ([#984](https://github.com/blackbaud/skyux/issues/984))

### Features

* support Angular 15 ([#984](https://github.com/blackbaud/skyux/issues/984)) ([4cef2d0](https://github.com/blackbaud/skyux/commit/4cef2d07aa52a178f78ac5faacf483f4f7a94df8))


### Bug Fixes

* **components/ag-grid:** address accessibility test issues ([#982](https://github.com/blackbaud/skyux/issues/982)) ([#987](https://github.com/blackbaud/skyux/issues/987)) ([25f3dff](https://github.com/blackbaud/skyux/commit/25f3dff658bd8fcc84e1b2cad12ba150fb2ff306))
* **components/ag-grid:** apply lookup addClick handler ([#992](https://github.com/blackbaud/skyux/issues/992)) ([#999](https://github.com/blackbaud/skyux/issues/999)) ([257114a](https://github.com/blackbaud/skyux/commit/257114acef2b485119fd9b6f7807234ae017e52a))

## [7.7.0](https://github.com/blackbaud/skyux/compare/7.6.2...7.7.0) (2023-02-16)


### Features

* **components/action-bars:** update summary action bar to respect reserved viewport space ([#993](https://github.com/blackbaud/skyux/issues/993)) ([f0c7b19](https://github.com/blackbaud/skyux/commit/f0c7b1927ac2ebcf28ec384df70905079002a95f))


### Bug Fixes

* **components/ag-grid:** apply lookup addClick handler ([#992](https://github.com/blackbaud/skyux/issues/992)) ([86cba17](https://github.com/blackbaud/skyux/commit/86cba17923a18358c8fbd611c4517962fef79d63))
* **components/lookup:** pass `wrapperClass` to selection modal ([#996](https://github.com/blackbaud/skyux/issues/996)) ([d6786de](https://github.com/blackbaud/skyux/commit/d6786debfb700241c6eb1b51bdb20bec7778b981))

## [7.6.2](https://github.com/blackbaud/skyux/compare/7.6.1...7.6.2) (2023-02-14)


### Bug Fixes

* **components/ag-grid:** address accessibility test issues ([#982](https://github.com/blackbaud/skyux/issues/982)) ([8c1ad68](https://github.com/blackbaud/skyux/commit/8c1ad68e30b4bad30302c2ffdd0c616d83c86589))

## [7.6.1](https://github.com/blackbaud/skyux/compare/7.6.0...7.6.1) (2023-02-07)


### Bug Fixes

* **components/ag-grid:** expand the click target for column sorting ([#974](https://github.com/blackbaud/skyux/issues/974)) ([48a153b](https://github.com/blackbaud/skyux/commit/48a153b168b924573bc176d8150f97034a234e4d))
* **components/flyout:** remove unneeded optional chaining in template ([#970](https://github.com/blackbaud/skyux/issues/970)) ([adac559](https://github.com/blackbaud/skyux/commit/adac55909e5a2ab1cb5930930d230a64c397232e))

## [7.6.0](https://github.com/blackbaud/skyux/compare/7.5.0...7.6.0) (2023-02-03)


### Features

* **components/modals:** use Angular CDK focus trap within modals ([#955](https://github.com/blackbaud/skyux/issues/955)) ([c9b17b4](https://github.com/blackbaud/skyux/commit/c9b17b430e690f73c71a87cada674cbb801fc804))


### Bug Fixes

* **components/ag-grid:** header should respect sortable column config ([#971](https://github.com/blackbaud/skyux/issues/971)) ([2454aa0](https://github.com/blackbaud/skyux/commit/2454aa0bf83f37dee53bb1b7477d73f5bf9b129b))
* **components/core:** fix bug in numeric service truncateAfter not respecting 0 as valid value ([#961](https://github.com/blackbaud/skyux/issues/961)) ([935cae6](https://github.com/blackbaud/skyux/commit/935cae68ad9213a286d32c5f413bcde23f33cc49))
* **components/core:** use relative environment injector when dynamically generating components ([#952](https://github.com/blackbaud/skyux/issues/952)) ([667123c](https://github.com/blackbaud/skyux/commit/667123c03776101d778fac54f33b3181be911731))


### Reverts

* feat(components/modals): use Angular CDK focus trap within modals ([#962](https://github.com/blackbaud/skyux/issues/962)) ([283fc36](https://github.com/blackbaud/skyux/commit/283fc365198a8687328f5faa01059fdb0e39d972))


### Deprecations

* **components/modals:** tiles inside modals are deprecated; use an alternative design instead ([#965](https://github.com/blackbaud/skyux/issues/965)) ([36ddac8](https://github.com/blackbaud/skyux/commit/36ddac816725bb7e8a3f223f00f0496bc548b6cc))

## [7.5.0](https://github.com/blackbaud/skyux/compare/7.4.2...7.5.0) (2023-01-25)


### Features

* **components/router:** test harness for skyhref ([#934](https://github.com/blackbaud/skyux/issues/934)) ([1a2d7ef](https://github.com/blackbaud/skyux/commit/1a2d7ef28e100a30d2a5d755b7a4532830d2e318))


### Bug Fixes

* **components/packages:** remove Stache libraries from `ng update` package group ([#946](https://github.com/blackbaud/skyux/issues/946)) ([24bb1a9](https://github.com/blackbaud/skyux/commit/24bb1a9281c479bc334c4b7aa65997e690b62d5f))
* **components/progress-indicator:** all items are shown for waterfall progress indicators ([#954](https://github.com/blackbaud/skyux/issues/954)) ([05e7333](https://github.com/blackbaud/skyux/commit/05e7333a983b257624d68a2ba6e1f951c1235cde))
* **components/tiles:** fix appending tile components with injected dependencies ([#945](https://github.com/blackbaud/skyux/issues/945)) ([ab99728](https://github.com/blackbaud/skyux/commit/ab9972882aa42916f83fd72640960cd037d8b487))

## [7.4.2](https://github.com/blackbaud/skyux/compare/7.4.1...7.4.2) (2023-01-23)


### Bug Fixes

* **components/text-editor:** fix bug where setting autofocus and initial value before view init threw runtime error ([#947](https://github.com/blackbaud/skyux/issues/947)) ([2fc3cb4](https://github.com/blackbaud/skyux/commit/2fc3cb4d735d5735ed022299590d5c1635607a06))

## [7.4.1](https://github.com/blackbaud/skyux/compare/7.4.0...7.4.1) (2023-01-20)


### Bug Fixes

* **components/indicators:** add `display: block` to alert host component ([#939](https://github.com/blackbaud/skyux/issues/939)) ([4e9f744](https://github.com/blackbaud/skyux/commit/4e9f744d2bcaded42a489c5c34a8450fe0e3a688))
* **components/layout:** set `sm` breakpoint for action buttons without parent elements ([#944](https://github.com/blackbaud/skyux/issues/944)) ([3a93a3d](https://github.com/blackbaud/skyux/commit/3a93a3d68e3ffa334fd8286a049d1f87492671a5))
* **components/lookup:** make selection modal harness visible to docs ([#941](https://github.com/blackbaud/skyux/issues/941)) ([bca8e18](https://github.com/blackbaud/skyux/commit/bca8e185d5ce70a626379bf75398256f0873fe09))
* **components/tiles:** render tile dashboard if config is set after init ([#943](https://github.com/blackbaud/skyux/issues/943)) ([ae8e305](https://github.com/blackbaud/skyux/commit/ae8e305f59a85a47f4479b2db82afda9f29fe863))

## [7.4.0](https://github.com/blackbaud/skyux/compare/7.3.0...7.4.0) (2023-01-18)


### Features

* **components/lookup:** add selection modal service ([#931](https://github.com/blackbaud/skyux/issues/931)) ([7d6bc6e](https://github.com/blackbaud/skyux/commit/7d6bc6e40fdbee577353e82e48be756139b0f6b1))


### Bug Fixes

* **components/colorpicker:** colorpicker selection change updates both reactive forms and template forms ([#926](https://github.com/blackbaud/skyux/issues/926)) ([4e7b735](https://github.com/blackbaud/skyux/commit/4e7b73519320b705ca64fe842ede2a72c0adba5b))

## [7.3.0](https://github.com/blackbaud/skyux/compare/7.2.0...7.3.0) (2023-01-13)


### Features

* **components/a11y:** skip link test harness ([#920](https://github.com/blackbaud/skyux/issues/920)) ([9964051](https://github.com/blackbaud/skyux/commit/9964051fd6df74272213c7463df27af5d3e50d68))
* **components/indicators:** wait test harness ([#919](https://github.com/blackbaud/skyux/issues/919)) ([dcc958b](https://github.com/blackbaud/skyux/commit/dcc958bfac4558f92b444d97f94cc158a5b4b9f8))


### Bug Fixes

* **components/flyout:** flyout close button is visible ([#930](https://github.com/blackbaud/skyux/issues/930)) ([a2939e6](https://github.com/blackbaud/skyux/commit/a2939e6156c2f52ac059f85c09cd1ca80f4a3fcf))

## [7.2.0](https://github.com/blackbaud/skyux/compare/7.1.4...7.2.0) (2023-01-11)


### Features

* **components/theme:** switch to css custom properties ([#905](https://github.com/blackbaud/skyux/issues/905)) ([01381b7](https://github.com/blackbaud/skyux/commit/01381b705f7d7da276fd61270be824ec1ac4f195))


### Reverts

* **components/indicators:** `SkyWaitService`'s `blockingWrap` and `nonBlockingWrap` methods now take in argument objects and the versions which take in an `Observable` are deprecated ([#922](https://github.com/blackbaud/skyux/pull/922)) ([36bd04](https://github.com/blackbaud/skyux/commit/36bd04507058c925a68c4a2cd778356b843defac))

## [7.1.4](https://github.com/blackbaud/skyux/compare/7.1.3...7.1.4) (2023-01-09)


### Bug Fixes

* **components/packages:** ng-add install current @angular/cdk ([#916](https://github.com/blackbaud/skyux/issues/916)) ([3b2118f](https://github.com/blackbaud/skyux/commit/3b2118f1ef6ed4d7da51f8fba8fd578795cb3bf3))

## [7.1.3](https://github.com/blackbaud/skyux/compare/7.1.2...7.1.3) (2023-01-06)


### Bug Fixes

* **components/config:** add `angularSettings` to `SkyuxConfig` ([#915](https://github.com/blackbaud/skyux/issues/915)) ([99a5d92](https://github.com/blackbaud/skyux/commit/99a5d929e42ad0ab25d0eeb3f04d7695e51f80e6))
* **components/forms:** inline help within an input box now displays focus only around the help inline ([#899](https://github.com/blackbaud/skyux/issues/899)) ([1acb5c4](https://github.com/blackbaud/skyux/commit/1acb5c4c4a2c8b19cc28c7d787dd17e49892fcf3))
* **components/forms:** selection box no longer errors if responsive classes are updated prior to Angular fully rendering parent elements ([#910](https://github.com/blackbaud/skyux/issues/910)) ([e08316c](https://github.com/blackbaud/skyux/commit/e08316c108a7e499610b5d5fcf1d2ee049fa0f27))
* **sdk/e2e-schematics:** bug fixes during component-e2e and story generation ([#904](https://github.com/blackbaud/skyux/issues/904)) ([c2e54a8](https://github.com/blackbaud/skyux/commit/c2e54a83dfc6a0b64a10086aa48b7177e8130427))
* **sdk/prettier-schematics:** configure Prettier if .vscode folder exists ([#914](https://github.com/blackbaud/skyux/issues/914)) ([17ba286](https://github.com/blackbaud/skyux/commit/17ba286193c0979531e5dd4d4466428da19fc3f2))

## [7.1.2](https://github.com/blackbaud/skyux/compare/7.1.1...7.1.2) (2022-12-22)


### Bug Fixes

* **components/forms:** remove checkbox label margin when field is required ([#897](https://github.com/blackbaud/skyux/issues/897)) ([9241c55](https://github.com/blackbaud/skyux/commit/9241c55e41c53f0a89a63728e5f8b22951610341))
* **components/forms:** update file attachment button label to match updated standards ([#894](https://github.com/blackbaud/skyux/issues/894)) ([8e642c6](https://github.com/blackbaud/skyux/commit/8e642c618932d1984504e140bdc14d7fa0003c5a))


### Deprecations

* **components/indicators:** `SkyWaitService`'s `blockingWrap` and `nonBlockingWrap` methods now take in argument objects and the versions which take in an `Observable` are deprecated ([#900](https://github.com/blackbaud/skyux/issues/900)) ([55faaa2](https://github.com/blackbaud/skyux/commit/55faaa28424e388271aa33a17de80d7f08e225cb))

## [7.1.1](https://github.com/blackbaud/skyux/compare/7.1.0...7.1.1) (2022-12-16)


### Bug Fixes

* **components/lookup:** show more modal populates with current search text when triggered via the search button ([#885](https://github.com/blackbaud/skyux/issues/885)) ([da86ddf](https://github.com/blackbaud/skyux/commit/da86ddfb40702c27d9959a3e3a37c3cd1bab4d48))
* **components/modals:** ensure confirmation modals include accessibility labels ([#888](https://github.com/blackbaud/skyux/issues/888)) ([2225c3a](https://github.com/blackbaud/skyux/commit/2225c3a65c5c3732803f83f67379d07f54ec3919))

## [7.1.0](https://github.com/blackbaud/skyux/compare/7.0.0...7.1.0) (2022-12-14)


### Features

* **components/indicators:** update key-info to use css custom properties ([#884](https://github.com/blackbaud/skyux/issues/884)) ([31c661f](https://github.com/blackbaud/skyux/commit/31c661ff742ba3c05fccceebf1e73ca67c436f65))
* **components/packages:** update package group versions ([#877](https://github.com/blackbaud/skyux/issues/877)) ([f932ed0](https://github.com/blackbaud/skyux/commit/f932ed09f5e0002e256c5536ccc1752dedc9db94))


### Bug Fixes

* **components/core:** hide viewkeeper overflow ([#880](https://github.com/blackbaud/skyux/issues/880)) ([60882fc](https://github.com/blackbaud/skyux/commit/60882fc7181f425b18a8d41ddb682f5541bf0d27))
* **components/flyout:** viewkeeper z-index adjustment ([#873](https://github.com/blackbaud/skyux/issues/873)) ([a8d7393](https://github.com/blackbaud/skyux/commit/a8d73934fa8490c8c205b52819386d022763b902))
* **components/indicators:** satisfy color contrast rules in modern theme ([#748](https://github.com/blackbaud/skyux/issues/748)) ([0a43a91](https://github.com/blackbaud/skyux/commit/0a43a9155bbc3aa12e7f9ed36f429572dfc23f8a))
* **components/modals:** viewkeeper z-index adjustment ([#876](https://github.com/blackbaud/skyux/issues/876)) ([4925dd9](https://github.com/blackbaud/skyux/commit/4925dd98666e244e461a0811a40261066d4da67d))

## [7.0.0](https://github.com/blackbaud/skyux/compare/7.0.0-beta.19...7.0.0) (2022-12-05)


### ⚠ BREAKING CHANGES

* **components/ag-grid:** upgrade to [AG Grid 28](https://www.ag-grid.com/changelog/?fixVersion=28.0.0), which includes breaking changes
* **components/config:** The config params `get` function was updated to accurately reflect that it may return undefined. To address this change, account for a possible undefined value wherever you are using the `get` function.
* **components/datetime:** The 'SkyFuzzyDatepickerInputDirective' included a nonfunctional input 'skyFuzzyDatepickerInput' to support backward compatibility. The input can be removed from consumer templates without loss of functionality.
* **components/errors:** Unit tests that expect this extra whitespace will need to be updated.
* **components/forms:** The `SkyFileDrop` and `SkyFileAttachment` components' `validateFn` input type was updated to receive a `SkyFileType` parameter and return a string or undefined. To address this, ensure all `validateFn` inputs have the correct parameter and return types.
* **components/forms:** The radio component's `radioType` input was set to a type of `string`, but it really only accepts a handful of known string values. These values are represented by the new `SkyRadioType` string union. This might cause problems if you are setting the `radioType` input to a type of `string` in your consuming component's class.
* **components/forms:** This change updates the `SkyCheckboxChange` type to be an interface instead of a class. To address this, remove any instances of instantiating the `SkyCheckboxChange` class and instead create an object that uses the interface type.
* **components/forms:** use `EventEmitter` for radio component outputs (#732)
* **components/indicators:** This change removes support for `alertType` on the alert component being an unaccepted string. To address this change, change the `alertType` to an accepted `SkyIndicatorTypeIcon` or remove it to use the default `alertType` of `'warning'`.
* **components/indicators:** This change updates the types accepted by the key info component's layout property. To address this change, only pass 'horizontal' or 'vertical' to the property, and use the type `SkyKeyInfoLayoutType` if typing variables.
* **components/layout:** This change removes the `SkyFluidGridGutterSize` enum and the numerical options (0, 1, 2) from `SkyFluidGridGutterSizeType`. To address this, only use the strings 'small', 'medium', and 'large' for  the fluid grid component's `gutterSize` property, and use `SkyFluidGridGutterSizeType` for Typescript typing.
* **components/modals:** `dynamicComponentService` is now a required parameter of `SkyModalService`. To address this change, provide the `dynamicComponentService` wherever you are constructing the `SkyModalService` or any mocks extending it  for unit testing.
* **components/modals:** `SkyConfirmButton`'s `styleType` will only accept predefined strings of type `SkyConfirmButtonStyleType`. To address this, ensure `styleType` is only being set to a supported value.
* **components/modals:** `SkyModalConfigurationInterface.providers` accepts an array of `StaticProvider`s instead of any value.
* **components/modals:** The `SkyConfirmButton` component is intended for internal use only and is removed from the exported API. To address this, remove any usages of the `SkyConfirmButton` component.
* **components/tabs:** This change removes support for not using a finish navigation button with the previous and next wizard navigation buttons. To address this change, remove other save or finish buttons and use the `sky-tabset-nav-button` of type `finish` instead.
* add support for Angular 14 (#539)

### Features

* **components/ag-grid:** add inline help support using custom header components ([#787](https://github.com/blackbaud/skyux/issues/787)) ([809bac6](https://github.com/blackbaud/skyux/commit/809bac657cddcc5994ee140cd82910754baf8e3a))
* **components/ag-grid:** upgrade to AG Grid 28 ([#617](https://github.com/blackbaud/skyux/issues/617)) ([2c1e2ad](https://github.com/blackbaud/skyux/commit/2c1e2adfc3546b630e9d124eeaf9e95d9c9aa4fa))
* **components/angular-tree-component:** add inline help support for angular tree component ([#659](https://github.com/blackbaud/skyux/issues/659)) ([3fbabf2](https://github.com/blackbaud/skyux/commit/3fbabf28cb406a220aa4d7dbfe282b8a81e6365a))
* **components/autonumeric:** change autonumeric from a dependency to a peer dependency ([#741](https://github.com/blackbaud/skyux/issues/741)) ([b1e4706](https://github.com/blackbaud/skyux/commit/b1e47060e1f095c95b1753ce7a8248715c9f8618))
* **components/config:** add more specific typing to config params function return types ([#668](https://github.com/blackbaud/skyux/issues/668)) ([102cd0a](https://github.com/blackbaud/skyux/commit/102cd0a97a5b64c78e469b462fe1f59601e44557))
* **components/core:** add ability to provide a parent injector when constructing components via the `SkyDynamicComponentService` ([#793](https://github.com/blackbaud/skyux/issues/793)) ([5b3fefa](https://github.com/blackbaud/skyux/commit/5b3fefab6b84e7144c641f97fe6668c9f4cf4b29))
* **components/datetime:** make 'moment' a peer dependency ([#615](https://github.com/blackbaud/skyux/issues/615)) ([9bb61f9](https://github.com/blackbaud/skyux/commit/9bb61f92acdb976d39fc3bc9fc179d63d0ef6ae7))
* **components/forms:** change `SkyCheckboxChange` type to an interface ([#597](https://github.com/blackbaud/skyux/issues/597)) ([2c3c1e9](https://github.com/blackbaud/skyux/commit/2c3c1e9643c7008f91aad6138aa7649aa095aa97))
* **components/forms:** change radio component's `radioType` input property to be more strongly typed ([34e9332](https://github.com/blackbaud/skyux/commit/34e933208706bea063ef95de57568a9b3488e706))
* **components/forms:** support status indicator errors for input box ([#633](https://github.com/blackbaud/skyux/issues/633)) ([#695](https://github.com/blackbaud/skyux/issues/695)) ([7d15414](https://github.com/blackbaud/skyux/commit/7d15414f4d5bdae50b5352d6d73354642376bdc2))
* **components/forms:** update file attachment validateFn inputs to more specific type ([#669](https://github.com/blackbaud/skyux/issues/669)) ([95b7ab5](https://github.com/blackbaud/skyux/commit/95b7ab59f6352a591dcff17da5d76c3e9c4d3325))
* **components/indicators:** change `alertType` to `SkyIndicatorIconType` ([#683](https://github.com/blackbaud/skyux/issues/683)) ([9081186](https://github.com/blackbaud/skyux/commit/90811866e56e772f95422db308ed7caf801cfac0))
* **components/indicators:** remove bottom margin from alert component ([#648](https://github.com/blackbaud/skyux/issues/648)) ([5bd8762](https://github.com/blackbaud/skyux/commit/5bd87621ba412cebb38285b6e9ece256e07bbe6b))
* **components/indicators:** remove support for key info layout string type ([#587](https://github.com/blackbaud/skyux/issues/587)) ([ffac254](https://github.com/blackbaud/skyux/commit/ffac254c75e600f044147a6ed5946eafee75e8c9))
* **components/indicators:** update inline help emitter type to void ([#584](https://github.com/blackbaud/skyux/issues/584)) ([878b6de](https://github.com/blackbaud/skyux/commit/878b6ded9c2c2d967af751e52a64d1ce2a1be741))
* **components/layout:** remove deprecated fluid grid gutter size options ([#585](https://github.com/blackbaud/skyux/issues/585)) ([338771d](https://github.com/blackbaud/skyux/commit/338771d3d43d96c057aa0957fc8a401d1a761ac9))
* **components/lists:** show sort button caret on small screens ([#774](https://github.com/blackbaud/skyux/issues/774)) ([2be4513](https://github.com/blackbaud/skyux/commit/2be4513b5d142d05d20bae4e3c98888563ddd0b5))
* **components/lists:** sort and tabs dropdown style tweaks ([#851](https://github.com/blackbaud/skyux/issues/851)) ([d6c6a99](https://github.com/blackbaud/skyux/commit/d6c6a999299f935914523e8e2bf0e7fabc6143ec))
* **components/lookup:** deprecate search inputs ([#647](https://github.com/blackbaud/skyux/issues/647)) ([74396bb](https://github.com/blackbaud/skyux/commit/74396bb18906e82e86fa920276c8f709bd5b0143))
* **components/modals:** add inline-help support for modals ([#598](https://github.com/blackbaud/skyux/issues/598)) ([92b49c9](https://github.com/blackbaud/skyux/commit/92b49c9e1e084e70ed1b03fad2683cc51fc3f265))
* **components/modals:** improve `SkyModalConfigurationInterface.providers` type ([#665](https://github.com/blackbaud/skyux/issues/665)) ([a65dae0](https://github.com/blackbaud/skyux/commit/a65dae0642b45764fed92d9671e2830e0f1cc24e))
* **components/modals:** make `dynamicComponentService` required in `SkyModalService` constructor ([#674](https://github.com/blackbaud/skyux/issues/674)) ([c7c60f2](https://github.com/blackbaud/skyux/commit/c7c60f273c8bb988bcd7908282ba623723e861e0))
* **components/modals:** remove 'string' from `SkyConfirmButton`'s `styleType` type ([#664](https://github.com/blackbaud/skyux/issues/664)) ([8fda84e](https://github.com/blackbaud/skyux/commit/8fda84ebf9afa68e0c436578dbb6177f6cc7bfdd))
* **components/modals:** remove public export of confirm button ([#656](https://github.com/blackbaud/skyux/issues/656)) ([f465207](https://github.com/blackbaud/skyux/commit/f46520739ebf874d759efa372a809d19cee3afb6))
* **components/popovers:** improve dropdown styling ([#818](https://github.com/blackbaud/skyux/issues/818)) ([da10e69](https://github.com/blackbaud/skyux/commit/da10e696d5b01d44df3f29d7b650d6f567703012))
* **components/progress-indicator:** add inline-help support for progress indicator ([#599](https://github.com/blackbaud/skyux/issues/599)) ([ac3ec1f](https://github.com/blackbaud/skyux/commit/ac3ec1f4c2c2a3c0483b503b253cd7e8460ba72f))
* **components/tabs:** add descriptive aria label to tab buttons ([#586](https://github.com/blackbaud/skyux/issues/586)) ([#660](https://github.com/blackbaud/skyux/issues/660)) ([9a01d54](https://github.com/blackbaud/skyux/commit/9a01d549d498a9616d16aae4e3334b878372da3e))
* **components/tabs:** remove support for not using a finish nav button ([#618](https://github.com/blackbaud/skyux/issues/618)) ([cdd8a8f](https://github.com/blackbaud/skyux/commit/cdd8a8f4a58bb072bf93553d5f97509c4882e644))
* **components/tabs:** wizard keyboard nav and roles ([#558](https://github.com/blackbaud/skyux/issues/558)) ([49c7872](https://github.com/blackbaud/skyux/commit/49c7872239f9bacbc52839ab1d5d59b342186597))
* **components/tiles:** add inline help support for tile dashboard ([#563](https://github.com/blackbaud/skyux/issues/563)) ([#567](https://github.com/blackbaud/skyux/issues/567)) ([2377a7f](https://github.com/blackbaud/skyux/commit/2377a7f9ecf5af8616a4b5fee5da9bcd14c6d73d))
* **components/toast:** improve toast service `openComponent` `component` param type ([#667](https://github.com/blackbaud/skyux/issues/667)) ([8ffa182](https://github.com/blackbaud/skyux/commit/8ffa182538269488b561fda377dc677927f0e227))
* **sdk/testing:** add support for `axe-core@^4.5.2` ([#822](https://github.com/blackbaud/skyux/issues/822)) ([095509a](https://github.com/blackbaud/skyux/commit/095509a86cb9b3b2c6542670d270c953993ab9ad))
* **sdk/testing:** change axe-core from a dependency to a peer dependency ([#746](https://github.com/blackbaud/skyux/issues/746)) ([bbef42a](https://github.com/blackbaud/skyux/commit/bbef42a2793ce8ac88e21a52e43a3ae41efa1e92))
* add support for Angular 14 ([#539](https://github.com/blackbaud/skyux/issues/539)) ([bc28ca0](https://github.com/blackbaud/skyux/commit/bc28ca0df0183146f92482c396409d0369ae4532))
* add support for Angular 14.2.11 ([#854](https://github.com/blackbaud/skyux/issues/854)) ([9277c58](https://github.com/blackbaud/skyux/commit/9277c58daebd9ec2c8f3a8a36d2cd77ac641e252))
* update page and split view components to support docking content to the available viewport ([#688](https://github.com/blackbaud/skyux/issues/688)) ([158b262](https://github.com/blackbaud/skyux/commit/158b2627db4ab6a14a1d4e049a29b50280d36ec3))

### Bug Fixes

* **apps/code-examples:** fix data entry grid inline help example ([#853](https://github.com/blackbaud/skyux/issues/853)) ([0d55bf7](https://github.com/blackbaud/skyux/commit/0d55bf75720cee1f581c64ed9f2e207480ec793e))
* **components/ag-grid:** option to show horizontal scrollbar at top when using trackpad ([#552](https://github.com/blackbaud/skyux/issues/552)) ([#578](https://github.com/blackbaud/skyux/issues/578)) ([1f2d314](https://github.com/blackbaud/skyux/commit/1f2d31425158002940f5379db35d23e9c45463d6))
* **components/ag-grid:** remove `const` from `enum SkyCellClass` ([#844](https://github.com/blackbaud/skyux/issues/844)) ([4dcfa1e](https://github.com/blackbaud/skyux/commit/4dcfa1ee57dc77dd148e9518a452cd846fbfdfc3))
* **components/ag-grid:** remove aria-label from currency cell renderer ([#750](https://github.com/blackbaud/skyux/issues/750)) ([1343d3d](https://github.com/blackbaud/skyux/commit/1343d3d7efaa649f092e1d1d6bd551012178108b))
* **components/angular-tree-component:** replace aria-owns with adjustments to the tree node markup ([#758](https://github.com/blackbaud/skyux/issues/758)) ([beb0a21](https://github.com/blackbaud/skyux/commit/beb0a21608d59f71c3d7ade80398efd0a619570b))
* **components/angular-tree-component:** set 'aria-owns' to address a11y violation ([#666](https://github.com/blackbaud/skyux/issues/666)) ([cab7dae](https://github.com/blackbaud/skyux/commit/cab7dae2fcbb3eb9ce4a0efe9793995aedd52ddd))
* **components/data-manager:** mark for check when isActive changes ([#810](https://github.com/blackbaud/skyux/issues/810)) ([cf72fec](https://github.com/blackbaud/skyux/commit/cf72fec594ad05fa27da7247fe9a5c34f40e1505))
* **components/datetime:** remove nonfunctional 'skyFuzzyDatepickerInput' input from fuzzy date ([#591](https://github.com/blackbaud/skyux/issues/591)) ([b86e0ae](https://github.com/blackbaud/skyux/commit/b86e0aea90565d4f4e0c84041b1c02db15c53bbd))
* **components/errors:** remove extra whitespace around error description ([#733](https://github.com/blackbaud/skyux/issues/733)) ([3644555](https://github.com/blackbaud/skyux/commit/364455589141d5233d57939bfac1204058a16ce7))
* **components/errors:** set `ariaLabelledBy` for error modals to satisfy accessibility rules ([#819](https://github.com/blackbaud/skyux/issues/819)) ([ec7311a](https://github.com/blackbaud/skyux/commit/ec7311a76aebeedb02bcfdaefbff0e530368400f))
* **components/forms:** allow character count indicator and limit to be set in either order ([#826](https://github.com/blackbaud/skyux/issues/826)) ([9b013f9](https://github.com/blackbaud/skyux/commit/9b013f99fe105aa72df5b096e2cb276aac4e5abc))
* **components/forms:** allow toggle label to wrap ([#777](https://github.com/blackbaud/skyux/issues/777)) ([#789](https://github.com/blackbaud/skyux/issues/789)) ([1deaa9c](https://github.com/blackbaud/skyux/commit/1deaa9c0c0f700603d0f974b3b73196b9e18cf36))
* **components/forms:** constrain input box textarea height to prevent text overlapping with label ([#796](https://github.com/blackbaud/skyux/issues/796)) ([502a2c2](https://github.com/blackbaud/skyux/commit/502a2c23ac07599dc667cb670f9649615c56de5d))
* **components/forms:** revert accidental breaking change of the checkbox component's id property ([#852](https://github.com/blackbaud/skyux/issues/852)) ([#856](https://github.com/blackbaud/skyux/issues/856)) ([9d8a5df](https://github.com/blackbaud/skyux/commit/9d8a5dfdffa3cf5c87ac9fa74aac6b8bd0a66066))
* **components/forms:** set radio group 'aria-owns' to satisfy accessibility rules ([#671](https://github.com/blackbaud/skyux/issues/671)) ([32f1e1e](https://github.com/blackbaud/skyux/commit/32f1e1e2731e1ba5260d3ebe159a37370f950aa2))
* **components/forms:** use `EventEmitter` for radio component outputs ([#732](https://github.com/blackbaud/skyux/issues/732)) ([0b717db](https://github.com/blackbaud/skyux/commit/0b717dba0441c3c94c31aaa3cb46e8af286fea86))
* **components/forms:** use a label instead of a button as the wrapper ([#687](https://github.com/blackbaud/skyux/issues/687)) ([f2f2039](https://github.com/blackbaud/skyux/commit/f2f2039c9da142d01c5b0f3444616209cb17a15c))
* **components/indicators:** adjust help inline margin to 5 px ([#780](https://github.com/blackbaud/skyux/issues/780)) ([08f1487](https://github.com/blackbaud/skyux/commit/08f148708f3d860a8984bfd316ee234d25906f59))
* **components/indicators:** set wait component role to 'progressbar' ([#655](https://github.com/blackbaud/skyux/issues/655)) ([7612e6b](https://github.com/blackbaud/skyux/commit/7612e6ba917746539dac4aff039ca29940630fb3))
* **components/indicators:** use attribute binding on the tokens component to avoid duplicate 'role' values ([#803](https://github.com/blackbaud/skyux/issues/803)) ([a48e94d](https://github.com/blackbaud/skyux/commit/a48e94d3853c16edeece5d632f7c49cef573a532))
* **components/indicators:** use role 'grid' for tokens component ([#712](https://github.com/blackbaud/skyux/issues/712)) ([774eb3d](https://github.com/blackbaud/skyux/commit/774eb3dbd05469095da9197402e2507da0f8563c))
* **components/inline-form:** remove inline form race condition ([#670](https://github.com/blackbaud/skyux/issues/670)) ([bfcb7fd](https://github.com/blackbaud/skyux/commit/bfcb7fd7fbec01d8eb93ccad0001732b227fb775))
* **components/layout:** add display: block to sky-box so spacing classes can be applied ([#846](https://github.com/blackbaud/skyux/issues/846)) ([2247099](https://github.com/blackbaud/skyux/commit/22470992507d658a5fadcebaef506fa0c28e408e))
* **components/layout:** allow strict templates to use `backToTop` directive without square brackets ([#737](https://github.com/blackbaud/skyux/issues/737)) ([9f3e890](https://github.com/blackbaud/skyux/commit/9f3e890fc7a2950cc332345bc2cc04a85243dbaa))
* **components/layout:** animate text expand consistently when the expansion state changes ([#592](https://github.com/blackbaud/skyux/issues/592)) ([9e468f5](https://github.com/blackbaud/skyux/commit/9e468f5833b5bccfc35a3e50f2d25ec47359a31c))
* **components/layout:** animate text expand repeater consistently when the expansion state changes ([#602](https://github.com/blackbaud/skyux/issues/602)) ([62ddece](https://github.com/blackbaud/skyux/commit/62ddece3009240be335b8b9f37fd9d85d915cb12))
* **components/layout:** help inline modern theme styles follow design guidelines ([#845](https://github.com/blackbaud/skyux/issues/845)) ([76869f1](https://github.com/blackbaud/skyux/commit/76869f1fcd9a47a50674784595382faeb59a092a))
* **components/layout:** remove bottom margin from description lists ([#767](https://github.com/blackbaud/skyux/issues/767)) ([ed9994b](https://github.com/blackbaud/skyux/commit/ed9994b74e95498e66af2968ccf50900209b7236))
* **components/lists:** adjust vertical alignment on repeater item drag controls ([#859](https://github.com/blackbaud/skyux/issues/859)) ([e1ed920](https://github.com/blackbaud/skyux/commit/e1ed9209f2a6fc906e0622210a8c79779da52410))
* **components/lists:** use 'grid' role for selectable repeaters ([#751](https://github.com/blackbaud/skyux/issues/751)) ([64a4c86](https://github.com/blackbaud/skyux/commit/64a4c863b5619d508195643c90d7be1254dbfd3a))
* **components/lookup:** lookup control value accessor uses a copy of passed in arrays instead of using the original array directly ([#850](https://github.com/blackbaud/skyux/issues/850)) ([c0ebdab](https://github.com/blackbaud/skyux/commit/c0ebdab4d83719c82a9ce7f03c5d6327d15f49fd))
* **components/lookup:** lookup dropdown repositions when multiline tokens are changed ([#849](https://github.com/blackbaud/skyux/issues/849)) ([71c8caa](https://github.com/blackbaud/skyux/commit/71c8caada9a4758daef61f6ef23cccfb3cc04517))
* **components/lookup:** modern search clickbox takes up entire input box ([#677](https://github.com/blackbaud/skyux/issues/677)) ([#679](https://github.com/blackbaud/skyux/issues/679)) ([2b70b38](https://github.com/blackbaud/skyux/commit/2b70b383a69bbe0c7028e0fdfaeb129d0c6fb1fa))
* **components/lookup:** remove ARIA label from non-functional search icon ([#654](https://github.com/blackbaud/skyux/issues/654)) ([0225d2c](https://github.com/blackbaud/skyux/commit/0225d2cf24135eca63b4e22c9cc07f14b93fcfe0))
* **components/lookup:** search icon is placed within input when not using an input box or the show more functionality ([#701](https://github.com/blackbaud/skyux/issues/701)) ([#704](https://github.com/blackbaud/skyux/issues/704)) ([ef2862a](https://github.com/blackbaud/skyux/commit/ef2862afc2a85bb682da3ba5b6edf0ae233fad3e))
* **components/lookup:** set `aria-expanded` to true on the autocomplete component when the dropdown is open ([#544](https://github.com/blackbaud/skyux/issues/544)) ([1aa059d](https://github.com/blackbaud/skyux/commit/1aa059d5892ce4a3f7da206ac353e18fb71f0614))
* **components/modals:** remove leading and trailing whitespace from confirm elements when `preserveWhiteSpace` is `true` ([#786](https://github.com/blackbaud/skyux/issues/786)) ([b001bea](https://github.com/blackbaud/skyux/commit/b001bea5916afe66863ca49b6d11d5a949a3c590))
* **components/modals:** set modal content tabindex to make scrollable area focusable ([#619](https://github.com/blackbaud/skyux/issues/619)) ([#625](https://github.com/blackbaud/skyux/issues/625)) ([ec2bc10](https://github.com/blackbaud/skyux/commit/ec2bc10aa3869c2a9aebdcb2c70c22710482099d))
* **components/modals:** unsubscribe from preset button observable once the buttons have been emitted ([#640](https://github.com/blackbaud/skyux/issues/640)) ([a8a87ff](https://github.com/blackbaud/skyux/commit/a8a87ff8e0eeed44a73f4260d8998291b2ef8fa3))
* **components/packages:** add compat stylesheet to angular.json only if needed ([#728](https://github.com/blackbaud/skyux/issues/728)) ([c7ac8d1](https://github.com/blackbaud/skyux/commit/c7ac8d1880536702d00ca7283c57979595306310))
* **components/packages:** add compat stylesheet to project source roots ([#726](https://github.com/blackbaud/skyux/issues/726)) ([68393f4](https://github.com/blackbaud/skyux/commit/68393f43dca19fa91376149707f26032d9b74cac))
* **components/packages:** install `moment` only if `@skyux/datetime` is a dependency ([#743](https://github.com/blackbaud/skyux/issues/743)) ([11484e4](https://github.com/blackbaud/skyux/commit/11484e4040197cbb7c6d41ddb91d48eef7140599))
* **components/packages:** recognize leading tilde and relative paths when fixing SCSS imports ([#735](https://github.com/blackbaud/skyux/issues/735)) ([30e9817](https://github.com/blackbaud/skyux/commit/30e9817e8a7fe0344f26f1c2206df158e8c72cfa))
* **components/packages:** remove forward slash to compat stylesheet in angular.json ([#696](https://github.com/blackbaud/skyux/issues/696)) ([5b7eb4b](https://github.com/blackbaud/skyux/commit/5b7eb4b5d4bae82847ac6607241558cbdd4c2d39))
* **components/packages:** remove package before installing it to prevent duplicates ([#839](https://github.com/blackbaud/skyux/issues/839)) ([89a990f](https://github.com/blackbaud/skyux/commit/89a990fb3d48edb0a70e5758d25dbd510b621fc1))
* **components/pages:** update needs-attention to match box design ([#582](https://github.com/blackbaud/skyux/issues/582)) ([#611](https://github.com/blackbaud/skyux/issues/611)) ([f1619a7](https://github.com/blackbaud/skyux/commit/f1619a7df407243614fd35396ca9576fd6b6de45))
* **components/phone-field:** validate new area codes as valid ([#634](https://github.com/blackbaud/skyux/issues/634)) ([#637](https://github.com/blackbaud/skyux/issues/637)) ([636143d](https://github.com/blackbaud/skyux/commit/636143d65e03021f6eac98baeba04244eb2bf150))
* **components/tabs:** address accessibility violations in tabset component ([#806](https://github.com/blackbaud/skyux/issues/806)) ([08ba3cf](https://github.com/blackbaud/skyux/commit/08ba3cfbe48321090600255c9b49c23822ef234d))
* **components/tabs:** fix a11y violations for wizard and vertical tabs ([#651](https://github.com/blackbaud/skyux/issues/651)) ([9b53409](https://github.com/blackbaud/skyux/commit/9b53409271b78e1091462578ee02c7b470a75832))
* **components/tabs:** use 'aria-owns' to satisfy accessibility rules for vertical tab and sectioned form components ([#815](https://github.com/blackbaud/skyux/issues/815)) ([e5e3ac7](https://github.com/blackbaud/skyux/commit/e5e3ac70aeee35a18b0f205a87d42f5fcfd0053d))
* **components/text-editor:** escape merge field attribute values ([#797](https://github.com/blackbaud/skyux/issues/797)) ([5632dbd](https://github.com/blackbaud/skyux/commit/5632dbdc87677ec53267928761b21e17ea4ad9e5))
* **components/text-editor:** toolbars are hidden when no items exist within the toolbars ([#676](https://github.com/blackbaud/skyux/issues/676)) ([#678](https://github.com/blackbaud/skyux/issues/678)) ([9711a84](https://github.com/blackbaud/skyux/commit/9711a842e8c3a5c6887adfdfceab6719001a4a1e))
* **components/theme:** add module names for SCSS variables ([#730](https://github.com/blackbaud/skyux/issues/730)) ([8a8ceb0](https://github.com/blackbaud/skyux/commit/8a8ceb0275dc5189a5c00b21412d8eb68174ed0b))
* **components/theme:** address missing files in the SCSS exports API ([#721](https://github.com/blackbaud/skyux/issues/721)) ([923fac0](https://github.com/blackbaud/skyux/commit/923fac043f474548971ba0b93d887a6c91de26cc))
* **components/theme:** remove variables exports from SCSS mixins ([#725](https://github.com/blackbaud/skyux/issues/725)) ([7153e95](https://github.com/blackbaud/skyux/commit/7153e9551144b7c1c258140c90f710c934daf8c5))
* **components/validation:** correct return type for static `url` valdation function when called with validation options ([#809](https://github.com/blackbaud/skyux/issues/809)) ([dc8b6e4](https://github.com/blackbaud/skyux/commit/dc8b6e4c703ecc899aaefb2cb32ca2cca3c497ca))
* **sdk/testing:** use default `axe-core` rules when running the `toBeAccessible` matcher ([#681](https://github.com/blackbaud/skyux/issues/681)) ([ed1b5bb](https://github.com/blackbaud/skyux/commit/ed1b5bba5a37f006bc25a09bd92f003501f848ea))
* adjust typescript exports and remove core-js imports ([#820](https://github.com/blackbaud/skyux/issues/820)) ([79c5989](https://github.com/blackbaud/skyux/commit/79c5989bc139a93f5c707cdf67ff6d4c06d2ca3a))
* adjust typescript imports to work on case sensitive filesystem ([#804](https://github.com/blackbaud/skyux/issues/804)) ([abec058](https://github.com/blackbaud/skyux/commit/abec0584c3c4afd0467eb9a501cfe6ed5025edbe))
* imports schematic on Windows ([#837](https://github.com/blackbaud/skyux/issues/837)) ([d610573](https://github.com/blackbaud/skyux/commit/d61057362b9b7d9b53e1b206cf4758fb3234c0bd))

### Deprecations

* **components/popovers:** deprecate `SkyDropdownComponent` `buttonType` icon class option ([#663](https://github.com/blackbaud/skyux/issues/663)) ([b8c1027](https://github.com/blackbaud/skyux/commit/b8c102782998a85f43f818e7e923be0ef786c1e6))
* **components/tabs:** deprecate `tabHeaderCount` and remove from code examples ([#714](https://github.com/blackbaud/skyux/issues/714)) ([f40696f](https://github.com/blackbaud/skyux/commit/f40696f078819c8d2e59337b238dd11569482236))

## [7.0.0-beta.19](https://github.com/blackbaud/skyux/compare/7.0.0-beta.18...7.0.0-beta.19) (2022-12-01)


### Features

* **components/lists:** sort and tabs dropdown style tweaks ([#851](https://github.com/blackbaud/skyux/issues/851)) ([d6c6a99](https://github.com/blackbaud/skyux/commit/d6c6a999299f935914523e8e2bf0e7fabc6143ec))


### Bug Fixes

* **components/lists:** adjust vertical alignment on repeater item drag controls ([#859](https://github.com/blackbaud/skyux/issues/859)) ([e1ed920](https://github.com/blackbaud/skyux/commit/e1ed9209f2a6fc906e0622210a8c79779da52410))

## [7.0.0-beta.18](https://github.com/blackbaud/skyux/compare/7.0.0-beta.17...7.0.0-beta.18) (2022-11-28)


### Features

* add support for Angular 14.2.11 ([#854](https://github.com/blackbaud/skyux/issues/854)) ([9277c58](https://github.com/blackbaud/skyux/commit/9277c58daebd9ec2c8f3a8a36d2cd77ac641e252))


### Bug Fixes

* **apps/code-examples:** fix data entry grid inline help example ([#853](https://github.com/blackbaud/skyux/issues/853)) ([0d55bf7](https://github.com/blackbaud/skyux/commit/0d55bf75720cee1f581c64ed9f2e207480ec793e))
* **components/forms:** revert accidental breaking change of the checkbox component's id property ([#852](https://github.com/blackbaud/skyux/issues/852)) ([#856](https://github.com/blackbaud/skyux/issues/856)) ([9d8a5df](https://github.com/blackbaud/skyux/commit/9d8a5dfdffa3cf5c87ac9fa74aac6b8bd0a66066))
* **components/layout:** add display: block to sky-box so spacing classes can be applied ([#846](https://github.com/blackbaud/skyux/issues/846)) ([2247099](https://github.com/blackbaud/skyux/commit/22470992507d658a5fadcebaef506fa0c28e408e))
* **components/layout:** help inline modern theme styles follow design guidelines ([#845](https://github.com/blackbaud/skyux/issues/845)) ([76869f1](https://github.com/blackbaud/skyux/commit/76869f1fcd9a47a50674784595382faeb59a092a))
* **components/lookup:** lookup control value accessor uses a copy of passed in arrays instead of using the original array directly ([#850](https://github.com/blackbaud/skyux/issues/850)) ([c0ebdab](https://github.com/blackbaud/skyux/commit/c0ebdab4d83719c82a9ce7f03c5d6327d15f49fd))
* **components/lookup:** lookup dropdown repositions when multiline tokens are changed ([#849](https://github.com/blackbaud/skyux/issues/849)) ([71c8caa](https://github.com/blackbaud/skyux/commit/71c8caada9a4758daef61f6ef23cccfb3cc04517))

## [6.25.3](https://github.com/blackbaud/skyux/compare/6.25.2...6.25.3) (2022-11-23)


### Bug Fixes

* **components/forms:** revert accidental breaking change of the checkbox component's id property ([#852](https://github.com/blackbaud/skyux/issues/852)) ([08bbcb8](https://github.com/blackbaud/skyux/commit/08bbcb81e6139ea9751bc0ba8aa041e3f0f77b3f))

## [7.0.0-beta.17](https://github.com/blackbaud/skyux/compare/7.0.0-beta.16...7.0.0-beta.17) (2022-11-17)


### Bug Fixes

* **components/ag-grid:** remove `const` from `enum SkyCellClass` ([#844](https://github.com/blackbaud/skyux/issues/844)) ([4dcfa1e](https://github.com/blackbaud/skyux/commit/4dcfa1ee57dc77dd148e9518a452cd846fbfdfc3))
* **components/packages:** remove package before installing it to prevent duplicates ([#839](https://github.com/blackbaud/skyux/issues/839)) ([89a990f](https://github.com/blackbaud/skyux/commit/89a990fb3d48edb0a70e5758d25dbd510b621fc1))

## [7.0.0-beta.16](https://github.com/blackbaud/skyux/compare/7.0.0-beta.15...7.0.0-beta.16) (2022-11-16)


### Bug Fixes

* imports schematic on Windows ([#837](https://github.com/blackbaud/skyux/issues/837)) ([d610573](https://github.com/blackbaud/skyux/commit/d61057362b9b7d9b53e1b206cf4758fb3234c0bd))

## [7.0.0-beta.15](https://github.com/blackbaud/skyux/compare/7.0.0-beta.14...7.0.0-beta.15) (2022-11-16)


### Features

* **components/popovers:** improve dropdown styling ([#818](https://github.com/blackbaud/skyux/issues/818)) ([da10e69](https://github.com/blackbaud/skyux/commit/da10e696d5b01d44df3f29d7b650d6f567703012))

## [7.0.0-beta.14](https://github.com/blackbaud/skyux/compare/7.0.0-beta.13...7.0.0-beta.14) (2022-11-15)


### Features

* **sdk/testing:** add support for `axe-core@^4.5.2` ([#822](https://github.com/blackbaud/skyux/issues/822)) ([095509a](https://github.com/blackbaud/skyux/commit/095509a86cb9b3b2c6542670d270c953993ab9ad))


### Bug Fixes

* adjust typescript exports and remove core-js imports ([#820](https://github.com/blackbaud/skyux/issues/820)) ([79c5989](https://github.com/blackbaud/skyux/commit/79c5989bc139a93f5c707cdf67ff6d4c06d2ca3a))
* **components/data-manager:** mark for check when isActive changes ([#810](https://github.com/blackbaud/skyux/issues/810)) ([cf72fec](https://github.com/blackbaud/skyux/commit/cf72fec594ad05fa27da7247fe9a5c34f40e1505))
* **components/errors:** set `ariaLabelledBy` for error modals to satisfy accessibility rules ([#819](https://github.com/blackbaud/skyux/issues/819)) ([ec7311a](https://github.com/blackbaud/skyux/commit/ec7311a76aebeedb02bcfdaefbff0e530368400f))
* **components/forms:** allow character count indicator and limit to be set in either order ([#826](https://github.com/blackbaud/skyux/issues/826)) ([9b013f9](https://github.com/blackbaud/skyux/commit/9b013f99fe105aa72df5b096e2cb276aac4e5abc))
* **components/tabs:** use 'aria-owns' to satisfy accessibility rules for vertical tab and sectioned form components ([#815](https://github.com/blackbaud/skyux/issues/815)) ([e5e3ac7](https://github.com/blackbaud/skyux/commit/e5e3ac70aeee35a18b0f205a87d42f5fcfd0053d))

## [7.0.0-beta.13](https://github.com/blackbaud/skyux/compare/7.0.0-beta.12...7.0.0-beta.13) (2022-11-10)


### Features

* **components/core:** add ability to provide a parent injector when constructing components via the `SkyDynamicComponentService` ([#793](https://github.com/blackbaud/skyux/issues/793)) ([5b3fefa](https://github.com/blackbaud/skyux/commit/5b3fefab6b84e7144c641f97fe6668c9f4cf4b29))


### Bug Fixes

* adjust typescript imports to work on case sensitive filesystem ([#804](https://github.com/blackbaud/skyux/issues/804)) ([abec058](https://github.com/blackbaud/skyux/commit/abec0584c3c4afd0467eb9a501cfe6ed5025edbe))
* **components/forms:** constrain input box textarea height to prevent text overlapping with label ([#796](https://github.com/blackbaud/skyux/issues/796)) ([502a2c2](https://github.com/blackbaud/skyux/commit/502a2c23ac07599dc667cb670f9649615c56de5d))
* **components/indicators:** use attribute binding on the tokens component to avoid duplicate 'role' values ([#803](https://github.com/blackbaud/skyux/issues/803)) ([a48e94d](https://github.com/blackbaud/skyux/commit/a48e94d3853c16edeece5d632f7c49cef573a532))
* **components/tabs:** address accessibility violations in tabset component ([#806](https://github.com/blackbaud/skyux/issues/806)) ([08ba3cf](https://github.com/blackbaud/skyux/commit/08ba3cfbe48321090600255c9b49c23822ef234d))
* **components/text-editor:** escape merge field attribute values ([#797](https://github.com/blackbaud/skyux/issues/797)) ([5632dbd](https://github.com/blackbaud/skyux/commit/5632dbdc87677ec53267928761b21e17ea4ad9e5))
* **components/validation:** correct return type for static `url` valdation function when called with validation options ([#809](https://github.com/blackbaud/skyux/issues/809)) ([dc8b6e4](https://github.com/blackbaud/skyux/commit/dc8b6e4c703ecc899aaefb2cb32ca2cca3c497ca))

## [7.0.0-beta.12](https://github.com/blackbaud/skyux/compare/7.0.0-beta.11...7.0.0-beta.12) (2022-11-07)


### ⚠ BREAKING CHANGES

* **components/ag-grid:** upgrade to [AG Grid 28](https://www.ag-grid.com/changelog/?fixVersion=28.0.0), which includes breaking changes

### Features

* **components/ag-grid:** upgrade to AG Grid 28 ([#617](https://github.com/blackbaud/skyux/issues/617)) ([2c1e2ad](https://github.com/blackbaud/skyux/commit/2c1e2adfc3546b630e9d124eeaf9e95d9c9aa4fa))

## [7.0.0-beta.11](https://github.com/blackbaud/skyux/compare/7.0.0-beta.10...7.0.0-beta.11) (2022-11-04)


### Features

* **components/ag-grid:** add inline help support using custom header components ([#787](https://github.com/blackbaud/skyux/issues/787)) ([809bac6](https://github.com/blackbaud/skyux/commit/809bac657cddcc5994ee140cd82910754baf8e3a))
* **components/lists:** show sort button caret on small screens ([#774](https://github.com/blackbaud/skyux/issues/774)) ([2be4513](https://github.com/blackbaud/skyux/commit/2be4513b5d142d05d20bae4e3c98888563ddd0b5))


### Bug Fixes

* **components/angular-tree-component:** replace aria-owns with adjustments to the tree node markup ([#758](https://github.com/blackbaud/skyux/issues/758)) ([beb0a21](https://github.com/blackbaud/skyux/commit/beb0a21608d59f71c3d7ade80398efd0a619570b))
* **components/forms:** allow toggle label to wrap ([#777](https://github.com/blackbaud/skyux/issues/777)) ([#789](https://github.com/blackbaud/skyux/issues/789)) ([1deaa9c](https://github.com/blackbaud/skyux/commit/1deaa9c0c0f700603d0f974b3b73196b9e18cf36))
* **components/indicators:** adjust help inline margin to 5 px ([#780](https://github.com/blackbaud/skyux/issues/780)) ([08f1487](https://github.com/blackbaud/skyux/commit/08f148708f3d860a8984bfd316ee234d25906f59))
* **components/layout:** remove bottom margin from description lists ([#767](https://github.com/blackbaud/skyux/issues/767)) ([ed9994b](https://github.com/blackbaud/skyux/commit/ed9994b74e95498e66af2968ccf50900209b7236))
* **components/modals:** remove leading and trailing whitespace from confirm elements when `preserveWhiteSpace` is `true` ([#786](https://github.com/blackbaud/skyux/issues/786)) ([b001bea](https://github.com/blackbaud/skyux/commit/b001bea5916afe66863ca49b6d11d5a949a3c590))

## [6.25.2](https://github.com/blackbaud/skyux/compare/6.25.1...6.25.2) (2022-11-04)

* **components/forms:** allow toggle label to wrap ([#777](https://github.com/blackbaud/skyux/issues/777)) ([a3ff4b7](https://github.com/blackbaud/skyux/commit/a3ff4b7102d3069936e6527fd94bc85155774c4b))

## [7.0.0-beta.10](https://github.com/blackbaud/skyux/compare/7.0.0-beta.9...7.0.0-beta.10) (2022-11-01)


### ⚠ BREAKING CHANGES

* **components/forms:** The radio component's `radioType` input was set to a type of `string`, but it really only accepts a handful of known string values. These values are represented by the new `SkyRadioType` string union. This might cause problems if you are setting the `radioType` input to a type of `string` in your consuming component's class.

### Features

* **components/autonumeric:** change autonumeric from a dependency to a peer dependency ([#741](https://github.com/blackbaud/skyux/issues/741)) ([b1e4706](https://github.com/blackbaud/skyux/commit/b1e47060e1f095c95b1753ce7a8248715c9f8618))
* **components/forms:** change radio component's `radioType` input property to be more strongly typed ([34e9332](https://github.com/blackbaud/skyux/commit/34e933208706bea063ef95de57568a9b3488e706))
* **sdk/testing:** change axe-core from a dependency to a peer dependency ([#746](https://github.com/blackbaud/skyux/issues/746)) ([bbef42a](https://github.com/blackbaud/skyux/commit/bbef42a2793ce8ac88e21a52e43a3ae41efa1e92))


### Bug Fixes

* **components/ag-grid:** remove aria-label from currency cell renderer ([#750](https://github.com/blackbaud/skyux/issues/750)) ([1343d3d](https://github.com/blackbaud/skyux/commit/1343d3d7efaa649f092e1d1d6bd551012178108b))
* **components/indicators:** use role 'grid' for tokens component ([#712](https://github.com/blackbaud/skyux/issues/712)) ([774eb3d](https://github.com/blackbaud/skyux/commit/774eb3dbd05469095da9197402e2507da0f8563c))
* **components/lists:** use 'grid' role for selectable repeaters ([#751](https://github.com/blackbaud/skyux/issues/751)) ([64a4c86](https://github.com/blackbaud/skyux/commit/64a4c863b5619d508195643c90d7be1254dbfd3a))
* **components/packages:** install `moment` only if `@skyux/datetime` is a dependency ([#743](https://github.com/blackbaud/skyux/issues/743)) ([11484e4](https://github.com/blackbaud/skyux/commit/11484e4040197cbb7c6d41ddb91d48eef7140599))

## [7.0.0-beta.9](https://github.com/blackbaud/skyux/compare/7.0.0-beta.8...7.0.0-beta.9) (2022-10-25)


### ⚠ BREAKING CHANGES

* **components/forms:** use `EventEmitter` for radio component outputs (#732)
* **components/errors:** Unit tests that expect this extra whitespace will need to be updated.

### Bug Fixes

* **components/errors:** remove extra whitespace around error description ([#733](https://github.com/blackbaud/skyux/issues/733)) ([3644555](https://github.com/blackbaud/skyux/commit/364455589141d5233d57939bfac1204058a16ce7))
* **components/forms:** use `EventEmitter` for radio component outputs ([#732](https://github.com/blackbaud/skyux/issues/732)) ([0b717db](https://github.com/blackbaud/skyux/commit/0b717dba0441c3c94c31aaa3cb46e8af286fea86))
* **components/layout:** allow strict templates to use `backToTop` directive without square brackets ([#737](https://github.com/blackbaud/skyux/issues/737)) ([9f3e890](https://github.com/blackbaud/skyux/commit/9f3e890fc7a2950cc332345bc2cc04a85243dbaa))
* **components/packages:** recognize leading tilde and relative paths when fixing SCSS imports ([#735](https://github.com/blackbaud/skyux/issues/735)) ([30e9817](https://github.com/blackbaud/skyux/commit/30e9817e8a7fe0344f26f1c2206df158e8c72cfa))

## [7.0.0-beta.8](https://github.com/blackbaud/skyux/compare/7.0.0-beta.7...7.0.0-beta.8) (2022-10-24)


### Bug Fixes

* **components/packages:** add compat stylesheet to angular.json only if needed ([#728](https://github.com/blackbaud/skyux/issues/728)) ([c7ac8d1](https://github.com/blackbaud/skyux/commit/c7ac8d1880536702d00ca7283c57979595306310))
* **components/theme:** add module names for SCSS variables ([#730](https://github.com/blackbaud/skyux/issues/730)) ([8a8ceb0](https://github.com/blackbaud/skyux/commit/8a8ceb0275dc5189a5c00b21412d8eb68174ed0b))

## [7.0.0-beta.7](https://github.com/blackbaud/skyux/compare/7.0.0-beta.6...7.0.0-beta.7) (2022-10-24)


### Bug Fixes

* **components/packages:** add compat stylesheet to project source roots ([#726](https://github.com/blackbaud/skyux/issues/726)) ([68393f4](https://github.com/blackbaud/skyux/commit/68393f43dca19fa91376149707f26032d9b74cac))
* **components/theme:** remove variables exports from SCSS mixins ([#725](https://github.com/blackbaud/skyux/issues/725)) ([7153e95](https://github.com/blackbaud/skyux/commit/7153e9551144b7c1c258140c90f710c934daf8c5))

## [7.0.0-beta.6](https://github.com/blackbaud/skyux/compare/7.0.0-beta.5...7.0.0-beta.6) (2022-10-21)


### Bug Fixes

* **components/forms:** set radio group 'aria-owns' to satisfy accessibility rules ([#671](https://github.com/blackbaud/skyux/issues/671)) ([32f1e1e](https://github.com/blackbaud/skyux/commit/32f1e1e2731e1ba5260d3ebe159a37370f950aa2))
* **components/theme:** address missing files in the SCSS exports API ([#721](https://github.com/blackbaud/skyux/issues/721)) ([923fac0](https://github.com/blackbaud/skyux/commit/923fac043f474548971ba0b93d887a6c91de26cc))


### Deprecations

* **components/tabs:** deprecate `tabHeaderCount` and remove from code examples ([#714](https://github.com/blackbaud/skyux/issues/714)) ([f40696f](https://github.com/blackbaud/skyux/commit/f40696f078819c8d2e59337b238dd11569482236))

## [6.25.1](https://github.com/blackbaud/skyux/compare/6.25.0...6.25.1) (2022-10-20)


### Bug Fixes

* **components/lookup:** search icon is placed within input when not using an input box or the show more functionality ([#701](https://github.com/blackbaud/skyux/issues/701)) ([98e62f8](https://github.com/blackbaud/skyux/commit/98e62f869552e8acc281b400bceeca907b27bf32))
* **components/lookup:** set `aria-expanded` to true on the autocomplete component when the dropdown is open ([#544](https://github.com/blackbaud/skyux/issues/544)) ([#702](https://github.com/blackbaud/skyux/issues/702)) ([b1219ad](https://github.com/blackbaud/skyux/commit/b1219adeb1fd4208213e7fd93748f32098ab6245))

## [7.0.0-beta.5](https://github.com/blackbaud/skyux/compare/7.0.0-beta.4...7.0.0-beta.5) (2022-10-20)


### Features

* **components/forms:** support status indicator errors for input box ([#633](https://github.com/blackbaud/skyux/issues/633)) ([#695](https://github.com/blackbaud/skyux/issues/695)) ([7d15414](https://github.com/blackbaud/skyux/commit/7d15414f4d5bdae50b5352d6d73354642376bdc2))
* update page and split view components to support docking content to the available viewport ([#688](https://github.com/blackbaud/skyux/issues/688)) ([158b262](https://github.com/blackbaud/skyux/commit/158b2627db4ab6a14a1d4e049a29b50280d36ec3))


### Bug Fixes

* **components/angular-tree-component:** set 'aria-owns' to address a11y violation ([#666](https://github.com/blackbaud/skyux/issues/666)) ([cab7dae](https://github.com/blackbaud/skyux/commit/cab7dae2fcbb3eb9ce4a0efe9793995aedd52ddd))
* **components/indicators:** set wait component role to 'progressbar' ([#655](https://github.com/blackbaud/skyux/issues/655)) ([7612e6b](https://github.com/blackbaud/skyux/commit/7612e6ba917746539dac4aff039ca29940630fb3))
* **components/inline-form:** remove inline form race condition ([#670](https://github.com/blackbaud/skyux/issues/670)) ([bfcb7fd](https://github.com/blackbaud/skyux/commit/bfcb7fd7fbec01d8eb93ccad0001732b227fb775))
* **components/lookup:** remove ARIA label from non-functional search icon ([#654](https://github.com/blackbaud/skyux/issues/654)) ([0225d2c](https://github.com/blackbaud/skyux/commit/0225d2cf24135eca63b4e22c9cc07f14b93fcfe0))
* **components/lookup:** search icon is placed within input when not using an input box or the show more functionality ([#701](https://github.com/blackbaud/skyux/issues/701)) ([#704](https://github.com/blackbaud/skyux/issues/704)) ([ef2862a](https://github.com/blackbaud/skyux/commit/ef2862afc2a85bb682da3ba5b6edf0ae233fad3e))
* **components/tabs:** fix a11y violations for wizard and vertical tabs ([#651](https://github.com/blackbaud/skyux/issues/651)) ([9b53409](https://github.com/blackbaud/skyux/commit/9b53409271b78e1091462578ee02c7b470a75832))

## [7.0.0-beta.4](https://github.com/blackbaud/skyux/compare/7.0.0-beta.3...7.0.0-beta.4) (2022-10-17)


### ⚠ BREAKING CHANGES

* **components/modals:** `dynamicComponentService` is now a required parameter of `SkyModalService`. To address this change, provide the `dynamicComponentService` wherever you are constructing the `SkyModalService` or any mocks extending it  for unit testing.

### Features

* **components/modals:** make `dynamicComponentService` required in `SkyModalService` constructor ([#674](https://github.com/blackbaud/skyux/issues/674)) ([c7c60f2](https://github.com/blackbaud/skyux/commit/c7c60f273c8bb988bcd7908282ba623723e861e0))


### Bug Fixes

* **components/forms:** use a label instead of a button as the wrapper ([#687](https://github.com/blackbaud/skyux/issues/687)) ([f2f2039](https://github.com/blackbaud/skyux/commit/f2f2039c9da142d01c5b0f3444616209cb17a15c))
* **components/packages:** remove forward slash to compat stylesheet in angular.json ([#696](https://github.com/blackbaud/skyux/issues/696)) ([5b7eb4b](https://github.com/blackbaud/skyux/commit/5b7eb4b5d4bae82847ac6607241558cbdd4c2d39))
* **sdk/testing:** use default `axe-core` rules when running the `toBeAccessible` matcher ([#681](https://github.com/blackbaud/skyux/issues/681)) ([ed1b5bb](https://github.com/blackbaud/skyux/commit/ed1b5bba5a37f006bc25a09bd92f003501f848ea))


### Deprecations

* **components/popovers:** deprecate `SkyDropdownComponent` `buttonType` icon class option ([#663](https://github.com/blackbaud/skyux/issues/663)) ([b8c1027](https://github.com/blackbaud/skyux/commit/b8c102782998a85f43f818e7e923be0ef786c1e6))

## [7.0.0-beta.3](https://github.com/blackbaud/skyux/compare/7.0.0-beta.2...7.0.0-beta.3) (2022-10-14)


### ⚠ BREAKING CHANGES

* **components/indicators:** This change removes support for `alertType` on the alert component being an unaccepted string. To address this change, change the `alertType` to an accepted `SkyIndicatorTypeIcon` or remove it to use the default `alertType` of `'warning'`.
* **components/forms:** The `SkyFileDrop` and `SkyFileAttachment` components' `validateFn` input type was updated to receive a `SkyFileType` parameter and return a string or undefined. To address this, ensure all `validateFn` inputs have the correct parameter and return types.
* **components/config:** The config params `get` function was updated to accurately reflect that it may return undefined. To address this change, account for a possible undefined value wherever you are using the `get` function.
* **components/modals:** `SkyModalConfigurationInterface.providers` accepts an array of `StaticProvider`s instead of any value.
* **components/modals:** `SkyConfirmButton`'s `styleType` will only accept predefined strings of type `SkyConfirmButtonStyleType`. To address this, ensure `styleType` is only being set to a supported value.
* **components/modals:** The `SkyConfirmButton` component is intended for internal use only and is removed from the exported API. To address this, remove any usages of the `SkyConfirmButton` component.

### Features

* **components/angular-tree-component:** add inline help support for angular tree component ([#659](https://github.com/blackbaud/skyux/issues/659)) ([3fbabf2](https://github.com/blackbaud/skyux/commit/3fbabf28cb406a220aa4d7dbfe282b8a81e6365a))
* **components/config:** add more specific typing to config params function return types ([#668](https://github.com/blackbaud/skyux/issues/668)) ([102cd0a](https://github.com/blackbaud/skyux/commit/102cd0a97a5b64c78e469b462fe1f59601e44557))
* **components/forms:** update file attachment validateFn inputs to more specific type ([#669](https://github.com/blackbaud/skyux/issues/669)) ([95b7ab5](https://github.com/blackbaud/skyux/commit/95b7ab59f6352a591dcff17da5d76c3e9c4d3325))
* **components/indicators:** change `alertType` to `SkyIndicatorIconType` ([#683](https://github.com/blackbaud/skyux/issues/683)) ([9081186](https://github.com/blackbaud/skyux/commit/90811866e56e772f95422db308ed7caf801cfac0))
* **components/indicators:** remove bottom margin from alert component ([#648](https://github.com/blackbaud/skyux/issues/648)) ([5bd8762](https://github.com/blackbaud/skyux/commit/5bd87621ba412cebb38285b6e9ece256e07bbe6b))
* **components/lookup:** deprecate search inputs ([#647](https://github.com/blackbaud/skyux/issues/647)) ([74396bb](https://github.com/blackbaud/skyux/commit/74396bb18906e82e86fa920276c8f709bd5b0143))
* **components/modals:** improve `SkyModalConfigurationInterface.providers` type ([#665](https://github.com/blackbaud/skyux/issues/665)) ([a65dae0](https://github.com/blackbaud/skyux/commit/a65dae0642b45764fed92d9671e2830e0f1cc24e))
* **components/modals:** remove 'string' from `SkyConfirmButton`'s `styleType` type ([#664](https://github.com/blackbaud/skyux/issues/664)) ([8fda84e](https://github.com/blackbaud/skyux/commit/8fda84ebf9afa68e0c436578dbb6177f6cc7bfdd))
* **components/modals:** remove public export of confirm button ([#656](https://github.com/blackbaud/skyux/issues/656)) ([f465207](https://github.com/blackbaud/skyux/commit/f46520739ebf874d759efa372a809d19cee3afb6))
* **components/tabs:** add descriptive aria label to tab buttons ([#586](https://github.com/blackbaud/skyux/issues/586)) ([#660](https://github.com/blackbaud/skyux/issues/660)) ([9a01d54](https://github.com/blackbaud/skyux/commit/9a01d549d498a9616d16aae4e3334b878372da3e))
* **components/toast:** improve toast service `openComponent` `component` param type ([#667](https://github.com/blackbaud/skyux/issues/667)) ([8ffa182](https://github.com/blackbaud/skyux/commit/8ffa182538269488b561fda377dc677927f0e227))


### Bug Fixes

* **components/lookup:** modern search clickbox takes up entire input box ([#677](https://github.com/blackbaud/skyux/issues/677)) ([#679](https://github.com/blackbaud/skyux/issues/679)) ([2b70b38](https://github.com/blackbaud/skyux/commit/2b70b383a69bbe0c7028e0fdfaeb129d0c6fb1fa))
* **components/text-editor:** toolbars are hidden when no items exist within the toolbars ([#676](https://github.com/blackbaud/skyux/issues/676)) ([#678](https://github.com/blackbaud/skyux/issues/678)) ([9711a84](https://github.com/blackbaud/skyux/commit/9711a842e8c3a5c6887adfdfceab6719001a4a1e))

## [6.25.0](https://github.com/blackbaud/skyux/compare/6.24.0...6.25.0) (2022-10-13)


### Features

* **components/forms:** support status indicator errors for input box ([#633](https://github.com/blackbaud/skyux/issues/633)) ([7648638](https://github.com/blackbaud/skyux/commit/764863802c3e4d18212dbd86fe390e14c3df0fb2))


### Bug Fixes

* **components/lookup:** modern search clickbox takes up entire input box ([#677](https://github.com/blackbaud/skyux/issues/677)) ([85330ed](https://github.com/blackbaud/skyux/commit/85330ed879054cd8967d9a075589ea601775509f))
* **components/text-editor:** toolbars are hidden when no items exist within the toolbars ([#676](https://github.com/blackbaud/skyux/issues/676)) ([b2ba8de](https://github.com/blackbaud/skyux/commit/b2ba8de9952306c576bd04b066b70626cb756eee))

## [6.24.0](https://github.com/blackbaud/skyux/compare/6.23.3...6.24.0) (2022-10-10)


### Features

* **components/angular-tree-component:** add inline help support for angular tree component ([#631](https://github.com/blackbaud/skyux/issues/631)) ([8674852](https://github.com/blackbaud/skyux/commit/86748522fc65f59830850303ed1839368e0e3317))
* **components/tabs:** add descriptive aria label to tab buttons ([#586](https://github.com/blackbaud/skyux/issues/586)) ([f827ca0](https://github.com/blackbaud/skyux/commit/f827ca0cde063303fa525b4c01510ba8abe663d8))

## [7.0.0-beta.2](https://github.com/blackbaud/skyux/compare/7.0.0-beta.1...7.0.0-beta.2) (2022-10-07)


### ⚠ BREAKING CHANGES

* **components/tabs:** This change removes support for not using a finish navigation button with the previous and next wizard navigation buttons. To address this change, remove other save or finish buttons and use the `sky-tabset-nav-button` of type `finish` instead.
* **components/datetime:** The 'SkyFuzzyDatepickerInputDirective' included a nonfunctional input 'skyFuzzyDatepickerInput' to support backward compatibility. The input can be removed from consumer templates without loss of functionality.
* **components/forms:** This change updates the `SkyCheckboxChange` type to be an interface instead of a class. To address this, remove any instances of instantiating the `SkyCheckboxChange` class and instead create an object that uses the interface type.
* **components/layout:** This change removes the `SkyFluidGridGutterSize` enum and the numerical options (0, 1, 2) from `SkyFluidGridGutterSizeType`. To address this, only use the strings 'small', 'medium', and 'large' for  the fluid grid component's `gutterSize` property, and use `SkyFluidGridGutterSizeType` for Typescript typing.
* **components/indicators:** This change updates the types accepted by the key info component's layout property. To address this change, only pass 'horizontal' or 'vertical' to the property, and use the type `SkyKeyInfoLayoutType` if typing variables.

### Features

* **components/datetime:** make 'moment' a peer dependency ([#615](https://github.com/blackbaud/skyux/issues/615)) ([9bb61f9](https://github.com/blackbaud/skyux/commit/9bb61f92acdb976d39fc3bc9fc179d63d0ef6ae7))
* **components/forms:** change `SkyCheckboxChange` type to an interface ([#597](https://github.com/blackbaud/skyux/issues/597)) ([2c3c1e9](https://github.com/blackbaud/skyux/commit/2c3c1e9643c7008f91aad6138aa7649aa095aa97))
* **components/indicators:** remove support for key info layout string type ([#587](https://github.com/blackbaud/skyux/issues/587)) ([ffac254](https://github.com/blackbaud/skyux/commit/ffac254c75e600f044147a6ed5946eafee75e8c9))
* **components/indicators:** update inline help emitter type to void ([#584](https://github.com/blackbaud/skyux/issues/584)) ([878b6de](https://github.com/blackbaud/skyux/commit/878b6ded9c2c2d967af751e52a64d1ce2a1be741))
* **components/layout:** remove deprecated fluid grid gutter size options ([#585](https://github.com/blackbaud/skyux/issues/585)) ([338771d](https://github.com/blackbaud/skyux/commit/338771d3d43d96c057aa0957fc8a401d1a761ac9))
* **components/modals:** add inline-help support for modals ([#598](https://github.com/blackbaud/skyux/issues/598)) ([92b49c9](https://github.com/blackbaud/skyux/commit/92b49c9e1e084e70ed1b03fad2683cc51fc3f265))
* **components/progress-indicator:** add inline-help support for progress indicator ([#599](https://github.com/blackbaud/skyux/issues/599)) ([ac3ec1f](https://github.com/blackbaud/skyux/commit/ac3ec1f4c2c2a3c0483b503b253cd7e8460ba72f))
* **components/tabs:** remove support for not using a finish nav button ([#618](https://github.com/blackbaud/skyux/issues/618)) ([cdd8a8f](https://github.com/blackbaud/skyux/commit/cdd8a8f4a58bb072bf93553d5f97509c4882e644))


### Bug Fixes

* **components/datetime:** remove nonfunctional 'skyFuzzyDatepickerInput' input from fuzzy date ([#591](https://github.com/blackbaud/skyux/issues/591)) ([b86e0ae](https://github.com/blackbaud/skyux/commit/b86e0aea90565d4f4e0c84041b1c02db15c53bbd))
* **components/layout:** animate text expand consistently when the expansion state changes ([#592](https://github.com/blackbaud/skyux/issues/592)) ([9e468f5](https://github.com/blackbaud/skyux/commit/9e468f5833b5bccfc35a3e50f2d25ec47359a31c))
* **components/layout:** animate text expand repeater consistently when the expansion state changes ([#602](https://github.com/blackbaud/skyux/issues/602)) ([62ddece](https://github.com/blackbaud/skyux/commit/62ddece3009240be335b8b9f37fd9d85d915cb12))
* **components/modals:** set modal content tabindex to make scrollable area focusable ([#619](https://github.com/blackbaud/skyux/issues/619)) ([#625](https://github.com/blackbaud/skyux/issues/625)) ([ec2bc10](https://github.com/blackbaud/skyux/commit/ec2bc10aa3869c2a9aebdcb2c70c22710482099d))
* **components/modals:** unsubscribe from preset button observable once the buttons have been emitted ([#640](https://github.com/blackbaud/skyux/issues/640)) ([a8a87ff](https://github.com/blackbaud/skyux/commit/a8a87ff8e0eeed44a73f4260d8998291b2ef8fa3))
* **components/pages:** update needs-attention to match box design ([#582](https://github.com/blackbaud/skyux/issues/582)) ([#611](https://github.com/blackbaud/skyux/issues/611)) ([f1619a7](https://github.com/blackbaud/skyux/commit/f1619a7df407243614fd35396ca9576fd6b6de45))
* **components/phone-field:** validate new area codes as valid ([#634](https://github.com/blackbaud/skyux/issues/634)) ([#637](https://github.com/blackbaud/skyux/issues/637)) ([636143d](https://github.com/blackbaud/skyux/commit/636143d65e03021f6eac98baeba04244eb2bf150))

## [6.23.3](https://github.com/blackbaud/skyux/compare/6.23.2...6.23.3) (2022-10-06)


### Bug Fixes

* **components/phone-field:** validate new area codes as valid ([#634](https://github.com/blackbaud/skyux/issues/634)) ([deb20ae](https://github.com/blackbaud/skyux/commit/deb20ae5b41918bc35a383ebf585621a8b1a5dd4))

## [6.23.2](https://github.com/blackbaud/skyux/compare/6.23.1...6.23.2) (2022-10-04)


### Bug Fixes

* **components/modals:** set modal content tabindex to make scrollable area focusable ([#619](https://github.com/blackbaud/skyux/issues/619)) ([d71c467](https://github.com/blackbaud/skyux/commit/d71c46778cb7aaed64aa9ae4b190a410f5ecf437))

## [6.23.1](https://github.com/blackbaud/skyux/compare/6.23.0...6.23.1) (2022-10-03)


### Bug Fixes

* **components/pages:** update needs-attention to match box design ([#582](https://github.com/blackbaud/skyux/issues/582)) ([8ad0ada](https://github.com/blackbaud/skyux/commit/8ad0ada69aa01f4e9cfcbd62929a47eb573cef58))

## [6.23.0](https://github.com/blackbaud/skyux/compare/6.22.0...6.23.0) (2022-09-28)


### Features

* **components/modals:** add inline-help support for modals ([#565](https://github.com/blackbaud/skyux/issues/565)) ([f41e411](https://github.com/blackbaud/skyux/commit/f41e4111716c9d240db4ee7d1318a94ac6c97112))
* **components/progress-indicator:** add inline-help support for progress indicator component ([#566](https://github.com/blackbaud/skyux/issues/566)) ([2df708e](https://github.com/blackbaud/skyux/commit/2df708e08dc22395ee2b9e1b33de78d46375628d))

## [7.0.0-beta.1](https://github.com/blackbaud/skyux/compare/7.0.0-beta.0...7.0.0-beta.1) (2022-09-27)


### Features

* **components/tabs:** wizard keyboard nav and roles ([#558](https://github.com/blackbaud/skyux/issues/558)) ([49c7872](https://github.com/blackbaud/skyux/commit/49c7872239f9bacbc52839ab1d5d59b342186597))
* **components/tiles:** add inline help support for tile dashboard ([#563](https://github.com/blackbaud/skyux/issues/563)) ([#567](https://github.com/blackbaud/skyux/issues/567)) ([2377a7f](https://github.com/blackbaud/skyux/commit/2377a7f9ecf5af8616a4b5fee5da9bcd14c6d73d))


### Bug Fixes

* **components/ag-grid:** option to show horizontal scrollbar at top when using trackpad ([#552](https://github.com/blackbaud/skyux/issues/552)) ([#578](https://github.com/blackbaud/skyux/issues/578)) ([1f2d314](https://github.com/blackbaud/skyux/commit/1f2d31425158002940f5379db35d23e9c45463d6))
* **components/lookup:** set `aria-expanded` to true on the autocomplete component when the dropdown is open ([#544](https://github.com/blackbaud/skyux/issues/544)) ([1aa059d](https://github.com/blackbaud/skyux/commit/1aa059d5892ce4a3f7da206ac353e18fb71f0614))

## [6.22.0](https://github.com/blackbaud/skyux/compare/6.21.0...6.22.0) (2022-09-27)


### Features

* **components/tabs:** wizard keyboard nav and roles ([#558](https://github.com/blackbaud/skyux/issues/558)) ([#561](https://github.com/blackbaud/skyux/issues/561)) ([d0db9a9](https://github.com/blackbaud/skyux/commit/d0db9a9754be7e8b609b29ceadf1c0dc61108abe))
* **components/tiles:** add inline help support for tile dashboard ([#563](https://github.com/blackbaud/skyux/issues/563)) ([5e9afad](https://github.com/blackbaud/skyux/commit/5e9afade9ba1e542fefc83f473c057ac1057e89f))


### Bug Fixes

* **components/ag-grid:** option to show horizontal scrollbar at top when using trackpad ([#552](https://github.com/blackbaud/skyux/issues/552)) ([2f75827](https://github.com/blackbaud/skyux/commit/2f75827fc7fe8966583f30b5f44eae990956beac))

## [7.0.0-beta.0](https://github.com/blackbaud/skyux/compare/6.21.0...7.0.0-beta.0) (2022-09-22)


### ⚠ BREAKING CHANGES

* add support for Angular 14 (#539)

### Features

* add support for Angular 14 ([#539](https://github.com/blackbaud/skyux/issues/539)) ([bc28ca0](https://github.com/blackbaud/skyux/commit/bc28ca0df0183146f92482c396409d0369ae4532))

## [6.21.0](https://github.com/blackbaud/skyux/compare/6.20.0...6.21.0) (2022-09-20)


### Features

* **components/layout:** add inline help support for box ([#504](https://github.com/blackbaud/skyux/issues/504)) ([460ff73](https://github.com/blackbaud/skyux/commit/460ff7389659d9329385debc0151f59c3cccaf83))
* **components/pages:** add option for click event from needs attention items ([#496](https://github.com/blackbaud/skyux/issues/496)) ([4c33198](https://github.com/blackbaud/skyux/commit/4c33198f34b8b19350cf3deb3f869fb6544f5616))


### Bug Fixes

* **components/config:** revert accidental breaking change resulting from the `SkyAppRuntimeConfigParams.get` method's return type ([#534](https://github.com/blackbaud/skyux/issues/534)) ([6784e67](https://github.com/blackbaud/skyux/commit/6784e67f68e9ba7df83f2a7c8342acd3a50fb6b4))

## [6.20.0](https://github.com/blackbaud/skyux/compare/6.19.0...6.20.0) (2022-09-16)


### Features

* **components/modals:** confirm test harness ([#510](https://github.com/blackbaud/skyux/issues/510)) ([3b373e9](https://github.com/blackbaud/skyux/commit/3b373e9a6733c392846ac030c10537cdd287d962))
* **components/text-editor:** add inline help example for text editor ([#502](https://github.com/blackbaud/skyux/issues/502)) ([476daca](https://github.com/blackbaud/skyux/commit/476dacafa0269f645f5b7cd546b4c065707b816b))


### Bug Fixes

* **components/lookup:** rename harness filters `textContent` property to `text` to satisfy conventions ([#526](https://github.com/blackbaud/skyux/issues/526)) ([8f1b8f5](https://github.com/blackbaud/skyux/commit/8f1b8f55dce5ed094e34e3d75364d3c6f584b620))

## [6.19.0](https://github.com/blackbaud/skyux/compare/6.18.0...6.19.0) (2022-09-14)


### Features

* **components/indicators:** add key info component harness ([#498](https://github.com/blackbaud/skyux/issues/498)) ([4ba11a0](https://github.com/blackbaud/skyux/commit/4ba11a050ad09e762f718cc613ffb55bfdb686ff))
* **components/indicators:** update alert test harness with accessibility functions ([#500](https://github.com/blackbaud/skyux/issues/500)) ([ee7c8bf](https://github.com/blackbaud/skyux/commit/ee7c8bf424b3542674cfbeb2a145a4e88bd86cba))


### Deprecations

* **components/modals:** deprecate confirm autofocus ([#507](https://github.com/blackbaud/skyux/issues/507)) ([67a0fa9](https://github.com/blackbaud/skyux/commit/67a0fa92f6a185e2976fd63330fc0694510c0964))

## [6.18.0](https://github.com/blackbaud/skyux/compare/6.17.1...6.18.0) (2022-09-08)


### Features

* **components/indicators:** add harness for interacting with label components in tests ([#489](https://github.com/blackbaud/skyux/issues/489)) ([9edd8b7](https://github.com/blackbaud/skyux/commit/9edd8b7954d3d6dc23a50b6de7181a772576c887))


### Bug Fixes

* **components/lookup:** set z-index on lookup tokens inside input box ([#493](https://github.com/blackbaud/skyux/issues/493)) ([bd09496](https://github.com/blackbaud/skyux/commit/bd09496af82a1800f5a694839fa0d30593f1b42b))
* **components/theme:** replaced link glyph and added attach icon ([#494](https://github.com/blackbaud/skyux/issues/494)) ([885f011](https://github.com/blackbaud/skyux/commit/885f011cdd30997262746f5696f006f12806dc32))

## [6.17.1](https://github.com/blackbaud/skyux/compare/6.17.0...6.17.1) (2022-09-06)


### Bug Fixes

* **components/data-manager:** update activeView on data view config updates ([#480](https://github.com/blackbaud/skyux/issues/480)) ([90177b5](https://github.com/blackbaud/skyux/commit/90177b5171d69291ab0c8987062c11e6f984fb6b))
* **components/modals:** hide non modal elements from screen readers ([#397](https://github.com/blackbaud/skyux/issues/397)) ([6e2a171](https://github.com/blackbaud/skyux/commit/6e2a17156766a4d08585b0fb6b62ead5efee11c6))

## [6.17.0](https://github.com/blackbaud/skyux/compare/6.16.0...6.17.0) (2022-09-02)


### Features

* **components/indicators:** add accessibility description inputs to alert ([#474](https://github.com/blackbaud/skyux/issues/474)) ([81d5166](https://github.com/blackbaud/skyux/commit/81d5166dcc89807b1e651bd0f47316750d90ebb2))
* **components/tabs:** tabset wizard finish nav button ([#454](https://github.com/blackbaud/skyux/issues/454)) ([735312f](https://github.com/blackbaud/skyux/commit/735312ff0e86226db757d9e1938f43f7a90af0b4))


### Bug Fixes

* **components/indicators:** only escape highlight directive search text once ([#464](https://github.com/blackbaud/skyux/issues/464)) ([1e5741b](https://github.com/blackbaud/skyux/commit/1e5741bd45fa19631e39f50550d77b7b170db354))
* **components/progress-indicator:** fix spacing on wizard buttons in modern theme ([#465](https://github.com/blackbaud/skyux/issues/465)) ([f36b243](https://github.com/blackbaud/skyux/commit/f36b2433630dc12a63fe0f66cabafe33b85c5500))

## [6.16.0](https://github.com/blackbaud/skyux/compare/6.15.0...6.16.0) (2022-08-30)


### Features

* **components/indicators:** label accessibility updates ([#409](https://github.com/blackbaud/skyux/issues/409)) ([4c2c878](https://github.com/blackbaud/skyux/commit/4c2c8789f1e77f822bc1fac07f5787aa3fc194bf))
* **components/theme:** add CSS custom properties for spacing ([#453](https://github.com/blackbaud/skyux/issues/453)) ([60389bd](https://github.com/blackbaud/skyux/commit/60389bd0ffef143a7f29391a4be580c92c7cc4fb))


### Bug Fixes

* **components/indicators:** alert harness filters interface is now exported ([#456](https://github.com/blackbaud/skyux/issues/456)) ([1b653aa](https://github.com/blackbaud/skyux/commit/1b653aa74672f09cb0d6427d7cad4f76ffc1a282))

## [6.15.0](https://github.com/blackbaud/skyux/compare/6.14.0...6.15.0) (2022-08-26)

### Features

- **components/lookup:** add harness for interacting with search components in tests ([#431](https://github.com/blackbaud/skyux/issues/431)) ([385f97b](https://github.com/blackbaud/skyux/commit/385f97b478f1aecc0f0c86b1120144a68e1c3d22))
- **components/lookup:** add lookup testing harness ([#364](https://github.com/blackbaud/skyux/issues/364)) ([ec23a51](https://github.com/blackbaud/skyux/commit/ec23a518470a9e2e53bbf05d5d5ec3b268840ed6))

### Bug Fixes

- **components/ag-grid:** top scroll not visible ([#415](https://github.com/blackbaud/skyux/issues/415)) ([6fd28d5](https://github.com/blackbaud/skyux/commit/6fd28d57fcbf6106656f00d3089d7c75c5415676))
- **components/datetime:** use input event to mark picker as dirty ([#438](https://github.com/blackbaud/skyux/issues/438)) ([8d69ff1](https://github.com/blackbaud/skyux/commit/8d69ff1da74353e80fafc41d83f68f647fe7a08b))
- **components/indicators:** label and status indicator show icons when default states are being used ([#410](https://github.com/blackbaud/skyux/issues/410)) ([b3233b7](https://github.com/blackbaud/skyux/commit/b3233b7d1a2d65807d0e2ac3687f64e9dbc182fa))
- **components/layout:** fix 'TemplateRef<any>' is not assignable to type 'TemplateRef<never>' ([#450](https://github.com/blackbaud/skyux/issues/450)) ([fb7d8fd](https://github.com/blackbaud/skyux/commit/fb7d8fd1bd282baa7c5576550b53751714348b12))
- **components/lookup:** show more modal infinite scroll respects only show selected checkbox ([#427](https://github.com/blackbaud/skyux/issues/427)) ([4d47aaf](https://github.com/blackbaud/skyux/commit/4d47aafd1846aa2e7813ed8b8def5a4335868b8b))
- **components/pages:** action hub allow callback on needs attention items ([#386](https://github.com/blackbaud/skyux/issues/386)) ([c6cbe16](https://github.com/blackbaud/skyux/commit/c6cbe16983ad69d7f36c3aa596959a15f00fcfd5))
- **components/toast:** toast shows icon when default state is being used ([#426](https://github.com/blackbaud/skyux/issues/426)) ([b46dbfc](https://github.com/blackbaud/skyux/commit/b46dbfccbcf2e55d5921be9e8ac262c8d8bb2c77))
- **sdk/e2e-schematics:** support Windows ([#430](https://github.com/blackbaud/skyux/issues/430)) ([473b643](https://github.com/blackbaud/skyux/commit/473b6431ffb7beb34aaf571502d11e40499ff6a6))

## [6.14.0](https://github.com/blackbaud/skyux/compare/6.13.0...6.14.0) (2022-08-23)

### Features

- **components/forms:** add harness to interact with checkbox components in tests ([#428](https://github.com/blackbaud/skyux/issues/428)) ([cf67022](https://github.com/blackbaud/skyux/commit/cf67022ab1e54b452bf51ca6c1c5c4c432d20b02))
- **components/indicators:** add harness for interacting with alert components in tests ([#422](https://github.com/blackbaud/skyux/issues/422)) ([37acc5e](https://github.com/blackbaud/skyux/commit/37acc5e21d769e8cbda41a9ce89af346ab8cd16a))
- **components/indicators:** add harness for interacting with token components in tests ([#417](https://github.com/blackbaud/skyux/issues/417)) ([33fd786](https://github.com/blackbaud/skyux/commit/33fd786fcb77518e4c5d099032eae7c04f4b1249))
- **components/lists:** add harness for interacting with infinite scroll components in tests ([#421](https://github.com/blackbaud/skyux/issues/421)) ([4970a20](https://github.com/blackbaud/skyux/commit/4970a2069bf404be05f766bb536319cfed29bd53))
- **components/lists:** add harness for interacting with repeater components in tests ([#429](https://github.com/blackbaud/skyux/issues/429)) ([c7b6b3e](https://github.com/blackbaud/skyux/commit/c7b6b3ec7065317408b917b83123754936e5875a))
- **components/lookup:** add harness for interacting with autocomplete components in tests ([#413](https://github.com/blackbaud/skyux/issues/413)) ([be233a5](https://github.com/blackbaud/skyux/commit/be233a58818a630100b0ba9c538bb8a7a8060dfa))

### Bug Fixes

- **components/modals:** close all modals before removing host element ([#424](https://github.com/blackbaud/skyux/issues/424)) ([43f360c](https://github.com/blackbaud/skyux/commit/43f360c16da2f63f3f13c6229c3f6cc6d3ea9010))

## [6.13.0](https://github.com/blackbaud/skyux/compare/6.12.0...6.13.0) (2022-08-18)

### Features

- **components/core:** add `SkyIdService` to generate unique IDs for HTML elements ([#395](https://github.com/blackbaud/skyux/issues/395)) ([e7e48dc](https://github.com/blackbaud/skyux/commit/e7e48dcea700395c88ecc9a3b70ac4b399bd7a9d))
- **components/core:** add overlay harness for interacting with overlay components in tests ([#398](https://github.com/blackbaud/skyux/issues/398)) ([c96f6d7](https://github.com/blackbaud/skyux/commit/c96f6d7ca8aad57696d416bd5305a1204c827eb2))
- **components/forms:** add input box harness for interacting with input box components in tests ([#399](https://github.com/blackbaud/skyux/issues/399)) ([ed377a1](https://github.com/blackbaud/skyux/commit/ed377a166a991f080da0be9ded6fc65098c44ae8))

### Bug Fixes

- **components/lookup:** add context to searches ([#381](https://github.com/blackbaud/skyux/issues/381)) ([0d02f73](https://github.com/blackbaud/skyux/commit/0d02f73cb977912d8beb1ea623db09c814edea9e))
- **components/lookup:** async show more modal toolbars now correctly stick to the top of the modal content ([#408](https://github.com/blackbaud/skyux/issues/408)) ([2ccc8ec](https://github.com/blackbaud/skyux/commit/2ccc8ecf56a146b545a3b633c64ddcc16ae485e5))

## [6.12.0](https://github.com/blackbaud/skyux/compare/6.11.2...6.12.0) (2022-08-15)

### Features

- **components/tabs:** update modern theme styling for tabset wizard ([#382](https://github.com/blackbaud/skyux/issues/382)) ([e9d8ee8](https://github.com/blackbaud/skyux/commit/e9d8ee85e7b04cf767ff909dff3233ffc72169dc))

### Bug Fixes

- **components/forms:** move toggle switch label inside button for improved accessibility ([#387](https://github.com/blackbaud/skyux/issues/387)) ([17013ed](https://github.com/blackbaud/skyux/commit/17013ed7db9e01db297ce32e3d1b956c6d421904))
- **components/lookup:** require `idProperty` for async search ([#299](https://github.com/blackbaud/skyux/issues/299)) ([93e33be](https://github.com/blackbaud/skyux/commit/93e33be9841eeee1ca3b4be087ba15967b9fa571))
- **components/modals:** add teardown functionality to modal host component ([#389](https://github.com/blackbaud/skyux/issues/389)) ([14469aa](https://github.com/blackbaud/skyux/commit/14469aa94ad53a6e96726b60001685036ae44e3b))

### [6.11.2](https://github.com/blackbaud/skyux/compare/6.11.1...6.11.2) (2022-08-09)

### Bug Fixes

- **components/modals:** modal content popovers correctly position above the modal footer ([#385](https://github.com/blackbaud/skyux/issues/385)) ([5ae11b7](https://github.com/blackbaud/skyux/commit/5ae11b7709834acac13003e206e4f8d9178ce974))

### [6.11.1](https://github.com/blackbaud/skyux/compare/6.11.0...6.11.1) (2022-08-08)

### Bug Fixes

- **components/forms:** radio buttons disabled states update independently from the wrapping radio group disabled state ([#384](https://github.com/blackbaud/skyux/issues/384)) ([5e870a6](https://github.com/blackbaud/skyux/commit/5e870a63eca0154de1d1e5cced9b5d182c37d832))

## [6.11.0](https://github.com/blackbaud/skyux/compare/6.10.0...6.11.0) (2022-08-08)

### Features

- **components/forms:** add inline help support for file attachment ([#372](https://github.com/blackbaud/skyux/issues/372)) ([a9693e8](https://github.com/blackbaud/skyux/commit/a9693e839dc7228a9dcbab8ebf42482edd90470f))

### Bug Fixes

- **components/indicators:** sky-wait restore focus when wait closes ([#377](https://github.com/blackbaud/skyux/issues/377)) ([b5c05b2](https://github.com/blackbaud/skyux/commit/b5c05b22f9dae3c6dc1d83fa14896e2447c35905))
- **components/lists:** repeater inline form uses form role ([#380](https://github.com/blackbaud/skyux/issues/380)) ([6d95e79](https://github.com/blackbaud/skyux/commit/6d95e797847f4df123ed16b5189db0b0f9224b29))

## [6.10.0](https://github.com/blackbaud/skyux/compare/6.9.0...6.10.0) (2022-08-03)

### Features

- **components/ag-grid:** opt-in top horizontal scrollbar in ag-grid ([#374](https://github.com/blackbaud/skyux/issues/374)) ([ea51e4e](https://github.com/blackbaud/skyux/commit/ea51e4ebded825333b5cd0023661a7ffe05034db))
- **components/forms:** add inline help support for toggle switch component ([#361](https://github.com/blackbaud/skyux/issues/361)) ([52dfc70](https://github.com/blackbaud/skyux/commit/52dfc70ef71de3079a5f436973a63ba54860e83c))
- **sdk/testing:** add SkyBy.dataSkyId() to make it easier to match data-sky-id ([#332](https://github.com/blackbaud/skyux/issues/332)) ([a61ff53](https://github.com/blackbaud/skyux/commit/a61ff531fd11c85b0eb8a5f24a3bdb3cb485b0f9))

### Bug Fixes

- **components/core:** viewkeeper now properly unsubscribes from watching for scrollable host changes when destroyed ([#376](https://github.com/blackbaud/skyux/issues/376)) ([3badc27](https://github.com/blackbaud/skyux/commit/3badc270bcc185adf4013b7714d3203e9a59c2bf))
- **components/forms:** toggle switch labels now include the `for` attribute ([#371](https://github.com/blackbaud/skyux/issues/371)) ([17c9933](https://github.com/blackbaud/skyux/commit/17c9933c11ab3ff35010c067de232ac1a26f0e8f))

## [6.9.0](https://github.com/blackbaud/skyux/compare/6.8.0...6.9.0) (2022-07-27)

### Features

- **components/forms:** add inline help support for checkbox component ([#354](https://github.com/blackbaud/skyux/issues/354)) ([49d2d3e](https://github.com/blackbaud/skyux/commit/49d2d3e2c8482eaf5f07e65a54c823f415c5ea02))
- **components/forms:** add inline help support for radio component ([#355](https://github.com/blackbaud/skyux/issues/355)) ([6e0146c](https://github.com/blackbaud/skyux/commit/6e0146c786bed7a23cc629bb022f6e554fc2a9a2))
- **components/indicators:** update icons and moment dependencies ([#359](https://github.com/blackbaud/skyux/issues/359)) ([8578e81](https://github.com/blackbaud/skyux/commit/8578e810fc090a3e48908717c1f024fa915e69de)), closes [#34](https://github.com/blackbaud/skyux/issues/34) [#35](https://github.com/blackbaud/skyux/issues/35) [#33](https://github.com/blackbaud/skyux/issues/33)

### Bug Fixes

- **components/forms:** form controls on radio groups now properly disable radio buttons on initialization and do not mark the form as dirty on programmatic changes ([#356](https://github.com/blackbaud/skyux/issues/356)) ([34eeb4b](https://github.com/blackbaud/skyux/commit/34eeb4b25c2ffd3b17065db04658f609f51bbcac))
- **components/indicators:** update icons cdn link ([#360](https://github.com/blackbaud/skyux/issues/360)) ([4c42599](https://github.com/blackbaud/skyux/commit/4c425996daede636b7c5100378c7c82aa0e2e70a))
- **components/modals:** viewkept toolbars now style correctly at the top of modern theme modals ([#347](https://github.com/blackbaud/skyux/issues/347)) ([1e570dd](https://github.com/blackbaud/skyux/commit/1e570dd02a11594d04f905ed817c67a97455ca91))

## [6.8.0](https://github.com/blackbaud/skyux/compare/6.7.0...6.8.0) (2022-07-22)

### Features

- **components/indicators:** add inline help support for key info component ([#346](https://github.com/blackbaud/skyux/issues/346)) ([748add9](https://github.com/blackbaud/skyux/commit/748add9c235eb41ed3e90ee6d082eaa32b365dbf))

### Bug Fixes

- **components/data-manager:** fix column picker once-ability and disable & warn when no columns selected ([#349](https://github.com/blackbaud/skyux/issues/349)) ([c49e4f5](https://github.com/blackbaud/skyux/commit/c49e4f50faa637caf39336489c6c9ca3a369c661))
- **components/forms:** prevent overlapping text after toggle switch label ([#344](https://github.com/blackbaud/skyux/issues/344)) ([5821fa5](https://github.com/blackbaud/skyux/commit/5821fa56522a6ae053f52b749db618971134e34e))
- **components/tabs:** fix color of text on modern theme tabsets ([#345](https://github.com/blackbaud/skyux/issues/345)) ([74a5e28](https://github.com/blackbaud/skyux/commit/74a5e289ef9e7bcbc0e511bdb4443851acad40f5))

## [6.7.0](https://github.com/blackbaud/skyux/compare/6.6.0...6.7.0) (2022-07-18)

### Features

- **components/pages:** support action hub settings ([#342](https://github.com/blackbaud/skyux/issues/342)) ([edad4e0](https://github.com/blackbaud/skyux/commit/edad4e054383ecd6c7a0967d8c463234b45da152))

### Bug Fixes

- **components/core:** add timestamp to generated IDs to avoid browser autocomplete collisions across sessions ([#339](https://github.com/blackbaud/skyux/issues/339)) ([4de1127](https://github.com/blackbaud/skyux/commit/4de112756deb64ec9bc53a010b6ea6e1b06d817c))
- **components/datetime:** datepicker handles reactive forms which are disabled during initialization ([#320](https://github.com/blackbaud/skyux/issues/320)) ([679793f](https://github.com/blackbaud/skyux/commit/679793fb23e9303a1dcf06f65f812d23c6c82add))
- **components/lookup:** show more modal toolbars now correctly stick to the top of the modal content ([#343](https://github.com/blackbaud/skyux/issues/343)) ([144a1eb](https://github.com/blackbaud/skyux/commit/144a1eb97b8a6dc381e0b1cf3b9b59308144e52d))

## [6.6.0](https://github.com/blackbaud/skyux/compare/6.5.0...6.6.0) (2022-07-08)

### Features

- **components/datetime:** convert eight digit user-entered input to a date for the datepicker component based on the specified date format ([#334](https://github.com/blackbaud/skyux/issues/334)) ([bfde6c8](https://github.com/blackbaud/skyux/commit/bfde6c823c93a87fa42603d9a49692dadc2f3bb5))

### Bug Fixes

- **components/ag-grid:** center the no-rows overlay ([#336](https://github.com/blackbaud/skyux/issues/336)) ([c67332a](https://github.com/blackbaud/skyux/commit/c67332aa14297db164d05df2040d77406aba8f0e))
- **components/layout:** keep box component's control button placement static when there is no header ([#338](https://github.com/blackbaud/skyux/issues/338)) ([89740be](https://github.com/blackbaud/skyux/commit/89740be0b19e41a0e9d5c08d64164a27aac8a839))

### Deprecations

- **components/layout:** `SkyErrorModalService` is deprecated; use a standard modal with an error component instead ([#328](https://github.com/blackbaud/skyux/issues/328)) ([abb1617](https://github.com/blackbaud/skyux/commit/abb1617d00534d40c6d7579c223dcbb90d3bc52e))

## [6.5.0](https://github.com/blackbaud/skyux/compare/6.4.0...6.5.0) (2022-07-07)

### Features

- **components/theme:** add CSS custom properties for color ([#321](https://github.com/blackbaud/skyux/issues/321)) ([c4802d6](https://github.com/blackbaud/skyux/commit/c4802d6f075a99713982b88f2c9fba8ece6833ba))
- **sdk/testing:** provide actual inner text to resource matchers messages that didn't have it ([#323](https://github.com/blackbaud/skyux/issues/323)) ([abbc6b2](https://github.com/blackbaud/skyux/commit/abbc6b2d5a4d5e13fcff386466bbb81ae5c0282a))

### Bug Fixes

- **components/core:** add timestamp to generated IDs ([#327](https://github.com/blackbaud/skyux/issues/327)) ([bef0548](https://github.com/blackbaud/skyux/commit/bef054829f08a1fcd1a7fb9de9e064a731117c83))
- **components/datetime:** timepicker does not error if all lifecycle hooks do not run prior to destruction ([#324](https://github.com/blackbaud/skyux/issues/324)) ([6deab51](https://github.com/blackbaud/skyux/commit/6deab51e3002df57f2a4431b167d3a510997c0d6))
- **components/theme:** modify margin-bottom styles in Default Visual Style ([#325](https://github.com/blackbaud/skyux/issues/325)) ([d217c75](https://github.com/blackbaud/skyux/commit/d217c7504e67def986b109abeb664bab63c61025))
- **components/theme:** modify margin-right style in Default Visual Style ([#329](https://github.com/blackbaud/skyux/issues/329)) ([e5eb943](https://github.com/blackbaud/skyux/commit/e5eb943feb02b98d93d472b22fc2df278165d69e))
- **components/theme:** use deemphasized text style for sky-font-data-label in Default Visual Style ([#317](https://github.com/blackbaud/skyux/issues/317)) ([3e0d2f4](https://github.com/blackbaud/skyux/commit/3e0d2f460b4a201e11b5986f2170340913d67d51))

## [6.4.0](https://github.com/blackbaud/skyux/compare/6.3.3...6.4.0) (2022-07-05)

### Features

- **components/indicators:** add support for `.sky-control-help` to status indicator ([#312](https://github.com/blackbaud/skyux/issues/312)) ([14bab9d](https://github.com/blackbaud/skyux/commit/14bab9d4665b76915db4f8f38f76682e18b13e11))
- **components/layout:** add support for `.sky-control-help` to description list term ([#319](https://github.com/blackbaud/skyux/issues/319)) ([c68af16](https://github.com/blackbaud/skyux/commit/c68af160c95398cb423eed5b1688a09a156c89bc))

### Bug Fixes

- **components/theme:** use 6px border radius for sky-rounded-corners in Modern Visual Style ([#313](https://github.com/blackbaud/skyux/issues/313)) ([197c3ac](https://github.com/blackbaud/skyux/commit/197c3ac2314d7fb7df9e83737a991db54fb8867c))

### [6.3.3](https://github.com/blackbaud/skyux/compare/6.3.2...6.3.3) (2022-06-24)

### Bug Fixes

- **components/layout:** delay action button height update during init ([#301](https://github.com/blackbaud/skyux/issues/301)) ([d012684](https://github.com/blackbaud/skyux/commit/d0126845c37035691d39f75387935d98e69bbd22))

### [6.3.2](https://github.com/blackbaud/skyux/compare/6.3.1...6.3.2) (2022-06-21)

### Bug Fixes

- **components/ag-grid:** show border when in edit mode ([#294](https://github.com/blackbaud/skyux/issues/294)) ([#295](https://github.com/blackbaud/skyux/issues/295)) ([49fcdfb](https://github.com/blackbaud/skyux/commit/49fcdfb6affedb45dd554e876a1ea61956097d11))
- **components/theme:** inline links and anchor tags display the correct visual styles in modern theme ([#283](https://github.com/blackbaud/skyux/issues/283)) ([#291](https://github.com/blackbaud/skyux/issues/291)) ([96211f5](https://github.com/blackbaud/skyux/commit/96211f52a867a8e89be6018e69177eef1fed7528))
- use large modal size ([#300](https://github.com/blackbaud/skyux/issues/300)) ([#302](https://github.com/blackbaud/skyux/issues/302)) ([5ef6421](https://github.com/blackbaud/skyux/commit/5ef6421313ab08466662b741453af021735b8a03))

### [5.11.2](https://github.com/blackbaud/skyux/compare/5.11.1...5.11.2) (2022-06-21)

### Bug Fixes

- **components/ag-grid:** show border when in edit mode ([#294](https://github.com/blackbaud/skyux/issues/294)) ([7be4106](https://github.com/blackbaud/skyux/commit/7be4106dcf24ad9c35a42cc6f8f9e563c56bcda5))
- **components/theme:** inline links and anchor tags display the correct visual styles in modern theme ([#283](https://github.com/blackbaud/skyux/issues/283)) ([5615c6a](https://github.com/blackbaud/skyux/commit/5615c6aa36107807534277ad1e1f166a63265d9d))
- use large modal size ([#300](https://github.com/blackbaud/skyux/issues/300)) ([761a29f](https://github.com/blackbaud/skyux/commit/761a29fd7710bdb6e7f2bf60a13a3deb7b0cdcb7))
- vulnerabilities remediation ([#292](https://github.com/blackbaud/skyux/issues/292)) ([ffe176b](https://github.com/blackbaud/skyux/commit/ffe176bd5f010620a18064e14392b83094d1accc))

### [6.3.1](https://github.com/blackbaud/skyux/compare/6.3.0...6.3.1) (2022-06-14)

### Bug Fixes

- **components/layout:** hide action button with inaccessible skyhref ([#282](https://github.com/blackbaud/skyux/issues/282)) ([41a1a06](https://github.com/blackbaud/skyux/commit/41a1a064a7394dd45ed36392b39886271b2e5441))

## [6.3.0](https://github.com/blackbaud/skyux/compare/6.2.3...6.3.0) (2022-06-09)

### Features

- **components/ag-grid:** editors follow AG Grid keyboard editing standards ([#274](https://github.com/blackbaud/skyux/issues/274)) ([#284](https://github.com/blackbaud/skyux/issues/284)) ([230aab6](https://github.com/blackbaud/skyux/commit/230aab603904f9c89b7ac85f5c5ff0f72554d05c))

### [5.11.1](https://github.com/blackbaud/skyux/compare/5.11.0...5.11.1) (2022-06-09)

## [5.11.0](https://github.com/blackbaud/skyux/compare/5.10.0...5.11.0) (2022-06-09)

### Features

- **components/ag-grid:** editors follow AG Grid keyboard editing standards ([#274](https://github.com/blackbaud/skyux/issues/274)) ([c785479](https://github.com/blackbaud/skyux/commit/c7854794b3bb0a52a5dd87de28d8470e95d05d39))

### Bug Fixes

- **components/ag-grid:** use functions instead of expressions ([ab89456](https://github.com/blackbaud/skyux/commit/ab8945624958b57ae185280a1308faf8c923f870))

### [6.2.3](https://github.com/blackbaud/skyux/compare/6.2.2...6.2.3) (2022-06-08)

### Bug Fixes

- **components/ag-grid:** use functions instead of expressions ([#281](https://github.com/blackbaud/skyux/issues/281)) ([c39dd21](https://github.com/blackbaud/skyux/commit/c39dd21389257d2be7b127f66c6eb704e94a3ca7))

### [6.2.2](https://github.com/blackbaud/skyux/compare/6.2.1...6.2.2) (2022-06-07)

### Bug Fixes

- **components/packages:** fix ng add schematic to set correct versions of packages ([#280](https://github.com/blackbaud/skyux/issues/280)) ([7d57125](https://github.com/blackbaud/skyux/commit/7d5712581b0ab0e11522ce6cc7eab60e4391e773))

### [6.2.1](https://github.com/blackbaud/skyux/compare/6.2.0...6.2.1) (2022-06-07)

### Bug Fixes

- **components/packages:** fix the `ng add` schematic to install essential SKY UX packages ([#279](https://github.com/blackbaud/skyux/issues/279)) ([3bf13ad](https://github.com/blackbaud/skyux/commit/3bf13ad57a2f63e386428298cde7cb61c3de1e8c))

## [6.2.0](https://github.com/blackbaud/skyux/compare/6.1.0...6.2.0) (2022-06-06)

### Features

- **components/config:** add `csp` property to `SkyuxConfigHost` ([#273](https://github.com/blackbaud/skyux/issues/273)) ([c5b5ede](https://github.com/blackbaud/skyux/commit/c5b5edeffa53bbbd042b5d9c39173c4da2fa29a7))

### Bug Fixes

- **components/forms:** add radio button fixture to public API ([#275](https://github.com/blackbaud/skyux/issues/275)) ([6f3299c](https://github.com/blackbaud/skyux/commit/6f3299c8746903d3f9398bec8d59af07708542bd))

## [6.1.0](https://github.com/blackbaud/skyux/compare/6.0.2...6.1.0) (2022-05-23)

### Features

- **components/validation:** create v2 ruleset for URL validation ([#201](https://github.com/blackbaud/skyux/issues/201)) ([#269](https://github.com/blackbaud/skyux/issues/269)) ([e656eb5](https://github.com/blackbaud/skyux/commit/e656eb57ee49ca91b616d86a7092323705d49fd4))

### Bug Fixes

- **components/action-bars:** persist focus on summary action bar chevrons after animations ([#264](https://github.com/blackbaud/skyux/issues/264)) ([#268](https://github.com/blackbaud/skyux/issues/268)) ([9ba805f](https://github.com/blackbaud/skyux/commit/9ba805f588ff45305a44dfe0fecb26b6ecd6eec4))
- **components/datetime:** update `moment` to version `2.29.3` ([#265](https://github.com/blackbaud/skyux/issues/265)) ([#266](https://github.com/blackbaud/skyux/issues/266)) ([b28d825](https://github.com/blackbaud/skyux/commit/b28d825edbcdc7acc0ec94f31a5290d57397a088))

## [5.10.0](https://github.com/blackbaud/skyux/compare/5.9.7...5.10.0) (2022-05-23)

### Features

- **components/validation:** create v2 ruleset for URL validation ([#201](https://github.com/blackbaud/skyux/issues/201)) ([7eff2a3](https://github.com/blackbaud/skyux/commit/7eff2a3da8662e74b7db84df506953ed54439f48))

### Bug Fixes

- **components/action-bars:** persist focus on summary action bar chevrons after animations ([#264](https://github.com/blackbaud/skyux/issues/264)) ([8473a91](https://github.com/blackbaud/skyux/commit/8473a91638ac25a0436d11328900e5735ac645a5))
- **components/datetime:** update `moment` to version `2.29.3` ([#265](https://github.com/blackbaud/skyux/issues/265)) ([af4e806](https://github.com/blackbaud/skyux/commit/af4e8062cfa5ed49b74d3f588cf1bd4e23ba76f6))

### [6.0.2](https://github.com/blackbaud/skyux/compare/6.0.1...6.0.2) (2022-05-17)

### Bug Fixes

- **components/lists:** repeater a11y improvements for aria role and keyboard interaction ([#241](https://github.com/blackbaud/skyux/issues/241)) ([#256](https://github.com/blackbaud/skyux/issues/256)) ([87dd809](https://github.com/blackbaud/skyux/commit/87dd809a0c71ea1b4e68ef58d8a6edc9d27a4aef))
- **components/lookup:** show more modal opens when triggered from a results dropdown ([#257](https://github.com/blackbaud/skyux/issues/257)) ([#258](https://github.com/blackbaud/skyux/issues/258)) ([b202eac](https://github.com/blackbaud/skyux/commit/b202eaccca1be6723d9688418374274659c50a82))

### [5.9.7](https://github.com/blackbaud/skyux/compare/5.9.6...5.9.7) (2022-05-17)

### Bug Fixes

- **components/lists:** repeater a11y improvements for aria role and keyboard interaction ([#241](https://github.com/blackbaud/skyux/issues/241)) ([0e78bf8](https://github.com/blackbaud/skyux/commit/0e78bf83b10898dfa3d1e830add718607a27e76d))
- **components/lookup:** show more modal opens when triggered from a results dropdown ([#257](https://github.com/blackbaud/skyux/issues/257)) ([0afb8d9](https://github.com/blackbaud/skyux/commit/0afb8d9c89774e4d8e1432b02da53947919ca0d0))

### [6.0.1](https://github.com/blackbaud/skyux/compare/6.0.0...6.0.1) (2022-05-13)

### Bug Fixes

- **components/ag-grid:** data manager not persisting column order ([#244](https://github.com/blackbaud/skyux/issues/244)) ([#245](https://github.com/blackbaud/skyux/issues/245)) ([a681791](https://github.com/blackbaud/skyux/commit/a681791911e194fea55a0324df96b36650ef255a))
- **components/modals:** resize observable media query service ([#252](https://github.com/blackbaud/skyux/issues/252)) ([#253](https://github.com/blackbaud/skyux/issues/253)) ([20b0b41](https://github.com/blackbaud/skyux/commit/20b0b41470276b037af3478fab17fb870e01b56a))
- **components/packages:** add `src/assets` to existing Prettier ignore files ([#248](https://github.com/blackbaud/skyux/issues/248)) ([98f0f94](https://github.com/blackbaud/skyux/commit/98f0f9463e4a791e8fd77bb78e9bb1fc394c62c9))
- **components/tabs:** use padding instead of margin when styling sectioned form content sections ([#238](https://github.com/blackbaud/skyux/issues/238)) ([#250](https://github.com/blackbaud/skyux/issues/250)) ([2233cba](https://github.com/blackbaud/skyux/commit/2233cba46f69917311acf963352aefafb255401d))
- **sdk/prettier-schematics:** include `.angular/cache` and `src/assets` in Prettier's ignore file ([#247](https://github.com/blackbaud/skyux/issues/247)) ([0c8b3b2](https://github.com/blackbaud/skyux/commit/0c8b3b2425ad46046b767ed65645afb7b0b4e277))

### [5.9.6](https://github.com/blackbaud/skyux/compare/5.9.5...5.9.6) (2022-05-13)

### Bug Fixes

- **components/ag-grid:** data manager not persisting column order ([#244](https://github.com/blackbaud/skyux/issues/244)) ([251c65b](https://github.com/blackbaud/skyux/commit/251c65b8c9eb10644ba8d1fe528be48c772daab7))
- **components/modals:** resize observable media query service ([#252](https://github.com/blackbaud/skyux/issues/252)) ([7a22d4e](https://github.com/blackbaud/skyux/commit/7a22d4e4f74e9d3f5a943488092fd399b5588482))
- **components/tabs:** use padding instead of margin when styling sectioned form content sections ([#238](https://github.com/blackbaud/skyux/issues/238)) ([7c06f58](https://github.com/blackbaud/skyux/commit/7c06f584d7e34f848bee8211229cd5fd86797dd1))

## [6.0.0](https://github.com/blackbaud/skyux/compare/6.0.0-beta.11...6.0.0) (2022-05-09)

### [5.9.5](https://github.com/blackbaud/skyux/compare/5.9.4...5.9.5) (2022-05-09)

### Bug Fixes

- **components/lookup:** reset single select autocomplete when the input is blurred while under the minimum search text length ([#234](https://github.com/blackbaud/skyux/issues/234)) ([05907ec](https://github.com/blackbaud/skyux/commit/05907ec4d1a7c5f11abc01f62c3c955d7b8ca88f))

## [6.0.0-beta.11](https://github.com/blackbaud/skyux/compare/6.0.0-beta.10...6.0.0-beta.11) (2022-05-09)

### Features

- **components/packages:** add '.angular/cache' to .prettierignore ([#233](https://github.com/blackbaud/skyux/issues/233)) ([83481a2](https://github.com/blackbaud/skyux/commit/83481a2e742c49f6ab0c852b5fa2a9265135bdb2))

### Bug Fixes

- **components/core:** convert `SkyNumericOptions` from a class to an interface ([#232](https://github.com/blackbaud/skyux/issues/232)) ([8400516](https://github.com/blackbaud/skyux/commit/8400516628977f0ae573861a4d47ce0cf9048345))
- **components/lookup:** reset single select autocomplete when the input is blurred while under the minimum search text length ([#234](https://github.com/blackbaud/skyux/issues/234)) ([#236](https://github.com/blackbaud/skyux/issues/236)) ([270c118](https://github.com/blackbaud/skyux/commit/270c118c891111a53304f69da7e61bf4cd305730))

## [6.0.0-beta.10](https://github.com/blackbaud/skyux/compare/6.0.0-beta.9...6.0.0-beta.10) (2022-05-04)

### Features

- **components/packages:** add `update` schematic to ensure SKY UX stylesheets are configured for all projects ([#226](https://github.com/blackbaud/skyux/issues/226)) ([88c0316](https://github.com/blackbaud/skyux/commit/88c0316883141a163c4aa1af2198e9fdff636f64))

### Bug Fixes

- assume `SkyThemeService` is optional for `SkyFileAttachmentComponent`, `SkySelectionBoxGridComponent`, `SkyDescriptionListDescriptionComponent`, and `SkyModalScrollShadowDirective` ([#214](https://github.com/blackbaud/skyux/issues/214)) ([#216](https://github.com/blackbaud/skyux/issues/216)) ([b83e26f](https://github.com/blackbaud/skyux/commit/b83e26f55fe6cc8b671268a2c824068046108d35))

### Deprecations

- **components/core:** `NumericOptions` is deprecated; use `SkyNumericOptions` instead ([#217](https://github.com/blackbaud/skyux/issues/217)) ([cd3b8c0](https://github.com/blackbaud/skyux/commit/cd3b8c0f9b700cac276d496688bac3bc6f8b3500))
- **components/layout:** `SkyCardComponent` is deprecated; use a different container from the content container guidelines instead ([#221](https://github.com/blackbaud/skyux/issues/221)) ([b965e76](https://github.com/blackbaud/skyux/commit/b965e76009829b1ac5df6c34fe55d844fd83e068))
- **components/layout:** `SkyPageSummaryComponent` is deprecated; use a page template or different technique to summarize page content instead ([#222](https://github.com/blackbaud/skyux/issues/222)) ([0bac652](https://github.com/blackbaud/skyux/commit/0bac652a50528aae078bf96863742f046621d82e))

### [5.9.4](https://github.com/blackbaud/skyux/compare/5.9.3...5.9.4) (2022-05-03)

### Bug Fixes

- assume `SkyThemeService` is optional for `SkyFileAttachmentComponent`, `SkySelectionBoxGridComponent`, `SkyDescriptionListDescriptionComponent`, and `SkyModalScrollShadowDirective` ([#214](https://github.com/blackbaud/skyux/issues/214)) ([1ffe3d7](https://github.com/blackbaud/skyux/commit/1ffe3d7b2b6999eed547c3f0d5bc33760afccd5a))

## [6.0.0-beta.9](https://github.com/blackbaud/skyux/compare/6.0.0-beta.8...6.0.0-beta.9) (2022-05-02)

### Bug Fixes

- **components/core:** add null checks to core adapter focusing methods ([#209](https://github.com/blackbaud/skyux/issues/209)) ([#210](https://github.com/blackbaud/skyux/issues/210)) ([3175ce5](https://github.com/blackbaud/skyux/commit/3175ce5c86e61333788443b7455bbdea844b3d4c))

### [5.9.3](https://github.com/blackbaud/skyux/compare/5.9.2...5.9.3) (2022-05-02)

### Bug Fixes

- **components/core:** add null checks to core adapter focusing methods ([#209](https://github.com/blackbaud/skyux/issues/209)) ([d0846d4](https://github.com/blackbaud/skyux/commit/d0846d46d478cc2e23f26fa397f4808162807b79))

## [6.0.0-beta.8](https://github.com/blackbaud/skyux/compare/6.0.0-beta.7...6.0.0-beta.8) (2022-04-28)

### ⚠ BREAKING CHANGES

- **components/datetime:** Datepicker numeric input is now translated to a date in the current month if the
  input is within the current month's number of days. Numeric input outside of the current month's
  number of days is now treated as invalid and is not converted to a `Date` object.

### Features

- **components/datetime:** convert a user-entered digit into a date for the datepicker component ([#179](https://github.com/blackbaud/skyux/issues/179)) ([70705e1](https://github.com/blackbaud/skyux/commit/70705e123c2ead823e4e6d0f44928563a346b184))
- **components/pages:** add recently accessed service support ([#183](https://github.com/blackbaud/skyux/issues/183)) ([#188](https://github.com/blackbaud/skyux/issues/188)) ([948bb4e](https://github.com/blackbaud/skyux/commit/948bb4e03419ce514216e26ed5cbe53575e49e3b))

### Bug Fixes

- **components/a11y:** skip link button shows proper localized strings ([#197](https://github.com/blackbaud/skyux/issues/197)) ([003a4b3](https://github.com/blackbaud/skyux/commit/003a4b30ecf630868e986e043df4e6baee013c18))
- **components/ag-grid:** support virtual columns with data manager ([#191](https://github.com/blackbaud/skyux/issues/191)) ([#192](https://github.com/blackbaud/skyux/issues/192)) ([9b2c465](https://github.com/blackbaud/skyux/commit/9b2c465b972f90efe76c153e1ac12c838485d3d6))
- **components/core:** scrollable host only notifies of an undefined host if a different host was previously found ([#193](https://github.com/blackbaud/skyux/issues/193)) ([#199](https://github.com/blackbaud/skyux/issues/199)) ([bc38293](https://github.com/blackbaud/skyux/commit/bc38293ef9f9c9c4657ec7da186983486fe0b6e2))
- **components/datetime:** add `SkyDateRange`, `SkyDateRangeCalculatorGetValueFunction`, and `SkyDateRangeCalculatorValidateFunction` to exports API ([#186](https://github.com/blackbaud/skyux/issues/186)) ([3b3b655](https://github.com/blackbaud/skyux/commit/3b3b655959a2d2574033287997325dd9e0a73941))
- **components/flyout:** revert breaking change to `SkyFlyoutService` injectors ([#185](https://github.com/blackbaud/skyux/issues/185)) ([a8ad883](https://github.com/blackbaud/skyux/commit/a8ad883849303aa3a07dfb4349a8415948972a55))
- **components/popovers:** popovers placed above or below target should not be assigned a vertical alignment ([#177](https://github.com/blackbaud/skyux/issues/177)) ([#200](https://github.com/blackbaud/skyux/issues/200)) ([2d26e0a](https://github.com/blackbaud/skyux/commit/2d26e0a19e2255b165f029addb523083c14cfcf6))

### [5.9.2](https://github.com/blackbaud/skyux/compare/5.9.1...5.9.2) (2022-04-28)

### Bug Fixes

- **components/a11y:** skip link button shows proper localized strings ([#190](https://github.com/blackbaud/skyux/issues/190)) ([2067ca5](https://github.com/blackbaud/skyux/commit/2067ca5b8695c8f1d981696dcadafbaa029d69b5))
- **components/core:** scrollable host only notifies of an undefined host if a different host was previously found ([#193](https://github.com/blackbaud/skyux/issues/193)) ([e8fb0fd](https://github.com/blackbaud/skyux/commit/e8fb0fdaa279d4269c8a854bebbe9187b22e92dc))
- **components/popovers:** popovers placed above or below target should not be assigned a vertical alignment ([#177](https://github.com/blackbaud/skyux/issues/177)) ([5295b30](https://github.com/blackbaud/skyux/commit/5295b308454f8a6abbcd2a6c042881a42ab32da1))

### [5.9.1](https://github.com/blackbaud/skyux/compare/5.9.0...5.9.1) (2022-04-27)

### Bug Fixes

- **components/ag-grid:** support virtual columns with data manager ([#191](https://github.com/blackbaud/skyux/issues/191)) ([018fb63](https://github.com/blackbaud/skyux/commit/018fb63bfc4f5bc9117996937eae2306ffe834c4))
- **components/datetime:** add `SkyDateRange`, `SkyDateRangeCalculatorGetValueFunction`, and `SkyDateRangeCalculatorValidateFunction` to exports API ([#187](https://github.com/blackbaud/skyux/issues/187)) ([8ffcb56](https://github.com/blackbaud/skyux/commit/8ffcb568fd79706ef8541cad3a67a09584c503af))

## [5.9.0](https://github.com/blackbaud/skyux/compare/5.8.4...5.9.0) (2022-04-26)

### Features

- **components/pages:** add recently accessed service support ([#183](https://github.com/blackbaud/skyux/issues/183)) ([ab97542](https://github.com/blackbaud/skyux/commit/ab97542edc3cfb3f7e816504f0cc95ca59d4ad75))

## [6.0.0-beta.7](https://github.com/blackbaud/skyux/compare/6.0.0-beta.6...6.0.0-beta.7) (2022-04-22)

### Bug Fixes

- **components/ag-grid:** respect value of deprecated `frameworkComponents` ([#181](https://github.com/blackbaud/skyux/issues/181)) ([b741f2f](https://github.com/blackbaud/skyux/commit/b741f2ff68918b657e7ba9750ffcff39e11c8e86))

### Deprecations

- **components/grids:** `SkyGridComponent` is deprecated; use data grid instead ([#175](https://github.com/blackbaud/skyux/issues/175)) ([390e40e](https://github.com/blackbaud/skyux/commit/390e40ed4f9589bc8093350092bc8b54f85216ab))
- **components/select-field:** `SkySelectFieldComponent` is deprecated; use `SkyLookupComponent` instead ([#176](https://github.com/blackbaud/skyux/issues/176)) ([11976dc](https://github.com/blackbaud/skyux/commit/11976dc744d546eb67a5ada208252e72a72da1f3))
- list builder is deprecated; use data manager and an appropriate view instead ([#178](https://github.com/blackbaud/skyux/issues/178)) ([d19b63b](https://github.com/blackbaud/skyux/commit/d19b63b99cad4f2ab2d4d5f43cc7417618e99faf))

## [6.0.0-beta.6](https://github.com/blackbaud/skyux/compare/6.0.0-beta.5...6.0.0-beta.6) (2022-04-20)

### Deprecations

- **components/layout:** `SkyDefinitionListComponent` is deprecated; use `SkyDescriptionListComponent` instead ([#174](https://github.com/blackbaud/skyux/issues/174)) ([d105ded](https://github.com/blackbaud/skyux/commit/d105ded299bbc91ee8f00c94da7098e3d07515c9))

## [6.0.0-beta.5](https://github.com/blackbaud/skyux/compare/6.0.0-beta.4...6.0.0-beta.5) (2022-04-19)

### Features

- **components/ag-grid:** add support for `ag-grid-community@^27.2.0` ([#171](https://github.com/blackbaud/skyux/issues/171)) ([5b87ccf](https://github.com/blackbaud/skyux/commit/5b87ccf89459e313f513a31c502a36530d896c3f))

### Bug Fixes

- **apps/code-examples:** fix type errors for ag-grid basic code example ([#169](https://github.com/blackbaud/skyux/issues/169)) ([225b5ad](https://github.com/blackbaud/skyux/commit/225b5ade4400edd958bdb260ec645b1f775d4300))

## [6.0.0-beta.4](https://github.com/blackbaud/skyux/compare/6.0.0-beta.3...6.0.0-beta.4) (2022-04-18)

### ⚠ BREAKING CHANGES

- **components/ag-grid:** Drop support for `ag-grid-community@26.0.0`

### Features

- **components/ag-grid:** add support for `ag-grid-community@27.1.0` ([#148](https://github.com/blackbaud/skyux/issues/148)) ([597e9b0](https://github.com/blackbaud/skyux/commit/597e9b04a37c8f451f3d02e3eedaa0b9346baff0))
- **components/indicators:** replace `string` alert types with dedicated `SkyAlertType` type ([#164](https://github.com/blackbaud/skyux/issues/164)) ([abda1f3](https://github.com/blackbaud/skyux/commit/abda1f36d7a18f8b6feecbac181504e0f6a6f0f4))
- update `ng2-dragula` to `2.1.1` ([#155](https://github.com/blackbaud/skyux/issues/155)) ([47c6d54](https://github.com/blackbaud/skyux/commit/47c6d546a6199daa3c44b73b471cc4709d72aaf1))

### Bug Fixes

- **components/angular-tree-component:** update @circlon/angular-tree-component to 11.0.3 ([#150](https://github.com/blackbaud/skyux/issues/150)) ([#152](https://github.com/blackbaud/skyux/issues/152)) ([5ff7e58](https://github.com/blackbaud/skyux/commit/5ff7e582763a931ee58dc465b6d1304b83023dd2))

### [5.8.4](https://github.com/blackbaud/skyux/compare/5.8.3...5.8.4) (2022-04-18)

### Bug Fixes

- **components/angular-tree-component:** update `@circlon/angular-tree-component` to `11.0.3` ([#150](https://github.com/blackbaud/skyux/issues/150)) ([296c200](https://github.com/blackbaud/skyux/commit/296c20009b6c887735e270ef12b695c6eef64cc6))

## [6.0.0-beta.3](https://github.com/blackbaud/skyux/compare/6.0.0-beta.2...6.0.0-beta.3) (2022-04-12)

### ⚠ BREAKING CHANGES

- **components/data-manager:** The properties `additionalOptions`, `onClearAllClick`, and `onSelectAllClick` of
  `SkyDataViewConfig` are assigned more specific types.

### Features

- **components/ag-grid:** add text cell maxlength and number cell min/max options ([#113](https://github.com/blackbaud/skyux/issues/113)) ([#115](https://github.com/blackbaud/skyux/issues/115)) ([66e6e81](https://github.com/blackbaud/skyux/commit/66e6e81491180aeab03cda6c91ab09a643683db1))
- **components/core:** create a resize observer service as a media query service for modals ([#70](https://github.com/blackbaud/skyux/issues/70)) ([#116](https://github.com/blackbaud/skyux/issues/116)) ([fb86ca6](https://github.com/blackbaud/skyux/commit/fb86ca6a9a906b0c30a8d5e081057dfd77e1e440))
- update country field and phone field dependencies ([#111](https://github.com/blackbaud/skyux/issues/111)) ([#112](https://github.com/blackbaud/skyux/issues/112)) ([cfb7f90](https://github.com/blackbaud/skyux/commit/cfb7f90463bfe8913159208fc9722fb0ae926b00))

### Bug Fixes

- **components/ag-grid:** ag-grid: display validator popover using a delayed hover event ([#87](https://github.com/blackbaud/skyux/issues/87)) ([#110](https://github.com/blackbaud/skyux/issues/110)) ([5d402e7](https://github.com/blackbaud/skyux/commit/5d402e7d800a9685f5a24e70d01dc0bd09edbbb2))
- **components/ag-grid:** amend public exports API and JSDocs ([#132](https://github.com/blackbaud/skyux/issues/132)) ([#135](https://github.com/blackbaud/skyux/issues/135)) ([e2321f9](https://github.com/blackbaud/skyux/commit/e2321f94d74d20feb14897afc99f76d979db61a2))
- **components/ag-grid:** set lookup cell editor width to match column ([#126](https://github.com/blackbaud/skyux/issues/126)) ([#127](https://github.com/blackbaud/skyux/issues/127)) ([f50f9e9](https://github.com/blackbaud/skyux/commit/f50f9e97e2daa0ca02911a32ffc699d4149be772))
- **components/core:** fix inheritance issue with resize observer media query service ([#122](https://github.com/blackbaud/skyux/issues/122)) ([#124](https://github.com/blackbaud/skyux/issues/124)) ([1965495](https://github.com/blackbaud/skyux/commit/196549547e962f8ef8771ed957958ac991865e1c))
- **components/data-manager:** assign specific types to properties of `SkyDataViewConfig` ([#89](https://github.com/blackbaud/skyux/issues/89)) ([25c89f4](https://github.com/blackbaud/skyux/commit/25c89f41ea675dc65a2652e15721fee98b10edff))
- **components/lists:** add ARIA label to pagination link button ([#99](https://github.com/blackbaud/skyux/issues/99)) ([0239b1b](https://github.com/blackbaud/skyux/commit/0239b1b6a731de8c99cb8823cb8d1fa6ea885604))
- **components/popovers:** respect alignment and placement values supplied to the popover component ([#139](https://github.com/blackbaud/skyux/issues/139)) ([#141](https://github.com/blackbaud/skyux/issues/141)) ([dd1976d](https://github.com/blackbaud/skyux/commit/dd1976d3c22213a778bda42c8a63b6378fce1bca))
- **components/theme:** add package exports for sky.css ([#146](https://github.com/blackbaud/skyux/issues/146)) ([28f5df4](https://github.com/blackbaud/skyux/commit/28f5df495ae6b4a79b9fbde230f197c74b104c61))

### [5.8.3](https://github.com/blackbaud/skyux/compare/5.8.2...5.8.3) (2022-04-11)

### Bug Fixes

- **components/popovers:** respect alignment and placement values supplied to the popover component ([#139](https://github.com/blackbaud/skyux/issues/139)) ([03dc247](https://github.com/blackbaud/skyux/commit/03dc24722effde36597f9f5b8a557c4a85174775))

### [5.8.2](https://github.com/blackbaud/skyux/compare/5.8.1...5.8.2) (2022-04-08)

### Bug Fixes

- **components/ag-grid:** amend public exports API and JSDocs ([#132](https://github.com/blackbaud/skyux/issues/132)) ([f78d29a](https://github.com/blackbaud/skyux/commit/f78d29a1b6c3452fc20e2cbca6661b19c1c22096))
- **components/ag-grid:** set lookup cell editor width to match column ([#126](https://github.com/blackbaud/skyux/issues/126)) ([f51485a](https://github.com/blackbaud/skyux/commit/f51485acf73e510fb4267f843ec7b4a1526c59af))

### [5.8.1](https://github.com/blackbaud/skyux/compare/5.8.0...5.8.1) (2022-04-07)

### Bug Fixes

- **components/core:** fix inheritance issue with resize observer media query service ([#122](https://github.com/blackbaud/skyux/issues/122)) ([4bbf0c6](https://github.com/blackbaud/skyux/commit/4bbf0c61339f7ac50c74941554a7c6fc732ea979))

## [5.8.0](https://github.com/blackbaud/skyux/compare/5.7.2...5.8.0) (2022-04-07)

### Features

- **components/ag-grid:** add text cell maxlength and number cell min/max options ([#113](https://github.com/blackbaud/skyux/issues/113)) ([f20702d](https://github.com/blackbaud/skyux/commit/f20702dfa824c6cb7363383bda828b809d85d87e))
- **components/core:** create a resize observer service as a media query service for modals ([#70](https://github.com/blackbaud/skyux/issues/70)) ([08a5313](https://github.com/blackbaud/skyux/commit/08a5313d4b0bdeeb1a1502c12fc46e92868e2432))
- update country field and phone field dependencies ([#111](https://github.com/blackbaud/skyux/issues/111)) ([24fe035](https://github.com/blackbaud/skyux/commit/24fe035091a72d8a2f3656cd26a8ce2e8600fe66))

### Bug Fixes

- **components/ag-grid:** ag-grid: display validator popover using a delayed hover event ([#87](https://github.com/blackbaud/skyux/issues/87)) ([38ebddb](https://github.com/blackbaud/skyux/commit/38ebddb8dad56322757e3f222e17c0abcdb320b0))
- **components/lists:** add ARIA label to pagination link button ([#99](https://github.com/blackbaud/skyux/issues/99)) ([#114](https://github.com/blackbaud/skyux/issues/114)) ([c222aa0](https://github.com/blackbaud/skyux/commit/c222aa0c675148ea12bcfb704a202aea27b3f431))

## [6.0.0-beta.2](https://github.com/blackbaud/skyux/compare/6.0.0-beta.1...6.0.0-beta.2) (2022-04-01)

### Bug Fixes

- **components/lookup:** fix loop caused by highlighting empty search string ([#91](https://github.com/blackbaud/skyux/issues/91)) ([#101](https://github.com/blackbaud/skyux/issues/101)) ([ec20a27](https://github.com/blackbaud/skyux/commit/ec20a2790afcf56cb5a904cfe5795b6a44ba5e1b))
- **components/tabs:** fix disappearing URL params ([#77](https://github.com/blackbaud/skyux/issues/77)) ([#95](https://github.com/blackbaud/skyux/issues/95)) ([0fb92ab](https://github.com/blackbaud/skyux/commit/0fb92ab7340618c78f6f65a1218a74d911e8ef31))
- **migrations:** install `@angular/cdk` if relevant packages installed ([#96](https://github.com/blackbaud/skyux/issues/96)) ([69a2390](https://github.com/blackbaud/skyux/commit/69a2390175fa044a6379157a01c81d2ad66c81c0))
- **migrations:** remove extensions from tilde imports ([#102](https://github.com/blackbaud/skyux/issues/102)) ([c8793cf](https://github.com/blackbaud/skyux/commit/c8793cf6a207347a278db65588db10237567b854))

### [5.7.2](https://github.com/blackbaud/skyux/compare/5.7.1...5.7.2) (2022-04-01)

### Bug Fixes

- **components/lookup:** fix loop caused by highlighting empty search string ([#91](https://github.com/blackbaud/skyux/issues/91)) ([675c0d8](https://github.com/blackbaud/skyux/commit/675c0d8bc00c72570a5a17542628f971936aa05c))
- **components/tabs:** fix disappearing URL params ([#77](https://github.com/blackbaud/skyux/issues/77)) ([bd52111](https://github.com/blackbaud/skyux/commit/bd52111f37b00d6cf09dcf12247f0499b674c8cb))
- vulnerabilities remediation ([#93](https://github.com/blackbaud/skyux/issues/93)) ([036ec99](https://github.com/blackbaud/skyux/commit/036ec99632edb14f44445e83b2ab4cde59f70219))

## [6.0.0-beta.1](https://github.com/blackbaud/skyux/compare/6.0.0-beta.0...6.0.0-beta.1) (2022-03-30)

### Features

- **migrations:** add migrate schematic to fix SCSS tilde imports ([#94](https://github.com/blackbaud/skyux/issues/94)) ([1a579b9](https://github.com/blackbaud/skyux/commit/1a579b9eeccefbaa2bad2eda5213f1e805d044f7))

### Bug Fixes

- **components/theme:** add SCSS variables and mixins to package exports ([#92](https://github.com/blackbaud/skyux/issues/92)) ([ccf6ed7](https://github.com/blackbaud/skyux/commit/ccf6ed76f847de7c3ee299fd0c7f43b729352b2c))

## [6.0.0-beta.0](https://github.com/blackbaud/skyux/compare/5.7.1...6.0.0-beta.0) (2022-03-28)

### ⚠ BREAKING CHANGES

- **migrations:** Drop support for Angular 12

### Features

- **migrations:** add support for Angular v13 ([#85](https://github.com/blackbaud/skyux/issues/85)) ([291a024](https://github.com/blackbaud/skyux/commit/291a024398b0b291329b4be47488788b73c18273))

### [5.7.1](https://github.com/blackbaud/skyux/compare/5.7.0...5.7.1) (2022-03-28)

### Bug Fixes

- **components/action-bars:** summary action bar summaries can be added and removed dynamically ([#79](https://github.com/blackbaud/skyux/issues/79)) ([c6f4348](https://github.com/blackbaud/skyux/commit/c6f434855c758156ed5df7bbfd2c3b67f5e3ba7c))
- **components/forms:** browser autofill stylings on input box text areas cover the whole input box ([#80](https://github.com/blackbaud/skyux/issues/80)) ([0ef0eb7](https://github.com/blackbaud/skyux/commit/0ef0eb7d932ee2468487f2e3ae427417512cefb1))

## [5.7.0](https://github.com/blackbaud/skyux/compare/5.6.2...5.7.0) (2022-03-23)

### Features

- **components/layout:** implement scrollable host service in Back To Top component ([#65](https://github.com/blackbaud/skyux/issues/65)) ([49bc5f7](https://github.com/blackbaud/skyux/commit/49bc5f7a26800780c12b5044ac9f44b938f2384c))

### Bug Fixes

- **components/flyout:** navigating when a flyout is open does not throw an error ([#75](https://github.com/blackbaud/skyux/issues/75)) ([b18948b](https://github.com/blackbaud/skyux/commit/b18948b77d7f2da3a4a72cb88b2686dd24c95088))
- **components/lookup:** fix `toString` call on undefined value ([#69](https://github.com/blackbaud/skyux/issues/69)) ([f28b4a6](https://github.com/blackbaud/skyux/commit/f28b4a6e3700873e428173639b6785a3322d30cc))
- **components/router:** fix skyhref resolution with onpush change detection ([#71](https://github.com/blackbaud/skyux/issues/71)) ([4246387](https://github.com/blackbaud/skyux/commit/4246387666d50242baa8ed3ca5c675a1165181f4))

### [5.6.2](https://github.com/blackbaud/skyux/compare/5.6.1...5.6.2) (2022-03-11)

### Bug Fixes

- **components/datetime:** emit value change event only once when setting the control value of a datepicker ([#49](https://github.com/blackbaud/skyux/issues/49)) ([06c15fa](https://github.com/blackbaud/skyux/commit/06c15fad01b9803a55080ba0cfef50ddf5dce5d4))
- **components/lookup:** open lookup show more modal correctly when no value is given while in single select mode ([#53](https://github.com/blackbaud/skyux/issues/53)) ([e296d9f](https://github.com/blackbaud/skyux/commit/e296d9fa01beb2bc770ae69a4a0a6b95401e4389))

### [5.6.1](https://github.com/blackbaud/skyux/compare/5.6.0...5.6.1) (2022-03-04)

### Bug Fixes

- **text-editor:** updated `dompurify` dependency to version `2.3.6` ([#37](https://github.com/blackbaud/skyux/issues/37)) ([9bb7915](https://github.com/blackbaud/skyux/commit/9bb791583dcdfae011823d4b9021c4040514fb8b))

## 5.6.0 (2022-03-02)

### Features

- **ci:** Updated release process to follow `standard-version` changelog conventions.

### Bug Fixes

- **grids:** Fix grid component to properly update columns when they are changed via the `columns` input ([#6](https://github.com/blackbaud/skyux/issues/6)) ([b3bf822](https://github.com/blackbaud/skyux/commit/b3bf822653671050e2cbc711fb2c2245df311957))
- **grids:** Fix the grid component to not improperly add the aria-selected property to grid rows ([#3](https://github.com/blackbaud/skyux/issues/3)) ([117da75](https://github.com/blackbaud/skyux/commit/117da755814d88fc6d7906b390699ddafe641c79))
- **ng-add:** only add config if none exist ([#4](https://github.com/blackbaud/skyux/issues/4)) ([a859f9b](https://github.com/blackbaud/skyux/commit/a859f9b40134a21d09a1fdad77bbe1c9e7ce285a))
- **prettier-schematics:** Fix dist bundle to include the collection.json file ([#11](https://github.com/blackbaud/skyux/issues/11)) ([fda225d](https://github.com/blackbaud/skyux/commit/fda225dc4324d5eec6fd1aeb0881ab464c33ceee))

## 5.5.0 (2022-02-25)

- First stable release for monorepo.

## 5.5.0-beta.0 (2022-02-25)

- First beta release for monorepo.
