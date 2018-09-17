import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyLabelComponent } from './label.component';

@NgModule({
  declarations: [
    SkyLabelComponent
  ],
  imports: [CommonModule],
  exports: [
    SkyLabelComponent
  ]
})
export class SkyLabelModule { }
