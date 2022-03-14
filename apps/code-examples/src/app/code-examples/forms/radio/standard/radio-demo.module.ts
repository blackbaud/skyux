import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';

import { RadioDemoComponent } from './radio-demo.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SkyRadioModule],
  declarations: [RadioDemoComponent],
  exports: [RadioDemoComponent],
})
export class SkyRadioDemoModule {}
