import { NgModule } from '@angular/core';

import { SkyTableOfContentsPage } from './table-of-contents-page.component';
import { SkyTableOfContentsComponent } from './table-of-contents.component';

/**
 * @internal
 */
@NgModule({
  imports: [SkyTableOfContentsComponent, SkyTableOfContentsPage],
  exports: [SkyTableOfContentsPage],
})
export class SkyTableOfContentsModule {}
