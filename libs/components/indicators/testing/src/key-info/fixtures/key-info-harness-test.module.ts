import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoHarnessTestComponent } from './key-info-harness-test.component';

@NgModule({
  declarations: [KeyInfoHarnessTestComponent],
  imports: [CommonModule, SkyKeyInfoModule],
  exports: [KeyInfoHarnessTestComponent],
})
export class KeyInfoHarnessTestModule {}
