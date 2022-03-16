export * from './lib/modules/restricted-view/restricted-view-auth.service';
export * from './lib/modules/restricted-view/restricted-view.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyRestrictedContentAlertComponent as λ1 } from './lib/modules/restricted-view/restricted-content-alert.component';
export { SkyRestrictedViewComponent as λ2 } from './lib/modules/restricted-view/restricted-view.component';
export { SkyRestrictedViewDirective as λ3 } from './lib/modules/restricted-view/restricted-view.directive';
