import { NgModule } from '@angular/core';

import { SkyDocsCodeSnippetWrapperComponent } from './code-snippet-wrapper.component';
import { SkyDocsCodeSnippetComponent } from './code-snippet.component';

/**
 * @internal
 */
@NgModule({
  imports: [SkyDocsCodeSnippetComponent, SkyDocsCodeSnippetWrapperComponent],
  exports: [SkyDocsCodeSnippetComponent, SkyDocsCodeSnippetWrapperComponent],
})
export class SkyDocsCodeSnippetModule {}
