export * from './lib/modules/error/error-modal-config';
export * from './lib/modules/error/error-modal.service';
export * from './lib/modules/error/error.module';
export * from './lib/modules/error/error-type';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyErrorActionComponent as λ1 } from './lib/modules/error/error-action.component';
export { SkyErrorDescriptionComponent as λ2 } from './lib/modules/error/error-description.component';
export { SkyErrorImageComponent as λ3 } from './lib/modules/error/error-image.component';
export { SkyErrorTitleComponent as λ4 } from './lib/modules/error/error-title.component';
export { SkyErrorComponent as λ5 } from './lib/modules/error/error.component';
