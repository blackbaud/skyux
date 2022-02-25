import { NgModule } from '@angular/core';

import { MutationObserverService } from '@skyux/core';

import { SkyTextHighlightDirective } from './text-highlight.directive';

@NgModule({
  declarations: [SkyTextHighlightDirective],
  exports: [SkyTextHighlightDirective],
  providers: [MutationObserverService],
})
export class SkyTextHighlightModule {}
