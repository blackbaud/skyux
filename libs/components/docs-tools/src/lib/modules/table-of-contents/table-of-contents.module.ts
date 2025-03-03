import { NgModule } from '@angular/core';

import { SkyDocsTableOfContentsPageComponent } from './table-of-contents-page.component';
import { SkyDocsTableOfContentsComponent } from './table-of-contents.component';

/**
 * @internal
 */
@NgModule({
  imports: [
    SkyDocsTableOfContentsComponent,
    SkyDocsTableOfContentsPageComponent,
  ],
  exports: [SkyDocsTableOfContentsPageComponent],
})
export class SkyDocsTableOfContentsModule {}
