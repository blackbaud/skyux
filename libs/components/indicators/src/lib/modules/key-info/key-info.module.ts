import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyKeyInfoLabelComponent } from './key-info-label.component';
import { SkyKeyInfoValueComponent } from './key-info-value.component';
import { SkyKeyInfoComponent } from './key-info.component';

@NgModule({
  declarations: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
  imports: [CommonModule, SkyTrimModule, SkyHelpInlineModule, SkyIdModule],
  exports: [
    SkyKeyInfoComponent,
    SkyKeyInfoLabelComponent,
    SkyKeyInfoValueComponent,
  ],
})
export class SkyKeyInfoModule {}
