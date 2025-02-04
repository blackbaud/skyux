import { NgModule } from '@angular/core';
import { SkyMutationObserverService } from '@skyux/core';

import { SkyTextHighlightDirective } from './text-highlight.directive';

@NgModule({
  imports: [SkyTextHighlightDirective],
  exports: [SkyTextHighlightDirective],
  providers: [SkyMutationObserverService],
})
export class SkyTextHighlightModule {}
