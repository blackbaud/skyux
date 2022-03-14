import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIconModule } from '../icon/icon.module';

import { SkyLabelComponent } from './label.component';

@NgModule({
  declarations: [SkyLabelComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [SkyLabelComponent],
})
export class SkyLabelModule {}
