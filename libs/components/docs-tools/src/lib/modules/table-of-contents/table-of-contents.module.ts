import { NgModule } from '@angular/core';

import { SkyTableOfContentsPageComponent } from './table-of-contents-page.component';
import { SkyTableOfContentsComponent } from './table-of-contents.component';

/**
 * @internal
 */
@NgModule({
  imports: [SkyTableOfContentsComponent, SkyTableOfContentsPageComponent],
  exports: [SkyTableOfContentsPageComponent],
})
export class SkyTableOfContentsModule {}
