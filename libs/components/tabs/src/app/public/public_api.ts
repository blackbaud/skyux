export * from './modules/sectioned-form/sectioned-form.module';

export * from './modules/tabs/tabs.module';

export * from './modules/vertical-tabset/vertical-tabset.module';

// The following export is needed because our docs use it as a prescribed pattern.
// Ideally, this functionality would live in a standard `Input` or `Output`.
// https://developer.blackbaud.com/skyux/components/sectioned-form#code
// TODO: Try to remove in a major release.
export * from './modules/sectioned-form/sectioned-form.component';
