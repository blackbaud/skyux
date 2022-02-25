import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyIconModule } from '../icon/icon.module';

import { SkyLabelComponent } from './label.component';

@NgModule({
  declarations: [SkyLabelComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [SkyLabelComponent],
})
export class SkyLabelModule {}
