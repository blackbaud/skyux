import { NgModule } from '@angular/core';
import { SkyTextHighlightDirective } from './text-highlight.directive';
import { MutationObserverService } from '../mutation/mutation-observer-service';

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
