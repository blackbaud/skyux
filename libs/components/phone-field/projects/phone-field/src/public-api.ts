export * from './modules/phone-field/phone-field.module';
export * from './modules/phone-field/types/country';
export * from './modules/phone-field/types/number-return-format';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyPhoneFieldComponent as λ1 } from './modules/phone-field/phone-field.component';
export { SkyPhoneFieldInputDirective as λ2 } from './modules/phone-field/phone-field-input.directive';
