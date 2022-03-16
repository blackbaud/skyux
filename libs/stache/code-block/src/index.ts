export * from './lib/modules/code-block/code-block.module';

export * from './lib/modules/code/code.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyCodeComponent as λ1 } from './lib/modules/code/code.component';
export { SkyCodeBlockComponent as λ2 } from './lib/modules/code-block/code-block.component';
