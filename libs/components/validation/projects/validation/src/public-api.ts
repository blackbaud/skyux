export * from './modules/email-validation/email-validation.module';
export * from './modules/url-validation/url-validation.module';
export * from './modules/validation/validation';
export * from './modules/validators/validators';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyEmailValidationDirective as λ1 } from './modules/email-validation/email-validation.directive';
export { SkyUrlValidationDirective as λ2 } from './modules/url-validation/url-validation.directive';
