export { SkySectionedFormModule } from './lib/modules/sectioned-form/sectioned-form.module';
export { SkySectionedFormService } from './lib/modules/sectioned-form/sectioned-form.service';

export type { SkyTabIndex } from './lib/modules/tabs/tab-index';
export type { SkyTabLayoutType } from './lib/modules/tabs/tab-layout-type';
export { SkyTabsModule } from './lib/modules/tabs/tabs.module';
export type { SkyTabsetButtonsDisplayMode } from './lib/modules/tabs/tabset-buttons-display-mode';
export type { SkyTabsetNavButtonType } from './lib/modules/tabs/tabset-nav-button-type';
export type { SkyTabsetStyle } from './lib/modules/tabs/tabset-style';
export type { SkyTabsetTabIndexesChange } from './lib/modules/tabs/tabset-tab-indexes-change';

export { SkyVerticalTabsetModule } from './lib/modules/vertical-tabset/vertical-tabset.module';

// The following export is needed because our docs use it as a prescribed pattern.
// Ideally, this functionality would live in a standard `Input` or `Output`.
// https://developer.blackbaud.com/skyux/components/sectioned-form#code
// TODO: Try to remove in a major release.
export { SkySectionedFormComponent } from './lib/modules/sectioned-form/sectioned-form.component';

export type { SkySectionedFormMessage } from './lib/modules/sectioned-form/types/sectioned-form-message';
export { SkySectionedFormMessageType } from './lib/modules/sectioned-form/types/sectioned-form-message-type';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of public API.
export { SkySectionedFormSectionComponent as λ5 } from './lib/modules/sectioned-form/sectioned-form-section.component';
export { SkyTabComponent as λ1 } from './lib/modules/tabs/tab.component';
export { SkyTabsetNavButtonComponent as λ3 } from './lib/modules/tabs/tabset-nav-button.component';
export { SkyTabsetComponent as λ2 } from './lib/modules/tabs/tabset.component';
export { SkyVerticalTabComponent as λ4 } from './lib/modules/vertical-tabset/vertical-tab.component';
export { SkyVerticalTabsetGroupComponent as λ7 } from './lib/modules/vertical-tabset/vertical-tabset-group.component';
export { SkyVerticalTabsetComponent as λ6 } from './lib/modules/vertical-tabset/vertical-tabset.component';
