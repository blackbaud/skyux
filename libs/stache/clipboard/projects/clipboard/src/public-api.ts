export * from './modules/clipboard/clipboard.module';
export * from './modules/clipboard/clipboard.service';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyCopyToClipboardComponent as λ1 } from './modules/clipboard/clipboard.component';
