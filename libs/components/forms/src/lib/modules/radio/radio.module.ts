import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIconModule } from '@skyux/indicators';

import { SkyRadioGroupComponent } from './radio-group.component';
import { SkyRadioLabelComponent } from './radio-label.component';
import { SkyRadioComponent } from './radio.component';

@NgModule({
  declarations: [
    SkyRadioComponent,
    SkyRadioGroupComponent,
    SkyRadioLabelComponent,
  ],
  imports: [CommonModule, FormsModule, SkyIconModule],
  exports: [SkyRadioComponent, SkyRadioGroupComponent, SkyRadioLabelComponent],
})
export class SkyRadioModule {}
