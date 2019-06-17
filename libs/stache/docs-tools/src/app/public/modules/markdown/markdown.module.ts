import {
  NgModule
} from '@angular/core';

import {
  SkyDocsMarkdownPipe
} from './markdown.pipe';

@NgModule({
  declarations: [
    SkyDocsMarkdownPipe
  ],
  exports: [
    SkyDocsMarkdownPipe
  ]
})
export class SkyDocsMarkdownModule { }
