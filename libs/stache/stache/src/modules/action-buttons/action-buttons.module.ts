import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyModule } from '@blackbaud/skyux/dist/core';

import { StacheGridModule } from '../grid/grid.module';
import { StacheActionButtonsComponent } from './action-buttons.component';

@NgModule({
  declarations: [
    StacheActionButtonsComponent
  ],
  imports: [
    CommonModule,
    SkyModule,
    StacheGridModule
  ],
  exports: [
    StacheActionButtonsComponent
  ]
})
export class StacheActionButtonsModule { }
