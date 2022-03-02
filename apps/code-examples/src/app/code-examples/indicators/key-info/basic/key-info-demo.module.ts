import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoDemoComponent } from './key-info-demo.component';

@NgModule({
  imports: [CommonModule, SkyKeyInfoModule],
  declarations: [KeyInfoDemoComponent],
  exports: [KeyInfoDemoComponent],
})
export class KeyInfoDemoModule {}
