import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageComponent } from './page.component';

/**
 * @docsId SkyPageModuleLegacy
 * @docsIncludeIds SkyPageComponentLegacy, SkyPageLayoutLegacy
 * @deprecated Use the SkyPageModule in `@skyux/pages` instead.
 */
@NgModule({
  declarations: [SkyPageComponent],
  imports: [CommonModule],
  exports: [SkyPageComponent],
})
export class SkyPageModule {}
