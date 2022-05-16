# Changelog

### [5.9.6](https://github.com/blackbaud/skyux/compare/5.9.5...5.9.6) (2022-05-13)

### Bug Fixes

- **components/ag-grid:** data manager not persisting column order ([#244](https://github.com/blackbaud/skyux/issues/244)) ([251c65b](https://github.com/blackbaud/skyux/commit/251c65b8c9eb10644ba8d1fe528be48c772daab7))
- **components/modals:** resize observable media query service ([#252](https://github.com/blackbaud/skyux/issues/252)) ([7a22d4e](https://github.com/blackbaud/skyux/commit/7a22d4e4f74e9d3f5a943488092fd399b5588482))
- **components/tabs:** use padding instead of margin when styling sectioned form content sections ([#238](https://github.com/blackbaud/skyux/issues/238)) ([7c06f58](https://github.com/blackbaud/skyux/commit/7c06f584d7e34f848bee8211229cd5fd86797dd1))

### [5.9.5](https://github.com/blackbaud/skyux/compare/5.9.4...5.9.5) (2022-05-09)

### Bug Fixes

- **components/lookup:** reset single select autocomplete when the input is blurred while under the minimum search text length ([#234](https://github.com/blackbaud/skyux/issues/234)) ([05907ec](https://github.com/blackbaud/skyux/commit/05907ec4d1a7c5f11abc01f62c3c955d7b8ca88f))

### [5.9.4](https://github.com/blackbaud/skyux/compare/5.9.3...5.9.4) (2022-05-03)

### Bug Fixes

- assume `SkyThemeService` is optional for `SkyFileAttachmentComponent`, `SkySelectionBoxGridComponent`, `SkyDescriptionListDescriptionComponent`, and `SkyModalScrollShadowDirective` ([#214](https://github.com/blackbaud/skyux/issues/214)) ([1ffe3d7](https://github.com/blackbaud/skyux/commit/1ffe3d7b2b6999eed547c3f0d5bc33760afccd5a))

### [5.9.3](https://github.com/blackbaud/skyux/compare/5.9.2...5.9.3) (2022-05-02)

### Bug Fixes

- **components/core:** add null checks to core adapter focusing methods ([#209](https://github.com/blackbaud/skyux/issues/209)) ([d0846d4](https://github.com/blackbaud/skyux/commit/d0846d46d478cc2e23f26fa397f4808162807b79))

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

### [5.8.4](https://github.com/blackbaud/skyux/compare/5.8.3...5.8.4) (2022-04-18)

### Bug Fixes

- **components/angular-tree-component:** update `@circlon/angular-tree-component` to `11.0.3` ([#150](https://github.com/blackbaud/skyux/issues/150)) ([296c200](https://github.com/blackbaud/skyux/commit/296c20009b6c887735e270ef12b695c6eef64cc6))

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

### [5.7.2](https://github.com/blackbaud/skyux/compare/5.7.1...5.7.2) (2022-04-01)

### Bug Fixes

- **components/lookup:** fix loop caused by highlighting empty search string ([#91](https://github.com/blackbaud/skyux/issues/91)) ([675c0d8](https://github.com/blackbaud/skyux/commit/675c0d8bc00c72570a5a17542628f971936aa05c))
- **components/tabs:** fix disappearing URL params ([#77](https://github.com/blackbaud/skyux/issues/77)) ([bd52111](https://github.com/blackbaud/skyux/commit/bd52111f37b00d6cf09dcf12247f0499b674c8cb))
- vulnerabilities remediation ([#93](https://github.com/blackbaud/skyux/issues/93)) ([036ec99](https://github.com/blackbaud/skyux/commit/036ec99632edb14f44445e83b2ab4cde59f70219))

### [5.7.1](https://github.com/blackbaud/skyux/compare/5.7.0...5.7.1) (2022-03-28)

### Bug Fixes

- **components/action-bars:** summary action bar summaries can be added and removed dynamically ([#79](https://github.com/blackbaud/skyux/issues/79)) ([c6f4348](https://github.com/blackbaud/skyux/commit/c6f434855c758156ed5df7bbfd2c3b67f5e3ba7c))
- **components/forms:** browser autofill stylings on input box text areas cover the whole input box ([#80](https://github.com/blackbaud/skyux/issues/80)) ([0ef0eb7](https://github.com/blackbaud/skyux/commit/0ef0eb7d932ee2468487f2e3ae427417512cefb1))

## [5.7.0](https://github.com/blackbaud/skyux/compare/5.6.2...5.7.0) (2022-03-23)

### Features

- **components/layout:** implement scrollable host service in Back To Top component ([#65](https://github.com/blackbaud/skyux/issues/65)) ([49bc5f7](https://github.com/blackbaud/skyux/commit/49bc5f7a26800780c12b5044ac9f44b938f2384c))

### Bug Fixes

- **components/flyout:** navigating when a flyout is open does not throw an error ([#75](https://github.com/blackbaud/skyux/issues/75)) ([b18948b](https://github.com/blackbaud/skyux/commit/b18948b77d7f2da3a4a72cb88b2686dd24c95088))
- **components/lookup:** fix tostring call on undefined value ([#69](https://github.com/blackbaud/skyux/issues/69)) ([f28b4a6](https://github.com/blackbaud/skyux/commit/f28b4a6e3700873e428173639b6785a3322d30cc))
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
