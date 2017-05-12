import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheIncludeComponent } from './includes.component';

@NgModule({
  declarations: [
    StacheIncludeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheIncludeComponent
  ]
})
export class StacheIncludeModule { }
