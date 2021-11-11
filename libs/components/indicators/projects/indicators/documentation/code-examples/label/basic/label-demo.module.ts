import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyLabelModule } from '@skyux/indicators';

import { LabelDemoComponent } from './label-demo.component';

@NgModule({
  imports: [CommonModule, SkyLabelModule],
  exports: [LabelDemoComponent],
  declarations: [LabelDemoComponent],
})
export class LabelDemoModule {}
