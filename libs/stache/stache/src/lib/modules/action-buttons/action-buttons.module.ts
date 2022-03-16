import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyActionButtonModule, SkyFluidGridModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { StacheNavModule } from '../nav/nav.module';

import { StacheActionButtonsComponent } from './action-buttons.component';

@NgModule({
  declarations: [StacheActionButtonsComponent],
  imports: [
    CommonModule,
    SkyActionButtonModule,
    SkyFluidGridModule,
    SkySearchModule,
    StacheNavModule,
  ],
  exports: [StacheActionButtonsComponent],
})
export class StacheActionButtonsModule {}
