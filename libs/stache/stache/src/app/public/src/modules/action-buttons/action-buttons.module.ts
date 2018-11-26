import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyActionButtonModule } from '@blackbaud/skyux/dist/modules/action-button';
import { SkySearchModule } from '@blackbaud/skyux/dist/modules/search';

import { StacheGridModule } from '../grid';
import { StacheActionButtonsComponent } from './action-buttons.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheActionButtonsComponent
  ],
  imports: [
    CommonModule,
    SkyActionButtonModule,
    SkySearchModule,
    StacheLinkModule,
    StacheGridModule
  ],
  exports: [
    StacheActionButtonsComponent
  ]
})
export class StacheActionButtonsModule { }
