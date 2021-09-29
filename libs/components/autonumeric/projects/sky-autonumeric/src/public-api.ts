export * from './modules/autonumeric/autonumeric-options-provider';
export * from './modules/autonumeric/autonumeric-options';
export * from './modules/autonumeric/autonumeric.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyAutonumericDirective as λ1 } from './modules/autonumeric//autonumeric.directive';
