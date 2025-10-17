import { NgModule } from '@angular/core';

import { SkyKeyInfoLabelComponent } from './key-info-label.component';
import { SkyKeyInfoValueComponent } from './key-info-value.component';
import { SkyKeyInfoComponent } from './key-info.component';

@NgModule({
  imports: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
  exports: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
})
export class SkyKeyInfoModule {}
