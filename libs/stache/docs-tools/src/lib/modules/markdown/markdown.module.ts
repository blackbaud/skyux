import { NgModule } from '@angular/core';

import { SkyDocsMarkdownPipe } from './markdown.pipe';

@NgModule({
  declarations: [SkyDocsMarkdownPipe],
  providers: [SkyDocsMarkdownPipe],
  exports: [SkyDocsMarkdownPipe],
})
export class SkyDocsMarkdownModule {}
