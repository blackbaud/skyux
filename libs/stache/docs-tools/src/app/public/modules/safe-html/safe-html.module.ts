import {
  NgModule
} from '@angular/core';

import { SkyIconModule } from '@skyux/indicators';
import { SkyDocsMarkdownModule } from '../markdown/markdown.module';
import { SkyDocsSafeHtmlComponent } from './safe-html.component';

@NgModule({
  declarations: [
    SkyDocsSafeHtmlComponent
  ],
  imports: [
    SkyIconModule,
    SkyDocsMarkdownModule
  ],
  exports: [
    SkyDocsSafeHtmlComponent
  ]
})
export class SkyDocsSafeHtmlModule { }
