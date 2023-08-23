import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { SkyDockComponent } from './dock.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SkyDockComponent],
  providers: [SkyMutationObserverService],
})
export class SkyDockModule {}
