import { NgModule } from '@angular/core';
import { SkyTextHighlightDirective } from './text-highlight.directive';
import { MutationObserverService } from '@skyux/core';

@NgModule({
  declarations: [
    SkyTextHighlightDirective
  ],
  exports: [
    SkyTextHighlightDirective
  ],
  providers: [
    MutationObserverService
  ]
})
export class SkyTextHighlightModule { }
