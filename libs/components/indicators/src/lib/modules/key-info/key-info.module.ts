import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';

import { SkyKeyInfoLabelComponent } from './key-info-label.component';
import { SkyKeyInfoValueComponent } from './key-info-value.component';
import { SkyKeyInfoComponent } from './key-info.component';

@NgModule({
  declarations: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
  imports: [CommonModule, SkyTrimModule],
  exports: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
})
export class SkyKeyInfoModule {}
