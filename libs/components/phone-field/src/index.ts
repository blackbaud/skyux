export { SkyPhoneFieldModule } from './lib/modules/phone-field/phone-field.module';
export type { SkyPhoneFieldCountry } from './lib/modules/phone-field/types/country';
export type { SkyPhoneFieldNumberReturnFormat } from './lib/modules/phone-field/types/number-return-format';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyPhoneFieldInputDirective as λ2 } from './lib/modules/phone-field/phone-field-input.directive';
export { SkyPhoneFieldComponent as λ1 } from './lib/modules/phone-field/phone-field.component';
