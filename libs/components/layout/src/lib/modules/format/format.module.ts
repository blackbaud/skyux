import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyFormatComponent } from './format.component';

@NgModule({
  declarations: [SkyFormatComponent],
  imports: [CommonModule],
  exports: [SkyFormatComponent],
})
export class SkyFormatModule {}
