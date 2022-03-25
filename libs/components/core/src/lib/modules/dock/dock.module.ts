import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MutationObserverService } from '../mutation/mutation-observer-service';

import { SkyDockComponent } from './dock.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SkyDockComponent],
  entryComponents: [SkyDockComponent],
  providers: [MutationObserverService],
})
export class SkyDockModule {}
