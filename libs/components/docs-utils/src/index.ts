export {
  SKY_CODE_SNIPPET_LANGUAGES,
  SkyCodeSnippetLanguage,
} from './lib/modules/code-snippet/code-snippet-language';
export { SkyCodeSnippetModule } from './lib/modules/code-snippet/code-snippet.module';
export { SkyExampleViewerModule } from './lib/modules/example-viewer/example-viewer.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyCodeSnippetComponent as λ1 } from './lib/modules/code-snippet/code-snippet.component';
export { SkyExampleViewerComponent as λ2 } from './lib/modules/example-viewer/example-viewer.component';
