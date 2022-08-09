# Changelog

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

- **components/forms:** form controls on radio groups now properly disable radio buttons on initialization and do not mark the form as dirty on programatic changes ([#356](https://github.com/blackbaud/skyux/issues/356)) ([34eeb4b](https://github.com/blackbaud/skyux/commit/34eeb4b25c2ffd3b17065db04658f609f51bbcac))
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
