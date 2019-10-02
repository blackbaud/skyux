import {
  NgModule
} from '@angular/core';

import {
  SkyDocsMarkdownModule
} from '../markdown/markdown.module';

import {
  SkyDocsSafeHtmlComponent
} from './safe-html.component';

@NgModule({
  declarations: [
    SkyDocsSafeHtmlComponent
  ],
  imports: [
    SkyDocsMarkdownModule
  ],
  exports: [
    SkyDocsSafeHtmlComponent
  ]
})
export class SkyDocsSafeHtmlModule { }
