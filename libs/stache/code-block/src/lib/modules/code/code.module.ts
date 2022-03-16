import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyCodeComponent } from './code.component';

@NgModule({
  declarations: [SkyCodeComponent],
  imports: [CommonModule],
  exports: [SkyCodeComponent],
})
export class SkyCodeModule {}
