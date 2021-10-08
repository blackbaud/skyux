export * from './modules/code-block/code-block.module';

export * from './modules/code/code.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyCodeComponent as λ1 } from './modules/code/code.component';
export { SkyCodeBlockComponent as λ2 } from './modules/code-block/code-block.component';
