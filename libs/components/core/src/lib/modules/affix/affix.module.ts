import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyAffixDirective } from './affix.directive';

/**
 * @docsIncludeIds SkyAffixDirective, SkyAffixService, SkyAffixer, SkyAffixConfig, SkyAffixAutoFitContext, SkyAffixHorizontalAlignment, SkyAffixOffset, SkyAffixOffsetChange, SkyAffixPlacement, SkyAffixPlacementChange, SkyAffixPosition, SkyAffixVerticalAlignment
 */
@NgModule({
  imports: [CommonModule],
  exports: [SkyAffixDirective],
  declarations: [SkyAffixDirective],
})
export class SkyAffixModule {}
