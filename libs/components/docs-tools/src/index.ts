export type { SkyDocsCategoryColor } from './lib/modules/category-tag/category-color';
export { SkyDocsCategoryTagModule } from './lib/modules/category-tag/category-tag.module';
export { SkyDocsClipboardModule } from './lib/modules/clipboard/clipboard.module';
export { SkyDocsClipboardService } from './lib/modules/clipboard/clipboard.service';
export { SkyDocsCodeExampleViewerModule } from './lib/modules/code-example-viewer/code-example-viewer.module';
export type { SkyDocsStackBlitzLaunchConfig } from './lib/modules/code-example-viewer/stackblitz-launch-config';
export type { SkyDocsCodeHighlightLanguage } from './lib/modules/code-highlight/code-highlight-language';
export { SKY_DOCS_CODE_HIGHLIGHT_LANGUAGES } from './lib/modules/code-highlight/code-highlight-language';
export { SkyDocsCodeHighlightPipe } from './lib/modules/code-highlight/code-highlight.pipe';
export { SkyDocsCodeHighlightService } from './lib/modules/code-highlight/code-highlight.service';
export { SkyDocsCodeSnippetModule } from './lib/modules/code-snippet/code-snippet.module';
export type { SkyDocsHeadingAnchorHeadingLevel } from './lib/modules/heading-anchor/heading-anchor-heading-level';
export type { SkyDocsHeadingAnchorHeadingTextFormat } from './lib/modules/heading-anchor/heading-anchor-heading-text-format';
export { SkyDocsHeadingAnchorModule } from './lib/modules/heading-anchor/heading-anchor.module';
export { SkyDocsHeadingAnchorService } from './lib/modules/heading-anchor/heading-anchor.service';
export type { SkyDocsCodeExampleComponentTypes } from './lib/modules/showcase/code-example-types/code-example-types-token';
export { provideSkyDocsCodeExampleTypes } from './lib/modules/showcase/code-example-types/provide-code-example-types';
export { SkyDocsShowcaseModule } from './lib/modules/showcase/showcase.module';
export { SkyDocsTableOfContentsModule } from './lib/modules/table-of-contents/table-of-contents.module';
export { SkyDocsTypeDefinitionAnchorIdsService } from './lib/modules/type-definition/type-anchor-ids.service';
export { SkyDocsTypeDefinitionModule } from './lib/modules/type-definition/type-definition.module';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyDocsCategoryTagComponent as λ4 } from './lib/modules/category-tag/category-tag.component';
export { SkyDocsClipboardButtonDirective as λ3 } from './lib/modules/clipboard/clipboard-button.directive';
export { SkyDocsCodeExampleViewerComponent as λ2 } from './lib/modules/code-example-viewer/code-example-viewer.component';
export { SkyDocsCodeSnippetWrapperComponent as λ7 } from './lib/modules/code-snippet/code-snippet-wrapper.component';
export { SkyDocsCodeSnippetComponent as λ1 } from './lib/modules/code-snippet/code-snippet.component';
export { SkyDocsHeadingAnchorComponent as λ5 } from './lib/modules/heading-anchor/heading-anchor.component';
export { SkyDocsShowcaseAreaDevelopmentComponent as λ9 } from './lib/modules/showcase/showcase-area-development.component';
export { SkyDocsShowcaseAreaHighlightComponent as λ13 } from './lib/modules/showcase/showcase-area-highlight.component';
export { SkyDocsShowcaseAreaOverviewComponent as λ10 } from './lib/modules/showcase/showcase-area-overview.component';
export { SkyDocsShowcaseAreaTestingComponent as λ11 } from './lib/modules/showcase/showcase-area-testing.component';
export { SkyDocsShowcaseComponent as λ12 } from './lib/modules/showcase/showcase.component';
export { SkyDocsTableOfContentsPageComponent as λ6 } from './lib/modules/table-of-contents/table-of-contents-page.component';
export { SkyDocsTypeDefinitionComponent as λ8 } from './lib/modules/type-definition/type-definition.component';
