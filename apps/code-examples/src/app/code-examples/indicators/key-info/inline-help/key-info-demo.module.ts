import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule, SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoDemoComponent } from './key-info-demo.component';

@NgModule({
  imports: [CommonModule, SkyKeyInfoModule, SkyHelpInlineModule],
  declarations: [KeyInfoDemoComponent],
  exports: [KeyInfoDemoComponent],
})
export class KeyInfoDemoModule {}
