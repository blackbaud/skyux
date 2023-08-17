import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { SkyDockComponent } from './dock.component';
import { SkyDockService } from './dock.service';

@NgModule({
  imports: [CommonModule],
  declarations: [SkyDockComponent],
  providers: [SkyDockService, SkyMutationObserverService],
})
export class SkyDockModule {}
