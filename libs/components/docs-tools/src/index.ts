export { SkyClipboardModule } from './lib/modules/clipboard/clipboard.module';
export { SkyClipboardService } from './lib/modules/clipboard/clipboard.service';
export { SkyCodeExampleViewerModule } from './lib/modules/code-example-viewer/code-example-viewer.module';
export { SkyStackBlitzLaunchConfig } from './lib/modules/code-example-viewer/stackblitz-launch-config';
export {
  SKY_CODE_SNIPPET_LANGUAGES,
  SkyCodeSnippetLanguage,
} from './lib/modules/code-snippet/code-snippet-language';
export { SkyCodeSnippetModule } from './lib/modules/code-snippet/code-snippet.module';
export { SkyPillColor } from './lib/modules/pill/pill-color';
export { SkyPillModule } from './lib/modules/pill/pill.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyClipboardButtonDirective as λ3 } from './lib/modules/clipboard/clipboard-button.directive';
export { SkyCodeExampleViewerComponent as λ2 } from './lib/modules/code-example-viewer/code-example-viewer.component';
export { SkyCodeSnippetComponent as λ1 } from './lib/modules/code-snippet/code-snippet.component';
export { SkyPillComponent as λ4 } from './lib/modules/pill/pill.component';
