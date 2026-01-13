export { SkyEmailValidationModule } from './lib/modules/email-validation/email-validation.module';
export type { SkyUrlValidationOptions } from './lib/modules/url-validation/url-validation-options';
export { SkyUrlValidationModule } from './lib/modules/url-validation/url-validation.module';
export { SkyValidation } from './lib/modules/validation/validation';
export { SkyValidators } from './lib/modules/validators/validators';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyEmailValidationDirective as λ1 } from './lib/modules/email-validation/email-validation.directive';
export { SkyUrlValidationDirective as λ2 } from './lib/modules/url-validation/url-validation.directive';
