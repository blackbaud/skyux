import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyModule } from '@blackbaud/skyux/dist/core';
import { StacheGridModule } from '../grid';
import { StacheActionButtonsComponent } from './action-buttons.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheActionButtonsComponent
  ],
  imports: [
    CommonModule,
    SkyModule,
    StacheGridModule,
    StacheLinkModule
  ],
  exports: [
    StacheActionButtonsComponent
  ]
})
export class StacheActionButtonsModule { }
